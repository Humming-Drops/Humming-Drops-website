import type { Metadata } from "next";
import Link from "next/link";
import { leadRepository } from "@/lib/lead-storage";
import { hasPermission } from "@/lib/auth/server";
import { visibleAdminSections } from "@/lib/auth/admin-sections";
import {
  AdminPageHeader,
  AdminSectionHeading,
  adminButton,
  adminCard,
} from "@/components/admin/admin-ui";

export default async function AdminOverviewPage() {
  const canReadLeads = await hasPermission("leads:read");
  const nextActions = (await visibleAdminSections(hasPermission)).filter((s) => s.action);
  const leads = canReadLeads ? await leadRepository.getAllLeads() : [];
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
        {(canReadLeads ? metrics : []).map(([label, value]) => (
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
          {nextActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={adminButton(index === 0 ? "primary" : "secondary")}
            >
              {action.action}
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
