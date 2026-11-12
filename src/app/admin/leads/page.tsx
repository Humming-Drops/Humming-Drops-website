import { leadRepository } from "@/lib/lead-storage";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";

export default async function AdminLeadsPage() {
  const leads = await leadRepository.getAllLeads();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-content-secondary">Customer registrations</p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">Lead management</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle bg-muted/40 text-xs font-semibold text-content-secondary">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-line-subtle last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{lead.leadReferenceCode}</td>
                <td className="px-4 py-3 font-medium text-content-primary">{lead.customer.fullName}</td>
                <td className="px-4 py-3">{lead.planName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-content-secondary whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <EmptyTableState
            title="No registrations found"
            description="New breakfast box leads submitted through /subscribe will appear here."
          />
        )}
      </div>
    </div>
  );
}
