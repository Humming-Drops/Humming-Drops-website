import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listAssignableRoles } from "@/lib/staff-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("staff:manage"))) {
    return apiError("Forbidden", 403);
  }

  const roles = await listAssignableRoles();
  return NextResponse.json({ roles });
}
