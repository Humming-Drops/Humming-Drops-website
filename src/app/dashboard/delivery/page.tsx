import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Calendar & Pause | Subscriber Dashboard",
};

export default function DashboardDeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Delivery Calendar &amp; Vacation Pause</h1>
        <p className="text-xs text-stone-500">Easily pause your morning deliveries when traveling.</p>
      </div>

      <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-4">
        <h2 className="text-sm font-bold text-stone-800">1-Click Delivery Pause (Provisional)</h2>
        <p className="text-xs text-stone-600">
          Pause deliveries for tomorrow or pick a vacation date range. Note: Exact cutoff hours and weekend policies are provisional (CLIENT INPUT REQUIRED per CIR-03/04).
        </p>
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded-lg bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed"
        >
          Pause Tomorrow&apos;s Delivery (Phase 8)
        </button>
      </div>
    </div>
  );
}
