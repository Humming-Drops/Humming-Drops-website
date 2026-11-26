import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import {
  SubscriptionNotFoundError,
  SubscriptionTransitionError,
  cancelSubscription,
  confirmSubscription,
  pauseSubscription,
  resumeSubscription,
} from "@/lib/subscription-admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("subscriptions:manage"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return apiError("Application account not linked", 404);

  const { id } = await params;
  if (!isUuid(id)) return apiError("Invalid subscription id.", 400);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return apiError("Invalid request body", 400);
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
          return apiError("pauseStart and pauseEnd are required.", 400);
        }
        updated = await pauseSubscription(id, appUser.id, pauseStart, pauseEnd);
        break;
      default:
        return apiError("Unsupported action.", 400);
    }
    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    if (error instanceof SubscriptionNotFoundError) {
      return apiError(error.message, 404);
    }
    if (error instanceof SubscriptionTransitionError) {
      return apiError(error.message, 400);
    }
    console.error("[ADMIN SUBSCRIPTIONS ERROR]:", error);
    return apiError("Failed to update subscription.", 500);
  }
}
