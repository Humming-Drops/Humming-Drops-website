# QA scripts

Re-runnable checks used for the 2026-11-18 QA pass. All target a **local dev server** (default `http://localhost:3001`, override with `BASE_URL`). Nothing here should be pointed at production: the API script creates test accounts.

Prerequisites (see `docs/handover/CHECKPOINT-2026-11-18.md`): Docker Postgres up, dev server running, an admin account (`npm run db:seed-admin`).

| Script | What it checks |
|---|---|
| `live-api-e2e.sh` | Customer lifecycle through the real API and DB: register, lead, duplicate (409), a 5-way parallel race (exactly one registration), admin confirm / pause / cancel, re-register, audit trail, login redirects, admin filter pages. Prints PASS/FAIL per check. |
| `viewport-axe-sweep.mjs` | Opens every public, customer and admin route at 375 / 768 / 1440 px in headless Google Chrome (via the DevTools protocol, no extra npm packages), runs axe-core WCAG 2.1 A/AA, checks horizontal overflow and console errors, saves screenshots. |

```bash
# from the repo root, with the dev server running
export ADMIN_EMAIL=admin@hummingdrops.dev ADMIN_PASSWORD=<password from scripts/seed-dev-admin.ts or the one you seeded>
bash scripts/qa/live-api-e2e.sh
mkdir -p /tmp/shots && node scripts/qa/viewport-axe-sweep.mjs /tmp/shots <customerEmail> <customerPassword>
```

The sweep needs a customer account with an **active** subscription to see the active dashboard state (create one with `live-api-e2e.sh`, which prints nothing secret, or register in the UI and confirm it in `/admin/subscriptions`).

Notes
- Browser extension limitation: the Claude Chrome extension cannot resize the viewport, which is why the sweep uses headless Chrome.
- Last full result (2026-11-18): 81/81 route x viewport combinations clean; live API script 26/26.
