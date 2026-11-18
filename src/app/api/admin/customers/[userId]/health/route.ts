import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, healthVitals } from "@/lib/db/schema";
import { getAppUserById, hasPermission } from "@/lib/auth/server";

/**
 * GET /api/admin/customers/[userId]/health
 *
 * Clinical/staff access to a specific customer's health vitals, gated by
 * the health:read permission (RR-007: "enforce clinical-role permissions
 * for health-data access"). Distinct from /api/customer/health, which is
 * owner-only self-access. Every access is logged with the viewing staff
 * member's identity and the customer whose records were viewed -- PHI
 * access by staff is always an auditable event, not just mutation.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("health:read"))) {
    return apiError("Forbidden", 403);
  }

  const staffUser = await getAppUserById(userId);
  if (!staffUser) return apiError("Application account not linked", 404);

  const { userId: targetUserId } = await params;
  if (!isUuid(targetUserId)) return apiError("Invalid customer id.", 400);
  const vitals = await db.select().from(healthVitals).where(eq(healthVitals.userId, targetUserId));

  await db.insert(administrativeAuditLogs).values({
    actorUserId: staffUser.id,
    action: "health.staff_access_read",
    resourceType: "health_vitals",
    resourceId: targetUserId,
    metadata: { recordCount: vitals.length },
  });

  return NextResponse.json({ vitals });
}
