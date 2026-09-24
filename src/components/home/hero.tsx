"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, ChevronRight, ChevronDown } from "lucide-react";
import { DoodleSquiggle } from "@/components/ui/doodles";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Check Save-Data and reduced motion for video loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSaveData = (navigator as unknown as { connection?: { saveData?: boolean } })?.connection?.saveData === true;
      if (!isSaveData && !shouldReduceMotion) {
        setShouldLoadVideo(true);
      }
    }
  }, [shouldReduceMotion]);

  // Ensure video plays reliably and pauses when off-screen
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
  }, [shouldLoadVideo]);

  const handleScrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Welcome to Humming Drops"
      className="relative overflow-hidden bg-[#FFFEF8] min-h-[auto] lg:h-[calc(100svh-4rem)] lg:min-h-[620px] lg:max-h-[820px] flex flex-col lg:flex-row items-stretch"
    >
      {/* =========================================================================
          DESKTOP RIGHT / MOBILE TOP: EDGE-TO-EDGE FULL-HEIGHT VIDEO (CLEAN, NO OVERLAYS)
          ========================================================================= */}
      <div className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[56%] xl:w-[58%] h-[44svh] sm:h-[48svh] lg:h-full overflow-hidden bg-mint z-0 rounded-b-[28px] lg:rounded-none pointer-events-none">
        {shouldLoadVideo ? (
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
              filter: "saturate(1.05)",
            }}
            aria-hidden="true"
          >
            <source src="/videos/hero-clean.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/hero-poster.jpg"
            alt="Humming Drops Fresh Produce"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-center pointer-events-none"
          />
        )}
      </div>

      {/* =========================================================================
          DESKTOP LEFT / MOBILE BOTTOM: SOLID CREAM PANEL WITH ORGANIC S-CURVE
          ========================================================================= */}
      <motion.div
        className="relative z-10 w-full lg:w-[48%] xl:w-[46%] bg-[#FFFEF8] flex flex-col justify-between items-center lg:items-end px-5 sm:px-8 lg:pl-10 lg:pr-12 pt-8 pb-4 lg:pt-12 lg:pb-6 -mt-6 lg:mt-0 rounded-t-[28px] lg:rounded-none shadow-card lg:shadow-none"
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Organic S-Curve Divider along Right Seam on Desktop */}
        <div className="hidden lg:block absolute top-0 bottom-0 -right-16 xl:-right-20 w-16 xl:w-20 h-full z-20 pointer-events-none">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="w-full h-full filter drop-shadow-[6px_0_16px_rgba(30,43,36,0.06)]"
          >
            <path
              d="M 0,0 L 40,0 C 90,260 10,480 75,740 C 98,850 88,940 70,1000 L 0,1000 Z"
              fill="#FFFEF8"
            />
            <path
              d="M 40,0 C 90,260 10,480 75,740 C 98,850 88,940 70,1000"
              fill="none"
              stroke="#FFD84D"
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
            {/* 1. Pill Tag Row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap xs:flex-nowrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs font-semibold tracking-wide shadow-2xs whitespace-nowrap">
                <span className="text-sm">☀️</span>
                <span>Fresh Every Morning · Doorstep Nutrition</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#E2ECE4] text-xs font-medium text-forest-800 shadow-2xs whitespace-nowrap">
                Meticulously prepared ✦
              </span>
            </motion.div>

            {/* 2. Main Headline: line-height 1.12 with 6px extra gap & sun underline below */}
            <motion.div variants={fadeInUp} className="space-y-1">
              <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.85rem] font-extrabold tracking-tight flex flex-col gap-1.5 leading-[1.12] text-left">
                <span className="text-[#1E2B24]">Healthy Drops,</span>
                <span className="relative inline-block pb-3 bg-gradient-to-r from-primary to-primary-bright bg-clip-text text-transparent">
                  Healthier you
                  <DoodleSquiggle
                    className="absolute -bottom-[10px] left-0 w-full h-2.5 text-sun pointer-events-none stroke-[3.5]"
                    color="#FFD84D"
                  />
                </span>
              </h1>
            </motion.div>

            {/* 3. Subline */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#4A5A52] font-normal font-sans leading-relaxed max-w-lg"
            >
              Start your morning with fresh, thoughtful, and nourishing whole foods — meticulously prepared and delivered straight to your door.
            </motion.p>

            {/* 4. CTAs */}
            <motion.div variants={fadeInUp} className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/subscribe?plan=standard"
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[20px] bg-primary text-white font-bold text-base shadow-[0_8px_24px_rgba(31,138,69,0.28)] hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>Subscribe Now</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </Link>

                <a
                  href="#box-experience"
                  onClick={handleScrollToSection("box-experience")}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] border-2 border-primary bg-white text-primary font-semibold text-base hover:bg-mint hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <span>See what&apos;s inside</span>
                  <ArrowDown className="w-4 h-4 text-primary" />
                </a>
              </div>

              {/* Sub-CTA Informational Line */}
              <p className="text-xs font-semibold text-[#4A5A52] pt-0.5">
                Plans from ₹3,500/month · Free monthly health check
              </p>
            </motion.div>

            {/* 5. Clean White Chips (14px font, 10px 14px padding, whitespace-nowrap, all 3 on one row) */}
            <motion.div
              variants={fadeInUp}
              className="pt-3 border-t border-[#E2ECE4]"
            >
              <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-3 gap-2 no-scrollbar pb-1">
                <div className="shrink-0 snap-start flex items-center gap-2 text-sm font-semibold text-[#1E2B24] bg-white border border-[#E2ECE4] px-3.5 py-2.5 rounded-[20px] shadow-2xs whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-xs text-berry">
                    🍎
                  </div>
                  <span>4 Fruits &amp; 2 Veg</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-2 text-sm font-semibold text-[#1E2B24] bg-white border border-[#E2ECE4] px-3.5 py-2.5 rounded-[20px] shadow-2xs whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-xs text-citrus">
                    🥗
                  </div>
                  <span>Salad &amp; Sprouts</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-2 text-sm font-semibold text-[#1E2B24] bg-white border border-teal-200/80 px-3.5 py-2.5 rounded-[20px] shadow-2xs whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-[#E8F7F1] border border-teal-200 flex items-center justify-center shrink-0 text-xs text-aqua">
                    🩺
                  </div>
                  <span>Free Health Check</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Small Chevron strictly inside the Left Cream Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-body/75 pt-2 pointer-events-none max-w-[540px] w-full">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-primary" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}




