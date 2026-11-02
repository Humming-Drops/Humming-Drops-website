# Verification Suite Baseline & Test Coverage Proposal (HUM-16)

**Issue:** [HUM-16: Build, Typecheck & Verification Suite](https://github.com/)  
**Date:** November 2026  
**Role:** QA Engineer  
**Status:** Baseline Verified & Resolved; Test Suite Architecture Proposed  

---

## 1. Executive Summary

This report establishes the baseline quality verification for the Humming Drops & MedCity Smiles web platform and outlines the automated test coverage architecture (Vitest & Playwright).

| Verification Stage | Command | Target / Standard | Status | Details |
| :--- | :--- | :--- | :---: | :--- |
| **TypeScript Compilation** | `npm run typecheck` | `tsc --noEmit` (strict: true) | **PASSED** | 0 type errors across all routes, components, and libraries. |
| **Production Build** | `npm run build` | Next.js 15.5.25 (App Router) | **PASSED** | 22 routes compiled (18 static prerendered, 4 dynamic API handlers). |
| **ESLint Configuration** | `npm run lint` | Next.js Core Web Vitals | **RESOLVED & PASSED** | Fixed missing configuration by adding `.eslintrc.json`. 0 errors, 0 warnings. |
| **Unit & Integration Suite** | Proposed | Vitest + Testing Library | **PROPOSED** | Target coverage for guardrails, payment signatures, and UI primitives. |
| **End-to-End Suite** | Proposed | Playwright + Axe-Core | **PROPOSED** | Target coverage for multi-step onboarding, dual-brand switching, responsive & WCAG 2.1 AA. |

---

## 2. Baseline Verification Results

### 2.1 TypeScript Compilation Baseline
* **Configuration:** `tsconfig.json` enforces `"strict": true`, `"moduleResolution": "bundler"`, `"isolatedModules": true`, and path aliasing `@/*` -> `./src/*`.
* **Execution:** `npm run typecheck` (`tsc --noEmit`).
* **Result:** **Exit code 0**. Clean compilation with zero diagnostic errors across both static routes and server API route handlers.

### 2.2 Next.js 15 Production Build Baseline
* **Framework:** Next.js 15.5.25 using App Router.
* **Execution:** `npm run build` (`next build`).
* **Build Time:** 12.7 seconds.
* **Output Breakdown:**
  * **Static Routes Prerendered (18):**
    * `/` (Homepage, 18.9 kB, First Load JS: 179 kB)
    * `/_not-found`
    * `/about`, `/contact`, `/plans`, `/forgot-password`, `/login`, `/register`
    * `/medcity-smiles` (Mindful Wellness landing page)
    * `/subscribe` (Subscription onboarding wizard, 10.2 kB)
    * `/dashboard` and sub-routes (`/dashboard/overview`, `/dashboard/delivery`, `/dashboard/health`, `/dashboard/community`, `/dashboard/settings`)
  * **Dynamic Server Routes (4):**
    * `/api/payments/order`
    * `/api/payments/verify` (HMAC-SHA256 signature verification)
    * `/api/payments/webhook`
    * `/api/subscriptions/lead` (Assisted WhatsApp lead capture)
  * **Shared Bundle Size:** 103 kB First Load JS shared across chunks.
* **Result:** **Exit code 0**. Fully validated production build.

### 2.3 ESLint Missing Configuration & Resolution
* **Issue Discovered:** The repository had `eslint` (`^9.20.1`) and `eslint-config-next` (`^15.2.0`) installed in `devDependencies`, with `"lint": "next lint"` in `package.json`, but lacked any ESLint configuration file in the project root (`.eslintrc.json`, `eslint.config.mjs`, or `.eslintrc.js`).
* **Impact:** In CI and automated test environments, running `npm run lint` stalled or prompted interactively with `? How would you like to configure ESLint?`, causing immediate process failure (Exit code 1).
* **Resolution:** Created `.eslintrc.json` with the standard Next.js core web vitals configuration:
  ```json
  {
    "extends": "next/core-web-vitals"
  }
  ```
* **Verification:** Re-ran `npm run lint`. Successfully analyzed all source files in `src/`.
* **Result:** **Exit code 0**. `✔ No ESLint warnings or errors`.

---

## 3. Proposed Test Coverage Architecture

Currently, temporary testing relies on standalone Node scripts inside `/scratch/` that manually launch test server instances. We propose replacing these with two modern, industry-standard verification suites:

```text
┌────────────────────────────────────────────────────────┐
│               QA Verification Strategy                │
├───────────────────────────┬────────────────────────────┤
│     Vitest (Fast / Mock)   │    Playwright (Real E2E)   │
├───────────────────────────┼────────────────────────────┤
│ • Unit utilities & helpers│ • 5-Step Subscription flow │
│ • Business guardrails     │ • Dual-Brand theme toggle  │
│ • API contract & handlers │ • Responsive viewports     │
│ • Component render/state  │ • WCAG 2.1 AA accessibility│
└───────────────────────────┴────────────────────────────┘
```

### 3.1 Vitest (Unit, Component, & Route Handlers)

#### Proposed Stack:
* `vitest`: Ultra-fast test runner using native ESM, Vite transforms, and Jest-compatible API.
* `@testing-library/react` & `@testing-library/jest-dom`: Accessible component testing.
* `jsdom`: In-memory browser DOM simulation.
* `@vitejs/plugin-react`: JSX and React component compilation.

#### Target Test Matrix:
1. **Business Logic & Guardrails (`tests/unit/guardrails.test.ts`):**
   * Migration from `scratch/test-phase1-guardrails.mjs`.
   * Subscription lifecycle transitions: Ensure `pending_confirmation` and `registration_submitted` are never treated as `confirmed_active`.
   * Fallback for `CHECKOUT_MODE`: Guarantee fallback to `assisted_lead` if `NEXT_PUBLIC_CHECKOUT_MODE` is tampered with or absent.
2. **Cryptographic & Payment Verification (`tests/unit/payment-verify.test.ts`):**
   * Signature generation & verification helper (`crypto.createHmac('sha256', secret)`).
   * Valid payload verification vs tampered order ID / payment ID / signature rejection.
3. **Lead Storage & Utility Functions (`tests/unit/utils.test.ts`):**
   * Currency formatting (`formatCurrency`) and Bengaluru pincode validation.
   * `clsx` and `tailwind-merge` class name utilities (`src/lib/utils.ts`).
   * Lead storage file operations and idempotency (`src/lib/lead-storage.ts`).
4. **API Route Handlers (`tests/api/`):**
   * `/api/subscriptions/lead`: Validation of missing required fields (returns 400), valid lead generation with unique reference ID (`HD-REG-XXXXX`).
   * `/api/payments/verify`: Signature mismatch rejection, idempotency.
5. **Component Unit Tests (`tests/components/`):**
   * `BrandSwitcher`: Verification of active brand context toggle (`humming-drops` <-> `medcity-smiles`) and CSS attribute updates on `document.documentElement`.
   * `PricingCard`: Toggle between monthly and 3-month options, feature checklist rendering.

---

### 3.2 Playwright (End-to-End & Cross-Device Visual Suite)

#### Proposed Stack:
* `@playwright/test`: Multi-browser automation (Chromium, Firefox, WebKit).
* `@axe-core/playwright`: Automated WCAG 2.1 AA accessibility compliance testing.

#### Target Test Matrix:
1. **Complete Subscription Onboarding Flow (`tests/e2e/subscribe-flow.spec.ts`):**
   * Step 1: Select Plan (Standard ₹3,500 vs Premium ₹4,000).
   * Step 2: Customization (Preferences, frequency).
   * Step 3: Delivery Information (Bangalore delivery address, morning delivery slot).
   * Step 4: Checkout Strategy:
     * *Mode A (Online Gateway):* Mocked Razorpay modal trigger.
     * *Mode B (Assisted WhatsApp):* Registration submission, confirmation receipt (`HD-REG-XXXXX`), and WhatsApp click-to-chat redirection.
2. **Dual-Brand Experience & Navigation (`tests/e2e/brand-switching.spec.ts`):**
   * Navigate between Humming Drops (`/`) and MedCity Smiles (`/medcity-smiles`).
   * Verify header styling, palette swap (Forest Green `#144518` to Restorative Mindful Teal `#156C63`), and brand-specific content blocks.
3. **Responsive Viewport & Overflow Audit (`tests/e2e/responsive.spec.ts`):**
   * Mobile: iPhone 14/15 viewport (390x844px). Verify mobile drawer navigation, zero horizontal scrollbar (`overflow-x: hidden`).
   * Tablet: iPad Pro viewport (820x1180px). Verify grid column wrapping and card alignment.
   * Desktop: 1440x900px. Verify bento grid and sticky navigation bars.
4. **Accessibility & WCAG 2.1 AA Audit (`tests/e2e/a11y.spec.ts`):**
   * Full page scan using `@axe-core/playwright`.
   * Color contrast compliance (>= 4.5:1 for body copy).
   * Form label bindings (`<label for="...">`) on all input fields.
   * Keyboard tab navigation and visible focus rings on interactive elements.

---

## 4. Proposed `package.json` Scripts & Dependencies

### DevDependencies to Add:
```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.10.1",
    "@playwright/test": "^1.50.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^26.0.0",
    "vitest": "^3.0.5"
  }
}
```

### New Scripts:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "verify:all": "npm run typecheck && npm run lint && npm run test && npm run build"
  }
}
```

---

## 5. Verification Checklist & Current Status

- [x] TypeScript compilation (`npm run typecheck`) verified clean (0 errors).
- [x] Next.js 15 production build (`npm run build`) verified clean (22/22 routes prerendered/compiled).
- [x] Missing ESLint configuration identified and resolved (`.eslintrc.json` added).
- [x] Linting baseline (`npm run lint`) verified clean (0 errors, 0 warnings).
- [x] Comprehensive test coverage architecture (Vitest & Playwright) proposed and documented.
