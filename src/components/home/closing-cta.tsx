"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section
      aria-label="Start Your Humming Drops Subscription"
      className="py-14 sm:py-16 lg:py-24 bg-canvas relative overflow-hidden"
    >
      {/* Subtle decorative ambient glows */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-mint rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-80 h-80 bg-sun/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[20px] p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-primary-bright to-primary text-white text-center relative overflow-hidden shadow-floating">
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-white/20 border border-white/30 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-sun" aria-hidden="true" />
              <span>Doorstep Breakfast Delivery · Bangalore</span>
            </div>

            <h2 className="font-display text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.18]">
              Start Your Mornings with Fresh, Effortless Nutrition
            </h2>

            <p className="text-base sm:text-lg text-white max-w-2xl mx-auto font-sans leading-relaxed">
              &ldquo;Because wellness is not one big change. It is made up of small, positive choices every day.&rdquo;
            </p>

            {/* Dual CTAs - Primary and Secondary with mobile stacking */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white text-primary hover:bg-mint border-transparent font-bold text-base px-8 py-3.5 min-h-[48px] shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer rounded-[20px]"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-2">
                  <span>Start Your Subscription</span>
                  <ArrowRight className="w-4 h-4 text-primary" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white/15 text-white hover:bg-white/25 border-white/40 font-semibold text-base px-7 py-3.5 min-h-[48px] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer rounded-[20px]"
              >
                <a href="https://wa.me/918618902810" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <span>Chat on WhatsApp</span>
                </a>
              </Button>
            </div>

            {/* Partner & Location Footer Note - Stacked on mobile & tappable */}
            <div className="pt-6 mt-6 border-t border-white/25 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-white">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/90 shrink-0" aria-hidden="true" />
                <span>Berrybeats cafe, Bangalore</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 min-h-[36px]">
                <Phone className="w-3.5 h-3.5 text-white/90 shrink-0" aria-hidden="true" />
                <a href="tel:8618902810" className="hover:underline font-semibold">8618902810</a>
              </div>
              <div className="flex items-center justify-center gap-1.5 min-h-[36px]">
                <Mail className="w-3.5 h-3.5 text-white/90 shrink-0" aria-hidden="true" />
                <a href="mailto:hummingdrops@gmail.com" className="hover:underline">hummingdrops@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

