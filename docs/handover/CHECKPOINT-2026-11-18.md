# Checkpoint — QA fix & verification pass (2026-11-18)

**Read this first in a new session.** It records what has been done, how it was verified, the decisions made, how to run everything, and what is still open. Detailed per-bug status is in `BUGS.md`; the fix checklist is in `PLAN.md`.

## 1. Where the work lives
- Branch: **`fix/qa-bugs`** (7 commits ahead of `main`, **not pushed**, no PR yet). `main` is untouched (`3725027`).
- Commits, oldest first: `d9417c2` security/admin API hardening · `6a502af` dashboard subscription state + `/subscribe` · `7577598` brochure content + titles · `b9eb689` accessible forms, admin slug, audit refresh · `8150342` real 404 for content + live API results · `3af956f` review-step auto-submit fix, contrast, keyboard access · `6f0a1c5` remaining bugs, race-free registration, admin console polish, doc rewrite.
- Working tree was clean after the last commit apart from this checkpoint (committed with it).

## 2. What was done (by area)
**Security / admin API** — staff API no longer returns `passwordHash`/`clerkUserId` (explicit column select); drafts filtered in SQL; all `/api/admin/*` errors use `{success:false,error}` via `src/lib/api-response.ts` (`apiError`, `isUuid`); UUID / `templateId` / `roleId` / email / title validated (400 not 500); role-revoke miss -> 404.
**Subscription state (CLAUDE.md §6.3)** — `src/lib/use-subscriber-account.ts` maps the real status to `none | pending | active | paused | ended`. Dashboard overview / delivery / community show only what that state allows; invented times, menu, doctors, sessions, fake RSVP/forms were replaced by `PLACEHOLDER — CLIENT CONTENT REQUIRED` notes. Delivery pause / vacation / rider notes call the real `PATCH /api/customer/me`.
**Registration (`/subscribe`, `/api/subscriptions/lead`)** — no default plan; Review step is real and cannot be skipped (root cause of auto-submit: the Continue and Submit buttons are separate keyed elements — do not merge them back into one node); account email read-only and enforced server-side; phone prefilled; duplicate open registration -> **409** (`DuplicateLeadError`, statuses in `OPEN_SUBSCRIPTION_STATUSES`), serialised with a per-user `pg_advisory_xact_lock` so parallel submits create exactly one.
**Content truth** — box contents follow the **brochure** everywhere (source of truth: `OFFICIAL_PLANS` in `src/types/plans.ts` and the seed in `src/lib/lead-storage.ts`). The 4 Nov "4-day box + 2-day oats" plan was removed by owner decision.
**Pages / metadata** — `/terms`, `/privacy` (placeholder legal text), `/forgot-password` (contact details, not a reset flow); single title suffix, 404 title, per-page admin titles, OpenGraph baseline; root `loading.tsx` removed (moved to `components/layout/page-loading.tsx`, used by `admin/` and `dashboard/` only) so unknown/draft content returns a real HTTP 404.
**Accessibility** — error summaries / `aria-invalid` / `aria-describedby` on sign-up, sign-in, settings, `/subscribe`, admin slug; keyboard-focusable scroll regions on admin tables; skeletons use `role="status"`; contrast fixed (Tailwind `primary` `#1B7A3E`, WhatsApp green `#0E7A3E`, teal/emerald chips, muted text `#4F6458`, admin login). Sweep result: 0 axe WCAG 2.1 A/AA violations.
**Admin console** — dedicated layout (public navbar/footer hidden for `/admin`, View website / Customer dashboard / Sign out), readable + filterable + paginated audit log (`src/lib/audit-format.ts`, `src/lib/audit-log.ts`), content list search/status filter, content audit shows the actor, leads page links to Subscriptions.
**Auth / header** — `/api/auth/me` returns `hasOpenSubscription` (header-only hint, never authorization); "Subscribe Now" hidden for users with an open subscription; no logged-out header flash; signed-in staff visiting `/login`/`/register` go to `/admin`.

