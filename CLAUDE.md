# CLAUDE.md — HUMMING DROPS & MEDCITY SMILES

**Project:** Humming Drops & MedCity Smiles Web Platform  
**Location:** `C:\Humming-Drops-website`  
**Repository Branch:** `main`  
**Authoritative Documentation:** Located in `/docs/` (`reference.md`, `plan.md`, `tracker.md`, `uiux-design.md`)  

---

## 1. Project & Business Context

Humming Drops is a premium wellness brand founded in Bangalore that delivers healthy, fresh, mixed-cut breakfast boxes to customers' doorsteps every morning. In collaboration with **MedCity Health Labs** and **Berrybeats Cafe**, Humming Drops unites physical nutrition with holistic mental health through the **MedCity Smiles Community**.

### Core Philosophy
> **"Nourishing the Body. Uplifting the Mind. Building a Happier Community."**  
> *Tagline:* "Healthy Drops, Healthier you"

### Primary Business Truths (from Client Brochure)
* **Daily Breakfast Box Contents:**
  * 🍎 4 Varieties of Fruits — Every Day
  * 🥕 2 Varieties of Vegetables — Every Day
  * 🥗 Fresh Mix Salad — Every Day
  * 🌱 Fresh Sprouts — Every Day
  * 🥜 Dry Fruits — 3 Days a Week (Standard Plan) / Daily (Premium Plan)
  * 💚 MedCity Smiles Membership — Included with every plan
* **Subscription Plans:**
  * **STANDARD:** ₹3,500 / month
  * **PREMIUM:** ₹4,000 / month (Standard + Daily Dry Fruits + MedCity Labs Package Discounts + Special Healthy Juice Drops curated with CARE by Berrybeats)
* **Preventative Healthcare Inclusions:**
  * Free monthly checkup: 1. Blood Sugar, 2. Cholesterol, 3. Blood Pressure
  * Community of doctors and clinical nutritionists available to monitor vitals and advise members.
* **Operational Hub:** Berrybeats Cafe, Bangalore.
* **Contact Details:** Phone `8618902810`, Email `hummingdrops@gmail.com`, Website `www.hummingdrops.com`.

---

## 2. Core Rule: Do Not Invent Client Information

1. **Brochure is Authoritative:** Treat `references/Humming-Drops-Brochure.pdf` and `references/Humming drop Logo .png` as the absolute factual truth.
2. **Never Fabricate:** Never invent clinical claims, medical cures, fake customer reviews, partner logos, statistics, or pricing.
3. **Tagging Protocol:**
   * If an operational parameter is unknown: Mark as `TBD` or `CLIENT INPUT REQUIRED`.
   * If placeholder content is temporarily required for UI layout: Explicitly label as `PLACEHOLDER — CLIENT CONTENT REQUIRED`.
4. **Unconfirmed Business Assumptions (Strictly Provisional / Client Input Required):**
   The following are NOT confirmed client requirements:
   * 6:00–8:30 AM delivery windows
   * 30-day continuous delivery cycle
   * 8:00 PM delivery-pause cutoff
   * specific Bangalore delivery corridors
   * home sample collection
   * specific customization / fixed-box rules
   > [!CAUTION]
   > **DO NOT** implement any of these assumptions as hard-coded business rules, database constraints, validation rules, pricing logic, or UI commitments until confirmed by the client.

---

## 3. Design Principles & Aesthetic Direction

Guided by `frontend-design` and `impeccable`:
1. **Grounded in Real Subject Matter:** Visuals must reflect real fresh produce, morning light, crisp cuts, and mindful human community.
2. **Avoid AI-Generated Clichés:**
   * NO warm cream backgrounds paired with terracotta accents as a lazy default.
   * NO near-black backgrounds with neon acid-green lasers.
   * NO generic SaaS rounded card kits where every card has the same border radius and drop shadow.
   * NO tracked-out ALL-CAPS eyebrow labels with middle dots on every single section.
   * NO decorative animations that slow down user tasks.
3. **Dual Visual Identities Under One Design System:**
   * **Humming Drops:** Verdant Forest Green (`#144518`), Fresh Leaf (`#2E7301`), Sun Papaya (`#E86A17`), Warm Morning Paper (`#FDFCF7`).
   * **MedCity Smiles:** Restorative Mindful Teal (`#156C63` / `#0D5049`), Soothing Mint (`#E6F7F5`), Serene Mist (`#F8FAF9`), Mindful Ochre (`#D97706`).
4. **Typography:** `Plus Jakarta Sans` for display and section headers; `Inter` for dense body copy, pricing digits (`₹`), and forms.

---

## 4. Technical Stack & Architectural Decisions

* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript with strict mode enabled (`"strict": true`)
* **Styling:** Tailwind CSS with CSS custom properties for dual-theme token switching
* **UI Primitives:** shadcn/ui & Radix UI (local component source ownership in `@/components/ui`, high composability, headless accessibility primitives, controlled dependency footprint without CSS-in-JS runtime overhead)
* **Icons:** `lucide-react` (clean 24px grid iconography)
* **Animation:** `framer-motion` (strictly disciplined < 300ms, respecting `prefers-reduced-motion`)
* **Backend / Database:** Supabase (Managed PostgreSQL) with Row Level Security (RLS)
* **Authentication:** Supabase Auth (Supporting Email/Password and Mobile OTP)
* **Payment & Fulfillment Architecture (Pluggable):**
  * *Constraint:* The client has not yet confirmed whether the website will accept online subscription payments through Razorpay, OR use registration/lead capture with WhatsApp/manual follow-up (`8618902810`).
  * *Design:* Implements the Strategy Pattern (`CheckoutStrategy`). The system supports Mode A (Razorpay Online Checkout) and Mode B (Assisted Lead Registration & WhatsApp Handoff) via a simple environment flag (`NEXT_PUBLIC_CHECKOUT_MODE`), allowing the payment mechanism to be introduced or changed without restructuring the database schema or subscription lifecycle. Razorpay remains the proposed production option pending client confirmation.
