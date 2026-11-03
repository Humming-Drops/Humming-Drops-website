-- Baseline schema migration, retrofitted onto a migration history that
-- previously began at 0001 and only ALTERed/ADDed onto these tables as
-- if they already existed. Every statement below is written to be safe
-- to run against a database that may already have some or all of these
-- objects (hand-created, or created by a process outside this migration
-- history): CREATE TABLE/TYPE/INDEX IF NOT EXISTS throughout, matching
-- the idempotent style already used in 0002_rbac_and_cms.sql.

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE "subscription_status" AS ENUM (
    'registration_submitted', 'pending_confirmation', 'confirmed_active',
    'paused', 'cancelled', 'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "fulfillment_mode" AS ENUM ('assisted_lead', 'online_gateway');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "dietary_type" AS ENUM ('standard', 'vegan', 'pure_fruit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "payment_method" AS ENUM ('razorpay', 'whatsapp_assisted', 'manual_offline');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "payment_status" AS ENUM ('pending', 'captured', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 0002_rbac_and_cms.sql adds the remaining staff-role values via ALTER TYPE.
DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('customer', 'admin', 'operations', 'nutritionist');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- CORE IDENTITY & PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "phone" text,
  "password_hash" text,
  "role" "user_role" NOT NULL DEFAULT 'customer',
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_idx" ON "users" ("phone");

CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "full_name" text NOT NULL,
  "phone" text NOT NULL,
  "email" text NOT NULL,
  "avatar_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_user_id_idx" ON "profiles" ("user_id");

-- ============================================================================
-- CANONICAL SUBSCRIPTION PLANS
-- ============================================================================

CREATE TABLE IF NOT EXISTS "subscription_plans" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "monthly_price_inr" integer NOT NULL,
  "per_day_price_inr" integer NOT NULL,
  "tagline" text NOT NULL,
  "features" jsonb NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Brochure-confirmed canonical pricing (see CLAUDE.md / docs/reference.md):
-- Standard ₹3,500/mo, Premium ₹4,000/mo. Matches CANONICAL_PLANS in
-- src/lib/lead-storage.ts, which also upserts these defensively at write
-- time -- this seed just ensures the FK target exists from a cold start.
INSERT INTO "subscription_plans" ("id", "name", "monthly_price_inr", "per_day_price_inr", "tagline", "features") VALUES
(
  'standard', 'Standard', 3500, 116,
  'Doctor-approved daily breakfast for diabetes & heart wellness',
  '["26 fresh morning breakfast boxes / month", "Free monthly doctor health checkup at MedCity Smiles", "Weekly live nutritionist and wellness webinars", "Flexible pause or vacation options"]'::jsonb
),
(
  'premium', 'Premium', 4000, 133,
  'Customized clinical nutrition with 1-on-1 dietitian support',
  '["Everything in Standard", "1-on-1 dedicated dietitian consultations & custom meal tuning", "Priority early-morning kitchen dispatch", "Exclusive seasonal fruit infusions & doctor notes"]'::jsonb
)
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- USER SUBSCRIPTIONS & LEADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS "user_subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "plan_id" text NOT NULL REFERENCES "subscription_plans"("id") ON DELETE RESTRICT,
  "status" "subscription_status" NOT NULL DEFAULT 'pending_confirmation',
  "fulfillment_mode" "fulfillment_mode" NOT NULL DEFAULT 'assisted_lead',
  "lead_reference_code" text NOT NULL,
  "has_active_perks" boolean NOT NULL DEFAULT false,
  "start_date" date,
  "renewal_date" date,
  "pause_start" date,
  "pause_end" date,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "user_subscriptions_user_id_idx" ON "user_subscriptions" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_subscriptions_ref_code_idx" ON "user_subscriptions" ("lead_reference_code");
CREATE INDEX IF NOT EXISTS "user_subscriptions_status_idx" ON "user_subscriptions" ("status");
CREATE INDEX IF NOT EXISTS "user_subscriptions_pending_idx" ON "user_subscriptions" ("status") WHERE "status" = 'pending_confirmation';

-- ============================================================================
-- DELIVERY ADDRESSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS "delivery_addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subscription_id" uuid NOT NULL REFERENCES "user_subscriptions"("id") ON DELETE CASCADE,
  "flat_no" text NOT NULL,
  "building_name" text NOT NULL,
  "street_address" text NOT NULL,
  "area" text NOT NULL,
  "city" text NOT NULL DEFAULT 'Bangalore',
  "pincode" text NOT NULL,
  "delivery_notes" text,
  "is_default" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "delivery_addresses_user_sub_idx" ON "delivery_addresses" ("user_id", "subscription_id");
CREATE INDEX IF NOT EXISTS "delivery_addresses_pincode_idx" ON "delivery_addresses" ("pincode");

-- ============================================================================
-- DIETARY PREFERENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS "dietary_preferences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subscription_id" uuid NOT NULL REFERENCES "user_subscriptions"("id") ON DELETE CASCADE,
  "dietary_type" "dietary_type" NOT NULL DEFAULT 'standard',
  "allergies" text[] NOT NULL DEFAULT '{}',
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "dietary_preferences_sub_idx" ON "dietary_preferences" ("subscription_id");

-- ============================================================================
-- HEALTH VITALS LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS "health_vitals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "checkup_date" date NOT NULL,
  "blood_sugar_fasting" numeric(5, 2),
  "blood_sugar_pp" numeric(5, 2),
  "cholesterol_total" numeric(5, 2),
  "blood_pressure_systolic" integer,
  "blood_pressure_diastolic" integer,
  "doctor_notes" text,
  "report_pdf_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "health_vitals_user_date_idx" ON "health_vitals" ("user_id", "checkup_date");

-- ============================================================================
-- COMMUNITY WEBINARS & MEMBER SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS "community_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "speaker_name" text NOT NULL,
  "speaker_title" text NOT NULL,
  "session_datetime" timestamptz NOT NULL,
  "duration_minutes" integer NOT NULL DEFAULT 60,
  "meeting_url" text,
  "description" text NOT NULL,
  "is_live" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session_registrations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "session_id" uuid NOT NULL REFERENCES "community_sessions"("id") ON DELETE CASCADE,
  "registered_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_session_unique_idx" ON "session_registrations" ("user_id", "session_id");

-- ============================================================================
-- PAYMENTS & TRANSACTION AUDIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS "payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subscription_id" uuid NOT NULL REFERENCES "user_subscriptions"("id") ON DELETE CASCADE,
  "payment_method" "payment_method" NOT NULL DEFAULT 'razorpay',
  "gateway_order_id" text,
  "gateway_payment_id" text,
  "gateway_signature" text,
  "amount_subunits" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'INR',
  "status" "payment_status" NOT NULL DEFAULT 'pending',
  "raw_webhook_payload" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "payments_gateway_order_idx" ON "payments" ("gateway_order_id");
CREATE INDEX IF NOT EXISTS "payments_sub_idx" ON "payments" ("subscription_id");

-- ============================================================================
-- SUBSCRIPTION & LEAD AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS "subscription_audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "subscription_id" uuid NOT NULL REFERENCES "user_subscriptions"("id") ON DELETE CASCADE,
  "previous_status" text,
  "new_status" text NOT NULL,
  "changed_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "trigger_reason" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "audit_logs_sub_idx" ON "subscription_audit_logs" ("subscription_id");
