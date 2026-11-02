# HUM-W2-07: DevOps, Staging Isolation & Deployment Runbook (Runbook RB-05)

**Document Identifier:** HUM-W2-07 / Runbook RB-05  
**Issue Reference:** HUM-17  
**Target Milestone:** Week 2 — Verification, Security, Payment & DevOps  
**Role / Author:** DevOps Engineer (Agent `9efd7d18-6b67-4134-ba8f-a53f71a1256f`)  
**Status:** Approved Architectural Specification & Production Operational Runbook  
**Target Platform:** Railway PaaS (Next.js 15 Standalone Dockerfile) + PostgreSQL 16+  
**Authority Reference:** `docs/plan.md` (Phase 17), `docs/specifications/drizzle-orm-schema-spec.md` (HUM-W1-02), `docs/razorpay-payment-webhook-audit.md` (HUM-W2-05), `references/Humming-Drops-Brochure.pdf`  

---

## 1. Executive Summary & Infrastructure Topology

This runbook establishes the production and staging deployment architecture for **Humming Drops & MedCity Smiles**. Humming Drops delivers daily fresh breakfast boxes (4 fruits, 2 vegetables, salad, sprouts, and dry fruits) prepared every morning at the Berrybeats Cafe central kitchen in Bangalore, integrated with preventative health checkups (Blood Sugar, Cholesterol, BP) by MedCity Health Labs.

To ensure continuous availability, high security, and zero-downtime releases, the application is deployed as a containerized Next.js 15 application on **Railway PaaS**, coupled with managed **PostgreSQL 16+** and edge TLS/SSL routing.

```
                      [ Client Traffic (Desktop / Mobile) ]
                                      │
                                      ▼
             [ Railway Edge Router / Anycast CDN (Cloudflare) ]
                     - Custom Domain: www.hummingdrops.com
                     - Automatic Let's Encrypt TLS/SSL (HTTPS)
                     - HTTP to HTTPS 301 Redirect
                                      │
                                      ▼
             [ Railway Orchestrator / Zero-Downtime Rolling Router ]
                     - Healthcheck Probe: GET /api/health
                     - Active Deployment vs Standby Deployment
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
         [ Active Container (v1.0) ]        [ New Container (v1.1) ]
         - Next.js Standalone Runner         - Next.js Standalone Runner
         - Non-root user (UID 1001)          - Non-root user (UID 1001)
         - Alpine Linux Base                 - Awaiting /api/health 200 OK
                     │                                 │
                     └────────────────┬────────────────┘
                                      │
                                      ▼
          [ Railway Managed Infrastructure & Integrated Services ]
        ┌──────────────────────────────┬──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
 [ PostgreSQL 16+ DB ]       [ Razorpay Gateway ]      [ S3 / Supabase Storage ]
 - Drizzle ORM Connection    - Mode A Orders & Webhooks- HIPAA/PII Health Vitals
 - SSL Enforced (pooler)     - Test vs Live Keys       - Private Reports Bucket
```

---

## 2. Next.js 15 Containerization & Multi-Stage Dockerfile Audit

### 2.1 Why Standalone Dockerfile Over Default Nixpacks

While Railway natively supports automated builds via Nixpacks, production enterprise standards for Humming Drops mandate a custom **Multi-Stage Dockerfile** with `output: 'standalone'` enabled in `next.config.mjs` for four decisive reasons:

| Evaluation Dimension | Railway Nixpacks Default | Next.js Standalone Dockerfile | Rationale / Decision |
| :--- | :--- | :--- | :--- |
| **Image Size Footprint** | ~1.2 GB to 1.8 GB | **~110 MB to 140 MB** | 90% footprint reduction; drastic decrease in cold start and deployment transfer time. |
| **Build Reproducibility** | Depends on dynamic Nix buildpack resolver | **Deterministic Alpine Linux (Node 20 LTS)** | Guarantees identical dependencies, libc versions, and binary behavior across machines. |
| **Security Hardening** | Runs frequently as root or default buildpack user | **Unprivileged System User (`nextjs:nodejs`, UID 1001)** | Container breakout prevention; complies with principle of least privilege. |
| **Dependency Boundary** | Copies entire `node_modules` (including build-time dev deps) | **Only bundles standalone server & production traces** | DevDependencies, build tools, and unused libraries are eliminated from production attack surface. |

