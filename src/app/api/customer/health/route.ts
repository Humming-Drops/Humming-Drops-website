import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, healthVitals, users } from "@/lib/db/schema";

/**
 * GET /api/customer/health
 *
 * Owner-only access to the authenticated customer's own health vitals.
 * Never reachable without a Clerk session (no public path, no
 * NEXT_PUBLIC_* configuration can affect this route). Every access is
 * logged to administrative_audit_logs -- health records are PHI-adjacent
 * and access, not just mutation, is an auditable event (RR-007).
 */
export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const vitals = await db.select().from(healthVitals).where(eq(healthVitals.userId, user.id));

  await db.insert(administrativeAuditLogs).values({
    actorUserId: user.id,
    action: "health.self_access_read",
    resourceType: "health_vitals",
    resourceId: user.id,
    metadata: { recordCount: vitals.length },
  });

  return NextResponse.json({ vitals });
}
