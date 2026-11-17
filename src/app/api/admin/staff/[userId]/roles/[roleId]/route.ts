import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { revokeRole } from "@/lib/staff-admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string; roleId: string }> }
) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("staff:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserById(clerkUserId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { userId, roleId } = await params;
  await revokeRole({ userId, roleId, actorUserId: appUser.id });
  return NextResponse.json({ success: true });
}
