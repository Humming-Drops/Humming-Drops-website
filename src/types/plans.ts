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
    tagline: "Fresh fruit & vegetable boxes plus healthy oats meals, with holistic health monitoring",
    boxInclusions: [
      { title: "Fresh Fruit & Vegetable Box", frequency: "5 Days a Week" },
      { title: "4 Varieties of Fruits", frequency: "On Box Days" },
      { title: "3 Varieties of Vegetables", frequency: "On Box Days" },
      { title: "Mixed Sprouts Portion", frequency: "On Box Days" },
      { title: "Dry Fruits Mix", frequency: "On Box Days" },
      { title: "Healthy Oats Meal", frequency: "2 Days a Week" },
      { title: "Oats with Fruits & Dry Fruits", frequency: "On Oats Days" },
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
    tagline: "Everything in Standard plus curated juices & MedCity Labs discounts",
    isRecommended: true,
    boxInclusions: [
      { title: "Fresh Fruit & Vegetable Box", frequency: "5 Days a Week" },
      { title: "4 Varieties of Fruits", frequency: "On Box Days" },
      { title: "3 Varieties of Vegetables", frequency: "On Box Days" },
      { title: "Mixed Sprouts Portion", frequency: "On Box Days" },
      { title: "Dry Fruits Mix", frequency: "On Box Days" },
      { title: "Healthy Oats Meal", frequency: "2 Days a Week" },
      { title: "Oats with Fruits & Dry Fruits", frequency: "On Oats Days" },
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
