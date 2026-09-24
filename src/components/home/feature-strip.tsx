"use client";

import React from "react";
import { Sparkles, Apple, Clock, ShieldCheck, HeartPulse, MapPin } from "lucide-react";

const FEATURES = [
  {
    icon: Apple,
    title: "100% Raw Whole Food",
    subtitle: "Zero additives or preservatives",
    bgClass: "bg-rose-50",
    iconColor: "text-berry",
  },
  {
    icon: Clock,
    title: "Washed & Cut Dawn Fresh",
    subtitle: "Prepared every morning at sunrise",
    bgClass: "bg-amber-50",
    iconColor: "text-citrus",
  },
  {
    icon: Sparkles,
    title: "5 Nutritional Pillars",
    subtitle: "Fruits, veg, salad, sprouts, nuts",
    bgClass: "bg-mint",
    iconColor: "text-primary",
  },
  {
    icon: MapPin,
    title: "Doorstep Morning Delivery",
    subtitle: "Arrives fresh across Bangalore",
    bgClass: "bg-mint",
    iconColor: "text-primary-bright",
  },
  {
    icon: HeartPulse,
    title: "Free Monthly Vitals",
    subtitle: "Sugar, cholesterol & BP checkups",
    bgClass: "bg-[#E8F7F1]",
    iconColor: "text-aqua",
  },
  {
    icon: ShieldCheck,
    title: "MedCity Smiles Community",
    subtitle: "Doctors & clinical nutritionists",
    bgClass: "bg-sky-50",
    iconColor: "text-sky-700",
  },
];

export function FeatureStrip() {
  return (
    <section
      aria-label="What makes it Humming Drops"
      className="py-14 lg:py-16 bg-mint border-y border-[#E2ECE4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Quality Promise
          </span>
          <h2 className="text-[1.5rem] sm:text-2xl lg:text-3xl font-extrabold text-ink tracking-tight font-display leading-[1.2]">
            What makes it Humming Drops?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-[20px] bg-white border border-[#E2ECE4] shadow-2xs flex flex-col items-center text-center space-y-2.5 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`w-11 h-11 rounded-[20px] ${f.bgClass} ${f.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-ink leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-body mt-1 leading-snug">
                    {f.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
