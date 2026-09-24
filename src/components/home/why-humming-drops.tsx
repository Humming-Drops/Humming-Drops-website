"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Check, X, Sparkles, HeartPulse, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  DoodleSquiggle,
  HandwrittenAnnotation,
  OrganicWaveDivider,
} from "@/components/ui/doodles";

export function WhyHummingDrops() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-humming-drops"
      aria-label="Why Humming Drops"
      className="pt-12 lg:pt-16 pb-0 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#EAF6E8] border border-[#e2ede2] text-brand-primary text-xs font-semibold tracking-wide">
              The Morning Habit
            </span>
            <HandwrittenAnnotation rotation="-rotate-1" color="text-brand-primary hidden sm:inline-flex">
              Small positive choices ✦
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Wellness isn&apos;t one big change. <br className="hidden sm:inline" />
            It&apos;s made of{" "}
            <span className="relative inline-block text-primary pb-2">
              small, daily choices.
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-2 text-sun pointer-events-none stroke-[2.5]"
                color="#FFD84D"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-body leading-relaxed max-w-2xl mx-auto font-sans">
            Mornings are fast-paced. Humming Drops turns daily whole-food nutrition into an effortless, uplifting habit.
          </p>
        </div>

        {/* High-Impact Visual Metaphor: The Morning Rush vs. The Humming Drops Ritual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: The Morning Rush (Without Humming Drops) - 6 cols */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-[20px] bg-canvas border border-[#E2ECE4] shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] bg-stone-200/70 text-ink text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  <span>The Morning Rush</span>
                </span>
                <span className="text-xs text-body font-medium">Without Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
                Morning friction gets in the way of nutrition
              </h3>

              {/* 3 Visual Friction Points */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white border border-[#E2ECE4] text-xs text-body shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-berry" />
                  </div>
                  <div>
                    <strong className="text-ink block font-semibold">Alarm Snooze &amp; Rush:</strong>
                    No time to wash, slice, or prepare fresh produce before heading out.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white border border-[#E2ECE4] text-xs text-body shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-berry" />
                  </div>
                  <div>
                    <strong className="text-ink block font-semibold">Shopping Friction:</strong>
                    Grocery runs lead to produce spoiling in the fridge before use.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white border border-[#E2ECE4] text-xs text-body shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-berry" />
                  </div>
                  <div>
                    <strong className="text-ink block font-semibold">Missing Daily Goodness:</strong>
                    Skipping fruits and vegetables impacts physical energy and focus.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2ECE4] flex items-center justify-between text-xs text-body">
              <span className="font-semibold text-berry flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-berry" />
                Common Modern Dilemma
              </span>
              <span>Daily Challenge</span>
            </div>
          </div>

          {/* Card 2: The Humming Drops Ritual (With Humming Drops) - 6 cols */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-[20px] bg-gradient-to-br from-primary-bright to-primary text-white shadow-card flex flex-col justify-between space-y-5 relative overflow-hidden">
            <div
              className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-40"
              aria-hidden="true"
            />

            <div className="space-y-3.5 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/25">
                  <Sparkles className="w-3.5 h-3.5 text-sun" />
                  <span>The Effortless Ritual</span>
                </span>
                <span className="text-xs text-white/90 font-medium">With Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Doorstep freshness for pure morning vitality
              </h3>

              {/* 3 Visual Solutions */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white/15 border border-white/20 text-xs text-white shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-sun" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Morning Doorstep Box:</strong>
                    Delivered fresh every morning before breakfast with zero effort.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white/15 border border-white/20 text-xs text-white shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-sun" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">5 Fresh Food Groups:</strong>
                    4 fruits, 2 veg, mix salad, sprouts &amp; wholesome dry fruits.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[20px] bg-white/15 border border-white/20 text-xs text-white shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-sun" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Body &amp; Mind Connection:</strong>
                    Free monthly health vitals monitoring + MedCity Smiles community.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20 relative z-10 flex items-center justify-between text-xs text-white/90">
              <span className="font-semibold text-sun flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sun" />
                Effortless Daily Habit
              </span>
              <span>Morning Ritual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless curved organic wave transition into the bright Health & Community Bridge */}
      <div className="mt-12 lg:mt-16 text-mist-50">
        <OrganicWaveDivider fill="#f8faf9" className="w-full h-12 sm:h-16 text-mist-50" />
      </div>
    </section>
  );
}