### 2.2 Dockerfile Multi-Stage Breakdown (`Dockerfile`)

The production Dockerfile is organized into four distinct stages:

1. **Stage 1: `base` (`node:20-alpine`)**
   - Installs `libc6-compat` for Alpine Linux, required for optimized native bindings (such as `sharp` image optimization and SWC binary compilation).
   - Sets working directory to `/app`.
2. **Stage 2: `deps`**
   - Copies `package.json` and `package-lock.json`.
   - Executes `npm ci` to produce a clean, deterministic tree of dependencies without altering lockfiles.
3. **Stage 3: `builder`**
   - Mounts installed `node_modules` from the `deps` stage.
   - Copies application source code.
   - Injects `NEXT_TELEMETRY_DISABLED=1` and `NODE_ENV=production`.
   - Executes `npm run build`. Next.js inspects `next.config.mjs` (`output: 'standalone'`) and outputs:
     - `.next/standalone`: Lean Node.js server containing only imported packages.
     - `.next/static`: Static chunks and CSS files.
4. **Stage 4: `runner`**
   - Minimal Node.js 20 Alpine runtime.
   - Creates dedicated unprivileged system group `nodejs` (GID 1001) and user `nextjs` (UID 1001).
   - Copies `public/`, `.next/standalone`, and `.next/static` with strict ownership `chown nextjs:nodejs`.
   - Sets unprivileged user: `USER nextjs`.
   - Exposes port 3000 and starts `node server.js`.

### 2.3 Build Context Optimization (`.dockerignore`)

To keep build contexts under 2MB and prevent secret leakage:
- Excludes `.git`, `node_modules`, `.next`, `docs`, `references`, `scratch`, `dashboard`.
- Strictly excludes all `.env*` files so secrets can never be baked into Docker image layers.

---

## 3. Staging Environment Isolation Specification

To protect customer trust, prevent test transactions from polluting financial ledgers, and prevent test notifications from being dispatched to the Bangalore kitchen line (`8618902810`), the **Staging** environment must be strictly isolated from **Production**.

### 3.1 Isolation Architecture Matrix

| Dimension | Local Development | Staging Environment | Production Environment | Isolation Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Host / URL** | `http://localhost:3000` | `https://staging.hummingdrops.com` (or Railway PR domain) | `https://www.hummingdrops.com` | DNS & Host header isolation |
| **Database Instance** | Local PostgreSQL Docker container | Railway Managed PostgreSQL (`hummingdrops_staging`) | Railway Managed PostgreSQL (`hummingdrops_prod`) | Completely separate database clusters & credentials |
| **Database User & Schema** | `postgres` / `public` | `staging_app_user` / `public` | `prod_app_user` / `public` | Zero cross-database permissions |
| **Razorpay API Keys** | Test Mode (`rzp_test_*`) | Test Mode (`rzp_test_*`) | Live Mode (`rzp_live_*`) | Keys locked to distinct Razorpay merchant environments |
| **Webhook Endpoint** | Local tunnel (Ngrok / CLI proxy) | `https://staging.hummingdrops.com/api/payments/webhook` | `https://www.hummingdrops.com/api/payments/webhook` | Distinct webhook secrets and signature verification |
| **Customer PII & Health Data** | Synthetic mocked records | Synthetic anonymized seed data | Strictly real subscriber medical & delivery records | Zero production data imported to staging |
| **Bangalore Hub WhatsApp Alerts** | Console log mock output | Dedicated QA WhatsApp number or internal sandbox | Official WhatsApp line (`+91 8618902810`) | Prevents kitchen staff confusion from test orders |
| **Session Cookies** | `hd_session_dev` (`SameSite=Lax`, `Secure=false`) | `__Host-hd_session_staging` (`SameSite=Lax`, `Secure=true`) | `__Host-hd_session_prod` (`SameSite=Lax`, `Secure=true`, domain-bound) | `__Host-` prefix prevents cross-subdomain cookie hijacking |
| **Error Tracking** | Local terminal stack traces | Sentry Environment: `staging` | Sentry Environment: `production` | Tagged issue grouping with alert thresholds |

