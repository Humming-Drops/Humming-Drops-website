"use client";

import React from "react";
import Link from "next/link";
import { Heart, Activity, Users, ArrowRight, ShieldCheck, Sparkles, Brain, Smile, Droplets, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoodleSquiggle,
  OrganicWaveDivider,
} from "@/components/ui/doodles";

const PILLARS = [
  {
    id: "mind",
    label: "MIND",
    title: "Fuel Your Brain",
    shortCopy: "Balanced morning nutrition for cognitive energy and mood stability.",
    icon: Brain,
    badgeBg: "bg-[#E8F7F1]",
    badgeColor: "text-aqua",
    cardBg: "bg-[#E8F7F1]/50",
    borderClass: "border-aqua/20",
  },
  {
    id: "body",
    label: "BODY",
    title: "Protect Your Vitals",
    shortCopy: "Free monthly health checkups to stay proactive with your wellness.",
    icon: Activity,
    badgeBg: "bg-mint",
    badgeColor: "text-primary",
    cardBg: "bg-mint/60",
    borderClass: "border-primary/20",
  },
  {
    id: "community",
    label: "COMMUNITY",
    title: "Expert Network",
    shortCopy: "Doctors, clinical nutritionists, and inspiring live sharing sessions.",
    icon: Users,
    badgeBg: "bg-sky-50",
    badgeColor: "text-sky-700",
    cardBg: "bg-sky-50/50",
    borderClass: "border-sky-200/80",
  },
  {
    id: "reset",
    label: "RESET",
    title: "Mindful Coping",
    shortCopy: "Positive self-talk, deep breathing, yoga, and joyful creative outlets.",
    icon: Smile,
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
      aria-label="Health & Community Benefits"
      className="py-14 sm:py-16 lg:py-24 bg-canvas relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-[#E8F7F1]/60 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-0 w-96 h-96 bg-mint/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Top badge & headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-white border border-aqua/30 text-aqua text-xs font-semibold shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-aqua" aria-hidden="true" />
            <span>Body &amp; Mind Connection</span>
          </div>

          <h2 className="font-display text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink leading-[1.18]">
            Nourishing the Body,{" "}
            <span className="text-aqua relative inline-block pb-2">
              Uplifting the Mind
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-2 text-sun pointer-events-none stroke-[2.5]"
                color="#FFD84D"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-body font-sans leading-relaxed max-w-2xl mx-auto">
            At Humming Drops, true wellness is more than just eating healthy. Every plan unlocks free membership to MedCity Smiles and free monthly vitals monitoring.
          </p>
        </div>

        {/* 2 Main Visual Blocks: Left 4-Pillar Interconnected Matrix, Right Free Health Checkup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Block 1: Interconnected 4-Pillar Visual System (6 cols) */}
          <div className="lg:col-span-6 rounded-[20px] p-6 sm:p-7 bg-white border border-[#E2ECE4] shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-aqua flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-citrus" />
                  <span>The 4 Holistic Pillars</span>
                </span>
                <span className="text-xs text-body">Holistic Care</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-ink font-display">
                An interconnected circle of care
              </h3>

              {/* 4 Visual Pillar Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className={`p-3.5 rounded-[20px] ${pillar.cardBg} border ${pillar.borderClass} space-y-2 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-7 h-7 rounded-[20px] ${pillar.badgeBg} ${pillar.badgeColor} flex items-center justify-center font-bold`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-ink">
                          {pillar.label}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-ink">{pillar.title}</h4>
                        <p className="text-[11px] text-body leading-snug mt-1 font-sans">
                          {pillar.shortCopy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2ECE4] flex items-center justify-between text-xs text-body">
              <span>Doctor &amp; nutritionist advisory network</span>
              <Link href="/medcity-smiles" className="font-semibold text-aqua hover:underline flex items-center gap-1">
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 text-aqua" />
              </Link>
            </div>
          </div>

          {/* Block 2: Free Monthly Checkup Showcase (6 cols) */}
          <div className="lg:col-span-6 rounded-[20px] p-6 sm:p-7 bg-gradient-to-br from-aqua via-aqua to-primary text-white shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sun" />
                  <span>Included with Every Plan</span>
                </span>
                <span className="text-xs text-white/80">Monthly Vitals</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Free Monthly Health Checkup
              </h3>

              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
                Stay informed about your key physical wellness metrics every month, powered in partnership with MedCity Health Labs:
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-[20px] bg-white/15 border border-white/20 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Blood Sugar</h4>
                  <p className="text-[11px] text-white/85">Free monthly test</p>
                </div>
                <div className="p-3 rounded-[20px] bg-white/15 border border-white/20 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Cholesterol</h4>
                  <p className="text-[11px] text-white/85">Free monthly test</p>
                </div>
                <div className="p-3 rounded-[20px] bg-white/15 border border-white/20 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Blood Pressure</h4>
                  <p className="text-[11px] text-white/85">Free monthly test</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20 space-y-3">
              <p className="text-xs text-white/90">
                In collaboration with <strong>MedCity Health Labs</strong> · A community of experts to monitor your vitals.
              </p>
              <Button
                variant="outline"
                size="md"
                asChild
                className="w-full justify-center min-h-[48px] bg-white text-aqua hover:bg-mint border-transparent font-bold shadow-xs cursor-pointer rounded-[20px]"
              >
                <Link href="/medcity-smiles" className="flex items-center gap-2">
                  <span>Explore MedCity Smiles Community</span>
                  <ArrowRight className="w-4 h-4 text-aqua" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless transition */}
      <div className="mt-12 lg:mt-16 text-canvas">
        <OrganicWaveDivider fill="#FFFEF8" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}

