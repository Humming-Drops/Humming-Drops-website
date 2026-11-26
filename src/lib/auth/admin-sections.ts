/** Admin sections and the permission each one needs. */
export const ADMIN_SECTIONS = [
  { label: "Overview", href: "/admin", action: null, permission: null },
  { label: "Leads", href: "/admin/leads", action: "Review registrations", permission: "leads:read" },
  { label: "Subscriptions", href: "/admin/subscriptions", action: "Manage subscriptions", permission: "subscriptions:manage" },
  { label: "Payments", href: "/admin/payments", action: "View payments", permission: "payments:read" },
  { label: "Content", href: "/admin/content", action: "Manage website content", permission: "content:write" },
  { label: "Staff", href: "/admin/staff", action: "Manage staff roles", permission: "staff:manage" },
  { label: "Audit log", href: "/admin/audit-log", action: null, permission: "audit:read" },
] as const;

export async function visibleAdminSections(can: (permission: string) => Promise<boolean>) {
  const allowed = await Promise.all(ADMIN_SECTIONS.map((s) => (s.permission ? can(s.permission) : true)));
  return ADMIN_SECTIONS.filter((_, i) => allowed[i]);
}