### 3.2 Staging Verification Rules
1. **No Production Data In Staging:** Production database dumps must **never** be restored directly into the staging database without running an automated PII anonymization script (scrubbing names, phone numbers, delivery addresses, and health vitals).
2. **Pre-Production Gating:** Any code merge targeting `main` must pass automated smoke tests in the isolated Staging environment before production deployment.
3. **Zero Real Financial Charges:** Staging is hardcoded to test card numbers, test UPI handles (`success@razorpay`), and mock netbanking.

---

## 4. Environment Secret Audit & Credential Governance

### 4.1 Secret Exposure Audit Findings

An audit of the environment configuration model identified the following critical security boundaries:

```
[ BROWSER RUNTIME / CLIENT BUNDLE ]
   ├── Public Domain & URL: NEXT_PUBLIC_APP_URL
   ├── Official Contact Info: NEXT_PUBLIC_OFFICIAL_PHONE, NEXT_PUBLIC_OFFICIAL_EMAIL
   ├── UI Mode Hint: NEXT_PUBLIC_CHECKOUT_MODE ('assisted_lead' vs 'online_gateway')
   └── Razorpay Public Key: NEXT_PUBLIC_RAZORPAY_KEY_ID (rzp_test_* / rzp_live_*)
   ──────────────────────────────────────────────────────────────────────────
   ▲ STRICT AIR-GAP: Next.js only inlines variables with NEXT_PUBLIC_ prefix
   ──────────────────────────────────────────────────────────────────────────
[ NODE.JS RUNTIME / SERVER ONLY ]
   ├── Authoritative Mode: CHECKOUT_MODE
   ├── Database Connection: DATABASE_URL (Contains user, password, host, port)
   ├── Razorpay Secret: RAZORPAY_KEY_SECRET (Used for HMAC verification & orders)
   ├── Webhook Secret: RAZORPAY_WEBHOOK_SECRET (Used for signature validation)
   ├── Supabase Admin: SUPABASE_SERVICE_ROLE_KEY (Bypasses Row-Level Security)
   ├── Cookie Encryption: SESSION_SECRET (Minimum 32 bytes random entropy)
   └── Health Storage: STORAGE_SECRET_KEY (Direct S3 / Storage bucket credentials)
```

