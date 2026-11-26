import { and, desc, eq, like, notInArray, sql, type SQL } from "drizzle-orm";
import { NOISY_AUDIT_ACTIONS } from "@/lib/audit-format";
import { db } from "@/lib/db";
import { administrativeAuditLogs, users } from "@/lib/db/schema";

export interface AuditLogQuery {
  limit?: number;
  offset?: number;
  /** Only entries whose action starts with this prefix (e.g. "staff."). */
  actionPrefix?: string | null;
}

export async function listAdministrativeAuditLogs(query: AuditLogQuery = {}) {
  const { limit = 200, offset = 0, actionPrefix = null } = query;
  const base = db
    .select({
      log: administrativeAuditLogs,
      actorEmail: users.email,
    })
    .from(administrativeAuditLogs)
    .leftJoin(users, eq(users.id, administrativeAuditLogs.actorUserId));

  return base.where(auditFilter(actionPrefix)).orderBy(desc(administrativeAuditLogs.createdAt)).limit(limit).offset(offset);
}

export async function countAdministrativeAuditLogs(actionPrefix: string | null = null): Promise<number> {
  const base = db.select({ n: sql<number>`count(*)::int` }).from(administrativeAuditLogs);
  const [row] = await base.where(auditFilter(actionPrefix));
  return row?.n ?? 0;
}

/** A kind prefix filters by action; the unfiltered view hides noisy self-service reads. */
function auditFilter(actionPrefix: string | null): SQL | undefined {
  if (actionPrefix) return like(administrativeAuditLogs.action, `${actionPrefix}%`);
  return and(notInArray(administrativeAuditLogs.action, NOISY_AUDIT_ACTIONS));
}
