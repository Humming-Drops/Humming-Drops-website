import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, healthVitals } from "@/lib/db/schema";
import { getAppUserByClerkId, hasPermission } from "@/lib/clerk-auth";

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
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("health:read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const staffUser = await getAppUserByClerkId(clerkUserId);
  if (!staffUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { userId: targetUserId } = await params;
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
