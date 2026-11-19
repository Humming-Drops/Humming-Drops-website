# BUGS.md — Humming Drops & MedCity Smiles QA

Original QA run: 2026-11-17. Fix + verification pass: 2026-11-18 on branch `fix/qa-bugs`.
**Session handover: `docs/handover/CHECKPOINT-2026-11-18.md` (read first).** Fix plan and checklist: `PLAN.md`. Re-runnable checks: `scripts/qa/`. Original bug descriptions are kept at the bottom of this file.

**How things were verified (2026-11-18):** unit tests (103 pass), `tsc`, lint; live API checks with `curl` against the real Postgres database (including a 5-way parallel race test); real clicks and typing through the Claude Chrome extension; and a headless-Chrome sweep of 81 page x viewport combinations (public, customer and admin pages at true 375 / 768 / 1440 px widths) checking horizontal overflow, console errors and axe-core WCAG 2.1 A/AA violations — final result 81/81 clean. The Chrome extension cannot resize the browser viewport, so layouts were checked with headless Chrome driven over the DevTools protocol.

**Legend:** VERIFIED = fixed and confirmed live (API and/or browser). CODE = fixed and covered by unit tests / review but not separately exercised live. DECISION = intentionally not changed. OPEN = not fixed.

## Status of every bug from the original QA report

