# Humming Drops & MedCity Smiles — Client Handover Specification

**Document:** `docs/handover/client-handover-spec.md`  
**Document Version:** 1.0  
**Date:** November 2026  
**Client Representatives:** Humming Drops Leadership, MedCity Health Labs, Berrybeats Cafe  
**Technical Author:** Lead Technical Architect & Documentation Engineer  
**Status:** Official Client Handover Specification  

---

## 1. Executive Summary & Project Purpose

Humming Drops is an innovative Bangalore-based wellness enterprise dedicated to **"Nourishing the Body. Uplifting the Mind. Building a Happier Community."**
In strategic partnership with **MedCity Health Labs** and **Berrybeats Cafe**, Humming Drops unites two transformative pillars:
1. **Humming Drops (Physical Vitality):** Daily morning doorstep delivery of 5-compartment nutritional breakfast boxes meticulously prepared with fresh fruits, crisp vegetables, mixed salads, sprouts, and dry fruits.
2. **MedCity Smiles (Mental Wellbeing & Preventative Health):** An inclusive, stigma-free wellness community offering preventative health vital monitoring (Blood Sugar, Cholesterol, Blood Pressure), expert doctor/nutritionist guidance, and daily mental resilience tools.

This document serves as the formal **Client Handover Specification**, detailing the technical architecture, operational contracts, deliverable asset inventory, brochure fidelity compliance, unresolved client decisions (`CIR-01` through `CIR-07`), and operational handoff procedures.

---

## 2. Brand & Brochure Fidelity Compliance Matrix

Every claim, price, contact detail, and product attribute in the codebase has been mathematically and textually validated against the official client brochure (`references/Humming-Drops-Brochure.pdf`) and logo asset (`references/Humming drop Logo .png`).

| Business Parameter | Brochure Truth (Page Ref) | Codebase Implementation | Fidelity Status |
| :--- | :--- | :--- | :--- |
| **Brand Tagline** | "Healthy Drops, Healthier you" (Cover) | Displayed prominently across Hero, metadata, and OpenGraph headers | **100% Verified** |
| **Philosophy** | "Nourishing the Body. Uplifting the Mind. Building a Happier Community." (P5) | Header sub-copy, About narrative, and Dual Brand switcher | **100% Verified** |
| **Daily Box Contents** | 4 Fruits, 2 Veg, Salad, Sprouts, Dry Fruits (P4, P8) | Interactive 5-hotspot `BoxAnatomy.tsx` component and descriptive cards | **100% Verified** |
| **Standard Subscription** | ₹3,500 / month (P8) | Enforced canonical price in server validation, pricing cards, and lead engine | **100% Verified** |
| **Premium Subscription** | ₹4,000 / month (P8) | Enforced canonical price with Daily Dry Fruits, Lab Discounts & Juice Drops | **100% Verified** |
| **Preventative Health Perks** | Free monthly Sugar, Cholesterol, BP tests (P8) | Highlighted on both homepage pillars, subscriber perks, and dashboard shell | **100% Verified** |
| **Mental Health Pillars** | Fuel Your Brain, Positive Self-Talk, Coping Mechanisms, Community Gatherings (P5, P6) | Documented across `uiux-design.md`, `HealthCommunityBridge.tsx`, and MedCity page | **100% Verified** |
| **Contact Phone / WhatsApp** | `8618902810` (P8) | Programmed into all CTAs, WhatsApp URL builders, and contact pages | **100% Verified** |
| **Contact Email** | `hummingdrops@gmail.com` (P8) | Displayed across Footer, Contact page, and system communications | **100% Verified** |
| **Official Domain** | `www.hummingdrops.com` (P8) | Target production domain configured in Vercel and SEO manifests | **100% Verified** |
| **Kitchen Hub Location** | Berrybeats Cafe, Bangalore (P8) | Displayed across Footer, Morning Ritual journey, and Bangalore address capture | **100% Verified** |
| **Zero Hallucination Rule** | Zero invented claims, fake reviews, or unauthorized medical cures | Verified in automated tests (`test-phase4-homepage.mjs`); zero fake reviews | **100% Verified** |

---

## 3. Technical Deliverables Inventory

### 3.1 Application Routes & Sitemap (19 Total Routes)

