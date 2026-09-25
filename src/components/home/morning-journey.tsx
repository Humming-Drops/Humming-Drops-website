"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SunMedium, Utensils, Truck, Check, Sparkles, Leaf } from "lucide-react";
import {
  HandwrittenAnnotation,
  GentleWaveDivider,
} from "@/components/ui/doodles";

interface JourneyStep {
  number: string;
  title: string;
  shortCopy: string;
  badge: string;
  icon: React.ElementType;
  accentClass: string;
  bgLightClass: string;
  borderClass: string;
  highlights: string[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Picked fresh",
    shortCopy: "Hand-selected crisp seasonal fruits and vegetables picked fresh at dawn from trusted local growers.",
    badge: "Morning Harvest",
    icon: SunMedium,
    accentClass: "text-citrus",
    bgLightClass: "bg-amber-50",
    borderClass: "border-amber-200",
    highlights: ["Peak Seasonal Freshness", "Hand-Inspected Quality", "Zero Long Cold Storage"],
  },
  {
    number: "02",
    title: "Prepared & packed",
    shortCopy: "Washed, cut, and assembled into 5 crisp compartments with strict culinary hygiene at Berrybeats Cafe.",
    badge: "Culinary Kitchen",
    icon: Utensils,
    accentClass: "text-primary",
    bgLightClass: "bg-mint",
    borderClass: "border-primary/20",
    highlights: ["Meticulously Washed & Sliced", "5 Balanced Compartments", "Hygienic Food-Grade Packing"],
  },
  {
    number: "03",
    title: "Delivered to your door",
    shortCopy: "Arriving at your doorstep every morning before breakfast, ready to enjoy with zero kitchen friction.",
    badge: "Doorstep Delivery",
    icon: Truck,
    accentClass: "text-primary-bright",
    bgLightClass: "bg-mint",
    borderClass: "border-primary/20",
    highlights: ["Reliable Morning Doorstep Arrival", "Ready to Eat Immediately", "Zero Morning Prep Time"],
  },
];

