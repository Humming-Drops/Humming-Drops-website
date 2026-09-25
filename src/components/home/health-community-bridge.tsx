"use client";

import React from "react";
import Link from "next/link";
import { Heart, Activity, ArrowRight, ShieldCheck, Sparkles, Smile, Sprout, Cloud, Sun, Leaf, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoodleSquiggle,
  OrganicWaveDivider,
} from "@/components/ui/doodles";

const PILLARS = [
  {
    id: "mood",
    label: "CHECK-INS",
    title: "Mood Reflections",
    shortCopy: "Your personal hummingbird companion reflects your daily energy and emotions.",
    icon: Smile,
    badgeBg: "bg-[#E8F7F1]",
    badgeColor: "text-aqua",
    cardBg: "bg-[#E8F7F1]/50",
    borderClass: "border-aqua/20",
  },
  {
    id: "sensory",
    label: "CALM",
    title: "Sensory Tools",
    shortCopy: "Quick breathing techniques and tactile exercises to quiet a busy mind.",
    icon: Wind,
    badgeBg: "bg-mint",
    badgeColor: "text-primary",
    cardBg: "bg-mint/60",
    borderClass: "border-primary/20",
  },
  {
    id: "garden",
    label: "GROWTH",
    title: "Virtual Garden",
    shortCopy: "Earn stardust and bloom digital flowers as you nurture your body and mind.",
    icon: Sprout,
    badgeBg: "bg-sky-50",
    badgeColor: "text-sky-700",
    cardBg: "bg-sky-50/50",
    borderClass: "border-sky-200/80",
  },
  {
    id: "gentle",
    label: "JOURNEY",
    title: "Guilt-Free",
    shortCopy: "No streaks. No pressure. Just a gentle friend cheering for your wellness.",
    icon: Heart,
    badgeBg: "bg-amber-50",
    badgeColor: "text-citrus",
    cardBg: "bg-amber-50/50",
    borderClass: "border-amber-200/80",
  },
];

export function HealthCommunityBridge() {
  return (
    <section
      id="health-community"
      aria-label="MedCity Smiles Mental Wellness & Community"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F0FDF4] via-[#FCFDF9] to-[#F0FDF4] border-b border-[#E3EFE5] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Top badge & headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span>Pillar 02 · Your Pocket Companion</span>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight text-[#132A1C] leading-[1.16]">
            Nourishing the Body,{" "}
            <span className="text-teal-700 relative inline-block pb-2">
              Cultivating the Mind
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-2.5 text-amber-400 pointer-events-none stroke-[3]"
                color="#FBBF24"
              />
            </span>
          </h2>

          {/* Highlighted Bridge Connection Statement */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E6F7F5] border-l-4 border-[#00A88F] text-[#0B3D34] shadow-2xs max-w-2xl mx-auto text-left sm:text-center">
            <p className="text-base sm:text-lg font-medium leading-relaxed font-sans">
              &ldquo;Just as Humming Drops nourishes your body every morning, your MedCity Smiles hummingbird is here for your mind — because real wellness is both.&rdquo;
            </p>
          </div>
        </div>

        {/* 2 Main Visual Blocks: Left 4-Pillar Interconnected Matrix, Right Free Health Checkup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Block 1: Interconnected 4-Pillar Visual System (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white border border-[#E3EFE5] shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>The Pocket Companion</span>
                </span>
                <span className="text-xs font-semibold text-[#657B6F]">Mindfulness</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#132A1C] font-display">
                A gentle friend that grows with you
              </h3>

              {/* 4 Visual Pillar Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className={`p-4 rounded-2xl ${pillar.cardBg} border ${pillar.borderClass} space-y-2 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl ${pillar.badgeBg} ${pillar.badgeColor} flex items-center justify-center font-bold shadow-2xs`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#132A1C]">
                          {pillar.label}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-[#132A1C]">{pillar.title}</h4>
                        <p className="text-xs text-[#405347] leading-snug mt-1 font-sans">
                          {pillar.shortCopy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3EFE5] flex items-center justify-between text-xs text-[#657B6F]">
              <span>Your personal wellness ecosystem</span>
              <Link href="/medcity-smiles" className="font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-700" />
              </Link>
            </div>
          </div>

          {/* Block 2: Garden Growth Showcase (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-amber-300" />
                  <span>Physical + Digital Wellness</span>
                </span>
                <span className="text-xs text-teal-200/90 font-medium">Gamified Growth</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Cultivate Your Inner Garden
              </h3>

              <p className="text-sm text-teal-50/90 leading-relaxed font-sans">
                Your garden blooms when you care for yourself. Link your daily physical nourishment with mindful digital check-ins to unlock new plants and stardust.
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Daily Box</h4>
                  <p className="text-[11px] text-teal-100">Receive morning nutrition</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Smile className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Check-in</h4>
                  <p className="text-[11px] text-teal-100">Log your daily mood</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sprout className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Bloom</h4>
                  <p className="text-[11px] text-teal-100">Watch your garden grow</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 space-y-3">
              <p className="text-xs text-teal-100/90 leading-relaxed">
                Receive weekly stories of your journey. <strong>No streaks to break. No guilt.</strong> Just a happy companion celebrating your progress.
              </p>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full justify-center min-h-[48px] bg-white text-teal-900 hover:bg-teal-50 border-transparent font-extrabold shadow-md cursor-pointer rounded-full"
              >
                <Link href="/medcity-smiles" className="flex items-center justify-center gap-2">
                  <span>Explore MedCity Smiles Community</span>
                  <ArrowRight className="w-4 h-4 text-teal-900" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless transition */}
      <div className="mt-14 lg:mt-18 text-canvas">
        <OrganicWaveDivider fill="#FAFCF8" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}

