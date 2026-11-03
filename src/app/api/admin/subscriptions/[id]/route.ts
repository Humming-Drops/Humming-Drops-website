import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAppUserByClerkId, hasPermission } from "@/lib/clerk-auth";
import {
  SubscriptionNotFoundError,
  SubscriptionTransitionError,
  cancelSubscription,
  confirmSubscription,
  pauseSubscription,
  resumeSubscription,
} from "@/lib/subscription-admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("subscriptions:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserByClerkId(clerkUserId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { action, pauseStart, pauseEnd } = body as {
    action?: string;
    pauseStart?: string;
    pauseEnd?: string;
  };

  try {
    let updated;
    switch (action) {
      case "confirm":
        updated = await confirmSubscription(id, appUser.id);
        break;
      case "cancel":
        updated = await cancelSubscription(id, appUser.id);
        break;
      case "resume":
        updated = await resumeSubscription(id, appUser.id);
        break;
      case "pause":
        if (!pauseStart || !pauseEnd) {
          return NextResponse.json({ error: "pauseStart and pauseEnd are required." }, { status: 400 });
        }
        updated = await pauseSubscription(id, appUser.id, pauseStart, pauseEnd);
        break;
      default:
        return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }
    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    if (error instanceof SubscriptionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof SubscriptionTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[ADMIN SUBSCRIPTIONS ERROR]:", error);
    return NextResponse.json({ error: "Failed to update subscription." }, { status: 500 });
  }
}
