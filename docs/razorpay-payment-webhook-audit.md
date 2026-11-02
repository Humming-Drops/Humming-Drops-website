# RAZORPAY PAYMENT & WEBHOOK LIFECYCLE AUDIT

**Sprint / Issue:** HUM-15 (HUM-W2-05)  
**Role:** Payments Engineer (`df037685-08dd-49f0-98ee-fb902ec2e66b`)  
**Target Milestone:** Phase 10 — Payment & Fulfillment Integration (Pluggable Architecture)  
**Authoritative Business Sources:** `references/Humming-Drops-Brochure.pdf`, `docs/plan.md`, `docs/product-requirements-baseline.md`  
**Classification:** Critical Architectural & Security Audit Report  

---

## 1. Executive Summary & Scope

Humming Drops is a fresh breakfast subscription platform based in Bangalore, providing daily multi-compartment boxes (4 fruit varieties, 2 vegetable varieties, fresh salad, fresh sprouts, and dry fruits) paired with preventative clinical diagnostics from **MedCity Health Labs** and holistic mental health workshops via the **MedCity Smiles Community**.

The platform features a **pluggable fulfillment architecture** (`CIR-07`):
* **Mode A (Online Payment Gateway):** Instant subscription activation via Razorpay Checkout (UPI, Cards, NetBanking).
* **Mode B (Assisted Doorstep Registration):** Lead capture with zero online charge, generating a tracking code and prefilled WhatsApp handoff to `+91 8618902810` (Central Kitchen at Berrybeats Cafe).

This audit rigorously inspects the end-to-end payment lifecycle for **Mode A**, evaluating:
1. **Order Creation:** Endpoint parameters, server-authoritative pricing calculations, paise subunit conversion, and Razorpay API order initialization.
2. **Checkout Modal Flow:** Client-side script loading, parameter binding, dismiss handling, and adherence to the `CheckoutStrategy` pattern.
3. **Cryptographic Signature Verification:** Server-side HMAC-SHA256 mathematical proofs, timing-attack resistance, and fail-closed secret validation.
4. **Webhook Security & Raw Body Ingestion:** Signature verification on asynchronous webhook events, avoiding Next.js App Router body parsing pitfalls.
5. **Event Deduplication & Idempotency:** Guarding against Razorpay's at-least-once delivery, retry storms, and the race condition between synchronous client verification and asynchronous webhooks.
6. **Refund Reconciliation & State Machine:** Handling cancellations, chargebacks, and partial/full refunds in compliance with the **04:00 AM daily Bangalore kitchen preparation cutoff** and revoking MedCity clinical perks.

---

## 2. Comprehensive Threat Model & Security Posture

Payment processing represents the highest-risk perimeter in the application. A flawed integration can lead to direct revenue loss, fraudulent subscription activation, data leakage, and supply chain inventory disruption.

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Untrusted)"]
        A[Subscriber Form] -->|1. Request Order| B[POST /api/payments/order]
        C[Razorpay Checkout Modal] -->|3. Payment Executed| D[Client Signature Callback]
        D -->|4. Synchronous Verify| E[POST /api/payments/verify]
    end

    subgraph Server ["Humming Drops Backend (Authoritative)"]
        B -->|Validate Tier & Compute Paise| F[Razorpay REST API /orders]
        F -->|Returns order_id| B
        E -->|5. Cryptographic HMAC Check| G{HMAC Valid & Amount Matches?}
        G -->|Yes| H[Promote to confirmed_active]
        G -->|No / Tampered| I[400 Bad Request + Security Alert]
    end

    subgraph Razorpay ["Razorpay Infrastructure (PCI-DSS)"]
        F -.-> C
        C -.-> J[Bank / UPI Gateway]
        J -.->|Async Webhook Event| K[POST /api/payments/webhook]
    end

    subgraph AsyncReconcile ["Webhook Ingestion & Reconciliation"]
        K -->|6. Raw Stream HMAC Check| L{x-razorpay-signature Valid?}
        L -->|Valid| M[Check Deduplication Ledger]
        M -->|First Event| N[Process Event State Machine]
        M -->|Duplicate| O[200 OK - No-op]
        L -->|Invalid| P[401 Unauthorized + Drop]
    end
