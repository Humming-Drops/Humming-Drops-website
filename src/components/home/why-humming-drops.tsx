"use client";

import React from "react";
import { Clock, Check, X, Sparkles, ShieldCheck } from "lucide-react";
import {
  DoodleSquiggle,
  HandwrittenAnnotation,
} from "@/components/ui/doodles";

export function WhyHummingDrops() {
  return (
    <section
      id="why-humming-drops"
      aria-label="Why Humming Drops"
      className="py-16 sm:py-20 lg:py-24 bg-[#FAFCF8] relative overflow-hidden border-b border-[#E3EFE5]"
    >
      {/* Soft radiant ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-emerald-100/35 via-amber-50/20 to-teal-100/35 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              The Morning Habit
            </span>
            <HandwrittenAnnotation rotation="-rotate-1" color="text-emerald-700 hidden sm:inline-flex">
              Small positive choices
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-[2rem] sm:text-4xl lg:text-5xl font-extrabold text-[#132A1C] tracking-tight leading-tight">
            Wellness isn&apos;t one big change. <br className="hidden sm:inline" />
            It&apos;s made of{" "}
            <span className="relative inline-block text-emerald-700 pb-2">
              small, daily choices.
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-3 text-sun pointer-events-none stroke-[3]"
                color="#FBBF24"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed max-w-2xl mx-auto font-sans">
            Mornings are fast-paced. Humming Drops turns daily whole-food nutrition into an effortless, uplifting habit you never have to think twice about.
          </p>
        </div>

        {/* Visual Comparison: The Morning Rush vs The Humming Drops Ritual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: The Morning Rush (Without Humming Drops) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-stone-50/90 border border-stone-200/80 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-200/80 text-stone-700 border border-stone-300/60 text-xs font-bold tracking-wider uppercase">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>The Morning Rush</span>
                </span>
                <span className="text-xs text-stone-500 font-semibold">Without Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                Morning friction gets in the way of your nutrition
              </h3>

              {/* 3 Friction Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/70 text-xs sm:text-sm text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-bold">Alarm Snooze &amp; Kitchen Rush:</strong>
                    No time to peel, slice, or wash fresh fruits and vegetables before work.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/70 text-xs sm:text-sm text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-bold">Grocery Waste &amp; Spoiled Food:</strong>
                    Buying produce in bulk leads to half of it spoiling in the fridge.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/70 text-xs sm:text-sm text-stone-700 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-bold">Low Energy &amp; Sugar Crashes:</strong>
                    Skipping natural fruits and sprouts leads to morning fatigue.
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 font-medium pt-2">
              Result: Inconsistent nutrition, food waste, and morning stress.
            </p>
          </div>

          {/* Card 2: The Effortless Ritual */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F392B] via-[#144A37] to-[#0A261D] text-white border border-emerald-600/30 shadow-floating flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Soft Ambient Inner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 text-[#07241A] text-xs font-black tracking-wider uppercase shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#07241A]" />
                  <span>The Effortless Ritual</span>
                </span>
                <span className="text-xs text-emerald-300 font-bold">With Humming Drops</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                Your daily nutrition &amp; mental wellness, ready when you wake up
              </h3>

              {/* 4 Equal Value Pillars: Body & Mind */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs sm:text-sm text-emerald-50 shadow-2xs hover:bg-white/[0.12] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Dawn Nutrition by 7:30 AM:</strong>
                    Fresh-cut fruits, veggies, mix salad, sprouts &amp; dry fruits delivered to your doorstep.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs sm:text-sm text-emerald-50 shadow-2xs hover:bg-white/[0.12] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">MedCity Smiles Mental Care:</strong>
                    Doctor-guided sharing sessions, positive coping tools, and a caring support community.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs sm:text-sm text-emerald-50 shadow-2xs hover:bg-white/[0.12] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Free Monthly Lab Checkups:</strong>
                    Doctor-certified blood sugar, cholesterol &amp; blood pressure tests to monitor your vitals.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs sm:text-sm text-emerald-50 shadow-2xs hover:bg-white/[0.12] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Zero Friction, 100% Habit:</strong>
                    No kitchen prep or grocery stress — simply open the lid and nourish both body and mind.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-semibold relative z-10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Result: Natural morning energy, mental peace, and proactive vitality.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
