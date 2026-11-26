import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listAdministrativeAuditLogs } from "@/lib/audit-log";
import { auditKindPrefix, parseAuditKind } from "@/lib/audit-format";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("audit:read"))) {
    return apiError("Forbidden", 403);
  }

  const query = new URL(request.url).searchParams;
  const limit = Math.min(Math.max(Number.parseInt(query.get("limit") ?? "", 10) || 200, 1), 200);
  const actionPrefix = auditKindPrefix(parseAuditKind(query.get("kind") ?? undefined));
  const logs = await listAdministrativeAuditLogs({ limit, actionPrefix });
  return NextResponse.json({ logs });
}