| ID | Sev | Status | What was done / how it was checked |
|---|---|---|---|
| ADM-01 | Critical | VERIFIED | Staff API selects explicit safe columns; live: no `passwordHash` / `clerkUserId`. Regression test. |
| CUS-02 | Critical | VERIFIED | Dashboard derives none / pending / active / paused / ended from the real status. Browser: none, pending and active each correct; no fake "Active", timeline or times. Unit test for the mapping. |
| PUB-01 | High | VERIFIED | Brochure box contents everywhere (home, plans, subscribe, register, dashboard, seed data); oats / 4-day / 5-fruit content removed. Premium card lists only extras. |
| PUB-02 | High | DECISION | You said keep the unconfirmed marketing claims (7:30 AM, closed Sundays, doctor-certified, Triple-Washed, badges, founder quote, free delivery). Left as-is; four I had removed on `/subscribe` were restored. |
| CUS-03 | High | VERIFIED | Invented times, menu, doctors, Zoom sessions, RSVP and "Submit to Medical Board" removed; PLACEHOLDER notes instead (overview, delivery, community). |
| CUS-04 | High | VERIFIED | Pause / vacation / rider notes call the real API, show errors, are disabled unless active; persisted across reload in the browser. Quick-pause no longer overwrites a vacation range. |
| CUS-05 | High | VERIFIED | Past-dated sessions, pre-set RSVP and fake question form removed. |
| ADM-02 | High | VERIFIED | Draft filter is in the SQL query; anonymous page shows no draft title / template / id. |
| PUB-03 | Med | CODE | `/forgot-password` shows email / WhatsApp / phone instead of a disabled field. A real reset flow needs your decision (see Open). |
| PUB-04 | Med | VERIFIED | `/terms` and `/privacy` exist with PLACEHOLDER legal text; register + footer link to them. Real legal wording is client content. |
| PUB-06 | Med | VERIFIED | Account email is read-only on `/subscribe`, server rejects a mismatch (400), submit error is an alert scrolled into view. |
| CUS-07 | Med | VERIFIED | Root cause found in the browser: the Continue button turned into the submit button during the click and submitted the form. Fixed with keyed buttons + guard; Review step now shows without submitting. |
| CUS-08 | Med | VERIFIED | No default plan; Continue without a plan shows an error; saved phone prefilled (leading-0 numbers accepted). |
| CUS-09 | Med | VERIFIED | Duplicate registration -> 409 with existing reference (also while active). Race closed with a per-user database lock: 5 simultaneous submits -> exactly 1 created. Re-registering after cancel works. |
| CUS-10 | Med | VERIFIED | Settings error is `role=alert`, linked to name / phone with `aria-invalid` / `aria-describedby`. |
| ADM-03 | Med | VERIFIED | Unknown and draft `/content/<slug>` return HTTP 404 (loader moved off the root so `notFound()` sets the status). |
| ADM-04 | Med | VERIFIED | Admin slug: auto-slugify, client validation, focus + linked inline error, alert scrolled into view. |
| ADM-05 | Med | VERIFIED | Bad content id -> 400 JSON (was 500). |
| ADM-06 | Med | VERIFIED | Bad `templateId` -> 400 (was 500). |
| ADM-07 | Med | VERIFIED | Customer opening `/admin` or `/admin/staff` is redirected server-side; admin shell never rendered. APIs 403. |
| PUB-05 | Low | VERIFIED | Sign-up shows all errors at once with a linked summary; sign-in error linked to both inputs; focus moves to first invalid field. |
| PUB-07 | Low | CODE | Any valid 6-digit pincode accepted; "Bangalore" removed from review/confirmation copy. Server still stores city "Bangalore". |
| PUB-08 | Low | VERIFIED | Prices shown as Rs 3,500 / 4,000 everywhere. |
| PUB-09 | Low | VERIFIED | "Mode B" wording removed. |
| PUB-10 | Low | VERIFIED | Single title suffix, 404 title, per-page admin titles, OpenGraph baseline. |
| PUB-11 | Low | VERIFIED | Duplicate header bar removed from `/login` and `/register`. |
| PUB-12 | Low | PARTLY | Contact phone is +91 8618902810 everywhere and the footer `tel:` link matches. Street address / Maps source is still unknown (client input); no contact form. |
| PUB-13 | Low | NOT A BUG | Config does not force `no-store`; Next dev mode does. Re-check on a production build. |
| CUS-01 | Low | VERIFIED | Staff visiting `/login` or `/register` while signed in are sent to `/admin`; customers to the dashboard. |
| CUS-06 | Low | VERIFIED | Unconfirmed diet styles are labelled as preferences needing team confirmation. |
| CUS-11 | Low | VERIFIED | "managed by sign-in provider" removed; email field labelled. |
| CUS-12 | Low | VERIFIED | "Subscribe Now" hidden for signed-in users with a pending / active / paused subscription, shown otherwise; no logged-out header flash while the session loads. |
| CUS-13 | Low | DECISION | `/onboarding` is only for accounts with no profile; documented in code. |
| CUS-14 | Low | DECISION | `/api/auth/me` returns 200 with `authenticated:false` on purpose (session probe). |
| ADM-08 | Low | CODE | Leads page stays read-only by design and now links to Subscriptions where confirm / pause / cancel exist. |
| ADM-09 | Low | VERIFIED | All `/api/admin/*` routes use `{success:false,error}`; bad subscription id -> 400, unknown -> 404. |
| ADM-10 | Low | VERIFIED | Per-page admin titles. |
| ADM-11 | Low | VERIFIED | Audit trail refreshes after save / publish without reload and now shows who made each change. |

## Bugs found during the 2026-11-18 testing (not in the original report) — all fixed

| # | Bug | Found by | Fix | Verified |
|---|---|---|---|---|
| N1 | `/subscribe` submitted the form on the click that opened the Review step | Real mouse clicks in Chrome | Distinct React keys for Continue / Submit + guard | Browser |
| N2 | Colour-contrast failures (home, plans, contact, MedCity, subscribe stepper, admin login) | axe in Chrome | Darker primary token, WhatsApp green, teal / emerald chips, muted grey-green text, stepper labels, admin login button | Sweep |
| N3 | Admin tables scrollable but not keyboard-focusable | axe | `tabIndex=0` focusable regions with labels | Sweep |
| N4 | `/subscribe` field errors had no `aria-invalid` / `aria-describedby` | Browser DOM inspection | ARIA wiring on all fields | Browser |
| N5 | Developer jargon on admin pages (RR-006, "file-backed", "Legacy role", "RBAC grants"); payments shown in paise | Browser | Rewritten; amounts in rupees | Browser |
| N6 | Non-subscribers saw a "Next delivery day" card with a date | Browser | Card hidden unless active | Browser |
| N7 | Footer phone link lacked +91 | DOM check | `tel:+91...` | DOM |
| N8 | Sign-up rejected leading-0 phone numbers the server accepts | Verifier review | Reuse server phone validation | Browser |
| N9 | Loading skeletons used `aria-label` on a plain div (axe: aria-prohibited-attr) | Final sweep | `role="status"` on all 6 skeletons | Sweep |
| N10 | Admin console showed the public navbar and footer | Browser | Dedicated admin layout with View website / Customer dashboard / Sign out | Browser |
| N11 | Audit log: raw action codes, no filter, no paging, customer health reads drowned everything | Browser | Readable names, resource links, kind filter, pagination | Browser + API |
| N12 | Content list had no search or status filter | Browser | Search + status filter (garbage params handled) | Browser + API |
| N13 | Duplicate-registration check could race (two parallel submits both passed) | Reasoning, then test | Advisory lock per user inside the transaction | 5-way parallel test |

