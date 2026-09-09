import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subscriber Dashboard",
  description: "Manage your daily breakfast delivery, health vitals, and community access.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Nav Shell */}
        <aside className="w-full md:w-56 space-y-1 text-sm font-medium text-content-secondary shrink-0">
          <Link
            href="/dashboard/overview"
            className="block px-3 py-2 rounded-xl hover:bg-surface hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Today&apos;s Box &amp; Status
          </Link>
          <Link
            href="/dashboard/delivery"
            className="block px-3 py-2 rounded-xl hover:bg-surface hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Delivery Calendar &amp; Pause
          </Link>
          <Link
            href="/dashboard/health"
            className="block px-3 py-2 rounded-xl hover:bg-surface hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            Health Vitals (Protected)
          </Link>
          <Link
            href="/dashboard/community"
            className="block px-3 py-2 rounded-xl hover:bg-surface hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            MedCity Smiles Community
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 rounded-xl hover:bg-surface hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Settings &amp; Subscription
          </Link>
        </aside>

        {/* Dynamic Section View */}
        <div className="flex-1 bg-surface p-6 sm:p-8 rounded-2xl border border-line-subtle shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
