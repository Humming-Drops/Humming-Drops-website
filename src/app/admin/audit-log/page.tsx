import { hasPermission } from "@/lib/clerk-auth";
import { listAdministrativeAuditLogs } from "@/lib/audit-log";
import { EmptyTableState } from "@/components/admin/status-badge";

export default async function AdminAuditLogPage() {
  const canRead = await hasPermission("audit:read");
  if (!canRead) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to view the audit log.
      </div>
    );
  }

  const rows = await listAdministrativeAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-content-secondary">Administrative activity</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">Audit log</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface shadow-card">
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
            {rows.map(({ log, actorEmail }) => (
              <tr key={log.id} className="border-b border-line-subtle last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                <td className="px-4 py-3 text-content-secondary">
                  {log.resourceType}
                  {log.resourceId ? ` · ${log.resourceId}` : ""}
                </td>
                <td className="px-4 py-3">{actorEmail || "system"}</td>
                <td className="px-4 py-3 text-content-secondary whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <EmptyTableState
            title="No administrative activity yet"
            description="Staff changes, role assignments, and subscription status updates will be audited here."
          />
        )}
      </div>
    </div>
  );
}
