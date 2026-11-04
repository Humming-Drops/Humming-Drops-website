"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Leaf, Sparkles, Heart, Sun, Check, ChevronRight, ShieldCheck, Apple, Droplets, Utensils, CalendarOff } from "lucide-react";
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
  getFrequency: () => string;
  getShortSummary: () => string;
  getHighlights: () => { icon: React.ElementType; text: string }[];
}

const COMPARTMENTS: Compartment[] = [
  {
    id: "fruits",
    number: "01",
    name: "5 Varieties of Fruits",
    shortTag: "Essential Vitamins on Box Days",
    icon: Sparkles,
    colorClass: "text-rose-600",
    bgLightClass: "bg-rose-50",
    borderClass: "border-rose-200",
    gradientClass: "from-rose-500/10 via-rose-50/40 to-white",
    ringClass: "ring-rose-400",
    pulseColor: "bg-rose-400/40",
    hotspot: { x: 30, y: 32 },
    getFrequency: () => "4 Days a Week",
    getShortSummary: () =>
      "Five rotating seasonal fruits, freshly cut at dawn, included every Fruit & Vegetable Box day for natural vitamins, hydration, and clean energy.",
    getHighlights: () => [
      { icon: Apple, text: "5 Rotating Varieties" },
      { icon: Droplets, text: "Natural Morning Hydration" },
      { icon: Sparkles, text: "100% Raw Whole Produce" },
    ],
  },
  {
    id: "vegetables",
    number: "02",
    name: "3 Varieties of Vegetables",
    shortTag: "Crisp Morning Crunch",
    icon: Leaf,
    colorClass: "text-amber-600",
    bgLightClass: "bg-amber-50",
    borderClass: "border-amber-200",
    gradientClass: "from-amber-500/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-400",
    pulseColor: "bg-amber-400/40",
    hotspot: { x: 74, y: 34 },
    getFrequency: () => "4 Days a Week",
    getShortSummary: () =>
      "Three wholesome raw vegetables, carefully washed, peeled, and sliced to deliver natural dietary fiber and minerals on every box day.",
    getHighlights: () => [
      { icon: Leaf, text: "3 Wholesome Crisp Cuts" },
      { icon: Sparkles, text: "Dietary Fiber & Essential Minerals" },
      { icon: Check, text: "Triple-Washed, Peeled & Ready" },
    ],
  },
  {
    id: "sprouts",
    number: "03",
    name: "Mixed Sprouts Portion",
    shortTag: "Living Plant Goodness",
    icon: Leaf,
    colorClass: "text-emerald-700",
    bgLightClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    gradientClass: "from-emerald-500/10 via-emerald-50/40 to-white",
    ringClass: "ring-emerald-400",
    pulseColor: "bg-emerald-400/40",
    hotspot: { x: 52, y: 72 },
    getFrequency: () => "4 Days a Week",
    getShortSummary: () =>
      "A nutrient-dense portion of live sprouted pulses, cultivated with strict hygiene, delivering bioavailable morning energy and clean protein on box days.",
    getHighlights: () => [
      { icon: Leaf, text: "Live Sprouted Pulses" },
      { icon: Sparkles, text: "Bioavailable Plant Protein" },
      { icon: ShieldCheck, text: "Clean Daily Cultivation" },
    ],
  },
  {
    id: "dry-fruits",
    number: "04",
    name: "Dry Fruits Mix",
    shortTag: "Brain Fuel & Cognitive Stamina",
    icon: Sun,
    colorClass: "text-amber-700",
    bgLightClass: "bg-amber-100/70",
    borderClass: "border-amber-300",
    gradientClass: "from-amber-600/10 via-amber-50/40 to-white",
    ringClass: "ring-amber-500",
    pulseColor: "bg-amber-500/40",
    hotspot: { x: 80, y: 72 },
    getFrequency: () => "Included on Both Box & Oats Days",
    getShortSummary: () =>
      "A wholesome dry fruits mix included with your Fruit & Vegetable Box and alongside your Healthy Oats Meal, for sustained stamina.",
    getHighlights: () => [
      { icon: Sparkles, text: "Wholesome Dry Fruit Serving" },
      { icon: Check, text: "Included Every Delivery Day" },
      { icon: Heart, text: "Brain & Heart Vitality" },
    ],
  },
  {
    id: "oats",
    number: "05",
    name: "Healthy Oats Meal",
    shortTag: "A Wholesome Weekly Change-Up",
    icon: Utensils,
    colorClass: "text-orange-700",
    bgLightClass: "bg-orange-50",
    borderClass: "border-orange-200",
    gradientClass: "from-orange-500/10 via-orange-50/40 to-white",
    ringClass: "ring-orange-400",
    pulseColor: "bg-orange-400/40",
    hotspot: { x: 50, y: 50 },
    getFrequency: () => "2 Days a Week",
    getShortSummary: () =>
      "A nutritious oats-based breakfast meal, served with fruits and dry fruits, replacing the Fruit & Vegetable Box on 2 days of the week.",
    getHighlights: () => [
      { icon: Utensils, text: "Wholesome Oats Base" },
      { icon: Apple, text: "Served with Fruits" },
      { icon: Sparkles, text: "Topped with Dry Fruits" },
    ],
  },
];

