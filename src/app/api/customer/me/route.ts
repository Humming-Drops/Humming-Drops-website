import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  deliveryAddresses,
  dietaryPreferences,
  profiles,
  userSubscriptions,
  users,
} from "@/lib/db/schema";

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
    .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.userId, user.id)))
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

export async function PATCH(request: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.type === "delivery_notes") {
    const addressId = typeof body.addressId === "string" ? body.addressId : null;
    const deliveryNotes = typeof body.deliveryNotes === "string" ? body.deliveryNotes.trim().slice(0, 300) : "";
    if (!addressId) return NextResponse.json({ error: "Address is required" }, { status: 400 });
    await db
      .update(deliveryAddresses)
      .set({ deliveryNotes, updatedAt: new Date() })
      .where(and(eq(deliveryAddresses.id, addressId), eq(deliveryAddresses.userId, user.id)));
    return NextResponse.json({ success: true });
  }

  if (body.type === "pause") {
    const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : null;
    if (!subscriptionId) return NextResponse.json({ error: "Subscription is required" }, { status: 400 });
    const pauseStart = typeof body.pauseStart === "string" && body.pauseStart ? body.pauseStart : null;
    const pauseEnd = typeof body.pauseEnd === "string" && body.pauseEnd ? body.pauseEnd : null;
    await db
      .update(userSubscriptions)
      .set({ pauseStart, pauseEnd, updatedAt: new Date() })
      .where(and(eq(userSubscriptions.id, subscriptionId), eq(userSubscriptions.userId, user.id)));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unsupported update" }, { status: 400 });
}
