import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { StaffAdminError, assignRole, findUserByEmail, listStaffWithRoles } from "@/lib/staff-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("staff:manage"))) {
    return apiError("Forbidden", 403);
  }

  const staff = await listStaffWithRoles();
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("staff:manage"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return apiError("Application account not linked", 404);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return apiError("Invalid request body", 400);
  }

  const { email, roleId } = body as { email?: string; roleId?: string };
  if (!email || !roleId) {
    return apiError("email and roleId are required.", 400);
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return apiError("A valid email is required.", 400);
  }
  if (!isUuid(roleId)) {
    return apiError("roleId must be a valid role id.", 400);
  }

  const targetUser = await findUserByEmail(email);
  if (!targetUser) {
    return apiError("No registered user found with that email.", 404);
  }

  try {
    await assignRole({ userId: targetUser.id, roleId, actorUserId: appUser.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof StaffAdminError) {
      return apiError(error.message, 400);
    }
    console.error("[ADMIN STAFF ASSIGN ERROR]:", error);
    return apiError("Failed to assign role.", 500);
  }
}
