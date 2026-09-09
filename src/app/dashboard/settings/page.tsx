import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings & Profile | Subscriber Dashboard",
};

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Account &amp; Subscription Settings</h1>
        <p className="text-xs text-stone-500">Manage your contact details, delivery address, and payment preferences.</p>
      </div>

      <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-4">
        <h2 className="text-sm font-bold text-stone-800">Bangalore Delivery Address &amp; Contact</h2>
        <p className="text-xs text-stone-600">
          Update your morning delivery location and instructions. Full account management forms will be activated in Phase 8.
        </p>
      </div>
    </div>
  );
}
