import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode, OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { isSubscriptionActive, SubscriptionStatus } from "@/types/subscription";

/**
 * POST /api/subscriptions/lead
 *
 * Handles Assisted Registration & WhatsApp Lead Capture (Mode B).
 *
 * GUARDRAIL 1: Server-side configuration is authoritative.
 * GUARDRAIL 2: An assisted registration with 'pending_confirmation' status
 *               must NOT automatically be treated as an active subscription.
 */
export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();
    const body = await request.json();

    const { planId, customer, deliveryAddress, dietaryPreferences } = body;

    if (!planId || !customer?.phone || !customer?.fullName) {
      return NextResponse.json(
        { error: "Missing required fields: planId, customer.fullName, and customer.phone are required." },
        { status: 400 }
      );
    }

    // Generate unique reference code for customer tracking
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const leadReferenceCode = `HD-REG-${randomSuffix}`;

    // STRICT LIFECYCLE: Registration starts in 'pending_confirmation', NEVER 'confirmed_active'
    const initialStatus: SubscriptionStatus = "pending_confirmation";
    const hasActivePerks = isSubscriptionActive(initialStatus); // Evaluates to false!

    const prefilledWhatsAppText = `Hi Humming Drops team! I just submitted a subscription request (${leadReferenceCode}) for the ${planId.toUpperCase()} Plan. My name is ${customer.fullName}. Please confirm my morning delivery schedule.`;

    const whatsappRedirectUrl = OFFICIAL_CONTACT.whatsappUrl(prefilledWhatsAppText);

    return NextResponse.json({
      success: true,
      leadReferenceCode,
      status: initialStatus,
      hasActivePerks, // Explicitly false
      fulfillmentMode: authoritativeMode,
      whatsappRedirectUrl,
      contactPhone: OFFICIAL_CONTACT.phone,
      message: "Subscription registration received. Awaiting manual confirmation via WhatsApp/phone before activation.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error processing subscription registration." },
      { status: 500 }
    );
  }
}
