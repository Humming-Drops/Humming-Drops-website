import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  isSubscriptionActive,
  isPendingConfirmation,
} from "../../src/types/subscription";
import type { SubscriptionStatus } from "../../src/types/subscription";
import {
  canTransitionSubscription,
  isValidInitialLeadStatus,
  hasActivePerks,
  VALID_SUBSCRIPTION_TRANSITIONS,
} from "../../src/lib/subscription-transitions";
import { JsonFileLeadRepository } from "../../src/lib/lead-storage";

describe("Subscription Lifecycle Invariants & Access Control", () => {
  it("enforces that only 'confirmed_active' subscriptions are active", () => {
    expect(isSubscriptionActive("confirmed_active")).toBe(true);
    expect(isSubscriptionActive("pending_confirmation")).toBe(false);
    expect(isSubscriptionActive("registration_submitted")).toBe(false);
    expect(isSubscriptionActive("paused")).toBe(false);
    expect(isSubscriptionActive("cancelled")).toBe(false);
    expect(isSubscriptionActive("expired")).toBe(false);
  });

  it("correctly identifies pending confirmation states", () => {
    expect(isPendingConfirmation("pending_confirmation")).toBe(true);
    expect(isPendingConfirmation("registration_submitted")).toBe(true);
    expect(isPendingConfirmation("confirmed_active")).toBe(false);
    expect(isPendingConfirmation("paused")).toBe(false);
    expect(isPendingConfirmation("cancelled")).toBe(false);
  });

  it("strictly denies active member perks to pending or unconfirmed leads", () => {
    // Guardrail: Assisted WhatsApp registrations with pending_confirmation status
    // must NEVER receive active subscriber perks (daily delivery, doctor consults, lab discounts).
    expect(hasActivePerks("registration_submitted")).toBe(false);
    expect(hasActivePerks("pending_confirmation")).toBe(false);
    expect(hasActivePerks("paused")).toBe(false);
    expect(hasActivePerks("cancelled")).toBe(false);
    expect(hasActivePerks("expired")).toBe(false);

    // Only active subscribers receive active perks
    expect(hasActivePerks("confirmed_active")).toBe(true);
  });

  it("enforces valid initial lead status invariant", () => {
    expect(isValidInitialLeadStatus("pending_confirmation")).toBe(true);
    expect(isValidInitialLeadStatus("registration_submitted")).toBe(true);

    // Attempting to initialize directly to confirmed_active is invalid
    expect(isValidInitialLeadStatus("confirmed_active")).toBe(false);
    expect(isValidInitialLeadStatus("paused")).toBe(false);
    expect(isValidInitialLeadStatus("cancelled")).toBe(false);
    expect(isValidInitialLeadStatus(null)).toBe(false);
    expect(isValidInitialLeadStatus(undefined)).toBe(false);
  });
});

describe("Finite State Machine Transitions", () => {
  it("allows valid forward lifecycle progression", () => {
    // registration_submitted -> pending_confirmation
    expect(canTransitionSubscription("registration_submitted", "pending_confirmation")).toBe(true);

    // pending_confirmation -> confirmed_active (admin verification or payment confirmation)
    expect(canTransitionSubscription("pending_confirmation", "confirmed_active")).toBe(true);

    // confirmed_active -> paused (delivery pause)
    expect(canTransitionSubscription("confirmed_active", "paused")).toBe(true);

    // paused -> confirmed_active (resume delivery)
    expect(canTransitionSubscription("paused", "confirmed_active")).toBe(true);

    // confirmed_active -> cancelled
    expect(canTransitionSubscription("confirmed_active", "cancelled")).toBe(true);

    // confirmed_active -> expired (end of billing period)
    expect(canTransitionSubscription("confirmed_active", "expired")).toBe(true);
  });

  it("permits idempotent transitions to the same state", () => {
    const allStatuses: SubscriptionStatus[] = [
      "registration_submitted",
      "pending_confirmation",
      "confirmed_active",
      "paused",
      "cancelled",
      "expired",
    ];
    for (const status of allStatuses) {
      expect(canTransitionSubscription(status, status)).toBe(true);
    }
  });

  it("strictly forbids illegal state jumps and bypasses", () => {
    // Cannot jump from initial registration directly to active without confirmation
    expect(canTransitionSubscription("registration_submitted", "confirmed_active")).toBe(false);

    // Cancelled is a terminal state; cannot transition back to active without new onboarding
    expect(canTransitionSubscription("cancelled", "confirmed_active")).toBe(false);
    expect(canTransitionSubscription("cancelled", "pending_confirmation")).toBe(false);
    expect(canTransitionSubscription("cancelled", "paused")).toBe(false);

    // Expired subscription cannot directly pause
    expect(canTransitionSubscription("expired", "paused")).toBe(false);
  });

  it("verifies terminal state definition for cancelled", () => {
    expect(VALID_SUBSCRIPTION_TRANSITIONS.cancelled).toHaveLength(0);
  });
});

describe("Lead Repository Invariants", () => {
  const tempTestDir = path.join(process.cwd(), "scratch", "test-leads-fixture");
  const tempTestFile = path.join(tempTestDir, "test-leads.json");

  beforeEach(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
    fs.writeFileSync(tempTestFile, "[]", "utf8");
  });

  it("initializes every persisted lead with status 'pending_confirmation' and hasActivePerks false", async () => {
    const repo = new JsonFileLeadRepository(tempTestFile);

    const lead = await repo.createLead({
      leadReferenceCode: "HD-REG-2026-TEST1",
      planId: "standard",
      planName: "Standard",
      monthlyPriceINR: 3500,
      customer: {
        fullName: "Test Customer",
        phone: "9845012345",
        email: "test@example.com",
      },
      deliveryAddress: {
        flatNo: "101",
        buildingName: "Test Towers",
        streetAddress: "Test Street",
        area: "Indiranagar",
        city: "Bangalore",
        pincode: "560038",
      },
      dietaryPreferences: {
        dietaryType: "standard",
        allergies: [],
      },
      fulfillmentMode: "assisted_lead",
    });

    // Invariants enforced at storage level:
    expect(lead.status).toBe("pending_confirmation");
    expect(lead.hasActivePerks).toBe(false);
    expect(lead.leadReferenceCode).toBe("HD-REG-2026-TEST1");
    expect(lead.deliveryAddress.city).toBe("Bangalore");
    expect(lead.id).toBeDefined();

    // Verify lookup by reference code
    const retrieved = await repo.getLeadByReference("HD-REG-2026-TEST1");
    expect(retrieved).not.toBeNull();
    expect(retrieved?.status).toBe("pending_confirmation");
    expect(retrieved?.hasActivePerks).toBe(false);
  });
});
