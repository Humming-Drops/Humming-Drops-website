# Runbook RB-04: Incident Management & Troubleshooting Playbooks

**Document:** `docs/runbooks/incident-management.md`  
**Target Audience:** On-Call Engineers, Technical Leads, System Administrators  
**Escalation Contact:** Lead Developer / Project Maintainer  

---

## 1. Incident Severity Definitions

| Severity | Definition | Response Target | Examples |
| :--- | :--- | :--- | :--- |
| **P0 — Critical** | System-wide outage; subscriptions or website completely inaccessible. | Immediate (< 15 mins) | Frontend down with 500 error; payment webhook compromise; PII exposed publicly. |
| **P1 — Major** | Core conversion flow impaired for a segment of users. | < 1 hour | `/subscribe` failing on submission; WhatsApp pre-filled link broken; Razorpay API errors. |
| **P2 — Moderate** | Non-critical functionality degraded; workaround available. | < 4 hours | Dashboard health vitals chart not rendering; styling defect on mobile breakpoint. |
| **P3 — Minor** | Minor cosmetic defect or documentation inaccuracy. | Next business sprint | Typos in blog or FAQ; minor spacing discrepancy in footer. |

---

## 2. Emergency Troubleshooting Playbooks

### Playbook 1: Corrupted `data/leads.json` Recovery (Mode B)

**Symptom:** `POST /api/subscriptions/lead` returns HTTP 500 with `JSON.parse` error or empty array error.

**Diagnostic Steps:**
1. Check file integrity on server:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('data/leads.json', 'utf8'))"
   ```
2. If invalid JSON is reported:
   * Inspect the latest writes at the bottom of `data/leads.json`.
   * Check for an unclosed bracket `]` or trailing comma.
3. **Recovery Procedure:**
   * Create an immediate backup:
     ```bash
     cp data/leads.json data/leads.json.bak.$(date +%s)
     ```
   * Use an automated JSON formatting tool or repair the trailing delimiter.
   * If unrecoverable, restore from the latest automated snapshot or git checkpoint.
   * If completely empty, reinitialize with:
     ```json
     []
     ```

### Playbook 2: Razorpay Payment Signature Verification Failure (Mode A)

**Symptom:** `POST /api/payments/verify` returns HTTP 400 `Invalid payment signature`.

**Diagnostic Steps:**
1. Verify `RAZORPAY_KEY_SECRET` matches the secret configured in the active Razorpay Dashboard (Test vs Live mode mismatch).
2. Check the signature calculation formula:
   ```typescript
   const expectedSignature = crypto
     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
     .digest("hex");
   ```
3. Ensure no trailing whitespace or extra newline characters exist in `.env.production`.
4. Verify server clock synchronization (NTP drift can cause webhook timestamp rejections).

### Playbook 3: Mode Mismatch (`online_gateway` vs `assisted_lead`)

**Symptom:** Client shows online payment popup but server rejects order creation, or client shows WhatsApp button while server expects gateway token.

**Diagnostic Steps:**
1. Check both environment variables:
   ```bash
   echo $CHECKOUT_MODE
   echo $NEXT_PUBLIC_CHECKOUT_MODE
   ```
2. **Remediation:** Both variables must be aligned:
   * For Assisted Lead (Mode B):
     ```bash
     CHECKOUT_MODE=assisted_lead
     NEXT_PUBLIC_CHECKOUT_MODE=assisted_lead
     ```
   * For Online Gateway (Mode A):
     ```bash
     CHECKOUT_MODE=online_gateway
     NEXT_PUBLIC_CHECKOUT_MODE=online_gateway
     ```
3. Rebuild the application (`npm run build`) to ensure Next.js inlines the updated `NEXT_PUBLIC_*` values into client bundles.

### Playbook 4: Security Incident (Customer PII Exposure)

**Symptom:** Unauthenticated requests querying customer names, phone numbers, or health vitals.

**Immediate Remediation:**
1. Temporarily restrict the affected route in Next.js middleware (`src/middleware.ts`) or route handler.
2. Confirm `GET /api/subscriptions/lead` requires an exact reference code (`ref=HD-REG-...`). Never allow unparameterized bulk GET queries.
3. Invalidate compromised session tokens or rotate API credentials immediately.
4. Notify the compliance lead and project owner.
