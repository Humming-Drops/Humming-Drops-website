import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { razorpayClient } from "@/lib/razorpay";
import { leadRepository } from "@/lib/lead-storage";
import { paymentRepository } from "@/lib/payment-storage";
import { canTransitionSubscription } from "@/lib/subscription-transitions";

/**
 * POST /api/payments/verify
 *
 * Mode A: Cryptographic HMAC-SHA256 Signature Verification for Razorpay checkout.
 *
 * GUARDRAIL 1: Server-only HMAC-SHA256 verification using crypto.timingSafeEqual to prevent timing attacks.
 * GUARDRAIL 2: Fail-closed security when RAZORPAY_KEY_SECRET is unconfigured.
 * GUARDRAIL 3: Subscription promotion to confirmed_active with perks activated, but only when (a) the
 *              verified order was actually created for this leadReferenceCode (prevents activating an
 *              unrelated/unpaid subscription with a signature proven valid for a different order), and
 *              (b) the subscription's current status legally permits the transition (RR-007).
 */
export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    if (authoritativeMode !== "online_gateway") {
      return NextResponse.json(
        { error: "Online payment gateway is not active. Please use assisted registration." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, leadReferenceCode } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing cryptographic signature tokens." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("[SECURITY] RAZORPAY_KEY_SECRET is unconfigured on the server. Failing closed.");
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification unavailable: Gateway secret not configured.",
        },
        { status: 500 }
      );
    }

    // Constant-time timing-safe HMAC-SHA256 verification
    const isValid = razorpayClient.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      console.error(`[SECURITY ALERT] Invalid payment signature for Order ${razorpayOrderId}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid cryptographic signature. Payment verification failed.",
        },
        { status: 400 }
      );
    }

    // Record verified transaction in ledger
    const existingOrder = await paymentRepository.getOrder(razorpayOrderId);

    // Transition subscriber lead to confirmed_active, but only if this
    // order was actually created for this leadReferenceCode. Without this
    // check, a valid signature for a cheap/unrelated order could be
    // replayed with a different leadReferenceCode to activate it instead.
    if (leadReferenceCode) {
      if (!existingOrder || existingOrder.leadReferenceCode !== leadReferenceCode) {
        console.error(
          `[SECURITY ALERT] leadReferenceCode "${leadReferenceCode}" does not match the lead reference recorded for order ${razorpayOrderId}. Refusing to activate.`
        );
      } else {
        const existingLead = await leadRepository.getLeadByReference(leadReferenceCode);
        if (existingLead && canTransitionSubscription(existingLead.status, "confirmed_active")) {
          existingLead.status = "confirmed_active";
          existingLead.hasActivePerks = true;
          existingLead.updatedAt = new Date().toISOString();
          await leadRepository.updateLead(existingLead);
        } else if (existingLead) {
          console.warn(
            `[PAYMENTS VERIFY] Ignoring illegal transition for lead ${leadReferenceCode}: "${existingLead.status}" -> "confirmed_active".`
          );
        }
      }
    }

    await paymentRepository.recordTransaction({
      id: razorpayPaymentId,
      orderId: razorpayOrderId,
      amountPaise: existingOrder ? existingOrder.amountPaise : 0,
      status: "captured",
      signature: razorpaySignature,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      verified: true,
      status: "confirmed_active",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      message: "Payment signature cryptographically verified and subscription activated.",
    });
  } catch (error: any) {
    console.error("[PAYMENTS VERIFY ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal error verifying payment signature." },
      { status: 500 }
    );
  }
}
