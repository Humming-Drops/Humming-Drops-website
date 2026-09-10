# HUMMING DROPS & MEDCITY SMILES — MASTER IMPLEMENTATION TRACKER

**Document Version:** 1.0  
**Phase:** Phase 0 — Discovery & Technical Architecture  
**Status:** Active Master Tracking Document  
**Legend:**  
* `[ ]` Pending  
* `[/]` In Progress  
* `[x]` Completed  
* `[!]` Blocked / Requires Client Input (`CIR`)  

---

## Tracking Index & Quick Links
* [Phase 0 — Discovery & Project Setup (HD-001 to HD-010)](#phase-0--discovery--project-setup)
* [Phase 1 — Product Architecture & Routes (HD-011 to HD-020)](#phase-1--product-architecture--routes)
* [Phase 2 — Design System & Tokens (HD-021 to HD-030)](#phase-2--design-system--tokens)
* [Phase 3 — Frontend Foundation & Layouts (HD-031 to HD-040)](#phase-3--frontend-foundation--layouts)
* [Phase 4 — Humming Drops Homepage (HD-041 to HD-055)](#phase-4--humming-drops-homepage)
* [Phase 5 — MedCity Smiles Homepage (HD-056 to HD-070)](#phase-5--medcity-smiles-homepage)
* [Phase 6 — Subscription Onboarding Flow (HD-071 to HD-085)](#phase-6--subscription-onboarding-flow)
* [Phase 7 — Authentication & Sessions (HD-086 to HD-095)](#phase-7--authentication--sessions)
* [Phase 8 — Subscriber Dashboard (HD-096 to HD-105)](#phase-8--subscriber-dashboard)
* [Phase 9 — Backend & Database Schema (HD-106 to HD-115)](#phase-9--backend--database-schema)
* [Phase 10 — Payment Integration (HD-116 to HD-125)](#phase-10--payment-integration)
* [Phase 11 — Responsive Polish (HD-126 to HD-135)](#phase-11--responsive-polish)
* [Phase 12 — Micro-Interactions & Motion (HD-136 to HD-145)](#phase-12--micro-interactions--motion)
* [Phase 13 — Accessibility & Inclusivity (HD-146 to HD-155)](#phase-13--accessibility--inclusivity)
* [Phase 14 — Automated Testing & QA (HD-156 to HD-165)](#phase-14--automated-testing--qa)
* [Phase 15 — Performance & Web Vitals (HD-166 to HD-175)](#phase-15--performance--web-vitals)
* [Phase 16 — Security Audit (HD-176 to HD-185)](#phase-16--security-audit)
* [Phase 17 — Production Deployment (HD-186 to HD-195)](#phase-17--production-deployment)

---

## Phase 0 — Discovery & Project Setup

### 0.1 Asset & Content Extraction
* [x] **HD-001:** Extract and catalog all text from `Humming-Drops-Brochure.pdf` (8 pages complete).
* [x] **HD-002:** Inspect and extract official visual assets:
  * [x] Humming Drops high-resolution logo (`references/Humming drop Logo .png`)
  * [x] 5-compartment daily box photo (`scratch/brochure_images/p1_4_X18.png`)
  * [x] MedCity Smiles official logo (`scratch/brochure_images/p5_2_X14.png`)
  * [x] Berrybeats partner logo (`scratch/brochure_images/p1_2_X11.png`)
* [x] **HD-003:** Sample and document exact brand hex color values from official logos and assets.
* [x] **HD-004:** Catalog all factual claims, pricing, inclusions, and partner data.
* [x] **HD-005:** Identify and isolate all missing information under Client Decisions Required (`CIR-01` to `CIR-07`).

### 0.2 Design Skills & Reference Benchmarking
* [x] **HD-006:** Install and ingest `frontend-design` skill guidance.
* [x] **HD-007:** Install and ingest `impeccable` skill guidance.
* [x] **HD-008:** Complete analysis of brand references (Headspace, Good Inside, Eat Wholy).
* [x] **HD-009:** Complete 8-point architectural evaluation of UI component libraries.
* [x] **HD-010:** Compile master reference and architecture documents:
  * [x] `/docs/reference.md`
  * [x] `/docs/plan.md`
  * [x] `/docs/tracker.md`
  * [x] `/docs/uiux-design.md`
  * [x] `CLAUDE.md`

#### Phase 0 Verification & Acceptance Criteria
* [x] Acceptance: Factual truth grounded 100% in client brochure.
* [x] Acceptance: Zero hallucinated testimonials, medical guarantees, or pricing.
* [x] Acceptance: Five core documentation files created and aligned.

---

## Phase 1 — Product Architecture & Routes

### 1.1 Project Scaffolding & Routing Hierarchy
* [x] **HD-011:** Initialize Next.js 15+ project with strict TypeScript (`"strict": true`), Tailwind CSS, and App Router.
* [x] **HD-012:** Scaffold complete route hierarchy matching sitemap (19 routes total: 15 application routes + 4 API route handlers):
  * [x] `/` (Humming Drops Homepage shell)
  * [x] `/medcity-smiles` (MedCity Smiles Homepage shell)
  * [x] `/plans` (Plans comparison shell)
  * [x] `/subscribe` (Subscription onboarding shell)
  * [x] `/about` (Brand & Kitchen story shell)
  * [x] `/contact` (Contact & Location shell)
  * [x] `/login` (Sign-in shell)
  * [x] `/register` (Sign-up shell)
  * [x] `/forgot-password` (Password recovery shell)
  * [x] `/dashboard` (Dashboard shell)
  * [x] `/dashboard/overview` (Delivery overview shell)
  * [x] `/dashboard/delivery` (Delivery calendar shell)
  * [x] `/dashboard/health` (Health vitals shell with strict privacy guard)
  * [x] `/dashboard/community` (Community sessions shell)
  * [x] `/dashboard/settings` (Account settings shell)
  * [x] `/api/subscriptions/lead` (Assisted lead handler shell)
  * [x] `/api/payments/order` (Order creation shell)
  * [x] `/api/payments/verify` (Signature verification shell)
  * [x] `/api/payments/webhook` (Gateway webhook shell)
* [x] **HD-013:** Define TypeScript architectural contracts (`src/types/` for navigation, plans, subscriptions, health vitals, and checkout).
* [x] **HD-014:** Implement Checkout Mode Security module (`src/lib/checkout-config.ts`), ensuring `NEXT_PUBLIC_CHECKOUT_MODE` is strictly client-side UI configuration and server-side logic remains authoritative.
* [x] **HD-015:** Implement Subscription Lifecycle State Model (`registration_submitted` → `pending_confirmation` → `confirmed/active`), guaranteeing that pending WhatsApp registrations are never treated as active subscriptions.
* [x] **HD-016:** Enforce Health Data Privacy boundaries in types and route shells (sensitive health data isolated, accessible only by authenticated owner).

#### Test Cases (Phase 1)
* [x] **TC-011:** Route tree compiles with zero Next.js route conflicts or syntax errors (`npm run build`).
* [x] **TC-012:** TypeScript strict typecheck passes with 0 errors (`npx tsc --noEmit`).
* [x] **TC-013:** All primary routes render clean structural placeholders with correct `<title>` and metadata.
* [x] **TC-014:** Server checkout configuration rejects client-side mode spoofing attempts.
* [x] **TC-015:** Subscription status validator enforces `pending_confirmation != active` guard.

---

## Phase 2 — Design System & Tokens

### 2.1 Color Tokens & Theming Engine
* [x] **HD-021:** Configure Tailwind CSS color palette for Humming Drops (`forest-900: #144518`, `forest-800: #1b5e20`, `leaf-500: #2e7301`, `cream-50: #fdfcf7`).
* [x] **HD-022:** Configure Tailwind CSS color palette for MedCity Smiles (`teal-900: #0d5049`, `teal-700: #156c63`, `mint-100: #e6f7f5`).
* [x] **HD-023:** Create CSS variable mappings for semantic tokens (`--bg-canvas`, `--bg-surface`, `--primary-brand`, `--text-primary`, `--border-subtle`, `--shadow-card`).
* [x] **HD-024:** Verify WCAG AA/AAA contrast ratios for all text-on-surface pairings (`scratch/test-phase2-design-tokens.mjs`).

### 2.2 Typography, Spacing & Elevation
* [x] **HD-025:** Configure Google Fonts (`Plus Jakarta Sans` and `Inter`) with `next/font/google` (`display: swap`).
* [x] **HD-026:** Define responsive typography scale from `caption` to `display-hero`.
* [x] **HD-027:** Implement spacing scale (4px/8px rhythm) and container constraints (`max-w-7xl`, `max-w-reading`, `max-w-form-flow`).
* [x] **HD-028:** Configure disciplined border radii (`rounded-pill` for CTAs/badges, `rounded-2xl` for cards).
* [x] **HD-029:** Configure custom botanical and mindful soft shadows (`shadow-card`, `shadow-raised`, `shadow-floating`).

#### Test Cases (Phase 2)
* [x] **TC-021:** Contrast ratio >= 4.5:1 on all body text, >= 3:1 on large text (verified by automated test suite).
* [x] **TC-022:** Fonts load without layout shift (`font-display: swap`).
* [x] **TC-023:** CSS variables seamlessly switch tokens when toggling brand modes.

---

## Phase 3 — Frontend Foundation & Layouts

### 3.1 Project Scaffold & Tooling
* [x] **HD-031:** Initialize Next.js project with TypeScript strict mode, ESLint, and Prettier.
* [x] **HD-032:** Install core dependencies (`clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`).
* [x] **HD-033:** Scaffold accessible primitives into `@/components/ui/` (`Button`, `Badge`, `Card`, `Container`, `Section`).

### 3.2 Global Header & Footer Components
* [x] **HD-034:** Build `Navbar.tsx` with responsive desktop menu, accessible mobile drawer, and dual brand switcher.
* [x] **HD-035:** Implement persistent sticky header with backdrop blur effect.
* [x] **HD-036:** Build `Footer.tsx` containing Bangalore location, Berrybeats Cafe info, MedCity Health Labs info, phone, and email.
* [x] **HD-037:** Build `BrandSwitcher.tsx` with smooth animated active pill indicator and accessible keyboard tablist.

#### Test Cases (Phase 3)
* [x] **TC-031:** TypeScript compiles with 0 errors (`npm run build`).
* [x] **TC-032:** Navbar renders correctly on mobile (hamburger drawer) and desktop.
* [x] **TC-033:** Mobile drawer closes on navigation and ESC key press.
* [x] **TC-034:** Header stays pinned during scroll with smooth backdrop blur.

---

## Phase 4 — Humming Drops Homepage (Refinement Pass Complete)

### 4.1 UX Flow Architecture
* [x] **HD-040:** Implemented editorial user journey: **Discover → Explore → Understand → Connect → Trust → Subscribe → Action**, moving pricing/subscription conversion to the end of the homepage.

### 4.2 Hero Section (Editorial Redesign)
* [x] **HD-041:** Build editorial `Hero.tsx` with headline "Healthy Drops, Healthier you", hand-drawn wavy underline accent, brochure sub-copy, and exploratory CTAs ("Explore What's Inside" & "The Morning Ritual").
* [x] **HD-042:** Implement authentic 5-compartment breakfast box centerpiece (`/images/humming-drops-box.png`, priority load) with asymmetrical layout.
* [x] **HD-043:** Add handcrafted doodle arrows and floating annotations pointing to compartments ("🍎 4 Fruits Every Day", "🥕 2 Crisp Vegetables", "🥗 Fresh Mix Salad & Sprouts", "Meticulously Prepared").

### 4.3 Interactive Box Experience (Replacing Generic Cards)
* [x] **HD-045:** Build `BoxAnatomy.tsx` centering on the authentic box photo with 5 clickable/tappable compartment hotspots:
  * [x] 01: 4 Varieties of Fruits — Every Day
  * [x] 02: 2 Varieties of Vegetables — Every Day
  * [x] 03: Fresh Mix Salad — Every Day
  * [x] 04: Fresh Sprouts — Every Day
  * [x] 05: Dry Fruits (3 Days/Week in Standard, Daily in Premium)
* [x] **HD-046:** Dynamic compartment reveal card with animated transitions, mobile-friendly touch pill selector, and interactive Standard (₹3,500/mo) vs. Premium (₹4,000/mo) toggle.

### 4.4 Morning Ritual & Sourcing Journey
* [x] **HD-052:** Build `MorningJourney.tsx` as an illustrated visual path connecting 4 milestone steps (Fresh Morning Harvest → Thoughtful Preparation at Berrybeats Cafe → Doorstep Morning Delivery → Nourish Body & Mind) paired with authentic fresh produce imagery (`/images/humming-drops-fresh-produce.png`).

### 4.5 Why Humming Drops & Daily Habit Philosophy
* [x] **HD-055:** Build `WhyHummingDrops.tsx` based on Brochure Pages 2 & 7, contrasting the modern nutrient challenge with the daily whole-food habit solution.

### 4.6 Health Monitoring & MedCity Smiles Bridge
* [x] **HD-051:** Build `HealthCommunityBridge.tsx` highlighting the mind-body connection, the 4 MedCity Smiles wellness pillars, and free monthly Sugar, Cholesterol, and BP tests in partnership with MedCity Health Labs.

### 4.7 Plans & Pricing Comparison (Conversion Payoff)
* [x] **HD-047:** Build `PricingSection.tsx` at the end of the journey featuring Standard (₹3,500/mo) and Premium (₹4,000/mo) cards with strict brochure fidelity.
* [x] **HD-048:** Daily cost breakdown indicators (`~₹116/day` vs `~₹133/day`).
* [x] **HD-049:** Highlight Premium-exclusive perks (Daily dry fruits, MedCity Labs discounts, special healthy juice drops by CARE by Berrybeats).
* [x] **HD-050:** Assisted booking helpline card with verified WhatsApp/call details (`8618902810` · `Berrybeats cafe, Bangalore`).

### 4.8 Closing CTA
* [x] **HD-054:** Build `ClosingCTA.tsx` with final subscription invitation, direct WhatsApp link, and confirmed partner/location attribution.

#### Test Cases (Phase 4)
* [x] **TC-041:** Desktop hero renders without layout shifts; box image loads with `priority`.
* [x] **TC-042:** Mobile view stacks hero copy, imagery, and touch selectors cleanly; zero horizontal overflow (tested across 375px, 768px, 1280px, 1440px).
* [x] **TC-043:** Interactive hotspots dynamically update compartment cards on click/tap with full keyboard accessibility.
* [x] **TC-044:** Pricing cards clearly articulate difference between Standard and Premium.
* [x] **TC-045:** Strict content safety guardrail passes: zero unconfirmed operational claims ("chilled delivery", "Bangalore kitchen", "across Bangalore" promises removed).

---

## Phase 4.6 — Backend Integration & Lead Persistence (40% Presentation Slice)

### 4.9 End-to-End Onboarding & Persistence Engine
* [x] **HD-046A:** Configured `.env.example` documenting server-authoritative checkout mode (`CHECKOUT_MODE=assisted_lead`) and safe client presentation hint (`NEXT_PUBLIC_CHECKOUT_MODE=assisted_lead`).
* [x] **HD-046B:** Implemented `src/lib/lead-storage.ts` with repository pattern (`ILeadRepository` interface) and isolated demo server-side JSON repository (`JsonFileLeadRepository`) targeting `data/leads.json`.
* [x] **HD-046C:** Hardened `src/app/api/subscriptions/lead/route.ts` with server-side validation (Indian mobile regex, email format, string sanitization, canonical pricing guardrail, and `pending_confirmation` lifecycle enforcement).
* [x] **HD-046D:** Upgraded `src/app/subscribe/page.tsx` into a complete 5-step interactive wizard (Plan Selection, Contact, Bangalore Address, Dietary Preferences, Order Review & Mode B Assisted Registration).
* [x] **HD-046E:** Built confirmation view with prominent `HD-REG-YYYY-XXXXX` reference code, `Pending Manual Confirmation` status badge (guaranteeing `pending_confirmation != active`), and direct WhatsApp link to official Bangalore coordinator (`8618902810`).
* [x] **HD-046F:** Automated end-to-end integration test suite `scratch/test-phase4-backend-flow.mjs` verifying 6/6 test assertions over live HTTP.

#### Test Cases (Phase 4.6)
* [x] **TC-046A:** Valid subscription lead submission succeeds (HTTP 201) and returns unique reference code.
* [x] **TC-046B:** Invariant guardrail verified: `status === "pending_confirmation"` and `hasActivePerks === false`.
* [x] **TC-046C:** Client price tampering rejected; canonical pricing (Standard ₹3,500 / Premium ₹4,000) strictly enforced on server.
* [x] **TC-046D:** Invalid phone numbers, invalid emails, and empty payloads rejected with descriptive HTTP 400 field errors.
* [x] **TC-046E:** Submitted leads are persisted to `data/leads.json` with complete audit metadata.
* [x] **TC-046F:** Verified lead query via `GET /api/subscriptions/lead?ref=...`.

---

## Phase 5 — MedCity Smiles Homepage

### 5.1 Hero & Mental Wellness Philosophy
* [ ] **HD-056:** Build `MedCityHero.tsx` with headline "Uplifting the Mind. Building a Happier Community."
* [ ] **HD-057:** Render official MedCity Smiles emblem and community badges.
* [ ] **HD-058:** Build `WhyMentalHealthMatters.tsx` based on brochure Page 5 copy.

### 5.2 The Holistic Mind-Body Pillars
* [ ] **HD-059:** Build `MindBodyPillars.tsx` detailing:
  * [ ] Fuel Your Brain (Nutrition & mood stability)
  * [ ] Cultivate Positive Self-Talk (Self-compassion & reframing)
  * [ ] Happy-Healthy Coping Mechanisms (Movement, yoga, art, music, writing)
  * [ ] Community Live Sessions & Safe Sharing Circles

### 5.3 Doctor & Expert Network
* [ ] **HD-060:** Build `ExpertNetwork.tsx` showcasing doctors and clinical nutritionists.
* [ ] **HD-061:** Add credential cards detailing advisory specialties and guidance availability.

### 5.4 Preventative Health Center
* [ ] **HD-062:** Build `HealthMonitoringDetail.tsx` explaining Blood Sugar, Cholesterol, and BP monthly monitoring.
* [ ] **HD-063:** Detail MedCity Health Labs partnership and exclusive package discounts.

### 5.5 Live Sessions Schedule & Community CTA
* [ ] **HD-064:** Build `UpcomingSessions.tsx` with interactive event calendar and RSVP modal.
* [ ] **HD-065:** Build `CommunityJoinCta.tsx` linking free membership to Humming Drops subscription.

#### Test Cases (Phase 5)
* [ ] **TC-051:** MedCity Smiles theme applies serene teal/mint visual styling without breaking global nav.
* [ ] **TC-052:** Expert cards render responsively in 1, 2, and 3-column configurations.
* [ ] **TC-053:** RSVP modal triggers and traps focus correctly with accessible close action.
* [ ] **TC-054:** All brochure copy regarding mental health is verbatim and respectfully framed.

---

## Phase 6 — Subscription Onboarding Flow

### 6.1 Multi-Step Checkout Engine (`/subscribe`)
* [ ] **HD-071:** Build step progress indicator (Steps 1 to 5) with accessible current-step announcement.
* [ ] **HD-072:** **Step 1 (Plan Selection):** Interactive Standard (₹3,500) vs. Premium (₹4,000) cards.
* [ ] **HD-073:** **Step 2 (Account & Profile):** Full Name, Mobile Number, Email, Password / OTP.
* [ ] **HD-074:** **Step 3 (Bangalore Delivery Address - Provisional):** Flat, Building, Street, Area, Pincode, optional instructions/timing note (flexible capture without rigid whitelist constraints; `CIR-01`, `CIR-02`).
* [ ] **HD-075:** **Step 4 (Dietary Preferences):** Diet type, allergen notes, customer instructions (`CIR-06`).
* [ ] **HD-076:** **Step 5 (Order Review & Pluggable Checkout):** Itemized breakdown, delivery fee (₹0), total monthly charge, with dynamic fulfillment handler (Razorpay Online Gateway OR Assisted Lead Registration; `CIR-07`).
* [ ] **HD-077:** Build `ConfirmationView.tsx` supporting:
  * [ ] Mode A: Instant payment success receipt, active subscription badge, and WhatsApp community link.
  * [ ] Mode B: Lead reference code (e.g. `HD-REG-74291`), one-click WhatsApp chat link to Humming Drops Bangalore team (`8618902810`), and manual activation steps.

#### Test Cases (Phase 6)
* [ ] **TC-071:** Form preserves entered data when navigating backwards (`Previous Step`).
* [ ] **TC-072:** Field validation displays descriptive inline error messages on invalid input.
* [ ] **TC-073:** Address capture accepts valid Bangalore pincodes without breaking on unconfirmed neighborhood boundaries.
* [ ] **TC-074:** Responsive checkout displays sticky order summary bar on mobile screens.
* [ ] **TC-075:** Switching `NEXT_PUBLIC_CHECKOUT_MODE` toggles checkout UI between Online Payment and WhatsApp Assisted Registration cleanly.

---

## Phase 7 — Authentication & Sessions

### 7.1 Supabase Auth Implementation
* [ ] **HD-086:** Configure Supabase client and auth helper libraries.
* [ ] **HD-087:** Build `LoginPage.tsx` supporting email/password and mobile OTP.
* [ ] **HD-088:** Build `RegisterPage.tsx` with immediate profile record creation.
* [ ] **HD-089:** Build `ForgotPasswordPage.tsx` and password reset callback handler.
* [ ] **HD-090:** Implement Next.js Middleware route guard protecting `/dashboard/*`.

#### Test Cases (Phase 7)
* [ ] **TC-081:** Unauthenticated access to `/dashboard` redirects to `/login`.
* [ ] **TC-082:** Successful login redirects user back to intended destination.
* [ ] **TC-083:** Auth cookies set with `HttpOnly`, `SameSite=Lax`, and `Secure` flags.

---

## Phase 8 — Subscriber Dashboard

### 8.1 Dashboard Modules
* [ ] **HD-096:** Build `DashboardLayout.tsx` with responsive sidebar and mobile bottom navigation.
* [ ] **HD-097:** Build `TodayBoxWidget.tsx` displaying morning delivery status and today's fruit menu.
* [ ] **HD-098:** Build `DeliveryCalendar.tsx` allowing 1-click delivery pause and vacation scheduling (provisional rules, `CIR-03`, `CIR-04`).
* [ ] **HD-099:** Build `VitalsHistory.tsx` showing past Blood Sugar, Cholesterol, and BP test logs.
* [ ] **HD-100:** Build `CommunityEventsWidget.tsx` listing enrolled MedCity Smiles webinars with join links.
* [ ] **HD-101:** Build `SubscriptionSettings.tsx` for plan upgrades, invoice downloads, and address edits.

#### Test Cases (Phase 8)
* [ ] **TC-091:** Delivery pause updates status immediately with optimistic UI update.
* [ ] **TC-092:** Health vitals display clearly with normal/borderline status color indicators.
* [ ] **TC-093:** Invoice download triggers valid receipt PDF generation.

---

## Phase 9 — Backend & Database Schema

### 9.1 Database Tables & RLS Policies
* [ ] **HD-106:** Create `profiles` table linked to `auth.users`.
* [ ] **HD-107:** Create `subscription_plans` and `user_subscriptions` tables (supporting both gateway and assisted lead fulfillment modes).
* [ ] **HD-108:** Create `delivery_addresses` and `dietary_preferences` tables (flexible schemas without restrictive hardcoded business constraints).
* [ ] **HD-109:** Create `health_vitals` table for Sugar, Cholesterol, and BP checkup logs.
* [ ] **HD-110:** Create `community_sessions` and `session_registrations` tables.
* [ ] **HD-111:** Create `payments` table for transaction audits (supporting online gateway records and offline/assisted lead entries).
* [ ] **HD-112:** Write and test Row Level Security (RLS) policies for all tables.

#### Test Cases (Phase 9)
* [ ] **TC-101:** Users cannot query or mutate records belonging to other `user_id`s.
* [ ] **TC-102:** Foreign key cascading prevents orphaned records on user account deletion.
* [ ] **TC-103:** Database indexes verify sub-10ms query execution on user dashboard fetches.

---

## Phase 10 — Payment & Fulfillment Integration (Pluggable Architecture)

### 10.1 Pluggable Fulfillment Architecture
* [ ] **HD-116:** Build `CheckoutStrategy` interface supporting Mode A (`RazorpayOnlineCheckout`) and Mode B (`WhatsAppLeadCapture`).
* [ ] **HD-117:** **Mode A (Razorpay Online Gateway - Proposed Production Option):**
  * [ ] Implement `/api/payments/create-order` with server-side price validation.
  * [ ] Implement client-side Razorpay Checkout modal launch (UPI, Cards, NetBanking).
  * [ ] Implement `/api/payments/verify` with HMAC-SHA256 signature verification.
  * [ ] Implement webhook endpoint (`/api/payments/webhook`) for asynchronous reconciliation.
* [ ] **HD-118:** **Mode B (Assisted Registration & WhatsApp Lead Capture):**
  * [ ] Implement `/api/subscriptions/submit-lead` endpoint capturing customer details.
  * [ ] Generate unique lead reference code (e.g. `HD-REG-74291`).
  * [ ] Generate direct WhatsApp chat URL with prefilled order details to `8618902810`.
  * [ ] Implement manual admin confirmation endpoint for activating subscriptions.
* [ ] **HD-119:** Add environment switch (`NEXT_PUBLIC_CHECKOUT_MODE`) to toggle between Mode A and Mode B without code changes.

#### Test Cases (Phase 10)
* [ ] **TC-111:** Order amount tampering in client payload is rejected by server.
* [ ] **TC-112:** Mode A: Valid HMAC signature activates user subscription in database.
* [ ] **TC-113:** Mode A: Invalid signature triggers 400 Bad Request and logs security alert.
* [ ] **TC-114:** Mode B: Submitting lead creates `pending_confirmation` record and produces correct WhatsApp URL to `8618902810`.

---

## Phase 11 — Responsive Polish

### 11.1 Multi-Device Verification
* [ ] **HD-126:** Verify mobile layout (320px – 480px) across iOS Safari and Android Chrome.
* [ ] **HD-127:** Verify tablet portrait and landscape layouts (768px – 1024px).
* [ ] **HD-128:** Verify desktop and ultra-wide layouts (1280px – 1920px+).
* [ ] **HD-129:** Eliminate any horizontal scroll (`overflow-x: hidden` verification).
* [ ] **HD-130:** Verify all tap targets meet minimum 44px x 44px size.

#### Test Cases (Phase 11)
* [ ] **TC-121:** Zero horizontal scrollbar across all routes at 375px viewport.
* [ ] **TC-122:** Sticky checkout CTA does not obscure mobile form input fields.

---

## Phase 12 — Micro-Interactions & Motion

### 12.1 Purposeful Framer Motion
* [ ] **HD-136:** Add subtle entrance reveals to hero elements with staggered delays.
* [ ] **HD-137:** Add interactive 3D lift to 5-compartment box preview cards.
* [ ] **HD-138:** Implement smooth sliding layout animation on the brand switcher toggle.
* [ ] **HD-139:** Implement `useReducedMotion` hook ensuring animations are disabled when preferred.

#### Test Cases (Phase 12)
* [ ] **TC-131:** All animations complete within 300ms.
* [ ] **TC-132:** System with `prefers-reduced-motion: reduce` shows zero transform or slide animations.

---

## Phase 13 — Accessibility & Inclusivity

### 13.1 WCAG 2.1 AA Audit
* [ ] **HD-146:** Audit all interactive elements for full keyboard accessibility (`Tab`, `Space`, `Enter`).
* [ ] **HD-147:** Add high-visibility focus ring tokens (`focus-visible:ring-2`).
* [ ] **HD-148:** Audit all images for descriptive `alt` tags (`alt=""` for decorative).
* [ ] **HD-149:** Ensure all form fields have associated `<label>` or `aria-label` elements.
* [ ] **HD-150:** Run automated axe-core accessibility scanner across all views.

#### Test Cases (Phase 13)
* [ ] **TC-141:** 0 critical or serious axe-core violations on any page.
* [ ] **TC-142:** Complete subscription funnel executable using keyboard only.

---

## Phase 14 — Automated Testing & QA

### 14.1 Test Suites
* [ ] **HD-156:** Setup Vitest for unit tests (pricing calculations, date cutoffs).
* [ ] **HD-157:** Write component tests for `PricingSection`, `Navbar`, and `StepProgress`.
* [ ] **HD-158:** Setup Playwright for End-to-End tests (Checkout flow, Brand switch, Dashboard pause).
* [ ] **HD-159:** Configure GitHub Actions CI workflow to run linter, typecheck, and test suite on push.

#### Test Cases (Phase 14)
* [ ] **TC-151:** 100% pass rate on unit and integration test suites.
* [ ] **TC-152:** Playwright E2E passes on desktop Chrome, Firefox, and mobile WebKit.

---

## Phase 15 — Performance & Web Vitals

### 15.1 Optimization & Audits
* [ ] **HD-166:** Optimize all produce and logo images to Next-gen WebP/AVIF formats.
* [ ] **HD-167:** Ensure self-hosted Google Fonts via `next/font` with zero FOIT/FOUT.
* [ ] **HD-168:** Code-split heavy dashboard modals and chart visualizations.
* [ ] **HD-169:** Audit Lighthouse scores for Mobile and Desktop.

#### Test Cases (Phase 15)
* [ ] **TC-161:** Lighthouse Performance score >= 90 on mobile.
* [ ] **TC-162:** Largest Contentful Paint (LCP) <= 2.0s on 4G network profile.

---

## Phase 16 — Security Audit

### 16.1 Hardening
* [ ] **HD-176:** Verify zero API keys or secrets in client-side bundles.
* [ ] **HD-177:** Validate all incoming API payloads using strict `zod` schemas.
* [ ] **HD-178:** Configure HTTP security headers (CSP, HSTS, X-Frame-Options).
* [ ] **HD-179:** Implement IP rate-limiting on sensitive auth and payment routes.

#### Test Cases (Phase 16)
* [ ] **TC-171:** Penetration test verifies unauthorized users cannot read another user's vitals.
* [ ] **TC-172:** SecurityHeaders.com score grade A or higher.

---

## Phase 17 — Production Deployment

### 17.1 Vercel & Domain Release
* [ ] **HD-186:** Configure production environment variables in Vercel.
* [ ] **HD-187:** Set up custom domain `www.hummingdrops.com` with automated SSL.
* [ ] **HD-188:** Configure database backup schedules and disaster recovery protocols.
* [ ] **HD-189:** Verify error monitoring and analytics tracking in production.

#### Test Cases (Phase 17)
* [ ] **TC-181:** Live production domain loads over HTTPS with A+ SSL rating.
* [ ] **TC-182:** Test transaction executes end-to-end on production infrastructure.
