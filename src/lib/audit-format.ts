/**
 * Presentation helpers for administrative audit log entries.
 * Pure functions (no DB access) so they can be unit tested.
 */

const ACTION_LABELS: Record<string, string> = {
  "staff.role_assigned": "Staff role assigned",
  "staff.role_revoked": "Staff role revoked",
  "content.created": "Content page created",
  "content.updated": "Content page updated",
  "content.published": "Content page published",
  "content.unpublished": "Content page unpublished",
  "customer.profile_created": "Customer profile created",
  "customer.profile_updated": "Customer profile updated",
  "customer.address_updated": "Customer address updated",
  "customer.delivery_notes_updated": "Delivery notes updated",
  "customer.vacation_dates_set": "Vacation dates set",
  "customer.vacation_dates_cleared": "Vacation dates cleared",
  "health.self_access_read": "Customer viewed own health records",
  "health.staff_access_read": "Staff viewed customer health records",
  "subscription.confirmed": "Subscription confirmed",
  "subscription.cancelled": "Subscription cancelled",
  "subscription.paused": "Subscription paused",
  "subscription.resumed": "Subscription resumed",
  "subscription.status_changed": "Subscription status changed",
  "payment.captured": "Payment captured",
  "payment.failed": "Payment failed",
};

export function humanizeAuditAction(action: string): string {
  const known = ACTION_LABELS[action];
  if (known) return known;
  const cleaned = action.replace(/[._]+/g, " ").trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "Unknown action";
}

/** Admin page to open for the resource an audit entry refers to, if there is one. */
export function auditResourceHref(resourceType: string | null, resourceId: string | null): string | null {
  if (!resourceType) return null;
  switch (resourceType) {
    case "content_page":
      return resourceId ? `/admin/content/${resourceId}` : "/admin/content";
    case "user_subscription":
      return "/admin/subscriptions";
    case "user_role":
      return "/admin/staff";
    default:
      return null;
  }
}

export const AUDIT_KINDS = [
  { value: "all", label: "All staff & customer activity", prefix: null },
  { value: "subscription", label: "Subscriptions", prefix: "subscription." },
  { value: "staff", label: "Staff & roles", prefix: "staff." },
  { value: "content", label: "Website content", prefix: "content." },
  { value: "customer", label: "Customer changes", prefix: "customer." },
  { value: "health", label: "Health record access", prefix: "health." },
  { value: "payment", label: "Payments", prefix: "payment." },
] as const;

export type AuditKind = (typeof AUDIT_KINDS)[number]["value"];

export function parseAuditKind(value: string | undefined): AuditKind {
  return AUDIT_KINDS.some((k) => k.value === value) ? (value as AuditKind) : "all";
}

export function auditKindPrefix(kind: AuditKind): string | null {
  return AUDIT_KINDS.find((k) => k.value === kind)?.prefix ?? null;
}

export function parsePageNumber(value: string | undefined): number {
  const n = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(n) && n >= 1 && n <= 10000 ? n : 1;
}

/** Actions hidden from the default "all" view because they drown everything else. */
export const NOISY_AUDIT_ACTIONS = ["health.self_access_read"];

/**
 * One-line description of what an entry touched, from its metadata
 * (content title / slug, subscription reference and status change).
 */
export function auditEntrySummary(resourceType: string | null, metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const m = metadata as Record<string, unknown>;
  if (resourceType === "content_page") {
    const snap = (m.snapshot ?? {}) as Record<string, unknown>;
    const title = typeof snap.title === "string" ? snap.title : null;
    const slug = typeof snap.slug === "string" ? snap.slug : null;
    if (title && slug) return `${title} (/content/${slug})`;
    return title ?? (slug ? `/content/${slug}` : null);
  }
  if (resourceType === "user_subscription") {
    const ref = typeof m.reference === "string" ? m.reference : null;
    const from = typeof m.previousStatus === "string" ? m.previousStatus.replace(/_/g, " ") : null;
    const to = typeof m.newStatus === "string" ? m.newStatus.replace(/_/g, " ") : null;
    const change = from && to ? `${from} → ${to}` : null;
    return [ref, change].filter(Boolean).join(" · ") || null;
  }
  return null;
}
