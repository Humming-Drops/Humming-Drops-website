export type PlanTier = "standard" | "premium";

export interface PlanInclusion {
  title: string;
  frequency: string;
  isPremiumOnly?: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  monthlyPriceINR: number;
  perDayPriceINR: number; // Informational display calculation
  tagline: string;
  isRecommended?: boolean;
  boxInclusions: PlanInclusion[];
  communityAndHealthPerks: string[];
  premiumPerks?: string[];
}

export const OFFICIAL_PLANS: Record<PlanTier, SubscriptionPlan> = {
  standard: {
    id: "standard",
    name: "Standard",
    monthlyPriceINR: 3500,
    perDayPriceINR: 116,
    tagline: "Complete daily fresh breakfast nutrition & holistic health monitoring",
    boxInclusions: [
      { title: "4 Varieties of Fruits", frequency: "Every Day" },
      { title: "2 Varieties of Vegetables", frequency: "Every Day" },
      { title: "Fresh Mix Salad", frequency: "Every Day" },
      { title: "Fresh Sprouts", frequency: "Every Day" },
      { title: "Dry Fruits", frequency: "3 Days a Week" },
    ],
    communityAndHealthPerks: [
      "Free Membership to MedCity Smiles Community",
      "Free Monthly Health Checkup (Blood Sugar, Cholesterol, Blood Pressure)",
      "Access to community of doctors & clinical nutritionists",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyPriceINR: 4000,
    perDayPriceINR: 133,
    tagline: "Everything in Standard plus daily dry fruits, curated juices & lab discounts",
    isRecommended: true,
    boxInclusions: [
      { title: "4 Varieties of Fruits", frequency: "Every Day" },
      { title: "2 Varieties of Vegetables", frequency: "Every Day" },
      { title: "Fresh Mix Salad", frequency: "Every Day" },
      { title: "Fresh Sprouts", frequency: "Every Day" },
      { title: "Daily Dry Fruits", frequency: "Every Day (Upgraded)", isPremiumOnly: true },
    ],
    communityAndHealthPerks: [
      "Free Membership to MedCity Smiles Community",
      "Free Monthly Health Checkup (Blood Sugar, Cholesterol, Blood Pressure)",
      "Access to community of doctors & clinical nutritionists",
    ],
    premiumPerks: [
      "Exclusive MedCity Labs Benefits (Discounts on selected health packages)",
      "Special Healthy Juice Drops curated by Humming Drops & CARE by Berrybeats (on selected dates)",
    ],
  },
};
