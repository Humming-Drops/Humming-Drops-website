"use client";

import React from "react";
import Link from "next/link";
import { Heart, Activity, Users, ArrowRight, ShieldCheck, Sparkles, Brain, Stethoscope, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoodleSquiggle,
  DoodleHeart,
  HandwrittenAnnotation,
  OrganicWaveDivider,
} from "@/components/ui/doodles";

const PILLARS = [
  {
    id: "mind",
    label: "MIND",
    title: "Fuel Your Brain",
    shortCopy: "Balanced morning nutrition for cognitive energy and mood stability.",
    icon: Brain,
    badgeBg: "bg-teal-100",
    badgeColor: "text-teal-800",
    borderClass: "border-teal-200",
  },
  {
    id: "body",
    label: "BODY",
    title: "Protect Your Vitals",
    shortCopy: "Free monthly health checkups to stay proactive with your wellness.",
    icon: Activity,
    badgeBg: "bg-emerald-100",
    badgeColor: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    id: "community",
    label: "COMMUNITY",
    title: "Expert Network",
    shortCopy: "Doctors, clinical nutritionists, and inspiring live sharing sessions.",
    icon: Users,
    badgeBg: "bg-teal-100",
    badgeColor: "text-teal-800",
    borderClass: "border-teal-200",
  },
  {
    id: "reset",
    label: "RESET",
    title: "Mindful Coping",
    shortCopy: "Positive self-talk, deep breathing, yoga, and joyful creative outlets.",
    icon: Smile,
    badgeBg: "bg-amber-100",
    badgeColor: "text-amber-800",
    borderClass: "border-amber-200",
  },
];

export function HealthCommunityBridge() {
  return (
    <section
      id="health-community"
      aria-label="Health & Community Benefits"
      className="pt-10 lg:pt-16 pb-0 bg-gradient-to-b from-mist-50 via-teal-50/60 to-mist-50 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top badge & headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
            <Heart className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span>Body &amp; Mind Connection</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-teal-950 leading-tight">
            Nourishing the Body,{" "}
            <span className="text-teal-700 relative inline-block">
              Uplifting the Mind
              <DoodleSquiggle
                className="absolute -bottom-2 left-0 w-full text-teal-400"
                color="currentColor"
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-teal-900/80 font-sans leading-relaxed max-w-2xl mx-auto">
            At Humming Drops, true wellness is more than just eating healthy. Every plan unlocks free membership to MedCity Smiles and free monthly vitals monitoring.
          </p>
        </div>

        {/* 2 Main Visual Blocks: Left 4-Pillar Interconnected Matrix, Right Free Health Checkup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Block 1: Interconnected 4-Pillar Visual System (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white border border-teal-100 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>The 4 Holistic Pillars</span>
                </span>
                <span className="text-xs text-teal-700/60">Brochure Page 6</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-teal-950 font-display">
                An interconnected circle of care
              </h3>

              {/* 4 Visual Pillar Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className={`p-4 rounded-2xl bg-mist-50 border ${pillar.borderClass} space-y-2 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl ${pillar.badgeBg} ${pillar.badgeColor} flex items-center justify-center font-bold`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">
                          {pillar.label}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-teal-950">{pillar.title}</h4>
                        <p className="text-[11px] text-teal-800/80 leading-snug mt-1 font-sans">
                          {pillar.shortCopy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-teal-100 flex items-center justify-between text-xs text-teal-700">
              <span>Doctor &amp; nutritionist advisory network</span>
              <Link href="/medcity-smiles" className="font-semibold text-teal-950 hover:underline flex items-center gap-1">
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 text-teal-700" />
              </Link>
            </div>
          </div>

          {/* Block 2: Free Monthly Checkup Showcase (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-600 via-teal-600 to-teal-700 text-white shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/85 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>Included with Every Plan</span>
                </span>
                <span className="text-xs text-white/70">Brochure Page 3 &amp; 6</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Free Monthly Health Checkup
              </h3>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                Stay informed about your key physical wellness metrics every month, powered in partnership with MedCity Health Labs:
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/15 border border-white/25 text-left space-y-1">
                  <span className="text-2xl" aria-hidden="true">🩸</span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Blood Sugar</h4>
                  <p className="text-[11px] text-white/80">Free monthly test</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/15 border border-white/25 text-left space-y-1">
                  <span className="text-2xl" aria-hidden="true">🫀</span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Cholesterol</h4>
                  <p className="text-[11px] text-white/80">Free monthly test</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/15 border border-white/25 text-left space-y-1">
                  <span className="text-2xl" aria-hidden="true">🩺</span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Blood Pressure</h4>
                  <p className="text-[11px] text-white/80">Free monthly test</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/25 space-y-3">
              <p className="text-xs text-white/85">
                In collaboration with <strong>MedCity Health Labs</strong> · A community of experts to monitor your vitals.
              </p>
              <Button
                variant="outline"
                size="md"
                asChild
                className="w-full justify-center bg-white text-teal-800 hover:bg-teal-50 border-transparent font-bold shadow-sm"
              >
                <Link href="/medcity-smiles" className="flex items-center gap-2">
                  <span>Explore MedCity Smiles Community</span>
                  <ArrowRight className="w-4 h-4 text-teal-800" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless organic curved transition into Pricing Section (Cream canvas) */}
      <div className="mt-12 lg:mt-16 text-canvas">
        <OrganicWaveDivider fill="#fdfcf7" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}

