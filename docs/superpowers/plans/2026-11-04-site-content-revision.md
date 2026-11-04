# Humming Drops Site Content Revision — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the client's 8 ordered content/structure changes to the Humming Drops homepage, MedCity Smiles page, and footer, previewing after each task.

**Architecture:** Each task is a self-contained content/structure edit to one or two existing components under `src/app` and `src/components`. No new dependencies, no schema/payment/auth changes, no new routes except possibly new sub-components for the redesigned MedCity Smiles section and 3-step journey icons. Existing dual-theme design tokens (teal/mint for MedCity, emerald/amber for Humming Drops) and `lucide-react` icons are reused — no new illustration library.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS, lucide-react, framer-motion (existing only).

**Spec:** Client change request (pasted in conversation, 2026-11-04) + `CLAUDE.md` (project root) — brochure facts are authoritative; no unconfirmed business rules (delivery windows/cutoffs/corridors) may be hard-coded.

## Global Constraints

- No new dependencies without flagging first (icons must come from the already-installed `lucide-react`).
- No fabricated MedCity Smiles clinical claims, stats, or copy not implied by the brochure or this request — tag anything invented as `PLACEHOLDER — CLIENT CONTENT REQUIRED`.
- Do not hard-code the unconfirmed assumptions listed in `CLAUDE.md` §2 (delivery windows 6–8:30 AM, 30-day cycle, 8 PM pause cutoff, delivery corridors, home sample collection, fixed-box customization rules) — existing mentions of these may stay as-is if already present, but do not add new ones.
- Sunday-closure and the revised 5+2 weekly plan (Task 7, Task 8) ARE client-confirmed facts for this change — implement them as real content, not placeholders.
- `npm run lint` and `npm run typecheck` must pass after every task.
- Preserve WCAG 2.1 AA basics already in place (focus rings, labels, `prefers-reduced-motion` via `useReducedMotion`) in any new/modified markup.
- Only the 8 listed changes — no unrelated refactors.

## Review Focus

- Every place `₹116/day`-style per-day pricing or any other per-day cost appears, not just the one instance in `pricing-section.tsx` — a partial removal leaves stale pricing visible.
- Every place the old "4 fruits / 2 veg / salad / sprouts / dry fruits 3x-week" box description appears (homepage pricing cards, box anatomy, `types/plans.ts`, `/plans`, `/subscribe`) — an inconsistent plan description across pages is worse than the old one.
- `/medcity-smiles` page is linked from the footer, navbar, and the new homepage MedCity Smiles section — redesigning it must not break any of those links or the `data-theme="medcity"` wrapper other components may rely on.
- Mobile layout for the new MedCity Smiles section and the visual 3-step journey — this site has distinct mobile/desktop branches in several components (e.g. `morning-journey.tsx`); forgetting the mobile branch is an easy miss.
- Footer simplification must not remove the only working path to `/contact`, `tel:`/WhatsApp links, or MedCity Smiles — those are the site's primary conversion/contact paths per CLAUDE.md §1 contact details.

---

### Task 1: Remove individual daily pricing

**Files:**
- Modify: `src/components/home/pricing-section.tsx:78-81` (Standard plan "Just ~₹116 / day" badge)
- Modify: `src/components/home/box-anatomy.tsx:218,232` (`(₹3,500/mo)` / `(₹4,000/mo)` toggle labels — these are monthly, not daily, so they stay; verify no per-day figure exists anywhere else)

**Interfaces:** None — isolated JSX removal.

- [ ] Step 1: Grep the repo for any other per-day price string (`/day`, `per day`, `₹116`) to confirm `pricing-section.tsx:78-81` is the only instance.
- [ ] Step 2: Remove the "Just ~₹116 / day" badge block from the Standard plan card in `pricing-section.tsx`, keeping the `₹3,500 / month` price display intact.
- [ ] Step 3: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 4: Preview: start `npm run dev`, screenshot or describe the pricing section on homepage, confirm no per-day figure remains anywhere on the page.
- [ ] Step 5: Commit: `git add src/components/home/pricing-section.tsx` then commit "fix: remove individual daily pricing display".

