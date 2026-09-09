/**
 * Theme & Design System Types for Humming Drops & MedCity Smiles
 */

export type BrandTheme = "humming" | "medcity";

export interface BrandThemeConfig {
  name: BrandTheme;
  displayName: string;
  tagline: string;
  primaryColor: string;
  canvasColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const BRAND_THEMES: Record<BrandTheme, BrandThemeConfig> = {
  humming: {
    name: "humming",
    displayName: "Humming Drops",
    tagline: "Healthy Drops, Healthier you",
    primaryColor: "#144518",
    canvasColor: "#fdfcf7",
    accentColor: "#e86a17",
    badgeBg: "#eaf5e9",
    badgeText: "#144518",
  },
  medcity: {
    name: "medcity",
    displayName: "MedCity Smiles",
    tagline: "Fuel Your Brain, Calm Your Mind",
    primaryColor: "#156c63",
    canvasColor: "#f8faf9",
    accentColor: "#d97706",
    badgeBg: "#e6f7f5",
    badgeText: "#0d5049",
  },
};
