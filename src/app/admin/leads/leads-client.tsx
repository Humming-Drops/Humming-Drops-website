"use client";

import { Fragment, useMemo, useState } from "react";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import { adminButton, adminInput, adminLabel, adminTable } from "@/components/admin/admin-ui";
import { telLink, whatsappLink } from "@/lib/whatsapp";

export interface LeadRow {
  id: string;
  reference: string;
  planName: string;
  status: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  deliveryNotes: string;
  dietaryType: string;
  allergies: string[];
}

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "pending_confirmation", label: "Pending confirmation" },
  { value: "confirmed_active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

export function LeadsClient({ rows }: { rows: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_confirmation");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.reference, r.fullName, r.phone, r.email, r.area].some((v) => (v ?? "").toLowerCase().includes(q));
    });
  }, [sorted, query, statusFilter]);

  const pendingCount = rows.filter((r) => r.status === "pending_confirmation").length;
  const shown = filtered.slice(0, visible);

  return (
    <div className="space-y-4">
      <p className="text-sm text-content-secondary">
        <strong className="text-content-primary">{pendingCount}</strong> waiting for a follow-up · {rows.length} total
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="leads-search" className={adminLabel}>
            Search
          </label>
          <input
            id="leads-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Reference, name, phone, email or area"
            className={adminInput}
          />
        </div>
        <div className="space-y-1.5 sm:w-56">
          <label htmlFor="leads-status" className={adminLabel}>
            Status
          </label>
          <select
            id="leads-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className={adminInput}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div tabIndex={0} role="region" aria-label="Leads table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Customer</th>
              <th className={adminTable.th}>Contact</th>
              <th className={adminTable.th}>Plan</th>
              <th className={adminTable.th}>Status</th>
              <th className={adminTable.th}>Received</th>
              <th className={adminTable.th}>
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const wa = whatsappLink(r.phone);
              const tel = telLink(r.phone);
              const isOpen = openId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className={adminTable.row}>
                    <td className={adminTable.td}>
                      <div className="font-medium text-content-primary">{r.fullName || "—"}</div>
                      <div className="font-mono text-xs text-content-secondary">{r.reference}</div>
                    </td>
                    <td className={adminTable.td}>
                      <div className="flex flex-wrap items-center gap-2">
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={adminButton("primary", "sm", "bg-emerald-700 hover:bg-emerald-800")}
                            aria-label={`WhatsApp ${r.fullName}`}
                          >
                            WhatsApp
                          </a>
                        )}
                        {tel && (
                          <a href={tel} className={adminButton("secondary", "sm")} aria-label={`Call ${r.fullName}`}>
                            Call
                          </a>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-content-secondary">
                        {r.phone}
                        {r.email ? (
                          <>
                            {" · "}
                            <a href={`mailto:${r.email}`} className="inline-flex min-h-[24px] items-center hover:underline">
                              {r.email}
                            </a>
                          </>
                        ) : null}
                      </div>
                    </td>
                    <td className={adminTable.td}>{r.planName}</td>
                    <td className={adminTable.td}>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className={`${adminTable.td} text-content-secondary`}>
                      {new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                    </td>
                    <td className="sticky right-0 bg-surface px-4 py-2 text-right shadow-[-8px_0_12px_-10px_rgba(0,0,0,0.25)]">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`lead-detail-${r.id}`}
                        onClick={() => setOpenId(isOpen ? null : r.id)}
                        className={adminButton("ghost", "sm")}
                      >
                        {isOpen ? "Hide details" : "Details"}
                        <span className="sr-only"> for {r.reference}</span>
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr id={`lead-detail-${r.id}`} className="border-b border-line-subtle bg-muted/20">
                      <td colSpan={6} className="px-4 py-4">
                        <dl className="grid gap-3 whitespace-normal text-sm sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <dt className="text-xs font-semibold text-content-secondary">Delivery address</dt>
                            <dd>{r.address || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-content-secondary">Diet</dt>
                            <dd className="capitalize">{r.dietaryType ? r.dietaryType.replace(/_/g, " ") : "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-content-secondary">Allergies</dt>
                            <dd>{r.allergies.length ? r.allergies.join(", ") : "None given"}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-xs font-semibold text-content-secondary">Delivery notes</dt>
                            <dd>{r.deliveryNotes || "—"}</dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <EmptyTableState
            title="No registrations yet"
            description="New breakfast box registrations from the subscribe page appear here."
          />
        ) : filtered.length === 0 ? (
          <EmptyTableState title="No leads match" description="Try a different search or status." />
        ) : null}
      </div>

      {filtered.length > visible && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-content-secondary">
            Showing {shown.length} of {filtered.length}
          </p>
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={adminButton("secondary")}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
