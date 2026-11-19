"use client";

import { useEffect, useState } from "react";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  adminButton,
  adminInput,
  adminLabel,
  adminTable,
} from "@/components/admin/admin-ui";

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
    return (
      <AdminNotice tone="error">{loadError}</AdminNotice>
    );
  }
  if (!rows) {
    return <AdminLoadingState label="Loading subscriptions" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Lifecycle management" title="Subscriptions" />

      {actionError && (
        <AdminNotice tone="error">{actionError}</AdminNotice>
      )}

      <div tabIndex={0} role="region" aria-label="Subscriptions table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Reference</th>
              <th className={adminTable.th}>Customer</th>
              <th className={adminTable.th}>Plan</th>
              <th className={adminTable.th}>Area</th>
              <th className={adminTable.th}>Status</th>
              <th className={adminTable.th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ subscription, plan, customerName, area }) => (
              <tr key={subscription.id} className={adminTable.row}>
                <td className={adminTable.mono}>{subscription.leadReferenceCode}</td>
                <td className={adminTable.td}>{customerName || "—"}</td>
                <td className={adminTable.td}>{plan?.name || "—"}</td>
                <td className={`${adminTable.td} text-content-secondary`}>{area || "—"}</td>
                <td className={adminTable.td}>
                  <StatusBadge status={subscription.status} />
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex min-h-[36px] items-center justify-end gap-2">
                    {subscription.status === "pending_confirmation" && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "confirm")}
                        className={adminButton("primary", "sm")}
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
                        className={adminButton("secondary", "sm")}
                      >
                        Pause
                      </button>
                    )}
                    {subscription.status === "paused" && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "resume")}
                        className={adminButton("secondary", "sm")}
                      >
                        Resume
                      </button>
                    )}
                    {!["cancelled", "expired"].includes(subscription.status) && (
                      <button
                        type="button"
                        disabled={busyId === subscription.id}
                        onClick={() => runAction(subscription.id, "cancel")}
                        className={adminButton("danger", "sm")}
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
        {rows.length === 0 && (
          <EmptyTableState
            title="No subscriptions found"
            description="Confirmed and active subscriber delivery plans will appear here."
          />
        )}
      </div>

      {pauseModalId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setPauseModalId(null);
          }}
        >
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-line-subtle bg-surface p-6 shadow-2xl">
            <h3 id="pause-modal-title" className="font-display text-lg font-bold text-content-primary">
              Pause subscription
            </h3>
            <div className="space-y-1.5">
              <label htmlFor="admin-pause-start" className={adminLabel}>
                Pause start
              </label>
              <input
                id="admin-pause-start"
                type="date"
                value={pauseStart}
                onChange={(e) => setPauseStart(e.target.value)}
                className={adminInput}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="admin-pause-end" className={adminLabel}>
                Pause end
              </label>
              <input
                id="admin-pause-end"
                type="date"
                value={pauseEnd}
                onChange={(e) => setPauseEnd(e.target.value)}
                className={adminInput}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPauseModalId(null)}
                className={adminButton("ghost")}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!pauseStart || !pauseEnd || busyId === pauseModalId}
                onClick={() => runAction(pauseModalId, "pause", { pauseStart, pauseEnd })}
                className={adminButton("primary")}
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
