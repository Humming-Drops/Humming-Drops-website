"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { handleSamePageHashClick } from "@/lib/scroll-navigation";
import { UserButton, useAuth } from "@clerk/nextjs";

const TOP_VISIBLE_OFFSET = 48;
const HIDE_AFTER_Y = 72;
const SCROLL_DELTA_THRESHOLD = 8;
const TRACKED_SECTIONS = [
  "pricing",
  "journey",
  "box-experience",
  "medcity-smiles",
  "why-medcity",
  "vitals",
] as const;

export function Navbar() {
  const { theme } = useBrandTheme();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Active brand nav config
  const navConfig = theme === "medcity" ? MEDCITY_SMILES_NAV : HUMMING_DROPS_NAV;

  // Smart scroll behavior + active section tracking (throttled via rAF, passive listener)
  useEffect(() => {
    lastScrollYRef.current = Math.max(0, window.scrollY);

    const evaluateScroll = () => {
      rafIdRef.current = null;
      const currentY = Math.max(0, window.scrollY);

      const nextScrolled = currentY > 12;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

      // Determine active section based on scroll position
      const scrollPos = currentY + 100;
      let matchedSection = "";
      for (const sectionId of TRACKED_SECTIONS) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            matchedSection = sectionId;
            break;
          }
        }
      }
      if (matchedSection || currentY < 300) {
        setActiveSection((prev) => (prev === matchedSection ? prev : matchedSection));
      }

      // Always keep navbar visible near top (also guards iOS rubber-band bounce)
      if (currentY <= TOP_VISIBLE_OFFSET) {
        lastScrollYRef.current = currentY;
        setIsNavVisible((prev) => (prev ? prev : true));
        return;
      }

      const delta = currentY - lastScrollYRef.current;
      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
        return;
      }

      if (delta > 0 && currentY > HIDE_AFTER_Y) {
        setIsNavVisible((prev) => (prev ? false : prev));
      } else if (delta < 0) {
        setIsNavVisible((prev) => (prev ? prev : true));
      }

      lastScrollYRef.current = currentY;
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(evaluateScroll);
    };

    evaluateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  // Reset visibility and close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsNavVisible(true);
    lastScrollYRef.current = typeof window !== "undefined" ? Math.max(0, window.scrollY) : 0;
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

  const closeMobileMenu = () => {
    document.body.style.overflow = "";
    setMobileMenuOpen(false);
  };

  const isNavItemActive = (href: string) => {
    const isHomeHashMatch =
      pathname === "/" &&
      ((href === "/#pricing" && activeSection === "pricing") ||
        (href === "/#journey" && activeSection === "journey"));
    const isMedcityHashMatch =
      pathname === "/medcity-smiles" &&
      ((href === "/medcity-smiles#why-medcity" && activeSection === "why-medcity") ||
        (href === "/medcity-smiles#vitals" && activeSection === "vitals"));
    return pathname === href || isHomeHashMatch || isMedcityHashMatch;
  };

  const isHeaderHidden = !isNavVisible && !mobileMenuOpen;
  const surfaceClasses =
    theme === "medcity"
      ? scrolled
        ? "bg-mist-50/[0.97] backdrop-blur-md border-line-subtle shadow-[0_8px_24px_-6px_rgba(13,80,73,0.1)]"
        : "bg-mist-50/95 backdrop-blur-md border-line-subtle shadow-[0_1px_2px_rgba(13,80,73,0.03)]"
      : scrolled
        ? "bg-cream-50/[0.97] backdrop-blur-md border-line-subtle shadow-[0_8px_24px_-6px_rgba(19,42,28,0.09)]"
        : "bg-cream-50/95 backdrop-blur-md border-line-subtle shadow-[0_1px_2px_rgba(19,42,28,0.03)]";

  return (
    <header
      onFocusCapture={() => setIsNavVisible(true)}
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[transform,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none",
        surfaceClasses,
        mobileMenuOpen
          ? "transform-none"
          : cn(
              "will-change-transform",
              isHeaderHidden
                ? "-translate-y-full focus-within:translate-y-0"
                : "translate-y-0"
            )
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={theme === "medcity" ? "/medcity-smiles" : "/"}
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl p-1"
              aria-label={`${navConfig.name} Home`}
            >
              {theme === "humming" ? (
                <div className="relative h-10 w-36 sm:h-11 sm:w-44 transition-transform duration-fast group-hover:scale-[1.02]">
                  <Image
                    src="/images/humming-drops-logo.png"
                    alt="Humming Drops Official Logo"
                    fill
                    sizes="(max-width: 640px) 144px, 192px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <div className="relative h-10 w-28 sm:h-11 sm:w-36 transition-transform duration-fast group-hover:scale-[1.02]">
                  <Image
                    src="/images/medcity-smiles-logo.png"
                    alt="MedCity Smiles Community Official Logo"
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Persistent Brand Switcher */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <BrandSwitcher navigateOnSwitch={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {navConfig.navItems.map((item) => {
              const isActive = isNavItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-2 text-xs font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary flex items-center gap-1.5 whitespace-nowrap shrink-0",
                    isActive
                      ? "text-brand-primary bg-brand-subtle font-bold shadow-2xs"
                      : "text-forest-950 hover:text-brand-primary hover:bg-forest-50"
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
          <div className="flex items-center gap-2 shrink-0">
            {!isSignedIn ? (
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center px-3.5 py-2 text-xs font-semibold text-forest-950 hover:text-brand-primary hover:bg-forest-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-full whitespace-nowrap"
              >
                Sign In
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                    pathname?.startsWith("/dashboard")
                      ? "text-brand-primary bg-brand-subtle font-bold"
                      : "text-forest-950 hover:text-brand-primary hover:bg-forest-50"
                  )}
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-line-subtle",
                    },
                  }}
                />
              </div>
            )}

            {/* Primary CTA (visible from md breakpoint upwards) */}
            <Button
              variant="primary"
              size="sm"
              asChild
              className={cn("hidden md:inline-flex shadow-sm gap-1.5 whitespace-nowrap", theme === "medcity" && "bg-teal-700 hover:bg-teal-800 text-white")}
            >
              <Link href={navConfig.primaryCTA.href}>
                <span>{navConfig.primaryCTA.label}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </Button>

            {/* Responsive Hamburger Toggle (visible below lg screens) */}
            <div className="flex lg:hidden items-center gap-2">
              {isSignedIn && (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-line-subtle",
                    },
                  }}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className="p-2 h-11 w-11 min-h-[44px] min-w-[44px] text-forest-950 hover:bg-forest-50 flex items-center justify-center rounded-xl"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] z-30 bg-forest-950/20 backdrop-blur-xs lg:hidden"
          />
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className={cn(
              "relative z-40 lg:hidden border-t border-line-subtle shadow-floating animate-in fade-in-0 slide-in-from-top-2 duration-fast",
              theme === "medcity" ? "bg-mist-50" : "bg-cream-50"
            )}
          >
            <div className="px-5 pt-4 pb-6 space-y-4 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {/* Mobile Brand Switcher (only shown below md where header switcher is hidden) */}
              <div className="flex md:hidden justify-center pb-2 border-b border-line-subtle">
                <BrandSwitcher navigateOnSwitch={true} />
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navConfig.navItems.map((item) => {
                  const isActive = isNavItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        if (!handleSamePageHashClick(e, item.href, closeMobileMenu)) {
                          closeMobileMenu();
                        }
                      }}
                      className={cn(
                        "px-4 py-3.5 rounded-xl text-base font-semibold min-h-[48px] flex items-center justify-between transition-colors",
                        isActive
                          ? "bg-brand-subtle text-brand-primary font-bold"
                          : "text-forest-950 hover:text-brand-primary hover:bg-forest-50"
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
              <div className="pt-2 border-t border-line-subtle space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  asChild
                  className={cn("w-full justify-center min-h-[48px] text-base font-bold shadow-sm", theme === "medcity" && "bg-teal-700 hover:bg-teal-800 text-white")}
                >
                  <Link
                    href={navConfig.primaryCTA.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{navConfig.primaryCTA.label}</span>
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>

                {!isSignedIn ? (
                  <Button
                    variant="secondary"
                    size="md"
                    asChild
                    className="w-full justify-center min-h-[48px] text-base font-bold"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    asChild
                    className="w-full justify-center min-h-[48px] text-base font-bold"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Subscriber Dashboard
                    </Link>
                  </Button>
                )}
              </div>

              {/* Kitchen & Lab Partner Footnote */}
              <div className="pt-3 border-t border-line-subtle/60 text-center">
                <p className="text-xs text-content-muted">
                  Doorstep Breakfast Delivery · In partnership with Berrybeats Cafe &amp; MedCity Health Labs
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
