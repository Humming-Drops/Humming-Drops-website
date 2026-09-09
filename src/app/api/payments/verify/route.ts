import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";

/**
 * POST /api/payments/verify
 *
 * Scaffolding for Mode A: Cryptographic Signature Verification (Phase 10).
 *
 * GUARDRAIL: Server-only HMAC-SHA256 signature verification.
 */
export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    if (authoritativeMode !== "online_gateway") {
      return NextResponse.json(
        { error: "Online payment gateway is not active." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing cryptographic signature tokens." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Signature verification endpoint scaffolded. Cryptographic verification with server secret will be activated in Phase 10.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