| Route Path | Type | Functionality & Current Status |
| :--- | :--- | :--- |
| `/` | SSR / Static | **Humming Drops Public Homepage:** Editorial hero, interactive 5-compartment box anatomy, morning ritual journey, why-us philosophy, MedCity bridge, pricing matrix, closing CTA. |
| `/medcity-smiles` | SSR / Static | **MedCity Smiles Public Homepage:** Serene mental wellness portal, 4 mind-body pillars, doctor advisory network, preventative health center. |
| `/plans` | SSR / Static | **Plans Comparison Page:** Side-by-side feature matrix between Standard (₹3,500) and Premium (₹4,000). |
| `/subscribe` | Interactive Client | **5-Step Onboarding Funnel:** Step 1 Plan Selection, Step 2 Contact info, Step 3 Bangalore Address, Step 4 Dietary notes, Step 5 Order Review & Mode B Assisted Registration. |
| `/about` | SSR / Static | **Brand Story & Kitchen Hub:** Berrybeats Cafe kitchen story, sourcing standards, founders' vision. |
| `/contact` | SSR / Static | **Contact & Location:** Bangalore address, Google Map placeholder, phone `8618902810`, email `hummingdrops@gmail.com`. |
| `/login` | Client Auth Shell | **Subscriber Authentication:** Email / Password & Phone OTP login shell. |
| `/register` | Client Auth Shell | **Subscriber Registration:** Account creation shell. |
| `/forgot-password` | Client Auth Shell | **Password Recovery:** Email reset flow shell. |
| `/dashboard` | Protected Layout | **Subscriber Dashboard Home:** Overview of daily breakfast box status and quick actions. |
| `/dashboard/overview` | Protected View | **Delivery Overview:** Today's box menu and upcoming delivery calendar. |
| `/dashboard/delivery` | Protected View | **Delivery Management:** Delivery pause/resume controls and schedule calendar. |
| `/dashboard/health` | Protected View | **Health & Vitals Center:** Protected Blood Sugar, Cholesterol, and BP test history and appointment booking. |
| `/dashboard/community` | Protected View | **MedCity Smiles Community:** Upcoming doctor seminars, wellness workshops, RSVP management. |
| `/dashboard/settings` | Protected View | **Account Settings:** Delivery address management, notification preferences, profile. |
| `/api/subscriptions/lead` | Dynamic Route Handler | **Assisted Lead Capture API:** POST lead ingestion with canonical pricing validation and GET reference lookup. |
| `/api/payments/order` | Dynamic Route Handler | **Razorpay Order Creation API:** Server-side order generation for Mode A online checkout. |
| `/api/payments/verify` | Dynamic Route Handler | **Razorpay Signature Verification API:** Cryptographic HMAC SHA-256 signature verification. |
| `/api/payments/webhook` | Dynamic Route Handler | **Razorpay Webhook Handler:** Asynchronous payment success/failure event processor. |

### 3.2 Design System & Theming Tokens

* **Dual-Theme Engine:** Implemented via CSS custom properties mapped in `tailwind.config.ts`.
  * **Humming Drops:** Forest Green (`#144518`), Leaf Green (`#2E7301`), Papaya Orange (`#E86A17`), Warm Paper (`#FDFCF7`).
  * **MedCity Smiles:** Mindful Teal (`#0D5049`, `#156C63`), Soft Mint (`#E6F7F5`), Serene Mist (`#F8FAF9`).
* **Typography:** `Plus Jakarta Sans` for titles and section headers; `Inter` for body copy, numbers, and inputs.
* **Component Primitives:** Accessible, headless primitives in `@/components/ui/` (`Button`, `Badge`, `Card`, `Container`, `Section`, `BrandSwitcher`, `Navbar`, `Footer`).

---

## 4. Operational Parameters & Client Decisions Required (`CIR`)

