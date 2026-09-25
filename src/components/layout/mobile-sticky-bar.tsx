"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar only after scrolling past the hero (~360px)
      if (window.scrollY > 360) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick Mobile Subscription Action Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E3EFE5] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Price & info summary */}
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>From ₹116/day</span>
          </span>
          <span className="text-[11px] text-[#657B6F]">Delivered before 7:30 AM</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Subscribe CTA */}
          <Link
            href="/subscribe?plan=standard"
            className="min-h-[44px] px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform"
          >
            <span>Subscribe</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>

          {/* WhatsApp Quick Chat Button */}
          <a
            href="https://wa.me/918618902810"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-11 h-11 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm active:scale-[0.95] transition-transform"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-[#25D366]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  );
}
