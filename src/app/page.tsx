import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { PricingSection } from "@/components/home/pricing-section";
import { BoxAnatomy } from "@/components/home/box-anatomy";
import { MorningJourney } from "@/components/home/morning-journey";
import { WhyHummingDrops } from "@/components/home/why-humming-drops";
import { FeatureStrip } from "@/components/home/feature-strip";
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
    <div className="w-full">
      {/* 1. Hero: Headline, food showcase, and primary CTA */}
      <Hero />

      {/* 2. Plan tiles/cards: Standard ₹3,500 & Premium ₹4,000 */}
      <PricingSection />

      {/* 3. What's in the box: 5-compartment interactive breakdown */}
      <BoxAnatomy />

      {/* 4. How it works: 3 steps (Picked fresh, Prepared & packed, Delivered) */}
      <MorningJourney />

      {/* 5. Morning habit comparison: The morning rush vs. The effortless ritual */}
      <WhyHummingDrops />

      {/* 6. What makes it Humming Drops: 6-item quality icon strip */}
      <FeatureStrip />

      {/* 7. Free health checks + MedCity Smiles (Aqua accent) */}
      <HealthCommunityBridge />

      {/* 8. Final CTA: Subscribe / WhatsApp */}
      <ClosingCTA />
    </div>
  );
}

