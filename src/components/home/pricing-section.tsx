"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, PhoneCall, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganicWaveDivider } from "@/components/ui/doodles";

export function PricingSection() {
  const [highlightedPlan, setHighlightedPlan] = useState<"standard" | "premium">("premium");

  return (
    <section
      id="pricing"
      aria-label="Subscription Plans & Pricing"
      className="py-14 sm:py-16 lg:py-24 bg-mint border-b border-[#E2ECE4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-white border border-[#E2ECE4] text-primary text-xs font-semibold shadow-2xs">
            <span>Transparent Subscription Plans</span>
          </div>
          <h2 className="font-display text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight leading-[1.18]">
            Choose Your Morning Fresh Plan
          </h2>
          <p className="text-base sm:text-lg text-body font-sans leading-relaxed">
            All plans include daily morning doorstep delivery, free MedCity Smiles membership, and free monthly health vitals checkups.
          </p>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {/* 1. STANDARD PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("standard")}
            className={cn(
              "rounded-[20px] p-6 sm:p-8 md:p-9 border transition-all duration-200 flex flex-col justify-between relative bg-white shadow-card",
              highlightedPlan === "standard"
                ? "border-primary ring-2 ring-primary/20 shadow-raised"
                : "border-[#E2ECE4]"
            )}
          >
            <div className="space-y-5">
              {/* Card top */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-ink font-display">
                    Standard Plan
                  </h3>
                  <p className="text-xs text-body mt-1 font-sans">
                    Essential daily nutrition &amp; wellness monitoring
                  </p>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  🥗
                </span>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-4 border-b border-[#E2ECE4]">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-ink">
                    ₹3,500
                  </span>
                  <span className="text-sm font-medium text-body">/ month</span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-mint px-2.5 py-0.5 rounded-[20px]">
                  <span>Just ~₹116 / day</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-body">
                  What is Included in Standard:
                </span>
                <ul className="space-y-2.5 text-sm text-body font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>4 Varieties of Fruits</strong> — Daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>2 Varieties of Vegetables</strong> — Daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Fresh Mix Salad</strong> — Daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Fresh Sprouts</strong> — Daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Dry Fruits</strong> — 3 Days a Week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-aqua shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Free MedCity Smiles Membership</strong> (Doctors &amp; nutritionists)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartPulse className="w-4 h-4 text-aqua shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Free Monthly Health Checkup</strong> (Sugar, Cholesterol &amp; BP)</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-body font-medium pt-1">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Customised plan to your dietary needs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-6 mt-6 border-t border-[#E2ECE4]">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="w-full justify-center text-base font-semibold min-h-[48px] py-3.5 cursor-pointer rounded-[20px]"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center gap-2">
                  <span>Subscribe Standard</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. PREMIUM PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("premium")}
            className={cn(
              "rounded-[20px] p-6 sm:p-8 md:p-9 border-2 transition-all duration-200 flex flex-col justify-between relative bg-white shadow-card mt-3 sm:mt-0",
              highlightedPlan === "premium"
                ? "border-citrus ring-2 ring-citrus/20 shadow-raised"
                : "border-citrus/50"
            )}
          >
            {/* Top Recommended Pill with Citrus Accent */}
            <div className="absolute -top-3.5 right-4 sm:right-8 bg-citrus text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-[20px] shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              <span>Most Complete</span>
            </div>

            <div className="space-y-5">
              {/* Card top */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-ink font-display">
                    Premium Plan
                  </h3>
                  <p className="text-xs text-body mt-1 font-sans">
                    Complete daily nutrition + juices &amp; MedCity Labs benefits
                  </p>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  ⭐
                </span>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-4 border-b border-[#E2ECE4]">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-ink">
                    ₹4,000
                  </span>
                  <span className="text-sm font-medium text-body">/ month</span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-citrus bg-amber-50 px-2.5 py-0.5 rounded-[20px] border border-amber-200">
                  <span>Just ~₹133 / day · Only ₹17 more per day</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-body">
                  Everything in Standard, plus:
                </span>
                <ul className="space-y-2.5 text-sm text-body font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>All 5 daily box pillars (4 Fruits, 2 Veg, Salad, Sprouts)</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-ink bg-amber-50 p-2 rounded-[20px] border border-amber-200">
                    <Sparkles className="w-4 h-4 text-citrus shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Daily Dry Fruits:</strong> Delivered every single day</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-ink bg-mint p-2 rounded-[20px] border border-[#E2ECE4]">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Special Healthy Juice Drops:</strong> Pre-planned dates by CARE by Berrybeats</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-ink bg-[#E8F7F1] p-2 rounded-[20px] border border-teal-200/80">
                    <Sparkles className="w-4 h-4 text-aqua shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Exclusive MedCity Health Labs Benefits:</strong> Curated package discounts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-aqua shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Free MedCity Smiles Community membership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartPulse className="w-4 h-4 text-aqua shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Free monthly Sugar, Cholesterol &amp; BP checkup</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-body font-medium pt-1">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Customised plan to your dietary needs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-6 mt-6 border-t border-[#E2ECE4]">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center text-base font-semibold min-h-[48px] py-3.5 shadow-sm hover:shadow-md cursor-pointer rounded-[20px]"
              >
                <Link href="/subscribe?plan=premium" className="flex items-center gap-2">
                  <span>Subscribe Premium</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Assisted Phone / WhatsApp Lead Booking Note */}
        <div className="mt-10 p-6 rounded-[20px] bg-white border border-[#E2ECE4] max-w-3xl mx-auto text-center space-y-2.5 shadow-2xs">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-body">
            <PhoneCall className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Need Help Choosing or Customizing?</span>
          </div>
          <p className="text-sm text-body">
            Prefer direct registration by phone or WhatsApp? Reach out directly via our official helpline:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold text-primary pt-1">
            <a href="tel:8618902810" className="hover:underline flex items-center gap-1.5">
              <span>📞 8618902810</span>
            </a>
            <span className="text-body/60">·</span>
            <a href="mailto:hummingdrops@gmail.com" className="hover:underline flex items-center gap-1.5">
              <span>✉️ hummingdrops@gmail.com</span>
            </a>
            <span className="text-body/60">·</span>
            <span className="text-body font-medium">Berrybeats cafe, Bangalore</span>
          </div>
        </div>
      </div>

      {/* Organic wave transition */}
      <div className="mt-12 lg:mt-16 text-canvas">
        <OrganicWaveDivider fill="#FFFEF8" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}
