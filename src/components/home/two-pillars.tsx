"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Apple, Heart, Sparkles, Check, Smile, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleSquiggle } from "@/components/ui/doodles";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export function TwoPillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="two-pillars"
      aria-label="Two Pillars, One Wellness Journey"
      className="py-14 sm:py-16 lg:py-24 bg-[#FCFDF9] border-b border-[#E3EFE5] relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Complete Daily Wellness</span>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-[#132A1C] tracking-tight leading-[1.15]">
            Two Pillars,{" "}
            <span className="relative inline-block text-emerald-700 pb-2">
              One Wellness Journey
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-2.5 text-amber-400 pointer-events-none stroke-[3]"
                color="#FBBF24"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed max-w-2xl mx-auto font-sans">
            Humming Drops is built on two equal foundations working together: fresh daily nutrition for your physical vitality, and MedCity Smiles for your mental wellbeing.
          </p>
        </div>

        {/* 2 Equal Visual Pillar Cards */}
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch"
        >
          {/* Pillar 1: Nutrition (Primary Green Accent) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : cardVariants}
            className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white border border-emerald-500/25 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] md:hover:border-emerald-500/60 active:scale-[0.99] transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pillar 01 · Body</span>
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Every Morning
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                {/* 56px soft green circle icon */}
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Apple className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-[clamp(1.35rem,2.5vw,1.65rem)] font-extrabold text-[#132A1C] font-display leading-tight">
                    Daily Fresh Nutrition
                  </h3>
                  <p className="text-xs text-[#657B6F] font-medium mt-0.5">
                    Prepared fresh at dawn by Berrybeats Cafe
                  </p>
                </div>
              </div>

              {/* 1-Line Core Summary */}
              <p className="text-base text-[#405347] font-normal leading-relaxed pt-1">
                Fresh fruits, veggies, salad &amp; sprouts delivered every morning before 7:30 AM with zero kitchen prep.
              </p>

              {/* 3 Balanced Highlights */}
              <div className="space-y-2.5 pt-3 border-t border-[#E3EFE5]">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>4 Seasonal Cut Fruits &amp; 2 Crisp Vegetables</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Fresh Mix Garden Salad, Sprouted Pulses &amp; Dry Fruits</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Triple-washed, food-grade sealed &amp; 100% ready-to-eat</span>
                </div>
              </div>
            </div>

            {/* Pillar 1 Action Link with hover arrow shift */}
            <div className="pt-4 border-t border-[#E3EFE5]">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center text-base font-bold min-h-[48px] py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md cursor-pointer group/btn"
              >
                <Link href="#pricing" className="flex items-center justify-center gap-2">
                  <span>Explore Nutrition Plans</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Pillar 2: MedCity Smiles (Aqua / Teal Accent) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : cardVariants}
            className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white border border-[#00A88F]/30 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] md:hover:border-[#00A88F]/60 active:scale-[0.99] transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#00A88F] to-emerald-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-950 text-xs font-extrabold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-[#00A88F]" />
                  <span>Pillar 02 · Mind</span>
                </span>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                  Included Free
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                {/* 56px soft aqua circle icon */}
                <div className="w-14 h-14 rounded-full bg-[#E6F7F5] border border-[#B2EBF2]/80 flex items-center justify-center text-[#00A88F] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Smile className="w-7 h-7 text-[#00A88F]" />
                </div>
                <div>
                  <h3 className="text-[clamp(1.35rem,2.5vw,1.65rem)] font-extrabold text-[#132A1C] font-display leading-tight">
                    MedCity Smiles Companion
                  </h3>
                  <p className="text-xs text-[#657B6F] font-medium mt-0.5">
                    Your personal pocket companion for mental wellness
                  </p>
                </div>
              </div>

              {/* 1-Line Core Summary */}
              <p className="text-base text-[#405347] font-normal leading-relaxed pt-1">
                A gentle pocket companion reflecting your mood, offering sensory tools for quick calm, and gamifying your wellness journey.
              </p>

              {/* 3 Balanced Highlights */}
              <div className="space-y-2.5 pt-3 border-t border-[#E3EFE5]">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-[#00A88F] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Mood-Reflecting Hummingbird Companion</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-[#00A88F] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Tactile Sensory Tools &amp; Quick Breathing Exercises</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-[#00A88F] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Grow a Virtual Garden with Daily Wellness Check-ins</span>
                </div>
              </div>
            </div>

            {/* Pillar 2 Action Link with hover arrow shift */}
            <div className="pt-4 border-t border-[#E3EFE5]">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full justify-center text-base font-bold min-h-[48px] py-3.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-950 border-2 border-[#00A88F]/50 hover:border-[#00A88F] shadow-sm cursor-pointer group/btn"
              >
                <Link href="/medcity-smiles" className="flex items-center justify-center gap-2">
                  <span>Explore MedCity Smiles</span>
                  <ArrowRight className="w-4 h-4 text-teal-900 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
