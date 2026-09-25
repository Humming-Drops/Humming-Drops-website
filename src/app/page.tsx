import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TwoPillars } from "@/components/home/two-pillars";
import { MorningJourney } from "@/components/home/morning-journey";
import { BoxAnatomy } from "@/components/home/box-anatomy";
import { PricingSection } from "@/components/home/pricing-section";
import { WhyHummingDrops } from "@/components/home/why-humming-drops";
import { HealthCommunityBridge } from "@/components/home/health-community-bridge";
import { ClosingCTA } from "@/components/home/closing-cta";

export const metadata: Metadata = {
  title: "Humming Drops | Healthy Drops, Healthier you",
  description:
    "Daily morning doorstep delivery of fresh mixed cut fruit boxes, crisp vegetables, fresh mix salad, sprouts, and dry fruits. In partnership with Berrybeats Cafe & MedCity Health Labs.",
  openGraph: {
    title: "Humming Drops | Healthy Drops, Healthier you",
    description:
      "Daily morning doorstep delivery of fresh mixed cut fruit boxes, crisp vegetables, fresh mix salad, sprouts, and dry fruits. In partnership with Berrybeats Cafe & MedCity Health Labs.",
    images: ["/images/humming-drops-box.png"],
  },
};

export default function HomePage() {
  return (
    <div className="w-full overflow-x-clip">
      {/* 1. Hero & Trust Bar */}
      <Hero />

      {/* 2. Two Equal Pillars: Nutrition & MedCity Smiles */}
      <TwoPillars />

      {/* 3. How It Works: 3-step vertical connected journey */}
      <MorningJourney />

      {/* 4. What's in the Box: 5-compartment interactive breakdown */}
      <BoxAnatomy />

      {/* 5. Plans: Standard ₹3,500 & Premium ₹4,000 */}
      <PricingSection />

      {/* 6. Why Humming Drops: Morning habit transformation */}
      <WhyHummingDrops />

      {/* 7. Health & Community: MedCity Smiles & Monthly vitals */}
      <HealthCommunityBridge />

      {/* 8. Final CTA + Full-Width Contact Rows */}
      <ClosingCTA />
    </div>
  );
}


