import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";
import { razorpayClient } from "@/lib/razorpay";
import { paymentRepository } from "@/lib/payment-storage";

/**
 * POST /api/payments/order
 *
 * Mode A: Production Razorpay Order Initialization.
 *
 * GUARDRAIL 1: Server-side price calculation. Never trust client amounts.
 * GUARDRAIL 2: Mode validation via server configuration.
 * GUARDRAIL 3: Circuit breaker & resilient order persistence.
 */
export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    if (authoritativeMode !== "online_gateway") {
      return NextResponse.json(
        {
          error: "Online payment gateway is currently disabled. Please use assisted registration.",
          mode: authoritativeMode,
        },
        { status: 400 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
    }

    const { planId, customer, deliveryAddress, leadReferenceCode } = (body || {}) as {
      planId?: PlanTier;
      customer?: { fullName?: string; phone?: string; email?: string };
      deliveryAddress?: { area?: string; pincode?: string };
      leadReferenceCode?: string;
    };

    if (!planId || !OFFICIAL_PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan identifier." }, { status: 400 });
    }

    // Server-authoritative pricing (Client-submitted price tampering is strictly ignored)
    const plan = OFFICIAL_PLANS[planId];
    const amountINR = plan.monthlyPriceINR;
    const amountSubunits = amountINR * 100; // Razorpay expects paise

    // Unique order receipt identifier
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const rzpOrder = await razorpayClient.createOrder({
      amountPaise: amountSubunits,
      currency: "INR",
      receipt,
      notes: {
        brand: "Humming Drops",
        planId,
        planName: plan.name,
        customerName: customer?.fullName || "Valued Subscriber",
        customerPhone: customer?.phone || "",
        customerEmail: customer?.email || "",
        pincode: deliveryAddress?.pincode || "",
        leadReferenceCode: leadReferenceCode || "",
      },
    });

    // Record order in persistence ledger
    await paymentRepository.createOrder({
      id: rzpOrder.id,
      planId,
      amountINR,
      amountPaise: amountSubunits,
      currency: "INR",
      receipt,
      status: "created",
      leadReferenceCode,
      notes: rzpOrder.notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amountINR,
      amountSubunits,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyPriceINR: plan.monthlyPriceINR,
      },
    });
  } catch (error: any) {
    console.error("[PAYMENTS ORDER ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize payment order." },
      { status: 500 }
    );
  }
}
