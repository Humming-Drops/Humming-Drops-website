# Issue Register

Full evidence for each ID is in `MASTER_AUDIT_REPORT.md` §2. This is the tracking table only.

| ID | Title | Severity | Confidence | Area | Status |
|---|---|---|---|---|---|
| HD-AUD-001 | `CLAUDE.md` stack description (Supabase) is stale vs. actual Drizzle/Postgres code | P3 | Confirmed | Docs | Open |
| HD-AUD-002 | No authentication exists; `/dashboard/*` fully unauthenticated, login page fabricates session client-side | P0 | Confirmed | Auth | Open |
| HD-AUD-003 | Health dashboard fabricates specific clinical results for every visitor | P0 | Confirmed | Frontend / Trust | Open |
| HD-AUD-004 | Payment verify route doesn't bind paid order to the lead it activates (IDOR) | P1 | Confirmed | Payments | Open |
| HD-AUD-005 | Server-authoritative checkout mode silently falls back to client-controlled `NEXT_PUBLIC_*` flag | P1 | Confirmed | Security / Config | Open |
| HD-AUD-006 | Unauthenticated lead lookup still leaks customer name + area, no rate limiting, brute-forceable reference codes | P2 | Confirmed | Security / PII | Open |
| HD-AUD-007 | Admin-key comparison not constant-time (contradicts prior claim) | P3 | Confirmed | Security | Open |
| HD-AUD-008 | `perDayPriceINR` still defined/persisted in schema despite "100% purged" claim (not currently exposed via API) | P3 | Confirmed | Data hygiene | Open |
| HD-AUD-009 | No Playwright/E2E tests exist despite being claimed as delivered | P2 | Confirmed | Testing | Open |

**Not findings, but scope gaps — explicitly NOT VERIFIED (see MASTER_AUDIT_REPORT §4):** live Railway deployment, live Postgres connectivity, live Razorpay sandbox round-trip, backups/restore, monitoring/Sentry, multi-role RBAC (none exists in code), accessibility/responsive testing.
