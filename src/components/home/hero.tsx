"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, ChevronRight, ChevronDown, Sparkles, Clock, ShieldCheck, Sun, Apple, Salad, HeartPulse, Play } from "lucide-react";
import { DoodleSquiggle } from "@/components/ui/doodles";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const floatingBadgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: (customDelay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: customDelay,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlayingMobileVideo, setIsPlayingMobileVideo] = useState(false);
  const [isDesktopCapable, setIsDesktopCapable] = useState(false);

  // Check screen size, Save-Data and reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkScreen = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkScreen();
      window.addEventListener("resize", checkScreen);

      const isSaveData =
        (navigator as unknown as { connection?: { saveData?: boolean } })?.connection?.saveData === true;
      if (!isSaveData && !shouldReduceMotion) {
        setIsDesktopCapable(true);
      }

      return () => window.removeEventListener("resize", checkScreen);
    }
  }, [shouldReduceMotion]);

  // Ensure video pauses when scrolled out of view and resumes when scrolled back in
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isDesktopCapable, isMobile, isPlayingMobileVideo]);

  const handleScrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showVideo = (!isMobile && isDesktopCapable) || (isMobile && isPlayingMobileVideo);

  return (
    <section
      aria-label="Welcome to Humming Drops"
      className="relative overflow-hidden bg-[#FCFDF9] min-h-[auto] lg:h-[calc(100svh-4.25rem)] lg:min-h-[640px] lg:max-h-[840px] flex flex-col lg:flex-row items-stretch"
    >
      {/* Background Soft Radiant Glows for Morning Warmth */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100/60 via-mint/40 to-transparent rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-amber-100/40 via-yellow-50/30 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* =========================================================================
          DESKTOP RIGHT / MOBILE TOP: FRESH PRODUCE SHOWCASE (VIDEO / IMAGES + FLOATING PILLS)
          ========================================================================= */}
      <div className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[54%] xl:w-[56%] h-[46svh] sm:h-[50svh] lg:h-full overflow-hidden bg-mint z-0 rounded-b-[32px] lg:rounded-none">
        {showVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.jpg"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noremoteplayback nofullscreen"
            tabIndex={-1}
            className="w-full h-full object-cover object-center pointer-events-none"
            style={{
              filter: "saturate(1.08) brightness(1.02)",
            }}
            aria-hidden="true"
          >
            <source src="/videos/hero-clean.mp4" type="video/mp4" />
          </video>
        ) : (
          <>
            <Image
              src="/images/hero-poster.jpg"
              alt="Humming Drops Fresh Daily Produce Box"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover object-center pointer-events-none"
            />
            {/* Mobile Play Button - Tap to Play for speed & battery efficiency */}
            {isMobile && !shouldReduceMotion && (
              <button
                type="button"
                onClick={() => setIsPlayingMobileVideo(true)}
                aria-label="Play video"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-full bg-white/90 hover:bg-white text-emerald-800 shadow-floating backdrop-blur-md transition-transform active:scale-95 cursor-pointer border border-white/60"
              >
                <Play className="w-6 h-6 fill-emerald-800 ml-1 text-emerald-800" aria-hidden="true" />
              </button>
            )}
          </>
        )}

        {/* Soft edge gradient to blend seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 lg:hidden pointer-events-none" />

        {/* Floating Trust Badge 1 (Top Left / Right) */}
        <motion.div
          custom={0.3}
          variants={floatingBadgeVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-[0_8px_20px_rgba(0,0,0,0.12)] text-xs font-bold text-[#132A1C]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Doorstep Delivery by 7:30 AM</span>
        </motion.div>

        {/* Floating Trust Badge 3 (Bottom Right) */}
        <motion.div
          custom={0.7}
          variants={floatingBadgeVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-6 right-6 z-20 hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-900/90 backdrop-blur-md text-white border border-emerald-700/50 text-xs font-semibold shadow-lg"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Triple-Washed &amp; 100% Ready-to-Eat</span>
        </motion.div>
      </div>

      {/* =========================================================================
          DESKTOP LEFT / MOBILE BOTTOM: BRIGHT, WELCOMING COPY PANEL
          ========================================================================= */}
      <motion.div
        className="relative z-10 w-full lg:w-[48%] xl:w-[46%] bg-[#FCFDF9] flex flex-col justify-between items-center lg:items-end px-5 sm:px-8 lg:pl-10 lg:pr-12 pt-7 pb-6 lg:pt-10 lg:pb-8 -mt-6 lg:mt-0 rounded-t-[32px] lg:rounded-none shadow-card lg:shadow-none"
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Organic S-Curve Divider along Right Seam on Desktop */}
        <div className="hidden lg:block absolute top-0 bottom-0 -right-16 xl:-right-20 w-16 xl:w-20 h-full z-20 pointer-events-none">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="w-full h-full filter drop-shadow-[8px_0_16px_rgba(20,50,30,0.04)]"
          >
            <path
              d="M 0,0 L 40,0 C 90,260 10,480 75,740 C 98,850 88,940 70,1000 L 0,1000 Z"
              fill="#FCFDF9"
            />
            <path
              d="M 40,0 C 90,260 10,480 75,740 C 98,850 88,940 70,1000"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Content Container (Max width 540px, pristine readability) */}
        <div className="max-w-[540px] w-full text-left my-auto">
          <motion.div
            className="space-y-5 sm:space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* 1. Welcoming Pill Tag Row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Fresh Morning Nutrition</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-medium">Daily Doorstep</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Zero Prep Required</span>
              </span>
            </motion.div>

            {/* 2. Main Headline with radiant gradient and sun scribble */}
            <motion.div variants={fadeInUp} className="space-y-1">
              <h1 className="text-[2.35rem] sm:text-5xl lg:text-[3.85rem] font-extrabold tracking-tight flex flex-col gap-1 leading-[1.12] text-left">
                <span className="text-[#132A1C]">Healthy Drops,</span>
                <span className="relative inline-block pb-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Healthier You
                  <DoodleSquiggle
                    className="absolute -bottom-[8px] left-0 w-full h-3 text-sun pointer-events-none stroke-[3.5]"
                    color="#FBBF24"
                  />
                </span>
              </h1>
            </motion.div>

            {/* 3. Subline (Crystal clear for first time users) */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#405347] font-normal leading-relaxed max-w-lg"
            >
              Start every morning with fresh-cut seasonal fruits, crisp salads, sprouted microgreens, and wholesome nuts — triple-washed and delivered straight to your door before 7:30 AM.
            </motion.p>

            {/* 4. Action CTAs */}
            <motion.div variants={fadeInUp} className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/subscribe?plan=standard"
                  className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-base shadow-[0_10px_26px_rgba(22,163,74,0.32)] hover:from-emerald-700 hover:to-green-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
                >
                  <span>Start Your Morning Plan</span>
                  <ChevronRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#box-experience"
                  onClick={handleScrollToSection("box-experience")}
                  className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-emerald-600/30 bg-white text-emerald-800 font-bold text-base hover:bg-emerald-50 hover:border-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <span>See what&apos;s inside</span>
                  <ArrowDown className="w-4 h-4 text-emerald-600" />
                </a>
              </div>

              {/* Sub-CTA Informational Line */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#405347] pt-1">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" /> Plans from ₹116/day
                </span>
                <span>•</span>
                <span>Pause or cancel anytime</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Free Health Check</span>
              </div>
            </motion.div>

            {/* 5. Trust Bar: Horizontally scrollable chip row on mobile with scroll snap / 3-grid on tablet/desktop */}
            <motion.div
              variants={fadeInUp}
              className="pt-3.5 border-t border-[#E3EFE5]"
            >
              <div className="flex sm:grid sm:grid-cols-3 gap-2.5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-1 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
                <div className="shrink-0 snap-start flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C] bg-white border border-[#E3EFE5] px-3.5 py-2.5 rounded-2xl shadow-2xs hover:border-emerald-200 transition-colors whitespace-nowrap">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <Apple className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold">4 Cut Fruits</p>
                    <p className="text-[11px] text-[#657B6F] font-normal">&amp; 2 Veggies</p>
                  </div>
                </div>

                <div className="shrink-0 snap-start flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C] bg-white border border-[#E3EFE5] px-3.5 py-2.5 rounded-2xl shadow-2xs hover:border-amber-200 transition-colors whitespace-nowrap">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Salad className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold">Sprouts &amp; Salad</p>
                    <p className="text-[11px] text-[#657B6F] font-normal">+ Dry Fruits</p>
                  </div>
                </div>

                <div className="shrink-0 snap-start flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#132A1C] bg-white border border-sky-200/80 px-3.5 py-2.5 rounded-2xl shadow-2xs hover:border-sky-300 transition-colors whitespace-nowrap">
                  <div className="w-7 h-7 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold">Free Lab Test</p>
                    <p className="text-[11px] text-[#657B6F] font-normal">MedCity Partner</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Small Animated Chevron */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#657B6F] pt-2 pointer-events-none max-w-[540px] w-full">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-emerald-600" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
