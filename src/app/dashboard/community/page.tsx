import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedCity Smiles Community | Subscriber Dashboard",
};

export default function DashboardCommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-teal-900">MedCity Smiles Community Hub</h1>
        <p className="text-xs text-stone-500">Live expert-led seminars, mindful classes, and doctor Q&amp;A sessions.</p>
      </div>

      <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/30 space-y-3">
        <h2 className="text-sm font-bold text-teal-900">Upcoming Live Sessions &amp; Seminars</h2>
        <p className="text-xs text-stone-600">
          As a Humming Drops subscriber, you enjoy full membership to the MedCity Smiles community. Live class schedules and RSVP functionality will be activated in Phase 8.
        </p>
      </div>
    </div>
  );
}
