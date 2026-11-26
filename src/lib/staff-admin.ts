import { and, eq, inArray, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, applicationRoles, userRoles, users } from "@/lib/db/schema";

export class StaffAdminError extends Error {}
/** A revoke that is refused to protect admin access (HTTP 409, not 404). */
export class StaffGuardError extends Error {}

export async function listAssignableRoles() {
  return db.select().from(applicationRoles).where(ne(applicationRoles.slug, "customer")).orderBy(applicationRoles.name);
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select({ id: users.id, email: users.email })
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

  // Explicit safe columns only: never select passwordHash here.
  const staffUsers = await db
    .select({
      id: users.id,
      email: users.email,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
    })
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

const ROLE_PRIORITY = [
  "super_admin",
  "business_admin",
  "operations_manager",
  "finance_manager",
  "content_manager",
  "nutritionist",
  "read_only_auditor",
] as const;

/** users.role is what sign-in and middleware read, so it must follow the granted roles. */
export function resolveAccountRole(currentRole: string, grantedSlugs: string[], revokedSlug?: string) {
  // Legacy "admin" accounts keep full access unless Super Admin is explicitly revoked.
  if (currentRole === "admin" && revokedSlug !== "super_admin") return "admin" as const;
  return ROLE_PRIORITY.find((slug) => grantedSlugs.includes(slug)) ?? ("customer" as const);
}

async function syncAccountRole(userId: string, revokedSlug?: string) {
  const [user] = await db
    .select({ email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return null;
  const grants = await db
    .select({ slug: applicationRoles.slug })
    .from(userRoles)
    .innerJoin(applicationRoles, eq(applicationRoles.id, userRoles.roleId))
    .where(eq(userRoles.userId, userId));
  const role = resolveAccountRole(user.role, grants.map((g) => g.slug), revokedSlug);
  if (role !== user.role) {
    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  }
  return user.email;
}

export async function assignRole(params: { userId: string; roleId: string; actorUserId: string }) {
  const [role] = await db.select().from(applicationRoles).where(eq(applicationRoles.id, params.roleId)).limit(1);
  if (!role) throw new StaffAdminError("Role not found.");
  if (role.slug === "customer") throw new StaffAdminError("The customer role cannot be assigned manually.");

  const inserted = await db
    .insert(userRoles)
    .values({ userId: params.userId, roleId: params.roleId, assignedByUserId: params.actorUserId })
    .onConflictDoNothing()
    .returning();
  const targetEmail = await syncAccountRole(params.userId);
  if (inserted.length === 0) return; // already held: nothing new to audit

  await db.insert(administrativeAuditLogs).values({
    actorUserId: params.actorUserId,
    action: "staff.role_assigned",
    resourceType: "user_role",
    resourceId: params.userId,
    metadata: { roleId: params.roleId, roleSlug: role.slug, targetEmail },
  });
}

export async function revokeRole(params: { userId: string; roleId: string; actorUserId: string }) {
  const [role] = await db
    .select({ slug: applicationRoles.slug, name: applicationRoles.name })
    .from(applicationRoles)
    .where(eq(applicationRoles.id, params.roleId))
    .limit(1);
  if (!role) throw new StaffAdminError("That role does not exist.");

  if (role.slug === "super_admin") {
    if (params.userId === params.actorUserId) {
      throw new StaffGuardError("You can't remove your own Super Admin role. Ask another Super Admin to do it.");
    }
    const holders = await db
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .where(eq(userRoles.roleId, params.roleId));
    if (holders.length <= 1) {
      throw new StaffGuardError("This is the last Super Admin. Grant Super Admin to someone else first.");
    }
  }

  const revoked = await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, params.userId), eq(userRoles.roleId, params.roleId)))
    .returning();

  if (revoked.length === 0) {
    throw new StaffAdminError("That user does not hold this role.");
  }

  const targetEmail = await syncAccountRole(params.userId, role.slug);

  await db.insert(administrativeAuditLogs).values({
    actorUserId: params.actorUserId,
    action: "staff.role_revoked",
    resourceType: "user_role",
    resourceId: params.userId,
    metadata: { roleId: params.roleId, roleSlug: role.slug, targetEmail },
  });
}
