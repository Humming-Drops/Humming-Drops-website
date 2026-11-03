# RB-06: Database Migration, Backup & Restore Runbook

**Status:** Documented procedure, **not yet executed against any live database**. No
Railway/Postgres credentials were available in the environment that authored this
runbook — every command below must be run by whoever holds real staging/production
credentials, following this checklist, before it can be marked verified.

**Scope:** `drizzle/0001_add_clerk_identity.sql` through `drizzle/0004_clerk_lifecycle_sync.sql`
(the current migration set) against a Railway-managed PostgreSQL instance.

---

## 1. Validate DATABASE_URL before touching anything

Never attempt a migration against a connection string you haven't confirmed:

```bash
# Prints the resolved connection target (host + database only, never the password)
node -e "const u=new URL(process.env.DATABASE_URL); console.log(u.hostname, u.pathname)"
```

Read that output back and confirm out loud (or in the PR/deploy ticket) which
environment it points to. `src/lib/db/validate-url.ts` (`validateDatabaseUrl`) is run
automatically on every database connection attempt (`src/lib/db/index.ts`) and will
throw with a specific reason — not a generic connection error — if:
- `DATABASE_URL` is unset or malformed.
- The scheme isn't `postgres://`/`postgresql://`.
- The host or database name is missing.
- `NODE_ENV=production` and the host resolves to `localhost`/`127.0.0.1`/`::1`
  (hard failure — this is the guard against ever running a "production" deploy
  against a local database by mistake).
