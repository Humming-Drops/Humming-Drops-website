"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ShieldCheck, HeartPulse } from "lucide-react";

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
      {state === "loading" && (
        <div className="space-y-3 animate-pulse" aria-busy="true" aria-label="Loading health records">
          <div className="h-24 rounded-2xl bg-muted/70 border border-line-subtle" />
        </div>
      )}
      {state === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <p>Health records are temporarily unavailable. Please refresh to try again.</p>
        </div>
      )}
      {state === "ready" && vitalsCount === 0 && (
        <div className="rounded-2xl border border-line-subtle bg-muted/20 p-6 sm:p-8 text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
            <HeartPulse className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-content-primary pt-1">
            No verified records yet
          </h2>
          <p className="text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
            Your dashboard will display results automatically after a verified MedCity Health Labs checkup record is entered.
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
