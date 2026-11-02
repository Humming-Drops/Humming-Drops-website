async function main() {
  const comment = `### HUM-P1-02: Razorpay Production API Client & Webhook HMAC Verification Completed

1. **Resilient Razorpay Production Client (\`src/lib/razorpay.ts\`):**
   - Implemented \`RazorpayClient\` with 8-second circuit-breaker timeout via \`AbortController\`.
   - **Order Initialization (\`createOrder\`):** Handles server-authoritative paise subunit conversion, order payload generation, and auto-capture flag. Includes mock fallback for local development and CI testing environments.
   - **Payment Signature Verifier (\`verifyPaymentSignature\`):** Constant-time cryptographic HMAC-SHA256 verification using \`crypto.timingSafeEqual\` against \`\${orderId}|\${paymentId}\`. Fails closed if \`RAZORPAY_KEY_SECRET\` is unconfigured.
   - **Webhook Signature Verifier (\`verifyWebhookSignature\`):** Constant-time cryptographic HMAC-SHA256 verification over raw request body using \`RAZORPAY_WEBHOOK_SECRET\`.

2. **Webhook Event Deduplication & Ingestion (\`src/app/api/payments/webhook/route.ts\`):**
   - **Raw Stream Consumption:** Reads body via \`await request.text()\` before JSON parsing, resolving Next.js 15 App Router normalization hash shifts.
   - **Idempotency & Deduplication:** Integrated with \`paymentRepository\` (\`data/webhook-events.json\` and in-memory Set). Duplicate event transmissions immediately return HTTP 200 with \`{ received: true, note: "duplicate_ignored" }\`.
   - **Lifecycle & Perk Reconciliation:**
     * \`payment.captured\` / \`order.paid\`: Promotes subscription lead to \`confirmed_active\` with \`hasActivePerks: true\`.
     * \`refund.processed\`: Reconciles subscription to \`cancelled\` and permanently revokes MedCity clinical perks (\`hasActivePerks: false\`).
     * \`payment.failed\`: Records failed transaction audit in ledger.

3. **Production Order Creation Endpoint (\`src/app/api/payments/order/route.ts\`):**
   - Enforces server-authoritative checkout mode (\`online_gateway\`).
   - Ignores client-submitted monetary values, deriving price strictly from \`OFFICIAL_PLANS\` (Standard: ₹3,500 = 350,000 paise; Premium: ₹4,000 = 400,000 paise).
   - Generates unique receipt codes and records pending order in \`paymentRepository\`.

4. **Cryptographic Verification Endpoint (\`src/app/api/payments/verify/route.ts\`):**
   - Validates required cryptographic tokens (\`razorpayOrderId\`, \`razorpayPaymentId\`, \`razorpaySignature\`).
   - Executes constant-time HMAC-SHA256 verification.
   - Promotes subscriber lead to \`confirmed_active\` with \`hasActivePerks: true\` and audits transaction as \`captured\`.

5. **Automated Integration Test Suite (\`scratch/test-razorpay-payments.mjs\`):**
   - **TC-111 (Price Tampering Defense):** Passed. Client-submitted price ignored; order initialized for ₹3,500.
   - **TC-112 (Signature Verification & Activation):** Passed. Valid HMAC accepted; subscription promoted to \`confirmed_active\` with active perks.
   - **TC-113 (Signature Tampering Rejection):** Passed. Corrupted signature returned HTTP 400 Bad Request.
   - **TC-114 (Raw Stream Webhook Verification):** Passed. Valid raw stream signature returned HTTP 200.
   - **TC-115 (Webhook Payload Tampering Rejection):** Passed. Tampered body bytes returned HTTP 401 Unauthorized.
   - **TC-116 (Webhook Event Deduplication):** Passed. Duplicate event ID returned HTTP 200 with \`duplicate_ignored\`.
   - **TC-117 (Refund State Reconciliation):** Passed. \`refund.processed\` cancelled subscription and revoked clinical perks.

6. **Quality & Compilation:**
   - \`npm run typecheck\`: **0 errors** (Passed).
   - \`npm run lint\`: **0 warnings, 0 errors** (Passed).`;

  const payload = {
    status: "done",
    comment: comment,
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH URL:", url);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  console.log("HTTP status:", res.status);
  console.log("Updated status:", body.status);
  console.log("Issue id:", body.id);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
