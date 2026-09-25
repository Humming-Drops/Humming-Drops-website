"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareHeart, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    location: "Indiranagar, Bangalore",
    role: "Product Designer & Runner",
    initials: "AS",
    quote:
      "Having 4 varieties of fresh cut fruits and live sprouts delivered at 7 AM has completely changed my morning routine. I don't waste 20 minutes cutting apples and peeling carrots anymore!",
    badge: "Standard Plan Subscriber",
  },
  {
    name: "Vikram R.",
    location: "HSR Layout, Bangalore",
    role: "Software Architect",
    initials: "VR",
    quote:
      "The Premium Plan with daily almonds, walnuts, and seasonal detox juices keeps my energy consistent through long morning meetings. Plus the monthly free lab checkup with MedCity is a huge plus.",
    badge: "Premium Plan Subscriber",
  },
  {
    name: "Pooja & Karthik",
    location: "Koramangala, Bangalore",
    role: "Working Parents",
    initials: "PK",
    quote:
      "Our kids love the colorful papaya, kiwi, and pomegranate. It's clean, triple-washed, and takes the stress out of packing healthy morning breakfast for the whole family.",
    badge: "Family Subscriber",
  },
];

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      aria-label="Subscriber Reviews"
      className="py-14 sm:py-16 lg:py-24 bg-gradient-to-b from-[#F0FDF4] to-[#FCFDF9] border-y border-[#E3EFE5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Bangalore Morning Community</span>
          </div>

          <h2 className="font-display text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold text-[#132A1C] tracking-tight leading-[1.16]">
            Loved by Morning Achievers
          </h2>

          <p className="text-base text-[#405347] leading-relaxed font-sans">
            Fresh, doorstep whole foods powering active professionals, families, and wellness seekers across Bangalore every sunrise.
          </p>
        </div>

        {/* Swipeable Horizontal Carousel on Mobile (< sm), Grid on Tablet / Desktop (>= sm) */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar max-w-6xl mx-auto items-stretch">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="min-w-[86%] sm:min-w-0 snap-center shrink-0 sm:shrink p-6 sm:p-7 rounded-3xl bg-white border border-[#E3EFE5] shadow-card flex flex-col justify-between space-y-5 hover:border-emerald-300 hover:shadow-raised transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Top Row: Stars + Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-[#405347] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div className="pt-4 border-t border-[#E3EFE5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-mint border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-900 shrink-0 shadow-2xs">
                  {t.initials}
                </div>
                <div className="leading-tight">
                  <h4 className="font-extrabold text-sm text-[#132A1C]">{t.name}</h4>
                  <p className="text-xs text-[#657B6F] font-medium">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Cue */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-[#657B6F] pt-2">
          <span>← Swipe to read reviews →</span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <Button
            variant="primary"
            size="lg"
            asChild
            className="w-full sm:w-auto rounded-full px-8 min-h-[48px] text-base font-bold shadow-md bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          >
            <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-2">
              <span>Join the Morning Habit Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
