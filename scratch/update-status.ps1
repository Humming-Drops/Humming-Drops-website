$commentText = @"
Completed HUM-W1-02: Persistence, API & Drizzle ORM Schema Specification.

Saved [HUM-W1-02: Persistence, API & Drizzle ORM Schema Specification](/HUM/issues/HUM-12#document-drizzle_orm_schema_spec).

### Key Deliverables & Findings:
1. **Local JSON Persistence Audit (`data/leads.json`):**
   - Evaluated 5 critical production failure modes in `JsonFileLeadRepository`: uncoordinated race conditions (TOCTOU) causing lost updates, synchronous write crash vulnerabilities (0-byte corruption), O(N) memory/CPU bottlenecks on linear scans, unencrypted PII exposure (violating DPDPA 2023), and container ephemerality on Railway/cloud platforms where redeploys destroy local files.
2. **Railway PostgreSQL Architecture:**
   - Specified managed PostgreSQL 16+ on Railway with mandatory TLS 1.3 (`sslmode=require`), connection pooling configured for Next.js App Router Node.js runtime (`max: 10`, `idleTimeoutMillis: 30000`), and private VPC networking.
3. **Comprehensive Drizzle ORM Schema (`drizzle-orm/pg-core`):**
   - Specified 11 relational tables (`users`, `profiles`, `subscription_plans`, `user_subscriptions`, `delivery_addresses`, `dietary_preferences`, `health_vitals`, `community_sessions`, `session_registrations`, `payments`, `subscription_audit_logs`) with typed enums, cascade rules, partial indexes, and Drizzle relations graph.
4. **ACID Transaction Guarantees:**
   - Formalized multi-table atomic registration transaction pattern with automatic rollback, `READ COMMITTED` isolation, and pessimistic row locking (`SELECT FOR UPDATE`) for subscription state transitions.
5. **Finite State Machine (FSM) & Lifecycle Rules:**
   - Documented 6-state lifecycle (`registration_submitted`, `pending_confirmation`, `confirmed_active`, `paused`, `cancelled`, `expired`) with state transition diagram, matrix, and strict guardrails: assisted WhatsApp leads ALWAYS start in `pending_confirmation` with `hasActivePerks = false`.
6. **Clean Architecture & Migration Path:**
   - Preserved `ILeadRepository` interface, implemented `DrizzlePostgresLeadRepository`, and defined a zero-downtime data migration runbook from `data/leads.json` to Railway PostgreSQL.
"@

$payloadObj = @{
    status = "done"
    comment = $commentText
}

$jsonPayload = $payloadObj | ConvertTo-Json -Depth 5

$headers = @{
    "Authorization" = "Bearer $($env:PAPERCLIP_API_KEY)"
    "Content-Type" = "application/json"
    "X-Paperclip-Run-Id" = $env:PAPERCLIP_RUN_ID
}

$url = "$($env:PAPERCLIP_API_URL)/api/issues/$($env:PAPERCLIP_TASK_ID)"

Write-Output "PATCHing issue status to done at $url"
$response = Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($jsonPayload))
$response | Select-Object id, identifier, title, status | ConvertTo-Json