## OPEN — not fixed (needs a decision or client content)

1. **Real password reset** (PUB-03): needs an email / SMS provider and your go-ahead. Until then the page shows contact details.
2. **Real legal text** for `/terms` and `/privacy` (PUB-04): client / legal wording required, especially for health data.
3. **Contact street address / Maps location** (PUB-12): not in the brochure.
4. **Delivery window, pause cutoff, community sessions, serviceability by pincode**: shown as `PLACEHOLDER — CLIENT CONTENT REQUIRED`.
5. **Unconfirmed marketing claims** kept by your decision (PUB-02). Note CLAUDE.md says to tag unconfirmed claims; you chose to keep them.
6. **Database seed text** in `lead-storage.ts` (the plan rows) was rewritten to brochure wording and dropped "Doctor-approved" and two invented feature lines — say if you want them back.
7. **No screen-reader testing** was done; keyboard focus indicators were checked on login, home, plans, register, contact, dashboard delivery / settings, subscribe and admin leads.
8. **Test data** left in the local dev database (accounts `ui.*`, `live.test.*`, `e2e.*`, `journey.tester.*`, `nosub.*`, leads and a draft CMS page) plus the earlier QA data. Safe to delete; not deleted because audit records reference them.
9. **Stale docs**: `docs/tracker.md` still describes the old oats plan in an older entry (superseded note added).

---

# Original QA report (2026-11-17), for reference

## Original bug descriptions

### Critical
**ADM-01 — Password hashes exposed by staff API** · `GET /api/admin/staff` (admin session)
Steps: log in as admin, fetch `/api/admin/staff`. Actual: each entry contains the full user row incl. `passwordHash`, legacy `clerkUserId`, phone; user object duplicated at top level. Expected: no credential material. Screenshot: n/a (JSON).

**CUS-02 — Customer sees "Active" subscription with no / pending subscription** · `/dashboard/overview`
Steps: log in as customer with no subscription (`/api/customer/me` → `subscriptions: []`), open overview; then submit a `/subscribe` lead (pending_confirmation) and reopen. Actual: badge "Active Morning Subscription", live dispatch timeline ("Out for Delivery", "7:15 AM ETA"), Premium perk "Dry fruits (daily)". Settings page correctly shows Pending, so pages disagree. Violates registration_submitted → pending_confirmation → active rule. Screenshot: 1536px overview top fold.

### High
**PUB-01 — Plan contents contradict brochure and each other** · `/`, `/plans`, `/subscribe`, `/register`, `/login`, dashboard
Public pages: "5 fruits, 3 veg, box 4 days/week + oats 2 days/week, closed Sundays". Register/login/dashboard: "4 fruits + 2 veg + salad + sprouts, dry fruits 3x/wk, Premium daily". Brochure: 4 fruits, 2 veg, salad, sprouts daily. Fresh Mix Salad absent from `/plans`; Premium card re-lists all Standard items. Screenshot: 1536px `/` hero chips; `/plans` both cards. (Also reported as CUS-06 on `/subscribe`, incl. Vegan/Fruit-Focused customization styles that are unconfirmed.)

