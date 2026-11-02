"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-content-primary transition-brand">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-primary focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-floating focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Global Brand-Aware Responsive Navbar */}
      <Navbar />

      {/* Primary Main Landmark */}
      <main id="main-content" className="flex-1 flex flex-col pb-24 md:pb-0">
        {children}
      </main>

      {/* Shared Footer on Public Routes */}
      {!isDashboard && <Footer />}

      {/* Mobile-Only Sticky Bottom CTA Bar */}
      {!isDashboard && <MobileStickyBar />}
    </div>
  );
}