export function BoxAnatomy() {
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
            4 days a week, a fresh fruit &amp; vegetable box. 2 days a week, a healthy oats meal. Freshly prepared
            every morning and delivered straight to your door.
          </p>

          {/* Sunday Closure Notice */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm font-bold shadow-2xs">
            <CalendarOff className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>We&apos;re closed every Sunday — no deliveries on Sundays</span>
          </div>
        </div>

        {/* Compartment Pill Navigation */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory no-scrollbar scroll-smooth -mx-5 px-5 sm:mx-0 sm:px-0">
          {COMPARTMENTS.map((c) => {
            const Icon = c.icon;
            const isSelected = c.id === activeCompartmentId;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActiveCompartmentId(c.id)}
                onFocus={() => setActiveCompartmentId(c.id)}
                onClick={() => setActiveCompartmentId(c.id)}
                className={`shrink-0 snap-start flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-[#405347] border-[#E3EFE5] hover:bg-emerald-50 hover:text-emerald-800"
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : c.colorClass}`} />
                <span>{c.name}</span>
                {c.id === "oats" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500 text-white font-black">
                    2 Days
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
                  alt="Authentic Humming Drops Fresh Fruit & Vegetable Box"
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover object-center"
                />

                {/* Hotspot Beacons — only the 4 Fruit & Vegetable Box compartments shown in this photo */}
                {COMPARTMENTS.filter((c) => c.id !== "oats").map((c) => {
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
                <span className="font-medium">4-Compartment Fresh Box</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Compartment Reveal Card */}
          <div className="lg:col-span-5 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCompartment.id}
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
                      {activeCompartment.getFrequency()}
                    </span>
                  </div>

                  {/* Short Summary */}
                  <p className="text-sm sm:text-base text-[#405347] leading-relaxed pt-0.5">
                    {activeCompartment.getShortSummary()}
                  </p>
                </div>

                {/* Visual Highlight Chips */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A1C]">
                    Freshness Highlights:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeCompartment.getHighlights().map((h, i) => {
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

                {/* Weekly Rhythm Notice for Oats */}
                {activeCompartment.id === "oats" && (
                  <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-orange-600" />
                      <span>Weekly Rhythm:</span>
                    </div>
                    <p className="text-[11px] leading-tight text-[#405347]">
                      <strong>4 days a week:</strong> Fresh Fruit &amp; Vegetable Box. ·{" "}
                      <strong>2 days a week:</strong> Healthy Oats Meal.
                    </p>
                  </div>
                )}

                {/* Quick Compartment Bottom Bar */}
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
