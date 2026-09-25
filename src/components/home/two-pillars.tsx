"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Apple, Heart, Sparkles, Check, Users, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleSquiggle } from "@/components/ui/doodles";

export function TwoPillars() {
  return (
    <section
      id="two-pillars"
      aria-label="Two Pillars, One Wellness Journey"
      className="py-14 sm:py-16 lg:py-20 bg-[#FCFDF9] border-b border-[#E3EFE5] relative overflow-hidden"
    >
      {/* Background Soft Glows */}
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
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Complete Daily Wellness</span>
          </div>

          <h2 className="font-display text-[1.85rem] sm:text-3xl lg:text-4xl font-extrabold text-[#132A1C] tracking-tight leading-tight">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Pillar 1: Nutrition (Primary Green Accent) */}
          <div className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white border-2 border-emerald-500/30 hover:border-emerald-500 shadow-card hover:shadow-raised transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pillar 01 · Body</span>
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Every Morning
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Apple className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#132A1C] font-display leading-tight">
                    Daily Fresh Nutrition
                  </h3>
                  <p className="text-xs text-[#657B6F] font-medium mt-0.5">
                    Prepared at dawn by Berrybeats Cafe
                  </p>
                </div>
              </div>

              {/* 1-Line Core Summary */}
              <p className="text-sm sm:text-base text-[#405347] font-medium leading-relaxed pt-1">
                Fresh fruits, veggies, salad &amp; sprouts delivered every morning before 7:30 AM with zero kitchen prep.
              </p>

              {/* 3 Balanced Highlights */}
              <div className="space-y-2 pt-2 border-t border-[#E3EFE5]">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>4 Seasonal Cut Fruits &amp; 2 Crisp Vegetables</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Fresh Mix Garden Salad, Sprouted Pulses &amp; Dry Fruits</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Triple-washed, food-grade sealed &amp; 100% ready-to-eat</span>
                </div>
              </div>
            </div>

            {/* Pillar 1 Action Link */}
            <div className="pt-4 border-t border-[#E3EFE5]">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center text-base font-bold min-h-[48px] py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md cursor-pointer"
              >
                <Link href="#pricing" className="flex items-center justify-center gap-2">
                  <span>Explore Nutrition Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Pillar 2: MedCity Smiles (Aqua / Teal Accent) */}
          <div className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white border-2 border-teal-500/30 hover:border-teal-500 shadow-card hover:shadow-raised transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#00A88F] to-emerald-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-950 text-xs font-extrabold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-teal-600" />
                  <span>Pillar 02 · Mind</span>
                </span>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Included Free
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#132A1C] font-display leading-tight">
                    MedCity Smiles Community
                  </h3>
                  <p className="text-xs text-[#657B6F] font-medium mt-0.5">
                    Powered by MedCity Health Labs
                  </p>
                </div>
              </div>

              {/* 1-Line Core Summary */}
              <p className="text-sm sm:text-base text-[#405347] font-medium leading-relaxed pt-1">
                A supportive community for your mental wellbeing — expert-led sessions, live sharing, and everyday encouragement.
              </p>

              {/* 3 Balanced Highlights */}
              <div className="space-y-2 pt-2 border-t border-[#E3EFE5]">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[3]" />
                  <span>Doctor, Psychologist &amp; Clinical Nutritionist Network</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[3]" />
                  <span>Positive Mindset, Coping Habits &amp; Live Sharing Sessions</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C]">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[3]" />
                  <span>Free Monthly Doctor-Certified Health Checkups (Sugar &amp; BP)</span>
                </div>
              </div>
            </div>

            {/* Pillar 2 Action Link */}
            <div className="pt-4 border-t border-[#E3EFE5]">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full justify-center text-base font-bold min-h-[48px] py-3 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-900 border-2 border-teal-500/40 hover:border-teal-600 shadow-sm cursor-pointer"
              >
                <Link href="/medcity-smiles" className="flex items-center justify-center gap-2">
                  <span>Explore MedCity Smiles</span>
                  <ArrowRight className="w-4 h-4 text-teal-800" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
