-- RR-006: production PostgreSQL persistence for Razorpay orders,
-- transactions, and webhook idempotency, replacing the JSON-file-backed
-- repository previously used unconditionally by /api/payments/*.
--
-- These are separate from the pre-existing "payments" table (which
-- requires a NOT NULL subscription_id) because an order is created
-- before any subscription/lead necessarily exists -- the Mode A
-- (online_gateway) checkout flow creates the Razorpay order first, then
-- only links it to a lead reference at verification time.

DO $$ BEGIN
  CREATE TYPE "payment_order_status" AS ENUM ('created', 'attempted', 'paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "payment_transaction_status" AS ENUM ('authorized', 'captured', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "payment_orders" (
  "id" text PRIMARY KEY, -- Razorpay order id
  "plan_id" text NOT NULL,
  "amount_inr" integer NOT NULL,
  "amount_paise" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'INR',
  "receipt" text NOT NULL,
  "status" "payment_order_status" NOT NULL DEFAULT 'created',
  "lead_reference_code" text,
  "notes" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "payment_orders_lead_ref_idx" ON "payment_orders" ("lead_reference_code");

CREATE TABLE IF NOT EXISTS "payment_transactions" (
  "id" text PRIMARY KEY, -- Razorpay payment id
  "order_id" text NOT NULL REFERENCES "payment_orders"("id") ON DELETE RESTRICT,
  "amount_paise" integer NOT NULL,
  "status" "payment_transaction_status" NOT NULL,
  "signature" text,
  "verified_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "payment_transactions_order_idx" ON "payment_transactions" ("order_id");

CREATE TABLE IF NOT EXISTS "payment_webhook_events" (
  "id" text PRIMARY KEY, -- Razorpay event id (or synthesized fallback)
  "provider" text NOT NULL DEFAULT 'razorpay',
  "event_type" text NOT NULL,
  "status" text NOT NULL,
  "payload" jsonb,
  "processed_at" timestamptz NOT NULL DEFAULT now()
);
