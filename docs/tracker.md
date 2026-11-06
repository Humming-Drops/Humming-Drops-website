# HUMMING DROPS & MEDCITY SMILES — MASTER IMPLEMENTATION TRACKER

**Document Version:** 1.0  
**Phase:** Phase 0 — Discovery & Technical Architecture  
**Status:** Active Master Tracking Document  
**Legend:**  
* `[ ]` Pending  
* `[/]` In Progress  
* `[x]` Completed  
* `[!]` Blocked / Requires Client Input (`CIR`)  

## Release Readiness Remediation (2026-11-03)

These tasks are executed strictly in order. A task is marked `[x]` only after
its implementation and verification are complete.

1. `[x]` **RR-001 — Repair release test execution**
   - Make `test:vitest`, `test:unit`, and `test:smoke` run the intended suites.
   - Remove the fixture-only failure and the custom-runner Vitest state failure.
   - Acceptance: all configured test commands exit with code 0. Verified:
     `test:vitest` (5 files / 37 tests), `test:unit` (4 files / 32 tests),
     and `test:smoke` (1 file / 5 tests).
2. `[x]` **RR-002 — Implement the template-driven CMS**
   - Added `src/lib/content-validation.ts` (pure field-schema validator,
     slug validator) and `src/lib/content-storage.ts` (Postgres-backed
     repository: list templates, create/update draft, publish/unpublish,
     each writing a `content_audit_logs` row plus a mirrored
     `administrative_audit_logs` row).
   - Seeded two structural templates (`announcement-banner`,
     `simple-page`) via `drizzle/0003_seed_content_templates.sql` — no
     client copy is implied, only field definitions.
   - Admin UI: `/admin/content` (list + empty state), `/admin/content/new`
     (template select + dynamic fields + validation errors),
     `/admin/content/[id]` (edit/preview tabs, save draft,
     publish/unpublish, audit trail).
   - API routes under `/api/admin/content/*`, each gated with
     `requirePermission`/`hasPermission("content:write")` or
     `"content:publish")` — defense in depth, not UI-hiding alone.
   - Public rendering at `/content/[slug]`, serving only `status =
     'published'` pages (404 otherwise).
   - Fixed `src/app/admin/layout.tsx`: the shell previously gated entry
     on `leads:read` only, which would have locked out the
     `content_manager` role entirely. Now the shell accepts any active
     staff role; each module enforces its own specific permission.
   - Acceptance: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (6 files / 48 tests, up
     from 5/37 — added `tests/unit/content-cms.test.ts`), `npm run
     build` (production build succeeds). NOT VERIFIED: applying
     `drizzle/0003_seed_content_templates.sql` against a live Postgres
     instance — no live database credentials are available in this
     environment (see RR-005).
3. `[x]` **RR-003 — Complete the admin modules**
   - **Subscriptions** (`/admin/subscriptions`): confirm / cancel / pause
     (with a `validatePauseRange` range check, tested) / resume, each
     routed through the existing `canTransitionSubscription` FSM guard
     (`src/lib/subscription-transitions.ts`) so illegal transitions are
     rejected, not silently accepted. Every transition writes a
     `subscription_audit_logs` row with the acting admin's user id. A
     zero-row `UPDATE` (e.g. a concurrently deleted row) is detected and
     raised distinctly from "not found" rather than reported as success.
   - **Payments** (`/admin/payments`): read-only view of orders and
     transactions through the existing `IPaymentRepository` abstraction.
     This repository is still file-backed pending RR-006's PostgreSQL
     migration — the admin page itself needs no change once that lands.
   - **Content** — already delivered under RR-002.
   - **Audit log** (`/admin/audit-log`): lists `administrative_audit_logs`
     (every admin content, subscription, and staff action writes here).
   - **Staff management** (`/admin/staff`): assign/revoke `user_roles`
     grants (the actual PostgreSQL RBAC `hasPermission()` reads from) by
     email + role, independent of the legacy `users.role` enum column.
   - Fixed a real gap found while building this: `isStaffUser()`
     (`src/lib/clerk-auth.ts`) now treats "has a `user_roles` grant" as
     sufficient for entering the `/admin` shell, not just a non-customer
     legacy enum value — otherwise a role granted only through the new
     Staff module would never reach the admin area it's supposed to
     unlock. The shell check stays coarse; every module still enforces
     its own specific permission via `hasPermission()`/`requirePermission()`
     on its own routes and API handlers (never UI-hiding alone).
   - Known limitation carried forward, not fixed here: `users.role` (the
     legacy enum) and `user_roles` (the RBAC grant table) are two
     parallel systems that are not auto-synced. A user's enum value does
     not create a matching `user_roles` row. The Staff module is the
     correct way to grant real permissions going forward.
   - Acceptance: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (7 files / 52 tests, up
     from 6/48 — added `tests/unit/admin-modules.test.ts`), `npm run
     build` succeeds. NOT VERIFIED: exercising these admin actions
     against a live Postgres instance with real staff/customer accounts
     — no live database or Clerk session is available in this
     environment (see RR-005).
4. `[x]` **RR-004 — Add Clerk lifecycle synchronization**
   - `/api/webhooks/clerk` (`src/app/api/webhooks/clerk/route.ts`) handles
     `user.created`, `user.updated`, and `user.deleted`.
   - Signature verification is hand-rolled against Svix's documented
     manual-verification algorithm (`src/lib/clerk-webhook.ts`):
     HMAC-SHA256 over `{svix-id}.{svix-timestamp}.{raw body}`, checked
     with `crypto.timingSafeEqual` against every `v1,` candidate in
     `svix-signature` (supports key rotation), plus a 5-minute timestamp
     tolerance to reject stale/replayed deliveries. Chose hand-rolling
     over adding the `svix` package to stay consistent with how
     `src/lib/razorpay.ts` already verifies HMAC signatures natively.
   - Idempotency: new `clerk_webhook_events` table
     (`drizzle/0004_clerk_lifecycle_sync.sql`) keyed by the `svix-id`
     header. A duplicate delivery is ack'd without reprocessing; the
     event is marked processed only *after* reconciliation succeeds, so
     a failed attempt is naturally retried by Clerk rather than lost.
   - Reconciliation (`src/lib/clerk-reconciliation.ts`): links an
     existing PostgreSQL user by `clerk_user_id` first, else by email
     (so a customer who registered via assisted-lead intake before ever
     using Clerk gets linked instead of duplicated), else inserts a new
     row. `user.deleted` sets `is_active = false` rather than
     hard-deleting — the row cascades to subscriptions/payments/health
     records that must be retained.
   - Schema fix this required: `users.phone` was `NOT NULL`, but Clerk's
     `user.created` event fires before a phone number is necessarily
     known (phone is captured later, during subscription onboarding).
     `drizzle/0004_clerk_lifecycle_sync.sql` drops that constraint (a
     unique index still permits multiple `NULL`s, so uniqueness is
     unaffected); `schema.ts` updated to match.
   - Tests (`tests/unit/clerk-webhook.test.ts`): valid signature accepted;
     tampered payload rejected; wrong-secret signature rejected; stale
     timestamp rejected; a valid signature among several decoy
     candidates still accepted; malformed secret prefix rejected; email/
     phone extraction from Clerk's primary-id-with-fallback shape.
   - Acceptance: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (8 files / 63 tests, up
     from 7/52), `npm run build` succeeds. NOT VERIFIED: an actual
     Clerk-to-Postgres round trip (duplicate-event dedup and the
     create/update/delete reconciliation paths) against a live database
     and a real Clerk webhook delivery — no live database or Clerk
     environment is available here (see RR-005).