**PUB-02 — Unconfirmed claims shown as firm commitments** · `/`, `/contact`, `/plans`, `/subscribe`, dashboard
"Doorstep delivery by 7:30 AM", "closed every Sunday", "doctor-certified", "Triple-Washed", "Zero Long Cold Storage", "Free Lab Test", "Pause or cancel anytime", "Delivery fee FREE", "Most Popular / Recommended / Client Favorite" badges, pull quote attributed to "Founding Team", "per our Bangalore delivery policy". Not in brochure; CLAUDE.md requires TBD / CLIENT INPUT REQUIRED. Screenshot: 1536px `/` hero + pricing; `/subscribe` step 5.

**CUS-03 — Fabricated operational data in dashboard** · `/dashboard/overview`, `/delivery`, `/community`
Invented times (5:00 AM cut, 7:00–7:30 window, 8:00 PM cutoff), invented menu (almonds, walnuts, etc.), named people ("Dr. Arvind Rao", "Kavita Sundaram") with Zoom sessions, pre-set "RSVP Confirmed", "Submit to Medical Board". Expected PLACEHOLDER labels. Screenshot: 1536px each page.

**CUS-04 — Delivery pause / rider notes fake success** · `/dashboard/delivery`
Click "Pause Tomorrow's Delivery" → UI flips to Paused, no API request, reload reverts. "Update Rider Notes" with empty textarea shows success, no request. Also shows "Active" for users with no/pending subscription.

**CUS-05 — Past sessions shown as upcoming** · `/dashboard/community`
Sessions dated 7 and 11 Nov 2026 listed as upcoming (today 17 Nov). RSVP / Medical Board / WhatsApp button behaviour not exercised.

**ADM-02 — Draft CMS content leaked to anonymous users** · `/content/<slug>`
Steps: create draft `qa-test-banner`; anonymous GET `/content/qa-test-banner` (also after unpublish). Page renders "Page not found" but RSC payload contains id, template id, slug, title, status, field values, creator UUID.

### Medium
- **PUB-03** `/forgot-password`: email input permanently disabled; button just links to `/login`. No recovery path or contact instruction.
- **PUB-04** `/register`: "Terms of Service" links to `/about`; `/terms`, `/privacy`, `/faq` are 404. Health-program consent has no terms/privacy content.
- **PUB-06** `/subscribe` step 2→5: email field editable but server rejects non-account email (400 on `POST /api/subscriptions/lead`) only at final submit; error renders off-screen.
- **CUS-07** `/subscribe`: stepper shows "5 Review" but submit skips it and creates the lead directly.
- **CUS-08** `/subscribe`: Premium pre-selected, Continue works without choosing; saved phone not prefilled.
- **CUS-09** `/subscribe`: duplicate-lead handling for a user with an existing pending registration not tested — needs follow-up.
- **CUS-10** `/dashboard/settings`: phone error lacks `aria-invalid` / `aria-describedby` / `role=alert`.
- **ADM-03** `/content/<unknown>` returns HTTP 200 (soft 404).
- **ADM-04** `/admin/content/new`: invalid slug → 400, error rendered above slug field off-screen; no focus move, no aria-live, no client validation; helper echoes "/content/bad slug!".
- **ADM-05** `GET /api/admin/content/not-a-uuid` → 500 empty body; UI shows only "Failed to load page."
- **ADM-06** `POST /api/admin/content` with bad `templateId` → 500 instead of 400/422.
- **ADM-07** (unconfirmed) `/admin` rendered the admin shell briefly for a customer session; gating looks client-side ("Loading fresh wellness content…"). APIs correctly 403. Needs confirmation.

