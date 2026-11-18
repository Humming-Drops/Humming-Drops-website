import type { Metadata } from "next";
import Link from "next/link";
import { hasPermission } from "@/lib/auth/server";
import { countAdministrativeAuditLogs, listAdministrativeAuditLogs } from "@/lib/audit-log";
import {
  AUDIT_KINDS,
  auditKindPrefix,
  auditResourceHref,
  humanizeAuditAction,
  parseAuditKind,
  parsePageNumber,
} from "@/lib/audit-format";
import { EmptyTableState } from "@/components/admin/status-badge";

const PAGE_SIZE = 50;

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; page?: string }>;
}) {
  const canRead = await hasPermission("audit:read");
  if (!canRead) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to view the audit log.
      </div>
    );
  }

  const params = await searchParams;
  const kind = parseAuditKind(params.kind);
  const page = parsePageNumber(params.page);
  const prefix = auditKindPrefix(kind);

  const [rows, total] = await Promise.all([
    listAdministrativeAuditLogs({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, actionPrefix: prefix }),
    countAdministrativeAuditLogs(prefix),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (p: number) => `/admin/audit-log?kind=${kind}&page=${p}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-content-secondary">Administrative activity</p>
          <h2 className="font-display text-3xl font-extrabold text-content-primary">Audit log</h2>
        </div>
        <form method="get" className="flex items-end gap-2">
          <div className="space-y-1">
            <label htmlFor="audit-kind" className="block text-xs font-semibold text-content-secondary">
              Show
            </label>
            <select
              id="audit-kind"
              name="kind"
              defaultValue={kind}
              className="rounded-xl border border-line-subtle bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              {AUDIT_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
          >
            Apply
          </button>
        </form>
      </div>

      <div tabIndex={0} role="region" aria-label="Audit log table (scrollable)" className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle bg-muted/40 text-xs font-semibold text-content-secondary">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ log, actorEmail }) => {
              const href = auditResourceHref(log.resourceType, log.resourceId);
              return (
                <tr key={log.id} className="border-b border-line-subtle last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-content-primary">{humanizeAuditAction(log.action)}</span>
                    <span className="block font-mono text-[11px] text-content-secondary">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-content-secondary">
                    {href ? (
                      <Link href={href} className="font-semibold text-brand-primary hover:underline">
                        {log.resourceType.replace(/_/g, " ")}
                      </Link>
                    ) : (
                      log.resourceType.replace(/_/g, " ")
                    )}
                  </td>
                  <td className="px-4 py-3">{actorEmail || "system"}</td>
                  <td className="px-4 py-3 text-content-secondary whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <EmptyTableState
            title="No activity found"
            description="Staff changes, role assignments, content changes and customer updates are audited here."
          />
        )}
      </div>

      <nav aria-label="Audit log pages" className="flex items-center justify-between text-xs text-content-secondary">
        <span>
          Page {page} of {totalPages} · {total} entries
        </span>
        <span className="flex gap-3">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="font-semibold text-brand-primary hover:underline">
              ← Newer
            </Link>
          )}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="font-semibold text-brand-primary hover:underline">
              Older →
            </Link>
          )}
        </span>
      </nav>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Admin Audit Log",
};
