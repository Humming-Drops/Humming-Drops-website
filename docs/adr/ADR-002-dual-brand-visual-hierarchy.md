# ADR-002: Dual-Brand Visual Hierarchy via CSS Custom Property Switching

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Lead Product Designer, Frontend Lead  
**Tags:** ui, design-system, css-variables, theming, dual-brand  

---

## Context and Problem Statement

The platform unites two complementary but emotionally distinct wellness pillars:
1. **Humming Drops (Physical Wellbeing):** Energetic, crisp, organic morning produce delivery. Requires verdant forest greens (`#144518`), fresh leaf tones (`#2E7301`), warm morning cream (`#FDFCF7`), and vibrant produce accents.
2. **MedCity Smiles (Mental Wellbeing):** Grounded, serene, restorative mental healthcare and doctor community. Requires deep mindful teals (`#0D5049`, `#156C63`), soft mint (`#E6F7F5`), and calm mist surfaces.

We need a design architecture that allows both brands to feel distinct while sharing a single application shell, layout foundation, and navigation header without duplicating CSS or causing layout flashing.

## Considered Options

1. **CSS Custom Properties (Variables) switched via `data-theme` attribute on `<html>` or route wrappers.**
2. **Hardcoded Tailwind classes conditioned on route pathname (e.g. `pathname.startsWith('/medcity') ? 'bg-teal-900' : 'bg-forest-900'`).**
3. **Separate microsites or subdomains (`medcity.hummingdrops.com` vs `hummingdrops.com`).**
4. **CSS-in-JS theming engine (e.g. styled-components / emotion).**

## Decision Outcome

Chosen option: **Option 1: CSS Custom Properties switched via `data-theme` / semantic Tailwind tokens**.

### Justification

* **Seamless Runtime Token Switching:** Tokens such as `--primary-brand`, `--bg-canvas`, `--bg-surface`, `--text-primary`, and `--border-subtle` are declared in CSS and mapped into `tailwind.config.ts`.
* **Zero CSS-in-JS Overhead:** Eliminates runtime JS style recalculation penalties and hydration flashes.
* **Persistent Brand Switcher:** The global `Navbar` includes an animated `BrandSwitcher` pill component that allows instantaneous visual toggling between Physical Nutrition and Mental Wellbeing.
* **Accessibility Conformance:** All token pairings in both themes are pre-calculated to satisfy WCAG 2.1 AA/AAA contrast ratios (verified by automated tests in `scratch/test-phase2-design-tokens.mjs`).

## Consequences

### Positive
* Single unified component library (`@/components/ui/`) automatically renders in the correct brand palette based on active theme context.
* Clean separation of brand concerns without fragmented codebases.
* Fully compatible with Server Components.

### Negative / Trade-offs
* Developers must use semantic design tokens (`text-primary`, `bg-surface`, `border-subtle`) instead of hardcoding raw color utilities (e.g. avoiding raw `bg-[#144518]`).
