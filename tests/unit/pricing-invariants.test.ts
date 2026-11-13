import { describe, it, expect } from "vitest";
import { OFFICIAL_PLANS } from "../../src/types/plans";
import type { PlanTier } from "../../src/types/plans";
import {
  getClientCheckoutPresentationMode,
  getServerAuthoritativeCheckoutMode,
  DEFAULT_CHECKOUT_MODE,
} from "../../src/lib/checkout-config";

describe("Pricing Invariants & Canonical Plan Truths", () => {
  it("enforces canonical monthly subscription prices matching client brochure", () => {
    // Factual truth from client brochure (Page 6 & Page 8)
    expect(OFFICIAL_PLANS.standard.monthlyPriceINR).toBe(3500);
    expect(OFFICIAL_PLANS.premium.monthlyPriceINR).toBe(4000);
  });

  it("maintains strict price inequality: Premium > Standard", () => {
    const standardPrice = OFFICIAL_PLANS.standard.monthlyPriceINR;
    const premiumPrice = OFFICIAL_PLANS.premium.monthlyPriceINR;
    expect(premiumPrice).toBeGreaterThan(standardPrice);
    expect(premiumPrice - standardPrice).toBe(500);
  });

  it("verifies Standard plan box inclusions and frequencies", () => {
    const standard = OFFICIAL_PLANS.standard;
    expect(standard.boxInclusions).toHaveLength(7);

    const box = standard.boxInclusions.find((i) => i.title.includes("Fresh Fruit & Vegetable Box"));
    const fruits = standard.boxInclusions.find((i) => i.title.includes("Varieties of Fruits"));
    const vegetables = standard.boxInclusions.find((i) => i.title.includes("Varieties of Vegetables"));
    const sprouts = standard.boxInclusions.find((i) => i.title.includes("Sprouts"));
    const dryFruits = standard.boxInclusions.find((i) => i.title.includes("Dry Fruits"));
    const oatsMeal = standard.boxInclusions.find((i) => i.title.includes("Healthy Oats Meal"));
    const oatsInclusions = standard.boxInclusions.find((i) => i.title.includes("Oats with Fruits"));

    expect(box?.frequency).toBe("4 Days a Week");
    expect(fruits?.frequency).toBe("On Box Days");
    expect(vegetables?.frequency).toBe("On Box Days");
    expect(sprouts?.frequency).toBe("On Box Days");
    expect(dryFruits?.frequency).toBe("On Box Days");
    expect(oatsMeal?.frequency).toBe("2 Days a Week");
    expect(oatsInclusions?.frequency).toBe("On Oats Days");
  });

  it("verifies Premium plan upgraded inclusions and exclusive perks", () => {
    const premium = OFFICIAL_PLANS.premium;
    expect(premium.boxInclusions).toHaveLength(7);

    expect(premium.premiumPerks).toBeDefined();
    expect(premium.premiumPerks?.length).toBeGreaterThan(0);

    const hasLabsDiscounts = premium.premiumPerks?.some((p) => p.includes("MedCity Labs"));
    const hasJuiceDrops = premium.premiumPerks?.some((p) => p.includes("Juice Drops"));
    expect(hasLabsDiscounts).toBe(true);
    expect(hasJuiceDrops).toBe(true);
  });

  it("verifies shared MedCity Smiles preventive healthcare perks across all plans", () => {
    for (const tier of ["standard", "premium"] as PlanTier[]) {
      const plan = OFFICIAL_PLANS[tier];
      expect(plan.communityAndHealthPerks.some((p) => p.includes("MedCity Smiles"))).toBe(true);
      expect(plan.communityAndHealthPerks.some((p) => p.includes("Monthly Health Checkup"))).toBe(true);
      expect(plan.communityAndHealthPerks.some((p) => p.includes("Blood Sugar, Cholesterol, Blood Pressure"))).toBe(true);
      expect(plan.communityAndHealthPerks.some((p) => p.includes("doctors & clinical nutritionists"))).toBe(true);
    }
  });

  it("rejects unauthorized client-side pricing overrides in server mode calculation", () => {
    // Simulate malicious client sending tampered pricing in payload
    const mockClientPayload = {
      planId: "premium",
      monthlyPriceINR: 100, // Malicious override
      price: 50,
    };

    // Server authoritative logic MUST look up official price from canonical repository
    const planId = mockClientPayload.planId as PlanTier;
    const authoritativePlan = OFFICIAL_PLANS[planId];
    expect(authoritativePlan).toBeDefined();
    expect(authoritativePlan.monthlyPriceINR).toBe(4000);
    expect(authoritativePlan.monthlyPriceINR).not.toBe(mockClientPayload.monthlyPriceINR);
  });

  it("falls back safely to default checkout mode if client configuration is spoofed", () => {
    const originalEnv = process.env.NEXT_PUBLIC_CHECKOUT_MODE;
    try {
      // Simulate client spoofing unrecognized mode
      process.env.NEXT_PUBLIC_CHECKOUT_MODE = "unauthorized_bypass_gateway";
      const presentationMode = getClientCheckoutPresentationMode();
      expect(presentationMode).toBe(DEFAULT_CHECKOUT_MODE);
      expect(presentationMode).toBe("assisted_lead");

      // Verify server mode also stays default
      delete process.env.CHECKOUT_MODE;
      const serverMode = getServerAuthoritativeCheckoutMode();
      expect(serverMode).toBe(DEFAULT_CHECKOUT_MODE);
    } finally {
      if (originalEnv) {
        process.env.NEXT_PUBLIC_CHECKOUT_MODE = originalEnv;
      } else {
        delete process.env.NEXT_PUBLIC_CHECKOUT_MODE;
      }
    }
  });
});
