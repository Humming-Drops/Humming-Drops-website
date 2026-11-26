import type { Metadata } from "next";
import Link from "next/link";
import { leadRepository } from "@/lib/lead-storage";
import {
  AdminPageHeader,
  AdminSectionHeading,
  adminButton,
  adminCard,
} from "@/components/admin/admin-ui";

const NEXT_ACTIONS = [
  { label: "Review registrations", href: "/admin/leads" },
  { label: "Manage subscriptions", href: "/admin/subscriptions" },
  { label: "View payments", href: "/admin/payments" },
  { label: "Manage website content", href: "/admin/content" },
  { label: "Manage staff roles", href: "/admin/staff" },
];

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
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Operational overview" title="Today's control center" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className={`${adminCard} p-4 sm:p-5`}>
            <p className="text-xs font-semibold text-content-secondary">{label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold tabular-nums text-content-primary sm:text-3xl">
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className={`${adminCard} p-4 sm:p-6`}>
        <AdminSectionHeading>Next actions</AdminSectionHeading>
        <div className="mt-4 flex flex-wrap gap-3">
          {NEXT_ACTIONS.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={adminButton(index === 0 ? "primary" : "secondary")}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Admin Overview",
};
