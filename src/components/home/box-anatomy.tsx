"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Leaf, Sparkles, Heart, Sun, Check, ChevronRight, ShieldCheck, Apple, Droplets, Utensils } from "lucide-react";
import { type PlanTier } from "@/types/plans";
import {
  HandwrittenAnnotation,
  GentleWaveDivider,
} from "@/components/ui/doodles";

interface Compartment {
  id: string;
  number: string;
  name: string;
  shortTag: string;
  icon: React.ElementType;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  gradientClass: string;
  ringClass: string;
  pulseColor: string;
  hotspot: { x: number; y: number };
  getFrequency: (tier: PlanTier) => string;
  getShortSummary: (tier: PlanTier) => string;
  getHighlights: (tier: PlanTier) => { icon: React.ElementType; text: string }[];
}

const COMPARTMENTS: Compartment[] = [
  {
    id: "fruits",
    number: "01",
    name: "4 Varieties of Fruits",
    shortTag: "Essential Daily Vitamins",
    icon: Sparkles,
    colorClass: "text-rose-600",
    bgLightClass: "bg-rose-50",
    borderClass: "border-rose-200",
    gradientClass: "from-rose-500/10 via-rose-50/40 to-white",
    ringClass: "ring-rose-400",
    pulseColor: "bg-rose-400/40",
    hotspot: { x: 30, y: 32 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Four rotating seasonal fruits, freshly cut at dawn for natural morning vitamins, hydration, and clean energy.",
    getHighlights: () => [
      { icon: Apple, text: "4 Rotating Varieties Daily" },
      { icon: Droplets, text: "Natural Morning Hydration" },
      { icon: Sparkles, text: "100% Raw Whole Produce" },
    ],
  },
  {
    id: "vegetables",
    number: "02",
    name: "2 Varieties of Vegetables",
    shortTag: "Crisp Morning Crunch",
    icon: Leaf,
    colorClass: "text-amber-600",
    bgLightClass: "bg-amber-50",
    borderClass: "border-amber-200",
    gradientClass: "from-amber-500/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-400",
    pulseColor: "bg-amber-400/40",
    hotspot: { x: 74, y: 34 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Two wholesome raw vegetables, carefully washed, peeled, and sliced to deliver natural dietary fiber and minerals.",
    getHighlights: () => [
      { icon: Leaf, text: "2 Wholesome Crisp Cuts" },
      { icon: Sparkles, text: "Dietary Fiber & Essential Minerals" },
      { icon: Check, text: "Triple-Washed, Peeled & Ready" },
    ],
  },
  {
    id: "salad",
    number: "03",
    name: "Fresh Mix Salad",
    shortTag: "Vibrant Garden Greens",
    icon: Leaf,
    colorClass: "text-emerald-700",
    bgLightClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    gradientClass: "from-emerald-500/10 via-emerald-50/40 to-white",
    ringClass: "ring-emerald-400",
    pulseColor: "bg-emerald-400/40",
    hotspot: { x: 26, y: 70 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "A crisp medley of freshly prepared garden greens offering phytonutrient richness and light refreshing crunch.",
    getHighlights: () => [
      { icon: Leaf, text: "Fresh Garden Greens" },
      { icon: Sparkles, text: "Antioxidant & Phytonutrient Rich" },
      { icon: Utensils, text: "Ready to Enjoy Instantly" },
    ],
  },
  {
    id: "sprouts",
    number: "04",
    name: "Fresh Sprouts",
    shortTag: "Living Plant Goodness",
    icon: Leaf,
    colorClass: "text-emerald-700",
    bgLightClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    gradientClass: "from-emerald-500/10 via-emerald-50/40 to-white",
    ringClass: "ring-emerald-400",
    pulseColor: "bg-emerald-400/40",
    hotspot: { x: 52, y: 72 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Nutrient-dense live sprouted pulses cultivated with strict hygiene to deliver bioavailable morning energy and clean protein.",
    getHighlights: () => [
      { icon: Leaf, text: "Live Sprouted Pulses" },
      { icon: Sparkles, text: "Bioavailable Plant Protein" },
      { icon: ShieldCheck, text: "Clean Daily Cultivation" },
    ],
  },
  {
    id: "dry-fruits",
    number: "05",
    name: "Dry Fruits & Nuts",
    shortTag: "Brain Fuel & Cognitive Stamina",
    icon: Sun,
    colorClass: "text-amber-700",
    bgLightClass: "bg-amber-100/70",
    borderClass: "border-amber-300",
    gradientClass: "from-amber-600/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-500",
    pulseColor: "bg-amber-500/40",
    hotspot: { x: 80, y: 72 },
    getFrequency: (tier: PlanTier) =>
      tier === "premium" ? "Every Single Day (Daily)" : "3 Days a Week (Standard)",
    getShortSummary: (tier: PlanTier) =>
      tier === "premium"
        ? "Generous serving of premium almonds, walnuts, and raisins delivered every day for lasting mental focus."
        : "Wholesome dry fruits included 3 days a week on the Standard Plan to support sustained stamina.",
    getHighlights: (tier: PlanTier) =>
      tier === "premium"
        ? [
            { icon: Sparkles, text: "Premium Almonds & Walnuts Daily" },
            { icon: Check, text: "Premium Plan Daily Feature" },
            { icon: Heart, text: "Sustained Cognitive Energy" },
          ]
        : [
            { icon: Sparkles, text: "Wholesome Dry Fruit Serving" },
            { icon: Check, text: "3 Days a Week (Standard)" },
            { icon: Heart, text: "Brain & Heart Vitality" },
          ],
  },
];

export function BoxAnatomy() {
  const [selectedTier, setSelectedTier] = useState<PlanTier>("standard");
  const [activeCompartmentId, setActiveCompartmentId] = useState<string>("fruits");
  const shouldReduceMotion = useReducedMotion();

  const activeCompartment =
    COMPARTMENTS.find((c) => c.id === activeCompartmentId) || COMPARTMENTS[0];

  return (
    <section
      id="box-experience"
      aria-label="What is Inside Your Daily Box"
      className="py-16 sm:py-20 lg:py-24 bg-[#FCFDF9] border-b border-[#E3EFE5] relative overflow-hidden"
    >
      <div id="box-anatomy" className="sr-only" aria-hidden="true" />

      {/* Decorative soft backdrop blurs */}
      <div
        className="pointer-events-none absolute top-12 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-12 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              Meticulously Curated Nutrition
            </span>
            <HandwrittenAnnotation rotation="rotate-2" color="text-emerald-700 hidden sm:inline-flex">
              Tap any compartment to explore! ✦
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-[2rem] sm:text-3xl lg:text-4xl font-extrabold text-[#132A1C] tracking-tight leading-[1.16]">
            What is Inside Your Daily Box?
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed max-w-2xl mx-auto font-sans">
            5 distinct nutritional compartments, freshly prepared every morning and delivered straight to your door.
          </p>

          {/* Interactive Standard vs Premium Toggle */}
          <div className="pt-2 flex items-center justify-center w-full max-w-sm mx-auto">
            <div
              role="tablist"
              aria-label="Subscription Plan View"
              className="p-1 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1 shadow-2xs w-full"
            >
              <button
                role="tab"
                aria-selected={selectedTier === "standard"}
                onClick={() => setSelectedTier("standard")}
                className={`flex-1 min-h-[42px] px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                  selectedTier === "standard"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[#405347] hover:text-[#132A1C] hover:bg-white/60"
                }`}
              >
                <span>Standard</span>
                <span className="hidden xs:inline"> (₹3,500/mo)</span>
              </button>
              <button
                role="tab"
                aria-selected={selectedTier === "premium"}
                onClick={() => setSelectedTier("premium")}
                className={`flex-1 min-h-[42px] px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer text-center ${
                  selectedTier === "premium"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-[#405347] hover:text-[#132A1C] hover:bg-white/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Premium</span>
                <span className="hidden xs:inline"> (₹4,000/mo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compartment Pill Navigation */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory no-scrollbar scroll-smooth px-1">
          {COMPARTMENTS.map((c) => {
            const Icon = c.icon;
            const isSelected = c.id === activeCompartmentId;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActiveCompartmentId(c.id)}
                onFocus={() => setActiveCompartmentId(c.id)}
                onClick={() => setActiveCompartmentId(c.id)}
                className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-[#405347] border-[#E3EFE5] hover:bg-emerald-50 hover:text-emerald-800"
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : c.colorClass}`} />
                <span>{c.name}</span>
                {c.id === "dry-fruits" && selectedTier === "premium" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-black">
                    Daily
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Interactive Image with Hotspots */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-3xl p-3 sm:p-4 bg-white border border-[#E3EFE5] shadow-card overflow-hidden flex-1 flex flex-col justify-between">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-emerald-50">
                <Image
                  src="/images/humming-drops-box.png"
                  alt="Authentic Humming Drops 5-Compartment Breakfast Box"
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover object-center"
                />

                {/* Hotspot Beacons */}
                {COMPARTMENTS.map((c) => {
                  const isSelected = c.id === activeCompartmentId;
                  return (
                    <button
                      key={c.id}
                      onMouseEnter={() => setActiveCompartmentId(c.id)}
                      onFocus={() => setActiveCompartmentId(c.id)}
                      onClick={() => setActiveCompartmentId(c.id)}
                      style={{
                        top: `${c.hotspot.y}%`,
                        left: `${c.hotspot.x}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                      aria-label={`Select compartment ${c.number}: ${c.name}`}
                    >
                      {isSelected && !shouldReduceMotion && (
                        <span
                          className={`absolute -inset-2.5 rounded-full ${c.pulseColor} animate-ping`}
                        />
                      )}

                      <span
                        className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-display font-black text-xs shadow-md transition-all duration-200 ${
                          isSelected
                            ? `bg-emerald-600 text-white ring-4 ring-white ${c.ringClass} scale-110 shadow-lg`
                            : "bg-white/95 text-[#132A1C] border border-[#E3EFE5] hover:scale-110 hover:bg-emerald-50"
                        }`}
                      >
                        {c.number}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Interactive Bar */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-[#657B6F]">
                <span className="font-bold text-[#132A1C] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Tap numbers to inspect each fresh compartment
                </span>
                <span className="font-medium">5-Compartment Fresh Box</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Compartment Reveal Card */}
          <div className="lg:col-span-5 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCompartment.id + selectedTier}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E3EFE5] shadow-card flex-1 flex flex-col justify-between space-y-4"
              >
                {/* Header Row */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-11 h-11 rounded-2xl ${activeCompartment.bgLightClass} ${activeCompartment.colorClass} border ${activeCompartment.borderClass} flex items-center justify-center font-display font-black text-sm shadow-2xs`}
                      >
                        {activeCompartment.number}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#657B6F]">
                          Compartment {activeCompartment.number} of 05
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#132A1C] leading-tight">
                          {activeCompartment.name}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-2xl ${activeCompartment.bgLightClass} flex items-center justify-center shadow-2xs`}
                    >
                      <activeCompartment.icon
                        className={`w-5 h-5 ${activeCompartment.colorClass}`}
                      />
                    </div>
                  </div>

                  {/* Frequency Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#132A1C]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[#657B6F]">Frequency:</span>
                    <span className="font-bold text-emerald-800">
                      {activeCompartment.getFrequency(selectedTier)}
                    </span>
                  </div>

                  {/* Short Summary */}
                  <p className="text-sm sm:text-base text-[#405347] leading-relaxed pt-0.5">
                    {activeCompartment.getShortSummary(selectedTier)}
                  </p>
                </div>

                {/* Visual Highlight Chips */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A1C]">
                    Freshness Highlights:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeCompartment.getHighlights(selectedTier).map((h, i) => {
                      const HighlightIcon = h.icon;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#FCFDF9] border border-[#E3EFE5] text-xs font-semibold text-[#132A1C] shadow-2xs"
                        >
                          <HighlightIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Plan Specific Notice for Dry Fruits */}
                {activeCompartment.id === "dry-fruits" && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Standard vs. Premium Dry Fruits:</span>
                    </div>
                    <p className="text-[11px] leading-tight text-[#405347]">
                      <strong>Standard Plan:</strong> 3 days a week. · <strong>Premium Plan:</strong> Generous serving every day.
                    </p>
                  </div>
                )}

                {/* Quick 5-Compartment Bottom Bar */}
                <div className="pt-3 border-t border-[#E3EFE5] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {COMPARTMENTS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveCompartmentId(c.id)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          c.id === activeCompartment.id
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "bg-emerald-50 text-[#132A1C] hover:bg-emerald-100"
                        }`}
                        title={c.name}
                        aria-label={`Go to ${c.name}`}
                      >
                        {c.number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const currentIndex = COMPARTMENTS.findIndex(
                        (c) => c.id === activeCompartment.id
                      );
                      const nextIndex = (currentIndex + 1) % COMPARTMENTS.length;
                      setActiveCompartmentId(COMPARTMENTS[nextIndex].id);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Seasonal Disclaimer */}
        <p className="text-xs text-center text-[#657B6F] mt-8 max-w-2xl mx-auto">
          * Daily fruit and vegetable varieties rotate based on morning market freshness and seasonal peak to ensure natural diversity.
        </p>
      </div>

      {/* Gentle Wave transition */}
      <div className="mt-10 lg:mt-14 -mb-16 lg:-mb-24">
        <GentleWaveDivider fill="#F0FDF4" className="w-full h-8 sm:h-12 text-canvas" />
      </div>
    </section>
  );
}
