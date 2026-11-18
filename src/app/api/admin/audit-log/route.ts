import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listAdministrativeAuditLogs } from "@/lib/audit-log";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("audit:read"))) {
    return apiError("Forbidden", 403);
  }

  const logs = await listAdministrativeAuditLogs();
  return NextResponse.json({ logs });
}
