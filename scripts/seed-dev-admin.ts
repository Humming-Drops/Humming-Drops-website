import { createClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { applicationRoles, userRoles, users } from "@/lib/db/schema";

/**
 * Local-dev-only bootstrap: grants the `super_admin` RBAC role to a
 * real Clerk account by email, so you can sign in normally and reach
 * every admin/CMS route instead of bypassing Clerk auth. Hard-fails
 * outside development so it can never run against a real environment.
 *
 * Uses @clerk/backend directly (not @clerk/nextjs/server) -- the
 * latter pulls in next/server, which only resolves correctly inside
 * Next's own build pipeline. Run as a bare Node script outside that
 * pipeline, that import fails with ERR_MODULE_NOT_FOUND. @clerk/backend
 * is the same SDK Next's helpers wrap, with no such dependency.
 *
 * Usage: npm run db:seed-admin -- you@example.com
 */
async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run seed-dev-admin in production.");
  }

  const email = process.argv[2];
  if (!email) {
    throw new Error("Usage: npm run db:seed-admin -- <email>");
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not set (expected in .env.local).");
  }

  const client = createClerkClient({ secretKey });
  const { data } = await client.users.getUserList({ emailAddress: [email] });
  const clerkUser = data[0];
  if (!clerkUser) {
    throw new Error(
      `No Clerk user found for ${email}. Sign up at /register (or your Clerk dev instance) first, then re-run this script.`
    );
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  const [appUser] = existing
    ? await db
        .update(users)
        .set({ clerkUserId: clerkUser.id, isActive: true, updatedAt: new Date() })
        .where(eq(users.id, existing.id))
        .returning()
    : await db
        .insert(users)
        .values({ email, clerkUserId: clerkUser.id, role: "admin", isActive: true })
        .returning();

  const [superAdminRole] = await db
    .select()
    .from(applicationRoles)
    .where(eq(applicationRoles.slug, "super_admin"))
    .limit(1);

  if (!superAdminRole) {
    throw new Error(
      "super_admin role not found. Run `npm run db:migrate` first (0002_rbac_and_cms.sql seeds it)."
    );
  }

  const [alreadyGranted] = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, appUser.id))
    .limit(1);

  if (!alreadyGranted) {
    await db.insert(userRoles).values({ userId: appUser.id, roleId: superAdminRole.id });
  }

  console.log(`Granted super_admin to ${email} (user id ${appUser.id}).`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
