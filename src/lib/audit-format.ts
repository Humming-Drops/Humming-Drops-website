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
  { value: "all", label: "All activity", prefix: null },
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
