const fs = require("fs");

async function main() {
  const content = fs.readFileSync("docs/runbooks/deployment-and-staging.md", "utf8");
  const docPayload = {
    title: "DevOps, Staging Isolation & Deployment Runbook",
    format: "markdown",
    body: content,
    baseRevisionId: null,
  };

  const docUrl = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}/documents/devops_runbook`;
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

  const docBody = await docRes.text();
  console.log("Document Upload Status:", docRes.status);
  console.log("Document Response:", docBody);

  if (!docRes.ok) {
    throw new Error(`Failed to upload document: ${docRes.status} ${docBody}`);
  }

  const commentText = [
    "Completed HUM-W2-07: DevOps, Staging Isolation & Deployment Runbook:",
    "",
    "- **Multi-Stage Next.js 15 Dockerfile & Standalone Optimization**: Authored production-ready 4-stage `Dockerfile` (base, deps, builder, runner) utilizing `output: 'standalone'` in `next.config.mjs` and Alpine Linux with unprivileged system user (`nextjs:nodejs`, UID 1001), achieving ~110MB image size and eliminating devDependencies from production attack surface.",
    "- **Railway PaaS Deployment Configuration**: Defined `railway.toml` specifying Dockerfile build pipeline, automatic restart policies on failure, and healthcheck probing with 120s timeout.",
    "- **Healthcheck API Probe (`/api/health`)**: Implemented dynamic diagnostic endpoint (`src/app/api/health/route.ts`) returning uptime, memory metrics (RSS, Heap), checkout strategy mode, and strict `Cache-Control: no-store` headers for zero-downtime rolling deploys.",
    "- **Environment Secret Audit & Comprehensive Matrix (`.env.example`)**: Audited all runtime and client configuration variables. Codified strict air-gap between public client values (`NEXT_PUBLIC_*`) and critical server-side secrets (`DATABASE_URL`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`). Established complete Staging vs Production Isolation Matrix.",
    "- **Zero-Downtime Rollback & Migration Safety Runbook**: Published comprehensive operational runbook (`docs/runbooks/deployment-and-staging.md` / RB-05) detailing automated health probe cutovers, 1-Click Railway Dashboard rollbacks (< 30s), CLI rollback commands, Git revert procedures, and Expand-and-Contract database schema migration safety rules.",
    "",
    "Authoritative task document published: [DevOps, Staging Isolation & Deployment Runbook](/HUM/issues/HUM-17#document-devops_runbook) and committed to `docs/runbooks/deployment-and-staging.md`."
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

  const patchBody = await patchRes.text();
  console.log("PATCH Issue Status:", patchRes.status);
  console.log("PATCH Issue Response:", patchBody);

  if (!patchRes.ok) {
    throw new Error(`Failed to patch issue status: ${patchRes.status} ${patchBody}`);
  }

  console.log("Successfully completed task HUM-17!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
