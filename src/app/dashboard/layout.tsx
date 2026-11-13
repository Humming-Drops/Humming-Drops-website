import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";
import { PortalNav, type PortalNavItem } from "@/components/layout/portal-nav";

const DASHBOARD_NAV_ITEMS: PortalNavItem[] = [
  { label: "Today's Box & Status", href: "/dashboard/overview" },
  { label: "Delivery Calendar & Pause", href: "/dashboard/delivery" },
  { label: "Health Vitals", href: "/dashboard/health", accent: "teal" },
  { label: "MedCity Smiles", href: "/dashboard/community", accent: "teal" },
  { label: "Settings & Subscription", href: "/dashboard/settings" },
];

export const metadata: Metadata = {
  title: "Subscriber Dashboard",
  description: "Manage your daily breakfast delivery, health vitals, and community access.",
};

// Every dashboard page reads the signed-in customer's own live data
// (subscription, payments, health vitals). Must never be statically
// prerendered -- see src/app/admin/layout.tsx for the same reasoning.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First sign-in (no profiles row yet, created at /api/customer/me's
  // "profile" PATCH) sends every customer through onboarding before
  // they can reach any dashboard page. /onboarding itself isn't under
  // this layout, so it's never caught in this redirect.
  const { userId: clerkUserId } = await auth();
  if (clerkUserId) {
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
    if (user) {
      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
      if (!profile) {
        redirect("/onboarding");
      }
    }
  }

  return (
    <div className="flex-1 bg-muted/40 flex flex-col">
      {/* Sub Header Bar */}
      <div className="bg-surface border-b border-line-subtle px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-brand-subtle text-brand-primary px-2.5 py-1 rounded-pill font-semibold">
            Subscriber Portal
          </span>
          <span className="text-xs text-content-secondary hidden sm:inline">
            Daily Breakfast & Health Management
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-content-secondary">
          <span className="text-content-muted hidden md:inline">Kitchen: Berrybeats Cafe, Bangalore</span>
          <Link href="/" className="text-brand-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            Back to Website
          </Link>
        </div>
      </div>

      {/* Main dashboard content with sub-nav */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-5 md:gap-8 flex-1">
        {/* Responsive Sidebar / Pill Nav */}
        <PortalNav items={DASHBOARD_NAV_ITEMS} ariaLabel="Dashboard Navigation" />

        {/* Dynamic Section View */}
        <div className="flex-1 min-w-0 bg-surface p-5 sm:p-8 rounded-2xl border border-line-subtle shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
