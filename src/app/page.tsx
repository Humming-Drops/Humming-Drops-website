import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TwoPillars } from "@/components/home/two-pillars";
import { MorningJourney } from "@/components/home/morning-journey";
import { BoxAnatomy } from "@/components/home/box-anatomy";
import { PricingSection } from "@/components/home/pricing-section";
import { WhyHummingDrops } from "@/components/home/why-humming-drops";
import { MedCitySmilesSection } from "@/components/home/medcity-smiles-section";
import { ClosingCTA } from "@/components/home/closing-cta";

export const metadata: Metadata = {
  title: "Humming Drops | Healthy Drops, Healthier you",
  description:
    "Morning doorstep delivery in Bangalore: a fresh fruit & vegetable box 5 days a week, plus a healthy oats meal 2 days a week. In partnership with Berrybeats Cafe & MedCity Health Labs.",
  openGraph: {
    title: "Humming Drops | Healthy Drops, Healthier you",
    description:
      "Morning doorstep delivery in Bangalore: a fresh fruit & vegetable box 5 days a week, plus a healthy oats meal 2 days a week. In partnership with Berrybeats Cafe & MedCity Health Labs.",
    images: ["/images/humming-drops-box.png"],
  },
};

export default function HomePage() {
  return (
    <div className="w-full overflow-x-clip">
      {/* 1. Hero & Trust Bar */}
      <Hero />

      {/* 2. MedCity Smiles Community */}
      <MedCitySmilesSection />

      {/* 3. Three Equal Pillars: Nutrition, MedCity Smiles & Preventative Health */}
      <TwoPillars />

      {/* 4. How It Works: 3-step vertical connected journey */}
      <MorningJourney />

      {/* 5. What's in the Box: 5-compartment interactive breakdown */}
      <BoxAnatomy />

      {/* 6. Plans: Standard â‚¹3,500 & Premium â‚¹4,000 */}
      <PricingSection />

      {/* 7. Why Humming Drops: Morning habit transformation */}
      <WhyHummingDrops />

      {/* 8. Final CTA + Full-Width Contact Rows */}
      <ClosingCTA />
    </div>
  );
}