### Low / Info
- **PUB-05** Register/login: only one error shown at a time in a banner; no `aria-invalid` / `aria-describedby` (CLAUDE.md §6.7).
- **PUB-07** `/subscribe`: Delhi pincode 110001 accepted; city hard-wired "Bangalore" (corridors unconfirmed → should be TBD/warn).
- **PUB-08** `/subscribe`: prices "₹3500" not "₹3,500"; badge wording differs per page.
- **PUB-09** `/subscribe` step 5: customer-facing "Assisted Doorstep Registration (Mode B)"; "Loading…" label flash.
- **PUB-10 / ADM-10** Duplicate title suffix ("… | Humming Drops | Humming Drops"); 404 uses home title; all `/admin/*` pages share the generic home title; OG tags only on home.
- **PUB-11 / CUS-11** `/register`, `/login`: two stacked headers/logos; "Back to Home" duplicates nav. Clerk has since been removed entirely (migration 0007).
- **PUB-12** `/contact`: phone formatted "8618902810" vs "+91 8618902810"; no contact form; Maps link is a search with no address.
- **PUB-13** Public pages served `Cache-Control: no-store` (confirm dev-only).
- **CUS-01** Single session cookie per browser; super_admin visiting `/login` is sent to the customer dashboard (no admin-aware experience).
- **CUS-12** Header: "Subscribe Now" stays prominent for logged-in users; logged-out header flashes during load.
- **CUS-13** `/onboarding` redirects customers to `/dashboard/overview` (confirm intentional).
- **CUS-14** `/api/auth/me` returns 200 when logged out while other customer APIs return 401 — verify body.
- **ADM-08** `/admin/leads` read-only (no status action, detail, filter); `/api/admin/leads` is 404. Missing capability unless spec requires it.
- **ADM-09** Inconsistent admin API error envelopes (`{success,error}` vs `{error}`); bad subscription id → 405 empty body.
- **ADM-11** Content editor audit trail does not refresh after save/publish until reload; no actor shown.

## Verified OK
- Auth redirects: `/dashboard*`, `/onboarding` → `/login?redirect_url=…`; `/admin*` → `/admin/login`; `/subscribe` → `/register`; admin APIs 401 logged out, 403 for customer; customer blocked from `/admin`.
- Login/logout, wrong-password and empty-field handling (customer and admin); `/api/customer/me|health` 401 after logout.
- Prices ₹3,500 / ₹4,000, phone 8618902810, email, tel/WhatsApp/mailto links match brochure. Branded 404. One h1 per page, image alts, `lang=en`.
- Assisted-lead flow end to end: lead created `pending_confirmation`, "Not yet active / No payment charged" confirmation, settings shows Pending.
- Health page honest empty state. CMS create/edit/publish/unpublish with audit entries; `javascript:` CTA rejected; HTML escaped.
- No console errors or failed requests on pages visited (apart from the PUB-06 400).

## UI/UX Improvements
**Design consistency**
- One "popular plan" badge style/label; currency helper everywhere.
- Dedicated admin chrome instead of public navbar/footer around the console; admin login is dark while console is light.
- Remove duplicated header/logo on auth pages.
- Premium card should list only deltas under "Everything in Standard plus".

**Accessibility**
- Inline per-field errors with `aria-invalid`, `aria-describedby`, `role=alert`; focus first invalid field (register, login, subscribe, settings, admin slug).
- Run axe-core and a keyboard-only pass; verify focus rings and contrast (not done here).
- Skeleton loaders instead of blank "Loading fresh wellness content…" pages; server-side auth redirects to avoid header/admin-shell flashes.

**Performance**
- Enable static/ISR caching for marketing pages in production (currently `no-store`).
- Add OG/Twitter metadata to inner pages; fix title template.

**Copy / content**
- Single source of truth for box contents, delivery days, perks; render on `/`, `/plans`, `/subscribe`, `/register`, `/login`, dashboard.
- Replace unconfirmed claims with `CLIENT INPUT REQUIRED` / `PLACEHOLDER — CLIENT CONTENT REQUIRED` (delivery window, cutoff, doctors, sessions, menu, badges).
- Dashboard should branch on subscription status: none → CTA to `/subscribe`; pending → pending card with lead code + WhatsApp 8618902810; active → timeline. Disable pause/rider controls until active.
- Real Terms/Privacy pages (health-data consent); working or hidden password reset; contact-form or response hours TBD.
- Remove dev hints: "Default Admin: admin@hummingdrops.dev" on admin login, "RR-006 file-backed" copy on payments, "Legacy role" / "PostgreSQL RBAC grants" jargon, "Mode B" wording, "Pending reference" label.
- Admin: human-readable audit actions with resource links, pagination/filter (customer `health.self_access_read` events dominate), failed logins not audited; content list search/status filter; slugify from title.