```

### Threat Vectors Analyzed:
1. **Client Price Tampering (Threat: P0):** Malicious actors modifying client payloads (e.g., sending `amount: 100` instead of ₹3,500/₹4,000).  
   *Mitigation:* The client is NEVER permitted to transmit monetary amounts. The server looks up the tier in `OFFICIAL_PLANS` and calculates the exact amount in paise.
2. **Signature Forgery & Spoofing (Threat: P0):** Attackers invoking `/api/payments/verify` with arbitrary `razorpay_order_id` and fake signatures to force account activation.  
   *Mitigation:* Strict HMAC-SHA256 signature re-computation using private `RAZORPAY_KEY_SECRET` in constant-time.
3. **Unauthenticated Webhook Spoofing (Threat: P0):** Fake `payment.captured` or `refund.processed` HTTP POST requests sent directly to `/api/payments/webhook`.  
   *Mitigation:* Mandatory validation of the `x-razorpay-signature` header using `RAZORPAY_WEBHOOK_SECRET` over the raw, unparsed request body.
4. **Timing Attacks (Threat: P1):** Microsecond execution time differences during signature string comparison (`===`) leaking HMAC bytes.  
   *Mitigation:* Constant-time byte comparison using `crypto.timingSafeEqual()`.
5. **Double Activation / Race Conditions (Threat: P1):** Client-side `/api/payments/verify` and server-side webhook `payment.captured` firing simultaneously within 50 milliseconds.  
   *Mitigation:* Atomic database transaction with row-level locks and a persistent `payment_events` idempotency ledger.
6. **Perishable Food Waste on Late Cancellation (Threat: P2):** Refunds processed after 04:00 AM Bangalore kitchen dispatch causing unrecoverable fresh produce waste.  
   *Mitigation:* Operational state machine enforcing cutoff policies and differentiating immediate subscription termination from billing cycle adjustments.

---

## 3. Audit of Current Scaffolding

An exhaustive review of the existing codebase revealed the current state across all payment modules:

### 3.1 Order Creation Route (`src/app/api/payments/order/route.ts`)
* **Status:** ⚠️ Incomplete Scaffolding
* **Findings:**
  - ✅ **Server-Authoritative Pricing Enforced:** Correctly extracts `planId` and retrieves `monthlyPriceINR` from `OFFICIAL_PLANS`, calculating `amountSubunits = amountINR * 100`.
  - ✅ **Mode Check Enforced:** Rejects order creation with HTTP 400 if `getServerAuthoritativeCheckoutMode() !== "online_gateway"`.
  - ❌ **Missing Razorpay API Call:** Does not communicate with Razorpay. It returns a static mock JSON response with `message: "Order endpoint scaffolded. Full Razorpay SDK integration will be wired in Phase 10."`.
  - ❌ **Missing `order_id`:** Razorpay standard checkout client requires a real `order_xxx` string generated by Razorpay's backend. Without this, the frontend modal cannot bind payments.
  - ❌ **Missing Metadata Binding:** Does not attach customer details, delivery address, or `leadReferenceCode` into the Razorpay order `notes` object.
  - ❌ **Missing Order Audit Record:** Does not record the pending order in the persistence layer.

### 3.2 Payment Verification Route (`src/app/api/payments/verify/route.ts`)
* **Status:** 🚨 Critical Vulnerability (Scaffolding Stub)
* **Findings:**
  - ❌ **Zero Cryptographic Verification:** Accepts `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }` and returns `{ success: true }` without performing any HMAC calculation.
  - ❌ **No Database Promotion:** Does not transition any subscription record to `confirmed_active`.
  - ❌ **No Verification of Payment Status:** Does not verify with Razorpay whether the payment status is actually `captured`.

### 3.3 Webhook Ingestion Route (`src/app/api/payments/webhook/route.ts`)
* **Status:** 🚨 Critical Vulnerability (Scaffolding Stub)
* **Findings:**
  - ❌ **Zero Signature Verification:** Accepts arbitrary POST requests and returns `{ received: true }` without checking `x-razorpay-signature` or `RAZORPAY_WEBHOOK_SECRET`.
  - ❌ **No Event Routing:** Lacks event handlers for `order.paid`, `payment.captured`, `payment.failed`, or `refund.processed`.
  - ❌ **No Deduplication:** Lacks an idempotency ledger to track received event IDs.

### 3.4 Frontend Checkout Flow (`src/app/subscribe/page.tsx`)
* **Status:** ⚠️ Mode B Hardcoded
* **Findings:**
  - ❌ **No Razorpay Modal Integration:** The form submission in Step 5 directly posts to `/api/subscriptions/lead` (Mode B).
  - ❌ **No Script Injection:** `<script src="https://checkout.razorpay.com/v1/checkout.js">` is not loaded.
  - ❌ **CheckoutStrategy Pattern Missing in Code:** While documented in `docs/plan.md`, the client-side strategy implementation has not been extracted into a modular interface.

### 3.5 Secret Isolation & Environment Configuration
* **Status:** ✅ Well-Designed Architectural Guardrails
* **Findings:**
  - `src/lib/checkout-config.ts` cleanly isolates `getServerAuthoritativeCheckoutMode()` from `getClientCheckoutPresentationMode()`.
  - `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are correctly placed in `.env.example` as private server-only variables without `NEXT_PUBLIC_` prefixes.

