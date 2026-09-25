"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Sparkles, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section
      id="contact"
      aria-label="Start Your Humming Drops Subscription & Contact Us"
      className="py-8 sm:py-16 lg:py-24 bg-[#FCFDF9] relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[42rem] h-[42rem] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-white text-center relative overflow-hidden shadow-floating">
          {/* Subtle background blur circles */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] sm:text-xs font-bold text-white shadow-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" aria-hidden="true" />
              <span>Doorstep Delivery · Bangalore</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Start Your Mornings with Fresh, Effortless Nutrition
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-emerald-50 max-w-xl mx-auto font-sans leading-relaxed">
              &ldquo;Wellness is not one big change. It is made up of small, positive choices every day.&rdquo;
            </p>

            {/* Compact 2x2 Contact Grid on Mobile for Maximum Space Efficiency */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-1 text-left">
              {/* WhatsApp Contact */}
              <a
                href="https://wa.me/918618902810"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-[#25D366] stroke-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block truncate">WhatsApp</span>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-900 block truncate">8618902810</span>
                </div>
              </a>

              {/* Phone Contact */}
              <a
                href="tel:8618902810"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Phone</span>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-900 block truncate">8618902810</span>
                </div>
              </a>

              {/* Email Contact */}
              <a
                href="mailto:hummingdrops@gmail.com"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Email</span>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-900 block truncate">hummingdrops</span>
                </div>
              </a>

              {/* Address / Maps */}
              <a
                href="https://maps.google.com/?q=Berrybeats+Cafe+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-stone-900 shadow-xs flex items-center gap-2 sm:gap-3 transition-transform active:scale-[0.98] border border-white/40"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">Kitchen</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block truncate">Berrybeats Cafe</span>
                </div>
              </a>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2.5 pt-1">
              <Button
                variant="outline"
                size="md"
                asChild
                className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 border-transparent font-extrabold text-sm sm:text-base px-6 min-h-[44px] sm:min-h-[48px] shadow-md active:scale-[0.98] transition-all cursor-pointer rounded-full"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-1.5">
                  <span>Start Subscription</span>
                  <ArrowRight className="w-4 h-4 text-emerald-900" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="md"
                asChild
                className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#20ba59] border-transparent font-bold text-sm sm:text-base px-5 min-h-[44px] sm:min-h-[48px] shadow-md active:scale-[0.98] transition-all cursor-pointer rounded-full"
              >
                <a
                  href="https://wa.me/918618902810"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
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
