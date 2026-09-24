"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SunMedium, Utensils, Package, Truck, HeartPulse, Sparkles, Check } from "lucide-react";
import {
  DoodleArrow,
  DoodleCircle,
  DoodleSprout,
  HandwrittenAnnotation,
  GentleWaveDivider,
} from "@/components/ui/doodles";

interface JourneyStep {
  number: string;
  emoji: string;
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
    emoji: "☀️",
    title: "Dawn Selection",
    shortCopy: "Hand-selected crisp seasonal fruits & vegetables picked fresh every dawn.",
    badge: "Morning Harvest",
    icon: SunMedium,
    accentClass: "text-amber-700",
    bgLightClass: "bg-amber-50",
    borderClass: "border-amber-200",
    highlights: ["Peak Seasonal Freshness", "Hand-Inspected Quality", "Zero Long Storage"],
  },
  {
    number: "02",
    emoji: "🥗",
    title: "Thoughtful Prep",
    shortCopy: "Washed, cut, and assembled with strict culinary hygiene at Berrybeats Cafe.",
    badge: "Berrybeats Cafe",
    icon: Utensils,
    accentClass: "text-forest-700",
    bgLightClass: "bg-forest-50",
    borderClass: "border-forest-200",
    highlights: ["Meticulously Washed & Sliced", "Hygienic Food-Grade Prep", "Prepared Fresh Every Morning"],
  },
  {
    number: "03",
    emoji: "📦",
    title: "5-Compartment Box",
    shortCopy: "Balanced morning nutrition packed into fresh, crisp compartments.",
    badge: "The Breakfast Box",
    icon: Package,
    accentClass: "text-emerald-700",
    bgLightClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    highlights: ["4 Fruits & 2 Crisp Veggies", "Mix Salad & Fresh Sprouts", "Wholesome Dry Fruits"],
  },
  {
    number: "04",
    emoji: "🏠",
    title: "Doorstep Delivery",
    shortCopy: "Delivered straight to your home every morning before breakfast.",
    badge: "Morning Doorstep",
    icon: Truck,
    accentClass: "text-teal-700",
    bgLightClass: "bg-teal-50",
    borderClass: "border-teal-200",
    highlights: ["Reliable Morning Delivery", "Ready to Eat Immediately", "Zero Morning Kitchen Friction"],
  },
  {
    number: "05",
    emoji: "🙂",
    title: "Nourish Body & Mind",
    shortCopy: "Clean daily fuel paired with free monthly health vitals & MedCity Smiles.",
    badge: "Mind & Body",
    icon: HeartPulse,
    accentClass: "text-rose-700",
    bgLightClass: "bg-rose-50",
    borderClass: "border-rose-200",
    highlights: ["Sustained Morning Vitality", "Free Monthly Health Vitals", "MedCity Smiles Community"],
  },
];

export function MorningJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <section
      id="journey"
      aria-label="The Morning Journey"
      className="py-14 lg:py-20 bg-canvas relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold tracking-wide">
              Dawn to Doorstep
            </span>
            <HandwrittenAnnotation rotation="-rotate-2" color="text-forest-700 hidden sm:inline-flex">
              From market harvest to your morning ✦
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 tracking-tight">
            How Your Morning Box Reaches You
          </h2>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-2xl mx-auto">
            An effortless morning ritual built on daily dedication — communicating our journey from sunrise to your doorstep.
          </p>
        </div>

        {/* 5-Step Interactive Visual Flow Ribbon */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 max-w-5xl mx-auto">
            {JOURNEY_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const Icon = step.icon;

              return (
                <button
                  key={step.number}
                  onMouseEnter={() => setActiveStepIndex(idx)}
                  onFocus={() => setActiveStepIndex(idx)}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                    isActive
                      ? "bg-white border-forest-500 ring-2 ring-forest-500/20 shadow-md scale-[1.02]"
                      : "bg-surface/80 border-line-subtle hover:bg-white hover:border-forest-200 shadow-xs"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{step.emoji}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? "bg-leaf-500 text-white" : "bg-canvas text-content-muted"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-forest-900 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-content-muted hidden sm:block mt-0.5">
                      {step.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Balanced Showcase: Left Active Step Details, Right Produce Image & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Column: Active Step Visual Detail Card (6 cols) */}
          <motion.div
            key={activeStep.number}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border ${activeStep.borderClass} shadow-card flex flex-col justify-between space-y-6`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${activeStep.bgLightClass} ${activeStep.accentClass} flex items-center justify-center font-bold text-xl shadow-xs`}
                  >
                    <activeStep.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                      Step {activeStep.number} of 05 · {activeStep.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-forest-900">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Short 1-Sentence Punchy Copy */}
              <p className="text-base text-content-secondary leading-relaxed font-sans">
                {activeStep.shortCopy}
              </p>

              {/* 3 Visual Highlight Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                  Key Milestones:
                </span>
                <div className="space-y-2">
                  {activeStep.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-canvas border border-line-subtle text-xs font-semibold text-content-primary shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Navigation Pill */}
            <div className="pt-4 border-t border-line-subtle flex items-center justify-between text-xs text-content-muted">
              <span>Meticulously prepared every dawn</span>
              <div className="flex items-center gap-1">
                {JOURNEY_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeStepIndex ? "w-6 bg-leaf-500" : "bg-forest-200 hover:bg-forest-400"
                    }`}
                    aria-label={`Jump to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentic Fresh Produce Frame & Editorial Founding Quote (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {/* Authentic Fresh Produce Image Container */}
            <div className="relative rounded-3xl p-3 sm:p-4 bg-white border border-forest-200 shadow-card flex-1 flex flex-col justify-between">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-forest-50">
                <Image
                  src="/images/humming-drops-fresh-produce.png"
                  alt="Authentic fresh produce and fruits prepared by Humming Drops"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center"
                />
              </div>

              {/* Photo Caption */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-content-muted">
                <span className="font-semibold text-content-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
                  Authentic Fresh Daily Produce
                </span>
                <span>Berrybeats Cafe Partner</span>
              </div>
            </div>

            {/* Handcrafted Quote Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-leaf-700 text-white space-y-2 relative overflow-hidden shadow-card">
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-forest-200">
                    Our Founding Belief
                  </span>
                </div>
                <blockquote className="text-xs sm:text-sm text-forest-50 font-medium leading-relaxed italic">
                  &ldquo;Achieving optimal health shouldn&apos;t be a struggle. We deliver essential daily nutrition right to your doorstep, making wellness effortless.&rdquo;
                </blockquote>
                <div className="text-[11px] text-forest-300 font-semibold pt-0.5">
                  — Humming Drops Official Brochure (Page 2)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle curved transition into Why Humming Drops */}
      <div className="mt-8 lg:mt-12 -mb-14 lg:-mb-20">
        <GentleWaveDivider fill="#ffffff" className="w-full h-8 sm:h-12 text-white" />
      </div>
    </section>
  );
}

