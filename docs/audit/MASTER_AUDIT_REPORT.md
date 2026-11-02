# Humming Drops & MedCity Smiles — Independent Production Readiness Audit

**Audit date:** 2026-11-03
**Auditor:** Independent repo-only static audit (this session)
**Scope:** Read-only inspection of the local repository + locally runnable checks (`tsc`, `next lint`, `next build`, `npm run test:unit`). **No** access to Railway, Razorpay sandbox, any staging/production deployment, or a live Postgres instance existed in this session — nothing requiring that access was executed, and such items are marked `NOT VERIFIED` below rather than assumed to pass, per the audit's own Rule 2/3.
**Architecture baseline used:** `docs/adr/ADR-001` through `ADR-008` (the repo's actual, dated ADRs), not the Clerk/Playwright/Railway-only stack assumed by the originating audit prompt, and not the Supabase stack described in the top-level `CLAUDE.md` (both are stale relative to the real code — see §1).

## 0. Headline finding

This repo already contains a **prior self-authored "Gate 0" sign-off** (`docs/gate-0-signoff.md`) declaring the project "100% MILESTONE READINESS... GATE 0 APPROVED." That report is itself an unverified agent completion claim of exactly the kind this audit is supposed to distrust. Independent inspection of the actual code shows several of its "MITIGATED," "RESOLVED," and "DONE" claims do not hold, and that the customer-facing authentication/dashboard/health features are non-functional decoration, not working product. **Verdict: NOT PRODUCTION READY** (§21).

---

## 1. Architecture baseline reconciliation

| Source | Claimed stack | Actual (`package.json`, code) |
|---|---|---|
| Root `CLAUDE.md` | Supabase (Postgres+Auth), Razorpay-or-WhatsApp strategy | No `@supabase/*` dependency anywhere in `package.json`. Not what's implemented. |
| Pasted audit prompt (user-supplied) | Clerk auth, Drizzle+Postgres, Playwright, Railway | Drizzle+Postgres **matches** and is genuinely implemented (`src/lib/db/*`). Clerk is **not present** anywhere in the repo. Playwright is **not present** (only a hand-rolled `node --experimental-strip-types` runner + Vitest config that nothing currently uses). Railway config (`railway.toml`, `Dockerfile`) exists. |
| `docs/adr/*` (actual repo ADRs) | Next.js 15 App Router + TS strict (ADR-001), pluggable checkout strategy (ADR-003), repository pattern for leads (ADR-005), health PII isolation (ADR-006) | Matches the real code structure closest of the three sources. Treated as ground truth for this audit. |

**Finding HD-AUD-001 (P3, Confirmed):** `CLAUDE.md` describes a Supabase-based stack that was abandoned in favor of Drizzle/Postgres sometime after it was written, and the doc was never updated. Low severity on its own, but it means any future agent reading `CLAUDE.md` literally will architect against a stack that doesn't exist. **Recommendation:** update `CLAUDE.md` §4 to match ADR-001/ADR-005, or mark it superseded.

There is **no ADR for authentication** (no Clerk, no Supabase Auth, no NextAuth) despite `src/app/login` existing and dashboards depending on "being signed in." See HD-AUD-003.

---

## 2. Verified findings (evidence-backed, most severe first)

### HD-AUD-002 — No real authentication exists; `/dashboard/*` is unauthenticated and unauthorized by anything
**Severity:** P0 **Confidence:** Confirmed
**Affected files:** `src/app/login/page.tsx`, `src/app/dashboard/**/*`, (absence of) `src/middleware.ts`
**Expected behaviour:** Per `docs/adr` and the business model, `/dashboard/*` should only be reachable by an authenticated, confirmed-active subscriber, with session/identity enforced server-side (ADR-004's server-authoritative lifecycle implies this).
**Actual behaviour:**
- There is **no `src/middleware.ts`** in the repo at all (`Glob "src/middleware.ts"` → no results). Nothing gates `/dashboard` routes.
- `src/app/login/page.tsx` `handleSignIn` performs **no network call whatsoever**. It accepts any string in the identifier field, fabricates a `sessionData` object client-side (including a fake `planId: "premium"` and a fake `deliveryAddress`), writes it to `localStorage`, and redirects to `/dashboard/overview` after a cosmetic `setTimeout`.
- A second button, "Preview with Demo Subscriber Account," logs in as a hardcoded fake customer "Rahul Sharma" with no credential check at all.
- `/dashboard/overview/page.tsx` only ever reads `localStorage.getItem("hd_subscriber_session")` — a value any visitor can set themselves via devtools (`localStorage.setItem("hd_subscriber_session", JSON.stringify({customerName:"Attacker"}))`) without ever calling `/login`.
**Reproduction:** Open the production build, navigate directly to `/dashboard/overview` or `/dashboard/health` with no prior login step. Pages render fully populated "subscriber" content.
**Evidence:** Full file reads of `src/app/login/page.tsx` and `src/app/dashboard/overview/page.tsx` (quoted above in session transcript); `Glob("src/middleware.ts")` returned no files.
**Business/security impact:** There is no subscriber authentication, authorization, or session integrity anywhere in the product. Every "customer dashboard," "customer authentication," and "subscription lifecycle" requirement in the original audit scope (§6.C/D/E) is **NOT IMPLEMENTED**, not merely untested.
**Recommended correction:** Implement real server-side auth (session cookie + server verification, or an auth provider) and a `middleware.ts`/route-handler guard on `/dashboard/*` and any API route returning customer data, before any of this is shown to a real user.
**Dependencies:** Blocks HD-AUD-003, HD-AUD-004.

### HD-AUD-003 — Health dashboard presents fabricated clinical data as if genuine, in direct violation of the project's own anti-fabrication rule
**Severity:** P0 **Confidence:** Confirmed
**Affected files:** `src/app/dashboard/health/page.tsx`
**Expected behaviour:** `CLAUDE.md` §2 Rule 2 — "Never Fabricate: Never invent clinical claims... Never invent... statistics." ADR-006 requires health PII isolation per real authenticated user.
**Actual behaviour:** The page hardcodes specific fake lab results directly in JSX: "Fasting: 92 mg/dL," "Post-Prandial: 124 mg/dL," "Total Cholesterol: 176 mg/dL," "118/78 mmHg," a named fake doctor "Dr. S. Menon (MedCity Labs)," a fake visit date "15 Oct 2026," and a "PDF Report" download link whose `onClick` just calls `alert("Downloading verified lab summary PDF report...")` — no PDF exists. None of this is fetched from any database, any real lab integration, or tied to the (nonexistent) authenticated user in any way; it is identical for every visitor.
**Reproduction:** Visit `/dashboard/health` as any anonymous visitor (see HD-AUD-002) — the same fabricated lab results and doctor name render for everyone.
**Evidence:** Full file read of `src/app/dashboard/health/page.tsx`, lines 93–257.
**Business/security impact:** Presenting invented clinical results as genuine is both a direct CLAUDE.md violation and a real-world liability if this were ever shown to an actual user who might believe it reflects their own labs. This is materially different from a labeled wireframe/mock — it reads as real data.
**Recommended correction:** Either gate this entire feature behind "Coming soon — pending MedCity Labs integration," or make it source from real per-user records once auth + a lab-data pipeline exist. Do not ship fabricated per-user health numbers.

### HD-AUD-004 — Payment verification does not bind the paid order to the subscription being activated (IDOR)
**Severity:** P1 **Confidence:** Confirmed
**Affected files:** `src/app/api/payments/order/route.ts`, `src/app/api/payments/verify/route.ts`
**Expected behaviour:** The subscription/lead that gets promoted to `confirmed_active` + `hasActivePerks: true` must be the same one the verified payment was actually for.
**Actual behaviour:** `order/route.ts` correctly stores `leadReferenceCode` alongside the created order (`paymentRepository.createOrder({..., leadReferenceCode, ...})`). But `verify/route.ts` never re-reads that stored association — it fetches `existingOrder` only to read `amountPaise` for the transaction log (line 80-84), and separately activates **whatever `leadReferenceCode` the client sent in the request body** (line 69-77), with no check that it equals `existingOrder.leadReferenceCode`.
**Reproduction (logical, sandbox-only — not executed, no credentials available):** 1) Create an order for the cheapest plan under lead A. 2) Complete payment, obtaining a valid Razorpay signature for that order/payment pair. 3) Call `/api/payments/verify` with that valid signature but `leadReferenceCode: <lead B's code>`. Because the signature check only proves the order/payment pair is genuine — not that it belongs to lead B — lead B is incorrectly promoted to `confirmed_active`.
**Evidence:** Full file reads of both routes (quoted above).
**Business/security impact:** Lets a payer activate a different, unpaid subscription of their choosing (their own cheaper one, or — since lead reference codes are only 5 digits plus a known year, see HD-AUD-005 — potentially someone else's).
**Recommended correction:** In `verify/route.ts`, require `existingOrder.leadReferenceCode === leadReferenceCode` (or derive the lead solely from the stored order, never from client input) before promoting any subscription.

### HD-AUD-005 — Checkout-mode server authority silently falls back to the client-controlled `NEXT_PUBLIC_*` flag, contradicting the project's own written guardrail
**Severity:** P1 **Confidence:** Confirmed
**Affected files:** `src/lib/checkout-config.ts` (`getServerAuthoritativeCheckoutMode`)
**Expected behaviour:** Root `CLAUDE.md` §6.1 states verbatim: `NEXT_PUBLIC_CHECKOUT_MODE` "must NEVER be trusted for pricing, payment verification, subscription activation, authorization, or other security-sensitive decisions. Server-side configuration and server validation must determine authoritative payment/fulfillment behavior."
**Actual behaviour:** `getServerAuthoritativeCheckoutMode()` is: `process.env.CHECKOUT_MODE || process.env.NEXT_PUBLIC_CHECKOUT_MODE` — if the private `CHECKOUT_MODE` is ever unset in an environment, the function (used by the payment order/verify/lead routes to decide authoritative fulfillment behavior) silently trusts the public flag. The unit test suite (`pricing-invariants.test.ts`, "falls back safely to default checkout mode if client configuration is spoofed") only tests the *unset* case, not the case where both are set to conflicting values, so this gap is untested.
**Evidence:** Full file read of `src/lib/checkout-config.ts` lines 34-41.
**Business/security impact:** Lower impact today because `.env.example` sets both variables in lockstep and the two fulfillment modes are not drastically different in trust level, but it's a direct contradiction of a written security invariant, and worsens if a third mode or pricing-sensitive branch is ever added to this function.
**Recommended correction:** Remove the `NEXT_PUBLIC_CHECKOUT_MODE` fallback from the server-authoritative function entirely; fail closed (default to `assisted_lead`) if `CHECKOUT_MODE` is unset, rather than reading the public variable.

### HD-AUD-006 — Lead/registration lookup still allows unauthenticated enumeration of customer name + delivery area
**Severity:** P2 **Confidence:** Confirmed
**Affected files:** `src/app/api/subscriptions/lead/route.ts` (`GET`)
**Expected behaviour:** `docs/gate-0-signoff.md` RSK-01 claims the original unauthenticated PII dump (SEC-01) is "MITIGATED & ARCHITECTED."
**Actual behaviour:** The unauthenticated `list all` path is now correctly blocked (401 without admin key) — that part of the fix is real. But `GET ?ref=<code>` for any **unauthenticated** caller still returns `customerName`, `area`, `status`, and `leadReferenceCode` (only `phone` is masked) for any guessable reference code, with **no rate limiting** visible anywhere in the route. Reference codes are `HD-REG-<year>-<5 digits>` — only 100,000 possibilities per year, brute-forceable with no throttling.
**Evidence:** Full file read of `src/app/api/subscriptions/lead/route.ts` lines 298-370, no rate-limit import/middleware found anywhere in `src/app/api/`.
**Business/security impact:** Partial PII enumeration risk (customer name + locality) remains; the original P0 is reduced to roughly a P2 enumeration issue, not fully closed as claimed.
**Recommended correction:** Require a second shared secret or move this to an authenticated-customer-only lookup; add rate limiting.

### HD-AUD-007 — Admin-secret comparison on the lead endpoint is not constant-time, despite the claim that it is
**Severity:** P3 **Confidence:** Confirmed
**Affected files:** `src/app/api/subscriptions/lead/route.ts` (`isAuthorized`)
**Actual behaviour:** `isAuthorized` uses plain `===` string comparison against `ADMIN_API_KEY`/`LEAD_AUDIT_SECRET`, not `crypto.timingSafeEqual` — unlike the (correctly implemented) `crypto.timingSafeEqual` used in `razorpay.ts` for payment signatures. `docs/gate-0-signoff.md` §2.1 claims "constant-time token comparison" was part of the SEC-01 remediation; it was not applied here.
**Recommended correction:** Reuse the same timing-safe comparison pattern already proven correct in `razorpay.ts`.

### HD-AUD-008 — "Daily rate" fields were purged from the UI but not from the schema/persistence layer
**Severity:** P3 **Confidence:** Confirmed
**Affected files:** `src/lib/lead-storage.ts` (`CANONICAL_PLANS.perDayPriceINR`), `src/lib/db/schema.ts`, `src/lib/db/migrate-leads.ts`
**Actual behaviour:** `grep` for `perDayPriceINR`/daily-rate patterns across `src/` found **zero** matches in any UI component or page (the purge claimed in `docs/gate-0-signoff.md` RSK-05 does hold for everything user-visible), but the field is still defined and persisted in the backend schema/storage layer (`perDayPriceINR: 116` / `133`). It isn't currently returned by any API response body (verified by reading both `GET` handlers in the lead route), so there is no live leak today — but it's dead/stale data that contradicts the "100% purged" claim and could resurface if a future `SELECT *`-style serialization is added.
**Recommended correction:** Either remove the column/field, or explicitly document it as an internal-only derived value, so the "100% purged" claim in `docs/gate-0-signoff.md` is corrected or the field is actually removed.

### HD-AUD-009 — No E2E/Playwright tests exist despite being claimed as part of the QA plan
**Severity:** P2 **Confidence:** Confirmed
**Affected files:** repo-wide search for `playwright` → zero matches outside the pasted audit prompt itself.
**Actual behaviour:** `docs/gate-0-signoff.md` §2.6 claims a "comprehensive two-tier automated testing suite" including a "Playwright E2E Suite" testing onboarding, theming, responsive viewports, and WCAG 2.1 AA. No Playwright config, test file, or dependency exists anywhere in the repo. The only tests present are 4 Vitest/node-native unit suites (`tests/unit/*`), all of which test pure functions (state machine transitions, pricing constants, phone/email/pincode sanitization) — genuinely well-written and all passing, but they never touch an API route, a React component, or the (nonexistent) auth flow.
**Evidence:** `npm run test:unit` executed in this session — 4/4 suites passed (23 assertions, 1.53s). `Glob`/file-search for Playwright found nothing.
**Recommended correction:** Either write the claimed E2E suite, or correct the documentation to say unit-tests-only.

---

## 3. What is genuinely solid (do not re-litigate these)

To avoid the failure mode this audit is designed to catch in reverse — treating *everything* as broken because *something* is — the following were independently verified as real and correct, not just claimed:

- `npm run typecheck` (`tsc --noEmit`): **0 errors**, executed in this session.
- `npm run lint` (`next lint`): **0 warnings, 0 errors**, executed in this session.
- `npm run build` (`next build`): succeeds, 22/22 routes compiled, executed in this session.
- `npm run test:unit`: 4/4 suites, 23/23 assertions pass, executed in this session.
- `src/lib/razorpay.ts` signature verification (both `verifyPaymentSignature` and `verifyWebhookSignature`): correctly uses `crypto.createHmac("sha256", secret)` and `crypto.timingSafeEqual` with a length check before comparison, and fails closed when secrets are missing. This is real, correct cryptographic code, not a stub.
- `src/app/api/payments/webhook/route.ts`: correctly consumes the raw body via `request.text()` before parsing (avoiding the classic Next.js App Router JSON-whitespace HMAC mismatch), verifies signature before trusting the payload, and has a working event-ID deduplication ledger (`paymentRepository.hasWebhookEvent`).
- `src/lib/lead-storage.ts`'s `DrizzlePostgresLeadRepository` is a **real, implemented** multi-table transactional writer (`db.transaction`, proper FK-safe upserts, audit log inserts) — this contradicts `docs/gate-0-signoff.md`'s own characterization of persistence as merely "BLUEPRINTED... ready for Phase 7," i.e. the team's later work exceeded what the self-report credited them for. The `HybridLeadRepository` correctly switches between this and a JSON-file fallback based on `DATABASE_URL` presence, and no literal "still using JSON in prod" risk was found in the switching logic itself (though it can't be verified which backend any live deployment is actually using — see §4).
- `.env.example` correctly documents the `NEXT_PUBLIC_*` vs. server-secret split and never defines a real secret value.

