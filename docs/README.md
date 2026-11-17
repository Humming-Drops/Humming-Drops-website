# Humming Drops & MedCity Smiles — Consolidated Master Documentation

**Project:** Humming Drops & MedCity Smiles Web Platform  
**Location:** Bangalore, India  
**Stack Baseline:** Next.js 15+ (App Router), React 19, TypeScript (Strict), Tailwind CSS, Radix UI Primitives, Framer Motion, Clerk Auth, Drizzle ORM / Railway PostgreSQL, MongoDB Atlas, Cloudinary, Razorpay  
**Status:** Authoritative Repository Documentation Gateway  
**Version:** 1.1  
**Root Guide:** See [Root README](../README.md) for quickstart and developer onboardings.  

---

## 1. Executive Summary & Brand Purpose

Humming Drops is a premium wellness brand founded in Bangalore delivering fresh, mixed-cut breakfast boxes to doorsteps every morning. In close collaboration with **MedCity Health Labs** and **Berrybeats Cafe**, Humming Drops unites daily physical vitality with holistic mental healthcare through the **MedCity Smiles Community**.

> **"Nourishing the Body. Uplifting the Mind. Building a Happier Community."**  
> *Tagline:* **"Healthy Drops, Healthier you"**

### Dual Pillars Under One Unified Ecosystem
1. **Humming Drops (Physical Wellbeing):**
   * Daily 5-compartment nutritional breakfast box:
     * 🍎 4 Varieties of Fresh Fruits — Every Day
     * 🥕 2 Varieties of Crisp Vegetables — Every Day
     * 🥗 Fresh Mix Salad — Every Day
     * 🌱 Fresh Sprouts — Every Day
     * 🥜 Dry Fruits — 3 Days/Week (Standard Plan) / Daily (Premium Plan)
   * Subscription Plans:
     * **Standard Plan:** ₹3,500 / month
     * **Premium Plan:** ₹4,000 / month (Includes Daily Dry Fruits, MedCity Labs discounts, and Special Healthy Juice Drops curated with CARE by Berrybeats).
2. **MedCity Smiles (Mental Wellbeing & Preventative Health):**
   * Free monthly health checkups for every subscriber:
     1. Blood Sugar (Fasting / PP)
     2. Cholesterol (Lipid Profile)
     3. Blood Pressure
   * Community of certified doctors and clinical nutritionists.
   * 4 Holistic Pillars: *Fuel Your Brain*, *Cultivate Positive Self-Talk*, *Happy-Healthy Coping Mechanisms*, and *Community Gatherings*.

---

## 2. Authoritative Documentation Architecture

The `docs/` directory is structured into specialized, mutually reinforcing modules:

```
docs/
├── README.md                      # [YOU ARE HERE] Master Documentation Gateway
├── plan.md                        # Master Implementation Plan (Phases 0 to 17)
├── reference.md                   # UX Benchmark Analysis (Headspace, Good Inside, Eat Wholy)
├── tracker.md                     # Detailed Task Tracker (HD-001 to HD-195) & Acceptance Criteria
├── uiux-design.md                 # Design System Specification, WCAG Tokens & Spacing
├── product-requirements-baseline.md # HUM-14: Comprehensive PRD & Business Rules Inventory
├── razorpay-payment-webhook-audit.md # HUM-15: Razorpay Payment & Webhook Lifecycle Audit
├── verification-suite-proposal.md # HUM-16: Build, Typecheck & Verification Suite Plan
├── specifications/                # Specialized Engineering & Architectural Specifications
│   ├── drizzle-orm-schema-spec.md # HUM-12: Persistence & Drizzle ORM Schema Specification
│   └── uiux-brand-hierarchy-architecture.md # HUM-13: Brand Hierarchy & UI Architecture
├── adr/                           # Architecture Decision Records (ADRs)
│   ├── README.md                  # ADR Index & Lifecycle Policy
│   ├── ADR-001-nextjs-typescript-strict.md
│   ├── ADR-002-dual-brand-visual-hierarchy.md
│   ├── ADR-003-pluggable-checkout-strategy.md
│   ├── ADR-004-server-authoritative-lifecycle.md
│   ├── ADR-005-lead-repository-pattern.md
│   ├── ADR-006-health-pii-data-isolation.md
│   ├── ADR-007-client-truth-guardrail.md
│   ├── ADR-008-component-design-system.md
│   └── ADR-009-clerk-application-identity.md
├── runbooks/                      # Standard Operating Procedures & Engineering Runbooks
│   ├── README.md                  # Runbook Index & Escalation Matrix
│   ├── local-development.md       # RB-01: Engineering Setup & Local Server Guide
│   ├── build-and-verification.md  # RB-02: Typecheck, Lint, and Automated Test Suite
│   ├── lead-operations-handover.md# RB-03: Bangalore Hub SOP & WhatsApp Lead Triage (8618902810)
│   ├── incident-management.md     # RB-04: Emergency Triage, Storage Repair, PII Safeguards
│   ├── deployment-and-staging.md  # RB-05: Vercel Hosting, Custom Domain & DNS Setup
│   └── database-migrations.md     # RB-06: Railway PostgreSQL Drizzle Migrations SOP
└── handover/                      # Client Handover Deliverables
    └── client-handover-spec.md    # Formal Client Handover Specification & Sign-Off Matrix
```

