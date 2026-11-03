-- RR-004: Clerk lifecycle synchronization support.

-- Clerk's user.created webhook fires before a phone number is
-- necessarily known (phone capture happens later, during subscription
-- onboarding). The existing NOT NULL constraint would reject every
-- Clerk-originated user row. A unique index still permits multiple
-- NULLs in PostgreSQL, so uniqueness is unaffected.
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;

-- Idempotency ledger for Clerk/Svix webhook deliveries, keyed by the
-- svix-id header (stable per logical event; Svix reuses it on retry).
CREATE TABLE IF NOT EXISTS "clerk_webhook_events" (
  "id" text PRIMARY KEY,
  "event_type" text NOT NULL,
  "processed_at" timestamptz NOT NULL DEFAULT now()
);
