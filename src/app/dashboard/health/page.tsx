"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, HeartPulse } from "lucide-react";

export default function DashboardHealthPage() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [vitalsCount, setVitalsCount] = useState(0);

  useEffect(() => {
    fetch("/api/customer/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load health records.");
        const data = await response.json();
        setVitalsCount(Array.isArray(data.vitals) ? data.vitals.length : 0);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 border-b border-line-subtle pb-6">
        <HeartPulse className="mt-1 h-6 w-6 text-teal-700" />
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">Health vitals</h1>
          <p className="mt-1 text-sm text-content-secondary">
            Only verified records from your MedCity checkups appear here.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 text-sm text-teal-950">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
        <p>Health data is loaded from your authenticated account and is never sourced from browser storage.</p>
      </div>
      {state === "loading" && <p className="text-sm text-content-secondary">Loading your records…</p>}
      {state === "error" && <p className="text-sm text-red-700">Health records are temporarily unavailable.</p>}
      {state === "ready" && vitalsCount === 0 && (
        <div className="rounded-2xl border border-line-subtle bg-surface p-6">
          <h2 className="font-display text-lg font-bold text-content-primary">No verified records yet</h2>
          <p className="mt-2 text-sm text-content-secondary">
            Your dashboard will display results after a legitimate MedCity checkup record is entered.
          </p>
        </div>
      )}
      {state === "ready" && vitalsCount > 0 && (
        <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
          {vitalsCount} verified record{vitalsCount === 1 ? "" : "s"} available. Detailed clinical presentation will be added with the authorized clinician workflow.
        </div>
      )}
    </div>
  );
}
