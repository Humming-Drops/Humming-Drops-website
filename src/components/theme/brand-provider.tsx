"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { BrandTheme, BRAND_THEMES, BrandThemeConfig } from "@/types/theme";

interface BrandThemeContextValue {
  theme: BrandTheme;
  themeConfig: BrandThemeConfig;
  setTheme: (theme: BrandTheme) => void;
  toggleTheme: () => void;
}

const BrandThemeContext = createContext<BrandThemeContextValue | undefined>(undefined);

export function BrandThemeProvider({
  children,
  initialTheme = "humming",
}: {
  children: React.ReactNode;
  initialTheme?: BrandTheme;
}) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<BrandTheme>(() => {
    if (typeof window !== "undefined" && pathname?.startsWith("/medcity-smiles")) {
      return "medcity";
    }
    return initialTheme;
  });

  // Automatically adapt default theme when navigating between primary routes
  useEffect(() => {
    if (pathname?.startsWith("/medcity-smiles")) {
      setThemeState("medcity");
    } else if (pathname === "/" || pathname?.startsWith("/subscribe") || pathname?.startsWith("/plans")) {
      setThemeState("humming");
    }
  }, [pathname]);

  // Sync data-theme attribute on document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: BrandTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "humming" ? "medcity" : "humming"));
  };

  const themeConfig = useMemo(() => BRAND_THEMES[theme], [theme]);

  const value = useMemo(
    () => ({
      theme,
      themeConfig,
      setTheme,
      toggleTheme,
    }),
    [theme, themeConfig]
  );

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme(): BrandThemeContextValue {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error("useBrandTheme must be used within a BrandThemeProvider");
  }
  return context;
}
