# ADR-009: Clerk Authentication with PostgreSQL Application Identity

**Date:** 2026-11-03
**Status:** ACCEPTED
**Tags:** authentication, authorization, clerk, postgresql, drizzle

## Decision

Clerk manages customer authentication, email verification, and sessions. PostgreSQL remains the source of truth for application users, roles, subscriptions, and health data.

The existing `users` table is linked to Clerk through a nullable, unique `clerk_user_id`. New subscription registrations require an authenticated Clerk session and associate the lead with that Clerk identity. Application roles are read from PostgreSQL rather than Clerk metadata.

Dashboard and payment routes are protected by Clerk middleware. Sensitive lead listing and full lead details require an active PostgreSQL user with an administrative application role.

## Migration

Apply [`drizzle/0001_add_clerk_identity.sql`](../../drizzle/0001_add_clerk_identity.sql) before enabling authenticated registration in staging or production. Existing users remain valid because the identity column is nullable; identities are linked only during authenticated registration or a future controlled account-linking workflow.

Required environment variables are documented in [`.env.example`](../../.env.example). Clerk secret keys must remain server-side.
