# PLAN.md — Fix plan for BUGS.md (all severities)

Source: `BUGS.md` (QA run 2026-11-17). **Status: IN PROGRESS — Group A committed (d9417c2) and verified statically; live/browser re-test BLOCKED: local Postgres is not running (no service, Docker not started). Group B fixed in code on branch `fix/qa-bugs` (verification pending). Groups C–G not started (parts of C done inside Group B files: CUS-03 overview/delivery, PUB-02/PUB-09 on /subscribe).**

## Working rules
- Loop per item: fix → re-test the affected pages in Chrome → tick `[x]` here → next item. Commit after each group (one commit per group, message `fix(<area>): …`).
- Before each group's commit: `npm run lint`, `npm run typecheck`, `npm test`.
- Never put server secrets in `NEXT_PUBLIC_*`, never commit `.env.local`, never hardcode credentials.
- Do not invent client facts (CLAUDE.md §2). Anything unconfirmed becomes `CLIENT INPUT REQUIRED` / `PLACEHOLDER — CLIENT CONTENT REQUIRED` or is removed. **Decision needed from you: remove vs. tag** — plan assumes *tag with placeholder labels for operational facts (delivery window, cutoff, sessions), remove for marketing claims (badges, "doctor-certified", "Triple-Washed", founder quote, "FREE delivery")*.
- Re-test caveat: 768/375 px layout and axe/keyboard audits were not done in QA. Group G adds them (needs a working viewport method, e.g. Chrome DevTools device emulation or a headless Playwright run).
- Test data to clean up at the end: draft CMS page `qa-test-banner`, lead `HD-REG-2026-71182`, user `qa.customer@example.com` (local DB only).

## Group A — Security & data exposure (P0)
- [x] **ADM-01** Strip `passwordHash` / `clerkUserId` from staff responses; return an explicit safe DTO (id, email, name, phone, role, isActive, roles). Add a unit test asserting no `passwordHash` key.
  Files: `src/lib/staff-admin.ts` (select explicit columns at the user queries, ~lines 13 and 39), `src/app/api/admin/staff/route.ts`, `src/app/admin/staff/staff-client.tsx`, `tests/unit/` (new test). Also grep other admin routes for `select()` of `users`.
- [x] **ADM-02 / ADM-03** Draft/unpublished content must not reach the client payload, and unknown slugs return real 404. Query only published rows for anonymous visitors (filter in SQL, not after fetch); call `notFound()` before any record is serialised.
  Files: `src/app/content/[slug]/page.tsx`, `src/lib/content-storage.ts`, `src/app/not-found.tsx` (verify it yields HTTP 404).
- [x] **ADM-07** Confirm and fix server-side gating for `/admin`: redirect non-staff in middleware/server layout rather than client-side shell.
  Files: `src/middleware.ts`, `src/app/admin/layout.tsx`, `src/lib/auth/server.ts`.
- [x] **ADM-05 / ADM-06 / ADM-09** Validate UUID/`templateId` input → 400/422; unify admin error envelope `{success:false,error}`; subscription bad id → 404 JSON instead of 405.
  Files: `src/app/api/admin/content/[id]/route.ts`, `src/app/api/admin/content/route.ts`, `src/app/api/admin/subscriptions/[id]/route.ts`, `src/lib/content-validation.ts`, publish/unpublish routes.
- [x] **CUS-14** `/api/auth/me` logged-out: return 401 (or documented `authenticated:false`); align with `/api/customer/*`. File: `src/app/api/auth/me/route.ts` (+ callers in `src/lib/auth/client.tsx`).
- [x] **ADM improvement** Remove dev-credential hint "Default Admin: admin@hummingdrops.dev" outside development. File: `src/components/auth/admin-sign-in-portal.tsx`.

## Group B — Subscription-state integrity (P0, project rule §6.3)
- [x] **CUS-02** Dashboard branches on real status: none → CTA to `/subscribe`; `registration_submitted`/`pending_confirmation` → pending card with lead reference + WhatsApp 8618902810; `confirmed/active` → timeline. Never show "Active"/dispatch for non-active.
  Files: `src/app/dashboard/overview/page.tsx`, `src/app/dashboard/delivery/page.tsx`, `src/types/subscription.ts`, `src/app/api/customer/me/route.ts` (if status field needed).
- [x] **CUS-04** Pause / rider-notes: disabled until active; no success toast without a real API call; reject empty note. Persisting requires a new API + schema → **flag as scope question** (CLAUDE.md §7 Phase 1 says no dashboard functionality yet); default: disable and label "Coming soon — CLIENT INPUT REQUIRED".
  File: `src/app/dashboard/delivery/page.tsx`.
- [x] **CUS-09** Duplicate-lead handling: verify then block/merge second pending lead for same user. Files: `src/app/api/subscriptions/lead/route.ts`, `src/lib/lead-storage.ts` (+ test).
- [x] **CUS-07 / CUS-08 / PUB-06** `/subscribe`: real Review step before submit; no default plan; prefill saved phone; account email read-only; surface API errors next to the submit button (aria-live) and scroll/focus them.
  File: `src/app/subscribe/page.tsx` (+ `src/app/subscribe/layout.tsx` if titles).
