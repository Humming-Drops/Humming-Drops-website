import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { MorningJourney } from "@/components/home/morning-journey";
import { BoxAnatomy } from "@/components/home/box-anatomy";
import { PricingSection } from "@/components/home/pricing-section";
import { WhyHummingDrops } from "@/components/home/why-humming-drops";
import { HealthCommunityBridge } from "@/components/home/health-community-bridge";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FAQSection } from "@/components/home/faq-section";
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

      {/* 2. How It Works: 3-step vertical connected journey */}
      <MorningJourney />

      {/* 3. What's in the Box: 5-compartment interactive breakdown */}
      <BoxAnatomy />

      {/* 4. Plans: Standard ₹3,500 & Premium ₹4,000 */}
      <PricingSection />

      {/* 5. Why Humming Drops: Morning habit transformation */}
      <WhyHummingDrops />

      {/* 5b. Health & Community: MedCity Smiles & Monthly vitals */}
      <HealthCommunityBridge />

      {/* 6. Reviews: Mobile swipe carousel */}
      <ReviewsSection />

      {/* 7. FAQ: Single-expanded mobile accordion */}
      <FAQSection />

      {/* 8. Final CTA + Full-Width Contact Rows */}
      <ClosingCTA />
    </div>
  );
}


