"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section
      aria-label="Start Your Humming Drops Subscription"
      className="pt-4 pb-16 sm:pb-24 bg-cream-50 relative overflow-hidden"
    >
      {/* Subtle decorative glows */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-forest-100/50 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-leaf-500 via-leaf-500 to-leaf-600 text-white text-center relative overflow-hidden shadow-floating">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" aria-hidden="true" />
              <span>Doorstep Breakfast Delivery · Bangalore</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Start Your Mornings with Fresh, Effortless Nutrition
            </h2>

            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-sans leading-relaxed">
              &ldquo;Because wellness is not one big change. It is made up of small, positive choices every day.&rdquo;
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-white text-leaf-700 hover:bg-forest-50 border-transparent font-bold text-base px-8 py-3.5 shadow-md"
              >
                <Link href="/subscribe?plan=standard" className="flex items-center gap-2">
                  <span>Start Your Subscription</span>
                  <ArrowRight className="w-4 h-4 text-leaf-700" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-white/15 text-white hover:bg-white/25 border-white/40 font-semibold text-base px-6 py-3.5"
              >
                <a href="https://wa.me/918618902810" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
            </div>

            {/* Partner & Location Footer Note */}
            <div className="pt-8 mt-8 border-t border-white/25 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/85">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                <span>Berrybeats cafe, Bangalore</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                <a href="tel:8618902810" className="hover:underline">8618902810</a>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                <a href="mailto:hummingdrops@gmail.com" className="hover:underline">hummingdrops@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

