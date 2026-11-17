import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listAdministrativeAuditLogs } from "@/lib/audit-log";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("audit:read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await listAdministrativeAuditLogs();
  return NextResponse.json({ logs });
}