### Task 2 + 3: Replace the "Nourishing the Body / Cultivate Your Inner Garden" section with a new MedCity Smiles section

These two client items resolve to one change: the entire existing `HealthCommunityBridge` component (whose content runs from the "Nourishing the Body, Cultivating the Mind" heading through the "Cultivate Your Inner Garden" card) is removed, and a new, distinctly redesigned MedCity Smiles section is built to take its place in the homepage flow (immediately before `TwoPillars`, same slot the old section occupied).

**Files:**
- Delete: `src/components/home/health-community-bridge.tsx`
- Create: `src/components/home/medcity-smiles-section.tsx`
- Modify: `src/app/page.tsx:2-9,29-31` (swap `HealthCommunityBridge` import/usage for the new component)

**Interfaces:**
- Produces: `export function MedCitySmilesSection(): JSX.Element` — no props, self-contained like its predecessor. Must render a `Link href="/medcity-smiles"` CTA (preserve the existing navigation path).

- [ ] Step 1: Design the new section's content using only brochure-confirmed facts: MedCity Smiles community membership, free monthly checkups (blood sugar, cholesterol, blood pressure), community of doctors/nutritionists — reuse copy ideas from `medcity-smiles/page.tsx`'s "Holistic Plan" cards rather than inventing new claims. Any copy not traceable to the brochure or this request gets tagged `PLACEHOLDER — CLIENT CONTENT REQUIRED` in a code comment.
- [ ] Step 2: Build `MedCitySmilesSection` in the new file using the MedCity teal/mint theme tokens (`#156C63`/`#0D5049`, `#E6F7F5`, `#F8FAF9`) per `CLAUDE.md` §3, visually distinct from the old gamified-garden framing (drop the "stardust"/"bloom" virtual-garden gamification copy — not a confirmed feature).
- [ ] Step 3: Delete `src/components/home/health-community-bridge.tsx`.
- [ ] Step 4: In `src/app/page.tsx`, replace the `HealthCommunityBridge` import and `<HealthCommunityBridge />` usage with `MedCitySmilesSection`, keeping its position directly above `<TwoPillars />`.
- [ ] Step 5: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 6: Grep the repo for any other import of `HealthCommunityBridge` or `health-community-bridge` to confirm nothing else references the deleted file.
- [ ] Step 7: Preview: start `npm run dev`, screenshot/describe the homepage section order (Hero → MedCity Smiles section → Two Pillars → ...), confirm the old "Cultivate Your Inner Garden" copy is gone.
- [ ] Step 8: Commit: "feat: replace health-community-bridge with redesigned MedCity Smiles section".

### Task 4: Redesign the `/medcity-smiles` page

**Files:**
- Modify: `src/app/medcity-smiles/page.tsx` (full content/structure revision, 3 existing sections: Hero, Holistic Plan, Health Monitoring)

**Interfaces:** None new — page remains a default-exported Server Component at the same route; keeps using `CONFIRMED_VITALS_BENEFITS` from `src/types/health.ts`.

- [ ] Step 1: Read `src/types/health.ts` to confirm `CONFIRMED_VITALS_BENEFITS` shape before restructuring Section 3.
- [ ] Step 2: Restructure the page's sections and visual presentation (new section order/layout, refreshed hero framing, consolidated or re-grouped holistic-plan cards) while keeping every factual claim traceable to the brochure (monthly checkups: blood sugar, cholesterol, blood pressure; doctors/nutritionists community; MedCity Health Labs partnership). Do not add new clinical claims.
- [ ] Step 3: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 4: Preview: start `npm run dev`, screenshot/describe `/medcity-smiles` at mobile and desktop widths.
- [ ] Step 5: Commit: "feat: redesign MedCity Smiles page".

### Task 5: Visual 3-step journey

**Files:**
- Modify: `src/components/home/morning-journey.tsx` (both the `block sm:hidden` mobile branch at lines 96-158 and the `hidden sm:block` desktop branch at lines 163-324)

