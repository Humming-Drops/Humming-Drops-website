import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  administrativeAuditLogs,
  deliveryAddresses,
  dietaryPreferences,
  profiles,
  userSubscriptions,
  users,
} from "@/lib/db/schema";
import { sanitizeString, isValidPincode, normalizePhone, isValidIndianPhone } from "@/lib/sanitization";
import { validatePauseRange } from "@/lib/subscription-admin";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const subscriptions = await db
    .select({
      subscription: userSubscriptions,
      address: deliveryAddresses,
      dietary: dietaryPreferences,
    })
    .from(userSubscriptions)
    .leftJoin(deliveryAddresses, eq(deliveryAddresses.subscriptionId, userSubscriptions.id))
    .leftJoin(dietaryPreferences, eq(dietaryPreferences.subscriptionId, userSubscriptions.id))
    .where(eq(userSubscriptions.userId, user.id))
    .orderBy(desc(userSubscriptions.createdAt));

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile,
    },
    subscriptions,
  });
}

async function logCustomerAction(userId: string, action: string, resourceType: string, resourceId: string) {
  await db.insert(administrativeAuditLogs).values({
    actorUserId: userId,
    action,
    resourceType,
    resourceId,
    metadata: null,
  });
}

export async function PATCH(request: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.type === "profile") {
    const fullName = sanitizeString(body.fullName, 100);
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Full name must be at least 2 characters." }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(body.phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);

    // Upsert: onboarding creates the first row (no profile exists yet
    // for a brand-new Clerk sign-up); later edits update it in place.
    const [savedProfile] = existing
      ? await db
          .update(profiles)
          .set({ fullName, phone: normalizedPhone, updatedAt: new Date() })
          .where(eq(profiles.userId, user.id))
          .returning()
      : await db
          .insert(profiles)
          .values({ userId: user.id, fullName, phone: normalizedPhone, email: user.email })
          .returning();

    await db.update(users).set({ phone: normalizedPhone, updatedAt: new Date() }).where(eq(users.id, user.id));

    await logCustomerAction(
      user.id,
      existing ? "customer.profile_updated" : "customer.profile_created",
      "profile",
      savedProfile.id
    );
    return NextResponse.json({ success: true, profile: savedProfile });
  }

  if (body.type === "address") {
    const addressId = typeof body.addressId === "string" ? body.addressId : null;
    if (!addressId) return NextResponse.json({ error: "Address is required." }, { status: 400 });

    const flatNo = sanitizeString(body.flatNo, 50);
    const buildingName = sanitizeString(body.buildingName, 100);
    const streetAddress = sanitizeString(body.streetAddress, 150);
    const area = sanitizeString(body.area, 100);
    const pincode = sanitizeString(body.pincode, 10);
    const deliveryNotes = sanitizeString(body.deliveryNotes, 300);

    if (!flatNo || !buildingName || !streetAddress || !area) {
      return NextResponse.json(
        { error: "Flat/apartment, building, street, and area are all required." },
        { status: 400 }
      );
    }
    if (!isValidPincode(pincode)) {
      return NextResponse.json({ error: "Please provide a valid 6-digit postal code." }, { status: 400 });
    }

    // Explicit ownership check first: a WHERE clause that silently matches
    // zero rows (e.g. an address id belonging to a different account) must
    // be reported, not reported back as a false "success".
    const [existing] = await db
      .select({ id: deliveryAddresses.id })
      .from(deliveryAddresses)
      .where(and(eq(deliveryAddresses.id, addressId), eq(deliveryAddresses.userId, user.id)))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Address not found on this account." }, { status: 404 });
    }

    const updated = await db
      .update(deliveryAddresses)
      .set({
        flatNo,
        buildingName,
        streetAddress,
        area,
        pincode,
        deliveryNotes: deliveryNotes || undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(deliveryAddresses.id, addressId), eq(deliveryAddresses.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Address update affected no rows." }, { status: 404 });
    }

    await logCustomerAction(user.id, "customer.address_updated", "delivery_address", addressId);
    return NextResponse.json({ success: true, address: updated[0] });
  }

  if (body.type === "delivery_notes") {
    const addressId = typeof body.addressId === "string" ? body.addressId : null;
    if (!addressId) return NextResponse.json({ error: "Address is required." }, { status: 400 });
    const deliveryNotes = sanitizeString(body.deliveryNotes, 300);

    const updated = await db
      .update(deliveryAddresses)
      .set({ deliveryNotes: deliveryNotes || undefined, updatedAt: new Date() })
      .where(and(eq(deliveryAddresses.id, addressId), eq(deliveryAddresses.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Address not found on this account." }, { status: 404 });
    }

    await logCustomerAction(user.id, "customer.delivery_notes_updated", "delivery_address", addressId);
    return NextResponse.json({ success: true });
  }

  if (body.type === "pause") {
    const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : null;
    if (!subscriptionId) return NextResponse.json({ error: "Subscription is required." }, { status: 400 });

    const rawStart = typeof body.pauseStart === "string" ? body.pauseStart : "";
    const rawEnd = typeof body.pauseEnd === "string" ? body.pauseEnd : "";
    const isClearing = !rawStart && !rawEnd;

    if (!isClearing) {
      const rangeError = validatePauseRange(rawStart, rawEnd);
      if (rangeError) return NextResponse.json({ error: rangeError }, { status: 400 });
    }

    // Explicit ownership + status check: this self-service vacation-date
    // field is distinct from the admin-level "paused" lifecycle status
    // (RR-003) and does not revoke perks, but it must only be settable on
    // a subscription that is actually active and belongs to this account.
    const [existing] = await db
      .select({ id: userSubscriptions.id, status: userSubscriptions.status })
      .from(userSubscriptions)
      .where(and(eq(userSubscriptions.id, subscriptionId), eq(userSubscriptions.userId, user.id)))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Subscription not found on this account." }, { status: 404 });
    }
    if (existing.status !== "confirmed_active") {
      return NextResponse.json(
        { error: `Vacation dates cannot be set while the subscription is "${existing.status}".` },
        { status: 400 }
      );
    }

    const updated = await db
      .update(userSubscriptions)
      .set({
        pauseStart: isClearing ? null : rawStart,
        pauseEnd: isClearing ? null : rawEnd,
        updatedAt: new Date(),
      })
      .where(and(eq(userSubscriptions.id, subscriptionId), eq(userSubscriptions.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Subscription update affected no rows." }, { status: 404 });
    }

    await logCustomerAction(
      user.id,
      isClearing ? "customer.vacation_dates_cleared" : "customer.vacation_dates_set",
      "user_subscription",
      subscriptionId
    );
    return NextResponse.json({ success: true, subscription: updated[0] });
  }

  return NextResponse.json({ error: "Unsupported update" }, { status: 400 });
}
