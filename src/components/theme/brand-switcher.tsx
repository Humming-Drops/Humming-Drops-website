"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBrandTheme } from "./brand-provider";
import { cn } from "@/lib/utils";

interface BrandSwitcherProps {
  className?: string;
  navigateOnSwitch?: boolean;
}

export function BrandSwitcher({
  className,
  navigateOnSwitch = false,
}: BrandSwitcherProps) {
  const { theme, setTheme } = useBrandTheme();
  const router = useRouter();

  const handleSelect = (selectedTheme: "humming" | "medcity") => {
    setTheme(selectedTheme);
    if (navigateOnSwitch) {
      if (selectedTheme === "humming") {
        router.push("/");
      } else {
        router.push("/medcity-smiles");
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Brand Experience Switcher"
      className={cn(
        "inline-flex items-center p-1 bg-muted/80 backdrop-blur-sm rounded-pill border border-line-subtle shadow-sm select-none",
        className
      )}
    >
      <button
        role="tab"
        aria-selected={theme === "humming"}
        onClick={() => handleSelect("humming")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900 focus-visible:ring-offset-1",
          theme === "humming"
            ? "text-forest-950 font-bold"
            : "text-content-secondary hover:text-content-primary"
        )}
      >
        {theme === "humming" && (
          <motion.div
            layoutId="brandPill"
            className="absolute inset-0 bg-surface rounded-pill shadow-sm border border-line-subtle -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span aria-hidden="true">🥗</span>
        <span className="hidden sm:inline">Humming Drops</span>
        <span className="text-[10px] text-forest-700 hidden md:inline font-normal">
          · Physical
        </span>
      </button>

      <button
        role="tab"
        aria-selected={theme === "medcity"}
        onClick={() => handleSelect("medcity")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-1",
          theme === "medcity"
            ? "text-teal-950 font-bold"
            : "text-content-secondary hover:text-content-primary"
        )}
      >
        {theme === "medcity" && (
          <motion.div
            layoutId="brandPill"
            className="absolute inset-0 bg-surface rounded-pill shadow-sm border border-line-subtle -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span aria-hidden="true">💚</span>
        <span className="hidden sm:inline">MedCity Smiles</span>
        <span className="text-[10px] text-teal-700 hidden md:inline font-normal">
          · Mental & Labs
        </span>
      </button>
    </div>
  );
}
