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
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span>Pillar 02 · Mind &amp; Community Care</span>
          </div>

          <h2 className="font-display text-[2rem] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#132A1C] leading-[1.16]">
            Nourishing the Body,{" "}
            <span className="text-teal-700 relative inline-block pb-2">
              Uplifting the Mind
              <DoodleSquiggle
                className="absolute bottom-0 left-0 w-full h-2.5 text-amber-400 pointer-events-none stroke-[3]"
                color="#FBBF24"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#405347] font-sans leading-relaxed max-w-2xl mx-auto">
            Just as Humming Drops nourishes your body every morning, MedCity Smiles is here for your mind — because real wellness is both.
          </p>
        </div>

        {/* 2 Main Visual Blocks: Left 4-Pillar Interconnected Matrix, Right Free Health Checkup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Block 1: Interconnected 4-Pillar Visual System (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white border border-[#E3EFE5] shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>The 4 Mental Wellness Pillars</span>
                </span>
                <span className="text-xs font-semibold text-[#657B6F]">Community Support</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#132A1C] font-display">
                An interconnected circle of mental care
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
              <span>Doctor, psychologist &amp; nutritionist network</span>
              <Link href="/medcity-smiles" className="font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-700" />
              </Link>
            </div>
          </div>

          {/* Block 2: Free Monthly Checkup Showcase (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Included with Every Plan</span>
                </span>
                <span className="text-xs text-teal-200/90 font-medium">Monthly Vitals</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Free Monthly Health Checkups
              </h3>

              <p className="text-sm text-teal-50/90 leading-relaxed font-sans">
                Track your key wellness biomarkers every month in partnership with MedCity Health Labs alongside wholesome nutrition:
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Blood Sugar</h4>
                  <p className="text-[11px] text-teal-100">Free monthly lab test</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Cholesterol</h4>
                  <p className="text-[11px] text-teal-100">Free monthly lab test</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Blood Pressure</h4>
                  <p className="text-[11px] text-teal-100">Free monthly lab test</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 space-y-3">
              <p className="text-xs text-teal-100/90 leading-relaxed">
                In collaboration with <strong>MedCity Health Labs</strong> · A certified community of experts monitoring your physical and mental wellness.
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

