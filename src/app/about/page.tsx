import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "About Us | Our Story & Kitchen",
  description:
    "Learn about Humming Drops, our mission to nourish the body, and our kitchen base at Berrybeats Cafe, Bangalore.",
};

export default function AboutPage() {
  return (
    <div className="bg-canvas min-h-[calc(100vh-4rem)] border-b border-line-subtle">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 sm:space-y-12">
        <div className="space-y-4">
          <Badge variant="brand" size="md">
            About Humming Drops
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight leading-tight">
            Nourishing the Body. Uplifting the Mind. Building a Happier Community.
          </h1>
          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            Humming Drops was founded on the simple belief that achieving optimal health shouldn&apos;t be a struggle. We are dedicated to delivering essential daily nutrition right to your doorstep, making wellness effortless and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-3">
            <h2 className="font-display text-xl font-bold text-content-primary">
              The Problem We Are Solving
            </h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              In today&apos;s fast-paced world, finding the time to consistently add the right nutrients and vitamins to your diet is a common challenge. Many people miss out on the vital goodness of fresh fruits and vegetables, impacting both their physical and mental energy.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-3">
            <h2 className="font-display text-xl font-bold text-content-primary">Our Solution</h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              Humming Drops solves this by offering a convenient, monthly subscription service for fresh mixed cut fruit boxes, delivered every morning. We ensure you receive the natural vitamins and nourishment you need through meticulously prepared, high-quality produce.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-forest-800 via-forest-900 to-emerald-950 text-white space-y-4 shadow-floating">
          <h2 className="font-display text-2xl font-bold">Kitchen Base &amp; Partnerships</h2>
          <p className="text-sm sm:text-base text-emerald-50/90 max-w-2xl leading-relaxed">
            Our fresh fruit and vegetable boxes are prepared fresh every morning in Bangalore at our operational base,{" "}
            <strong className="text-white">{OFFICIAL_CONTACT.kitchenLocation}</strong>. In collaboration with{" "}
            <strong className="text-white">{OFFICIAL_CONTACT.partners.medCityLabs}</strong>, we integrate free monthly health vitals checkups and mental wellbeing support into every box.
          </p>
          <div className="pt-2">
            <Button variant="secondary" size="md" asChild className="bg-white text-forest-900 hover:bg-emerald-50 border-transparent">
              <Link href="/subscribe">
                <span>Start Your Monthly Subscription</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