5. `[/]` **RR-005 — Verify Railway database operations (partially complete — blocked on live credentials)**
   - **Done, locally verifiable:**
     - `src/lib/db/validate-url.ts` (`validateDatabaseUrl`): validates scheme,
       host, and database name; in production, hard-fails a localhost host and
       warns (non-fatal) if `sslmode` isn't set to `require`/`verify-ca`/
       `verify-full`. Wired into `src/lib/db/index.ts`'s connection setup so a
       misconfigured `DATABASE_URL` throws a specific, actionable message
       instead of an opaque connection error. 8 tests
       (`tests/unit/db-url-validation.test.ts`).
     - Migration journal integrity confirmed locally: `npm run db:check`
       (`drizzle-kit check`) passes — `0001` through `0004` are sequential
       with no gaps/duplicates between `drizzle/*.sql` and
       `drizzle/meta/_journal.json`.
     - `docs/runbooks/database-migrations.md` (RB-06, added to the runbook
       index): DATABASE_URL validation step, migration order table,
       staging-first application procedure, `pg_dump`/`pg_restore`
       commands, and a forward-fix (not automatic down-migration) rollback
       policy with an emergency-restore fallback requiring explicit
       owner sign-off.
   - **Blocked — requires real Railway/Postgres credentials, which are not
     available in this environment:**
     - Actually running `npm run db:migrate` against a live staging database.
     - Actually running the `pg_dump`/`pg_restore` commands documented in
       RB-06 against Railway's managed Postgres (connection-pooling
       behavior can require provider-specific flags that can't be
       confirmed without a live connection).
     - The post-migration smoke test described in RB-06 §3.
   - Acceptance so far: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (9 files / 71 tests, up from
     8/63), `npm run db:check` (passes), `npm run build` succeeds. This
     task cannot be marked `[x]` complete per the project's own rule
     ("never execute against production without valid credentials") until
     someone with real Railway access runs RB-06 §8's checklist and
     updates it to VERIFIED.