- [x] **PUB-07** Pincode: Bangalore corridors are unconfirmed → accept any valid 6-digit pincode but show "serviceability CLIENT INPUT REQUIRED / confirmed by hub on WhatsApp"; stop hard-wiring "Bangalore" in the review.
  Files: `src/app/subscribe/page.tsx`, `src/lib/sanitization.ts`.

## Group C — Content truth: brochure vs. invented claims (P1)
Single source of truth first, then apply everywhere.
- [x] **PUB-01 / CUS-06** Create one content module for box contents (4 fruits, 2 veg, salad, sprouts daily; dry fruits 3 days/wk Standard, daily Premium; MedCity membership) and plan features/prices; consume it in all pages. Remove "5 fruits / 3 veg / 4 days + oats / closed Sundays", Premium's re-listed Standard items (list deltas only). Remove unconfirmed "Customize your box" Vegan/Fruit-Focused options or tag them.
  Files: new `src/lib/plan-content.ts` (or extend `src/types/plans.ts`), `src/components/home/{hero,box-anatomy,pricing-section,two-pillars,why-humming-drops,feature-strip,faq-section,closing-cta}.tsx`, `src/app/plans/page.tsx`, `src/app/subscribe/page.tsx`, `src/components/auth/{auth-shell,customer-sign-in-form,customer-sign-up-form}.tsx`, `src/app/dashboard/overview/page.tsx`, `src/components/layout/footer.tsx`, `src/app/about/page.tsx`.
- [~] **PUB-02 — DECISION: KEEP (user said "dont remove those")**. Marketing/operational claims (7:30 AM, closed Sundays, doctor-certified, Triple-Washed, badges, founder quote, free delivery, Free Lab Test) are intentionally left as-is on public pages; claims I had removed on `/subscribe` were restored. Original item: Remove/tag: 7:30 AM delivery, closed-Sundays, "doctor-certified", "Triple-Washed", "Zero Long Cold Storage", "Hand-Inspected", "Free Lab Test" (→ brochure wording: free monthly Blood Sugar, Cholesterol, Blood Pressure checkup), "Pause or cancel anytime", free-delivery line, "Most Popular / Recommended / Client Favorite", founding-team quote, "Bangalore delivery policy". Unify to one neutral badge style or none.
  Files: same set as above + `src/app/contact/page.tsx`, `src/components/home/reviews-section.tsx`, `src/types/plans.ts`.
- [x] **CUS-03** Dashboard: replace invented times, menu, named doctors, Zoom sessions, "RSVP Confirmed", "Submit to Medical Board" with `PLACEHOLDER — CLIENT CONTENT REQUIRED` blocks (or hide).
  Files: `src/app/dashboard/overview/page.tsx`, `src/app/dashboard/delivery/page.tsx`, `src/app/dashboard/community/page.tsx`.
- [x] **CUS-05** Community: drop pre-marked RSVP and past-dated sessions (filter `date >= today` if any data remains; otherwise placeholder).
  File: `src/app/dashboard/community/page.tsx`.
- [ ] **PUB-09** Remove "Mode B" from customer copy; **CUS-11** remove "managed by sign-in provider"; payments page internal copy ("RR-006", "file-backed", "Legacy role", "PostgreSQL RBAC grants", "Amount (paise)" mix).
  Files: `src/app/subscribe/page.tsx`, `src/app/dashboard/settings/page.tsx`, `src/app/admin/payments/page.tsx`, `src/app/admin/staff/page.tsx`.
- [ ] **PUB-08 / PUB-12** Shared `formatCurrency` (₹3,500) and phone formatter used everywhere. Files: `src/lib/utils.ts` (or new `src/lib/format.ts`), `src/lib/checkout-config.ts` (OFFICIAL_CONTACT), call sites above, `src/app/contact/page.tsx`.

## Group D — Forms & accessibility (P1/P2, WCAG 2.1 AA, CLAUDE.md §6.7)
- [ ] **PUB-05 / CUS-10 / ADM-04** Shared accessible field-error pattern: all errors inline per field, `aria-invalid`, `aria-describedby`, `role="alert"`/live region, focus first invalid field, scroll error into view. Apply to register, login, subscribe, settings phone, admin content slug (+ `pattern`/client validation, auto-slugify from title, fix helper echo).
  Files: new `src/components/ui/form-field.tsx`; `src/components/auth/{customer-sign-in-form,customer-sign-up-form,admin-sign-in-portal}.tsx`, `src/app/subscribe/page.tsx`, `src/app/dashboard/settings/page.tsx`, `src/app/admin/content/new/page.tsx`, `src/app/admin/content/[id]/page.tsx`, `src/components/content/content-field-editor.tsx`, `src/app/api/auth/register/route.ts` (return all field errors, not one at a time).
