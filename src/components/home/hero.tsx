"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, Sparkles, ChevronRight, HeartPulse } from "lucide-react";
import {
  DoodleArrow,
  DoodleCircle,
  DoodleSquiggle,
  DoodleSunRays,
  DoodleSprout,
  DoodleSparkle,
  HandwrittenAnnotation,
  GentleWaveDivider,
} from "@/components/ui/doodles";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

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
      className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-cream-50 to-white pt-8 pb-10 lg:pt-14 lg:pb-16"
    >
      {/* Handcrafted warm morning aura with gentle organic shapes */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-28 w-[30rem] h-[30rem] rounded-full bg-forest-100/30 blur-3xl"
        aria-hidden="true"
      />

      {/* Floating background sun doodle */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 opacity-25 text-amber-500"
        animate={shouldReduceMotion ? {} : { y: [-4, 4, -4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <DoodleSunRays className="w-16 h-16" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Emotion-First Minimal Copy (6 cols) */}
          <motion.div
            className="lg:col-span-6 space-y-6 text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Handcrafted eyebrow with sun motif */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs font-semibold tracking-wide shadow-xs">
                <span className="text-sm">☀️</span>
                <span>Fresh Every Morning · Doorstep Nutrition</span>
              </span>
              <HandwrittenAnnotation rotation="-rotate-2" color="text-forest-800 hidden sm:inline-flex">
                Meticulously prepared ✦
              </HandwrittenAnnotation>
            </motion.div>

            {/* Main Headline with Handcrafted Highlight */}
            <motion.div variants={fadeInUp} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-forest-900 tracking-tight leading-[1.08]">
                Healthy Drops, <br />
                <span className="relative inline-block text-forest-800">
                  Healthier you
                  <DoodleSquiggle
                    className="absolute -bottom-2.5 left-0 w-full text-brand-primary"
                    color="currentColor"
                  />
                </span>
              </h1>
            </motion.div>

            {/* Concise Emotional Copy */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-content-secondary leading-relaxed max-w-lg font-sans"
            >
              Start your morning with fresh, thoughtful, and nourishing whole foods — meticulously prepared and delivered straight to your door.
            </motion.p>

            {/* Exploratory Call-to-Actions */}
            <motion.div
              variants={fadeInUp}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <a
                href="#box-experience"
                onClick={handleScrollToSection("box-experience")}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-leaf-500 text-white font-semibold text-base shadow-sm hover:bg-leaf-600 active:scale-[0.99] transition-all"
              >
                <span>Explore What&apos;s Inside</span>
                <ArrowDown className="w-4 h-4 text-forest-300 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#journey"
                onClick={handleScrollToSection("journey")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-forest-300 bg-surface/90 text-forest-900 font-semibold text-base hover:bg-forest-50/80 transition-colors shadow-xs"
              >
                <span>The Morning Ritual</span>
                <ChevronRight className="w-4 h-4 text-forest-600" />
              </a>
            </motion.div>

            {/* 3 Meaningful Visual Proof Chips */}
            <motion.div
              variants={fadeInUp}
              className="pt-4 border-t border-line-subtle grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-forest-900 bg-forest-50/70 p-2 rounded-xl border border-forest-100">
                <span className="text-base">🍎</span>
                <span>4 Fruits &amp; 2 Veg Daily</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-forest-900 bg-forest-50/70 p-2 rounded-xl border border-forest-100">
                <span className="text-base">🥗</span>
                <span>Fresh Salad &amp; Sprouts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 bg-teal-50/70 p-2 rounded-xl border border-teal-100 col-span-2 sm:col-span-1">
                <span className="text-base">🩺</span>
                <span>Free Monthly Health Check</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Box Showcase with Integrated Communicative Annotations (6 cols) */}
          <motion.div
            className="lg:col-span-6 relative mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          >
            {/* The Box Centerpiece Card */}
            <div className="relative mx-auto max-w-lg">
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-amber-200/30 to-forest-200/30 blur-xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Box Photo Frame */}
              <div className="relative rounded-[2rem] p-3 sm:p-4 bg-surface border border-forest-200/90 shadow-card transition-shadow hover:shadow-floating">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-forest-50/60">
                  <Image
                    src="/images/humming-drops-box.png"
                    alt="Authentic Humming Drops 5-Compartment Breakfast Box containing fresh cut fruits, vegetables, salad, and sprouts"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                    className="object-cover object-center"
                    priority
                  />
                </div>

                {/* Box Caption Bar */}
                <div className="mt-3 px-2 flex items-center justify-between text-xs text-content-muted">
                  <span className="font-semibold text-content-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
                    Authentic 5-Compartment Box
                  </span>
                  <span>Berrybeats Cafe · Bangalore</span>
                </div>
              </div>

              {/* Hand-Drawn Communicative Annotation 1: Top-Left (4 Varieties of Fruits) */}
              <div className="hidden sm:flex absolute -top-8 -left-6 md:-left-8 flex-col items-end z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-display font-bold text-xs shadow-xs rotate-[-3deg]">
                  🍎 4 Fruits Every Day
                </span>
                <DoodleArrow
                  direction="curve-right"
                  className="w-9 h-7 text-rose-700 mt-1 -mr-2"
                />
              </div>

              {/* Hand-Drawn Communicative Annotation 2: Top-Right (2 Crisp Veggies) */}
              <div className="hidden sm:flex absolute -top-8 -right-6 md:-right-8 flex-col items-start z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-display font-bold text-xs shadow-xs rotate-[3deg]">
                  🥕 2 Crisp Vegetables
                </span>
                <DoodleArrow
                  direction="curve-left"
                  className="w-9 h-7 text-amber-700 mt-1 -ml-2"
                />
              </div>

              {/* Hand-Drawn Communicative Annotation 3: Bottom-Left (Sprouts & Salad) */}
              <div className="hidden sm:flex absolute bottom-14 -left-6 md:-left-8 flex-col items-end z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-display font-bold text-xs shadow-xs rotate-[2deg]">
                  🥗 Salad &amp; Sprouts Daily
                </span>
                <DoodleArrow
                  direction="right"
                  className="w-8 h-6 text-emerald-700 mt-1 -mr-1"
                />
              </div>

              {/* Floating Badge: Bottom-Right */}
              <div className="absolute bottom-12 right-4 sm:bottom-14 sm:right-6 bg-surface/95 backdrop-blur-sm border border-forest-200 rounded-2xl px-3.5 py-2 shadow-card flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center text-forest-800 shrink-0 text-sm">
                  🌱
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-content-primary leading-tight">
                    Meticulously Prepared
                  </span>
                  <span className="text-[10px] text-content-muted">
                    Fresh produce every morning
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile-only visual badges below image */}
            <div className="sm:hidden mt-4 flex flex-wrap justify-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                🍎 4 Fruits Daily
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                🥕 2 Veg Daily
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                🥗 Salad &amp; Sprouts
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                🥜 Dry Fruits
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gentle curved transition flowing into Box Experience */}
      <div className="mt-8 lg:mt-12 -mb-10 lg:-mb-16">
        <GentleWaveDivider fill="#ffffff" className="w-full h-8 sm:h-12 text-white" />
      </div>
    </section>
  );
}