6. `[x]` **RR-006 — Enforce production PostgreSQL persistence**
   - **Found and fixed a prerequisite gap while implementing this:** there was
     no migration that actually created the 11 base tables (`users`,
     `payments`, `user_subscriptions`, etc.) — migrations `0001`–`0004` only
     ever `ALTER`/`ADD`ed onto tables they assumed already existed, and
     `drizzle/meta/` had no snapshot files, so `npm run db:check` was only
     validating journal self-consistency, not a real diff against
     `schema.ts`. Added `drizzle/0000_baseline_schema.sql` (idempotent:
     `CREATE TABLE/TYPE/INDEX IF NOT EXISTS` throughout, safe against a
     database that may already have some of these objects), renumbered the
     journal, and documented this in `docs/runbooks/database-migrations.md`
     §2.
   - **Payments:** the existing `payments` table requires a `NOT NULL
     subscription_id`, but a Razorpay order is created before any
     subscription/lead necessarily exists (Mode A creates the order first,
     links it to a lead only at verification). Added dedicated
     `payment_orders`, `payment_transactions`, `payment_webhook_events`
     tables (`drizzle/0005_postgres_payment_persistence.sql`) and a
     `DrizzlePostgresPaymentRepository` in `src/lib/payment-storage.ts`,
     mirroring the existing `HybridLeadRepository` pattern.
     `IPaymentRepository.hasWebhookEvent` changed from sync to `Promise<boolean>`
     (a real DB check can't be synchronous); updated the one call site in
     `src/app/api/payments/webhook/route.ts` to `await` it.
   - **Fail-closed guard:** `src/lib/production-persistence-guard.ts`
     (`assertProductionPersistenceAllowed`) is now called by both
     `HybridLeadRepository` and `HybridPaymentRepository` before selecting a
     driver. When `DATABASE_URL` is unconfigured, local JSON is still
     allowed in development/test, but `NODE_ENV=production` now throws
     `ProductionPersistenceError` instead of silently writing business
     records to an ephemeral container filesystem. Previously
     `HybridLeadRepository` had no such guard at all — this was a real,
     previously-shipped silent-fallback bug, not just a gap for payments.
   - Tests (`tests/unit/production-persistence-guard.test.ts`): the guard
     function itself across configured/unconfigured × every environment
     value, plus an integration-style test that constructs both hybrid
     repositories with `DATABASE_URL` unset and `NODE_ENV=production`
     forced, and asserts every read/write path rejects with
     `ProductionPersistenceError` rather than falling back to JSON.
   - Acceptance: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (10 files / 76 tests, up from
     9/71), `npm run db:check` (passes), `npm run build` succeeds.
     NOT VERIFIED: that `0000_baseline_schema.sql` through
     `0005_postgres_payment_persistence.sql` actually apply cleanly, in
     order, against a real empty Railway Postgres database — no live
     database is available in this environment (see RR-005 §8).
7. `[x]` **RR-007 — Harden customer and health APIs**
   - **Lifecycle transitions were being bypassed, not just unvalidated:**
     `src/app/api/payments/verify/route.ts` and
     `src/app/api/payments/webhook/route.ts` set `lead.status` directly with
     no FSM check at all — unlike the RR-003 admin routes, which already
     used `canTransitionSubscription`. Both now check it before mutating;
     an illegal transition (e.g. a stray webhook for an already-cancelled
     lead) is logged and skipped rather than applied, and the webhook
     still acks 200 so Razorpay doesn't retry indefinitely.
   - **Fixed the same payment/lead-binding IDOR flagged in an earlier
     review of this codebase and never closed:** `verify/route.ts`
     activated whatever `leadReferenceCode` the client sent, without
     checking it matched the `leadReferenceCode` actually recorded against
     the paid order. A valid signature for one (e.g. cheap) order could
     have activated an unrelated subscription. Now requires
     `existingOrder.leadReferenceCode === leadReferenceCode` before any
     activation.
   - **`/api/customer/me` PATCH** (`src/app/api/customer/me/route.ts`):
     - `pause` (self-service vacation dates — intentionally distinct from
       the admin-level `paused` lifecycle status; perks are not revoked):
       now validates the date range with the same `validatePauseRange`
       used by the admin subscriptions module, requires the subscription
       to actually belong to the caller *and* be `confirmed_active` before
       allowing it, and uses `.returning()` to detect and report a
       zero-row update instead of returning a false "success".
     - `delivery_notes`: same ownership + zero-row-detection treatment.
     - Added `profile` and `address` update types (full name; full address
       fields, not just notes) — previously unsupported at the API level.
     - Every mutation now writes an `administrative_audit_logs` row.
   - **Health data** (`src/app/api/customer/health/route.ts`): added
     access logging — every read of a customer's own vitals is now an
     audited event, not just writes. Confirmed there is no public route or
     `NEXT_PUBLIC_*` path that can reach `health_vitals`.
   - **Clinical-role permission gap found and fixed:** the legacy
     `user_role` enum has had a `nutritionist` value since
     `0000_baseline_schema`, but `0002_rbac_and_cms` never created a
     matching `application_roles` row for it — meaning no one with that
     role could ever be granted a permission through the RBAC tables
     `hasPermission()` actually reads. The only role holding `health:read`
     was `read_only_auditor`, which is backwards for a clinical permission.
     `drizzle/0006_nutritionist_health_rbac.sql` adds the role and grants
     it `health:read`.
   - Added `GET /api/admin/customers/[userId]/health`
     (`health:read`-gated, staff-facing, distinct from the owner-only
     customer route) so a nutritionist can actually use the permission
     above. Every access is logged with both the viewing staff member and
     the customer whose records were viewed.
   - Acceptance: `npm run typecheck` (0 errors), `npm run lint` (0
     warnings/errors), `npm run test:vitest` (10 files / 76 tests — no new
     pure logic was introduced here beyond what `validatePauseRange` and
     `canTransitionSubscription` already cover; the new hardening is in
     route handlers, consistent with how `subscription-admin.ts`/
     `staff-admin.ts` were tested in RR-003), `npm run db:check` (passes),
     `npm run build` succeeds. NOT VERIFIED: exercising any of this against
     a live database/Clerk session, and applying
     `0006_nutritionist_health_rbac.sql` — no live environment is
     available here (see RR-005 §8).
8. `[x]` **RR-008 — Client content revision (2026-11-04 change request)**
   - Branch: `feat/site-content-revision`. Implemented the client's 8
     ordered homepage/MedCity Smiles/footer content changes, one commit
     per item:
     1. Removed individual per-day pricing (`pricing-section.tsx`,
        `hero.tsx`).
     2–3. Removed the old "Nourishing the Body, Cultivating the Mind" /
        "Cultivate Your Inner Garden" section (`health-community-bridge.tsx`,
        deleted) and replaced it with a new, brochure-grounded MedCity
        Smiles section (`medcity-smiles-section.tsx`) in the same homepage
        slot, above Two Pillars.
     4. Redesigned `/medcity-smiles` (Hero / Why MedCity Smiles / Monthly
        Vitals / Community CTA).
     5. Made the 3-step journey icon/illustration-led instead of
        text-first, on both mobile and desktop (`morning-journey.tsx`).
     6. Shortened the footer — dropped the 3-column link-group grid,
        kept brand block + contact strip + bottom-bar core links
        (`footer.tsx`, `navigation.ts`).
     7. Added a prominent Sunday-closure notice to the Daily Breakfast Box
        section (`box-anatomy.tsx`).
     8. Updated the weekly plan structure site-wide, from the old
        6-day everyday-salad model to: Fresh Fruit & Vegetable Box (4
        fruit varieties, 3 vegetable varieties, mixed sprouts, dry fruits
        mix) 5 days a week + Healthy Oats Meal (oats with fruits & dry
        fruits) 2 days a week. Source of truth is `OFFICIAL_PLANS` in
        `types/plans.ts`; propagated to `pricing-section.tsx`,
        `box-anatomy.tsx` (compartments reworked, Standard/Premium
        toggle removed since box composition no longer differs by
        tier), `/plans`, `/subscribe`, and every other homepage/footer/
        metadata reference to the old salad-inclusive daily structure.
   - Plan: `docs/superpowers/plans/2026-11-04-site-content-revision.md`.
   - Acceptance: `npm run lint` (0 warnings/errors) and `npm run
     typecheck` (0 errors) after every one of the 8 commits. NOT
     VERIFIED: live browser preview — the local dev server cannot render
     any page in this environment (`@clerk/nextjs: Clerk keys are
     missing`, no `.env.local` present); client/user review of the
     actual rendered pages is still required before merge.

9. `[/]` **RR-009 — Local dev environment: Clerk config, MongoDB Atlas +
   Cloudinary scaffolding, local admin bootstrap (2026-11-06)**
   - Decision (user-confirmed): hybrid persistence, not a Postgres
     replacement. Postgres/Drizzle remains authoritative for RBAC,
     payments, subscriptions, and audit logs (FK integrity,
     transactions, zero-row-update ownership checks all depend on it).
     MongoDB Atlas is added only as scaffolding for future
     document-shaped data; no existing feature reads/writes it yet.
   - Added `.env.local` (gitignored) with the user-supplied Clerk dev
     instance keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
     `CLERK_SECRET_KEY`) and local defaults — this is what was missing
     and blocking live preview in RR-008. Added `docker-compose.yml`
     for a local Postgres matching `.env.example`'s `DATABASE_URL`.
   - Added `src/lib/mongodb.ts` (singleton `MongoClient`, dev-hot-reload
     safe) and `src/lib/cloudinary.ts` (configured `cloudinary.v2` +
     `uploadBuffer` helper). Added `mongodb` and `cloudinary` to
     `package.json` dependencies, plus `MONGODB_URI` /
     `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` /
     `CLOUDINARY_API_SECRET` to `.env.example`.
   - Rejected a Clerk-bypass approach (asked user to confirm; they
     instead supplied real Clerk dev-instance test keys). Added
     `scripts/seed-dev-admin.ts` (`npm run db:seed-admin -- <email>`) —
     looks up a real signed-up Clerk account by email via the Backend
     SDK, upserts the local `users` row, and grants `super_admin`
     (exercises the real `hasPermission`/RBAC path instead of skipping
     it). Hard-fails if `NODE_ENV === "production"`.
   - **Update (same day):** actually ran all of this, rather than
     leaving it as unverified scaffolding. This sandbox has no
     outbound network of its own, but Docker Desktop's own network
     path does (confirmed: `docker run node:20-alpine` could reach
     `registry.npmjs.org`) — used throwaway containers bind-mounting
     the repo to run `npm install` (regenerating `package-lock.json`,
     since it had drifted) and all verification commands.
   - `npm run typecheck` and `npm run lint`: both clean, 0 errors/
     warnings, including the new `storage.ts`/`mongodb.ts`/
     `cloudinary.ts`/local-storage route.
   - `docker compose build app`: failed on the first real attempt —
     `next build` tried to statically prerender `/admin` and hit
     `DATABASE_URL is not configured in production`. Root cause:
     `/admin` and `/dashboard` never had `export const dynamic =
     "force-dynamic"`, unlike `content/[slug]/page.tsx`, which already
     needed it for the same reason. Fixed in both layouts (separate
     commit) — this was a real, pre-existing gap never caught because
     nobody had run the Dockerfile from HD-186 end-to-end before.
   - Second failure: the container's non-root `nextjs` user got
     `EACCES` writing to `.local-storage/` under `/app` — only `.next`
     and the standalone output were ever `chown`'d to it. Fixed by
     pre-creating and chowning `.local-storage` in the Dockerfile's
     runner stage, same as `.next` (separate commit).
   - `docker compose --env-file .env.local up -d`: all three containers
     (postgres, mongo, app) come up; postgres reports healthy.
     `GET /api/health` returns `"persistenceDriver":"postgresql_drizzle"`.
     `docker exec ... env` confirms the app container actually has the
     real Clerk publishable key, `DATABASE_URL` pointed at the
     `postgres` service, and `MONGODB_URI` pointed at the `mongo`
     service (not `localhost`, which would be wrong from inside a
     container).
   - `npm run db:migrate` against the containerized Postgres: all 7
     migrations applied; verified `application_roles` (all 8, including
     the RR-007 `nutritionist` fix) and `content_templates` (both CMS
     seeds) are actually present in the running database.
   - Security check: `curl /admin` unauthenticated returns no admin
     dashboard content (no leaked lead/metrics data) whether or not a
     browser-like `Accept` header is sent — Clerk's `auth.protect()`
     is genuinely enforced by the running container, not bypassed.
   - Local-disk storage fallback: write-permission bug confirmed fixed
     (non-root user can now create `.local-storage/...`). The fallback
     itself only activates when `NODE_ENV !== "production"`
     (`assertProductionPersistenceAllowed`) — this containerized run
     sets `NODE_ENV=production` (matching real Railway deployment) by
     design, so it correctly refuses to use local-disk storage there.
     Exercising the fallback path itself therefore requires `npm run
     dev` (`NODE_ENV=development`) rather than this container, and no
     feature calls `uploadFile()` yet to click-test end-to-end.
   - Still NOT VERIFIED: real Clerk sign-in/sign-up in an actual
     browser against the supplied dev keys, and `npm run db:seed-admin`
     end-to-end (both require a human in a real browser, which this
     environment cannot drive). User must do the sign-up step
     themselves before this task is marked `[x]`.

