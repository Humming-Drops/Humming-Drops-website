import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { administrativeAuditLogs, clerkWebhookEvents, users } from "@/lib/db/schema";
import { extractPrimaryEmail, extractPrimaryPhone, type ClerkUserEventData } from "@/lib/clerk-webhook";

export class ClerkReconciliationError extends Error {}

export async function isClerkEventProcessed(eventId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: clerkWebhookEvents.id })
    .from(clerkWebhookEvents)
    .where(eq(clerkWebhookEvents.id, eventId))
    .limit(1);
  return Boolean(row);
}

export async function recordClerkEvent(eventId: string, eventType: string): Promise<void> {
  await db.insert(clerkWebhookEvents).values({ id: eventId, eventType }).onConflictDoNothing();
}

/**
 * Reconciles a Clerk user.created / user.updated event with the
 * PostgreSQL users table:
 *  - If a row already linked to this Clerk identity exists, update it.
 *  - Else if a row with a matching email exists (e.g. created earlier
 *    through assisted lead intake, before the customer ever signed in
 *    with Clerk), link that row to the Clerk identity instead of
 *    creating a duplicate, which would violate the unique email index.
 *  - Else insert a new row.
 */
export async function reconcileClerkUserUpsert(data: ClerkUserEventData): Promise<void> {
  const email = extractPrimaryEmail(data);
  if (!email) {
    throw new ClerkReconciliationError("Clerk user event has no primary email address.");
  }
  const phone = extractPrimaryPhone(data);

  const [byClerkId] = await db.select().from(users).where(eq(users.clerkUserId, data.id)).limit(1);
  if (byClerkId) {
    await db
      .update(users)
      .set({ email, phone: phone ?? byClerkId.phone, updatedAt: new Date() })
      .where(eq(users.id, byClerkId.id));
    return;
  }

  const [byEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (byEmail) {
    await db
      .update(users)
      .set({ clerkUserId: data.id, phone: phone ?? byEmail.phone, updatedAt: new Date() })
      .where(eq(users.id, byEmail.id));
    return;
  }

  await db.insert(users).values({ clerkUserId: data.id, email, phone, role: "customer", isActive: true });
}

/**
 * Reconciles a Clerk user.deleted event. The PostgreSQL row is never
 * hard-deleted here: it cascades to subscriptions, payments, and health
 * records that must be retained for financial/medical record-keeping.
 * Instead the account is deactivated, matching the existing
 * `users.isActive` convention used elsewhere in the app.
 */
export async function reconcileClerkUserDeleted(data: { id: string }): Promise<void> {
  await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(users.clerkUserId, data.id));

  await db.insert(administrativeAuditLogs).values({
    actorUserId: null,
    action: "clerk.user_deleted",
    resourceType: "user",
    resourceId: data.id,
    metadata: null,
  });
}
