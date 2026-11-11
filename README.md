# Humming Drops & MedCity Smiles

> **"Nourishing the Body. Uplifting the Mind. Building a Happier Community."**  
> *Official Tagline:* **"Healthy Drops, Healthier you"**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38b2ac?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.45.4-C5F74F?style=flat&logo=drizzle)](https://orm.drizzle.team/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-7.9.23-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0.5-FCC72B?style=flat&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-Private%20%2F%20Proprietary-red)](#license)

---

## Overview

**Humming Drops** is a premium daily breakfast and wellness subscription service founded in Bangalore, India. Every morning, Humming Drops delivers fresh, mixed-cut, nutrient-dense breakfast boxes directly to subscribers' doorsteps.

In strategic partnership with **MedCity Health Labs** and **Berrybeats Cafe**, Humming Drops bridges daily physical nutrition with preventative health and holistic mental wellbeing through the **MedCity Smiles Community**.

### Dual Pillars Under One Unified Ecosystem

1. **Humming Drops (Physical Nutrition & Daily Vitality):**
   * **Weekly Delivery Rhythm:** 6 delivery days per week.
     * **4 Days/Week — Fresh Fruit & Vegetable Box:**
       * 🍎 5 Varieties of Fresh Fruits
       * 🥕 3 Varieties of Crisp Vegetables
       * 🌱 Mixed Sprouts Portion
       * 🥜 Dry Fruits Mix
     * **2 Days/Week — Healthy Oats Meal:**
       * 🥣 Wholesome Oats with Fresh Fruits & Dry Fruits
   * **Subscription Plans:**
     * **Standard Plan:** `₹3,500` / month
     * **Premium Plan:** `₹4,000` / month (Standard Box + Oats + Daily Dry Fruits + MedCity Labs Package Discounts + Special Healthy Juice Drops curated with CARE by Berrybeats).

2. **MedCity Smiles (Mental Wellbeing & Preventative Healthcare):**
   * **Free Monthly Preventative Health Checkup** for every active subscriber:
     1. Blood Sugar (Fasting / PP)
     2. Cholesterol (Lipid Profile)
     3. Blood Pressure
   * **Medical Advisory Network:** Certified doctors and clinical nutritionists monitor vitals and advise members.
   * **4 Holistic Mental Wellness Pillars:** *Fuel Your Brain*, *Cultivate Positive Self-Talk*, *Happy-Healthy Coping Mechanisms*, and *Community Gatherings*.

---

## Key Features

- **Dual-Brand Dynamic Theming:** Seamless CSS custom-property switching between the verdant botanical green of **Humming Drops** (`#144518`) and the mindful restorative teal of **MedCity Smiles** (`#156C63`).
- **End-to-End Subscription Onboarding:** Interactive 5-step onboarding funnel with plan parameter preservation (`?plan=standard` / `?plan=premium`), dietary preferences, delivery slot selection, and health baseline intake.
- **Robust Identity & Authentication Gate:** Powered by **Clerk** (`@clerk/nextjs`), enforcing protected route middleware (`/subscribe`, `/dashboard`, `/admin`, `/onboarding`) with built-in open-redirect sanitization (`isSafeRedirectUrl`).
- **Pluggable Checkout Architecture (Strategy Pattern):**
  - **Mode A (Online Gateway):** Direct Razorpay checkout modal with cryptographic HMAC-SHA256 signature verification.
  - **Mode B (Assisted Lead Registration):** Frictionless lead capture with WhatsApp concierge handoff to the Bangalore dispatch team (`+91 8618902810`).
- **Customer Portal & Health Tracking:** Subscriber dashboard displaying delivery schedules, monthly health test reports, nutritionist consultations, and community event RSVPs.
- **Administrative Portal & RBAC:** Comprehensive back-office dashboard covering subscription management, lead triage, payment audit logs, staff role assignments, and content moderation.
- **Editorial Content CMS:** Articles, nutrition guides, and community announcements backed by MongoDB Atlas and optimized media delivery via Cloudinary.
- **Hybrid Persistence Layer:** PostgreSQL 16+ on Railway managed DB via Drizzle ORM with an automatic local zero-network JSON fallback for rapid offline development.

---

## Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Framework** | [Next.js 15.2.0](https://nextjs.org/) (App Router, Server Components, Route Handlers) |
| **Language** | [TypeScript 5.7.3](https://www.typescriptlang.org/) (Strict Mode: `noImplicitAny`, strict null checks) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS 3.4](https://tailwindcss.com/), Radix UI Primitives, [Lucide React](https://lucide.dev/) |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) (smooth transitions under 300ms, respecting `prefers-reduced-motion`) |
| **Authentication** | [Clerk](https://clerk.com/) (`@clerk/nextjs@7.9.23`) with Edge Middleware |
| **Primary Database** | [PostgreSQL 16+](https://www.postgresql.org/) (Railway Managed DB) with [Drizzle ORM](https://orm.drizzle.team/) & `drizzle-kit` |
| **Document Store & CMS** | [MongoDB Atlas](https://www.mongodb.com/atlas) (`mongodb@6.12.0`) for editorial and CMS content |
| **Media Storage** | [Cloudinary](https://cloudinary.com/) (`cloudinary@2.5.1`) for responsive images |
| **Payments** | [Razorpay](https://razorpay.com/) (Orders API, Webhooks, HMAC-SHA256 verification) |
| **Testing** | [Vitest 3.0.5](https://vitest.dev/) for unit and smoke verification suites |

---

## Repository Structure

```text
├── docs/                        # Master engineering and architectural documentation
│   ├── README.md                # Documentation portal & index
│   ├── adr/                     # Architecture Decision Records (ADR-001 to ADR-009)
│   ├── runbooks/                # Standard Operating Procedures & Engineering Runbooks
│   ├── specifications/          # Drizzle ORM schema & UI/UX hierarchy specs
│   ├── product-requirements-baseline.md  # PRD & client business rules
│   └── razorpay-payment-webhook-audit.md # Payment lifecycle & webhook audits
├── drizzle/                     # SQL migration files generated by drizzle-kit
│   ├── 0000_baseline_schema.sql
│   ├── 0001_add_clerk_identity.sql
│   ├── 0002_rbac_and_cms.sql
│   ├── ...
├── public/                      # Static assets (favicons, manifest, branding logos)
├── references/                  # Client ground truth (Brochure PDF, official logos)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (public pages)       # /, /about, /contact, /medcity-smiles, /plans
│   │   ├── (auth pages)         # /login, /register, /forgot-password
│   │   ├── subscribe/           # 5-step customer subscription flow
│   │   ├── onboarding/          # Customer post-registration profile onboarding
│   │   ├── dashboard/           # Customer portal (/overview, /delivery, /health, /community)
│   │   ├── admin/               # Administrative back-office (/subscriptions, /leads, /payments, /staff)
│   │   ├── content/             # Editorial CMS articles and community stories
│   │   └── api/                 # Secure Route Handlers
│   │       ├── admin/           # Administrative endpoints (RBAC-guarded)
│   │       ├── customer/        # Customer profile, subscription & health vitals
│   │       ├── payments/        # Razorpay order creation, verification, and webhooks
│   │       ├── subscriptions/   # Lead ingestion and referral queries
│   │       └── webhooks/        # Clerk identity synchronization webhooks
│   ├── components/              # Modular UI components
│   │   ├── home/                # Editorial hero, BoxAnatomy, MorningJourney, WhyUs, etc.
│   │   ├── layout/              # Navbar, Footer, MobileDrawer, ThemeSwitcher
│   │   ├── theme/               # ThemeProvider and client hydration scripts
│   │   └── ui/                  # Accessible design tokens & Radix UI primitives
│   ├── lib/                     # Server-authoritative logic, database clients, helpers
│   │   ├── auth-redirects.ts    # Open-redirect prevention & plan tier validators
│   │   ├── checkout-config.ts   # Server vs client checkout strategy configuration
│   │   ├── clerk-auth.ts        # Clerk session & backend identity helpers
│   │   ├── lead-storage.ts      # Hybrid repository (PostgreSQL vs JSON fallback)
│   │   └── db/                  # Drizzle ORM schema, relations, and connection pool
│   ├── middleware.ts            # Clerk edge middleware protecting private routes
│   └── types/                   # Shared TypeScript domain contracts (plans, health, theme)
└── tests/                       # Vitest automated test suites
    ├── unit/                    # Unit tests (pricing invariants, auth redirects, lead transitions)
    └── smoke/                   # Smoke verification tests
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later (LTS recommended)
- **Package Manager**: `npm` `v10.x` or later
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbelA2004/Humming-Drops-website.git
   cd Humming-Drops-website
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and configure your credentials. Refer to the table below for essential variables.

---

## Environment Configuration

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server | Runtime environment | `development` |
| `NEXT_PUBLIC_APP_URL` | Universal | Public root application URL | `http://localhost:3000` |
| `CHECKOUT_MODE` | Server | Authoritative checkout mode (`assisted_lead` \| `online_gateway`) | `assisted_lead` |
| `NEXT_PUBLIC_CHECKOUT_MODE` | Client Hint | UI presentation hint for payment vs WhatsApp button | `assisted_lead` |
| `DATABASE_URL` | Server | PostgreSQL connection string (Railway or local Postgres) | `postgresql://...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk publishable frontend key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Server | Clerk private backend API secret | `sk_test_...` |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Server | Clerk SVIX webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client | Razorpay public key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Server | Razorpay private key secret | `your_secret` |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Razorpay webhook cryptographic HMAC secret | `your_secret` |
| `MONGODB_URI` | Server | MongoDB Atlas connection string (CMS content) | `mongodb+srv://...` |
| `CLOUDINARY_CLOUD_NAME` | Universal | Cloudinary cloud identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Server | Cloudinary API access key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Server | Cloudinary API access secret | `your_api_secret` |

> [!NOTE]  
> If `DATABASE_URL` is omitted in local development, the platform automatically activates the zero-dependency local JSON repository (`data/leads.json`), allowing frontend and lead-capture testing without a live database.

---

## Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server at `http://localhost:3000` |
| `npm run build` | Compiles the production Next.js build with static generation and typechecking |
| `npm run start` | Boots the compiled production application in standalone mode |
| `npm run lint` | Runs ESLint against all source files (`src/`) |
| `npm run typecheck` | Executes TypeScript type checking (`tsc --noEmit`) |
| `npm run test:vitest` | Executes all Vitest unit and smoke test suites (`vitest run`) |
| `npm run test:unit` | Executes unit test suites under `tests/unit/` |
| `npm run test:smoke` | Executes smoke test suites under `tests/smoke/` |
| `npm run db:generate` | Generates Drizzle migration files based on `src/lib/db/schema.ts` |
| `npm run db:migrate` | Applies pending SQL migrations to the PostgreSQL database |
| `npm run db:check` | Checks Drizzle schema consistency against migration snapshots |
| `npm run db:seed-admin` | Seeds initial development administrator account |

---

## Architectural Guardrails & Invariants

To safeguard customer trust and system integrity, Humming Drops enforces strict invariants:

1. **Client Truth Guardrail ([ADR-007](docs/adr/ADR-007-client-truth-guardrail.md)):**
   - The client brochure (`references/Humming-Drops-Brochure.pdf`) is the definitive single source of truth.
   - Standard Plan is strictly `₹3,500/month`. Premium Plan is strictly `₹4,000/month`.
   - Never fabricate clinical claims, unverified testimonials, or unapproved delivery timeframes.
2. **Server-Authoritative Pricing & Lifecycles ([ADR-004](docs/adr/ADR-004-server-authoritative-lifecycle.md)):**
   - Pricing is validated strictly on the server (`src/types/plans.ts`). Client overrides are rejected.
   - Lead registrations remain in `pending_confirmation` status until payment is cryptographically verified or confirmed by the Bangalore dispatch hub.
3. **Open-Redirect & Route Protection ([src/lib/auth-redirects.ts](src/lib/auth-redirects.ts)):**
   - External URLs, protocol-relative paths (`//`, `/\`), encoded bypasses, and control characters in `redirect_url` are blocked by middleware.
   - Only validated internal paths (e.g., `/subscribe?plan=standard`) are preserved through the authentication gate.
4. **Health Data & PII Isolation ([ADR-006](docs/adr/ADR-006-health-pii-data-isolation.md)):**
   - Health vitals (Blood Sugar, Cholesterol, Blood Pressure) and consultation records are strictly isolated behind authenticated customer sessions and role-based access controls (`admin`, `nutritionist`, `doctor`).
   - Unauthenticated bulk listing of leads or subscriber PII is strictly prohibited.

---

## Comprehensive Documentation Portal

For in-depth architectural and operational guides, explore the [`docs/`](docs/) directory:

- **[Master Documentation Gateway](docs/README.md):** Consolidated index and architecture baseline.
- **[Product Requirements Baseline (PRD)](docs/product-requirements-baseline.md):** Functional specifications and business invariants.
- **[Drizzle ORM & Database Specification](docs/specifications/drizzle-orm-schema-spec.md):** Database design, indexes, and relations.
- **[UI/UX Brand Hierarchy Architecture](docs/specifications/uiux-brand-hierarchy-architecture.md):** Dual-brand design tokens, typography scales, and accessibility specs.
- **[Razorpay Payment & Webhook Audit](docs/razorpay-payment-webhook-audit.md):** Cryptographic verification, payment state machine, and replay defense.
- **Architecture Decision Records (ADRs):**
  - [ADR-001: Next.js 15+ App Router & Strict TypeScript](docs/adr/ADR-001-nextjs-typescript-strict.md)
  - [ADR-002: Dual-Brand Visual Hierarchy](docs/adr/ADR-002-dual-brand-visual-hierarchy.md)
  - [ADR-003: Pluggable Checkout Strategy](docs/adr/ADR-003-pluggable-checkout-strategy.md)
  - [ADR-004: Server-Authoritative Lifecycle & Pricing](docs/adr/ADR-004-server-authoritative-lifecycle.md)
  - [ADR-005: Pluggable Lead Repository Pattern](docs/adr/ADR-005-lead-repository-pattern.md)
  - [ADR-006: Health Vitals & PII Data Isolation](docs/adr/ADR-006-health-pii-data-isolation.md)
  - [ADR-007: Client Truth Guardrail](docs/adr/ADR-007-client-truth-guardrail.md)
  - [ADR-008: Accessible Radix UI Component Foundation](docs/adr/ADR-008-component-design-system.md)
  - [ADR-009: Clerk Authentication with PostgreSQL Identity](docs/adr/ADR-009-clerk-application-identity.md)
- **Standard Operating Runbooks:**
  - [RB-01: Local Development & Server Setup](docs/runbooks/local-development.md)
  - [RB-02: Build, Typecheck & Verification Suite](docs/runbooks/build-and-verification.md)
  - [RB-03: Bangalore Hub Lead Operations Handover](docs/runbooks/lead-operations-handover.md)
  - [RB-04: Incident Management & Emergency Triage](docs/runbooks/incident-management.md)
  - [RB-05: Deployment & Staging Infrastructure](docs/runbooks/deployment-and-staging.md)
  - [RB-06: Database Migrations SOP](docs/runbooks/database-migrations.md)

---

## Operational Hub & Official Contacts

* **Hub Kitchen & Dispatch Operations:** Berrybeats Cafe, Bangalore, Karnataka, India
* **Clinical Health & Diagnostics Partner:** MedCity Health Labs
* **Customer Support & WhatsApp Concierge:** `+91 8618902810`
* **Official Support Email:** `hummingdrops@gmail.com`
* **Web Domain:** [www.hummingdrops.com](https://www.hummingdrops.com)

---

## License

This software and related documentation are proprietary and confidential to **Humming Drops & MedCity Smiles**. Unauthorized copying, modification, distribution, or use is strictly prohibited.
