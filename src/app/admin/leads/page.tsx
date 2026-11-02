import { leadRepository } from "@/lib/lead-storage";

export default async function AdminLeadsPage() {
  const leads = await leadRepository.getAllLeads();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-content-secondary">Customer registrations</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">Lead management</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle text-xs text-content-secondary">
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
              <tr key={lead.id} className="border-b border-line-subtle last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{lead.leadReferenceCode}</td>
                <td className="px-4 py-3">{lead.customer.fullName}</td>
                <td className="px-4 py-3">{lead.planName}</td>
                <td className="px-4 py-3">{lead.status}</td>
                <td className="px-4 py-3 text-content-secondary">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="p-6 text-sm text-content-secondary">No registrations found.</p>}
      </div>
    </div>
  );
}
