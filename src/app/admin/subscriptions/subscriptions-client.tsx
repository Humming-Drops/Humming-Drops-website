"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import { AdminDialog } from "@/components/admin/admin-dialog";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  adminButton,
  adminErrorText,
  adminInput,
  adminLabel,
  adminTable,
} from "@/components/admin/admin-ui";
import { telLink, whatsappLink } from "@/lib/whatsapp";

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

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending_confirmation", label: "Pending confirmation" },
  { value: "confirmed_active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

const ACTION_DONE: Record<string, string> = {
  confirm: "confirmed — the customer is now active",
  pause: "paused",
  resume: "resumed",
  cancel: "cancelled",
};

export function SubscriptionsClient() {
  const [rows, setRows] = useState<SubscriptionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [pauseRow, setPauseRow] = useState<SubscriptionRow | null>(null);
  const [pauseStart, setPauseStart] = useState("");
  const [pauseEnd, setPauseEnd] = useState("");
  const [pauseError, setPauseError] = useState<string | null>(null);
  const [cancelRow, setCancelRow] = useState<SubscriptionRow | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

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

  /** Runs a lifecycle action. Returns an error message, or null on success. */
  const runAction = async (row: SubscriptionRow, action: string, extra?: Record<string, unknown>) => {
    setActionError(null);
    setNotice(null);
    setBusyId(row.subscription.id);
    try {
      const res = await fetch(`/api/admin/subscriptions/${row.subscription.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return (json.error as string) || `Failed to ${action} the subscription.`;
      setNotice(`${row.subscription.leadReferenceCode} ${ACTION_DONE[action] ?? "updated"}.`);
      load();
      return null;
    } catch {
      return `Network error trying to ${action} the subscription.`;
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter(({ subscription, customerName, customerPhone, area }) => {
      if (statusFilter !== "all" && subscription.status !== statusFilter) return false;
      if (!q) return true;
      return [subscription.leadReferenceCode, customerName ?? "", customerPhone ?? "", area ?? ""].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  if (loadError) {
    return <AdminNotice tone="error">{loadError}</AdminNotice>;
  }
  if (!rows) {
    return <AdminLoadingState label="Loading subscriptions" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Lifecycle management"
        title="Subscriptions"
        description={`${rows.length} total · ${rows.filter((r) => r.subscription.status === "pending_confirmation").length} waiting for confirmation`}
      />

      {actionError && <AdminNotice tone="error">{actionError}</AdminNotice>}
      {notice && <AdminNotice tone="success">{notice}</AdminNotice>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="subs-search" className={adminLabel}>
            Search
          </label>
          <input
            id="subs-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Reference, name, phone or area"
            className={adminInput}
          />
        </div>
        <div className="space-y-1.5 sm:w-56">
          <label htmlFor="subs-status" className={adminLabel}>
            Status
          </label>
          <select id="subs-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={adminInput}>
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            {filtered.map((row) => {
              const { subscription, plan, customerName, customerPhone, area } = row;
              const wa = customerPhone ? whatsappLink(customerPhone) : null;
              const busy = busyId === subscription.id;
              return (
                <tr key={subscription.id} className={adminTable.row}>
                  <td className={adminTable.mono}>{subscription.leadReferenceCode}</td>
                  <td className={adminTable.td}>
                    <div className="font-medium">{customerName || "—"}</div>
                    {customerPhone ? (
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-content-secondary">
                        <a href={telLink(customerPhone) ?? undefined} className="inline-flex min-h-[24px] items-center hover:underline">
                          {customerPhone}
                        </a>
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[24px] items-center font-semibold text-emerald-700 hover:underline"
                            aria-label={`WhatsApp ${customerName || customerPhone}`}
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    ) : null}
                  </td>
                  <td className={adminTable.td}>{plan?.name || "—"}</td>
                  <td className={`${adminTable.td} text-content-secondary`}>{area || "—"}</td>
                  <td className={adminTable.td}>
                    <StatusBadge status={subscription.status} />
                    {["paused", "confirmed_active"].includes(subscription.status) && subscription.pauseStart && subscription.pauseEnd ? (
                      <div className="mt-1 text-xs font-semibold text-content-secondary">
                        {subscription.status === "confirmed_active" ? "Vacation: " : ""}
                        {subscription.pauseStart} → {subscription.pauseEnd}
                      </div>
                    ) : null}
                  </td>
                  <td className="sticky right-0 bg-surface px-4 py-2 text-right shadow-[-8px_0_12px_-10px_rgba(0,0,0,0.25)]">
                    <div className="flex min-h-[36px] items-center justify-end gap-2">
                      {subscription.status === "pending_confirmation" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            const err = await runAction(row, "confirm");
                            if (err) setActionError(err);
                          }}
                          className={adminButton("primary", "sm")}
                          aria-label={`Confirm subscription ${subscription.leadReferenceCode}`}
                        >
                          {busy ? "Working…" : "Confirm"}
                        </button>
                      )}
                      {subscription.status === "confirmed_active" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setPauseRow(row);
                            setPauseStart("");
                            setPauseEnd("");
                            setPauseError(null);
                          }}
                          className={adminButton("secondary", "sm")}
                          aria-label={`Pause subscription ${subscription.leadReferenceCode}`}
                        >
                          Pause
                        </button>
                      )}
                      {subscription.status === "paused" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            const err = await runAction(row, "resume");
                            if (err) setActionError(err);
                          }}
                          className={adminButton("secondary", "sm")}
                          aria-label={`Resume subscription ${subscription.leadReferenceCode}`}
                        >
                          Resume
                        </button>
                      )}
                      {!["cancelled", "expired"].includes(subscription.status) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setCancelRow(row);
                            setCancelError(null);
                          }}
                          className={adminButton("danger", "sm")}
                          aria-label={`Cancel subscription ${subscription.leadReferenceCode}`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <EmptyTableState
            title="No subscriptions yet"
            description="Registrations from the subscribe page appear here for confirmation."
          />
        ) : filtered.length === 0 ? (
          <EmptyTableState title="No subscriptions match" description="Try a different search or status." />
        ) : null}
      </div>

      <AdminDialog
        open={pauseRow !== null}
        title="Pause subscription"
        description={pauseRow ? <>Deliveries for {pauseRow.subscription.leadReferenceCode} stop between these dates.</> : null}
        onClose={() => setPauseRow(null)}
        footer={
          <>
            <button type="button" onClick={() => setPauseRow(null)} className={adminButton("ghost")}>
              Keep active
            </button>
            <button
              type="button"
              disabled={!pauseRow || busyId === pauseRow.subscription.id}
              onClick={async () => {
                if (!pauseRow) return;
                if (!pauseStart || !pauseEnd) {
                  setPauseError("Choose both a start and an end date.");
                  return;
                }
                const err = await runAction(pauseRow, "pause", { pauseStart, pauseEnd });
                if (err) setPauseError(err);
                else setPauseRow(null);
              }}
              className={adminButton("primary")}
            >
              Confirm pause
            </button>
          </>
        }
      >
        <div className="space-y-1.5">
          <label htmlFor="admin-pause-start" className={adminLabel}>
            Pause start
          </label>
          <input
            id="admin-pause-start"
            type="date"
            value={pauseStart}
            onChange={(e) => setPauseStart(e.target.value)}
            aria-invalid={pauseError ? true : undefined}
            aria-describedby={pauseError ? "admin-pause-error" : undefined}
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
            min={pauseStart || undefined}
            onChange={(e) => setPauseEnd(e.target.value)}
            aria-invalid={pauseError ? true : undefined}
            aria-describedby={pauseError ? "admin-pause-error" : undefined}
            className={adminInput}
          />
        </div>
        {pauseError && (
          <p id="admin-pause-error" role="alert" className={`${adminErrorText} rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm`}>
            {pauseError}
          </p>
        )}
      </AdminDialog>

      <AdminDialog
        open={cancelRow !== null}
        title="Cancel this subscription?"
        description={
          cancelRow ? (
            <>
              <strong className="text-content-primary">{cancelRow.subscription.leadReferenceCode}</strong>
              {cancelRow.customerName ? <> for {cancelRow.customerName}</> : null} will be cancelled and the customer
              loses member benefits. This can&apos;t be undone here — they would need to register again.
            </>
          ) : null
        }
        onClose={() => setCancelRow(null)}
        footer={
          <>
            <button type="button" onClick={() => setCancelRow(null)} className={adminButton("secondary")}>
              Keep subscription
            </button>
            <button
              type="button"
              disabled={!cancelRow || busyId === cancelRow.subscription.id}
              onClick={async () => {
                if (!cancelRow) return;
                const err = await runAction(cancelRow, "cancel");
                if (err) setCancelError(err);
                else setCancelRow(null);
              }}
              className={adminButton("danger")}
            >
              Yes, cancel it
            </button>
          </>
        }
      >
        {cancelError && (
          <p role="alert" className={`${adminErrorText} rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm`}>
            {cancelError}
          </p>
        )}
      </AdminDialog>
    </div>
  );
}
