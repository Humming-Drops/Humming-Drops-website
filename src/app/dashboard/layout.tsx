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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-forest-900 text-lg">
            Humming Drops
          </Link>
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
            Subscriber Portal
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-stone-500">Bangalore Kitchen: Berrybeats</span>
          <Link href="/" className="text-forest-800 font-semibold hover:underline">
            Back to Website
          </Link>
        </div>
      </header>

      {/* Main dashboard content with sub-nav */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Nav Shell */}
        <aside className="w-full md:w-56 space-y-1 text-sm font-medium text-stone-600 shrink-0">
          <Link
            href="/dashboard/overview"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:text-forest-900 transition"
          >
            Today&apos;s Box &amp; Status
          </Link>
          <Link
            href="/dashboard/delivery"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:text-forest-900 transition"
          >
            Delivery Calendar &amp; Pause
          </Link>
          <Link
            href="/dashboard/health"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:text-teal-900 transition"
          >
            Health Vitals (Protected)
          </Link>
          <Link
            href="/dashboard/community"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:text-teal-900 transition"
          >
            MedCity Smiles Community
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:text-forest-900 transition"
          >
            Settings &amp; Subscription
          </Link>
        </aside>

        {/* Dynamic Section View */}
        <main className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
