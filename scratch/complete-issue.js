const fs = require("fs");

async function main() {
  const comment = `### Build, Typecheck & Verification Suite Baseline Completed

1. **TypeScript Baseline (\`npm run typecheck\`):**
   - Verified strict type checking (\`"strict": true\`) across all routes and components.
   - Result: **0 errors** (Passed).

2. **Next.js 15 Production Build (\`npm run build\`):**
   - Executed clean optimized build in 12.7s.
   - All 22 routes compiled (18 static prerendered routes + 4 dynamic API handlers).
   - Result: **Exit Code 0** (Passed).

3. **ESLint Missing Configuration:**
   - Identified that \`eslint\` and \`eslint-config-next\` were installed, but missing project configuration caused \`npm run lint\` to fail in CI/headless mode.
   - Resolved by creating \`.eslintrc.json\` with \`"extends": "next/core-web-vitals"\`.
   - Verified with \`npm run lint\`: **0 warnings, 0 errors** (Passed).

4. **Vitest & Playwright Test Coverage Proposal:**
   - Formulated a two-tier verification suite covering unit guardrails, HMAC payment verification, API routes, multi-step onboarding E2E, dual-brand switching, responsive viewports, and WCAG 2.1 AA accessibility.
   - Delivered full task document: [Verification Suite Baseline & Test Coverage Proposal](/HUM/issues/HUM-16#document-verification-report) (Revision \`9748ef21-94d4-4e7f-9589-6d980622aa76\`). Persisted in \`docs/verification-suite-proposal.md\`.`;

  const payload = {
    status: "done",
    comment: comment
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH URL:", url);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  console.log("HTTP status:", res.status);
  console.log("Updated status:", body.status);
  console.log("Issue id:", body.id);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
