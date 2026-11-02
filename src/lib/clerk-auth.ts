import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  applicationPermissions,
  applicationRoles,
  rolePermissions,
  userRoles,
  users,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type UserRole = "customer" | "admin" | "operations" | "nutritionist";

export async function requireClerkUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("Authenticated Clerk user could not be resolved.");
  }

  return { clerkUserId: userId, user };
}

export async function getAppUserByClerkId(clerkUserId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  return user ?? null;
}

export async function hasAppRole(roles: UserRole[]) {
  const { userId } = await auth();
  if (!userId) return false;
  const appUser = await getAppUserByClerkId(userId);
  return Boolean(appUser?.isActive && roles.includes(appUser.role as UserRole));
}

export async function hasPermission(permissionSlug: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const appUser = await getAppUserByClerkId(userId);
  if (!appUser?.isActive) return false;

  const matches = await db
    .select({ permissionId: applicationPermissions.id })
    .from(userRoles)
    .innerJoin(applicationRoles, eq(applicationRoles.id, userRoles.roleId))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, applicationRoles.id))
    .innerJoin(
      applicationPermissions,
      eq(applicationPermissions.id, rolePermissions.permissionId)
    )
    .where(
      and(
        eq(userRoles.userId, appUser.id),
        eq(applicationPermissions.slug, permissionSlug)
      )
    )
    .limit(1);

  return matches.length > 0;
}

export async function requirePermission(permissionSlug: string) {
  if (!(await hasPermission(permissionSlug))) {
    throw new Error(`Permission required: ${permissionSlug}`);
  }
}
