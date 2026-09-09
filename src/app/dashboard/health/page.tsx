import type { Metadata } from "next";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";

export const metadata: Metadata = {
  title: "Health Vitals Record | Subscriber Dashboard",
};

export default function DashboardHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
          Private Health Data · Strictly Scoped to Authenticated User
        </span>
        <h1 className="text-2xl font-bold text-teal-900 mt-2">Monthly Health Vitals Record</h1>
        <p className="text-xs text-stone-500">
          Track your free monthly preventative checkup results powered by MedCity Health Labs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONFIRMED_VITALS_BENEFITS.map((v, i) => (
          <div key={i} className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 space-y-2">
            <span className="text-xs font-semibold text-teal-700">{v.frequency} Checkup</span>
            <h2 className="font-bold text-stone-900">{v.metricName}</h2>
            <p className="text-xs text-stone-600">{v.purpose}</p>
            <div className="text-xs text-stone-400 italic pt-2 border-t border-teal-100">
              Lab Reports protected by strict Supabase RLS policies.
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
        <div className="font-semibold text-stone-800">Security &amp; Privacy Architecture:</div>
        <div>
          Health information is strictly private. Medical records are never exposed through public APIs or client configurations. In Phase 8, authenticated subscribers can view their verified checkup reports and download PDF summaries securely.
        </div>
      </div>
    </div>
  );
}