### Specialized Engineering & Product Specifications
* **[Product Requirements Baseline](product-requirements-baseline.md):** Complete catalog of functional & non-functional requirements, business invariants, customer user journeys, and the CIR decision register.
* **[Drizzle ORM & Database Specification](specifications/drizzle-orm-schema-spec.md):** Production PostgreSQL schema definition, indexing strategy, transaction boundaries, and Supabase / Railway migration roadmap.
* **[UI/UX Brand Hierarchy Architecture](specifications/uiux-brand-hierarchy-architecture.md):** Semantic token structure, dual brand switching mechanics, typography clamp scales, and accessible micro-interactions.
* **[Razorpay Payment & Webhook Audit](razorpay-payment-webhook-audit.md):** Payment state machine, cryptographic HMAC SHA-256 signature verification, webhook replay protection, and refund workflows.
* **[Verification Suite Proposal](verification-suite-proposal.md):** Automated testing roadmap covering Vitest unit suites, Playwright E2E testing, CI pipeline definitions, and coverage metrics.

---

## 3. Architecture & Technical Foundation

### Core Stack
* **Framework:** Next.js 15+ using App Router (`src/app/`).
* **Language:** TypeScript 5+ configured with strict typechecking (`"strict": true`, `"noImplicitAny": true`).
* **Styling:** Tailwind CSS with CSS custom property theming engine.
* **Component Primitives:** Headless, accessible primitives via Radix UI & shadcn/ui (`src/components/ui/`).
* **Motion & Animation:** `framer-motion` (< 300ms, adhering to `prefers-reduced-motion`).
* **State & Data Ingestion:** Pluggable Repository Pattern (`ILeadRepository`), supporting local zero-network JSON store (`data/leads.json`) and transition to PostgreSQL via Drizzle ORM.
* **Payments:** Dual-mode strategy (`CheckoutStrategy`) supporting Mode A (Razorpay Online Gateway) and Mode B (Assisted WhatsApp Lead Capture).

### Directory Layout
```text
src/
├── app/                           # App Router routes and API endpoints
│   ├── (public pages)             # /, /about, /contact, /medcity-smiles, /plans, /subscribe
│   ├── (auth shells)              # /login, /register, /forgot-password
│   ├── dashboard/                 # /dashboard, /overview, /delivery, /health, /community, /settings
│   └── api/                       # API Route Handlers
│       ├── payments/              # /order, /verify, /webhook (Razorpay)
│       └── subscriptions/         # /lead (Lead ingestion & reference query)
├── components/                    # Modular React components
│   ├── home/                      # Editorial hero, BoxAnatomy, MorningJourney, WhyUs, etc.
│   ├── layout/                    # Navbar, Footer, BrandSwitcher, MobileDrawer
│   ├── theme/                     # ThemeProvider and ThemeScript
│   └── ui/                        # Button, Badge, Card, Container, Section, etc.
├── lib/                           # Core utilities, configs, and storage engines
│   ├── checkout-config.ts         # Server-authoritative checkout mode & contact configs
│   ├── lead-storage.ts            # Repository interface & JsonFileLeadRepository
│   └── utils.ts                   # Classname merge helper (cn)
└── types/                         # Shared TypeScript domain contracts
    ├── health.ts                  # Health vitals and test contracts
    ├── navigation.ts              # Route definitions and navbar item types
    ├── plans.ts                   # Subscription tiers (Standard vs Premium)
    ├── subscription.ts            # Lead DTOs, fulfillment modes, lifecycle states
    └── theme.ts                   # Dual-brand theme tokens
```

