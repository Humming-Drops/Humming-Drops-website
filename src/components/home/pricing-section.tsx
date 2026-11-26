"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, PhoneCall, HeartPulse, MessageCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [highlightedPlan, setHighlightedPlan] = useState<"standard" | "premium">("premium");

  return (
    <section
      id="pricing"
      aria-label="Subscription Plans & Pricing"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F0FDF4] via-[#FCFDF9] to-[#F0FDF4] border-b border-[#E3EFE5] relative overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-100/40 via-amber-50/30 to-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Simple, Honest &amp; Flexible Plans</span>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-[#132A1C] tracking-tight leading-[1.15]">
            Choose Your Morning Wellness Plan
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed max-w-2xl mx-auto">
            Both plans include doorstep delivery before 7:30 AM, free MedCity Smiles membership, and free monthly doctor-certified health checkups.
          </p>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {/* 1. STANDARD PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("standard")}
            onFocus={() => setHighlightedPlan("standard")}
            className={cn(
              "rounded-3xl p-6 sm:p-8 md:p-9 border transition-all duration-300 flex flex-col justify-between relative bg-white shadow-card",
              highlightedPlan === "standard"
                ? "border-emerald-500 ring-4 ring-emerald-500/15 shadow-raised -translate-y-1"
                : "border-[#E3EFE5] hover:border-emerald-300"
            )}
          >
            <div className="space-y-6">
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                    <span>Essential Daily Habit</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#132A1C] font-display">
                    Standard Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F6458] mt-1">
                    Daily fresh fruits, greens &amp; regular health tracking
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                  <Leaf className="w-6 h-6" />
                </div>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-5 border-b border-[#E3EFE5]">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#132A1C]">
                    ₹3,500
                  </span>
                  <span className="text-sm font-semibold text-[#4F6458]">/ month</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A1C]">
                  What is included in Standard:
                </span>
                <ul className="space-y-3 text-sm text-[#405347]">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">Daily Breakfast Box</strong> — every day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>4 fruit varieties, 2 vegetable varieties, fresh mix salad &amp; fresh sprouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">Dry Fruits</strong> — 3 days a week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                      <HeartPulse className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span><strong className="text-[#132A1C]">Free Monthly Health Check</strong> (blood sugar, cholesterol &amp; blood pressure)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">MedCity Smiles</strong> Wellness community membership</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-6 mt-6 border-t border-[#E3EFE5]">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="w-full justify-center"
              >
                <Link href="/subscribe?plan=standard">
                  <span>Subscribe to Standard</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. PREMIUM PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("premium")}
            onFocus={() => setHighlightedPlan("premium")}
            className={cn(
              "rounded-3xl p-6 sm:p-8 md:p-9 border-2 transition-all duration-300 flex flex-col justify-between relative bg-white shadow-card mt-4 sm:mt-0",
              highlightedPlan === "premium"
                ? "border-amber-500 ring-4 ring-amber-500/15 shadow-raised -translate-y-1"
                : "border-amber-300/80 hover:border-amber-400"
            )}
          >
            {/* Top Recommended Glowing Badge */}
            <div className="absolute -top-3.5 right-6 sm:right-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" aria-hidden="true" />
              <span>Recommended</span>
            </div>

            <div className="space-y-6">
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
                    <span>Complete All-Inclusive</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#132A1C] font-display">
                    Premium Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F6458] mt-1">
                    Curated juices + exclusive MedCity Labs discounts
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-5 border-b border-[#E3EFE5]">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#132A1C]">
                    ₹4,000
                  </span>
                  <span className="text-sm font-semibold text-[#4F6458]">/ month</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A1C]">
                  Everything in Standard, plus:
                </span>
                <ul className="space-y-3 text-sm text-[#405347]">
                  <li className="flex items-start gap-3 font-semibold text-[#132A1C] bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200/80">
                    <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-900 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-emerald-950">Special Cold-Pressed Juices:</strong> Pre-planned dates by CARE by Berrybeats</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold text-[#132A1C] bg-sky-50/80 p-2.5 rounded-2xl border border-sky-200/80">
                    <div className="w-5 h-5 rounded-full bg-sky-200 flex items-center justify-center text-sky-900 shrink-0 mt-0.5">
                      <HeartPulse className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-sky-950">MedCity Health Labs:</strong> Exclusive lab discounts &amp; priority diagnostics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Dry fruits every day, plus the full Standard box</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Free MedCity Smiles Community membership &amp; dietary support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card CTA */}
            <div className="pt-6 mt-6 border-t border-[#E3EFE5]">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center shadow-md"
              >
                <Link href="/subscribe?plan=premium">
                  <span>Subscribe to Premium</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Assisted Phone / WhatsApp Lead Booking Note */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3EFE5] max-w-3xl mx-auto text-center space-y-3 shadow-card">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Need Help Choosing or Customizing?</span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#132A1C]">
            Speak Directly with Our Morning Care Team
          </h3>

          <p className="text-sm text-[#405347] max-w-xl mx-auto leading-relaxed">
            Prefer ordering directly via WhatsApp or need custom dietary adjustments? Our Bangalore team is here to assist you daily:
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-2">
            <Button variant="primary" size="md" asChild className="bg-[#0E7A3E] hover:bg-[#0B6A35]">
              <a href="https://wa.me/918618902810" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp: 8618902810</span>
              </a>
            </Button>
            <Button variant="secondary" size="md" asChild>
              <a href="tel:+918618902810">
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>Call: 8618902810</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
