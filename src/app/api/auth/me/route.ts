import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { OPEN_SUBSCRIPTION_STATUSES } from "@/lib/lead-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentUser();

  // Session probe: logged-out is a valid answer (200 + authenticated:false), not an error.
  // The client (src/lib/auth/client.tsx) relies on this to avoid a 401 on every page load.
  if (!current) {
    return NextResponse.json({
      success: true,
      authenticated: false,
      user: null,
    });
  }

  const { user, profile, session } = current;

  // Whether the account already has a pending / active / paused subscription.
  // Used only to decide which header call-to-action to show; never for authorization.
  let hasOpenSubscription = false;
  try {
    const [open] = await db
      .select({ id: userSubscriptions.id })
      .from(userSubscriptions)
      .where(and(eq(userSubscriptions.userId, user.id), inArray(userSubscriptions.status, [...OPEN_SUBSCRIPTION_STATUSES])))
      .limit(1);
    hasOpenSubscription = Boolean(open);
  } catch {
    hasOpenSubscription = false;
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: profile?.fullName || session.fullName || user.email,
      phone: user.phone || profile?.phone || null,
      role: user.role,
      isActive: user.isActive,
      hasOpenSubscription,
    },
    profile,
  });
}
