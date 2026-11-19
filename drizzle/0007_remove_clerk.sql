-- Remove Clerk: authentication is handled in-app (users.password_hash + sessions).
DROP TABLE IF EXISTS "clerk_webhook_events";
--> statement-breakpoint
DROP INDEX IF EXISTS "users_clerk_user_id_idx";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "clerk_user_id";
