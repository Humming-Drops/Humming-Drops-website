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
      className="pt-14 lg:pt-20 pb-0 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold tracking-wide">
              The Morning Habit
            </span>
            <HandwrittenAnnotation rotation="-rotate-1" color="text-forest-700 hidden sm:inline-flex">
              Small positive choices ✦
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 tracking-tight leading-tight">
            Wellness isn&apos;t one big change. <br className="hidden sm:inline" />
            It&apos;s made of{" "}
            <span className="relative inline-block text-forest-800">
              small, daily choices.
              <DoodleSquiggle
                className="absolute -bottom-2 left-0 w-full text-brand-primary"
                color="currentColor"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-2xl mx-auto font-sans">
            Mornings are fast-paced. Humming Drops turns daily whole-food nutrition into an effortless, uplifting habit.
          </p>
        </div>

        {/* High-Impact Visual Metaphor: The Morning Rush vs. The Humming Drops Ritual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: The Morning Rush (Without Humming Drops) - 6 cols */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  <span>The Morning Rush</span>
                </span>
                <span className="text-xs text-stone-500 font-medium">Without Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                Morning friction gets in the way of nutrition
              </h3>

              {/* 4 Visual Friction Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-semibold">Alarm Snooze &amp; Rush:</strong>
                    No time to wash, slice, or prepare fresh produce before heading out.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-semibold">Shopping Friction:</strong>
                    Grocery runs lead to produce spoiling in the fridge before use.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-semibold">Missing Daily Goodness:</strong>
                    Skipping fruits and vegetables impacts physical energy and focus.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Common Modern Dilemma
              </span>
              <span>Brochure Page 2</span>
            </div>
          </div>

          {/* Card 2: The Humming Drops Ritual (With Humming Drops) - 6 cols */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-900 to-forest-950 text-white shadow-card flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div
              className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-forest-800 rounded-full blur-3xl opacity-50"
              aria-hidden="true"
            />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-forest-200 text-xs font-bold uppercase tracking-wider border border-forest-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>The Effortless Ritual</span>
                </span>
                <span className="text-xs text-forest-300 font-medium">With Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Doorstep freshness for pure morning vitality
              </h3>

              {/* 4 Visual Solutions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-forest-800/80 border border-forest-700 text-xs text-forest-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-forest-700 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Morning Doorstep Box:</strong>
                    Delivered fresh every morning before breakfast with zero effort.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-forest-800/80 border border-forest-700 text-xs text-forest-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-forest-700 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">5 Fresh Food Groups:</strong>
                    4 fruits, 2 veg, mix salad, sprouts &amp; wholesome dry fruits.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-forest-800/80 border border-forest-700 text-xs text-forest-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-forest-700 text-white flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Body &amp; Mind Connection:</strong>
                    Free monthly health vitals monitoring + MedCity Smiles community.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-forest-800 relative z-10 flex items-center justify-between text-xs text-forest-300">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Effortless Daily Habit
              </span>
              <span>Brochure Page 7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless curved organic wave transition into dark teal Health & Community Bridge */}
      <div className="mt-12 lg:mt-16 text-teal-950">
        <OrganicWaveDivider fill="#042f2e" className="w-full h-12 sm:h-16 text-teal-950" />
      </div>
    </section>
  );
}