> [!CAUTION]
> **CRITICAL SECURITY RULE:**  
> Never prefix backend secrets (`DATABASE_URL`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`) with `NEXT_PUBLIC_`.  
> Prefixing a secret with `NEXT_PUBLIC_` causes webpack/Turbopack to bake the plaintext secret directly into client-side JavaScript bundles, completely compromising database integrity and payment processing.

### 4.2 Comprehensive Environment Specification

| Variable Name | Environment Scope | Required In Prod | Sensitivity Level | Description & Validation Rule |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | System Runtime | Yes | Low | Must be `production` in live container. |
| `APP_ENV` | Application | Yes | Low | `production` \| `staging` \| `development`. |
| `PORT` | Container Network | Yes | Low | Defaults to `3000`. Set dynamically by Railway. |
| `HOSTNAME` | Container Network | Yes | Low | Must be `0.0.0.0` for container binding. |
| `NEXT_PUBLIC_APP_URL` | Public Client | Yes | Low | Canonical URL: `https://www.hummingdrops.com`. |
| `CHECKOUT_MODE` | Server Runtime | Yes | Medium | Authoritative fulfillment mode (`assisted_lead` or `online_gateway`). |
| `NEXT_PUBLIC_CHECKOUT_MODE`| Public Client | Yes | Low | Client hint for checkout button labels. |
| `NEXT_PUBLIC_OFFICIAL_PHONE`| Public Client | Yes | Low | `8618902810` (Authoritative from Brochure). |
| `NEXT_PUBLIC_OFFICIAL_EMAIL`| Public Client | Yes | Low | `hummingdrops@gmail.com`. |
| `NEXT_PUBLIC_OFFICIAL_LOCATION`| Public Client | Yes | Low | `"Berrybeats cafe, Bangalore"`. |
| `DATABASE_URL` | Server Runtime | Yes | **CRITICAL** | PostgreSQL connection string with SSL enabled. |
| `DATABASE_POOL_MAX` | Server Runtime | Yes | Medium | Maximum connection pool size (default: 10). |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`| Public Client | When Mode A | Low | Razorpay public key ID (`rzp_live_*`). |
| `RAZORPAY_KEY_SECRET` | Server Runtime | When Mode A | **CRITICAL** | Razorpay secret key for server API authentication. |
| `RAZORPAY_WEBHOOK_SECRET` | Server Runtime | When Mode A | **CRITICAL** | Webhook secret for HMAC-SHA256 signature verification. |
| `SESSION_SECRET` | Server Runtime | Yes | **CRITICAL** | 256-bit cryptographic key for signing HTTP cookies. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Runtime | Optional | **CRITICAL** | Supabase admin key; must be kept strictly server-side. |
| `LOG_LEVEL` | Server Runtime | No | Low | `info` in production, `debug` in staging. |

### 4.3 Secret Injection on Railway

Secrets must never be stored in files committed to git. On Railway:
1. Open the **Humming Drops Web Service** on the Railway Dashboard.
2. Navigate to the **Variables** tab.
3. Use the **RAW Editor** or individual variable inputs to configure each key.
4. For staging, create an isolated Railway Environment called `staging` with dedicated variable overrides.

---

## 5. Railway Zero-Downtime Deployment Architecture

### 5.1 Rolling Deployment Lifecycle

Railway performs zero-downtime rolling deployments using active healthcheck validation:

```
[ Step 1: Trigger ]
   Git Push to `main` branch -> Railway triggers Dockerfile build.
   Image built in isolated build container; static assets generated.

[ Step 2: Container Instantiation ]
   Railway provisions new container instance (Deployment B).
   Runs `node server.js` on port 3000.
   Traffic is NOT routed to Deployment B yet. Deployment A continues serving 100% of traffic.

[ Step 3: Health Probe Validation ]
   Railway begins polling: GET http://[Deployment-B-IP]:3000/api/health
   Timeout threshold: 120 seconds.
   Retry cadence: Every 3 seconds.

   Case 1: /api/health responds with HTTP 200 {"status": "healthy"}
           -> Deployment B marked READY.
           -> Move to Step 4 (Traffic Cutover).

   Case 2: /api/health times out or returns non-200 after 120s
           -> Deployment B marked FAILED.
           -> Deployment B terminated immediately.
           -> Deployment A continues serving traffic uninterrupted.
           -> Zero user-facing downtime!

[ Step 4: Atomic Traffic Cutover ]
   Railway's edge proxy switches routing table to Deployment B.
   Grace period initiated: Deployment A given 30 seconds to finish in-flight HTTP requests.

[ Step 5: Graceful Teardown ]
   Deployment A receives SIGTERM.
   Process finishes outstanding database queries and exits cleanly.
   Deployment B is now the single active production instance.
```

### 5.2 Healthcheck Endpoint Specification (`/api/health`)

The healthcheck route (`src/app/api/health/route.ts`) provides deep container diagnostics:
- **Uptime:** Number of seconds the Node process has been running.
- **Memory Footprint:** Tracks RSS, Heap Total, and Heap Used in megabytes to catch memory leaks early.
- **Service Status:** Confirms checkout strategy (`CHECKOUT_MODE`) is recognized and operational.
- **Cache-Control:** Strictly configured with `no-store, no-cache, must-revalidate` to prevent edge proxies or browser caches from returning stale health responses.

---

## 6. Zero-Downtime Rollback Runbook

When a production defect, broken customer journey, payment webhook error, or critical performance regression is detected, the on-call engineer must execute an immediate rollback.

### 6.1 Rollback Trigger Criteria

An emergency rollback must be initiated immediately if any of the following occur within 15 minutes of release:
1. **HTTP 5xx Error Spike:** Rate exceeds 1.0% of total HTTP requests over a 3-minute rolling window.
2. **Payment Failure Spike:** Razorpay order creation or verification failure rate exceeds 2.0%.
3. **Database Pool Saturation:** Active PostgreSQL connections reach 90% of pool capacity with hanging queries.
4. **Checkout Regression:** Users are unable to submit assisted leads or complete payment checkout.
5. **High Latency (P99):** Application P99 latency spikes above 2,500ms.

---

### 6.2 Rollback Procedure A: Railway 1-Click Dashboard (Recommended: < 30s)

This is the fastest and safest rollback mechanism:

1. **Access Railway Project:**
   Navigate to [https://railway.app/dashboard](https://railway.app/dashboard) and open the `humming-drops-prod` project.
2. **Select Web Service:**
   Click on the **Humming Drops Web** service card.
3. **Open Deployments Tab:**
   Click on the **Deployments** tab in the service navigation.
4. **Identify Prior Known Good Deployment:**
   Locate the deployment immediately prior to the failed release (marked with a green checkmark and previous timestamp).
5. **Trigger Rollback:**
   Click the three vertical dots (`⋮`) next to the prior good deployment.
   Select **Redeploy / Rollback to this Deployment**.
6. **Observe Healthcheck Cutover:**
   Watch the live deployment log. Railway will spin up the prior verified container image, validate `/api/health`, and instantly route traffic back to it without dropping active connections.
7. **Verify Service Health:**
   Confirm `/api/health` returns HTTP 200 and error rates return to 0%.

---

### 6.3 Rollback Procedure B: Railway CLI Command Line (< 45s)

If the web dashboard is unreachable or for automated incident response scripts:

```bash
# 1. Authenticate with Railway (if not already logged in)
railway login

# 2. Link to production project
railway link --project humming-drops-prod

# 3. List recent deployments to identify the stable deployment ID
railway deployments

# Sample output:
# ID                                    STATUS    CREATED
# 84f29a01-3b7c-4821-9311-c992a71bf9e2  FAILED    2 minutes ago  (Current Bad)
# 41d8e90a-1a2b-4c3d-8e9f-0123456789ab  SUCCESS   3 hours ago    (Prior Good)

# 4. Instant rollback to prior deployment ID
railway rollback --deployment 41d8e90a-1a2b-4c3d-8e9f-0123456789ab

# 5. Monitor rollback logs and probe health
railway logs
curl -i https://www.hummingdrops.com/api/health
```

---

### 6.4 Rollback Procedure C: Git Revert (Persistent Fix in Git History)

To ensure the git repository reflects the rollback and prevents accidental re-deployment:

```bash
# 1. Ensure clean working directory on main branch
git checkout main
git pull origin main

# 2. Revert the problematic commit (creates a new inverse commit)
git revert -m 1 HEAD --no-edit

# 3. Verify local build passes
npm run build

# 4. Push revert commit to trigger Railway CI/CD build
git push origin main

# 5. Monitor Railway build and automatic health check deployment
```

---

### 6.5 Post-Rollback Verification Checklist

Immediately following rollback execution, the on-call engineer must verify:
- [ ] `curl -s https://www.hummingdrops.com/api/health | jq .status` returns `"healthy"`.
- [ ] Homepage (`/`) loads under 1 second with dual-brand tokens intact.
- [ ] Plans page (`/plans`) displays correct Standard (₹3,500) and Premium (₹4,000) pricing.
- [ ] Lead capture (`/api/subscriptions/lead`) successfully writes and generates a tracking code.
- [ ] Railway metrics dashboard shows CPU < 25%, Memory < 50%, and 0 continuous 5xx errors.
- [ ] Incident notification sent to team communication channels.

---

## 7. Database Migration Safety & Zero-Downtime Schema Management

A common cause of rollback failure is **coupling application code changes with breaking database schema changes**. If code is rolled back while the database has dropped a column, both versions will crash.

To achieve zero downtime, Humming Drops strictly mandates the **Expand-and-Contract (Parallel Run) Pattern** for all PostgreSQL schema modifications:

```
[ Release 1: Expand (Non-Breaking) ]
  - Add new columns as NULLABLE or with sensible DEFAULT values.
  - Add new tables and additive indices with `CONCURRENTLY`.
  - NEVER rename or drop existing columns.
  - Old code and new code both run successfully against this schema!

[ Release 2: Deploy Code (Dual-Read / Dual-Write) ]
  - Deploy new application version that writes to both old and new columns.
  - Reads fall back to old column if new column is empty.
  - If code must be rolled back, the database remains 100% compatible!

[ Release 3: Backfill Data ]
  - Run background migration script to populate new columns for legacy rows.
  - Verify 100% data integrity and consistency.

[ Release 4: Contract (Cleanup) ]
  - Once new code is verified and stable in production for > 72 hours:
  - Remove fallback reads from application code.
  - In a subsequent release, drop deprecated columns in an off-peak window.
```

### 7.1 Forbidden Direct DDL Operations in Production
- `ALTER TABLE ... DROP COLUMN ...` (Forbidden during active deployments)
- `ALTER TABLE ... RENAME COLUMN ...` (Forbidden; use expand-and-contract)
- `ALTER TABLE ... ALTER COLUMN ... SET NOT NULL` (Must add default or validate existing rows first)
- `CREATE INDEX ...` without `CONCURRENTLY` (Locks tables against writes in PostgreSQL)

---

## 8. Incident Management, Escalation & Post-Mortem Protocol

### 8.1 Incident Severity Levels

| Severity | Definition | Target Response (MTTA) | Target Resolution (MTTR) | Example Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| **P0 — Critical** | Total outage or critical transaction failure affecting all users. | **< 10 minutes** | **< 30 minutes** | Site completely down (502 Bad Gateway); database unreachable; payment gateway failing 100% of checkouts. |
| **P1 — High** | Core business functionality impaired for a significant segment. | **< 20 minutes** | **< 2 hours** | Assisted lead capture failing; MedCity health vitals inaccessible; delivery pause buttons non-functional. |
| **P2 — Medium** | Non-critical bug; core subscription and ordering path operational. | **< 2 hours** | **< 24 hours** | Minor UI layout glitch on specific mobile browser; marketing copy mismatch; non-blocking analytics error. |
| **P3 — Low** | Minor cosmetic defect, documentation typo, or feature request. | **< 1 business day** | Next release cycle | Internal admin dashboard styling polish; minor CSS animation stutter. |

### 8.2 Escalation Communication Hierarchy

1. **Level 1: On-Call DevOps / Backend Engineer**
   - Assesses error logs in Railway and Sentry.
   - Executes immediate rollback if P0/P1 criteria are met.
2. **Level 2: Technical Lead / Engineering Manager**
   - Coordinates cross-team debugging (Database, Payments, Frontend).
   - Manages communication status updates.
3. **Level 3: Bangalore Hub Operations Liaison (`8618902810`)**
   - Alerted if order processing or WhatsApp lead intake is interrupted.
   - Switches to manual fallback intake if necessary.

### 8.3 Post-Mortem Template (Blameless Root Cause Analysis)

Every P0 or P1 incident requires a written post-mortem within 48 hours following this structure:
1. **Incident Overview:** Date, time, duration, severity, and impacted customer percentage.
2. **Customer Impact:** Number of lost leads, failed payments, or affected deliveries.
3. **Timeline of Events (IST):** From code commit to alert trigger, triage, rollback initiation, and recovery.
4. **Root Cause Analysis (5 Whys):** Deep technical investigation into why the failure occurred.
5. **What Went Well:** Effective alarms, rapid rollback execution, zero customer PII leakage.
6. **Where We Got Lucky:** Fallback systems that prevented worse outcomes.
7. **Action Items & Preventative Measures:** Jira/Paperclip tickets created to prevent recurrence with designated owners and due dates.

---

## 9. Verification & Acceptance Sign-Off

This runbook has been verified against the project specifications and deployment infrastructure:
- [x] Next.js 15 Standalone Dockerfile verified with multi-stage non-root container pattern.
- [x] `.dockerignore` audited to eliminate cache, node_modules, and `.env*` secrets from build context.
- [x] `railway.toml` deployment manifest configured with `/api/health` probe and auto-restart policy.
- [x] Healthcheck endpoint `/api/health` implemented with dynamic uptime, memory metrics, and cache headers.
- [x] Environment secret audit completed; `.env.example` updated with strict security guidelines and Staging Isolation Matrix.
- [x] Zero-downtime rollback runbooks documented for Railway Dashboard, Railway CLI, and Git Revert.
- [x] Database migration safety guidelines defined using Expand-and-Contract architecture.