**Interfaces:** `JOURNEY_STEPS: JourneyStep[]` (existing type, lines 12-58) stays the data source; no signature change needed — this task is presentation-only, replacing plain-text step cards with icon-forward/illustration-style visual treatment (e.g., larger icon badges, a connecting path/graphic between steps) using only `lucide-react` icons already imported plus any additional icons from the same package.

- [ ] Step 1: Redesign the mobile vertical step cards (lines 107-141) to foreground each step's icon (e.g., large circular icon badge as the primary visual, number as a small accent) rather than text-first.
- [ ] Step 2: Redesign the desktop step selector + detail card (lines 168-282) the same way — icon-led visual hierarchy, keep the existing click/hover/focus interaction and active-step detail panel behavior intact.
- [ ] Step 3: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 4: Preview: start `npm run dev`, screenshot/describe the "How Your Morning Box Reaches You" section at mobile and desktop widths, confirm `prefers-reduced-motion` still disables the ping/motion animations (check `shouldReduceMotion` branches remain honored).
- [ ] Step 5: Commit: "feat: make 3-step journey visually icon-driven".

### Task 6: Shorten the footer

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/types/navigation.ts` (`SHARED_FOOTER_CONFIG.linkGroups`, ~line 81) if link groups are reduced

**Interfaces:** `SHARED_FOOTER_CONFIG` shape (phone, whatsapp, email, location, partners, linkGroups) stays the same type — only the data/content shrinks, no type change, since it's imported elsewhere.

- [ ] Step 1: Grep for other consumers of `SHARED_FOOTER_CONFIG` to confirm trimming `linkGroups` won't break another page.
- [ ] Step 2: Decide and remove non-essential footer content: keep brand block, contact strip (phone/WhatsApp/email/location), and the bottom copyright bar's core links (About, MedCity Smiles, Contact, Subscribe); drop or merge the separate `linkGroups` columns if they duplicate the bottom bar's links.
- [ ] Step 3: Simplify `footer.tsx` markup to match the reduced content (fewer grid columns).
- [ ] Step 4: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 5: Preview: start `npm run dev`, screenshot/describe the footer on any page at mobile and desktop widths, confirm contact links (`tel:`, WhatsApp, `mailto:`) and MedCity Smiles link still work.
- [ ] Step 6: Commit: "refactor: shorten footer to essential information".

### Task 7: Highlight Sunday holiday in the Daily Breakfast Box section

**Files:**
- Modify: `src/components/home/box-anatomy.tsx` (section header area, lines 180-236, and/or the "Seasonal Disclaimer" area at line 456-459)

**Interfaces:** None — additive JSX only.

- [ ] Step 1: Add a clearly visible notice in the "What is Inside Your Daily Box?" section stating deliveries run 6 days a week and the business is closed every Sunday (no delivery Sundays) — a styled badge/banner near the header, not buried in the seasonal-disclaimer footnote.
- [ ] Step 2: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 3: Preview: start `npm run dev`, screenshot/describe the box-anatomy section, confirm the Sunday closure notice is visually prominent (not just small print) at mobile and desktop widths.
- [ ] Step 4: Commit: "feat: highlight Sunday closure in daily breakfast box section".

### Task 8: Update the weekly breakfast plan to 5 days fruit/veg box + 2 days oats meal

This is the highest blast-radius task — it changes the core plan description referenced from `types/plans.ts` and rendered in `pricing-section.tsx`, `box-anatomy.tsx`, `/plans`, and `/subscribe`.

**Files:**
- Modify: `src/types/plans.ts` — update `OFFICIAL_PLANS.standard.boxInclusions` and `OFFICIAL_PLANS.premium.boxInclusions` (lines 26-51) to reflect: 5 days fresh fruit & vegetable box (4 fruit varieties, 3 vegetable varieties, 1 sprouts portion, dry fruit mix) + 2 days healthy oats meal (oats + fruits + dry fruits)
- Modify: `src/components/home/pricing-section.tsx:88-131,201-233` (Standard/Premium inclusion lists — hard-coded, not driven by `OFFICIAL_PLANS`, so must be edited in parallel with `plans.ts`)
- Modify: `src/components/home/box-anatomy.tsx:31-152` (`COMPARTMENTS` array — restructure from the old 5-compartment-everyday model to reflect the 5-day fruit/veg box vs. 2-day oats meal split; the dry-fruits compartment's `getFrequency`/`getShortSummary`/`getHighlights` per-tier logic at lines 133-151 needs rework since dry fruits now appear in both the fruit/veg days and the oats days)
- Modify: `src/app/plans/page.tsx` and `src/app/subscribe/page.tsx` — read these first to find where plan inclusions are rendered/referenced and update to match
- Check: `src/lib/db/schema.ts`, `src/lib/lead-storage.ts`, `src/app/dashboard/overview/page.tsx`, `src/app/subscribe/page.tsx` (flagged earlier by grep as containing plan/pricing text) — confirm whether each needs a copy update or is unaffected (e.g., schema likely just stores the tier id, not descriptive text)

**Interfaces:**
- Produces: `OFFICIAL_PLANS` keeps its existing `SubscriptionPlan`/`PlanInclusion` types (`src/types/plans.ts:1-18`) — only the `boxInclusions` data values change, so any consumer typed against `PlanInclusion[]` keeps compiling.

- [ ] Step 1: Read `src/app/plans/page.tsx` and `src/app/subscribe/page.tsx` in full to find every rendering of plan inclusions/day-structure before editing.
- [ ] Step 2: Update `OFFICIAL_PLANS` in `types/plans.ts`: both tiers' `boxInclusions` become `[{ title: "Fresh Fruit & Vegetable Box", frequency: "5 Days a Week" }, { title: "4 Varieties of Fruits", frequency: "On Box Days" }, { title: "3 Varieties of Vegetables", frequency: "On Box Days" }, { title: "Mixed Sprouts Portion", frequency: "On Box Days" }, { title: "Dry Fruits Mix", frequency: "On Box Days" }, { title: "Healthy Oats Meal", frequency: "2 Days a Week" }, { title: "Oats with Fruits & Dry Fruits", frequency: "On Oats Days" }]` (exact wording may be refined, but the 5-day fruit/veg + 2-day oats structure and the fruit/veg/sprout/dry-fruit counts above are fixed by the spec).
- [ ] Step 3: Update `pricing-section.tsx`'s hard-coded inclusion `<li>` lists for both Standard and Premium cards to match the new structure (drop the old "2 Varieties of Vegetables... Every Day" / "Dry Fruits — 3 Days a Week" lines).
- [ ] Step 4: Rework `box-anatomy.tsx`'s `COMPARTMENTS` array to present the 5-day fruit/veg box compartments (fruits, vegetables, sprouts, dry fruits) separately from a new "Healthy Oats Meal" compartment/tab for the 2 oats days, updating `getFrequency`/`getShortSummary`/`getHighlights` accordingly; remove the now-inapplicable "Fresh Mix Salad" compartment if salad is no longer part of the revised box (confirm against the spec: the client's revised list is fruits/veg/sprouts/dry-fruits + oats — salad is not mentioned, so drop it).
- [ ] Step 5: Update `/plans` and `/subscribe` pages per what Step 1 found.
- [ ] Step 6: For each file flagged in the "Check" list, confirm and fix only if it renders plan-structure copy (not just a tier id or price).
- [ ] Step 7: Run `npm run lint` and `npm run typecheck` — expect both to pass.
- [ ] Step 8: Preview: start `npm run dev`, screenshot/describe the homepage pricing section, box-anatomy section, `/plans`, and `/subscribe`, confirming the 5-day fruit/veg + 2-day oats structure is consistent across all four.
- [ ] Step 9: Commit: "feat: update weekly breakfast plan to 5-day fruit/veg box + 2-day oats meal".

---

## Final Step (after all 8 tasks)

- [ ] Update `docs/tracker.md` marking the corresponding task(s) complete per `CLAUDE.md` §8 verification loop, only after all lint/typecheck/visual checks above have passed.
