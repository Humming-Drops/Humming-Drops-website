CREATE TABLE IF NOT EXISTS "revoked_sessions" (
  "jti" text PRIMARY KEY NOT NULL,
  "expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
-- Row Level Security on every table (project rule). No policies are defined, so
-- only the table owner (the role the app and migrations connect as) can read or write.
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;
