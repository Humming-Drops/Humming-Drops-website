# Checkpoint — Deploy-readiness check & env keys (2026-11-18, session 2)

Follows `CHECKPOINT-2026-11-18.md` (read that first). Branch: `fix/qa-bugs`, not pushed, no PR.

## 1. Result in one line
No app bugs found. Everything that can be verified locally passes; deployment itself has **not** been tested.

## 2. Verified this session
- `typecheck`, `lint`, `npm test` (103 tests): clean.
- `npm run build` (production build): succeeds.
- Live API script `scripts/qa/live-api-e2e.sh` against local Postgres: **26/26**.
- Browser sweep `scripts/qa/viewport-axe-sweep.mjs` (27 routes x 375/768/1440): **81/81**, 0 axe violations, no overflow or console errors.
- Auth boundaries: anonymous -> 401 on admin/customer APIs, 307 on `/admin` and `/dashboard`; customer -> 403 on admin APIs. Security headers present.
- Cloudinary: ping + real upload/CDN test OK (`npm run test:services`). Clerk secret key valid (API 200), but unused by code.

## 3. Changes made
- `scripts/qa/live-api-e2e.sh`: fixed a test-script bug (status code and count were concatenated, giving `2001`). **Uncommitted.**
- `.env.local` (gitignored): added `MONGODB_URI`, Clerk keys, `CLOUDINARY_URL`; replaced the three Cloudinary values. Backup of the old file was in the session scratch temp dir only.

## 4. Things learned
- `next start` forces `NODE_ENV=production`; `src/lib/db/validate-url.ts` then rejects a localhost `DATABASE_URL`, so the app silently uses `local_json_fallback`. Live local testing must use `next dev -p 3001`. This is intentional.
- `npm run db:migrate` fails locally because `drizzle.config.ts` does not load `.env.local`.
- Shell variables do not persist between tool calls — export `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `BASE_URL` in the same command as the script.
- Docker Desktop is at `C:\Users\darai\AppData\Local\Programs\DockerDesktop\`; start it, then `docker compose up -d postgres`.
- Clerk and MongoDB variables are **not read by any code** (no `@clerk/*` or `mongodb` package). Auth is native (session + scrypt).

## 5. NOT verified
Real deployment (host config), Docker image build, production env vars on the host, production caching headers, Razorpay (placeholder keys, `assisted_lead` mode), WhatsApp delivery, screen readers, MongoDB credentials (DNS only).

## 6. Needed from the owner
1. Hosting choice: Vercel (per CLAUDE.md) or Railway/Docker (per `railway.toml`, `Dockerfile`).
2. Production Postgres URL with `sslmode=require` (not localhost).
3. Production domain; new strong `SESSION_SECRET`.
4. Razorpay test keys (Key ID, Secret, Webhook Secret) — or confirm staying on `assisted_lead`.
5. Decide: wire in Clerk / MongoDB (recommend not), real password reset (needs email provider + key), push branch + open PR.
6. **Rotate** the MongoDB password, Clerk secret and Cloudinary secret (they were pasted in chat).
7. Client content: legal text, street address / Maps, delivery window / cutoff / pincodes.

## 7. Next steps once 1–2 are provided
Build the Docker image, run it with production settings against a non-localhost DB, run migrations, run the live API and sweep scripts against it, then re-check caching headers (PUB-13).
