import { redirect } from "next/navigation";
import Link from "next/link";
import { isStaffUser } from "@/lib/clerk-auth";
import { PortalNav, type PortalNavItem } from "@/components/layout/portal-nav";

const ADMIN_NAV_ITEMS: PortalNavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Content", href: "/admin/content" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Audit log", href: "/admin/audit-log" },
];

// Every admin page reads live, per-staff-member authorized data (leads,
// payments, audit logs, ...). Must never be statically prerendered --
// without this, `next build` tries to prerender /admin at build time,
// before DATABASE_URL or a real session exists, and fails outright.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The shell only confirms the visitor is some kind of active staff
  // account; each admin module (leads, content, subscriptions, payments,
  // staff, audit log, ...) enforces its own specific permission via
  // requirePermission()/hasPermission() on its own routes.
  if (!(await isStaffUser())) {
    redirect("/dashboard/overview");
  }

  return (
    <div className="flex-1 bg-muted/40">
      <div className="border-b border-line-subtle bg-surface px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Operations Console
            </p>
            <h1 className="font-display text-lg font-bold text-content-primary">
              Humming Drops Admin
            </h1>
          </div>
          <Link
            href="/dashboard/overview"
            className="text-xs font-semibold text-brand-primary hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Customer dashboard
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:py-8 md:flex-row md:gap-8 md:px-8">
        <PortalNav items={ADMIN_NAV_ITEMS} ariaLabel="Admin Navigation" />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
