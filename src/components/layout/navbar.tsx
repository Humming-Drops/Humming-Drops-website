"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { useBrandTheme } from "@/components/theme/brand-provider";
import { BrandSwitcher } from "@/components/theme/brand-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HUMMING_DROPS_NAV, MEDCITY_SMILES_NAV } from "@/types/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme } = useBrandTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Active brand nav config
  const navConfig = theme === "medcity" ? MEDCITY_SMILES_NAV : HUMMING_DROPS_NAV;

  // Track scroll position for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-brand border-b",
        scrolled
          ? "bg-canvas/95 backdrop-blur-md border-line-subtle shadow-card"
          : "bg-canvas border-line-subtle/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={theme === "medcity" ? "/medcity-smiles" : "/"}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg p-1"
              aria-label={`${navConfig.name} Home`}
            >
              {theme === "humming" ? (
                <div className="relative h-14 w-40 sm:w-52 transition-transform duration-fast group-hover:scale-[1.02]">
                  <Image
                    src="/images/humming-drops-logo.png"
                    alt="Humming Drops Logo"
                    fill
                    sizes="(max-width: 640px) 160px, 208px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-sm">
                    <Image
                      src="/images/medcity-smiles-logo.png"
                      alt="MedCity Smiles Logo"
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-extrabold text-lg sm:text-xl text-teal-950 leading-tight tracking-tight">
                      MedCity Smiles
                    </span>
                    <span className="text-[11px] font-sans font-medium text-teal-700 hidden sm:block">
                      Mental Wellbeing & Community
                    </span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Persistent Brand Switcher */}
          <div className="hidden sm:flex items-center justify-center shrink-0">
            <BrandSwitcher navigateOnSwitch={true} />
          </div>

          {/* Desktop Navigation Links (Visible on XL screens to prevent header overcrowding) */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 xl:gap-2"
          >
            {navConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary flex items-center gap-1.5",
                    isActive
                      ? "text-brand-primary font-semibold bg-brand-subtle/80"
                      : "text-content-secondary hover:text-content-primary hover:bg-muted/80"
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="brand" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Secondary CTA (Sign In - visible on xl screens) */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden xl:inline-flex text-content-secondary hover:text-content-primary font-medium"
            >
              <Link href={navConfig.secondaryCTA.href}>
                {navConfig.secondaryCTA.label}
              </Link>
            </Button>

            {/* Primary CTA (visible from sm breakpoint upwards) */}
            <Button
              variant="primary"
              size="sm"
              asChild
              className="hidden sm:inline-flex shadow-sm gap-1.5"
            >
              <Link href={navConfig.primaryCTA.href}>
                <span>{navConfig.primaryCTA.label}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </Button>

            {/* Responsive Hamburger Toggle (visible below xl screens) */}
            <div className="flex xl:hidden items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className="p-2 h-10 w-10 text-content-primary hover:bg-muted"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="xl:hidden border-t border-line-subtle bg-canvas shadow-floating animate-in fade-in-0 slide-in-from-top-2 duration-fast"
        >
          <div className="px-4 pt-4 pb-6 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {/* Mobile Brand Switcher (only shown below sm where header switcher is hidden) */}
            <div className="flex sm:hidden justify-center pb-2 border-b border-line-subtle">
              <BrandSwitcher navigateOnSwitch={true} />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {navConfig.navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors",
                      isActive
                        ? "bg-brand-subtle text-brand-primary font-semibold"
                        : "text-content-secondary hover:text-content-primary hover:bg-muted"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="brand" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile CTAs */}
            <div className="pt-2 border-t border-line-subtle space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full justify-center shadow-sm"
              >
                <Link
                  href={navConfig.primaryCTA.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{navConfig.primaryCTA.label}</span>
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="md"
                asChild
                className="w-full justify-center"
              >
                <Link
                  href={navConfig.secondaryCTA.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navConfig.secondaryCTA.label}
                </Link>
              </Button>
            </div>

            {/* Kitchen & Lab Partner Footnote */}
            <div className="pt-3 border-t border-line-subtle/60 text-center">
              <p className="text-xs text-content-muted">
                Doorstep Breakfast Delivery · In partnership with Berrybeats Cafe &amp; MedCity Health Labs
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
