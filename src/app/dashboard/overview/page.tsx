import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Overview | Subscriber Dashboard",
};

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Today&apos;s Breakfast Box</h1>
        <p className="text-xs text-stone-500">Track your morning delivery status and today&apos;s nutritional mix.</p>
      </div>

      <div className="p-5 rounded-xl border border-forest-200 bg-forest-50/30 space-y-2">
        <div className="text-xs font-semibold text-forest-800 uppercase tracking-wider">Morning Delivery Status</div>
        <div className="text-lg font-bold text-forest-900">Preparing fresh at Berrybeats Cafe, Bangalore</div>
        <p className="text-xs text-stone-600">
          Your morning box is being freshly cut and assembled. Delivery is scheduled for your doorstep.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-500">
        Active interactive delivery tracking and real-time menu display will be connected in Phase 8 (Subscriber Dashboard).
      </div>
    </div>
  );
}
