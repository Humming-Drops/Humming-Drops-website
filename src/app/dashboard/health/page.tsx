"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, HeartPulse } from "lucide-react";
import {
  DashboardCard,
  DashboardError,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-ui";

export default function DashboardHealthPage() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [vitalsCount, setVitalsCount] = useState(0);

  useEffect(() => {
    fetch("/api/customer/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load health records.");
        const data = await response.json().catch(() => ({}));
        setVitalsCount(Array.isArray(data.vitals) ? data.vitals.length : 0);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Health vitals"
        description="Only verified records from your MedCity checkups appear here."
      />
      <DashboardCard as="div" tone="teal" className="flex items-start gap-3 text-sm text-teal-950">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
        <p>Only you and authorised MedCity staff can see these results.</p>
      </DashboardCard>
      {state === "loading" && (
        <div className="animate-pulse" role="status" aria-busy="true" aria-label="Loading health records">
          <div className="h-40 rounded-2xl bg-muted/60 border border-line-subtle" />
        </div>
      )}
      {state === "error" && (
        <DashboardError title="Health records are temporarily unavailable. Please refresh to try again." />
      )}
      {state === "ready" && vitalsCount === 0 && (
        <DashboardCard className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
            <HeartPulse className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-content-primary pt-1">
            No verified records yet
          </h2>
          <p className="text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
            Your dashboard will display results automatically after a verified MedCity Health Labs checkup record is entered.
          </p>
        </DashboardCard>
      )}
      {state === "ready" && vitalsCount > 0 && (
        <DashboardCard className="text-sm text-content-secondary">
          {vitalsCount} verified record{vitalsCount === 1 ? "" : "s"} available. Detailed clinical presentation will be added with the authorized clinician workflow.
        </DashboardCard>
      )}
    </DashboardPage>
  );
}
