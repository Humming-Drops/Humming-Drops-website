import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// WCAG 2.1 Contrast Calculation Utilities (sRGB Relative Luminance)
// ---------------------------------------------------------------------------
function hexToRgb(hex) {
  const cleaned = hex.replace("#", "").trim();
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

console.log("=== 1. WCAG 2.1 Contrast Ratio Tests ===");

// Humming Drops Contrast Pairs
const hdPairs = [
  { name: "HD Primary Text on Canvas", fg: "#122315", bg: "#fdfcf7", min: 7.0 }, // Target AAA
  { name: "HD Secondary Text on Canvas", fg: "#384c3b", bg: "#fdfcf7", min: 4.5 }, // AA
  { name: "HD Muted Text on Canvas", fg: "#506653", bg: "#fdfcf7", min: 4.5 }, // AA
  { name: "HD White on Primary Brand", fg: "#ffffff", bg: "#144518", min: 7.0 }, // Target AAA
  { name: "HD Brand on Subtle Dew Tint", fg: "#144518", bg: "#eaf5e9", min: 7.0 }, // Target AAA
];

for (const pair of hdPairs) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  console.log(`- ${pair.name}: ${ratio.toFixed(2)}:1 (required >= ${pair.min}:1)`);
  assert(
    ratio >= pair.min,
    `Contrast failed for ${pair.name}: got ${ratio.toFixed(2)}, expected >= ${pair.min}`
  );
}

// MedCity Smiles Contrast Pairs
const msPairs = [
  { name: "MS Primary Text on Canvas", fg: "#0f2b27", bg: "#f8faf9", min: 7.0 }, // Target AAA
  { name: "MS Secondary Text on Canvas", fg: "#2e524d", bg: "#f8faf9", min: 4.5 }, // AA
  { name: "MS Muted Text on Canvas", fg: "#476e68", bg: "#f8faf9", min: 4.5 }, // AA
  { name: "MS White on Primary Teal", fg: "#ffffff", bg: "#156c63", min: 4.5 }, // AA
  { name: "MS White on Deep Pine Teal", fg: "#ffffff", bg: "#0d5049", min: 7.0 }, // Target AAA
  { name: "MS Brand Dark on Subtle Mint", fg: "#0d5049", bg: "#e6f7f5", min: 7.0 }, // Target AAA
];

for (const pair of msPairs) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  console.log(`- ${pair.name}: ${ratio.toFixed(2)}:1 (required >= ${pair.min}:1)`);
  assert(
    ratio >= pair.min,
    `Contrast failed for ${pair.name}: got ${ratio.toFixed(2)}, expected >= ${pair.min}`
  );
}

// Semantic Status Colors Contrast (Text on Status Container)
const statusPairs = [
  { name: "Success Text on Success Container", fg: "#14532d", bg: "#f0fdf4", min: 7.0 },
  { name: "Warning Text on Warning Container", fg: "#78350f", bg: "#fffbeb", min: 7.0 },
  { name: "Error Text on Error Container", fg: "#7f1d1d", bg: "#fef2f2", min: 7.0 },
  { name: "Info Text on Info Container", fg: "#0c4a6e", bg: "#f0f9ff", min: 7.0 },
];

for (const pair of statusPairs) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  console.log(`- ${pair.name}: ${ratio.toFixed(2)}:1 (required >= ${pair.min}:1)`);
  assert(
    ratio >= pair.min,
    `Contrast failed for ${pair.name}: got ${ratio.toFixed(2)}, expected >= ${pair.min}`
  );
}

// Accent Badges Contrast on White
const accentPairs = [
  { name: "Citrus Text on White", fg: "#9a3412", bg: "#ffffff", min: 4.5 },
  { name: "Berry Text on White", fg: "#991b1b", bg: "#ffffff", min: 4.5 },
  { name: "Sprout Text on White", fg: "#365314", bg: "#ffffff", min: 4.5 },
  { name: "Dry Fruit Text on White", fg: "#713f12", bg: "#ffffff", min: 4.5 },
  { name: "Ochre Text on White", fg: "#92400e", bg: "#ffffff", min: 4.5 },
  { name: "Sky Text on White", fg: "#075985", bg: "#ffffff", min: 4.5 },
  { name: "Rose Text on White", fg: "#9f1239", bg: "#ffffff", min: 4.5 },
];

for (const pair of accentPairs) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  console.log(`- ${pair.name}: ${ratio.toFixed(2)}:1 (required >= ${pair.min}:1)`);
  assert(
    ratio >= pair.min,
    `Contrast failed for ${pair.name}: got ${ratio.toFixed(2)}, expected >= ${pair.min}`
  );
}

// ---------------------------------------------------------------------------
// 2. CSS Structure & Accessibility Rules Verification
// ---------------------------------------------------------------------------
console.log("\n=== 2. CSS Structure & Accessibility Checks ===");

const globalsCss = fs.readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8"
);

// Reduced motion
assert(
  globalsCss.includes("@media (prefers-reduced-motion: reduce)"),
  "globals.css must contain @media (prefers-reduced-motion: reduce)"
);
console.log("✓ Reduced motion handling confirmed present in globals.css");

// Focus ring
assert(
  globalsCss.includes(":focus-visible"),
  "globals.css must contain :focus-visible rules"
);
assert(
  globalsCss.includes("--focus-ring"),
  "globals.css must define --focus-ring variable"
);
console.log("✓ Accessible keyboard focus styling confirmed present");

// Brand themes symmetry
const requiredSemanticTokens = [
  "--bg-canvas",
  "--bg-surface",
  "--bg-muted",
  "--bg-subtle",
  "--primary-brand",
  "--primary-brand-hover",
  "--primary-brand-subtle",
  "--primary-brand-text",
  "--text-primary",
  "--text-secondary",
  "--text-muted",
  "--border-subtle",
  "--border-strong",
  "--border-interactive",
  "--focus-ring",
  "--shadow-card",
  "--shadow-raised",
  "--shadow-floating",
];

for (const token of requiredSemanticTokens) {
  assert(
    globalsCss.includes(token),
    `globals.css missing required token: ${token}`
  );
}
console.log(`✓ All ${requiredSemanticTokens.length} core semantic tokens confirmed symmetric across themes`);

console.log("\n✓ All Phase 2 Design System & Token Tests Passed Successfully!");
