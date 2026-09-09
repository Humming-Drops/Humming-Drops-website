# HUMMING DROPS & MEDCITY SMILES — MASTER IMPLEMENTATION PLAN

**Document Version:** 1.0  
**Phase:** Phase 0 — Master Architectural & Project Blueprint  
**Status:** Authoritative Implementation Guide  
**Stack Baseline:** Next.js 15+ (App Router), TypeScript (Strict), Tailwind CSS, shadcn/ui + Radix Primitives, Framer Motion, Supabase (PostgreSQL + Auth), Razorpay Payments  

---

## Table of Contents
1. [Phase 0 — Discovery & Factual Content Inventory](#phase-0--discovery--factual-content-inventory)
2. [Phase 1 — Product Architecture & User Journeys](#phase-1--product-architecture--user-journeys)
3. [Phase 2 — Design System & Dual Visual Languages](#phase-2--design-system--dual-visual-languages)
4. [Phase 3 — Frontend Foundation & Core Layout](#phase-3--frontend-foundation--core-layout)
5. [Phase 4 — Humming Drops Homepage (Physical Wellbeing)](#phase-4--humming-drops-homepage-physical-wellbeing)
6. [Phase 5 — MedCity Smiles Homepage (Mental Wellbeing)](#phase-5--medcity-smiles-homepage-mental-wellbeing)
7. [Phase 6 — Subscription Onboarding Funnel](#phase-6--subscription-onboarding-funnel)
8. [Phase 7 — Authentication & Session Management](#phase-7--authentication--session-management)
9. [Phase 8 — User Dashboard & Subscriber Portal](#phase-8--user-dashboard--subscriber-portal)
10. [Phase 9 — Backend Architecture & Database Schema](#phase-9--backend-architecture--database-schema)
11. [Phase 10 — Payment Integration (Razorpay)](#phase-10--payment-integration-razorpay)
12. [Phase 11 — Responsive & Cross-Device Optimization](#phase-11--responsive--cross-device-optimization)
13. [Phase 12 — Micro-Interactions & Purposeful Motion](#phase-12--micro-interactions--purposeful-motion)
14. [Phase 13 — Accessibility & Inclusivity (WCAG 2.1 AA)](#phase-13--accessibility--inclusivity-wcag-21-aa)
15. [Phase 14 — Quality Assurance & Testing Strategy](#phase-14--quality-assurance--testing-strategy)
16. [Phase 15 — Performance Optimization & Core Web Vitals](#phase-15--performance-optimization--core-web-vitals)
17. [Phase 16 — Security Audit & Hardening](#phase-16--security-audit--hardening)
18. [Phase 17 — Production Deployment & DevOps](#phase-17--production-deployment--devops)

---

## Phase 0 — Discovery & Factual Content Inventory

### Objective
Extract and catalog all factual business requirements from the client-provided brochure and official logo. Identify the problem, solution, operational realities, unknowns (`TBD`), and client inputs required before writing production code.

### Business Understanding & Proposition
* **Core Tagline:** "Healthy Drops, Healthier you"
* **Broader Philosophy:** "Nourishing the Body. Uplifting the Mind. Building a Happier Community."
* **Core Concept:** A holistic wellness ecosystem combining morning doorstep delivery of meticulously prepared fresh fruit & vegetable breakfast boxes with physical health monitoring and mental wellbeing support through the MedCity Smiles community in collaboration with MedCity Labs and Berrybeats Cafe.
* **Operational Base:** Berrybeats Cafe, Bangalore.
* **Delivery Window:** Delivered fresh to doorsteps every morning.

### Factual Inventory from Client Brochure (Source of Truth)
1. **Daily Breakfast Box Contents:**
   * 🍎 4 Varieties of Fruits — Every Day
   * 🥕 2 Varieties of Vegetables — Every Day
   * 🥗 Fresh Mix Salad — Every Day
   * 🌱 Fresh Sprouts — Every Day
   * 🥜 Dry Fruits — 3 Days a Week (Standard Plan) / Daily (Premium Plan)
   * 💚 MedCity Smiles Membership included with every plan
2. **Subscription Plans & Pricing:**
   * **STANDARD:** ₹3,500 / month
     * Includes all 5 daily box components + Dry Fruits 3 days/week + Free MedCity Smiles Membership + Free monthly health checkup.
   * **PREMIUM:** ₹4,000 / month
     * Everything in Standard +
     * 🥜 Daily Dry Fruits (a nutritious serving every single day)
     * 🩺 Exclusive MedCity Labs Benefits (additional discounts on selected curated health packages)
     * 🥤 Special Healthy Juice Drops (thoughtfully prepared juices offered on selected special occasions and pre-planned dates curated by Humming Drops & CARE by Berrybeats).
3. **Preventative Healthcare Perks (Both Plans):**
   * Free monthly checkup:
     1. Blood Sugar
     2. Cholesterol
     3. Blood Pressure
   * Community of doctors and nutritionists available for guidance.
4. **MedCity Smiles Pillars:**
   * **Fuel Your Brain:** Nutritional foundation supporting brain health and mood stability.
   * **Cultivate Positive Self-Talk:** Overcoming negative thoughts, self-compassion, celebrating small wins.
   * **Happy-Healthy Coping Mechanisms:** Physical exercise, yoga, deep breathing, mindfulness, meditation, creative outlets (art, music, writing).
   * **Community Gatherings:** Expert-led seminars, interactive classes, joyful live sharing sessions.
5. **Contact & Partner Details:**
   * Phone: `8618902810`
   * Email: `hummingdrops@gmail.com`
   * Official Domain: `www.hummingdrops.com`
   * Kitchen/Hub: Berrybeats Cafe, Bangalore
   * Partners: MedCity Health Labs, CARE by Berrybeats

### Unconfirmed Business Assumptions & Client Decisions Required

> [!IMPORTANT]
> **STRICT ARCHITECTURAL CONSTRAINT:** The following items are **NOT confirmed client requirements**. They are strictly classified as `CLIENT INPUT REQUIRED / PROVISIONAL ASSUMPTIONS`.
> **DO NOT** implement any of these assumptions as hard-coded business rules, database constraints, validation rules, pricing logic, or UI commitments until explicitly confirmed by the client.

1. **`CIR-01` — Specific Bangalore Delivery Corridors (PROVISIONAL):**
   * *Status:* Unconfirmed.
   * *Constraint:* Do NOT restrict user registration to an arbitrary list of neighborhoods (e.g. Koramangala, Indiranagar). Keep the address capture flexible across Bangalore pincodes until the client confirms exact delivery radii.
2. **`CIR-02` — Morning Delivery Windows (PROVISIONAL):**
   * *Status:* Unconfirmed. The brochure specifies "delivered every morning" but does NOT state specific hourly windows (e.g., 6:00–7:30 AM or 7:00–8:30 AM).
   * *Constraint:* Do NOT hardcode delivery hour promises or strict slot select dropdowns in the database or UI commitments. Treat morning delivery timing preferences as flexible text/provisional fields.
3. **`CIR-03` — 30-Day Continuous Delivery Cycle (PROVISIONAL):**
   * *Status:* Unconfirmed. The brochure specifies a monthly subscription (₹3,500 Standard / ₹4,000 Premium), but does NOT define whether delivery occurs 30 consecutive calendar days, Monday–Saturday (26 days), or Monday–Friday (20–22 working days).
   * *Constraint:* Do NOT hardcode a 30-day daily dispatch calendar or per-day math as a locked business rule in the database.
4. **`CIR-04` — 8:00 PM Delivery-Pause Cutoff (PROVISIONAL):**
   * *Status:* Unconfirmed. Operational pause lead-time (e.g., 8:00 PM previous evening) is provisional.
   * *Constraint:* Build the dashboard pause feature as an extensible flag/status without locking in an irreversible automated cutoff rule.
5. **`CIR-05` — Home Sample Collection vs. Clinic Walk-In (PROVISIONAL):**
   * *Status:* Unconfirmed. The brochure guarantees "FREE SUGAR, CHOLESTEROL & B.P CHECKUP EVERY MONTH", but does not specify whether MedCity Labs conducts doorstep phlebotomy or partner clinic visits.
   * *Constraint:* Frame the benefit as "Free Monthly Checkup powered by MedCity Labs" without falsely promising at-home blood draws until confirmed.
6. **`CIR-06` — Customization & Fixed-Box Rules (PROVISIONAL):**
   * *Status:* Unconfirmed. The brochure describes "Customised plan precisely to your needs", but the exact operational boundary (e.g., fixed daily chef's selection vs. complete produce pick-and-choose) is not specified.
   * *Constraint:* Capture dietary preferences and allergies as customer notes; do not promise item-by-item swaps or hardcode fixed-ingredient database constraints.
7. **`CIR-07` — Payment Mechanism: Online Razorpay vs. Registration / WhatsApp Lead Capture (PENDING CONFIRMATION):**
   * *Status:* Unconfirmed. The brochure prominently displays a QR code reading "Scan and Register 8618902810" and "CONNECT WITH MEDCITY HEALTH LABS: Tap to chat", suggesting a high-touch WhatsApp/manual onboarding option.
   * *Constraint:* **The client has not yet confirmed whether the website will accept online subscription payments through Razorpay, OR use registration/lead capture with WhatsApp/manual follow-up.**
   * *Architecture Solution:* The platform must be architected with a **pluggable payment & checkout strategy pattern** (`CheckoutStrategy`). Both the database and user flow must seamlessly support:
     * **Mode A (Online Payment Gateway):** Razorpay checkout with instant order creation, signature verification, and automated activation.
     * **Mode B (Lead Capture & Assisted Onboarding):** High-conversion subscription request registration, generating a reference ID and routing to WhatsApp / phone confirmation (`8618902810`) with manual backend activation.
   * Razorpay remains the proposed production payment gateway, but the system must switch between Mode A and Mode B via a single configuration flag (`NEXT_PUBLIC_CHECKOUT_MODE='gateway' | 'assisted_lead'`) without requiring schema or UX redesign.

### Deliverables
* Complete content inventory.
* Extraction of official brand assets (`references/Humming drop Logo .png`, extracted MedCity Smiles logo, Berrybeats partner logo, box imagery).
* `docs/reference.md` and `docs/plan.md`.

---

## Phase 1 — Product Architecture & User Journeys

### Objective
Establish a clean, scalable sitemap, navigation system, and user flow supporting the two homepage experiences, frictionless onboarding, and subscriber portal.

### Information Architecture & Route Hierarchy (19 Routes Total: 15 Application Routes + 4 API Route Handlers)
```text
/ (Root) — 15 Application Page Routes:
├── / ........................... Humming Drops Homepage (Physical Wellbeing)
├── /medcity-smiles ............. MedCity Smiles Homepage (Mental Wellbeing & Community)
├── /plans ...................... Subscription Plan Comparison & Inclusions
├── /subscribe .................. Multi-Step Subscription Onboarding & Checkout
│   ├── ?step=1 ................. Plan Selection (Standard vs Premium)
│   ├── ?step=2 ................. Account Credentials & Personal Profile
│   ├── ?step=3 ................. Bangalore Delivery Address & Delivery Timing Note (Provisional)
│   ├── ?step=4 ................. Dietary Preferences & Allergen Notes
│   └── ?step=5 ................. Order Review & Pluggable Checkout (Online Gateway OR WhatsApp Assisted Registration)
├── /about ...................... Our Story, Berrybeats Kitchen & MedCity Labs Partnership
├── /contact .................... Contact Details, Bangalore Kitchen Address & Support
├── /login ...................... Subscriber Sign In (OTP / Magic Link / Password)
├── /register ................... Subscriber Sign Up
├── /forgot-password ............ Password Recovery
└── /dashboard .................. Protected Subscriber Portal
    ├── /dashboard/overview ..... Today's Delivery Status & Active Box Preview
    ├── /dashboard/delivery ..... Delivery Calendar, Pause/Resume & Address
    ├── /dashboard/health ....... Monthly Health Vitals Reports (Sugar, Cholesterol, BP)
    ├── /dashboard/community .... MedCity Smiles Live Sessions & RSVP
    └── /dashboard/settings ..... Account Profile & Payment Methods

/api — 4 API Route Handlers:
├── /api/subscriptions/lead ..... Assisted WhatsApp Registration & Lead Capture Handler
├── /api/payments/order ......... Server-Authoritative Gateway Order Creation
├── /api/payments/verify ........ Cryptographic Signature Verification & Activation Handler
└── /api/payments/webhook ....... Payment Gateway Asynchronous Webhook Processor
```

### Global Dual Navigation Bar Architecture
* **Top Identity Bar / Persistent Switcher:**
  * Toggle: `[ 🥗 Humming Drops (Nutrition) ]` | `[ 💚 MedCity Smiles (Mind & Community) ]`
  * Seamless client-side route transition with active indicator animation.
* **Contextual Navigation Items (Humming Drops Active):**
  * Logo: Official Humming Drops Logo + "Healthy Drops, Healthier you"
  * Links: `Our Fresh Box` | `How It Works` | `Plans & Pricing` | `Lab Checkup` | `About`
  * Action CTAs: `Login` (Ghost button) | `Subscribe Now` (High-contrast Forest Green button)
* **Contextual Navigation Items (MedCity Smiles Active):**
  * Logo: MedCity Smiles Community Logo + Humming Drops Co-badge
  * Links: `The Holistic Vision` | `Doctor & Expert Network` | `Live Sessions` | `Vitals Checkup` | `Community Stories`
  * Action CTAs: `Join the Community` (Mindful Teal button) | `Order Breakfast Box` (Outline button)

### Core User Journeys
1. **Journey A: First-Time Visitor Seeking Healthy Morning Nutrition**
   * Lands on `/` → Sees authentic 5-compartment box imagery → Understands daily ingredients (4 fruits, 2 vegetables, sprouts, salad) → Sees ₹3,500/mo transparent pricing → Clicks `Subscribe Now` → Completes 5-step onboarding → Receives instant SMS/Email confirmation.
2. **Journey B: Holistic Wellness Seeker Interested in Mental Health**
   * Toggles to `/medcity-smiles` → Reads "Fuel Your Brain" & "Mind-Body Health" philosophy → Discovers free monthly vitals monitoring (Sugar, Cholesterol, BP) → Explores live expert workshops → Clicks `Join with Humming Drops Box` → Selects Premium Plan for exclusive lab perks.
3. **Journey C: Returning Subscriber Managing Morning Delivery**
   * Visits `/login` → Inputs mobile/email → Lands on `/dashboard` → Views "Tomorrow's Box: Dispatched at 6:30 AM" → Pauses delivery for upcoming weekend travel with 1 click.

---

## Phase 2 — Design System & Dual Visual Languages

### Objective
Define an intentional, art-directed design system that avoids AI-generated clichés (no generic SaaS rounded card kits, no fluorescent gradients, no tracking-out uppercase noise). Provide two coordinated visual palettes anchored in client assets.

### Palette 1: Humming Drops (Verdant Botanical / Morning Nutrition)
* **Primary Forest Green:** `#144518` (Anchored to official logo lettering)
* **Primary Deep Hunter:** `#0F3512`
* **Fresh Leaf Green:** `#2E7301` / `#417B08` (Anchored to logo leaf accents)
* **Crisp Herb Light:** `#EAF5E9` (Background tint for feature badges)
* **Warm Morning Cream (Base Canvas):** `#FDFCF7` (Pure, natural, fresh paper tone)
* **Warm Neutral Slate:** `#2D3748` (Body text, minimum 7:1 contrast ratio)
* **Nutritional Accents (Derived from Produce Box):**
  * Sun Orange (Papaya/Carrot): `#E86A17`
  * Crisp Berry (Strawberry/Pomegranate): `#C53030`
  * Fresh Sprout Lime: `#65A30D`

### Palette 2: MedCity Smiles (Mindful Serenity / Clinical Warmth)
* **Primary Mindful Teal:** `#156C63` (Anchored to official MedCity Smiles logo)
* **Deep Pine Teal:** `#0D5049`
* **Soothing Mint Light:** `#E6F7F5` (Background surface for wellness cards)
* **Serene Sky Tint:** `#F0F9FF`
* **Mindful Ochre / Sunshine:** `#D97706` (Accent for optimism & self-compassion)
* **Clinical Trust Charcoal:** `#1E293B` (High-legibility typography for medical guidance)

### Typography System
* **Display / Headline Face:** `Plus Jakarta Sans` or `Fraunces` / `Outfit`
  * Rationale: Friendly, organic, human geometric curves with distinct personality that resonates with organic wellness rather than cold corporate tech.
* **Body & UI Face:** `Inter` or `Plus Jakarta Sans` (400, 500, 600, 700)
  * Line height: 1.6 for comfortable reading; max line length: 75 characters.
  * Tabular numbers (`font-variant-numeric: tabular-nums`) for currency (`₹`) and nutritional counts.

### Spatial Rhythm & Elevation
* **Base Grid:** 4px baseline, 8px layout rhythm (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `gap-12`, `gap-16`).
* **Border Radii:** Disciplined, intentional scale:
  * Badges & Buttons: `rounded-full` (friendly, pill-shaped tactile feel)
  * Cards & Modals: `rounded-2xl` (16px)
  * Interactive inputs: `rounded-xl` (12px)
* **Elevation / Shadows:**
  * No heavy muddy grey drop-shadows.
  * Soft ambient botanical shadows: `box-shadow: 0 4px 20px -2px rgba(20, 69, 24, 0.06)`.

---

## Phase 3 — Frontend Foundation & Core Layout

### Objective
Initialize a clean, production-grade Next.js 15+ App Router codebase with strict TypeScript, Tailwind CSS, core layout shells, accessible primitives, and tokenized CSS variables.

### Deliverables
1. Clean directory structure (`src/app`, `src/components`, `src/lib`, `src/types`, `src/hooks`).
2. Global styles with CSS variable theming supporting `theme-humming` and `theme-medcity`.
3. Root layout with metadata, OpenGraph tags, and persistent global components.
4. Navigation Shell (`Navbar.tsx` with Dual-Mode Switcher).
5. Footer Shell (`Footer.tsx` with Bangalore address, Berrybeats Cafe mention, contact details, partner links).
6. Core accessible UI primitives (`Button`, `Badge`, `Card`, `Tabs`, `Dialog`, `Input`).

### Acceptance Criteria
* Zero TypeScript errors under strict mode (`tsconfig.json` with `"strict": true`).
* Fast HMR (Hot Module Replacement) and build execution under Next.js.
* Complete CSS variable tokens mapped for light/dual mode.

---

## Phase 4 — Humming Drops Homepage (Physical Wellbeing)

### Objective
Deliver a compelling, high-converting homepage for Humming Drops that presents the breakfast box subscription as an effortless, essential morning habit.

### Section Breakdown
1. **Announcement Bar:**
   * Bangalore launch notification: "Delivering fresh every morning across Bangalore · Kitchen at Berrybeats Cafe".
2. **Hero Section:**
   * Headline: "Healthy Drops, Healthier You."
   * Supporting Copy: "A daily morning delivery of fresh mixed-cut fruit boxes, crisp vegetables, sprouts, and salads — meticulously prepared to fuel your day."
   * CTAs: Primary: "Choose Your Plan (₹3,500/mo)" → `/plans`; Secondary: "Explore Box Anatomy" → `#box-contents`.
   * Visual Centerpiece: High-definition 5-compartment box imagery with floating nutritional callout chips.
   * Trust Badges: "100% Fresh Daily Cut" | "Zero Preservatives" | "Free Monthly Lab Vitals Checkup".
3. **Problem vs. Solution Strip:**
   * Directly adapted from Page 2 of the brochure:
     * *The Problem:* Fast-paced life, lack of time to shop and wash produce, missing out on vital daily vitamins impacting physical and mental energy.
     * *The Solution:* Monthly doorstep subscription delivering pre-cut, washed, balanced nutrition every morning before breakfast.
4. **Interactive Box Anatomy Breakdown (The 5 Daily Pillars):**
   * Sourced directly from Page 4 of the brochure:
     1. 🍎 **4 Varieties of Fruits Every Day** (Seasonal melons, berries, papaya, apples, grapes, kiwi).
     2. 🥕 **2 Varieties of Vegetables Every Day** (Crisp carrots, cucumber sticks, bell peppers).
     3. 🥗 **Fresh Mix Salad Every Day** (Crunchy garden greens, light dressing, cherry tomatoes).
     4. 🌱 **Fresh Sprouts Every Day** (High-protein sprouted lentils and beans).
     5. 🥜 **Dry Fruits 3 Days a Week** (Almonds, cashews, walnuts, dates — upgraded to Daily in Premium).
5. **Subscription Plans & Pricing Matrix:**
   * Direct brochure pricing:
     * **Standard Plan: ₹3,500/month** (`~₹116/day`)
     * **Premium Plan: ₹4,000/month** (`~₹133/day`)
     * Feature comparison table showing Standard vs. Premium dry fruit frequency, MedCity Labs discounts, and special healthy juice drops curated with CARE by Berrybeats.
6. **Free Monthly Health Monitoring Highlight:**
   * Prominently featuring the free monthly Blood Sugar, Cholesterol, and Blood Pressure checkup in partnership with MedCity Health Labs.
7. **The MedCity Smiles Bridge Section:**
   * "Nourish the Body, Uplift the Mind" teaser card transitioning the user to the mental health community.
8. **Delivery & Sourcing Process ("How It Works"):**
   * Step 1: Subscribe & customize preferences.
   * Step 2: Fresh morning harvest & hygienic preparation at Berrybeats Cafe.
   * Step 3: Doorstep delivery before 8:00 AM.
   * Step 4: Monthly health checkup & community support.
9. **Frequently Asked Questions (Accordion):**
   * Covering freshness, morning delivery hours, pause/resume policy, hygiene standards.
10. **Final High-Conversion CTA Section:**
    * "Ready to transform your mornings? Start your 30-day nutrition journey today."

---

## Phase 5 — MedCity Smiles Homepage (Mental Wellbeing)

### Objective
Create a distinct, serene, and deeply empathetic digital space for MedCity Smiles that establishes mental wellbeing, doctor/nutritionist guidance, and community connection as equal partners to physical nutrition.

### Section Breakdown
1. **MedCity Smiles Dedicated Hero:**
   * Headline: "Uplifting the Mind. Building a Happier Community."
   * Subtitle: "Because true wellness is more than just eating healthy. Discover expert-led seminars, mindful coping practices, and a supportive community in partnership with MedCity Health Labs."
   * CTAs: "Join the Community" | "Explore Live Sessions".
   * Visual: Warm community connection imagery and the official MedCity Smiles smiling-brain emblem.
2. **"Why Mental Health Matters To Us" Narrative:**
   * Adapted directly from Page 5 of the brochure:
     * Just as Humming Drops nourishes the physical body, MedCity Smiles provides a supportive, inspiring space where members learn to laugh, share happiness, and discover emotional clarity.
3. **The Holistic Plan: Mind and Body Pillars (From Page 6 of Brochure):**
   * **Pillar 1: Fuel Your Brain:** Explaining the neuro-nutritional science of how balanced fresh produce stabilizes mood and cognitive focus.
   * **Pillar 2: Cultivate Positive Self-Talk:** Practical cognitive reframing prompts: challenging negative thoughts, celebrating micro-progress, self-compassion.
   * **Pillar 3: Happy-Healthy Coping Mechanisms:** Actionable toolkits for movement, deep breathing, yoga, and creative expression (art, music, writing).
   * **Pillar 4: Community Gatherings & Live Shares:** Group connection, safe sharing circles, and expert guidance.
4. **Doctor & Nutritionist Community Advisory:**
   * Sourced directly from Page 3 of the brochure: "A community of doctors and nutritionists to serve you at any time; a community of experts to monitor your vitals."
   * Credentialed advisory panel cards with clinical backgrounds and upcoming session topics.
5. **Vitals & Preventative Healthcare Center:**
   * Interactive explanation of the 3 free monthly tests: Blood Sugar (glycemic stability), Cholesterol (cardiovascular wellness), and Blood Pressure (stress and circulatory health).
6. **Live Events & Interactive Class Schedule:**
   * Calendar of upcoming weekly virtual/in-person workshops (e.g., "Mindful Mornings", "Nutrition for Cognitive Vitality", "Stress & Breathwork").
   * One-click RSVP for registered members.
7. **Community Voices & Stories:**
   * Authentic stories highlighting everyday positive choices.
8. **Final Community CTA:**
   * "Your membership is free with every Humming Drops breakfast box subscription."

---

## Phase 6 — Subscription Onboarding Funnel

### Objective
Design and implement a frictionless, 5-step checkout flow optimized for conversion and clear expectation management.

### Multi-Step Checkout Architecture (`/subscribe`)
* **Step 1: Choose Subscription Plan**
  * Toggle between Standard (₹3,500/mo) and Premium (₹4,000/mo).
  * Clear comparison of perks (Daily dry fruits vs 3 days, special juice drops, lab discounts).
* **Step 2: Account Creation / Identification**
  * Full Name, Mobile Number (primary communication), Email, Password (or passwordless OTP).
* **Step 3: Bangalore Delivery Address (Provisional Input)**
  * Flat/House number, Building/Apartment name, Street address, Area/Locality (Bangalore), Pincode, Optional delivery instructions/timing note.
  * *Constraint:* Delivery hours and geographic corridors are strictly provisional (`CIR-01`, `CIR-02`). No hardcoded neighborhood whitelist or locked delivery window promises are imposed on the user.
* **Step 4: Dietary Preferences & Allergies**
  * Dietary type: Vegetarian / Vegan / Pure Fruitarian.
  * Allergen alerts & special dietary notes captured as flexible profile attributes without rigid ingredient database constraints (`CIR-06`).
* **Step 5: Review & Pluggable Fulfillment (Gateway vs. Assisted Lead Capture)**
  * Clear cost summary: Monthly Plan + Zero Delivery Charges + Free MedCity Smiles Membership + Free Monthly Health Checkup.
  * **Pluggable Fulfillment Mechanism (`CIR-07`):**
    * *Fulfillment Mode A (Razorpay Online Gateway):* Secure Razorpay checkout modal launch for instantaneous online payment verification.
    * *Fulfillment Mode B (Assisted Lead Capture & WhatsApp Follow-up):* "Submit Subscription Request" generating a unique reference ID (e.g. `HD-REG-74291`) and launching direct WhatsApp chat with the Humming Drops Bangalore team (`8618902810`) for manual verification and schedule setup.
* **Confirmation Screen (`/subscribe/confirmation`):**
  * Displays confirmed order details / reference code.
  * For Mode A: Payment receipt, subscription active badge, WhatsApp welcome community link.
  * For Mode B: "Subscription Request Received", Reference #, One-click "Chat on WhatsApp (8618902810)" button, and clear next steps for doorstep onboarding.
  * Immediate link to access user dashboard.

---

## Phase 7 — Authentication & Session Management

### Objective
Secure, resilient authentication using Supabase Auth, supporting passwordless mobile OTP, email magic links, and standard credentials.

### Deliverables
* Login, Register, Password Reset, and Update Password views.
* Secure session persistence in HTTP-only cookies with Next.js Middleware route guards.
* Redirect protection: Unauthenticated users accessing `/dashboard/*` are redirected to `/login?redirect=/dashboard`.

---

## Phase 8 — User Dashboard & Subscriber Portal

### Objective
A dedicated subscriber dashboard (`/dashboard`) where customers manage their daily deliveries, view health vitals checkup results, and access MedCity Smiles events.

### Modules
1. **Delivery Overview:**
   * "Tomorrow's Breakfast Box" status banner (Scheduled / Prepared at Berrybeats / Out for Delivery).
   * 1-Click Quick Pause: Pause deliveries for tomorrow or pick a vacation date range.
2. **Monthly Health Vitals Record:**
   * Record card for Blood Sugar, Cholesterol, and Blood Pressure.
   * Downloadable lab summary report and next scheduled test date.
3. **MedCity Smiles Member Hub:**
   * Upcoming live session links and RSVP buttons.
   * Access to past seminar recordings and wellness coping guides.
4. **Subscription Management:**
   * Active plan details (Standard vs Premium), renewal date, payment invoice download, address update.

---

## Phase 9 — Backend Architecture & Database Schema

### Objective
A normalized, secure PostgreSQL schema deployed on Supabase with Row Level Security (RLS) policies ensuring users can only read and write their own data.

### Database Tables
```sql
-- 1. PROFILES (Extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBSCRIPTION PLANS
CREATE TABLE subscription_plans (
    id TEXT PRIMARY KEY, -- 'standard', 'premium'
    name TEXT NOT NULL,
    monthly_price_inr INTEGER NOT NULL, -- 3500, 4000
    description TEXT NOT NULL,
    features JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. USER SUBSCRIPTIONS (Pluggable for Online Gateway OR Assisted Lead Registration)
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'pending_confirmation', -- 'pending_confirmation', 'active', 'paused', 'cancelled', 'expired'
    fulfillment_mode TEXT NOT NULL DEFAULT 'assisted_lead', -- 'assisted_lead', 'online_gateway'
    lead_reference_code TEXT UNIQUE, -- e.g., 'HD-REG-84920' for WhatsApp & offline tracking
    start_date DATE,
    renewal_date DATE,
    pause_start DATE,
    pause_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DELIVERY ADDRESSES (Flexible Bangalore capture without rigid corridor whitelists)
CREATE TABLE delivery_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    flat_no TEXT NOT NULL,
    building TEXT NOT NULL,
    street TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bangalore',
    pincode TEXT NOT NULL,
    delivery_instructions TEXT, -- Optional delivery notes / timing preferences
    is_default BOOLEAN DEFAULT TRUE
);

-- 5. DIETARY PREFERENCES (Flexible customer notes without rigid ingredient database constraints)
CREATE TABLE dietary_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dietary_type TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'vegan', 'pure_fruit'
    allergies TEXT[],
    notes TEXT
);

-- 6. HEALTH VITALS LOGS (From free monthly checkups)
CREATE TABLE health_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    checkup_date DATE NOT NULL,
    blood_sugar_fasting NUMERIC,
    blood_sugar_pp NUMERIC,
    cholesterol_total NUMERIC,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    doctor_notes TEXT,
    report_pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNITY SESSIONS (MedCity Smiles)
CREATE TABLE community_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    speaker_name TEXT NOT NULL,
    speaker_title TEXT NOT NULL,
    session_datetime TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    meeting_url TEXT,
    description TEXT NOT NULL,
    is_live BOOLEAN DEFAULT FALSE
);

-- 8. SESSION REGISTRATIONS
CREATE TABLE session_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES community_sessions(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, session_id)
);

-- 9. PAYMENTS & FULFILLMENT AUDIT (Pluggable: Gateway & Offline / Assisted)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    payment_method TEXT NOT NULL DEFAULT 'razorpay', -- 'razorpay', 'whatsapp_assisted', 'manual_offline'
    gateway_order_id TEXT, -- nullable if assisted lead capture
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    amount_inr INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'confirmed_manual', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Security & Row-Level Security (RLS)
* Enable RLS on every table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
* Users may only `SELECT`, `INSERT`, and `UPDATE` records where `user_id = auth.uid()`.
* Community sessions are viewable by all authenticated subscribers.

---

## Phase 10 — Payment & Fulfillment Integration (Pluggable Architecture)

### Objective
Implement a pluggable fulfillment and payment architecture that accommodates client uncertainty:
* **Option A:** Online subscription payments through Razorpay.
* **Option B:** High-touch registration & lead capture with WhatsApp follow-up (`8618902810`) and manual activation.

> [!IMPORTANT]
> **Architectural Guardrail:** Razorpay remains the proposed production online payment option, but is treated as pending client confirmation. The checkout architecture is designed with the Strategy Pattern (`CheckoutStrategy`), allowing the application to toggle between Mode A and Mode B via environment configuration (`NEXT_PUBLIC_CHECKOUT_MODE`) without restructuring the database schema, user accounts, or subscription lifecycle.

### Strategy Implementation:
1. **Strategy A: Razorpay Online Payment Gateway (Proposed Production Option):**
   * Client calls `/api/payments/create-order` with the selected plan.
   * Server validates pricing against `subscription_plans` and initializes an order via Razorpay Node SDK.
   * Client renders Razorpay Checkout modal (supporting UPI, Cards, NetBanking).
   * Upon completion, client posts signatures to `/api/payments/verify`.
   * Server cryptographically verifies HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and transitions `user_subscriptions.status` to `active`.
   * Webhook endpoint `/api/payments/webhook` provides asynchronous reconciliation.

2. **Strategy B: Assisted Registration & WhatsApp Lead Capture:**
   * Client calls `/api/subscriptions/submit-lead` with the 5-step form data.
   * Server creates the user profile, inserts `user_subscriptions` with `status = 'pending_confirmation'`, generates a reference code (e.g., `HD-REG-98124`), and logs a pending payment record.
   * Confirmation view presents a pre-filled WhatsApp link (`https://wa.me/918618902810?text=Hi%20Humming%20Drops%20team,%20I%20just%20submitted%20subscription%20request%20HD-REG-98124...`) allowing instant client-to-customer follow-up.
   * Admins can mark the subscription active in the database once payment or delivery terms are manually finalized.

---

## Phase 11 — Responsive & Cross-Device Optimization

### Objective
Flawless mobile, tablet, laptop, and desktop experiences. 70%+ of Indian consumer food subscriptions are browsed on mobile devices.

### Breakpoint Strategy
* `sm` (640px): Full-width stacked cards, sticky bottom CTA bar on mobile checkout.
* `md` (768px): 2-column feature grids, expanded drawer navigation.
* `lg` (1024px): Split hero layouts, multi-column comparison tables.
* `xl` (1280px): Maximum container bounds (`max-w-7xl mx-auto px-6`), balanced whitespace.

---

## Phase 12 — Micro-Interactions & Purposeful Motion

### Objective
Subtle, high-craft animation orchestrated via Framer Motion that enhances understanding and delight without causing distraction or performance degradation.

### Core Motion Rules
* **Strict Duration Cap:** All micro-interactions complete within 150ms – 300ms.
* **Page Transitions:** Gentle fade/slide (300ms, easeOut).
* **Respect Reduced Motion:** Wrap all animated components in `@media (prefers-reduced-motion: reduce)` fallbacks.
* **Interactive Moments:**
  * Box Compartment hover: subtle 3D lift (`translateY(-4px)`) and ingredient label reveal.
  * Plan Switcher: Smooth sliding background pill behind Standard / Premium tabs.
  * Toast Notifications: Physics-based spring drop-in from top right.

---

## Phase 13 — Accessibility & Inclusivity (WCAG 2.1 AA)

### Objective
Ensure full accessibility compliance across keyboard navigation, screen reader support, contrast ratios, and touch targets.

### Standards Checklist
* **Color Contrast:** All body text meets minimum 4.5:1 ratio; headlines meet 7:1 ratio.
* **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
* **Interactive Elements:** Full keyboard accessibility (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`). Visible focus rings (`focus-visible:ring-2 focus-visible:ring-forest-600`).
* **ARIA Standards:** `aria-expanded` on accordions and mobile drawers; `aria-live` on form validation errors; `aria-describedby` on inputs.
* **Touch Target Size:** Minimum 44px x 44px clickable areas on all mobile buttons and toggles.

---

## Phase 14 — Quality Assurance & Testing Strategy

### Objective
Comprehensive automated and manual verification loop ensuring stability, accuracy, and zero regression.

### Test Suites
1. **Unit & Logic Tests (Vitest):** Plan price calculations, address validation, date utility functions (morning delivery cutoff).
2. **Component & Accessibility Tests (React Testing Library + axe-core):** Ensuring zero a11y violations in forms, modals, and navigation.
3. **End-to-End User Flow Tests (Playwright):**
   * Flow 1: Complete checkout simulation with mocked Razorpay gateway.
   * Flow 2: Dual-homepage brand toggle state preservation.
   * Flow 3: Subscriber dashboard pause-delivery toggle.
4. **Visual & Responsive Testing:** Verification across iPhone 14/15, iPad Pro, and 1440px desktop viewports.

---

## Phase 15 — Performance Optimization & Core Web Vitals

### Target Metrics
* **LCP (Largest Contentful Paint):** < 1.8 seconds.
* **INP (Interaction to Next Paint):** < 100 milliseconds.
* **CLS (Cumulative Layout Shift):** < 0.05.

### Strategies
* Next.js `next/image` with WebP/AVIF compression and strict `priority` on hero meal box assets.
* Self-hosted Google Fonts via `next/font` with zero layout shift (`font-display: swap`).
* Route-level code splitting and dynamic imports for heavy modal/dashboard modules.

---

## Phase 16 — Security Audit & Hardening

### Security Protocols
* **Zero Secret Exposure:** `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and database URLs strictly isolated to server-side code.
* **Input Sanitization & Schema Validation:** `zod` schema parsing on all API endpoints and server actions.
* **Rate Limiting:** IP-based rate limiting on authentication and payment creation endpoints.
* **Content Security Policy (CSP) & Security Headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## Phase 17 — Production Deployment & DevOps

### Infrastructure Baseline
* **Hosting:** Vercel Production Deployment with automatic Edge caching and SSL.
* **Database & Auth:** Supabase Cloud (Managed PostgreSQL with daily backups).
* **Domain & DNS:** Production configuration for `www.hummingdrops.com` with HTTPS redirect.
* **Monitoring:** Error logging via Sentry / Vercel Analytics.

---

## Phase-by-Phase Definition of Done (DoD) Summary

| Phase | Milestone Name | Key Deliverable | Exit Criteria |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Discovery & Master Plan | `docs/` complete & verified | All unknowns flagged, zero hallucinated facts. |
| **Phase 1** | Product Architecture | Sitemap & Route tree | UX journeys documented and approved. |
| **Phase 2** | Design System | Tokens, typography, colors | Dual visual identities specified. |
| **Phase 3** | Frontend Foundation | Next.js app scaffold | Strict TypeScript, Tailwind, shadcn ready. |
| **Phase 4** | Humming Drops Homepage | Complete physical food page | 5-compartment box, plans, and value verified. |
| **Phase 5** | MedCity Smiles Page | Complete mental wellness page | Doctors, webinars, vitals monitoring verified. |
| **Phase 6** | Subscription Funnel | 5-step checkout flow | Frictionless mobile-ready subscription engine. |
| **Phase 7** | Authentication | Auth views & Middleware | Secure sessions and protected routes active. |
| **Phase 8** | User Dashboard | Subscriber control center | Delivery pause, vitals history, RSVP active. |
| **Phase 9** | Database Architecture | Supabase SQL & RLS | Normalized schema with strict RLS policies. |
| **Phase 10** | Payment Integration | Razorpay gateway | Cryptographic signature verification verified. |
| **Phase 11** | Responsive Optimization | Cross-device polish | Zero overflow on any viewport (320px – 4K). |
| **Phase 12** | Micro-Interactions | Framer Motion polish | Subtle, purposeful, a11y reduced-motion safe. |
| **Phase 13** | Accessibility Audit | WCAG 2.1 AA compliance | 0 critical axe-core violations. |
| **Phase 14** | Automated Testing | Vitest + E2E Playwright | All test suites passing in CI pipeline. |
| **Phase 15** | Performance Audit | Core Web Vitals | 90+ Lighthouse score across all surfaces. |
| **Phase 16** | Security Hardening | Security review complete | All secrets protected, input sanitized. |
| **Phase 17** | Production Release | Live production deployment | Domain active, SSL valid, monitoring active. |