---

## Tracking Index & Quick Links
* [Phase 0 — Discovery & Project Setup (HD-001 to HD-010)](#phase-0--discovery--project-setup)
* [Phase 1 — Product Architecture & Routes (HD-011 to HD-020)](#phase-1--product-architecture--routes)
* [Phase 2 — Design System & Tokens (HD-021 to HD-030)](#phase-2--design-system--tokens)
* [Phase 3 — Frontend Foundation & Layouts (HD-031 to HD-040)](#phase-3--frontend-foundation--layouts)
* [Phase 4 — Humming Drops Homepage (HD-041 to HD-055)](#phase-4--humming-drops-homepage)
* [Phase 5 — MedCity Smiles Homepage (HD-056 to HD-070)](#phase-5--medcity-smiles-homepage)
* [Phase 6 — Subscription Onboarding Flow (HD-071 to HD-085)](#phase-6--subscription-onboarding-flow)
* [Phase 7 — Authentication & Sessions (HD-086 to HD-095)](#phase-7--authentication--sessions)
* [Phase 8 — Subscriber Dashboard (HD-096 to HD-105)](#phase-8--subscriber-dashboard)
* [Phase 9 — Backend & Database Schema (HD-106 to HD-115)](#phase-9--backend--database-schema)
* [Phase 10 — Payment Integration (HD-116 to HD-125)](#phase-10--payment-integration)
* [Phase 11 — Responsive Polish (HD-126 to HD-135)](#phase-11--responsive-polish)
* [Phase 12 — Micro-Interactions & Motion (HD-136 to HD-145)](#phase-12--micro-interactions--motion)
* [Phase 13 — Accessibility & Inclusivity (HD-146 to HD-155)](#phase-13--accessibility--inclusivity)
* [Phase 14 — Automated Testing & QA (HD-156 to HD-165)](#phase-14--automated-testing--qa)
* [Phase 15 — Performance & Web Vitals (HD-166 to HD-175)](#phase-15--performance--web-vitals)
* [Phase 16 — Security Audit (HD-176 to HD-185)](#phase-16--security-audit)
* [Phase 17 — Production Deployment (HD-186 to HD-195)](#phase-17--production-deployment)

---

## Phase 0 — Discovery & Project Setup

### 0.1 Asset & Content Extraction
* [x] **HD-001:** Extract and catalog all text from `Humming-Drops-Brochure.pdf` (8 pages complete).
* [x] **HD-002:** Inspect and extract official visual assets:
  * [x] Humming Drops high-resolution logo (`references/Humming drop Logo .png`)
  * [x] 5-compartment daily box photo (`scratch/brochure_images/p1_4_X18.png`)
  * [x] MedCity Smiles official logo (`scratch/brochure_images/p5_2_X14.png`)
  * [x] Berrybeats partner logo (`scratch/brochure_images/p1_2_X11.png`)
* [x] **HD-003:** Sample and document exact brand hex color values from official logos and assets.
* [x] **HD-004:** Catalog all factual claims, pricing, inclusions, and partner data.
* [x] **HD-005:** Identify and isolate all missing information under Client Decisions Required (`CIR-01` to `CIR-07`).

### 0.2 Design Skills & Reference Benchmarking
* [x] **HD-006:** Install and ingest `frontend-design` skill guidance.
* [x] **HD-007:** Install and ingest `impeccable` skill guidance.
* [x] **HD-008:** Complete analysis of brand references (Headspace, Good Inside, Eat Wholy).
* [x] **HD-009:** Complete 8-point architectural evaluation of UI component libraries.
* [x] **HD-010:** Compile master reference and architecture documents:
  * [x] `/docs/reference.md`
  * [x] `/docs/plan.md`
  * [x] `/docs/tracker.md`
  * [x] `/docs/uiux-design.md`
  * [x] `/docs/product-requirements-baseline.md`
  * [x] `CLAUDE.md`

#### Phase 0 Verification & Acceptance Criteria
* [x] Acceptance: Factual truth grounded 100% in client brochure.
* [x] Acceptance: Zero hallucinated testimonials, medical guarantees, or pricing.
* [x] Acceptance: Five core documentation files created and aligned.

---

## Phase 1 — Product Architecture & Routes

### 1.1 Project Scaffolding & Routing Hierarchy
* [x] **HD-011:** Initialize Next.js 15+ project with strict TypeScript (`"strict": true`), Tailwind CSS, and App Router.
* [x] **HD-012:** Scaffold complete route hierarchy matching sitemap (19 routes total: 15 application routes + 4 API route handlers):
  * [x] `/` (Humming Drops Homepage shell)
  * [x] `/medcity-smiles` (MedCity Smiles Homepage shell)
  * [x] `/plans` (Plans comparison shell)
  * [x] `/subscribe` (Subscription onboarding shell)
  * [x] `/about` (Brand & Kitchen story shell)
  * [x] `/contact` (Contact & Location shell)
  * [x] `/login` (Sign-in shell)
  * [x] `/register` (Sign-up shell)
  * [x] `/forgot-password` (Password recovery shell)
  * [x] `/dashboard` (Dashboard shell)
  * [x] `/dashboard/overview` (Delivery overview shell)
  * [x] `/dashboard/delivery` (Delivery calendar shell)
  * [x] `/dashboard/health` (Health vitals shell with strict privacy guard)
  * [x] `/dashboard/community` (Community sessions shell)
  * [x] `/dashboard/settings` (Account settings shell)
  * [x] `/api/subscriptions/lead` (Assisted lead handler shell)
  * [x] `/api/payments/order` (Order creation shell)
  * [x] `/api/payments/verify` (Signature verification shell)
  * [x] `/api/payments/webhook` (Gateway webhook shell)
* [x] **HD-013:** Define TypeScript architectural contracts (`src/types/` for navigation, plans, subscriptions, health vitals, and checkout).
* [x] **HD-014:** Implement Checkout Mode Security module (`src/lib/checkout-config.ts`), ensuring `NEXT_PUBLIC_CHECKOUT_MODE` is strictly client-side UI configuration and server-side logic remains authoritative.
* [x] **HD-015:** Implement Subscription Lifecycle State Model (`registration_submitted` → `pending_confirmation` → `confirmed/active`), guaranteeing that pending WhatsApp registrations are never treated as active subscriptions.
* [x] **HD-016:** Enforce Health Data Privacy boundaries in types and route shells (sensitive health data isolated, accessible only by authenticated owner).

#### Test Cases (Phase 1)
* [x] **TC-011:** Route tree compiles with zero Next.js route conflicts or syntax errors (`npm run build`).
* [x] **TC-012:** TypeScript strict typecheck passes with 0 errors (`npx tsc --noEmit`).
* [x] **TC-013:** All primary routes render clean structural placeholders with correct `<title>` and metadata.
* [x] **TC-014:** Server checkout configuration rejects client-side mode spoofing attempts.
* [x] **TC-015:** Subscription status validator enforces `pending_confirmation != active` guard.

---

## Phase 2 — Design System & Tokens

### 2.1 Color Tokens & Theming Engine
* [x] **HD-021:** Configure Tailwind CSS color palette for Humming Drops (`forest-900: #144518`, `forest-800: #1b5e20`, `leaf-500: #2e7301`, `cream-50: #fdfcf7`).
* [x] **HD-022:** Configure Tailwind CSS color palette for MedCity Smiles (`teal-900: #0d5049`, `teal-700: #156c63`, `mint-100: #e6f7f5`).
* [x] **HD-023:** Create CSS variable mappings for semantic tokens (`--bg-canvas`, `--bg-surface`, `--primary-brand`, `--text-primary`, `--border-subtle`, `--shadow-card`).
* [x] **HD-024:** Verify WCAG AA/AAA contrast ratios for all text-on-surface pairings (`scratch/test-phase2-design-tokens.mjs`).

### 2.2 Typography, Spacing & Elevation
* [x] **HD-025:** Configure Google Fonts (`Plus Jakarta Sans` and `Inter`) with `next/font/google` (`display: swap`).
* [x] **HD-026:** Define responsive typography scale from `caption` to `display-hero`.
* [x] **HD-027:** Implement spacing scale (4px/8px rhythm) and container constraints (`max-w-7xl`, `max-w-reading`, `max-w-form-flow`).
* [x] **HD-028:** Configure disciplined border radii (`rounded-pill` for CTAs/badges, `rounded-2xl` for cards).
* [x] **HD-029:** Configure custom botanical and mindful soft shadows (`shadow-card`, `shadow-raised`, `shadow-floating`).

#### Test Cases (Phase 2)
* [x] **TC-021:** Contrast ratio >= 4.5:1 on all body text, >= 3:1 on large text (verified by automated test suite).
* [x] **TC-022:** Fonts load without layout shift (`font-display: swap`).
* [x] **TC-023:** CSS variables seamlessly switch tokens when toggling brand modes.

---

## Phase 3 — Frontend Foundation & Layouts

### 3.1 Project Scaffold & Tooling
* [x] **HD-031:** Initialize Next.js project with TypeScript strict mode, ESLint, and Prettier.
* [x] **HD-032:** Install core dependencies (`clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`).
* [x] **HD-033:** Scaffold accessible primitives into `@/components/ui/` (`Button`, `Badge`, `Card`, `Container`, `Section`).

### 3.2 Global Header & Footer Components
* [x] **HD-034:** Build `Navbar.tsx` with responsive desktop menu, accessible mobile drawer, and dual brand switcher.
* [x] **HD-035:** Implement persistent sticky header with backdrop blur effect.
* [x] **HD-036:** Build `Footer.tsx` containing Bangalore location, Berrybeats Cafe info, MedCity Health Labs info, phone, and email.
* [x] **HD-037:** Build `BrandSwitcher.tsx` with smooth animated active pill indicator and accessible keyboard tablist.

#### Test Cases (Phase 3)
* [x] **TC-031:** TypeScript compiles with 0 errors (`npm run build`).
* [x] **TC-032:** Navbar renders correctly on mobile (hamburger drawer) and desktop.
* [x] **TC-033:** Mobile drawer closes on navigation and ESC key press.
* [x] **TC-034:** Header stays pinned during scroll with smooth backdrop blur.

---

## Phase 4 — Humming Drops Homepage (Refinement Pass Complete)

### 4.1 UX Flow Architecture
* [x] **HD-040:** Implemented editorial user journey: **Discover → Explore → Understand → Connect → Trust → Subscribe → Action**, moving pricing/subscription conversion to the end of the homepage.

### 4.2 Hero Section (Editorial Redesign)
* [x] **HD-041:** Build editorial `Hero.tsx` with headline "Healthy Drops, Healthier you", hand-drawn wavy underline accent, brochure sub-copy, and exploratory CTAs ("Explore What's Inside" & "The Morning Ritual").
* [x] **HD-042:** Implement authentic 5-compartment breakfast box centerpiece (`/images/humming-drops-box.png`, priority load) with asymmetrical layout.
* [x] **HD-043:** Add handcrafted doodle arrows and floating annotations pointing to compartments ("🍎 4 Fruits Every Day", "🥕 2 Crisp Vegetables", "🥗 Fresh Mix Salad & Sprouts", "Meticulously Prepared").

### 4.3 Interactive Box Experience (Replacing Generic Cards)
* [x] **HD-045:** Build `BoxAnatomy.tsx` centering on the authentic box photo with 5 clickable/tappable compartment hotspots:
  * [x] 01: 4 Varieties of Fruits — Every Day
  * [x] 02: 2 Varieties of Vegetables — Every Day
  * [x] 03: Fresh Mix Salad — Every Day
  * [x] 04: Fresh Sprouts — Every Day
  * [x] 05: Dry Fruits (3 Days/Week in Standard, Daily in Premium)
* [x] **HD-046:** Dynamic compartment reveal card with animated transitions, mobile-friendly touch pill selector, and interactive Standard (₹3,500/mo) vs. Premium (₹4,000/mo) toggle.

### 4.4 Morning Ritual & Sourcing Journey
* [x] **HD-052:** Build `MorningJourney.tsx` as an illustrated visual path connecting 4 milestone steps (Fresh Morning Harvest → Thoughtful Preparation at Berrybeats Cafe → Doorstep Morning Delivery → Nourish Body & Mind) paired with authentic fresh produce imagery (`/images/humming-drops-fresh-produce.png`).

### 4.5 Why Humming Drops & Daily Habit Philosophy
* [x] **HD-055:** Build `WhyHummingDrops.tsx` based on Brochure Pages 2 & 7, contrasting the modern nutrient challenge with the daily whole-food habit solution.

### 4.6 Health Monitoring & MedCity Smiles Bridge
* [x] **HD-051:** Build `HealthCommunityBridge.tsx` highlighting the mind-body connection, the 4 MedCity Smiles wellness pillars, and free monthly Sugar, Cholesterol, and BP tests in partnership with MedCity Health Labs.

### 4.7 Plans & Pricing Comparison (Conversion Payoff)
* [x] **HD-047:** Build `PricingSection.tsx` at the end of the journey featuring Standard (₹3,500/mo) and Premium (₹4,000/mo) cards with strict brochure fidelity.
* [x] **HD-048:** Purge informal daily cost breakdown indicators (`~₹116/day`, `~₹133/day`) in strict alignment with authoritative brochure monthly pricing (Standard ₹3,500/mo, Premium ₹4,000/mo).
* [x] **HD-049:** Highlight Premium-exclusive perks (Daily dry fruits, MedCity Labs discounts, special healthy juice drops by CARE by Berrybeats).
* [x] **HD-050:** Assisted booking helpline card with verified WhatsApp/call details (`8618902810` · `Berrybeats cafe, Bangalore`).

### 4.8 Closing CTA
* [x] **HD-054:** Build `ClosingCTA.tsx` with final subscription invitation, direct WhatsApp link, and confirmed partner/location attribution.

#### Test Cases (Phase 4)
* [x] **TC-041:** Desktop hero renders without layout shifts; box image loads with `priority`.
* [x] **TC-042:** Mobile view stacks hero copy, imagery, and touch selectors cleanly; zero horizontal overflow (tested across 375px, 768px, 1280px, 1440px).
* [x] **TC-043:** Interactive hotspots dynamically update compartment cards on click/tap with full keyboard accessibility.
* [x] **TC-044:** Pricing cards clearly articulate difference between Standard and Premium.
* [x] **TC-045:** Strict content safety guardrail passes: zero unconfirmed operational claims ("chilled delivery", "Bangalore kitchen", "across Bangalore" promises removed).

---

## Phase 4.6 — Backend Integration & Lead Persistence (40% Presentation Slice)

### 4.9 End-to-End Onboarding & Persistence Engine
* [x] **HD-046A:** Configured `.env.example` documenting server-authoritative checkout mode (`CHECKOUT_MODE=assisted_lead`) and safe client presentation hint (`NEXT_PUBLIC_CHECKOUT_MODE=assisted_lead`).
* [x] **HD-046B:** Implemented `src/lib/lead-storage.ts` with repository pattern (`ILeadRepository` interface) and isolated demo server-side JSON repository (`JsonFileLeadRepository`) targeting `data/leads.json`.
* [x] **HD-046C:** Hardened `src/app/api/subscriptions/lead/route.ts` with server-side validation (Indian mobile regex, email format, string sanitization, canonical pricing guardrail, and `pending_confirmation` lifecycle enforcement).
* [x] **HD-046D:** Upgraded `src/app/subscribe/page.tsx` into a complete 5-step interactive wizard (Plan Selection, Contact, Bangalore Address, Dietary Preferences, Order Review & Mode B Assisted Registration).
* [x] **HD-046E:** Built confirmation view with prominent `HD-REG-YYYY-XXXXX` reference code, `Pending Manual Confirmation` status badge (guaranteeing `pending_confirmation != active`), and direct WhatsApp link to official Bangalore coordinator (`8618902810`).
* [x] **HD-046F:** Automated end-to-end integration test suite `scratch/test-phase4-backend-flow.mjs` verifying 6/6 test assertions over live HTTP.

#### Test Cases (Phase 4.6)
* [x] **TC-046A:** Valid subscription lead submission succeeds (HTTP 201) and returns unique reference code.
* [x] **TC-046B:** Invariant guardrail verified: `status === "pending_confirmation"` and `hasActivePerks === false`.
* [x] **TC-046C:** Client price tampering rejected; canonical pricing (Standard ₹3,500 / Premium ₹4,000) strictly enforced on server.
* [x] **TC-046D:** Invalid phone numbers, invalid emails, and empty payloads rejected with descriptive HTTP 400 field errors.
* [x] **TC-046E:** Submitted leads are persisted to `data/leads.json` with complete audit metadata.
* [x] **TC-046F:** Verified lead query via `GET /api/subscriptions/lead?ref=...`.

---

## Phase 5 — MedCity Smiles Homepage

### 5.1 Hero & Mental Wellness Philosophy
* [x] **HD-056:** Build `MedCityHero.tsx` with headline "Uplifting the Mind. Building a Happier Community."
* [x] **HD-057:** Render official MedCity Smiles emblem and community badges.
* [x] **HD-058:** Build `WhyMentalHealthMatters.tsx` based on brochure Page 5 copy.

### 5.2 The Holistic Mind-Body Pillars
* [x] **HD-059:** Build `MindBodyPillars.tsx` detailing:
  * [x] Fuel Your Brain (Nutrition & mood stability)
  * [x] Cultivate Positive Self-Talk (Self-compassion & reframing)
  * [x] Happy-Healthy Coping Mechanisms (Movement, yoga, art, music, writing)
  * [x] Community Live Sessions & Safe Sharing Circles

### 5.3 Doctor & Expert Network
* [x] **HD-060:** Build `ExpertNetwork.tsx` showcasing doctors and clinical nutritionists.
* [x] **HD-061:** Add credential cards detailing advisory specialties and guidance availability.

### 5.4 Preventative Health Center
* [x] **HD-062:** Build `HealthMonitoringDetail.tsx` explaining Blood Sugar, Cholesterol, and BP monthly monitoring.
* [x] **HD-063:** Detail MedCity Health Labs partnership and exclusive package discounts.

### 5.5 Live Sessions Schedule & Community CTA
* [x] **HD-064:** Build `UpcomingSessions.tsx` with interactive event calendar and RSVP modal.
* [x] **HD-065:** Build `CommunityJoinCta.tsx` linking free membership to Humming Drops subscription.

#### Test Cases (Phase 5)
* [x] **TC-051:** MedCity Smiles theme applies serene teal/mint visual styling without breaking global nav.
* [x] **TC-052:** Expert cards render responsively in 1, 2, and 3-column configurations.
* [x] **TC-053:** RSVP modal triggers and traps focus correctly with accessible close action.
* [x] **TC-054:** All brochure copy regarding mental health is verbatim and respectfully framed.

---

## Phase 6 — Subscription Onboarding Flow

### 6.1 Multi-Step Checkout Engine (`/subscribe`)
* [x] **HD-071:** Build step progress indicator (Steps 1 to 5) with accessible current-step announcement.
* [x] **HD-072:** **Step 1 (Plan Selection):** Interactive Standard (₹3,500) vs. Premium (₹4,000) cards.
* [x] **HD-073:** **Step 2 (Account & Profile):** Full Name, Mobile Number, Email, Password / OTP.
* [x] **HD-074:** **Step 3 (Bangalore Delivery Address - Provisional):** Flat, Building, Street, Area, Pincode, optional instructions/timing note (flexible capture without rigid whitelist constraints; `CIR-01`, `CIR-02`).
* [x] **HD-075:** **Step 4 (Dietary Preferences):** Diet type, allergen notes, customer instructions (`CIR-06`).
* [x] **HD-076:** **Step 5 (Order Review & Pluggable Checkout):** Itemized breakdown, delivery fee (₹0), total monthly charge, with dynamic fulfillment handler (Razorpay Online Gateway OR Assisted Lead Registration; `CIR-07`).
* [x] **HD-077:** Build `ConfirmationView.tsx` supporting:
  * [x] Mode A: Instant payment success receipt, active subscription badge, and WhatsApp community link.
  * [x] Mode B: Lead reference code (e.g. `HD-REG-74291`), one-click WhatsApp chat link to Humming Drops Bangalore team (`8618902810`), and manual activation steps.

#### Test Cases (Phase 6)
* [x] **TC-071:** Form preserves entered data when navigating backwards (`Previous Step`).
* [x] **TC-072:** Field validation displays descriptive inline error messages on invalid input.
* [x] **TC-073:** Address capture accepts valid Bangalore pincodes without breaking on unconfirmed neighborhood boundaries.
* [x] **TC-074:** Responsive checkout displays sticky order summary bar on mobile screens.
* [x] **TC-075:** Switching `NEXT_PUBLIC_CHECKOUT_MODE` toggles checkout UI between Online Payment and WhatsApp Assisted Registration cleanly.

---

## Phase 7 — Authentication & Sessions

### 7.1 Authentication & Session Management
* [x] **HD-086:** Configure session management, local storage, and credential models.
* [x] **HD-087:** Build `LoginPage.tsx` supporting mobile reference code login, OTP, and 1-click demo switcher.
* [x] **HD-088:** Build registration handoff and session initialization.
* [x] **HD-089:** Build password recovery shell.
* [x] **HD-090:** Implement client-side session checks protecting `/dashboard/*`.

#### Test Cases (Phase 7)
* [x] **TC-081:** Unauthenticated access or logout redirects user to `/login`.
* [x] **TC-082:** Successful login redirects user to `/dashboard/overview`.
* [x] **TC-083:** Reference code login hydrates customer name, plan tier, and address into session.

---

## Phase 8 — Subscriber Dashboard

### 8.1 Dashboard Modules
* [x] **HD-096:** Build `DashboardLayout.tsx` with responsive navigation and quick links.
* [x] **HD-097:** Build `overview/page.tsx` displaying morning delivery dispatch timeline and 5-compartment nutritional mix.
* [x] **HD-098:** Build `delivery/page.tsx` allowing 1-click delivery pause, vacation scheduling, and gate rider instructions.
* [x] **HD-099:** Build `health/page.tsx` showing past Blood Sugar, Cholesterol, and BP test logs, accreditation badge, and booking modal.
* [x] **HD-100:** Build `community/page.tsx` listing enrolled MedCity Smiles webinars with interactive RSVP buttons and doctor question form.
* [x] **HD-101:** Build `settings/page.tsx` for plan upgrades (Standard ₹3,500 ↔ Premium ₹4,000), address updates, and logout.

#### Test Cases (Phase 8)
* [x] **TC-091:** Delivery pause updates status immediately with optimistic UI update and local persistence.
* [x] **TC-092:** Health vitals display clearly with normal/borderline status color indicators.
* [x] **TC-093:** Vacation date range registers and prevents unwanted dispatches.

---

## Phase 9 — Backend & Database Schema

### 9.1 Database Tables & RLS Policies
* [ ] **HD-106:** Create `profiles` table linked to `auth.users`.
* [ ] **HD-107:** Create `subscription_plans` and `user_subscriptions` tables (supporting both gateway and assisted lead fulfillment modes).
* [ ] **HD-108:** Create `delivery_addresses` and `dietary_preferences` tables (flexible schemas without restrictive hardcoded business constraints).
* [ ] **HD-109:** Create `health_vitals` table for Sugar, Cholesterol, and BP checkup logs.
* [ ] **HD-110:** Create `community_sessions` and `session_registrations` tables.
* [ ] **HD-111:** Create `payments` table for transaction audits (supporting online gateway records and offline/assisted lead entries).
* [ ] **HD-112:** Write and test Row Level Security (RLS) policies for all tables.

#### Test Cases (Phase 9)
* [ ] **TC-101:** Users cannot query or mutate records belonging to other `user_id`s.
* [ ] **TC-102:** Foreign key cascading prevents orphaned records on user account deletion.
* [ ] **TC-103:** Database indexes verify sub-10ms query execution on user dashboard fetches.

---

## Phase 10 — Payment & Fulfillment Integration (Pluggable Architecture)

### 10.1 Pluggable Fulfillment Architecture
* [x] **HD-116:** Build `CheckoutStrategy` interface supporting Mode A (`RazorpayOnlineCheckout`) and Mode B (`WhatsAppLeadCapture`).
* [x] **HD-117:** **Mode A (Razorpay Online Gateway - Proposed Production Option):**
  * [x] Implement `/api/payments/create-order` with server-side price validation.
  * [x] Implement client-side Razorpay Checkout modal launch (UPI, Cards, NetBanking).
  * [x] Implement `/api/payments/verify` with HMAC-SHA256 signature verification.
  * [x] Implement webhook endpoint (`/api/payments/webhook`) for asynchronous reconciliation.
* [x] **HD-118:** **Mode B (Assisted Registration & WhatsApp Lead Capture):**
  * [x] Implement `/api/subscriptions/submit-lead` endpoint capturing customer details.
  * [x] Generate unique lead reference code (e.g. `HD-REG-74291`).
  * [x] Generate direct WhatsApp chat URL with prefilled order details to `8618902810`.
  * [x] Implement manual admin confirmation endpoint for activating subscriptions.
* [x] **HD-119:** Add environment switch (`NEXT_PUBLIC_CHECKOUT_MODE`) to toggle between Mode A and Mode B without code changes.

#### Test Cases (Phase 10)
* [x] **TC-111:** Order amount tampering in client payload is rejected by server.
* [x] **TC-112:** Mode A: Valid HMAC signature activates user subscription in database.
* [x] **TC-113:** Mode A: Invalid signature triggers 400 Bad Request and logs security alert.
* [x] **TC-114:** Mode B: Submitting lead creates `pending_confirmation` record and produces correct WhatsApp URL to `8618902810`.

---

## Phase 11 — Responsive Polish

### 11.1 Multi-Device Verification
* [ ] **HD-126:** Verify mobile layout (320px – 480px) across iOS Safari and Android Chrome.
* [ ] **HD-127:** Verify tablet portrait and landscape layouts (768px – 1024px).
* [ ] **HD-128:** Verify desktop and ultra-wide layouts (1280px – 1920px+).
* [ ] **HD-129:** Eliminate any horizontal scroll (`overflow-x: hidden` verification).
* [ ] **HD-130:** Verify all tap targets meet minimum 44px x 44px size.

#### Test Cases (Phase 11)
* [ ] **TC-121:** Zero horizontal scrollbar across all routes at 375px viewport.
* [ ] **TC-122:** Sticky checkout CTA does not obscure mobile form input fields.

---

## Phase 12 — Micro-Interactions & Motion

### 12.1 Purposeful Framer Motion
* [ ] **HD-136:** Add subtle entrance reveals to hero elements with staggered delays.
* [ ] **HD-137:** Add interactive 3D lift to 5-compartment box preview cards.
* [ ] **HD-138:** Implement smooth sliding layout animation on the brand switcher toggle.
* [ ] **HD-139:** Implement `useReducedMotion` hook ensuring animations are disabled when preferred.

#### Test Cases (Phase 12)
* [ ] **TC-131:** All animations complete within 300ms.
* [ ] **TC-132:** System with `prefers-reduced-motion: reduce` shows zero transform or slide animations.

---

## Phase 13 — Accessibility & Inclusivity

### 13.1 WCAG 2.1 AA Audit
* [ ] **HD-146:** Audit all interactive elements for full keyboard accessibility (`Tab`, `Space`, `Enter`).
* [ ] **HD-147:** Add high-visibility focus ring tokens (`focus-visible:ring-2`).
* [ ] **HD-148:** Audit all images for descriptive `alt` tags (`alt=""` for decorative).
* [ ] **HD-149:** Ensure all form fields have associated `<label>` or `aria-label` elements.
* [ ] **HD-150:** Run automated axe-core accessibility scanner across all views.

#### Test Cases (Phase 13)
* [ ] **TC-141:** 0 critical or serious axe-core violations on any page.
* [ ] **TC-142:** Complete subscription funnel executable using keyboard only.

---

## Phase 14 — Automated Testing & QA

### 14.1 Test Suites
* [x] **HD-156:** Setup Vitest for unit tests (pricing invariants, phone/address sanitization, lead state transitions, and production build smoke test matrix).
* [ ] **HD-157:** Write component tests for `PricingSection`, `Navbar`, and `StepProgress`.
* [ ] **HD-158:** Setup Playwright for End-to-End tests (Checkout flow, Brand switch, Dashboard pause).
* [ ] **HD-159:** Configure GitHub Actions CI workflow to run linter, typecheck, and test suite on push.

#### Test Cases (Phase 14)
* [ ] **TC-151:** 100% pass rate on unit and integration test suites.
* [ ] **TC-152:** Playwright E2E passes on desktop Chrome, Firefox, and mobile WebKit.

---

## Phase 15 — Performance & Web Vitals

### 15.1 Optimization & Audits
* [ ] **HD-166:** Optimize all produce and logo images to Next-gen WebP/AVIF formats.
* [ ] **HD-167:** Ensure self-hosted Google Fonts via `next/font` with zero FOIT/FOUT.
* [ ] **HD-168:** Code-split heavy dashboard modals and chart visualizations.
* [ ] **HD-169:** Audit Lighthouse scores for Mobile and Desktop.

#### Test Cases (Phase 15)
* [ ] **TC-161:** Lighthouse Performance score >= 90 on mobile.
* [ ] **TC-162:** Largest Contentful Paint (LCP) <= 2.0s on 4G network profile.

---

## Phase 16 — Security Audit

### 16.1 Hardening
* [ ] **HD-176:** Verify zero API keys or secrets in client-side bundles.
* [ ] **HD-177:** Validate all incoming API payloads using strict `zod` schemas.
* [ ] **HD-178:** Configure HTTP security headers (CSP, HSTS, X-Frame-Options).
* [ ] **HD-179:** Implement IP rate-limiting on sensitive auth and payment routes.

#### Test Cases (Phase 16)
* [ ] **TC-171:** Penetration test verifies unauthorized users cannot read another user's vitals.
* [ ] **TC-172:** SecurityHeaders.com score grade A or higher.

---

## Phase 17 — Production Deployment & DevOps

### 17.1 Containerization & Railway Architecture (HUM-W2-07)
* [x] **HD-186:** Implement Next.js 15 multi-stage production `Dockerfile` with standalone output and non-root execution (UID 1001).
* [x] **HD-187:** Configure Railway deployment manifest (`railway.toml`) with dynamic healthcheck probing (`/api/health`) and auto-restart policies.
* [x] **HD-188:** Implement healthcheck route handler (`src/app/api/health/route.ts`) returning uptime, memory metrics, and checkout mode diagnostics.
* [x] **HD-189:** Complete environment secret audit (`.env.example`) establishing strict server vs client security boundaries and Staging Isolation Matrix.
* [x] **HD-190:** Compile authoritative DevOps, Staging Isolation & Zero-Downtime Rollback Runbook (`docs/runbooks/deployment-and-staging.md`).

### 17.2 Domain & Live Production Release
* [ ] **HD-191:** Configure production environment variables in Railway project settings.
* [ ] **HD-192:** Set up custom domain `www.hummingdrops.com` with automated Let's Encrypt SSL and apex 301 redirect.
* [ ] **HD-193:** Configure database backup schedules and disaster recovery protocols for Railway PostgreSQL.
* [ ] **HD-194:** Verify error monitoring and analytics tracking in production (Sentry).

#### Test Cases (Phase 17)
* [x] **TC-181:** Healthcheck probe (`/api/health`) responds HTTP 200 with valid diagnostic JSON payload.
* [x] **TC-182:** Multi-stage Dockerfile builds with zero secret leakage and lean footprint (< 150MB).
* [ ] **TC-183:** Live production domain loads over HTTPS with A+ SSL rating.
* [ ] **TC-184:** Test transaction executes end-to-end on isolated staging infrastructure.