* **Deployment:** Vercel with HTTPS and Edge CDN

---

## 5. Folder Structure & Coding Conventions

```text
C:\Humming-Drops-website\
├── docs/                        # Master documentation
│   ├── reference.md             # Benchmark analysis & component evaluation
│   ├── plan.md                  # Master plan (Phases 0 to 17)
│   ├── tracker.md               # Detailed task & test case tracker
│   └── uiux-design.md           # UI/UX design tokens & component specs
├── references/                  # Client raw assets (brochure, logo)
├── src/
│   ├── app/                     # Next.js App Router routes
│   │   ├── layout.tsx           # Global Root Layout
│   │   ├── page.tsx             # Humming Drops Homepage (Nutrition)
│   │   ├── medcity-smiles/      # MedCity Smiles Homepage (Mental Wellbeing)
│   │   ├── plans/               # Subscription comparison
│   │   ├── subscribe/           # 5-step checkout onboarding
│   │   ├── login/               # Authentication sign-in
│   │   ├── register/            # Account sign-up
│   │   ├── dashboard/           # Authenticated subscriber portal
│   │   └── api/                 # Secure API routes (Razorpay, webhooks)
│   ├── components/
│   │   ├── ui/                  # Reusable shadcn/Radix primitives
│   │   ├── layout/              # Navbar, Footer, BrandSwitcher
│   │   ├── sections/            # Reusable section modules (Hero, Pricing, Bento)
│   │   └── dashboard/           # Subscriber portal widgets
│   ├── lib/                     # Utilities, Supabase client, Razorpay helper
│   ├── types/                   # Shared TypeScript definitions
│   └── styles/                  # Tailwind & global CSS
├── CLAUDE.md                    # This persistent instructions file
└── package.json
```

### Naming Conventions
* React Components: `PascalCase.tsx` (e.g., `BrandSwitcher.tsx`, `PricingCard.tsx`)
* Utility Functions: `camelCase.ts` (e.g., `formatCurrency.ts`, `validatePincode.ts`)
* Database Tables: `snake_case` (e.g., `user_subscriptions`, `health_vitals`)
* Task Identifiers: `HD-XXX` (e.g., `HD-041`) matching `/docs/tracker.md`

---

## 6. Security, Accessibility & Quality Guardrails

1. **Checkout Mode Security:** `NEXT_PUBLIC_CHECKOUT_MODE` may be used for client-side/UI configuration, but it must NEVER be trusted for pricing, payment verification, subscription activation, authorization, or other security-sensitive decisions. Server-side configuration and server validation must determine authoritative payment/fulfillment behavior.
2. **Health Data Privacy & Sensitivity:** `health_vitals` contains sensitive health information. Do not implement medical-record functionality unless it is explicitly required by confirmed client scope. When scaffolded, enforce strict Supabase RLS and private storage/access controls. Users must only be able to access their own health information. Do not expose health data through public APIs or client-side configuration.
3. **Pending Subscriptions Lifecycle:** An assisted WhatsApp registration with `pending_confirmation` status must NOT automatically be treated as an active subscription. Model the distinction clearly: `registration_submitted` → `pending_confirmation` → `confirmed/active`. A pending user may have a limited pending-registration state if needed, but active subscriber benefits require confirmed/active status.
4. **Secret Isolation:** `RAZORPAY_KEY_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` must NEVER exist in client-side bundles or `NEXT_PUBLIC_*` environment variables.
5. **Payment Verification:** Always verify cryptographic signatures on the server using `crypto.createHmac('sha256', secret)`. Never trust client amounts.
6. **Database RLS:** Every database table must have Row Level Security enabled. Users can only access records matching `auth.uid()`.
7. **Accessibility Floor (WCAG 2.1 AA):**
   * Minimum contrast 4.5:1 for body copy.
   * Visible focus rings on all interactive elements.
   * Form fields must have associated labels and ARIA error messages.
   * Respect `prefers-reduced-motion`.
8. **Component Reuse:** Avoid creating duplicates (`Hero1.tsx`, `Hero2.tsx`). Build unified, configurable components.

---

## 7. Current Implementation Status

* **Phase 0:** Discovery, Analysis, and Architecture Planning — **COMPLETED & APPROVED**.
* **Phase 1:** Product Architecture, Sitemap, Route Hierarchy & Structural Scaffolding — **IN PROGRESS**.
* **Scope Boundary:** Structural scaffolding only. Do NOT implement polished homepage sections, subscription UI, payment SDK, auth logic, database migrations, or dashboard functionality yet.

---

## 8. Verification Loop for All Subsequent Implementation Phases

Before marking any task complete in `docs/tracker.md`:
```text
READ DOCUMENTATION
↓
UNDERSTAND REQUIREMENTS
↓
PLAN
↓
IMPLEMENT
↓
RUN
↓
LINT (eslint)
↓
TYPE CHECK (tsc --noEmit)
↓
TEST (unit / integration)
↓
VISUAL & RESPONSIVE REVIEW (mobile, tablet, desktop)
↓
ACCESSIBILITY REVIEW (axe-core, keyboard)
↓
SECURITY REVIEW
↓
UPDATE TRACKER (docs/tracker.md)
↓
COMMIT
```
