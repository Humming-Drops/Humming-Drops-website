import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";

/**
 * POST /api/payments/order
 *
 * Scaffolding for Mode A: Razorpay Order Creation (Phase 10).
 *
 * GUARDRAIL 1: Server-side price calculation. Never trust client amounts.
 * GUARDRAIL 2: Mode validation via server configuration.
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

    const body = await request.json();
    const { planId } = body as { planId?: PlanTier };

    if (!planId || !OFFICIAL_PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan identifier." }, { status: 400 });
    }

    // Server-authoritative pricing
    const plan = OFFICIAL_PLANS[planId];
    const amountINR = plan.monthlyPriceINR;
    const amountSubunits = amountINR * 100; // Razorpay expects paise

    return NextResponse.json({
      success: true,
      planId,
      amountINR,
      amountSubunits,
      currency: "INR",
      message: "Order endpoint scaffolded. Full Razorpay SDK integration will be wired in Phase 10.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initialize payment order." }, { status: 500 });
  }
}
