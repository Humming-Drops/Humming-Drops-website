"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, PhoneCall, HeartPulse, ShieldCheck, MessageCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganicWaveDivider } from "@/components/ui/doodles";

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
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Simple, Honest &amp; Flexible Plans</span>
          </div>

          <h2 className="font-display text-[2rem] sm:text-3xl lg:text-4xl font-extrabold text-[#132A1C] tracking-tight leading-[1.16]">
            Choose Your Morning Wellness Plan
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed">
            Both plans include doorstep delivery before 7:30 AM, free MedCity Smiles membership, and free monthly doctor-certified health checkups.
          </p>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {/* 1. STANDARD PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("standard")}
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
                  <p className="text-xs sm:text-sm text-[#657B6F] mt-1">
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
                  <span className="text-sm font-semibold text-[#657B6F]">/ month</span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full">
                  <span>Just ~₹116 / day</span>
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
                    <span><strong className="text-[#132A1C]">4 Varieties of Fruits</strong> — Fresh cut daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">2 Varieties of Vegetables</strong> — Crisp &amp; peeled</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">Fresh Mix Salad</strong> — Rich in vitamins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span><strong className="text-[#132A1C]">Fresh Sprouted Pulses</strong> — High plant protein</span>
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
                    <span><strong className="text-[#132A1C]">Free Monthly Health Check</strong> (Sugar, BP &amp; Vitals)</span>
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
                className="w-full justify-center text-base font-bold min-h-[50px] py-3.5 cursor-pointer rounded-full border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-700"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center gap-2">
                  <span>Subscribe to Standard</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. PREMIUM PLAN CARD */}
          <div
            onMouseEnter={() => setHighlightedPlan("premium")}
            className={cn(
              "rounded-3xl p-6 sm:p-8 md:p-9 border-2 transition-all duration-300 flex flex-col justify-between relative bg-white shadow-card mt-4 sm:mt-0",
              highlightedPlan === "premium"
                ? "border-amber-500 ring-4 ring-amber-500/15 shadow-raised -translate-y-1"
                : "border-amber-300/80 hover:border-amber-400"
            )}
          >
            {/* Top Recommended Glowing Badge */}
            <div className="absolute -top-4 right-6 sm:right-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" aria-hidden="true" />
              <span>Most Popular · Best Value</span>
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
                  <p className="text-xs sm:text-sm text-[#657B6F] mt-1">
                    Daily dry fruits + detox juices + exclusive lab perks
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
                  <span className="text-sm font-semibold text-[#657B6F]">/ month</span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <span>Just ~₹133 / day · Only ₹17 more per day</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A1C]">
                  Everything in Standard, plus:
                </span>
                <ul className="space-y-3 text-sm text-[#405347]">
                  <li className="flex items-start gap-3 font-semibold text-[#132A1C] bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-amber-950">Daily Dry Fruits:</strong> Premium almonds &amp; walnuts delivered every day</span>
                  </li>
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
                    <span>All 5 daily box pillars (4 Fruits, 2 Veg, Salad &amp; Sprouts)</span>
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
                className="w-full justify-center text-base font-bold min-h-[50px] py-3.5 shadow-md hover:shadow-lg cursor-pointer rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Link href="/subscribe?plan=premium" className="flex items-center gap-2">
                  <span>Subscribe to Premium</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Assisted Phone / WhatsApp Lead Booking Note */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3EFE5] max-w-3xl mx-auto text-center space-y-3 shadow-card">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Need Help Choosing or Customizing?</span>
          </div>

          <h4 className="text-lg font-extrabold text-[#132A1C]">
            Speak Directly with Our Morning Care Team
          </h4>

          <p className="text-sm text-[#405347] max-w-xl mx-auto leading-relaxed">
            Prefer ordering directly via WhatsApp or need custom dietary adjustments? Our Bangalore team is here to assist you daily:
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <a
              href="https://wa.me/918618902810"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-bold shadow-xs hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>WhatsApp: 8618902810</span>
            </a>

            <a
              href="tel:8618902810"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: 8618902810</span>
            </a>
          </div>
        </div>
      </div>

      {/* Organic wave transition */}
      <div className="mt-14 lg:mt-18 text-canvas">
        <OrganicWaveDivider fill="#FCFDF9" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}
