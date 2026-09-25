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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E3EFE5] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        {/* Full-Width Subscribe Now Action Button */}
        <Link
          href="/subscribe?plan=standard"
          className="flex-1 min-h-[48px] px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
        >
          <span>Subscribe Now</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

        {/* WhatsApp Icon Action Button */}
        <a
          href="https://wa.me/918618902810"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-12 h-12 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md active:scale-[0.95] transition-transform"
        >
          <MessageCircle className="w-5 h-5 fill-white stroke-[#25D366]" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
