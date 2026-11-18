import { desc, eq, like, sql } from "drizzle-orm";
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

  const filtered = actionPrefix ? base.where(like(administrativeAuditLogs.action, `${actionPrefix}%`)) : base;
  return filtered.orderBy(desc(administrativeAuditLogs.createdAt)).limit(limit).offset(offset);
}

export async function countAdministrativeAuditLogs(actionPrefix: string | null = null): Promise<number> {
  const base = db.select({ n: sql<number>`count(*)::int` }).from(administrativeAuditLogs);
  const [row] = actionPrefix
    ? await base.where(like(administrativeAuditLogs.action, `${actionPrefix}%`))
    : await base;
  return row?.n ?? 0;
}
