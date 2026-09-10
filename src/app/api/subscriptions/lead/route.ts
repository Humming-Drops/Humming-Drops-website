import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode, OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";
import { isSubscriptionActive, SubscriptionStatus, DietaryType } from "@/types/subscription";
import { leadRepository } from "@/lib/lead-storage";

// Validation & Normalization Helpers
function normalizePhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  // Strip whitespace, hyphens, plus, parenthesis
  const cleaned = raw.replace(/[\s\-\(\)\+]/g, "");
  // Strip leading international country code (+91 or 91) or trunk 0
  return cleaned.replace(/^91/, "").replace(/^0/, "");
}

function isValidIndianPhone(phone: string): boolean {
  // 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

function sanitizeString(val: unknown, maxLength: number): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLength);
}

/**
 * Generate collision-resistant lead reference code
 * Format: HD-REG-YYYY-XXXXX
 */
async function generateUniqueReference(): Promise<string> {
  const year = new Date().getFullYear();
  let attempts = 0;
  while (attempts < 10) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const code = `HD-REG-${year}-${randomSuffix}`;
    const existing = await leadRepository.getLeadByReference(code);
    if (!existing) {
      return code;
    }
    attempts++;
  }
  return `HD-REG-${year}-${Date.now().toString().slice(-5)}`;
}

/**
 * POST /api/subscriptions/lead
 *
 * Handles Assisted Registration & WhatsApp Lead Capture (Mode B).
 *
 * STRICT GUARDRAILS:
 * 1. Server configuration is authoritative (getServerAuthoritativeCheckoutMode).
 * 2. Subscription price is NEVER trusted from client (derived from OFFICIAL_PLANS).
 * 3. Lifecycle invariant: status is strictly 'pending_confirmation' with hasActivePerks = false.
 * 4. Sensitive customer inputs validated and sanitized before storage.
 */