export function MorningJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <section
      id="journey"
      aria-label="How it works"
      className="py-14 sm:py-16 lg:py-24 bg-mint border-y border-[#E2ECE4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[20px] bg-mint border border-[#E2ECE4] text-primary text-xs font-semibold tracking-wide shadow-2xs">
              Simple 3-Step Journey
            </span>
            <HandwrittenAnnotation rotation="-rotate-2" color="text-primary hidden sm:inline-flex">
              From dawn harvest to your doorstep
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight leading-[1.18]">
            How Your Morning Box Reaches You
          </h2>

          <p className="text-base sm:text-lg text-body leading-relaxed max-w-2xl mx-auto font-sans">
            An effortless morning ritual built on daily freshness and care — delivered before your day begins.
          </p>
        </div>

        {/* =========================================================================
            MOBILE VIEW (< sm): Vertical Stacked 3-Step Connected Journey (24px gap)
            ========================================================================= */}
        <div className="block sm:hidden max-w-xl mx-auto relative">
          {/* Vertical Dotted Connecting Line */}
          <div
            className="absolute left-[29px] top-7 bottom-7 w-0 border-l-2 border-dashed border-emerald-300/80 pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="space-y-6 relative z-10">
            {JOURNEY_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.number}
                  className="p-5 rounded-2xl bg-white border border-[#E2ECE4] shadow-card space-y-3.5 relative"
                >
                  {/* Step Number Badge, Icon, Title on one line */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-display font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {step.number}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl ${step.bgLightClass} ${step.accentClass} flex items-center justify-center shrink-0`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-ink leading-tight truncate">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-body leading-relaxed font-sans">
                    {step.shortCopy}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#E2ECE4]/60">
                    {step.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-semibold text-ink"
                      >
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Mobile Produce Quote Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-bright to-primary text-white space-y-2 shadow-card">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-mint" />
                <span className="text-[11px] uppercase font-bold tracking-wider text-mint">
                  Our Founding Belief
                </span>
              </div>
              <blockquote className="text-xs text-white font-medium leading-relaxed italic">
                &ldquo;Achieving optimal health shouldn&apos;t be a struggle. We deliver essential daily nutrition right to your doorstep, making wellness effortless.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP / TABLET VIEW (>= sm): Interactive 3-Step Visual Ribbon & Details
            ========================================================================= */}
        <div className="hidden sm:block">
          <div className="mb-8 sm:mb-10 relative max-w-4xl mx-auto">
            {/* Subtle connecting track on desktop */}
            <div className="hidden sm:block absolute top-1/2 left-8 right-8 h-0.5 bg-[#E2ECE4] -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 relative z-10">
              {JOURNEY_STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.number}
                    onMouseEnter={() => setActiveStepIndex(idx)}
                    onFocus={() => setActiveStepIndex(idx)}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-4 rounded-[20px] border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
                      isActive
                        ? "bg-white border-primary ring-2 ring-primary/20 shadow-md scale-[1.01]"
                        : "bg-white/90 border-[#E2ECE4] hover:bg-white hover:border-primary/40 shadow-2xs"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-xl ${step.bgLightClass} ${step.accentClass} flex items-center justify-center`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-[20px] ${
                          isActive ? "bg-primary text-white" : "bg-mint text-body"
                        }`}
                      >
                        Step {step.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-ink leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs text-body mt-0.5">
                        {step.badge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Balanced Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
            {/* Left Column: Active Step Visual Detail Card (6 cols) */}
            <motion.div
              key={activeStep.number}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:col-span-6 p-6 sm:p-7 rounded-[20px] bg-white border border-[#E2ECE4] shadow-card flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-[20px] ${activeStep.bgLightClass} ${activeStep.accentClass} border ${activeStep.borderClass} flex items-center justify-center font-bold text-lg shadow-2xs`}
                    >
                      <activeStep.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-body">
                        Step {activeStep.number} of 03 · {activeStep.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-ink">
                        {activeStep.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-body leading-relaxed font-sans">
                  {activeStep.shortCopy}
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-body">
                    Key Freshness Highlights:
                  </span>
                  <div className="space-y-1.5">
                    {activeStep.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-[20px] bg-canvas border border-[#E2ECE4] text-xs font-semibold text-ink shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step Navigation Dots */}
              <div className="pt-3 border-t border-[#E2ECE4] flex items-center justify-between text-xs text-body">
                <span>Meticulously prepared every dawn</span>
                <div className="flex items-center gap-1.5">
                  {JOURNEY_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStepIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === activeStepIndex ? "w-6 bg-primary" : "w-2 bg-[#E2ECE4] hover:bg-primary/40"
                      }`}
                      aria-label={`Jump to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Authentic Fresh Produce Frame & Founding Quote (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="relative rounded-[20px] p-3 sm:p-4 bg-white border border-[#E2ECE4] shadow-card flex-1 flex flex-col justify-between">
                <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden bg-mint">
                  <Image
                    src="/images/fresh-produce-prep.jpg"
                    alt="Authentic fresh produce, fruits, and sprouts prepared by Humming Drops"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover object-center"
                  />
                </div>

                <div className="mt-3 px-2 flex items-center justify-between text-xs text-body">
                  <span className="font-semibold text-ink flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    Authentic Fresh Daily Produce
                  </span>
                  <span>Berrybeats Cafe Partner</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-[20px] bg-gradient-to-br from-primary-bright to-primary text-white space-y-2 relative overflow-hidden shadow-card">
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-mint" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-mint">
                      Our Founding Belief
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-white font-medium leading-relaxed italic">
                    &ldquo;Achieving optimal health shouldn&apos;t be a struggle. We deliver essential daily nutrition right to your doorstep, making wellness effortless.&rdquo;
                  </blockquote>
                  <div className="text-[11px] text-mint font-semibold pt-0.5">
                    — Humming Drops Founding Team
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle curved transition */}
      <div className="mt-8 lg:mt-12 -mb-14 lg:-mb-20">
        <GentleWaveDivider fill="#EFFAF2" className="w-full h-8 sm:h-12 text-mint" />
      </div>
    </section>
  );
}