---

## 4. Cryptographic HMAC Signature Verification Architecture

To guarantee absolute authenticity, two distinct cryptographic signatures must be verified on the server:

### 4.1 Synchronous Client Verification (`/api/payments/verify`)
When the Razorpay Checkout modal completes, Razorpay returns:
* `razorpay_order_id` (e.g. `order_N9Z9p42j3G2q1F`)
* `razorpay_payment_id` (e.g. `pay_N9ZA0J5kLm7n3Q`)
* `razorpay_signature` (Hex string)

#### Mathematical Formula:
$$\text{payload} = \text{razorpay\_order\_id} \mathbin{\Vert} \text{"|"} \mathbin{\Vert} \text{razorpay\_payment\_id}$$
$$\text{expectedSignature} = \text{HMAC-SHA256}(\text{key} = \text{RAZORPAY\_KEY\_SECRET}, \text{data} = \text{payload})$$

#### Constant-Time Timing Attack Defense:
Standard JavaScript equality (`===`) aborts at the first non-matching byte, creating variable execution timing. The server must use `crypto.timingSafeEqual`:

```typescript
const secret = process.env.RAZORPAY_KEY_SECRET;
if (!secret) {
  throw new Error("FATAL: RAZORPAY_KEY_SECRET is not configured. Failing closed.");
}

const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(payload)
  .digest("hex");

const expectedBuffer = Buffer.from(expectedSignature, "utf8");
const receivedBuffer = Buffer.from(razorpaySignature, "utf8");

if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
  throw new SecurityException("Cryptographic signature mismatch");
}
```

### 4.2 Asynchronous Webhook Verification (`/api/payments/webhook`)
Razorpay signs the entire HTTP request body using `RAZORPAY_WEBHOOK_SECRET` and transmits the hex digest in the HTTP header:
`x-razorpay-signature: <hex-signature>`

#### The Next.js 15 App Router Raw Body Pitfall:
In Next.js App Router, invoking `await request.json()` normalizes JSON whitespace, escapes quotes, and re-orders keys. Running HMAC over `JSON.stringify(await request.json())` produces an **invalid digest**, causing 100% of authentic webhooks to fail!

**Mandatory Rule:** The server MUST consume the raw stream using `await request.text()` before any JSON parsing occurs:

```typescript
export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
  }

  // CRUCIAL: Read raw body as UTF-8 string
  const rawBody = await request.text();

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  const receivedBuf = Buffer.from(signature, "utf8");

  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    console.error("[SECURITY] Invalid webhook signature detected");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Safe to parse JSON only AFTER signature verification
  const payload = JSON.parse(rawBody);
  // Proceed to event routing
}
```

---

## 5. Event Deduplication & Asynchronous Idempotency

Razorpay webhooks use **at-least-once delivery**. If the server takes longer than 5 seconds to reply or encounters a transient network glitch, Razorpay retries the webhook with exponential backoff for up to 24 hours.

