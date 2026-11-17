import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { StaffAdminError, assignRole, findUserByEmail, listStaffWithRoles } from "@/lib/staff-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("staff:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const staff = await listStaffWithRoles();
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("staff:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, roleId } = body as { email?: string; roleId?: string };
  if (!email || !roleId) {
    return NextResponse.json({ error: "email and roleId are required." }, { status: 400 });
  }

  const targetUser = await findUserByEmail(email);
  if (!targetUser) {
    return NextResponse.json({ error: "No registered user found with that email." }, { status: 404 });
  }

  try {
    await assignRole({ userId: targetUser.id, roleId, actorUserId: appUser.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof StaffAdminError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[ADMIN STAFF ASSIGN ERROR]:", error);
    return NextResponse.json({ error: "Failed to assign role." }, { status: 500 });
  }
}
