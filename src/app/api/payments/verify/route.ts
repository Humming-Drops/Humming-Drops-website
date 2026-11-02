import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { razorpayClient } from "@/lib/razorpay";
import { leadRepository } from "@/lib/lead-storage";
import { paymentRepository } from "@/lib/payment-storage";

/**
 * POST /api/payments/verify
 *
 * Mode A: Cryptographic HMAC-SHA256 Signature Verification for Razorpay checkout.
 *
 * GUARDRAIL 1: Server-only HMAC-SHA256 verification using crypto.timingSafeEqual to prevent timing attacks.
 * GUARDRAIL 2: Fail-closed security when RAZORPAY_KEY_SECRET is unconfigured.
 * GUARDRAIL 3: Subscription promotion to confirmed_active with perks activated.
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

    // Transition subscriber lead to confirmed_active if reference is present
    if (leadReferenceCode) {
      const existingLead = await leadRepository.getLeadByReference(leadReferenceCode);
      if (existingLead) {
        existingLead.status = "confirmed_active";
        existingLead.hasActivePerks = true;
        existingLead.updatedAt = new Date().toISOString();
        await leadRepository.updateLead(existingLead);
      }
    }

    // Record verified transaction in ledger
    const existingOrder = await paymentRepository.getOrder(razorpayOrderId);
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