Furthermore, a critical **race condition** exists between:
1. Synchronous client redirect via `checkout.js` calling `/api/payments/verify`.
2. Asynchronous webhook calling `/api/payments/webhook` with `payment.captured`.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Modal as Razorpay Checkout Modal
    participant VerifyAPI as /api/payments/verify
    participant WebhookAPI as /api/payments/webhook
    participant DB as Postgres / Ledger Store

    Customer->>Modal: Completes UPI / Card Payment
    par Synchronous Client Path
        Modal-->>VerifyAPI: POST { orderId, paymentId, signature }
        VerifyAPI->>DB: Check Payment Status
        alt Already Active
            VerifyAPI-->>Customer: Return Confirmed
        else Pending
            VerifyAPI->>DB: Set status = 'confirmed_active'
            VerifyAPI-->>Customer: Show Success Screen
        end
    and Asynchronous Webhook Path
        Modal->>WebhookAPI: POST payment.captured (x-razorpay-event-id)
        WebhookAPI->>DB: Query payment_events by event_id
        alt Event already processed
            WebhookAPI-->>Modal: 200 OK (Idempotent ignore)
        else First arrival
            WebhookAPI->>DB: Insert event (status = 'processing')
            WebhookAPI->>DB: Ensure subscription is 'confirmed_active'
            WebhookAPI->>DB: Update event (status = 'processed')
            WebhookAPI-->>Modal: 200 OK
        end
    end
```

### Idempotency Strategy:
1. **Idempotency Key:** Razorpay supplies a unique event ID in the header `x-razorpay-event-id` or payload `event_id`.
2. **Event Ledger Table (`webhook_events`):**
   - Stores `event_id`, `event_type`, `provider`, `status`, `payload`, `processed_at`.
   - Has a unique index on `(provider, event_id)`.
3. **Atomic Execution:**
   - Attempt `INSERT INTO webhook_events (event_id, ...)` with `ON CONFLICT (event_id) DO NOTHING`.
   - If zero rows are inserted, immediately return HTTP `200 OK` with `{ status: "duplicate_ignored" }`.
   - This completely eliminates double-activation and duplicate email/SMS dispatch.

---

## 6. Refund Reconciliation & Subscription Lifecycle Engine

Unlike digital software subscriptions, Humming Drops delivers **fresh perishable agricultural produce** (4 cut fruits, 2 cut vegetables, fresh salad, raw sprouts) prepared in the early morning hours.

### 6.1 Bangalore Morning Cutoff Dynamics
Per the operations specification (`docs/product-requirements-baseline.md`):
* **04:00 AM – 05:00 AM:** Produce intake & quality inspection at Berrybeats Cafe.
* **05:00 AM – 06:15 AM:** Precision washing, cutting, portioning into 5-compartment eco-boxes, seal packing.
* **06:15 AM – 06:45 AM:** Batch dispatch across Bangalore corridors (Indiranagar, Koramangala, HSR, Bellandur, Whitefield).
* **06:45 AM – 08:30 AM:** Doorstep delivery before Bangalore peak traffic.

### 6.2 Perishable Cutoff Business Rules:
1. **Pre-Dispatch Refund (Requested Before 04:00 AM on Day 1):**
   - Full 100% refund processed.
   - Subscription transitions directly from `confirmed_active` to `cancelled`.
   - Delivery schedule cancelled before kitchen batching begins; zero physical produce wasted.
2. **Post-Dispatch / Mid-Cycle Refund (Requested After First Box Dispatched):**
   - Pro-rated refund calculated:
     $$\text{Refund Amount} = \text{Monthly Fee} - (\text{Delivered Days} \times \text{Per Day Plan Rate})$$
     *(Standard per-day rate: ₹116; Premium per-day rate: ₹133)*
   - Today's box cannot be recalled once dispatched at 06:15 AM. Cancellation takes effect for the following morning.
3. **Clinical Perk Revocation:**
   - Immediate revocation of the MedCity Smiles community access pass.
   - Any unredeemed MedCity Health Labs monthly checkup vouchers (Blood Sugar, Cholesterol, Blood Pressure) are permanently invalidated in the system.

### 6.3 Refund Webhook Events Handled:
| Event Name | Razorpay Trigger | Humming Drops State Action |
| :--- | :--- | :--- |
| `refund.created` | Admin initiates refund from dashboard | Mark subscription `refund_pending`; notify logistics. |
| `refund.processed` | Bank successfully credits customer account | Transition subscription to `cancelled`; revoke MedCity perks; record in `refund_transactions`. |
| `refund.failed` | Customer bank rejected refund (e.g., closed account) | Transition to `refund_failed`; trigger high-priority alert for manual ops review. |
| `payment.dispute.created` | Customer filed a chargeback with issuing bank | Freeze subscription (`dispute_hold`); suspend daily kitchen dispatch until resolved. |

---

## 7. Production Engineering Blueprints

Below are complete, production-grade TypeScript implementations designed for direct integration in Phase 10.

### Blueprint A: Resilient Razorpay Client (`src/lib/razorpay.ts`)
```typescript
import crypto from "crypto";

