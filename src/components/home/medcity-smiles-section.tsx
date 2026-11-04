"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Activity,
  ArrowRight,
  Sparkles,
  Smile,
  Droplets,
  HeartPulse,
  Stethoscope,
  Users,
} from "lucide-react";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";
import { OrganicWaveDivider } from "@/components/ui/doodles";

const CARE_PILLARS = [
  {
    id: "checkups",
    icon: Stethoscope,
    title: "Free Monthly Health Checkup",
    copy: "Blood sugar, cholesterol & blood pressure, monitored every month with MedCity Health Labs.",
  },
  {
    id: "doctors",
    icon: Users,
    title: "A Community of Doctors & Nutritionists",
    copy: "Reach out to clinical experts who review your vitals and guide your wellness journey.",
  },
  {
    id: "mind",
    icon: Smile,
    title: "Mindful Support, Not Just Metrics",
    copy: "MedCity Smiles pairs your physical checkups with a supportive, community-first space for your mental wellbeing.",
  },
];

export function MedCitySmilesSection() {
  return (
    <section
      id="medcity-smiles"
      data-theme="medcity"
      aria-label="MedCity Smiles Community"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F8FAF9] via-white to-[#F8FAF9] border-b border-[#DCEEEC] relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-0 w-96 h-96 bg-[#E6F7F5] rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F7F5] border border-[#2BB3B1]/30 text-[#0B3D34] text-xs font-bold tracking-wide shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-[#156C63]" aria-hidden="true" />
            <span>In Partnership with MedCity Health Labs</span>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight text-[#0D5049] leading-[1.16]">
            MedCity Smiles Community
          </h2>

          <p className="text-base sm:text-lg text-[#405347] leading-relaxed max-w-2xl mx-auto">
            Every subscription includes free membership to MedCity Smiles — a supportive community built around
            preventative health monitoring and mindful care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left: 3 care pillars */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white border border-[#DCEEEC] shadow-card space-y-4">
            {CARE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#E6F7F5]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#E6F7F5] border border-[#2BB3B1]/20 flex items-center justify-center text-[#156C63] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#0D5049]">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-[#405347] leading-relaxed mt-1">{pillar.copy}</p>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#657B6F]">Included free with every plan</span>
              <Link
                href="/medcity-smiles"
                className="font-bold text-[#156C63] hover:text-[#0D5049] hover:underline flex items-center gap-1 text-sm"
              >
                <span>Explore MedCity Smiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: vitals showcase */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#156C63] via-[#0D5049] to-[#0B3D34] text-white shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-200">
                <Activity className="w-4 h-4 text-amber-300" />
                <span>Included Free, Every Month</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Your Monthly Vitals Checkup
              </h3>

              <div className="space-y-2.5">
                {CONFIRMED_VITALS_BENEFITS.map((v) => {
                  const Icon = v.metricName.toLowerCase().includes("blood sugar")
                    ? Droplets
                    : v.metricName.toLowerCase().includes("cholesterol")
                      ? Heart
                      : HeartPulse;
                  return (
                    <div
                      key={v.metricName}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
                    >
                      <Icon className="w-4 h-4 text-white shrink-0" />
                      <span className="text-sm font-semibold text-white">{v.metricName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              href="/medcity-smiles"
              className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] rounded-full bg-white text-[#0D5049] font-extrabold shadow-md hover:bg-teal-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Learn About MedCity Smiles</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14 lg:mt-18 text-canvas">
        <OrganicWaveDivider fill="#FAFCF8" className="w-full h-12 sm:h-16 text-canvas" />
      </div>
    </section>
  );
}
