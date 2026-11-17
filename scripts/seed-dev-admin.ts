import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { applicationRoles, profiles, userRoles, users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";

/**
 * Local-dev bootstrap: creates or updates a staff user with `super_admin` RBAC role
 * and native password hash directly in PostgreSQL.
 *
 * Usage: npm run db:seed-admin -- [email] [password]
 * Example: npm run db:seed-admin -- admin@hummingdrops.dev Admin@HummingDrops2026
 */
async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run seed-dev-admin in production.");
  }

  const email = (process.argv[2] || "admin@hummingdrops.dev").trim().toLowerCase();
  const password = process.argv[3] || "Admin@HummingDrops2026";

  console.log(`Seeding admin account: ${email}...`);

  const passwordHash = await hashPassword(password);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const [appUser] = existing
    ? await db
        .update(users)
        .set({
          passwordHash,
          role: "super_admin",
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning()
    : await db
        .insert(users)
        .values({
          email,
          passwordHash,
          role: "super_admin",
          isActive: true,
        })
        .returning();

  // Ensure profile exists
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, appUser.id))
    .limit(1);

  if (!profile) {
    await db.insert(profiles).values({
      userId: appUser.id,
      fullName: "Platform Super Admin",
      email,
      phone: "8618902810",
    });
  }

  // Ensure super_admin role is linked
  const [superAdminRole] = await db
    .select()
    .from(applicationRoles)
    .where(eq(applicationRoles.slug, "super_admin"))
    .limit(1);

  if (superAdminRole) {
    const [existingRole] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, appUser.id))
      .limit(1);

    if (!existingRole) {
      await db.insert(userRoles).values({
        userId: appUser.id,
        roleId: superAdminRole.id,
      });
    }
  }

  console.log(`✅ Success! Seeded super_admin user:`);
  console.log(`- Email: ${email}`);
  console.log(`- Password: ${password}`);
  console.log(`- Role: ${appUser.role}`);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
