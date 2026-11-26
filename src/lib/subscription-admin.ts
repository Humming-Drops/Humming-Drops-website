import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  administrativeAuditLogs,
  deliveryAddresses,
  profiles,
  subscriptionAuditLogs,
  subscriptionPlans,
  userSubscriptions,
  users,
} from "@/lib/db/schema";
import { canTransitionSubscription, hasActivePerks } from "@/lib/subscription-transitions";
import type { SubscriptionStatus } from "@/types/subscription";

export class SubscriptionTransitionError extends Error {}
export class SubscriptionNotFoundError extends Error {}

const SUBSCRIPTION_AUDIT_ACTIONS: Record<string, string> = {
  admin_manual_confirmation: "subscription.confirmed",
  admin_manual_cancellation: "subscription.cancelled",
  admin_manual_pause: "subscription.paused",
  admin_manual_resume: "subscription.resumed",
};

export async function listSubscriptionsForAdmin() {
  return db
    .select({
      subscription: userSubscriptions,
      plan: subscriptionPlans,
      customerName: profiles.fullName,
      // Latest contact number given by the customer, falling back to the account phone.
      customerPhone: sql<string>`coalesce(nullif(${profiles.phone}, ''), nullif(${users.phone}, ''), '')`,
      area: deliveryAddresses.area,
    })
    .from(userSubscriptions)
    .innerJoin(users, eq(users.id, userSubscriptions.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .leftJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
    .leftJoin(deliveryAddresses, eq(deliveryAddresses.subscriptionId, userSubscriptions.id))
    .orderBy(desc(userSubscriptions.updatedAt));
}

async function getSubscriptionOrThrow(id: string) {
  const [row] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.id, id)).limit(1);
  if (!row) throw new SubscriptionNotFoundError("Subscription not found.");
  return row;
}

async function applyTransition(params: {
  id: string;
  nextStatus: SubscriptionStatus;
  actorUserId: string;
  triggerReason: string;
  allowedFrom?: SubscriptionStatus[];
  extraSet?: Partial<typeof userSubscriptions.$inferInsert>;
}) {
  const existing = await getSubscriptionOrThrow(params.id);

  // The state machine allows same-state writes; staff actions must not repeat or relabel them.
  if (
    (params.allowedFrom && !params.allowedFrom.includes(existing.status)) ||
    !canTransitionSubscription(existing.status, params.nextStatus)
  ) {
    throw new SubscriptionTransitionError(
      `Cannot transition subscription from "${existing.status}" to "${params.nextStatus}".`
    );
  }

  const [updated] = await db
    .update(userSubscriptions)
    .set({
      status: params.nextStatus,
      hasActivePerks: hasActivePerks(params.nextStatus),
      updatedAt: new Date(),
      ...params.extraSet,
    })
    .where(eq(userSubscriptions.id, params.id))
    .returning();

  if (!updated) {
    // Zero-row update: the row existed moments ago but the WHERE clause
    // matched nothing on write (e.g. concurrently deleted). Surface this
    // distinctly from "not found" rather than silently reporting success.
    throw new SubscriptionNotFoundError("Subscription update affected zero rows.");
  }

  await db.insert(subscriptionAuditLogs).values({
    subscriptionId: params.id,
    previousStatus: existing.status,
    newStatus: params.nextStatus,
    changedByUserId: params.actorUserId,
    triggerReason: params.triggerReason,
  });

  // Mirror into the administrative audit log so /admin/audit-log shows
  // staff subscription decisions alongside every other admin action.
  await db.insert(administrativeAuditLogs).values({
    actorUserId: params.actorUserId,
    action: SUBSCRIPTION_AUDIT_ACTIONS[params.triggerReason] ?? "subscription.status_changed",
    resourceType: "user_subscription",
    resourceId: params.id,
    metadata: {
      reference: updated.leadReferenceCode,
      previousStatus: existing.status,
      newStatus: params.nextStatus,
      ...(params.extraSet && "pauseStart" in params.extraSet && params.extraSet.pauseStart
        ? { pauseStart: params.extraSet.pauseStart, pauseEnd: params.extraSet.pauseEnd }
        : {}),
    },
  });

  return updated;
}

export async function confirmSubscription(id: string, actorUserId: string) {
  return applyTransition({
    id,
    nextStatus: "confirmed_active",
    actorUserId,
    triggerReason: "admin_manual_confirmation",
    allowedFrom: ["pending_confirmation", "expired"],
    extraSet: { startDate: new Date().toISOString().slice(0, 10) },
  });
}

export async function cancelSubscription(id: string, actorUserId: string) {
  return applyTransition({
    id,
    nextStatus: "cancelled",
    actorUserId,
    triggerReason: "admin_manual_cancellation",
    allowedFrom: ["registration_submitted", "pending_confirmation", "confirmed_active", "paused"],
  });
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True only for a real calendar date: "2027-02-30" would otherwise roll over to March. */
function isCalendarDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validatePauseRange(pauseStart: string, pauseEnd: string): string | null {
  if (typeof pauseStart !== "string" || typeof pauseEnd !== "string" || !DATE_PATTERN.test(pauseStart) || !DATE_PATTERN.test(pauseEnd)) {
    return "Pause dates must be in YYYY-MM-DD format.";
  }
  if (!isCalendarDate(pauseStart) || !isCalendarDate(pauseEnd)) {
    return "Pause dates must be valid calendar dates.";
  }
  if (pauseEnd < pauseStart) {
    return "Pause end date must be on or after the pause start date.";
  }
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  if (pauseEnd < today) {
    return "These pause dates are already in the past.";
  }
  return null;
}

export async function pauseSubscription(
  id: string,
  actorUserId: string,
  pauseStart: string,
  pauseEnd: string
) {
  const rangeError = validatePauseRange(pauseStart, pauseEnd);
  if (rangeError) throw new SubscriptionTransitionError(rangeError);

  return applyTransition({
    id,
    nextStatus: "paused",
    actorUserId,
    triggerReason: "admin_manual_pause",
    allowedFrom: ["confirmed_active"],
    extraSet: { pauseStart, pauseEnd },
  });
}

export async function resumeSubscription(id: string, actorUserId: string) {
  return applyTransition({
    id,
    nextStatus: "confirmed_active",
    actorUserId,
    triggerReason: "admin_manual_resume",
    allowedFrom: ["paused"],
    extraSet: { pauseStart: null, pauseEnd: null },
  });
}
