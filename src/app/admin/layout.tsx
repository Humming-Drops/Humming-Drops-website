import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getAppUserByClerkId } from "@/lib/clerk-auth";

const STAFF_ROLES = [
  "admin",
  "operations",
  "nutritionist",
  "super_admin",
  "business_admin",
  "operations_manager",
  "finance_manager",
  "content_manager",
  "read_only_auditor",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const appUser = userId ? await getAppUserByClerkId(userId) : null;

  // The shell only confirms the visitor holds some staff role; each admin
  // module (leads, content, payments, ...) enforces its own specific
  // permission via requirePermission()/hasPermission() on its own routes.
  if (!appUser?.isActive || !STAFF_ROLES.includes(appUser.role)) {
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
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            Customer dashboard
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
        <aside className="w-full shrink-0 space-y-1 text-sm font-medium md:w-56">
          {[
            ["Overview", "/admin"],
            ["Leads", "/admin/leads"],
            ["Subscriptions", "/admin/subscriptions"],
            ["Payments", "/admin/payments"],
            ["Content", "/admin/content"],
            ["Audit log", "/admin/audit-log"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-xl px-3 py-2 text-content-secondary hover:bg-surface hover:text-brand-primary"
            >
              {label}
            </Link>
          ))}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
