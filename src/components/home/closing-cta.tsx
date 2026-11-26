"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Sparkles, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export function ClosingCTA() {
  return (
    <section
      id="contact"
      aria-label="Start Your Humming Drops Subscription & Contact Us"
      className="py-16 sm:py-20 lg:py-24 bg-[#FCFDF9] relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[42rem] h-[42rem] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-emerald-700 via-emerald-800 to-forest-900 text-white text-center relative overflow-hidden shadow-floating">
          {/* Subtle background blur circles */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" aria-hidden="true" />
              <span>Doorstep Delivery · Bangalore</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-white tracking-tight leading-[1.15]">
              Start Your Mornings with Fresh, Effortless Nutrition
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-emerald-50 max-w-xl mx-auto leading-relaxed">
              &ldquo;Wellness is not one big change. It is made up of small, positive choices every day.&rdquo;
            </p>

            {/* Compact 2x2 Contact Grid on Mobile for Maximum Space Efficiency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
              {/* WhatsApp Contact */}
              <a
                href="https://wa.me/918618902810"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[56px] p-3 sm:p-3.5 rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E7A3E] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-[#0E7A3E] stroke-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block truncate">WhatsApp</span>
                  <span className="text-sm font-extrabold text-stone-900 block truncate">8618902810</span>
                </div>
              </a>

              {/* Phone Contact */}
              <a
                href="tel:+918618902810"
                className="min-h-[56px] p-3 sm:p-3.5 rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Phone</span>
                  <span className="text-sm font-extrabold text-stone-900 block truncate">8618902810</span>
                </div>
              </a>

              {/* Email Contact */}
              <a
                href={`mailto:${OFFICIAL_CONTACT.email}`}
                className="min-h-[56px] p-3 sm:p-3.5 rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Email</span>
                  <span className="text-sm font-extrabold text-stone-900 block truncate">{OFFICIAL_CONTACT.email}</span>
                </div>
              </a>

              {/* Address / Maps */}
              <a
                href="https://maps.google.com/?q=Berrybeats+Cafe+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[56px] p-3 sm:p-3.5 rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Kitchen</span>
                  <span className="text-sm font-bold text-stone-900 block truncate">Berrybeats Cafe</span>
                </div>
              </a>
            </div>

            {/* Action CTAs: Both Pillars Reflected */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 pt-1">
              {/* Primary: Start Nutrition Subscription */}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 border-transparent px-6 shadow-md"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-1.5">
                  <span>Start Your Subscription</span>
                  <ArrowRight className="w-4 h-4 text-emerald-900" aria-hidden="true" />
                </Link>
              </Button>

              {/* Secondary: Explore MedCity Smiles Pillar (Outlined Aqua) */}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white text-teal-900 hover:bg-teal-50 border-2 border-[#00A88F] hover:border-teal-700 px-6 shadow-md"
              >
                <Link href="/medcity-smiles" className="flex items-center justify-center gap-1.5">
                  <Heart className="w-4 h-4 text-teal-700" />
                  <span>Explore MedCity Smiles</span>
                </Link>
              </Button>

              {/* WhatsApp Quick Link */}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-[#0E7A3E] text-white hover:bg-[#0B6A35] border-transparent px-6 shadow-md"
              >
                <a
                  href="https://wa.me/918618902810"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-[#0E7A3E]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
