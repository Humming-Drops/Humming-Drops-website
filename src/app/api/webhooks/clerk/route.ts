import { NextResponse } from "next/server";
import { verifyClerkWebhookSignature, type ClerkUserEventData } from "@/lib/clerk-webhook";
import {
  isClerkEventProcessed,
  recordClerkEvent,
  reconcileClerkUserDeleted,
  reconcileClerkUserUpsert,
} from "@/lib/clerk-reconciliation";

/**
 * POST /api/webhooks/clerk
 *
 * Reconciles Clerk identity lifecycle events (user.created, user.updated,
 * user.deleted) with the PostgreSQL `users` table.
 *
 * GUARDRAIL 1: Fail closed when CLERK_WEBHOOK_SIGNING_SECRET is unset.
 * GUARDRAIL 2: Verify the Svix signature (HMAC-SHA256, timing-safe) over
 *              the raw request body before parsing JSON.
 * GUARDRAIL 3: Idempotent by svix-id; duplicate deliveries are ack'd
 *              without reprocessing. The event is marked processed only
 *              after reconciliation succeeds, so a failed attempt is
 *              naturally retried by Clerk rather than silently dropped.
 */
export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    console.error("[SECURITY] CLERK_WEBHOOK_SIGNING_SECRET is unconfigured. Failing closed.");
    return NextResponse.json({ error: "Webhook endpoint not configured: secret missing." }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix signature headers." }, { status: 400 });
  }

  const payload = await request.text();

  const isValid = verifyClerkWebhookSignature({ payload, svixId, svixTimestamp, svixSignature, secret });
  if (!isValid) {
    console.error("[SECURITY] Clerk webhook signature verification failed. Dropping unauthenticated request.");
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: { type?: string; data?: ClerkUserEventData };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
  }

  if (await isClerkEventProcessed(svixId)) {
    return NextResponse.json({ received: true, note: "duplicate_ignored" }, { status: 200 });
  }

  if (!event.data) {
    return NextResponse.json({ error: "Missing event data." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await reconcileClerkUserUpsert(event.data);
        break;
      case "user.deleted":
        await reconcileClerkUserDeleted(event.data);
        break;
      default:
        console.log(`[CLERK WEBHOOK] Unhandled event type: ${event.type}`);
    }

    await recordClerkEvent(svixId, event.type || "unknown");
    return NextResponse.json({ received: true, event: event.type });
  } catch (error) {
    console.error("[CLERK WEBHOOK ERROR]:", error);
    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