The platform architecture strictly prevents locking in provisional operational assumptions. The following seven decisions require explicit client confirmation before production launch:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT DECISIONS REQUIRED (CIR) CHECKLIST                       │
├────────┬───────────────────────────────────┬────────────────────────┬──────────────────┤
│ Tag    │ Decision Area                     │ Current Implementation │ Client Action    │
├────────┼───────────────────────────────────┼────────────────────────┼──────────────────┤
│ CIR-01 │ Bangalore Delivery Corridors      │ Open Bangalore Pincode │ Confirm Corridors│
│ CIR-02 │ Morning Delivery Timing Windows   │ "Delivered Morning"    │ Confirm Hours    │
│ CIR-03 │ Continuous 30-Day vs Mon-Sat Days │ Monthly Billing Basis  │ Confirm Days/Mo  │
│ CIR-04 │ Delivery Pause Cutoff Time        │ Configurable Flag      │ Confirm Cutoff Hr│
│ CIR-05 │ Free Health Test Phlebotomy Mode  │ Partner Clinic Walk-in │ Confirm Home Draw│
│ CIR-06 │ Produce Customization Flexibility │ Chef Select + Notes    │ Confirm Swap Rule│
│ CIR-07 │ Payment Gateway vs Assisted Lead  │ Pluggable Dual-Mode    │ Choose Mode A / B│
└────────┴───────────────────────────────────┴────────────────────────┴──────────────────┘
```

### Action Required from Client:
1. **Confirm Payment Mode (CIR-07):**
   * *Mode A:* Automated online credit card, debit card, UPI payments via Razorpay. (Requires KYC-approved Razorpay Merchant Account).
   * *Mode B:* Assisted lead capture with WhatsApp handoff to `8618902810` and direct Bangalore coordinator manual confirmation. (Zero payment gateway fee, instant launch readiness).
2. **Confirm Delivery Corridors (CIR-01):** Provide the exact list of serviced pin codes or Bangalore neighborhoods (e.g., Koramangala, Indiranagar, HSR Layout, Whitefield, etc.).
3. **Confirm Phlebotomy Logistics (CIR-05):** Clarify whether MedCity Labs provides home blood sample collection or customer walk-ins at partner diagnostic centers.

---

## 5. Partner Roles & Operational Responsibilities

```
                         ┌──────────────────────────────────────┐
                         │         HUMMING DROPS CLIENT         │
                         │             LEADERSHIP               │
                         └──────────────────┬───────────────────┘
                                            │
               ┌────────────────────────────┴───────────────────────────┐
               ▼                                                        ▼
┌─────────────────────────────┐                          ┌─────────────────────────────┐
│    BERRYBEATS CAFE HUB      │                          │     MEDCITY HEALTH LABS     │
│   (Physical Nutrition)      │                          │      (Mental & Medical)     │
├─────────────────────────────┤                          ├─────────────────────────────┤
│ • Produce procurement       │                          │ • Blood Sugar, Cholesterol  │
│ • Daily box packing         │                          │   & BP monthly checkups     │
│ • Sourcing quality control  │                          │ • Curated lab discount pkgs │
│ • Customer service helpline │                          │ • Medical Advisory Doctors  │
│   (Phone/WA: 8618902810)    │                          │ • Nutritionist consultations│
│ • Morning dispatch logistics│                          │ • MedCity Smiles webinars   │
└─────────────────────────────┘                          └─────────────────────────────┘
```

---

## 6. Maintenance, Warranty & SLA

1. **Bug Fix Warranty:** The engineering team provides complete warranty support for critical (P0/P1) bugs and regressions following official acceptance.
2. **Code Ownership & Licensing:**
   * All custom application source code, configuration files, and design system tokens are the exclusive property of Humming Drops.
   * Client-provided assets (`references/Humming drop Logo .png` and `references/Humming-Drops-Brochure.pdf`) remain client intellectual property.
   * Open-source dependencies (Next.js, React, Tailwind CSS, Lucide icons, Radix UI) are governed by permissive MIT licenses.
3. **Hosting & Operational Costs:**
   * Vercel Pro hosting: ~$20/month (or free hobby tier for initial launch traffic).
   * Domain registration: `hummingdrops.com` renewal through registrar.
   * Razorpay processing fee (Mode A only): ~2% per online domestic transaction.

---

## 7. Formal Handover Acceptance Sign-off

| Stakeholder Role | Representative Name | Organization | Signature / Status |
| :--- | :--- | :--- | :--- |
| **Humming Drops Founder / CEO** | ____________________ | Humming Drops | Pending Sign-Off |
| **Berrybeats Operations Lead** | ____________________ | Berrybeats Cafe | Pending Sign-Off |
| **MedCity Labs Clinical Director**| ____________________ | MedCity Health Labs | Pending Sign-Off |
| **Lead Technical Architect** | Lead Architect | Engineering Team | **ACCEPTED & SUBMITTED** |
