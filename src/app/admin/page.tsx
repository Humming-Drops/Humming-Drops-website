import Link from "next/link";
import { leadRepository } from "@/lib/lead-storage";

export default async function AdminOverviewPage() {
  const leads = await leadRepository.getAllLeads();
  const pending = leads.filter((lead) => lead.status === "pending_confirmation").length;
  const active = leads.filter((lead) => lead.status === "confirmed_active").length;

  const metrics = [
    ["Total registrations", leads.length],
    ["Pending confirmation", pending],
    ["Active subscriptions", active],
    ["Cancelled or expired", leads.filter((lead) => ["cancelled", "expired"].includes(lead.status)).length],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-content-secondary">Operational overview</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">
          Today&apos;s control center
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line-subtle bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold text-content-secondary">{label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-content-primary">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line-subtle bg-surface p-6">
        <h3 className="font-display text-lg font-bold text-content-primary">Next actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white" href="/admin/leads">
            Review registrations
          </Link>
          <Link className="rounded-full border border-line-subtle px-4 py-2 text-xs font-semibold text-content-primary" href="/admin/content">
            Manage website content
          </Link>
        </div>
      </div>
    </div>
  );
}