---

## 4. Key Architectural Decisions (ADR Summary)

* **[ADR-001: Next.js 15+ App Router](adr/ADR-001-nextjs-typescript-strict.md):** Unified monorepo housing both public pages and backend API routes with strict type safety.
* **[ADR-002: Dual-Brand Visual Hierarchy](adr/ADR-002-dual-brand-visual-hierarchy.md):** Instant runtime switching between Humming Drops (botanical green) and MedCity Smiles (mindful teal) using CSS variables without style recalculation flashes.
* **[ADR-003: Pluggable Checkout Strategy](adr/ADR-003-pluggable-checkout-strategy.md):** Environment-driven switching between Razorpay Online Gateway (Mode A) and WhatsApp Assisted Lead Capture (Mode B) without code changes.
* **[ADR-004: Server-Authoritative Lifecycle](adr/ADR-004-server-authoritative-lifecycle.md):** Enforces `pending_confirmation != active` and server-side canonical pricing (`₹3,500` / `₹4,000`), preventing price tampering or unauthorized perk access.
* **[ADR-005: Lead Repository Pattern](adr/ADR-005-lead-repository-pattern.md):** Decouples route handlers from storage engines, providing zero-dependency local evaluation today and seamless migration to PostgreSQL/Drizzle tomorrow.
* **[ADR-006: Health Vitals & PII Isolation](adr/ADR-006-health-pii-data-isolation.md):** Medical test results isolated behind strict authentication boundaries with zero unauthenticated bulk listing.
* **[ADR-007: Client Truth Guardrail](adr/ADR-007-client-truth-guardrail.md):** Treats the client brochure as absolute ground truth; identifies and isolates unconfirmed operational assumptions (`CIR-01` to `CIR-07`).
* **[ADR-008: Accessible Component Foundation](adr/ADR-008-component-design-system.md):** Copy-owned primitives built on Radix UI ensuring full WCAG 2.1 AA keyboard and screen reader compliance.
* **[ADR-009: Clerk Authentication with PostgreSQL Identity](adr/ADR-009-clerk-application-identity.md):** Links Clerk authentication sessions to PostgreSQL user identities with role-based authorization and open-redirect protection.

---

## 5. Security & Privacy Model

1. **Client Mode Security:**
   * `NEXT_PUBLIC_CHECKOUT_MODE` is treated strictly as a client presentation hint.
   * Server-authoritative logic reads the private environment variable `CHECKOUT_MODE`.
2. **Canonical Pricing Enforced:**
   * Server rejects client-supplied pricing overrides.
   * Standard = `3500` INR, Premium = `4000` INR strictly validated in `src/app/api/subscriptions/lead/route.ts`.
3. **Health Vitals Access Control:**
   * Vitals (`Blood Sugar`, `Cholesterol`, `Blood Pressure`) and medical consult history cannot be accessed without an active authenticated session (`auth.uid()`).
4. **No Bulk PII Exposure:**
   * `GET /api/subscriptions/lead` requires an exact `ref` parameter matching `^HD-REG-\d{4}-[A-Z0-9]{5}$`. Unauthenticated bulk dumping of subscriber details is strictly prohibited.

---

## 6. Verification & Quality Assurance Suite

All changes are verified against the automated test suite and strict type checking:
```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Vitest Automated Test Suites (Unit + Smoke)
npm run test:vitest

# Production compilation
npm run build
```

---

## 7. Official Contact & Operational Partners

* **Hub Operations & Kitchen:** Berrybeats Cafe, Bangalore
* **Clinical Health & Diagnostics Partner:** MedCity Health Labs
* **Customer Helpline & WhatsApp Coordinator:** `+91 8618902810`
* **Official Support Email:** `hummingdrops@gmail.com`
* **Website Domain:** `www.hummingdrops.com`
