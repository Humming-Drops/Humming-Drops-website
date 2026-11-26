import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  applicationPermissions,
  applicationRoles,
  profiles,
  rolePermissions,
  userRoles,
  users,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  type SessionPayload,
} from "./session";

export type UserRole =
  | "customer"
  | "admin"
  | "operations"
  | "nutritionist"
  | "super_admin"
  | "business_admin"
  | "operations_manager"
  | "finance_manager"
  | "content_manager"
  | "read_only_auditor";

/**
 * Returns the verified session payload from incoming request cookies, or null if unauthenticated.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }
    return await verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Lightweight drop-in replacement for auth() in server routes.
 */
export async function auth() {
  const current = await getSessionUser();
  return {
    userId: current?.user.id ?? null,
    sessionId: current ? "active_session" : null,
  };
}

/**
 * Session plus its live database row. A deleted or deactivated account has no
 * session, and roles always come from the database, never from the cookie.
 */
async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await getAppUserById(session.userId);
  return user?.isActive ? { session, user } : null;
}

/**
 * Resolves the authenticated user from PostgreSQL using the session cookie.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || !user.isActive) return null;

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    return { user, profile: profile ?? null, session };
  } catch {
    return null;
  }
}

/**
 * Requires an authenticated user session or throws an error.
 */
export async function requireAuthUser() {
  const current = await getCurrentUser();
  if (!current) {
    throw new Error("Authentication required.");
  }
  return current;
}


/**
 * Resolves a user by their PostgreSQL UUID.
 */
export async function getAppUserById(identifier: string) {
  if (!identifier) return null;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, identifier))
      .limit(1);

    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * Checks whether the current user has any of the specified roles.
 */
export async function hasAppRole(roles: string[]): Promise<boolean> {
  const current = await getSessionUser();
  return Boolean(current && roles.includes(current.user.role));
}

/**
 * Checks whether the current user holds a specific RBAC permission.
 */
export async function hasPermission(permissionSlug: string): Promise<boolean> {
  const current = await getSessionUser();
  if (!current) return false;
  const appUser = current.user;

  if (appUser.role === "admin" || appUser.role === "super_admin") {
    return true;
  }

  try {
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
  } catch {
    return false;
  }
}

/**
 * Throws if the current user lacks the specified permission.
 */
export async function requirePermission(permissionSlug: string) {
  if (!(await hasPermission(permissionSlug))) {
    throw new Error(`Permission required: ${permissionSlug}`);
  }
}

/**
 * Returns true if the user is a staff account (any non-customer role or holds staff RBAC grant).
 */
export async function isStaffUser(): Promise<boolean> {
  const current = await getSessionUser();
  if (!current) return false;
  const appUser = current.user;
  if (appUser.role !== "customer") return true;

  try {
    const rows = await db
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .where(eq(userRoles.userId, appUser.id))
      .limit(1);

    return rows.length > 0;
  } catch {
    return false;
  }
}
