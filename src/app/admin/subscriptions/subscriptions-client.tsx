"use client";

import { useEffect, useState } from "react";

interface SubscriptionRow {
  subscription: {
    id: string;
    status: string;
    leadReferenceCode: string;
    pauseStart: string | null;
    pauseEnd: string | null;
  };
  plan: { name: string } | null;
  customerName: string | null;
  customerPhone: string;
  area: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending_confirmation: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed_active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  paused: "bg-stone-100 text-stone-700 border-stone-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-stone-100 text-stone-500 border-stone-200",
};

export function SubscriptionsClient() {
  const [rows, setRows] = useState<SubscriptionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pauseModalId, setPauseModalId] = useState<string | null>(null);
  const [pauseStart, setPauseStart] = useState("");
  const [pauseEnd, setPauseEnd] = useState("");

  const load = () => {
    fetch("/api/admin/subscriptions")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to load subscriptions.");
        return res.json();
      })
      .then((json) => setRows(json.subscriptions))
      .catch((err) => setLoadError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    setActionError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || `Failed to ${action} subscription.`);
        return;
      }
      setPauseModalId(null);
      load();
    } catch {
      setActionError(`Network error trying to ${action} the subscription.`);
    } finally {
      setBusyId(null);
    }
  };

  if (loadError) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>;
  }
  if (!rows) {
    return <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-content-secondary">Lifecycle management</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">Subscriptions</h2>
      </div>

      {actionError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{actionError}</div>}

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle text-xs text-content-secondary">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ subscription, plan, customerName, area }) => (
              <tr key={subscription.id} className="border-b border-line-subtle last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{subscription.leadReferenceCode}</td>
                <td className="px-4 py-3">{customerName || "—"}</td>
                <td className="px-4 py-3">{plan?.name || "—"}</td>
                <td className="px-4 py-3 text-content-secondary">{area || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[subscription.status] ?? ""}`}
                  >
                    {subscription.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {subscription.status === "pending_confirmation" && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "confirm")}
                        className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Confirm
                      </button>
                    )}
                    {subscription.status === "confirmed_active" && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => {
                          setPauseModalId(subscription.id);
                          setPauseStart("");
                          setPauseEnd("");
                        }}
                        className="rounded-full border border-line-subtle px-3 py-1 text-xs font-semibold text-content-primary disabled:opacity-60"
                      >
                        Pause
                      </button>
                    )}
                    {subscription.status === "paused" && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "resume")}
                        className="rounded-full border border-line-subtle px-3 py-1 text-xs font-semibold text-content-primary disabled:opacity-60"
                      >
                        Resume
                      </button>
                    )}
                    {!["cancelled", "expired"].includes(subscription.status) && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "cancel")}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-sm text-content-secondary">No subscriptions found.</p>}
      </div>

      {pauseModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-content-primary">Pause subscription</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-content-secondary">Pause start</label>
              <input
                type="date"
                value={pauseStart}
                onChange={(e) => setPauseStart(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-content-secondary">Pause end</label>
              <input
                type="date"
                value={pauseEnd}
                onChange={(e) => setPauseEnd(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPauseModalId(null)}
                className="px-3 py-2 text-xs font-semibold text-content-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!pauseStart || !pauseEnd || busyId === pauseModalId}
                onClick={() => runAction(pauseModalId, "pause", { pauseStart, pauseEnd })}
                className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Confirm pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
