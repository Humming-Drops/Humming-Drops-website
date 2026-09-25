"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section
      aria-label="Start Your Humming Drops Subscription"
      className="py-16 sm:py-20 lg:py-24 bg-[#FCFDF9] relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-white text-center relative overflow-hidden shadow-floating">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" aria-hidden="true" />
              <span>Doorstep Breakfast Delivery · Bangalore</span>
            </div>

            <h2 className="font-display text-[2rem] sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.16]">
              Start Your Mornings with Fresh, Effortless Nutrition
            </h2>

            <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto font-sans leading-relaxed">
              &ldquo;Because wellness is not one big change. It is made up of small, positive choices every day.&rdquo;
            </p>

            {/* Dual CTAs - Subscribe and WhatsApp */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3.5 pt-3">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white text-emerald-800 hover:bg-emerald-50 border-transparent font-extrabold text-base px-8 py-3.5 min-h-[50px] shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer rounded-full"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-2">
                  <span>Start Your Subscription</span>
                  <ArrowRight className="w-4 h-4 text-emerald-800" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#20ba59] border-transparent font-bold text-base px-7 py-3.5 min-h-[50px] shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer rounded-full"
              >
                <a
                  href="https://wa.me/918618902810"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </Button>
            </div>

            {/* Partner & Location Footer Note */}
            <div className="pt-6 mt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-emerald-100">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-200 shrink-0" aria-hidden="true" />
                <span>Berrybeats cafe, Bangalore</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-200 shrink-0" aria-hidden="true" />
                <a href="tel:8618902810" className="hover:underline font-bold text-white">8618902810</a>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-200 shrink-0" aria-hidden="true" />
                <a href="mailto:hummingdrops@gmail.com" className="hover:underline text-white">hummingdrops@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
