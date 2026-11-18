# BUGS.md — Humming Drops & MedCity Smiles QA (2026-11-17)

Environment: Next.js dev server `http://localhost:3001` (port 3000 held by a stale dev server), local Postgres `hummingdrops_dev`, `CHECKOUT_MODE=assisted_lead`. Auth is native session auth (Clerk was removed). Fix progress is tracked in the **Fix status** table below and in `PLAN.md`.

**Coverage limits (read first)**
- **Responsive 768 / 375 px was NOT verified.** `resize_window` did not change the viewport (stayed 1536 wide) and iframes are blocked by `X-Frame-Options`. Needs a manual or device-emulation pass.
- No axe-core run; keyboard focus and contrast were checked by eye only.
- "Screenshot ref" = viewport + page + state description. The Chrome extension did not save image files, so no image paths exist.
- The shared browser cookie jar was overwritten between agents (single session cookie per browser); agents worked around it via `127.0.0.1` / `qa-cust.localhost`.
- Test data left in DB: customer `qa.customer@example.com`, lead `HD-REG-2026-71182`, draft CMS page `qa-test-banner` (id 90ff5b35-78f8-4139-8f80-7c5d4a47864a), admin `admin@hummingdrops.dev`.

## Summary
| Severity | Count |
|---|---|
| Critical | 2 (ADM-01, CUS-02) |
| High | 6 (PUB-01, PUB-02, CUS-03, CUS-04, CUS-05, ADM-02) |
| Medium | 12 (PUB-03, PUB-04, PUB-06, CUS-07–10, ADM-03–07) |
| Low / Info | 16 (PUB-05, 07–13, CUS-01, 11–14, ADM-08–11) |

## Fix status (updated as work proceeds)
| ID | Status | Notes |
|---|---|---|
| ADM-01 | Fixed in code, independently reviewed (static) | Explicit safe columns in `src/lib/staff-admin.ts`; regression test added. Live API check pending (DB down). |
| ADM-02 | Fixed in code, live check pending | Draft filter moved into SQL (`getPublishedPageBySlug`). Could not reproduce the RSC payload leak without DB; re-check live. |
| ADM-03 | Not fixed (framework limit) | Root `src/app/loading.tsx` streams a 200 before `notFound()`; real 404 needs removing/scoping that loader (Group F). |
| ADM-05 / 06 / 09 | Fixed in code, live check pending | UUID/`templateId` validation -> 400; unified `{success:false,error}` envelope via `src/lib/api-response.ts`; bad subscription id -> 400 JSON. |
| Verifier follow-ups | Fixed in code | Verifier agent #2 passed Group A and flagged same-class gaps: UUID checks on role-revoke, customer-health and staff POST `roleId`; non-string `email`/`title` no longer 500; role-revoke returns 404 JSON; unified envelope applied to all `/api/admin/*` routes. `/api/customer/*` envelope left as is. |
| ADM-07 | Not reproducible by code review | Middleware redirects customers and `AdminLayout` renders sign-in portal (never children) for non-staff. Confirm live. |
| CUS-14 | Resolved by decision | `authenticated:false` with 200 is the documented session-probe contract; commented in code. |
| Dev admin hint | Fixed | Shown only when `NODE_ENV === "development"`; placeholder made generic. |
| CUS-02 | Fixed in code | `useSubscriberAccount` hook derives none / pending / active / paused / ended from the real status; overview shows the right card per state and only shows delivery/box content when `confirmed_active`. |
| CUS-03 / CUS-05 | Fixed in code | Overview, delivery and community: invented times, cutoff, menu names, named doctors, Zoom sessions, pre-set RSVP, past-dated sessions and the fake "Ask a doctor" form removed; PLACEHOLDER notes + real WhatsApp links instead. |
| PUB-03 | Fixed in code | `/forgot-password` now shows email / WhatsApp / phone contact (no disabled input). Real reset flow still needs your decision. |
| PUB-04 | Fixed in code | New `/terms` and `/privacy` pages with PLACEHOLDER legal text; register + footer link to them. Legal wording is CLIENT CONTENT REQUIRED. |
| CUS-04 | Fixed in code | Pause / vacation / rider notes now await the real `PATCH /api/customer/me`, show server errors, are disabled unless active; empty note rejected. |
| CUS-07 / 08 / PUB-06 | Fixed in code | Enter key can no longer submit before Review; no default plan; phone prefilled from profile; account email read-only; submit error is `role=alert` and scrolled into view. |
| CUS-09 | Fixed in code, live check pending | `DuplicateLeadError` in the Postgres repo -> API returns 409 with existing reference. No DB unique index yet (small race window). |
| PUB-07 | Fixed in code | Any valid 6-digit pincode accepted; "Bangalore" removed from review/confirmation copy (serviceability confirmed by team). Server still stores city "Bangalore". |
| PUB-08 (subscribe) / PUB-09 / PUB-02 (subscribe) | Fixed in code | Rs 3,500 formatting, "Mode B" wording, "Client Favorite", free-delivery row, "closed Sundays", "Bangalore delivery policy" removed from `/subscribe`. |
| PUB-01 / CUS-06 | Fixed in code | Plan data (`src/types/plans.ts`, `lead-storage` canonical plans) and all pages now use brochure contents; oats / 4-day / 5 fruits / 3 veg removed from home, plans, subscribe, footer, metadata. Premium card on `/plans` lists only extras. Test updated. |
| PUB-02 | Left as-is by decision | User chose to keep unconfirmed marketing/operational claims. Items previously removed on `/subscribe` were restored. |
| PUB-10 / ADM-10 | Fixed in code | Removed duplicate "| Humming Drops" suffixes (contact, subscribe, CMS pages); 404 title "Page not found"; every admin page has its own title; root OpenGraph/Twitter baseline for inner pages. Visual title check pending (needs running app). |
| All others | Not started | Groups D-G in `PLAN.md` (D = form a11y, F = metadata/layout, G = viewport/axe/live tests). |

## Bugs

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
- **PUB-11 / CUS-11** `/register`, `/login`: two stacked headers/logos; "Back to Home" duplicates nav. Settings copy "Email (managed by sign-in provider)" is leftover Clerk-era text.
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
