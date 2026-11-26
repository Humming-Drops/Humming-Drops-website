import Link from "next/link";
import { ExternalLink, LayoutDashboard } from "lucide-react";
import { hasPermission, isStaffUser } from "@/lib/auth/server";
import { visibleAdminSections } from "@/lib/auth/admin-sections";
import { PortalNav } from "@/components/layout/portal-nav";
import { AdminSignInPortal } from "@/components/auth/admin-sign-in-portal";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

const HEADER_LINK =
  "inline-flex min-h-[44px] min-w-[44px] lg:min-h-[40px] lg:min-w-[40px] items-center justify-center rounded-full px-2 text-xs font-semibold text-brand-primary transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-3";

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
  // If the visitor is not authenticated or lacks staff privileges,
  // gracefully render the dedicated Operations Console sign-in portal.
  if (!(await isStaffUser())) {
    return <AdminSignInPortal />;
  }
  const navItems = (await visibleAdminSections(hasPermission)).map(({ label, href }) => ({ label, href }));

  return (
    <div className="flex-1 bg-muted/40">
      <div className="border-b border-line-subtle bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="min-w-0">
            <p className="text-xs font-medium text-content-secondary">Operations console</p>
            <h1 className="truncate font-display text-sm font-bold text-content-primary sm:text-lg">
              Humming Drops Admin
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link href="/" className={HEADER_LINK} title="View website">
              <ExternalLink className="h-4 w-4 sm:hidden" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">View website</span>
            </Link>
            <Link href="/dashboard/overview" className={HEADER_LINK} title="Customer dashboard">
              <LayoutDashboard className="h-4 w-4 sm:hidden" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Customer dashboard</span>
            </Link>
            <AdminSignOutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:py-8 lg:flex-row lg:gap-8 md:px-8">
        <PortalNav items={navItems} ariaLabel="Admin Navigation" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
