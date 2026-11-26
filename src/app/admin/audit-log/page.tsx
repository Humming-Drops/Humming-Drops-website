import type { Metadata } from "next";
import Link from "next/link";
import { hasPermission } from "@/lib/auth/server";
import { countAdministrativeAuditLogs, listAdministrativeAuditLogs } from "@/lib/audit-log";
import {
  AUDIT_KINDS,
  auditEntrySummary,
  auditKindPrefix,
  auditResourceHref,
  humanizeAuditAction,
  parseAuditKind,
  parsePageNumber,
} from "@/lib/audit-format";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyTableState } from "@/components/admin/status-badge";
import { AdminPageHeader, adminButton, adminInput, adminLabel, adminTable } from "@/components/admin/admin-ui";

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
  const prefix = auditKindPrefix(kind);

  const total = await countAdministrativeAuditLogs(prefix);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePageNumber(params.page), totalPages);
  const rows = await listAdministrativeAuditLogs({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, actionPrefix: prefix });
  const pageHref = (p: number) => `/admin/audit-log?kind=${kind}&page=${p}`;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Administrative activity"
        title="Audit log"
        actions={
          <form method="get" className="flex items-end gap-3">
            <div className="space-y-1.5">
              <label htmlFor="audit-kind" className={adminLabel}>
                Show
              </label>
              <select id="audit-kind" name="kind" defaultValue={kind} className={adminInput}>
                {AUDIT_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={adminButton("secondary")}>
              Apply
            </button>
          </form>
        }
      />

      <div tabIndex={0} role="region" aria-label="Audit log table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Action</th>
              <th className={adminTable.th}>What</th>
              <th className={adminTable.th}>Actor</th>
              <th className={adminTable.th}>When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ log, actorEmail }) => {
              const href = auditResourceHref(log.resourceType, log.resourceId);
              const summary = auditEntrySummary(log.resourceType, log.metadata);
              return (
                <tr key={log.id} className={adminTable.row}>
                  <td className={adminTable.td}>
                    <span className="font-medium text-content-primary">{humanizeAuditAction(log.action)}</span>
                    <span className="block font-mono text-xs text-content-secondary">{log.action}</span>
                  </td>
                  <td className={`${adminTable.td} max-w-[22rem] whitespace-normal text-content-secondary`}>
                    {href ? (
                      <Link href={href} className="font-semibold text-brand-primary hover:underline">
                        {summary ?? log.resourceType.replace(/_/g, " ")}
                      </Link>
                    ) : (
                      summary ?? log.resourceType.replace(/_/g, " ")
                    )}
                  </td>
                  <td className={adminTable.td}>{actorEmail || "system"}</td>
                  <td className={`${adminTable.td} text-content-secondary`}>
                    {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
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

      <nav
        aria-label="Audit log pages"
        className="flex flex-wrap items-center justify-between gap-3 text-xs text-content-secondary"
      >
        <span>
          Page {page} of {totalPages}, {total} entries
        </span>
        <span className="flex gap-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className={adminButton("secondary", "sm")}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Newer
            </Link>
          )}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className={adminButton("secondary", "sm")}>
              Older
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
