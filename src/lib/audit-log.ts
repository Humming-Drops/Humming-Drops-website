import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, users } from "@/lib/db/schema";

export async function listAdministrativeAuditLogs(limit = 200) {
  return db
    .select({
      log: administrativeAuditLogs,
      actorEmail: users.email,
    })
    .from(administrativeAuditLogs)
    .leftJoin(users, eq(users.id, administrativeAuditLogs.actorUserId))
    .orderBy(desc(administrativeAuditLogs.createdAt))
    .limit(limit);
}
