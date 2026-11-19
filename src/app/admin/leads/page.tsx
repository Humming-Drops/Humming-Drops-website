import type { Metadata } from "next";
import Link from "next/link";
import { leadRepository } from "@/lib/lead-storage";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, adminTable } from "@/components/admin/admin-ui";

export default async function AdminLeadsPage() {
  const leads = await leadRepository.getAllLeads();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customer registrations"
        title="Lead management"
        description={
          <p>
            This list is read-only. To confirm, pause or cancel a registration, open{" "}
            <Link href="/admin/subscriptions" className="font-semibold text-brand-primary hover:underline">
              Subscriptions
            </Link>
            .
          </p>
        }
      />
      <div tabIndex={0} role="region" aria-label="Leads table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Reference</th>
              <th className={adminTable.th}>Customer</th>
              <th className={adminTable.th}>Plan</th>
              <th className={adminTable.th}>Status</th>
              <th className={adminTable.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className={adminTable.row}>
                <td className={adminTable.mono}>{lead.leadReferenceCode}</td>
                <td className={`${adminTable.td} font-medium text-content-primary`}>{lead.customer.fullName}</td>
                <td className={adminTable.td}>{lead.planName}</td>
                <td className={adminTable.td}>
                  <StatusBadge status={lead.status} />
                </td>
                <td className={`${adminTable.td} text-content-secondary`}>
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

export const metadata: Metadata = {
  title: "Admin Leads",
};
