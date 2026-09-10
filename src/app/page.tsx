import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { BoxAnatomy } from "@/components/home/box-anatomy";
import { MorningJourney } from "@/components/home/morning-journey";
import { WhyHummingDrops } from "@/components/home/why-humming-drops";
import { HealthCommunityBridge } from "@/components/home/health-community-bridge";
import { PricingSection } from "@/components/home/pricing-section";
import { ClosingCTA } from "@/components/home/closing-cta";

export const metadata: Metadata = {
  title: "Humming Drops | Healthy Drops, Healthier you",
  description:
    "Daily morning doorstep delivery of fresh mixed cut fruit boxes, crisp vegetables, fresh mix salad, sprouts, and dry fruits. In partnership with Berrybeats Cafe & MedCity Health Labs.",
  openGraph: {
    title: "Humming Drops | Healthy Drops, Healthier you",
    description:
      "Daily morning doorstep delivery of fresh mixed cut fruit boxes, crisp vegetables, fresh mix salad, sprouts, and dry fruits.",
    images: ["/images/humming-drops-box.png"],
  },
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Discover: Editorial Hero with Authentic Meal Box & Hand-Drawn Annotations */}
      <Hero />

      {/* 2. Explore: Interactive 5-Compartment Box Anatomy & Hotspots */}
      <BoxAnatomy />

      {/* 3. Understand: The Morning Ritual & Sourcing Story */}
      <MorningJourney />

      {/* 4. Connect: Why Humming Drops & Daily Habit Philosophy */}
      <WhyHummingDrops />

      {/* 5. Trust: Preventative Health Vitals & MedCity Smiles Community Bridge */}
      <HealthCommunityBridge />

      {/* 6. Subscribe: Transparent Subscription Plans & Pricing Comparison */}
      <PricingSection />

      {/* 7. Action: Closing CTA & Assisted Booking Helpline */}
      <ClosingCTA />
    </div>
  );
}
