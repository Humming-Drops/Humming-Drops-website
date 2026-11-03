import { NextResponse } from "next/server";
import { razorpayClient } from "@/lib/razorpay";
import { paymentRepository } from "@/lib/payment-storage";
import { leadRepository } from "@/lib/lead-storage";

/**
 * POST /api/payments/webhook
 *
 * Production Razorpay Webhook Asynchronous Reconciliation & Deduplication.
 *
 * GUARDRAIL 1: Validates `x-razorpay-signature` against RAZORPAY_WEBHOOK_SECRET using crypto.timingSafeEqual.
 * GUARDRAIL 2: Enforces raw stream consumption (request.text()) before JSON parsing.
 * GUARDRAIL 3: At-least-once delivery event deduplication using paymentRepository idempotency ledger.
 * GUARDRAIL 4: Perishable food & MedCity clinical perk reconciliation on refund events.
 */
export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[SECURITY] RAZORPAY_WEBHOOK_SECRET is unconfigured. Failing closed.");
      return NextResponse.json(
        { error: "Webhook endpoint not configured: secret missing." },
        { status: 500 }
      );
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature header." }, { status: 400 });
    }

    // 1. Mandatory Raw Stream Consumption (prevents whitespace/normalization HMAC mismatch)
    const rawBody = await request.text();

    // 2. Constant-time timing-safe HMAC-SHA256 verification
    const isValid = razorpayClient.verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error("[SECURITY] Webhook signature verification failed. Dropping unauthenticated request.");
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    // 3. Safe JSON parsing only after signature verification
    let eventPayload: any;
    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
    }

    // 4. Resolve Event ID for Idempotency Deduplication
    const eventId =
      request.headers.get("x-razorpay-event-id") ||
      eventPayload?.id ||
      eventPayload?.event_id ||
      (eventPayload?.payload?.payment?.entity?.id
        ? `${eventPayload.event}_${eventPayload.payload.payment.entity.id}`
        : null) ||
      `evt_${Date.now()}`;

    // Deduplication check: if already processed, return 200 without reprocessing
    if (await paymentRepository.hasWebhookEvent(eventId)) {
      return NextResponse.json(
        { received: true, note: "duplicate_ignored" },
        { status: 200 }
      );
    }

    // Record event in idempotency ledger
    await paymentRepository.recordWebhookEvent({
      id: eventId,
      provider: "razorpay",
      eventType: eventPayload.event || "unknown",
      status: "processed",
      payload: eventPayload,
      processedAt: new Date().toISOString(),
    });

    // 5. Asynchronous Event Routing & Lifecycle Reconciliation
    switch (eventPayload.event) {
      case "order.paid":
      case "payment.captured": {
        const paymentEntity = eventPayload?.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;
        const notes = paymentEntity?.notes || {};
        const leadRef = notes.leadReferenceCode;

        if (leadRef) {
          const lead = await leadRepository.getLeadByReference(leadRef);
          if (lead) {
            lead.status = "confirmed_active";
            lead.hasActivePerks = true;
            lead.updatedAt = new Date().toISOString();
            await leadRepository.updateLead(lead);
          }
        }

        if (paymentId && orderId) {
          await paymentRepository.recordTransaction({
            id: paymentId,
            orderId,
            amountPaise: paymentEntity.amount || 0,
            status: "captured",
            verifiedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = eventPayload?.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;

        if (paymentId && orderId) {
          await paymentRepository.recordTransaction({
            id: paymentId,
            orderId,
            amountPaise: paymentEntity.amount || 0,
            status: "failed",
            createdAt: new Date().toISOString(),
          });
        }
        break;
      }

      case "refund.processed": {
        const refundEntity = eventPayload?.payload?.refund?.entity;
        const paymentId = refundEntity?.payment_id;
        const notes = refundEntity?.notes || {};
        const leadRef = notes.leadReferenceCode;

        // Revoke subscription and MedCity health perks
        if (leadRef) {
          const lead = await leadRepository.getLeadByReference(leadRef);
          if (lead) {
            lead.status = "cancelled";
            lead.hasActivePerks = false;
            lead.updatedAt = new Date().toISOString();
            await leadRepository.updateLead(lead);
          }
        }

        if (paymentId) {
          const tx = await paymentRepository.getTransaction(paymentId);
          if (tx) {
            tx.status = "refunded";
            await paymentRepository.recordTransaction(tx);
          }
        }
        break;
      }

      default:
        console.log(`[PAYMENTS WEBHOOK] Unhandled event received: ${eventPayload.event}`);
    }

    return NextResponse.json({
      received: true,
      event: eventPayload.event,
      processedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[PAYMENTS WEBHOOK ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing error." },
      { status: 500 }
    );
  }
}
