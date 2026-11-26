import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { StaffAdminError, StaffGuardError, revokeRole } from "@/lib/staff-admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string; roleId: string }> }
) {
  const { userId: actorAuthId } = await auth();
  if (!actorAuthId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("staff:manage"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(actorAuthId);
  if (!appUser) return apiError("Application account not linked", 404);

  const { userId, roleId } = await params;
  if (!isUuid(userId) || !isUuid(roleId)) return apiError("Invalid user or role id.", 400);
  try {
    await revokeRole({ userId, roleId, actorUserId: appUser.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof StaffGuardError) return apiError(error.message, 409);
    if (error instanceof StaffAdminError) return apiError(error.message, 404);
    console.error("[ADMIN STAFF REVOKE ERROR]:", error);
    return apiError("Failed to revoke role.", 500);
  }
}
