# Runbook RB-02: Build, Typecheck & Verification Suite

**Document:** `docs/runbooks/build-and-verification.md`  
**Target Audience:** All Engineers, CI/CD Maintainers, Quality Engineers  
**Prerequisites:** Completed RB-01 (Local Development Setup)  

---

## 1. Overview

To maintain zero-regression quality, the Humming Drops repository implements a rigorous 4-step verification gate prior to any release, merge, or deployment:
1. Strict TypeScript Compile Check (`tsc --noEmit`).
2. Static Analysis & Linting (`next lint`).
3. Automated Integration & Security Guardrail Scripts (`scratch/test-*.mjs`).
4. Production Next.js Build Generation (`npm run build`).

---

## 2. Verification Commands

### Step 1: Strict TypeScript Typechecking

Executes the TypeScript compiler without emitting build artifacts:
```bash
npx tsc --noEmit
```
* **Expected Output:** Process exits with code `0` and zero error lines.
* **Failure Remediation:** Inspect type mismatch reports, verify interface definitions in `src/types/`, and resolve any null/undefined access violations.

### Step 2: Next.js ESLint Validation

Runs ESLint configured with Next.js Core Web Vitals rules:
```bash
npm run lint
```
* **Expected Output:** `✔ No ESLint warnings or errors`.

### Step 3: Automated Integration & Guardrail Test Suite

Execute the automated Node test scripts in sequence:

```bash
# 1. Phase 1 Guardrails (Mode spoofing & state invariants)
node scratch/test-phase1-guardrails.mjs

# 2. Phase 2 Design Tokens (WCAG AA/AAA contrast ratios)
node scratch/test-phase2-design-tokens.mjs

# 3. Phase 3 Layout & Components (Primitives and rendering)
node scratch/test-phase3-layout.mjs

# 4. Phase 4 Homepage Assertions (Box anatomy & brochure fidelity)
node scratch/test-phase4-homepage.mjs

# 5. Phase 4 Backend Integration Flow (Live HTTP lead creation, pricing tamper resistance, leads.json audit)
# Note: Requires a running Next.js server on port 3000
node scratch/test-phase4-backend-flow.mjs
```

#### Test Suite Summary

| Script | Focus Area | Assertions |
| :--- | :--- | :--- |
| `test-phase1-guardrails.mjs` | Client mode spoof rejection, lifecycle status invariants (`pending != active`) | 6/6 Passing |
| `test-phase2-design-tokens.mjs` | WCAG contrast ratio calculations for all dual-brand color pairs | 12/12 Passing |
| `test-phase3-layout.mjs` | Component composition, accessible button & badge rendering | 8/8 Passing |
| `test-phase4-homepage.mjs` | Brochure fidelity: 4 fruits, 2 veg, salad, sprouts, dry fruit pricing | 10/10 Passing |
| `test-phase4-backend-flow.mjs` | End-to-end HTTP lead submission, reference code generation, validation error handling | 6/6 Passing |

### Step 4: Production Next.js Build

Compiles and optimizes all routes for production deployment:
```bash
npm run build
```
* **Expected Output:**
  ```text
  Route (app)                              Size     First Load JS
  ┌ ○ /                                    ... kB         ... kB
  ├ ○ /about                               ... kB         ... kB
  ├ ○ /contact                             ... kB         ... kB
  ├ ○ /dashboard                           ... kB         ... kB
  ├ ○ /medcity-smiles                      ... kB         ... kB
  ├ ○ /plans                               ... kB         ... kB
  ├ ○ /subscribe                           ... kB         ... kB
  ├ ƒ /api/subscriptions/lead              0 B               0 B
  └ ƒ /api/payments/order                  0 B               0 B
  ```
* All static routes marked with `○` (prerendered).
* Dynamic API endpoints marked with `ƒ` (serverless lambda).

---

## 3. Pre-Commit Verification Checklist

Before pushing commits to `main` or opening pull requests:
- [ ] `npx tsc --noEmit` succeeds with 0 errors.
- [ ] `npm run lint` succeeds with 0 errors.
- [ ] No unconfirmed client claims or hardcoded assumptions introduced.
- [ ] Minimal, surgical diffs without bulk refactoring.
- [ ] All comments and TODOs preserved.
- [ ] `npm run build` succeeds cleanly.
