ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'business_admin';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'operations_manager';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'finance_manager';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'read_only_auditor';

DO $$ BEGIN
  CREATE TYPE "content_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "application_roles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "is_system_role" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "application_permissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
  "role_id" uuid NOT NULL REFERENCES "application_roles"("id") ON DELETE CASCADE,
  "permission_id" uuid NOT NULL REFERENCES "application_permissions"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("role_id", "permission_id")
);

CREATE TABLE IF NOT EXISTS "user_roles" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role_id" uuid NOT NULL REFERENCES "application_roles"("id") ON DELETE CASCADE,
  "assigned_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "role_id")
);

CREATE TABLE IF NOT EXISTS "administrative_audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "actor_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "resource_type" text NOT NULL,
  "resource_id" text,
  "metadata" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "content_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "schema" jsonb NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "content_pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "template_id" uuid NOT NULL REFERENCES "content_templates"("id") ON DELETE RESTRICT,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "status" "content_status" NOT NULL DEFAULT 'draft',
  "published_at" timestamptz,
  "published_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "created_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "content_pages_status_idx" ON "content_pages" ("status");
CREATE INDEX IF NOT EXISTS "content_pages_template_idx" ON "content_pages" ("template_id");

CREATE TABLE IF NOT EXISTS "content_audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "page_id" uuid NOT NULL REFERENCES "content_pages"("id") ON DELETE CASCADE,
  "actor_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "snapshot" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

INSERT INTO "application_roles" ("slug", "name", "description") VALUES
  ('super_admin', 'Super Admin', 'Full platform administration'),
  ('business_admin', 'Business Admin', 'Business and customer operations'),
  ('operations_manager', 'Operations Manager', 'Leads, subscriptions, and delivery operations'),
  ('finance_manager', 'Finance Manager', 'Payments and financial reconciliation'),
  ('content_manager', 'Content Manager', 'Drafting and publishing approved content'),
  ('read_only_auditor', 'Read-only Auditor', 'Read-only operational and audit access'),
  ('customer', 'Customer', 'Own account and subscription access')
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "application_permissions" ("slug", "name", "description") VALUES
  ('leads:read', 'Read leads', 'View lead records permitted by role'),
  ('leads:manage', 'Manage leads', 'Confirm, reject, and update lead records'),
  ('subscriptions:manage', 'Manage subscriptions', 'Manage subscription lifecycle'),
  ('payments:read', 'Read payments', 'View payment records'),
  ('payments:manage', 'Manage payments', 'Reconcile and refund payments'),
  ('deliveries:manage', 'Manage deliveries', 'Manage delivery operations'),
  ('customers:read', 'Read customers', 'View customer records'),
  ('staff:manage', 'Manage staff', 'Assign and revoke application roles'),
  ('content:write', 'Write content', 'Create and edit content drafts'),
  ('content:publish', 'Publish content', 'Publish approved content'),
  ('health:read', 'Read health data', 'View permitted health records'),
  ('audit:read', 'Read audit logs', 'View administrative audit history')
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
CROSS JOIN "application_permissions" permission
WHERE role.slug = 'super_admin'
ON CONFLICT DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
JOIN "application_permissions" permission
  ON permission.slug IN (
    'leads:read',
    'leads:manage',
    'subscriptions:manage',
    'customers:read',
    'deliveries:manage'
  )
WHERE role.slug IN ('business_admin', 'operations_manager')
ON CONFLICT DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
JOIN "application_permissions" permission
  ON permission.slug IN ('payments:read', 'payments:manage')
WHERE role.slug = 'finance_manager'
ON CONFLICT DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
JOIN "application_permissions" permission
  ON permission.slug IN ('content:write', 'content:publish')
WHERE role.slug = 'content_manager'
ON CONFLICT DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
JOIN "application_permissions" permission
  ON permission.slug IN (
    'leads:read',
    'payments:read',
    'customers:read',
    'audit:read'
  )
WHERE role.slug = 'read_only_auditor'
ON CONFLICT DO NOTHING;