- `NODE_ENV=production` and `sslmode` isn't `require`/`verify-ca`/`verify-full`
  (warning only, logged to the console — fix it, but it won't block startup).

Also run, before any migration:

```bash
npm run db:check   # drizzle-kit check: validates the migrations folder + journal
                    # locally, without needing a live connection
```

## 2. Verify migration order and journal integrity

`drizzle/meta/_journal.json` is the source of truth for applied order. As of this
runbook:

| idx | tag | What it does |
|---|---|---|
| 0 | `0000_baseline_schema` | Creates the 11 base tables (`users`, `profiles`, `subscription_plans`, `user_subscriptions`, `delivery_addresses`, `dietary_preferences`, `health_vitals`, `community_sessions`, `session_registrations`, `payments`, `subscription_audit_logs`) and their enums, plus the canonical plan seed rows. **Added retroactively** — see the warning box below. |
| 1 | `0001_add_clerk_identity` | Adds `clerk_user_id` to `users`. |
| 2 | `0002_rbac_and_cms` | Adds RBAC tables (`application_roles`, `application_permissions`, `role_permissions`, `user_roles`, `administrative_audit_logs`) and CMS tables (`content_templates`, `content_pages`, `content_audit_logs`), plus the RBAC/permission seed data. |
| 3 | `0003_seed_content_templates` | Seeds two structural content templates (no client copy). |
| 4 | `0004_clerk_lifecycle_sync` | Drops `users.phone`'s `NOT NULL` constraint; adds `clerk_webhook_events` idempotency table. |
| 5 | `0005_postgres_payment_persistence` | Adds `payment_orders`, `payment_transactions`, `payment_webhook_events` — the Postgres-backed replacement for the JSON-file payment repository (RR-006). |

> **Found while writing this runbook (RR-005) and fixed in RR-006:** migrations
> `0001`–`0004` only ever `ALTER`/`ADD`ed onto tables they assumed already existed —
> there was no migration that actually created the base 11 tables, and
> `drizzle/meta/` had no snapshot files, meaning `npm run db:check` was only
> validating that the journal file itself is well-formed, **not** that it matches
> `schema.ts`. Against a genuinely fresh database, `0001` would have failed
> immediately on `ALTER TABLE "users"`. `0000_baseline_schema.sql` fixes this,
> written with `CREATE TABLE/TYPE/INDEX IF NOT EXISTS` throughout so it's safe to
> run whether or not these tables already exist from some other process. If you
> are applying this migration set for the first time against a database that
> already has these tables (e.g. created outside Drizzle), `0000` will simply be a
> no-op for those objects — confirm that assumption before running it anyway.

Before applying to any environment, confirm:
```bash
cat drizzle/meta/_journal.json   # idx values are sequential with no gaps/duplicates
ls drizzle/*.sql                 # one file per journal entry, same count
```
`npm run db:check` only validates internal journal/file consistency (see the warning
above) — it is **not** proof that the migration set matches a specific live
database's actual current state. A manual read of the target database's existing
tables (`\dt` in `psql`, or equivalent) before the first-ever run against it is not
optional.

## 3. Staging first — always

1. Confirm `DATABASE_URL` resolves to the **staging** database (step 1).
2. Take a backup anyway (step 5) — staging data still has value and migrations can
   have unexpected effects even in Expand-and-Contract form.
3. Apply:
   ```bash
   npm run db:migrate   # drizzle-kit migrate
   ```
4. Re-run `npm run db:check` against staging to confirm the applied state matches
   the journal.
5. Smoke-test the application against staging: confirm `/api/health` returns 200,
   exercise the newest feature end-to-end (e.g. for `0004`, trigger a Clerk
   `user.created` test event and confirm a row appears in `users` with a `NULL`
   `phone`, and a corresponding row in `clerk_webhook_events`).
6. Only after staging is confirmed healthy, proceed to step 4.

## 4. Production — explicit confirmation required, every time

**Never run a migration against `DATABASE_URL` pointing at production without:**
- A second person (or the project owner) explicitly confirming the target database
  and the migration tag being applied, in writing (PR comment, deploy ticket, or
  equivalent) — not just this session's own judgment.
- A fresh backup taken in the last hour (step 5), with its location recorded in the
  same confirmation.
- Staging having already passed step 3 for this exact migration set.

```bash
# Confirm the target one more time, out loud, before running this:
node -e "const u=new URL(process.env.DATABASE_URL); console.log(u.hostname, u.pathname)"

npm run db:migrate
npm run db:check
```

Immediately after: repeat the smoke test from step 3.5 against production.

## 5. Backup procedure

Railway-managed Postgres is reachable with standard `pg_dump`/`pg_restore` against
`DATABASE_URL`. Take a backup **before every migration**, staging or production:

```bash
pg_dump "$DATABASE_URL" --format=custom --file="backup-$(date +%Y%m%dT%H%M%S).dump"
```

Store the dump outside the application container (local machine, S3, or Railway's
own backup feature if enabled on the plan) — never leave it only on the ephemeral
deploy filesystem.

## 6. Restore procedure

```bash
# Restore into the SAME database the dump was taken from (disaster recovery):
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" backup-<timestamp>.dump

# Restore into a DIFFERENT (e.g. freshly created staging) database for verification
# without touching the original:
pg_restore --no-owner --dbname="$RESTORE_TARGET_DATABASE_URL" backup-<timestamp>.dump
```

After any restore, run `npm run db:check` against the restored database and spot-check
row counts on `users`, `user_subscriptions`, and `payments` against what was expected
at backup time.

## 7. Rollback policy: forward-fix, not automatic down-migrations

Drizzle Kit does not generate reversible "down" migrations for this project. The
policy is:

1. **Preferred — forward-fix:** write a new, additive migration (`0005_...`) that
   corrects the problem (e.g. add back a column, adjust a default, backfill data).
   This is safe to apply without downtime because every migration so far follows
   the Expand-and-Contract pattern documented in `docs/runbooks/deployment-and-staging.md`
   §7 — nothing destructive is applied in the same release as the code that depends
   on it.
2. **Emergency fallback — restore from backup:** if a migration caused active data
   corruption (not just an application bug), restore the pre-migration backup from
   step 5 into the production database, following step 6, then redeploy the
   previous application release. This is a last resort: it loses any writes made
   between the backup and the restore, so it requires explicit sign-off from the
   project owner before executing, exactly like any other production write Rule 3
   of the project's safety guardrails requires.
3. Never attempt to hand-write a "down" SQL script and run it directly against
   production without first validating it against a restored staging copy (step 6,
   second form) — an untested reverse migration is itself a source of outages.

## 8. What this runbook has NOT verified

Everything above is a documented procedure. The following are explicitly
**NOT VERIFIED** because no live Railway/Postgres credentials were available in the
environment that wrote this runbook:
- That `npm run db:migrate` actually succeeds against a real staging database.
- That the backup/restore commands in sections 5–6 work against Railway's specific
  Postgres offering (connection pooling/proxy behavior can affect `pg_dump`/`pg_restore`
  flags — e.g. some managed Postgres providers require `--no-owner` or a direct,
  non-pooled connection string for restores).
- That the smoke tests in step 3.5 actually pass post-migration.

Whoever runs this runbook for the first time against real infrastructure should
update this section to `VERIFIED <date>` once each item has actually been exercised,
and correct any command here that didn't work exactly as written.
