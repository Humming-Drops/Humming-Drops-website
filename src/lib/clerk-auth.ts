import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
