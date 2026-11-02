const fs = require("fs");

async function main() {
  const docContent = fs.readFileSync("docs/verification-matrix-report.md", "utf8");

  const docPayload = {
    title: "HUM-P1-03: Automated Verification Matrix (Vitest & Test Matrix)",
    format: "markdown",
    body: docContent,
    baseRevisionId: null,
  };

  const docUrl = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}/documents/automated_verification_matrix`;
  console.log("PUT Document URL:", docUrl);

  const docRes = await fetch(docUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(docPayload),
  });

  const docResText = await docRes.text();
  console.log("Document Upload Status:", docRes.status);
  if (!docRes.ok) {
    throw new Error(`Failed to upload document: ${docRes.status} ${docResText}`);
  }

  const commentText = [
    "Completed HUM-P1-03 (HUM-23): Automated Verification Matrix (Vitest & Test Matrix):",
    "",
    "1. **Pricing Invariants Unit Suite (`tests/unit/pricing-invariants.test.ts`)**:",
    "   - Verified canonical monthly subscription pricing: Standard Plan is ₹3,500/month; Premium Plan is ₹4,000/month.",
    "   - Enforced strict inequality: Premium > Standard with ₹500 price differential.",
    "   - Enforced box inclusions and frequencies matching client brochure (daily fruits/veg/salad/sprouts; 3-day dry fruits vs daily upgraded dry fruits, MedCity Labs discounts, and Berrybeats curated juices).",
    "   - Verified server authoritative pricing rejection of client-side price tampering (e.g., submitting `monthlyPriceINR: 100`).",
    "   - Verified fallback to `DEFAULT_CHECKOUT_MODE = 'assisted_lead'` when client checkout configuration is spoofed.",
    "",
    "2. **Phone & Address Sanitization Suite (`tests/unit/sanitization.test.ts`)**:",
    "   - Extracted reusable sanitization and normalization module into `src/lib/sanitization.ts`.",
    "   - Verified phone normalization stripping whitespace, hyphens, parentheses, domestic trunk prefix (0), and international country codes (+91, 91).",
    "   - Verified 10-digit Indian mobile validation strictly enforcing `/^[6-9]\\d{9}$/`.",
    "   - Verified email validation and Indian 6-digit postal code validation (`/^[1-9][0-9]{5}$/`), including Bangalore postal division detection (`560xxx`).",
    "   - Verified string sanitization stripping XSS tags (`<script>`) and truncating to bounds, and complete delivery address sanitization.",
    "",
    "3. **Lead State Transitions Suite (`tests/unit/lead-transitions.test.ts`)**:",
    "   - Implemented and verified Finite State Machine in `src/lib/subscription-transitions.ts` (`VALID_SUBSCRIPTION_TRANSITIONS`).",
    "   - Verified strict invariant: new leads MUST initialize as `pending_confirmation` or `registration_submitted`, and NEVER `confirmed_active`.",
    "   - Verified perk denial invariant: `hasActivePerks` is strictly false for pending, paused, or cancelled leads, and true only for `confirmed_active`.",
    "   - Verified valid lifecycle progression (`registration_submitted` -> `pending_confirmation` -> `confirmed_active` -> `paused`/`cancelled`/`expired`) and blocked illegal bypasses.",
    "   - Tested lead persistence invariants with isolated test fixtures.",
    "",
    "4. **Production Build Smoke Tests (`tests/smoke/production-build.smoke.test.ts`)**:",
    "   - Verified production build artifacts (`.next/`, static chunks, routes manifest, build manifest).",
    "   - Verified security headers in routes manifest (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`).",
    "   - Verified route completeness across all 19 application and API endpoints.",
    "   - Verified production configuration sanity and client brochure grounding.",
    "",
    "5. **Execution Matrix & npm Scripts**:",
    "   - Configured `vitest.config.ts` and npm scripts (`npm test`, `npm run test:unit`, `npm run test:smoke`, `npm run test:vitest`).",
    "   - Full test matrix results: **4 test suites, 23 tests, 79 assertions, 100% PASS in 1.58s**.",
    "",
    "Authoritative task document published: [Automated Verification Matrix Report](/HUM/issues/HUM-23#document-automated_verification_matrix) and committed to `docs/verification-matrix-report.md`."
  ].join("\n");

  const patchPayload = {
    status: "done",
    comment: commentText,
  };

  const patchUrl = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH Issue URL:", patchUrl);

  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchPayload),
  });

  const patchResText = await patchRes.text();
  console.log("PATCH Issue Status:", patchRes.status);
  console.log("PATCH Issue Response:", patchResText);

  if (!patchRes.ok) {
    throw new Error(`Failed to patch issue status: ${patchRes.status} ${patchResText}`);
  }

  const patchJson = JSON.parse(patchResText);
  if (patchJson.status !== "done") {
    throw new Error(`Issue status is ${patchJson.status}, expected done`);
  }

  console.log("Successfully verified and closed task HUM-23!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
