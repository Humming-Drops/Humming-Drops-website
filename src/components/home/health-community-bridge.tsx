"use client";

import React from "react";
import Link from "next/link";
import { Heart, Activity, Users, ArrowRight, ShieldCheck, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoodleSquiggle,
  OrganicWaveDivider,
} from "@/components/ui/doodles";
import { HOLISTIC_PILLARS, HolisticPillar } from "@/types/pillars";

const PILLAR_ICONS: Record<string, React.ElementType> = {
  mind: Brain,
  body: Activity,
  self_talk: Sparkles,
  coping: Users,
};

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 lg:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
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

        {/* 1. MedCity Smiles Section Placed ABOVE the Pillars */}
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-teal-700 via-teal-700 to-teal-800 text-white shadow-card relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
                  MedCity Smiles Community · In Collaboration with MedCity Health Labs
                </span>
              </div>
              <span className="text-xs text-teal-200/90 font-medium">Included Free with Every Plan</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Free Monthly Health Vitals Checkup
                </h3>
                <p className="text-sm text-teal-100 leading-relaxed font-sans">
                  Stay informed about your key physical wellness metrics every month. Our community of doctors and clinical nutritionists is available to monitor your vitals and advise members.
                </p>
              </div>

              <div className="lg:col-span-5 flex lg:justify-end">
                <Button
                  variant="outline"
                  size="md"
                  asChild
                  className="bg-white text-teal-900 hover:bg-teal-50 border-transparent font-bold shadow-sm"
                >
                  <Link href="/medcity-smiles" className="flex items-center gap-2">
                    <span>Explore MedCity Smiles</span>
                    <ArrowRight className="w-4 h-4 text-teal-900" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* 3 Confirmed Health Checkup Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">🩸</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded-full">
                    Monthly
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">Blood Sugar</h4>
                <p className="text-xs text-teal-100/80">Proactive metabolic health</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">🫀</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded-full">
                    Monthly
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">Cholesterol</h4>
                <p className="text-xs text-teal-100/80">Lipid &amp; cardiovascular care</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">🩺</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded-full">
                    Monthly
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">Blood Pressure</h4>
                <p className="text-xs text-teal-100/80">Hypertension prevention</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. The 4 Holistic Pillars Placed BELOW MedCity Smiles */}
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/70 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>Our Holistic Plan: Mind and Body Health</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-teal-950 font-display mt-0.5">
                The 4 Interconnected Pillars of Care
              </h3>
            </div>
            <span className="text-xs text-teal-800/70">Authoritative Brochure Page 6</span>
          </div>

          {/* 4 Responsive Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOLISTIC_PILLARS.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.id] || Sparkles;
              return (
                <div
                  key={pillar.id}
                  className={`p-5 rounded-2xl bg-white border ${pillar.borderClass} shadow-xs flex flex-col justify-between space-y-4 hover:shadow-card transition-shadow`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl ${pillar.badgeBg} ${pillar.badgeColor} flex items-center justify-center font-bold`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">
                        Pillar 0{pillar.pillarNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted block mb-0.5">
                        {pillar.label}
                      </span>
                      <h4 className="font-bold text-base text-teal-950 font-display">{pillar.title}</h4>
                      <p className="text-xs text-teal-900/80 leading-relaxed mt-1.5 font-sans">
                        {pillar.shortCopy}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[10px] text-teal-700">
                    <span>{pillar.status === "authoritative" ? "Core Deliverable" : "Brochure Plan"}</span>
                    <span className="font-semibold">{pillar.label}</span>
                  </div>
                </div>
              );
            })}
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
