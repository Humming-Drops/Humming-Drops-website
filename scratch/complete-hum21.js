async function main() {
  const comment = `### HUM-P1-01: Drizzle ORM Schema, Railway PostgreSQL Client & Lead Migration Complete

1. **PostgreSQL 16 Relational Schema (\`src/lib/db/schema.ts\`):**
   - Implemented production Drizzle ORM schema matching \`docs/specifications/drizzle-orm-schema-spec.md\`.
   - **Enums:** \`subscription_status\`, \`fulfillment_mode\`, \`dietary_type\`, \`payment_method\`, \`payment_status\`, \`user_role\`.
   - **Tables:** \`users\`, \`profiles\`, \`subscription_plans\`, \`user_subscriptions\`, \`delivery_addresses\`, \`dietary_preferences\`, \`health_vitals\`, \`community_sessions\`, \`session_registrations\`, \`payments\`, \`subscription_audit_logs\`.
   - **Relations Graph:** Full type-safe relations for relational query API (\`db.query.userSubscriptions.findMany\`).

2. **Connection Pooling & Cloud Driver (\`src/lib/db/index.ts\`):**
   - Configured \`postgres\` client connection pool with configurable pool size (\`DATABASE_POOL_MAX\`, default 10), connection timeout (5s), idle timeout (30s), and SSL enforcement.
   - Designed lazy evaluation proxy for \`db\` and exported \`isDatabaseConfigured(): boolean\` to ensure zero runtime errors during offline builds.

3. **Dual Persistence Architecture & Strict Invariants (\`src/lib/lead-storage.ts\`):**
   - \`DrizzlePostgresLeadRepository implements ILeadRepository\`: Atomic multi-table ACID transaction wrapping user resolution, profile creation, subscription creation, address recording, dietary preferences, and audit log appending.
   - **Strict Invariants:** Every lead initialized with \`status: "pending_confirmation"\` and \`hasActivePerks: false\`.
   - \`JsonFileLeadRepository\` preserved for zero-network-dependency local development.
   - \`HybridLeadRepository\` automatically delegates to PostgreSQL when \`DATABASE_URL\` is present and falls back gracefully to \`data/leads.json\` when unset.
   - Implemented \`updateLead()\` supporting payment webhook confirmations and cancellations.

4. **Data Migration & Seeding Utility (\`src/lib/db/migrate-leads.ts\`):**
   - Automatically seeds canonical plans: Standard (₹3,500/mo) and Premium (₹4,000/mo).
   - Idempotently imports existing leads from \`data/leads.json\` into Railway PostgreSQL.

5. **Health Endpoint Telemetry (\`src/app/api/health/route.ts\`):**
   - Exposes active \`persistenceDriver\` (\`"postgresql_drizzle"\` vs \`"local_json_fallback"\`).

6. **Full Test & Build Verification:**
   - Unit verification suite (\`tests/unit/drizzle-persistence.test.ts\`): Schema enums, tables, relations, and invariant checks verified.
   - \`npm run test\`: 5/5 test suites passed (0 failures).
   - \`npm run typecheck\`: Strict TypeScript \`tsc --noEmit\` with 0 errors.
   - \`npm run lint\`: 0 ESLint warnings or errors.
   - \`npm run build\`: 22/22 routes generated cleanly with exit code 0.`;

  const payload = {
    status: "done",
    comment: comment,
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH URL:", url);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.PAPERCLIP_API_KEY}`,
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