## 3. Verification that was actually run (2026-11-18)
- `npm run typecheck`, `npm run lint`, `npm test`: clean, **103 tests** pass.
- Live API against local Postgres (`scripts/qa/live-api-e2e.sh`): 26/26 incl. the 5-way race.
- Real browser (Claude Chrome extension): admin + customer journeys — register -> subscribe -> pending -> admin confirm in `/admin/subscriptions` -> active -> pause -> audit log; wrong-password, form-error, slug, CMS create/publish/unpublish, redirects, keyboard focus audit.
- Headless Chrome sweep (`scripts/qa/viewport-axe-sweep.mjs`): **81/81** route x viewport (375 / 768 / 1440) combinations — no horizontal overflow, no console errors, no axe violations.
- Not covered: screen readers; a production (`next build`) run beyond the existing smoke unit test; real payments (Razorpay) or WhatsApp delivery.

## 4. Decisions made (do not re-litigate without asking)
1. Brochure is authoritative for box contents (4 fruits, 2 veg, salad, sprouts daily; dry fruits 3 days/week Standard, daily Premium).
2. **Keep** the unconfirmed marketing/operational claims (7:30 AM delivery, closed Sundays, doctor-certified, Triple-Washed, "Most Popular"/"Client Favorite" badges, founder quote, free delivery, Free Lab Test). CLAUDE.md §2 says to tag them; the owner chose to keep them.
3. Unconfirmed operations that are not claims (delivery window, pause cutoff, community sessions) are `PLACEHOLDER — CLIENT CONTENT REQUIRED`.
4. `/api/auth/me` returns 200 + `authenticated:false` when logged out (session probe). `/onboarding` is only for accounts without a profile.
5. Leads page stays read-only; actions live in Subscriptions.

## 5. Open items (need owner decision or client content)
Real password reset · legal text for terms/privacy · contact street address/Maps location · delivery window / cutoff / sessions / pincode serviceability · local QA test data not deleted · CLAUDE.md §7 still says "Phase 1 scaffolding only" (it is out of date; the app has working auth, subscriptions, admin and CMS — confirm with the owner before editing CLAUDE.md) · decide whether to restore "Doctor-approved" etc. in the plan seed text (see BUGS.md OPEN #6).

## 6. Suggested next steps
1. Push `fix/qa-bugs` and open a PR into `main` (nothing has been pushed).
2. Run a production build (`npm run build`) and re-check caching headers (PUB-13).
3. Get client input for the open items; update the `PLACEHOLDER` copy.
4. Delete the local QA test data if wanted (accounts `ui.*`, `live.test.*`, `e2e.*`, `journey.tester.*`, `nosub.*`, their leads, draft CMS pages) — audit rows reference them, so delete in a transaction and expect FK handling.

## 7. How to run everything locally
```bash
docker compose up -d postgres              # Docker Desktop must be running; compose also defines an `app` service you do not need
npm run db:seed-admin                      # dev admin; credentials are in scripts/seed-dev-admin.ts
npx next dev -p 3001                       # a stale dev server may hold :3000; Tailwind config changes need a dev-server restart
npm run typecheck && npm run lint && npm test
export ADMIN_EMAIL=... ADMIN_PASSWORD=...  # see scripts/qa/README.md
bash scripts/qa/live-api-e2e.sh
```
`.env.local` holds `DATABASE_URL`, `SESSION_SECRET`, etc. (never commit it).

## 8. Gotchas learned
- Source files use **CRLF** line endings. Edits made by scripts must preserve them (normalise, edit, restore) or multi-line string replacements silently fail.
- Browser sessions have **one session cookie per browser**: signing in as admin replaces a customer session. Use separate contexts or log out between roles.
- The Claude Chrome extension reports a successful resize but the page viewport does not change; use `scripts/qa/viewport-axe-sweep.mjs` for 375/768 layouts.
- `npm install` of new packages can fail (network blocked in the agent sandbox); the sweep script is dependency-free for that reason.
- Dev server compiles routes on first hit — the first request to a page can take several seconds; wait before asserting on UI state.
- Programmatic `el.click()` reproduces browser activation behaviour (that is how the auto-submit bug showed up); prefer real clicks when testing forms.
- Test accounts created during QA are listed in section 6; their passwords are not stored in the repo.