---

## 4. Explicitly NOT VERIFIED (requires access this session did not have)

Per the audit's Rule 2/3, these are **not** scored and must not be read as passing:

- Whether any real Railway deployment exists, its environment variables, health checks, or resource limits.
- Whether a live Postgres database is actually reachable, migrated, and matches `src/lib/db/schema.ts` in production/staging.
- Whether Razorpay sandbox/live payments actually succeed end-to-end (order → checkout widget → webhook delivery) — only the code's cryptographic correctness was verified, not a live round-trip.
- Backup/restore procedures, monitoring/Sentry wiring, CI pipeline behavior, and any RBAC beyond the single `ADMIN_API_KEY` bearer check (no multi-role system exists in code at all — the 7-role RBAC matrix requested by the audit prompt (§8) does not exist in this codebase; there is exactly one binary "has admin key or not" check).
- Accessibility (WCAG) and responsive-viewport testing — no browser/Playwright tooling was available in this session to execute it.

---

## 5. Final Production Readiness Scorecard

| Category | Score | Evidence |
|---|---:|---|
| Requirements completion | 35/100 | Pricing/plan and WhatsApp-handoff flows are real; auth, dashboard, and health features are decorative only (§2) |
| Frontend functionality | 50/100 | Builds clean, renders correctly, but core authenticated flows don't function (§HD-AUD-002) |
| Customer experience | 30/100 | Fabricated health data and fake login are user-facing deceptions, not just bugs (§HD-AUD-002/003) |
| Admin panel | NOT VERIFIED | No admin UI exists in the repo at all — only a bearer-token API gate on one endpoint |
| Backend APIs | 55/100 | Payment crypto and webhook handling are solid (§3); lead/verify binding and auth gaps are real (§HD-AUD-004/006) |
| Database integrity | 60/100 | Drizzle/Postgres implementation is real and transactional (§3); cannot verify it against a live DB |
| Authentication and RBAC | 5/100 | No authentication mechanism exists at all (§HD-AUD-002); no RBAC exists beyond one bearer key |
| Payment integration | 65/100 | Signature verification and webhook dedup are genuinely correct; activation binding has a confirmed IDOR (§HD-AUD-004) |
| Security | 30/100 | P0 unauthenticated dashboard, P1 IDOR, plus the guardrail contradiction in §HD-AUD-005 |
| Performance | NOT VERIFIED | No load/perf testing possible without a live environment |
| Reliability and backups | NOT VERIFIED | No deployment access |
| Automated testing | 40/100 | Unit tests are real, well-written, and passing; no integration/E2E coverage exists despite being claimed (§HD-AUD-009) |
| Deployment | NOT VERIFIED | `Dockerfile`/`railway.toml` exist and look reasonable on paper; no live deployment inspected |
| Documentation | 45/100 | Extensive, well-organized docs/ADRs exist, but at least one prior "100% ready" sign-off is demonstrably wrong (§0), and root `CLAUDE.md`'s stack description is stale (§HD-AUD-001) |

## 6. Final Verdict

**C. NOT PRODUCTION READY**

Rationale: two P0 findings remain open — a completely absent authentication layer protecting the entire customer dashboard, and a health-data feature that fabricates specific clinical results for anyone who visits it, unauthenticated. A P1 payment/subscription-activation IDOR is also open. None of these can be waved through as acceptable residual risk (which would require `CONDITIONALLY READY`), because they affect exactly the areas (customer auth, customer PII, payment-to-subscription binding) the project's own CLAUDE.md and ADRs name as highest priority.

What **is** real and should be preserved, not redone: the Razorpay cryptographic verification code, the webhook handler, the Drizzle/Postgres persistence layer, the lead-intake validation/sanitization, and the unit test suite. The task ahead is building real authentication and wiring the dashboard to real per-user data — not rewriting the payment or persistence layers, which already work.
