"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, PhoneCall, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrganicWaveDivider } from "@/components/ui/doodles";

export function PricingSection() {
  const [highlightedPlan, setHighlightedPlan] = useState<"standard" | "premium">("premium");

  return (
    <section
      id="pricing"
      aria-label="Subscription Plans & Pricing"
      className="py-16 sm:py-24 bg-canvas border-b border-line-subtle relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
            <span>Transparent Subscription Plans</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-primary tracking-tight">
            Choose Your Morning Fresh Plan
          </h2>
          <p className="text-base sm:text-lg text-content-secondary font-sans leading-relaxed">
            All plans include daily morning doorstep delivery, free MedCity Smiles membership, and free monthly health vitals checkups.
          </p>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* 1. STANDARD PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("standard")}
            className={cn(
              "rounded-3xl p-8 sm:p-10 border transition-all duration-fast flex flex-col justify-between relative bg-surface shadow-xs",
              highlightedPlan === "standard"
                ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-card"
                : "border-line-subtle"
            )}
          >
            <div className="space-y-6">
              {/* Card top */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-content-primary font-display">
                    Standard Plan
                  </h3>
                  <p className="text-xs text-content-muted mt-1 font-sans">
                    Essential daily physical nutrition &amp; wellness monitoring
                  </p>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  🥗
                </span>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-4 border-b border-line-subtle">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-content-primary">
                    ₹3,500
                  </span>
                  <span className="text-sm font-medium text-content-muted">/ month</span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-subtle px-2.5 py-0.5 rounded-full">
                  <span>Just ~₹116 / day</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                  What is Included in Standard:
                </span>
                <ul className="space-y-3 text-sm text-content-secondary font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>4 Varieties of Fruits</strong> — Every Day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>2 Varieties of Vegetables</strong> — Every Day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Fresh Mix Salad</strong> — Every Day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Fresh Sprouts</strong> — Every Day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Dry Fruits</strong> — 3 Days a Week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Free MedCity Smiles Membership</strong> (Doctor &amp; nutritionist guidance)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartPulse className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Free Monthly Health Checkup</strong> (Sugar, Cholesterol, B.P)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-8 mt-8 border-t border-line-subtle">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full justify-center text-base font-semibold py-3.5 border-brand-primary text-brand-primary hover:bg-brand-subtle"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center gap-2">
                  <span>Select Standard Plan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. PREMIUM PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("premium")}
            className={cn(
              "rounded-3xl p-8 sm:p-10 border-2 transition-all duration-fast flex flex-col justify-between relative bg-gradient-to-b from-forest-50/40 via-surface to-amber-50/20 shadow-card",
              highlightedPlan === "premium"
                ? "border-brand-primary ring-2 ring-brand-primary/30 shadow-floating"
                : "border-brand-primary/60"
            )}
          >
            {/* Top Recommended Pill */}
            <div className="absolute -top-3.5 right-8 bg-brand-primary text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>Recommended</span>
            </div>

            <div className="space-y-6">
              {/* Card top */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-content-primary font-display">
                    Premium Plan
                  </h3>
                  <p className="text-xs text-content-muted mt-1 font-sans">
                    Everything in Standard plus daily dry fruits, juices &amp; lab benefits
                  </p>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  ⭐
                </span>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-4 border-b border-line-subtle">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-content-primary">
                    ₹4,000
                  </span>
                  <span className="text-sm font-medium text-content-muted">/ month</span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  <span>Just ~₹133 / day · Only ₹17 more per day</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                  Everything in Standard, plus:
                </span>
                <ul className="space-y-3 text-sm text-content-secondary font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>All 5 daily box pillars (4 Fruits, 2 Veg, Salad, Sprouts)</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-content-primary bg-amber-50/70 p-2 rounded-xl border border-amber-200/80">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Daily Dry Fruits:</strong> A nutritious serving of dry fruits every single day</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-content-primary bg-forest-50/70 p-2 rounded-xl border border-forest-200/80">
                    <Sparkles className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Special Healthy Juice Drops:</strong> Thoughtfully prepared on select pre-planned dates curated by CARE by Berrybeats</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-content-primary bg-teal-50/70 p-2 rounded-xl border border-teal-200/80">
                    <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Exclusive MedCity Labs Benefits:</strong> Additional discounts on selected curated health packages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Free MedCity Smiles Community membership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartPulse className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Free monthly Sugar, Cholesterol &amp; B.P checkup</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-8 mt-8 border-t border-line-subtle">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center text-base font-semibold py-3.5 shadow-md hover:shadow-lg"
              >
                <Link href="/subscribe?plan=premium" className="flex items-center gap-2">
                  <span>Select Premium Plan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Assisted Phone / WhatsApp Lead Booking Note from Page 8 */}
        <div className="mt-12 p-6 rounded-2xl bg-surface border border-line-subtle max-w-3xl mx-auto text-center space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-content-muted">
            <PhoneCall className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
            <span>Need Help Choosing or Customizing?</span>
          </div>
          <p className="text-sm text-content-secondary">
            Prefer direct registration by phone or WhatsApp? Reach out directly via our official helpline:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold text-brand-primary pt-1">
            <a href="tel:8618902810" className="hover:underline flex items-center gap-1.5">
              <span>📞 8618902810</span>
            </a>
            <span className="text-content-muted">·</span>
            <a href="mailto:hummingdrops@gmail.com" className="hover:underline flex items-center gap-1.5">
              <span>✉️ hummingdrops@gmail.com</span>
            </a>
            <span className="text-content-muted">·</span>
            <span className="text-content-secondary font-medium">Berrybeats cafe, Bangalore</span>
          </div>
        </div>
      </div>

      {/* Organic wave transition into the bright Closing CTA */}
      <div className="mt-12 lg:mt-16 text-cream-50">
        <OrganicWaveDivider fill="#fdfcf7" className="w-full h-12 sm:h-16 text-cream-50" />
      </div>
    </section>
  );
}
