"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sun, Cloud, CloudLightning, Bird, Flower2, Sprout, Wind, Box, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mood = "sunny" | "cloudy" | "stormy" | "none";

export default function MedCitySmilesPage() {
  const [mood, setMood] = useState<Mood>("none");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const [stardust, setStardust] = useState(0);
  const [boxesLogged, setBoxesLogged] = useState(0);

  // Breathing logic
  useEffect(() => {
    if (!isBreathing) return;
    
    let phase = "in";
    const interval = setInterval(() => {
      if (phase === "in") {
        setBreathPhase("hold");
        phase = "hold";
      } else if (phase === "hold") {
        setBreathPhase("out");
        phase = "out";
      } else {
        setBreathPhase("in");
        phase = "in";
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
    if (selectedMood !== "none" && mood === "none") {
      setStardust((prev) => prev + 10);
    }
  };

  const handleLogBox = () => {
    setBoxesLogged((prev) => prev + 1);
    setStardust((prev) => prev + 50);
  };

  const skyColors = {
    sunny: "from-sky-300 via-blue-200 to-amber-100",
    cloudy: "from-slate-300 via-gray-200 to-slate-100",
    stormy: "from-slate-600 via-gray-500 to-slate-700",
    none: "from-teal-50 via-emerald-50 to-white",
  };

  const birdColors = {
    sunny: "text-amber-500 fill-amber-200",
    cloudy: "text-slate-500 fill-slate-200",
    stormy: "text-slate-200 fill-slate-400",
    none: "text-teal-600 fill-teal-100",
  };

  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#132A1C] font-sans selection:bg-teal-200">
      {/* Navbar */}
      <nav className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-[#E3EFE5] sticky top-0 z-50 flex items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-teal-800 hover:text-teal-900 font-bold text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Humming Drops</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#00A88F]" />
          <span className="font-extrabold text-[#132A1C] tracking-tight">MedCity Smiles</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#132A1C]">
            Your Pocket Companion
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            No streaks, no pressure. Just a gentle friend reflecting your mood, quick tools for calm, and a garden that grows with you.
          </p>
        </div>

        {/* The Companion Sky (Interactive) */}
        <div className="relative w-full aspect-square sm:aspect-video max-h-[500px] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-colors duration-1000">
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${skyColors[mood]}`} />
          
          {/* Hummingbird Avatar */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: mood === "stormy" ? [-2, 2, -2] : [0, 0, 0],
            }}
            transition={{
              duration: mood === "stormy" ? 4 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 p-6"
          >
            <Bird className={`w-32 h-32 sm:w-48 sm:h-48 transition-colors duration-1000 ${birdColors[mood]}`} />
          </motion.div>

          <div className="absolute bottom-8 left-0 w-full px-4 flex flex-col items-center gap-4 z-20">
            <p className="text-sm font-bold uppercase tracking-widest text-black/60 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full">
              {mood === "none" ? "How is your sky today?" : "Your sky is reflecting your mood."}
            </p>
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl p-2 rounded-2xl border border-white/50 shadow-lg">
              <button
                onClick={() => handleMoodSelect("sunny")}
                className={`p-3 rounded-xl transition-all ${mood === "sunny" ? "bg-white shadow-sm scale-110" : "hover:bg-white/50"}`}
                aria-label="Sunny and bright"
              >
                <Sun className="w-6 h-6 text-amber-500" />
              </button>
              <button
                onClick={() => handleMoodSelect("cloudy")}
                className={`p-3 rounded-xl transition-all ${mood === "cloudy" ? "bg-white shadow-sm scale-110" : "hover:bg-white/50"}`}
                aria-label="Cloudy or feeling okay"
              >
                <Cloud className="w-6 h-6 text-slate-500" />
              </button>
              <button
                onClick={() => handleMoodSelect("stormy")}
                className={`p-3 rounded-xl transition-all ${mood === "stormy" ? "bg-white shadow-sm scale-110" : "hover:bg-white/50"}`}
                aria-label="Stormy or struggling"
              >
                <CloudLightning className="w-6 h-6 text-slate-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sensory Tools - Breathing */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#E3EFE5] shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint border border-primary/20 text-primary text-xs font-bold">
              <Wind className="w-3.5 h-3.5" />
              <span>Sensory Tools</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#132A1C] font-display">Quiet a Busy Mind</h2>
            
            <div className="relative w-48 h-48 flex items-center justify-center my-4">
              {isBreathing ? (
                <>
                  <motion.div
                    animate={{
                      scale: breathPhase === "in" ? 1.5 : breathPhase === "out" ? 0.8 : 1.5,
                      opacity: breathPhase === "hold" ? 0.8 : 0.5,
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-teal-100 rounded-full blur-xl"
                  />
                  <motion.div
                    animate={{
                      scale: breathPhase === "in" ? 1.3 : breathPhase === "out" ? 0.9 : 1.3,
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="relative z-10 w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/30"
                  >
                    <span className="font-bold text-lg capitalize">{breathPhase}</span>
                  </motion.div>
                </>
              ) : (
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                  <Wind className="w-8 h-8" />
                </div>
              )}
            </div>

            <Button
              onClick={() => setIsBreathing(!isBreathing)}
              className="rounded-full bg-teal-700 hover:bg-teal-800 text-white px-8"
            >
              {isBreathing ? "End Breathing Exercise" : "Start Deep Breathing"}
            </Button>
          </div>

          {/* Virtual Garden Dashboard */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-[2rem] p-8 text-white shadow-xl flex flex-col space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Virtual Garden</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{stardust} Stardust</span>
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold font-display">Watch Your Wellbeing Bloom</h2>
              <p className="text-sm text-emerald-100/80 mt-2">
                Log your daily morning breakfast box and mindful check-ins to nurture your garden.
              </p>
            </div>

            <div className="relative z-10 bg-black/20 rounded-2xl p-4 border border-white/10 grid grid-cols-3 gap-3 flex-1 min-h-[160px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 flex items-center justify-center aspect-square transition-all duration-500">
                  {boxesLogged > i ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-emerald-300"
                    >
                      <Flower2 className="w-8 h-8" />
                    </motion.div>
                  ) : stardust > i * 10 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-500/50"
                    >
                      <Sprout className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleLogBox}
              variant="outline"
              className="relative z-10 w-full rounded-full bg-emerald-50 text-emerald-950 hover:bg-white border-transparent font-bold flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4 text-emerald-700" />
              <span>Log Today's Humming Drops Box</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
