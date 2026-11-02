async function main() {
  const comment = `Completed the comprehensive Razorpay Payment & Webhook Lifecycle Audit (HUM-15 / HUM-W2-05).

Delivered authoritative audit document and production blueprints:
- Saved Paperclip document: [Razorpay Payment & Webhook Lifecycle Audit](/HUM/issues/HUM-15#document-razorpay_audit)
- Repository file: \`docs/razorpay-payment-webhook-audit.md\`

Key Deliverables & Architectural Findings:
1. **Threat Model & Vulnerability Analysis**: Evaluated existing route scaffolding stubs in \`/api/payments/order\`, \`/api/payments/verify\`, and \`/api/payments/webhook\`. Classified missing HMAC checks as P0 security vulnerabilities prior to production activation.
2. **Cryptographic Verification**: Specified constant-time HMAC-SHA256 verification (\`crypto.timingSafeEqual\`) and resolved the Next.js 15 App Router raw stream body consumption requirement (\`await request.text()\`) to prevent hash mismatch from JSON key re-ordering/whitespace normalization.
3. **Event Deduplication & Concurrency Handling**: Engineered a distributed idempotency mechanism using \`webhook_events\` ledger with unique constraints on \`(provider, event_id)\`, resolving race conditions between synchronous checkout verification and asynchronous Razorpay webhooks.
4. **Refund Lifecycle for Perishable Morning Delivery**: Codified business rules aligning refunds and cancellations with the 04:00 AM Bangalore kitchen preparation cutoff at Berrybeats Cafe hub, including immediate revocation of MedCity Smiles community perks and clinical testing vouchers.
5. **Production Blueprints**: Delivered complete TypeScript implementations for \`RazorpayClient\`, Order Generation, Signature Verification, Webhook Ingestion, and Drizzle ORM tables (\`payment_orders\`, \`payment_transactions\`, \`webhook_events\`, \`refund_transactions\`).
6. **Code Quality**: Verified \`npm run typecheck\` and \`npm run lint\` with zero errors.`;

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH URL:", url);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "done",
      comment: comment,
    }),
  });

  const body = await res.json();
  console.log("Status:", res.status);
  console.log("Updated status:", body.status);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