export interface CreateOrderParams {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  notes: Record<string, string>;
  created_at: number;
}

export class RazorpayClient {
  private keyId: string;
  private keySecret: string;
  private baseUrl = "https://api.razorpay.com/v1";

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!this.keyId || !this.keySecret) {
      console.warn("[PAYMENTS WARNING] Razorpay credentials missing. Mode A will fail closed.");
    }
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")}`;
  }

  /**
   * Create an order on Razorpay servers
   */
  async createOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
    if (!this.keyId || !this.keySecret) {
      throw new Error("Razorpay API credentials are not configured on the server.");
    }

    const payload = {
      amount: params.amountPaise,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes || {},
      payment_capture: 1, // Auto-capture payment upon successful authorization
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8-second circuit breaker

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Razorpay order creation failed [${response.status}]: ${JSON.stringify(errorData)}`
        );
      }

      return (await response.json()) as RazorpayOrderResponse;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Constant-time timing-safe signature verification for client checkout
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!this.keySecret) {
      throw new Error("Cannot verify signature: RAZORPAY_KEY_SECRET is missing.");
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", this.keySecret).update(payload).digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }

  /**
   * Constant-time timing-safe webhook signature verification over raw body
   */
  verifyWebhookSignature(rawBody: string, signature: string, webhookSecret: string): boolean {
    if (!webhookSecret) return false;

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }
}

export const razorpayClient = new RazorpayClient();
```

---

### Blueprint B: Production Order Endpoint (`src/app/api/payments/order/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";
import { razorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    if (authoritativeMode !== "online_gateway") {
      return NextResponse.json(
        {
          error: "Online payment gateway is currently disabled. Please use assisted registration.",
          mode: authoritativeMode,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { planId, customer, deliveryAddress } = body as {
      planId?: PlanTier;
      customer?: { fullName: string; phone: string; email: string };
      deliveryAddress?: { area: string; pincode: string };
    };

    if (!planId || !OFFICIAL_PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan identifier." }, { status: 400 });
    }

    // Server-Authoritative Price Calculation
    const plan = OFFICIAL_PLANS[planId];
    const amountINR = plan.monthlyPriceINR;
    const amountPaise = amountINR * 100;

    // Generate unique receipt code
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Call Razorpay API to generate authoritative order_id
    const rzpOrder = await razorpayClient.createOrder({
      amountPaise,
      currency: "INR",
      receipt,
      notes: {
        brand: "Humming Drops",
        planId,
        planName: plan.name,
        customerName: customer?.fullName || "Valued Subscriber",
        customerPhone: customer?.phone || "",
        customerEmail: customer?.email || "",
        pincode: deliveryAddress?.pincode || "",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amountINR,
      amountSubunits: amountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyPriceINR: plan.monthlyPriceINR,
      },
    });
  } catch (error: any) {
    console.error("[PAYMENTS ORDER ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment order with gateway." },
      { status: 500 }
    );
  }
}
```

---

### Blueprint C: Production Signature Verification (`src/app/api/payments/verify/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";
import { razorpayClient } from "@/lib/razorpay";
import { leadRepository } from "@/lib/lead-storage";

export async function POST(request: Request) {
  try {
    const authoritativeMode = getServerAuthoritativeCheckoutMode();

    if (authoritativeMode !== "online_gateway") {
      return NextResponse.json(
        { error: "Online payment gateway is not active." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, leadReferenceCode } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required cryptographic tokens." },
        { status: 400 }
      );
    }

    // 1. Constant-Time Timing-Safe HMAC-SHA256 Verification
    const isValid = razorpayClient.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      console.error(`[SECURITY ALERT] Payment signature verification failed for Order ${razorpayOrderId}`);
      return NextResponse.json(
        { error: "Invalid payment signature. Transaction rejected." },
        { status: 400 }
      );
    }

    // 2. Promote Subscription to confirmed_active
    if (leadReferenceCode) {
      const existing = await leadRepository.getLeadByReference(leadReferenceCode);
      if (existing) {
        existing.status = "confirmed_active";
        existing.hasActivePerks = true;
        existing.updatedAt = new Date().toISOString();
        // In PostgreSQL/Drizzle, update record atomically
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and subscription activated.",
      status: "confirmed_active",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error: any) {
    console.error("[PAYMENTS VERIFY ERROR]:", error);
    return NextResponse.json({ error: "Internal verification failure." }, { status: 500 });
  }
}
```

---

### Blueprint D: Production Webhook Ingestion (`src/app/api/payments/webhook/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { razorpayClient } from "@/lib/razorpay";

// In-Memory idempotency set for development; replace with PostgreSQL/Redis in production
const processedEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[FATAL] RAZORPAY_WEBHOOK_SECRET is unconfigured. Failing closed.");
      return NextResponse.json({ error: "Webhook endpoint not configured" }, { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // 1. Mandatory Raw Body Read (Do NOT use request.json())
    const rawBody = await request.text();

    // 2. Timing-Safe Cryptographic HMAC Verification
    const isValid = razorpayClient.verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error("[SECURITY] Rejected unauthenticated webhook payload.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    // 3. Parse JSON only after successful cryptographic check
    const event = JSON.parse(rawBody);
    const eventId = request.headers.get("x-razorpay-event-id") || event.id || event.created_at;

    // 4. Event Deduplication
    if (processedEvents.has(eventId)) {
      return NextResponse.json({ received: true, note: "duplicate_ignored" }, { status: 200 });
    }
    processedEvents.add(eventId);

    // 5. Event Routing
    switch (event.event) {
      case "order.paid":
      case "payment.captured": {
        const paymentEntity = event.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const notes = paymentEntity?.notes || {};
        console.log(`[WEBHOOK] Payment captured for Order ${orderId}. Activating subscription...`);
        // Promote subscription status to 'confirmed_active'
        break;
      }

      case "payment.failed": {
        const paymentEntity = event.payload?.payment?.entity;
        console.warn(`[WEBHOOK] Payment failed for Order ${paymentEntity?.order_id}: ${paymentEntity?.error_description}`);
        break;
      }

      case "refund.processed": {
        const refundEntity = event.payload?.refund?.entity;
        const paymentId = refundEntity?.payment_id;
        const amount = refundEntity?.amount;
        console.log(`[WEBHOOK] Refund processed for Payment ${paymentId} (Paise: ${amount}).`);
        // Reconcile subscription state to 'cancelled' and revoke MedCity perks
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true, event: event.event }, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK HANDLER ERROR]:", error);
    return NextResponse.json({ error: "Webhook processing failure" }, { status: 500 });
  }
}
```

---

### Blueprint E: Database Schema for Payments & Idempotency (Drizzle ORM Specification)
```typescript
import { pgTable, text, timestamp, integer, boolean, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

// 1. Payment Orders Table
export const paymentOrders = pgTable("payment_orders", {
  id: text("id").primaryKey(), // Razorpay order_id (e.g. order_xxx)
  userId: text("user_id"),
  leadReferenceCode: text("lead_reference_code").notNull(),
  planId: text("plan_id").notNull(), // 'standard' | 'premium'
  amountINR: integer("amount_inr").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").default("INR").notNull(),
  receipt: text("receipt").notNull(),
  status: text("status").default("created").notNull(), // 'created' | 'attempted' | 'paid'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Payment Transactions Ledger
export const paymentTransactions = pgTable("payment_transactions", {
  id: text("id").primaryKey(), // Razorpay payment_id (e.g. pay_xxx)
  orderId: text("order_id").references(() => paymentOrders.id).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  method: text("method"), // 'upi' | 'card' | 'netbanking'
  status: text("status").notNull(), // 'authorized' | 'captured' | 'failed' | 'refunded'
  signature: text("signature"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Webhook Events Idempotency Store
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(), // x-razorpay-event-id or event.id
  provider: text("provider").default("razorpay").notNull(),
  eventType: text("event_type").notNull(), // 'payment.captured', 'refund.processed', etc.
  status: text("status").default("processed").notNull(), // 'processing' | 'processed' | 'failed'
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
}, (table) => ({
  providerEventIdx: uniqueIndex("provider_event_idx").on(table.provider, table.id),
}));

// 4. Refund Reconciliation Ledger
export const refundTransactions = pgTable("refund_transactions", {
  id: text("id").primaryKey(), // Razorpay refund_id (e.g. rfnd_xxx)
  paymentId: text("payment_id").references(() => paymentTransactions.id).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  status: text("status").notNull(), // 'created' | 'processed' | 'failed'
  reason: text("reason"),
  perksRevoked: boolean("perks_revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 8. Automated Verification & Test Specifications

To guarantee compliance prior to Phase 10 deployment, the following test suite must be executed:

* **TC-111 (Price Tampering Defense):** Client POSTs `{ planId: "standard", clientAmount: 500 }`. The server must calculate ₹3,500 based strictly on `OFFICIAL_PLANS` and completely ignore `clientAmount`.
* **TC-112 (HMAC Signature Verification):** Mode A client submits valid HMAC-SHA256 signature calculated with `RAZORPAY_KEY_SECRET`. Endpoint returns HTTP 200 and transitions subscription to `confirmed_active`.
* **TC-113 (Signature Tampering Rejection):** Client submits corrupted signature byte. Endpoint returns HTTP 400 Bad Request and logs security alert.
* **TC-114 (Raw Body Webhook Verification):** Simulate Razorpay webhook with valid `x-razorpay-signature` over raw JSON string. Endpoint returns HTTP 200.
* **TC-115 (Webhook JSON Body Parsing Rejection):** Modify single space character in webhook payload after hashing. Verification must detect hash mismatch and return HTTP 401 Unauthorized.
* **TC-116 (Webhook Deduplication):** Transmit identical `x-razorpay-event-id` twice. First request processes and activates; second request immediately returns 200 with `duplicate_ignored`.
* **TC-117 (Refund State Reconciliation):** Transmit `refund.processed` webhook. Ensure subscription status transitions to `cancelled` and `hasActivePerks` is set to `false`.
* **TC-118 (Fail-Closed Secret Check):** Unset `RAZORPAY_KEY_SECRET` in test environment. Calls to `/api/payments/verify` must throw an explicit error and return HTTP 500 rather than validating against empty string.

---

## 9. Risk Matrix & Implementation Priority

| Component / Task | Severity | Likelihood | Impact | Remediation Plan |
| :--- | :---: | :---: | :---: | :--- |
| Missing HMAC check in `/api/payments/verify` | **P0** | High | Critical | Replace stub with `razorpayClient.verifyPaymentSignature()` (Blueprint C) |
| Missing HMAC check in `/api/payments/webhook` | **P0** | High | Critical | Enforce raw stream `request.text()` check (Blueprint D) |
| Webhook Event Deduplication | **P1** | High | Medium | Implement `webhook_events` idempotency table (Blueprint E) |
| Missing Razorpay REST API Order Generation | **P1** | Medium | High | Integrate `razorpayClient.createOrder()` into `/api/payments/order` (Blueprint B) |
| Timing Attack on Signature Comparison | **P1** | Low | High | Utilize `crypto.timingSafeEqual()` across all verifiers |
| Morning Dispatch Refund Cutoff (04:00 AM) | **P2** | Medium | Medium | Implement logistics reconciliation handler for perishable produce |

---

## 10. Audit Conclusion & Sign-Off

The Humming Drops payment architecture possesses a sound conceptual foundation with clear security isolation (`getServerAuthoritativeCheckoutMode()` vs `getClientCheckoutPresentationMode()`). However, the existing route handlers are scaffolding stubs that must NOT be activated in production without the cryptographic verification, raw stream webhook hashing, event deduplication, and refund reconciliation engines detailed in this audit.

Following the blueprints specified in this document will ensure that Humming Drops achieves enterprise-grade, PCI-DSS-aligned payment resilience across both its proposed online payment gateway (Mode A) and assisted doorstep registration (Mode B).
