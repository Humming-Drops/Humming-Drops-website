"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useBrandTheme } from "@/components/theme/brand-provider";

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const { theme } = useBrandTheme();

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E3EFE5] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-3 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {theme === "humming" ? (
          <>
            <Link
              href="/medcity-smiles"
              className="min-h-[46px] px-3 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-2xs active:scale-[0.98] transition-transform"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>MedCity Smiles</span>
            </Link>

            <Link
              href="/subscribe?plan=standard"
              className="flex-1 min-h-[46px] px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform truncate"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="min-h-[46px] px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-2xs active:scale-[0.98] transition-transform"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Nutrition</span>
            </Link>

            <Link
              href="/subscribe?plan=standard"
              className="flex-1 min-h-[46px] px-3.5 py-2.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform truncate"
            >
              <span>Join Community</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </>
        )}

        {/* WhatsApp Icon Action Button */}
        <a
          href="https://wa.me/918618902810"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-11 h-11 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md active:scale-[0.95] transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
