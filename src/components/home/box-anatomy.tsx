"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Apple, Carrot, Salad, Sprout, Nut, Sparkles, Check, ChevronRight } from "lucide-react";
import { type PlanTier } from "@/types/plans";
import {
  DoodleCircle,
  DoodleSquiggle,
  DoodleArrow,
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
  getHighlights: (tier: PlanTier) => { icon: string; text: string }[];
}

const COMPARTMENTS: Compartment[] = [
  {
    id: "fruits",
    number: "01",
    name: "4 Varieties of Fruits",
    shortTag: "Essential Daily Vitamins",
    icon: Apple,
    colorClass: "text-rose-700",
    bgLightClass: "bg-rose-50",
    borderClass: "border-rose-200",
    gradientClass: "from-rose-500/10 via-rose-50/40 to-white",
    ringClass: "ring-rose-400",
    pulseColor: "bg-rose-400/40",
    hotspot: { x: 30, y: 32 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Four rotating seasonal fruits, freshly cut at dawn for natural morning vitamins and clean hydration.",
    getHighlights: () => [
      { icon: "🍎", text: "4 Rotating Varieties" },
      { icon: "💧", text: "Natural Morning Hydration" },
      { icon: "✨", text: "100% Raw Whole Food" },
    ],
  },
  {
    id: "vegetables",
    number: "02",
    name: "2 Varieties of Vegetables",
    shortTag: "Crisp Morning Crunch",
    icon: Carrot,
    colorClass: "text-amber-700",
    bgLightClass: "bg-amber-50",
    borderClass: "border-amber-200",
    gradientClass: "from-amber-500/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-400",
    pulseColor: "bg-amber-400/40",
    hotspot: { x: 74, y: 34 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Two wholesome raw vegetables, carefully washed and sliced to deliver dietary fiber and minerals.",
    getHighlights: () => [
      { icon: "🥕", text: "2 Wholesome Cuts" },
      { icon: "🌿", text: "Dietary Fiber & Minerals" },
      { icon: "🧼", text: "Washed, Cut & Ready" },
    ],
  },
  {
    id: "salad",
    number: "03",
    name: "Fresh Mix Salad",
    shortTag: "Vibrant Garden Greens",
    icon: Salad,
    colorClass: "text-forest-700",
    bgLightClass: "bg-forest-50",
    borderClass: "border-forest-200",
    gradientClass: "from-forest-500/10 via-forest-50/40 to-white",
    ringClass: "ring-forest-400",
    pulseColor: "bg-forest-400/40",
    hotspot: { x: 26, y: 70 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "A crisp medley of freshly prepared garden greens offering phytonutrient richness and light crunch.",
    getHighlights: () => [
      { icon: "🥗", text: "Fresh Garden Greens" },
      { icon: "🌱", text: "Antioxidant Rich" },
      { icon: "🥣", text: "Ready to Enjoy" },
    ],
  },
  {
    id: "sprouts",
    number: "04",
    name: "Fresh Sprouts",
    shortTag: "Living Plant Goodness",
    icon: Sprout,
    colorClass: "text-emerald-700",
    bgLightClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    gradientClass: "from-emerald-500/10 via-emerald-50/40 to-white",
    ringClass: "ring-emerald-400",
    pulseColor: "bg-emerald-400/40",
    hotspot: { x: 52, y: 72 },
    getFrequency: () => "Every Single Day",
    getShortSummary: () =>
      "Nutrient-dense live sprouted pulses cultivated with strict hygiene to deliver bioavailable morning energy.",
    getHighlights: () => [
      { icon: "🌱", text: "Live Sprouted Pulses" },
      { icon: "⚡", text: "Bioavailable Energy" },
      { icon: "🛡️", text: "Clean Daily Cultivation" },
    ],
  },
  {
    id: "dry-fruits",
    number: "05",
    name: "Dry Fruits",
    shortTag: "Brain Fuel & Cognitive Stamina",
    icon: Nut,
    colorClass: "text-amber-800",
    bgLightClass: "bg-amber-100/70",
    borderClass: "border-amber-300",
    gradientClass: "from-amber-600/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-500",
    pulseColor: "bg-amber-500/40",
    hotspot: { x: 80, y: 72 },
    getFrequency: (tier: PlanTier) =>
      tier === "premium" ? "Every Single Day (Daily)" : "3 Days a Week",
    getShortSummary: (tier: PlanTier) =>
      tier === "premium"
        ? "Nutritious serving of dry fruits delivered every day on the Premium Plan for lasting cognitive fuel."
        : "Wholesome dry fruits included 3 days a week on the Standard Plan to support stamina and heart health.",
    getHighlights: (tier: PlanTier) =>
      tier === "premium"
        ? [
            { icon: "🥜", text: "Nutritious Serving Daily" },
            { icon: "⭐", text: "Premium Daily Perk" },
            { icon: "🧠", text: "Lasting Brain Fuel" },
          ]
        : [
            { icon: "🥜", text: "Wholesome Serving" },
            { icon: "📅", text: "3 Days a Week (Standard)" },
            { icon: "🧠", text: "Brain & Stamina Support" },
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
      className="py-14 lg:py-20 bg-white relative overflow-hidden"
    >
      {/* Anchor compatibility */}
      <div id="box-anatomy" className="sr-only" aria-hidden="true" />

      {/* Decorative soft backdrop circles */}
      <div
        className="pointer-events-none absolute top-12 right-0 w-80 h-80 bg-forest-50/60 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-12 left-0 w-80 h-80 bg-amber-50/40 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold tracking-wide">
              Meticulously Curated Nutrition
            </span>
            <HandwrittenAnnotation rotation="rotate-2" color="text-amber-700 hidden sm:inline-flex">
              Tap any compartment to explore! ✦
            </HandwrittenAnnotation>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 tracking-tight">
            What is Inside Your Daily Box?
          </h2>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-2xl mx-auto">
            5 distinct nutritional compartments, prepared fresh from wholesome produce and delivered to your doorstep every morning.
          </p>

          {/* Interactive Standard vs Premium Toggle */}
          <div className="pt-2 flex items-center justify-center w-full px-2">
            <div
              role="tablist"
              aria-label="Subscription Plan View"
              className="p-1 rounded-full bg-forest-100/70 border border-forest-200 flex items-center gap-1 shadow-xs max-w-full"
            >
              <button
                role="tab"
                aria-selected={selectedTier === "standard"}
                onClick={() => setSelectedTier("standard")}
                className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedTier === "standard"
                    ? "bg-leaf-500 text-white shadow-sm"
                    : "text-forest-800 hover:text-forest-900 hover:bg-forest-50"
                }`}
              >
                <span>Standard</span>
                <span className="hidden sm:inline"> Plan (₹3,500/mo)</span>
              </button>
              <button
                role="tab"
                aria-selected={selectedTier === "premium"}
                onClick={() => setSelectedTier("premium")}
                className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  selectedTier === "premium"
                    ? "bg-amber-700 text-white shadow-sm"
                    : "text-amber-900 hover:text-amber-950 hover:bg-amber-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Premium</span>
                <span className="hidden sm:inline"> Plan (₹4,000/mo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compartment Pill Navigation (Horizontal / Touch Friendly) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {COMPARTMENTS.map((c) => {
            const Icon = c.icon;
            const isSelected = c.id === activeCompartmentId;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActiveCompartmentId(c.id)}
                onFocus={() => setActiveCompartmentId(c.id)}
                onClick={() => setActiveCompartmentId(c.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                  isSelected
                    ? "bg-leaf-500 text-white border-leaf-500 shadow-sm scale-105"
                    : "bg-surface text-forest-800 border-forest-200 hover:bg-forest-50"
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : c.colorClass}`} />
                <span>{c.name}</span>
                {c.id === "dry-fruits" && selectedTier === "premium" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                    Daily
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Experience Grid: Box Image with Hotspots on Left, Dynamic Reveal Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Interactive Image with Communicative Hotspot Beacons (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-3xl p-3 sm:p-4 bg-canvas border border-forest-200/90 shadow-card overflow-hidden flex-1 flex flex-col justify-between">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-forest-50/40">
                <Image
                  src="/images/humming-drops-box.png"
                  alt="Authentic Humming Drops 5-Compartment Breakfast Box"
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover object-center"
                />

                {/* Hotspot Beacons overlaying the 5 compartments with dynamic pulse */}
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
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                      aria-label={`Select compartment ${c.number}: ${c.name}`}
                    >
                      {/* Pulse ring in compartment's produce color */}
                      {isSelected && !shouldReduceMotion && (
                        <span
                          className={`absolute -inset-2.5 rounded-full ${c.pulseColor} animate-ping`}
                        />
                      )}

                      {/* Hotspot Pin */}
                      <span
                        className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-display font-extrabold text-xs shadow-md transition-all duration-200 ${
                          isSelected
                            ? `bg-leaf-500 text-white ring-4 ring-white ${c.ringClass} scale-110 shadow-lg`
                            : "bg-surface/95 text-forest-900 border border-forest-300 hover:scale-110 hover:bg-forest-50"
                        }`}
                      >
                        {c.number}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Interactive Bar */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-content-muted">
                <span className="font-semibold text-content-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
                  Tap numbers to inspect compartments
                </span>
                <span>Authentic 5-Compartment Box</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Compartment Reveal Card with Visual Chips (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCompartment.id + selectedTier}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${activeCompartment.gradientClass} border ${activeCompartment.borderClass} shadow-card flex-1 flex flex-col justify-between space-y-5`}
              >
                {/* Header Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-11 h-11 rounded-2xl ${activeCompartment.bgLightClass} ${activeCompartment.colorClass} border ${activeCompartment.borderClass} flex items-center justify-center font-display font-black text-base shadow-xs`}
                      >
                        {activeCompartment.number}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                          Compartment {activeCompartment.number} of 05
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-forest-900 leading-tight">
                          {activeCompartment.name}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-2xl ${activeCompartment.bgLightClass} flex items-center justify-center shadow-xs`}
                    >
                      <activeCompartment.icon
                        className={`w-5 h-5 ${activeCompartment.colorClass}`}
                      />
                    </div>
                  </div>

                  {/* Frequency Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-line-subtle text-xs font-semibold text-content-primary shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                    <span>Frequency:</span>
                    <span className="font-bold text-forest-900">
                      {activeCompartment.getFrequency(selectedTier)}
                    </span>
                  </div>

                  {/* Short 1-Sentence Summary */}
                  <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-sans pt-1">
                    {activeCompartment.getShortSummary(selectedTier)}
                  </p>
                </div>

                {/* 3 Meaningful Visual Highlight Chips */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                    Freshness Highlights:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeCompartment.getHighlights(selectedTier).map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-line-subtle text-xs font-semibold text-content-primary shadow-xs"
                      >
                        <span className="text-sm shrink-0">{h.icon}</span>
                        <span>{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Specific Notice for Dry Fruits */}
                {activeCompartment.id === "dry-fruits" && (
                  <div className="p-3 rounded-2xl bg-amber-100/70 border border-amber-300/80 text-xs text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      <span>Standard vs. Premium Dry Fruits:</span>
                    </div>
                    <p className="text-[11px] leading-tight">
                      <strong>Standard Plan:</strong> 3 days a week. · <strong>Premium Plan:</strong> Nutritious serving every single day.
                    </p>
                  </div>
                )}

                {/* Quick 5-Compartment Bottom Bar (fills right column and eliminates dead space) */}
                <div className="pt-3 border-t border-line-subtle flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {COMPARTMENTS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveCompartmentId(c.id)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          c.id === activeCompartment.id
                            ? "bg-leaf-500 text-white shadow-xs"
                            : "bg-white/90 text-forest-800 hover:bg-white"
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
                    className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
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
        <p className="text-xs text-center text-content-muted mt-8 max-w-2xl mx-auto">
          * Daily fruit and vegetable varieties rotate based on morning market freshness and seasonal availability to ensure natural diversity.
        </p>
      </div>

      {/* Gentle Wave transition into Morning Journey */}
      <div className="mt-8 lg:mt-12 -mb-14 lg:-mb-20">
        <GentleWaveDivider fill="#fdfcf7" className="w-full h-8 sm:h-12 text-canvas" />
      </div>
    </section>
  );
}

