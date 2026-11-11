import { and, eq, inArray, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, applicationRoles, userRoles, users } from "@/lib/db/schema";

export class StaffAdminError extends Error {}

export async function listAssignableRoles() {
  return db.select().from(applicationRoles).where(ne(applicationRoles.slug, "customer")).orderBy(applicationRoles.name);
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return user ?? null;
}

/**
 * Staff roster: every user who either holds a non-customer legacy role
 * or has at least one row in user_roles (the RBAC grant table), along
 * with the application roles currently granted to them.
 */
export async function listStaffWithRoles() {
  const grants = await db
    .select({
      userId: userRoles.userId,
      roleId: applicationRoles.id,
      roleSlug: applicationRoles.slug,
      roleName: applicationRoles.name,
    })
    .from(userRoles)
    .innerJoin(applicationRoles, eq(applicationRoles.id, userRoles.roleId));

  const grantedUserIds = [...new Set(grants.map((g) => g.userId))];

  const staffUsers = await db
    .select()
    .from(users)
    .where(
      grantedUserIds.length > 0
        ? or(ne(users.role, "customer"), inArray(users.id, grantedUserIds))
        : ne(users.role, "customer")
    );

  const rolesByUser = new Map<string, { roleId: string; roleSlug: string; roleName: string }[]>();
  for (const g of grants) {
    const list = rolesByUser.get(g.userId) ?? [];
    list.push({ roleId: g.roleId, roleSlug: g.roleSlug, roleName: g.roleName });
    rolesByUser.set(g.userId, list);
  }

  return staffUsers.map((user) => ({
    user,
    roles: rolesByUser.get(user.id) ?? [],
  }));
}

export async function assignRole(params: { userId: string; roleId: string; actorUserId: string }) {
  const [role] = await db.select().from(applicationRoles).where(eq(applicationRoles.id, params.roleId)).limit(1);
  if (!role) throw new StaffAdminError("Role not found.");
  if (role.slug === "customer") throw new StaffAdminError("The customer role cannot be assigned manually.");

  await db
    .insert(userRoles)
    .values({ userId: params.userId, roleId: params.roleId, assignedByUserId: params.actorUserId })
    .onConflictDoNothing();

  await db.insert(administrativeAuditLogs).values({
    actorUserId: params.actorUserId,
    action: "staff.role_assigned",
    resourceType: "user_role",
    resourceId: params.userId,
    metadata: { roleId: params.roleId, roleSlug: role.slug },
  });
}

export async function revokeRole(params: { userId: string; roleId: string; actorUserId: string }) {
  const revoked = await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, params.userId), eq(userRoles.roleId, params.roleId)))
    .returning();

  if (revoked.length === 0) {
    throw new StaffAdminError("That user does not hold this role.");
  }

  await db.insert(administrativeAuditLogs).values({
    actorUserId: params.actorUserId,
    action: "staff.role_revoked",
    resourceType: "user_role",
    resourceId: params.userId,
    metadata: { roleId: params.roleId },
  });
}
