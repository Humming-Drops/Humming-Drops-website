import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listAssignableRoles } from "@/lib/staff-admin";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("staff:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const roles = await listAssignableRoles();
  return NextResponse.json({ roles });
}