- [ ] Visible focus rings and contrast audit (4.5:1) fixes found in Group G. Files: `src/styles`/global CSS, `tailwind.config.ts`, `src/components/ui/*`.

## Group E — Missing pages & stubs (P2)
- [x] **PUB-03** `/forgot-password`: until reset is implemented, remove the disabled input and show contact instructions (hummingdrops@gmail.com / 8618902810). A real reset flow is out of Phase-1 scope → needs your confirmation.
  File: `src/app/forgot-password/page.tsx`.
- [x] **PUB-04** Add `/terms` and `/privacy` pages with `PLACEHOLDER — CLIENT CONTENT REQUIRED` legal text (health-data consent needs client/legal wording); fix register links and footer.
  Files: new `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/components/auth/customer-sign-up-form.tsx`, `src/components/layout/footer.tsx`.
- [ ] **PUB-12** Contact: add address/Maps source as `CLIENT INPUT REQUIRED` if unknown; contact form only if you want it (optional).

## Group F — Layout, metadata, performance, admin UX (P2/P3)
- [x] **PUB-10 / ADM-10** Fix title template (`%s | Humming Drops`, no double suffix), 404 title "Page not found", per-page admin titles, OG/Twitter metadata on inner pages.
  Files: `src/app/layout.tsx`, `src/app/{contact,subscribe,plans,about,admin/*}` metadata, `src/app/not-found.tsx`.
- [ ] **PUB-11 / CUS-12** Remove stacked duplicate header/logo + "Back to Home" in auth shell; hide "Subscribe Now" for logged-in users with a pending/active subscription; remove logged-out header flash (server-provided session state or skeleton).
  Files: `src/components/auth/auth-shell.tsx`, `src/components/layout/{navbar,user-nav,app-shell,mobile-sticky-bar}.tsx`, `src/lib/auth/client.tsx`.
- [ ] **PUB-13** Allow caching on static marketing pages in production (ISR/`revalidate`), keep `no-store` for authenticated/API. Verify it is dev-only first. Files: `next.config.mjs`, page-level `export const revalidate`.
- [ ] **CUS-01 / CUS-13** Document single-cookie behavior; super_admin visiting `/login` → `/admin`; confirm `/onboarding` redirect is intended (or remove route). Files: `src/lib/auth-redirects.ts`, `src/middleware.ts`, `src/app/onboarding/page.tsx`.
- [ ] **ADM-08** Leads: add status/detail only if in scope (default: leave read-only, note in tracker); fix `/api/admin/leads` 404 vs UI data source mismatch.
- [ ] **ADM-11** Content editor refreshes audit trail after save/publish; show actor. File: `src/app/admin/content/[id]/page.tsx`.
- [ ] Admin chrome: dedicated admin layout (no public navbar/footer, consistent light theme), skeleton loaders instead of blank "Loading…" shell, human-readable audit actions with pagination/filter, content list search/status filter, replace login "Loading…" flashes.
  Files: `src/app/admin/layout.tsx`, `src/components/layout/app-shell.tsx`, `src/app/admin/{audit-log,content,page}/page.tsx`, `src/app/loading.tsx`.

## Group G — Verification gaps (P1, run before and after fixes)
- [ ] Get a reliable viewport method (Chrome DevTools device emulation or Playwright) and test 375 / 768 / 1440 on every route.
- [ ] axe-core + keyboard-only pass on all routes; log findings and fix under Group D.
- [ ] Re-run full route sweep (public, customer, admin) in Chrome after Groups A–F; update `BUGS.md` statuses.
- [ ] Add regression tests under `tests/` for: no `passwordHash` in staff API, draft content not served, `/api/auth/me` logged-out status, duplicate-lead handling, content 400s.
- [ ] Update `docs/tracker.md` and clean up QA test data.

## Suggested order & commits
1. A (security) → commit per sub-bullet group: `fix(security): …`
2. B (state integrity) → `fix(subscription): …`
3. C (content truth) → `fix(content): …`
4. D (forms/a11y) → `fix(a11y): …`
5. E, F → `fix(pages): …`, `chore(meta): …`
6. G verification → `test: …`, tracker update

## Decisions recorded
- Box contents: **brochure is authoritative** (4 fruits, 2 veg, salad, sprouts daily; dry fruits 3 days/wk Standard, daily Premium). The 2026-11-04 "4-day box + 2-day oats" content was removed everywhere.
- Unconfirmed marketing/operational claims: **keep, do not remove** (user decision).

## Open questions for you
1. Unconfirmed operational facts: tag as placeholders (plan default) or remove entirely?
2. CUS-04 pause/rider notes and ADM-08 lead status actions: build backend (outside the Phase 1 scope boundary in CLAUDE.md) or disable with "coming soon"? Plan default: disable.
3. `/forgot-password`: stub-with-contact-info (default) or implement real reset?
4. Port 3000 is still held by a stale dev server from this repo; QA/re-tests will keep using 3001 unless you stop it.