export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body in request payload." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request payload must be a JSON object." },
        { status: 400 }
      );
    }

    const { planId, customer, deliveryAddress, dietaryPreferences } = body;

    // 1. Plan Validation (Canonical Pricing Guardrail)
    if (!planId || typeof planId !== "string" || !(planId in OFFICIAL_PLANS)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing plan tier. Must be 'standard' or 'premium'.",
          field: "planId",
        },
        { status: 400 }
      );
    }

    const canonicalPlan = OFFICIAL_PLANS[planId as PlanTier];

    // 2. Customer Contact Validation
    if (!customer || typeof customer !== "object") {
      return NextResponse.json(
        { success: false, error: "Customer information object is required.", field: "customer" },
        { status: 400 }
      );
    }

    const fullName = sanitizeString(customer.fullName, 100);
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name is required (minimum 2 characters).",
          field: "customer.fullName",
        },
        { status: 400 }
      );
    }

    const rawPhone = customer.phone;
    const normalizedPhone = normalizePhone(rawPhone);
    if (!normalizedPhone || !isValidIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number.",
          field: "customer.phone",
        },
        { status: 400 }
      );
    }

    const email = sanitizeString(customer.email, 120).toLowerCase();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
          field: "customer.email",
        },
        { status: 400 }
      );
    }

    // 3. Delivery Address Validation
    if (!deliveryAddress || typeof deliveryAddress !== "object") {
      return NextResponse.json(
        { success: false, error: "Delivery address is required.", field: "deliveryAddress" },
        { status: 400 }
      );
    }

    const flatNo = sanitizeString(deliveryAddress.flatNo, 50);
    const buildingName = sanitizeString(deliveryAddress.buildingName, 100);
    const streetAddress = sanitizeString(deliveryAddress.streetAddress, 150);
    const area = sanitizeString(deliveryAddress.area, 100);
    const pincode = sanitizeString(deliveryAddress.pincode, 10);
    const deliveryNotes = sanitizeString(deliveryAddress.deliveryNotes, 300);

    if (!flatNo) {
      return NextResponse.json(
        { success: false, error: "Flat / Apartment number is required.", field: "deliveryAddress.flatNo" },
        { status: 400 }
      );
    }
    if (!buildingName) {
      return NextResponse.json(
        { success: false, error: "Building or society name is required.", field: "deliveryAddress.buildingName" },
        { status: 400 }
      );
    }
    if (!streetAddress) {
      return NextResponse.json(
        { success: false, error: "Street address is required.", field: "deliveryAddress.streetAddress" },
        { status: 400 }
      );
    }
    if (!area) {
      return NextResponse.json(
        { success: false, error: "Area / Locality in Bangalore is required.", field: "deliveryAddress.area" },
        { status: 400 }
      );
    }
    if (!pincode || !isValidPincode(pincode)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 6-digit Indian postal code.", field: "deliveryAddress.pincode" },
        { status: 400 }
      );
    }

    // 4. Dietary Preferences Validation & Normalization
    const rawDietType = dietaryPreferences?.dietaryType;
    const validDietTypes: DietaryType[] = ["standard", "vegan", "pure_fruit"];
    const dietaryType: DietaryType = validDietTypes.includes(rawDietType) ? rawDietType : "standard";

    const rawAllergies = Array.isArray(dietaryPreferences?.allergies)
      ? dietaryPreferences.allergies
      : [];
    const allergies = rawAllergies
      .slice(0, 10)
      .map((a: unknown) => sanitizeString(a, 50))
      .filter(Boolean);

    const dietaryNotes = sanitizeString(dietaryPreferences?.notes, 300);

    // 5. Generate Unique Reference Code
    const leadReferenceCode = await generateUniqueReference();

    // 6. Strict Lifecycle Invariant:
    // Registration starts in 'pending_confirmation', NEVER 'confirmed_active'
    const initialStatus: SubscriptionStatus = "pending_confirmation";
    const hasActivePerks = isSubscriptionActive(initialStatus); // STRICTLY false

    // 7. Persist to Repository
    const persistedRecord = await leadRepository.createLead({
      leadReferenceCode,
      planId: canonicalPlan.id,
      planName: canonicalPlan.name,
      monthlyPriceINR: canonicalPlan.monthlyPriceINR, // Server authoritative pricing
      customer: {
        fullName,
        phone: normalizedPhone,
        email,
      },
      deliveryAddress: {
        flatNo,
        buildingName,
        streetAddress,
        area,
        city: "Bangalore",
        pincode,
        deliveryNotes: deliveryNotes || undefined,
      },
      dietaryPreferences: {
        dietaryType,
        allergies,
        notes: dietaryNotes || undefined,
      },
      fulfillmentMode: authoritativeMode,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    // 8. Construct Verified WhatsApp Handoff
    const prefilledWhatsAppText = `Hi Humming Drops Bangalore team! I just submitted a breakfast box subscription request (${leadReferenceCode}) for the ${canonicalPlan.name} Plan (₹${canonicalPlan.monthlyPriceINR}/mo). My name is ${fullName} (${normalizedPhone}). Delivery location: ${buildingName}, ${area}. Please confirm my morning schedule.`;

    const whatsappRedirectUrl = OFFICIAL_CONTACT.whatsappUrl(prefilledWhatsAppText);

    // 9. Return Structured Success Contract
    return NextResponse.json(
      {
        success: true,
        leadReferenceCode,
        status: initialStatus,
        hasActivePerks, // Explicitly false
        plan: {
          id: canonicalPlan.id,
          name: canonicalPlan.name,
          monthlyPriceINR: canonicalPlan.monthlyPriceINR,
        },
        customer: {
          fullName,
          phone: normalizedPhone,
          email,
        },
        deliveryAddress: {
          flatNo,
          buildingName,
          streetAddress,
          area,
          city: "Bangalore",
          pincode,
          deliveryNotes: deliveryNotes || undefined,
        },
        dietaryPreferences: {
          dietaryType,
          allergies,
          notes: dietaryNotes || undefined,
        },
        fulfillmentMode: authoritativeMode,
        whatsappRedirectUrl,
        officialContact: {
          phone: OFFICIAL_CONTACT.phone,
          email: OFFICIAL_CONTACT.email,
          kitchenLocation: OFFICIAL_CONTACT.kitchenLocation,
        },
        message:
          "Subscription registration received. Awaiting manual confirmation via WhatsApp/phone before activation.",
        createdAt: persistedRecord.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing subscription lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error processing subscription registration. Please try again or reach out on WhatsApp.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscriptions/lead?ref=HD-REG-...
 * Quick lookup helper for verifying persisted leads during evaluation
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      // Return total count and recent leads for audit
      const all = await leadRepository.getAllLeads();
      return NextResponse.json({
        total: all.length,
        leads: all.map((l) => ({
          leadReferenceCode: l.leadReferenceCode,
          planId: l.planId,
          planName: l.planName,
          customerName: l.customer.fullName,
          area: l.deliveryAddress.area,
          status: l.status,
          createdAt: l.createdAt,
        })),
      });
    }

    const lead = await leadRepository.getLeadByReference(ref);
    if (!lead) {
      return NextResponse.json({ error: "Lead reference not found." }, { status: 404 });
    }

    return NextResponse.json({
      leadReferenceCode: lead.leadReferenceCode,
      planId: lead.planId,
      planName: lead.planName,
      monthlyPriceINR: lead.monthlyPriceINR,
      status: lead.status,
      hasActivePerks: lead.hasActivePerks,
      customer: lead.customer,
      deliveryAddress: lead.deliveryAddress,
      dietaryPreferences: lead.dietaryPreferences,
      createdAt: lead.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve lead record." }, { status: 500 });
  }
}
