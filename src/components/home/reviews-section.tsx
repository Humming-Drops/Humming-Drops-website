"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareHeart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      aria-label="Subscriber Reviews"
      className="py-14 sm:py-16 lg:py-24 bg-mint border-y border-[#E2ECE4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-white border border-[#E2ECE4] text-primary text-xs font-semibold shadow-2xs">
            <MessageSquareHeart className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Bangalore Morning Community</span>
          </div>

          <h2 className="font-display text-[1.75rem] sm:text-3xl font-extrabold text-ink tracking-tight leading-[1.18]">
            Loved by Morning Achievers
          </h2>

          <p className="text-base text-body font-sans leading-relaxed">
            Fresh, doorstep whole foods powering active professionals, families, and wellness seekers across Bangalore every sunrise.
          </p>
        </div>

        {/* Clean, authentic community placeholder frame */}
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-[20px] bg-white border border-[#E2ECE4] shadow-card text-center space-y-5">
          <div className="flex justify-center items-center gap-1 text-sun">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-sun stroke-sun" aria-hidden="true" />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-ink font-display">
              Real Morning Moments &amp; Feedback Coming Soon
            </h3>
            <p className="text-sm sm:text-base text-body font-sans max-w-xl mx-auto leading-relaxed">
              We are currently gathering authentic verified subscriber reflections and morning routine stories. Experience the morning ritual yourself.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="md"
              asChild
              className="w-full sm:w-auto min-h-[48px] rounded-[20px] shadow-xs cursor-pointer"
            >
              <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-2">
                <span>Start Your Box</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="md"
              asChild
              className="w-full sm:w-auto min-h-[48px] rounded-[20px] cursor-pointer"
            >
              <Link href="/contact" className="flex items-center justify-center">
                <span>Share Feedback</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
