import type { Metadata } from "next";
import Link from "next/link";
import { leadRepository } from "@/lib/lead-storage";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { LeadsClient, type LeadRow } from "./leads-client";

export default async function AdminLeadsPage() {
  const leads = await leadRepository.getAllLeads();

  // Only what the follow-up team needs; never IP address / user agent.
  const rows: LeadRow[] = leads.map((lead) => ({
    id: lead.id,
    reference: lead.leadReferenceCode,
    planName: lead.planName,
    status: lead.status,
    createdAt: lead.createdAt,
    fullName: lead.customer.fullName,
    phone: lead.customer.phone,
    email: lead.customer.email,
    address: [
      lead.deliveryAddress?.flatNo,
      lead.deliveryAddress?.buildingName,
      lead.deliveryAddress?.streetAddress,
      lead.deliveryAddress?.area,
      lead.deliveryAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", "),
    area: lead.deliveryAddress?.area ?? "",
    deliveryNotes: lead.deliveryAddress?.deliveryNotes ?? "",
    dietaryType: lead.dietaryPreferences?.dietaryType ?? "",
    allergies: lead.dietaryPreferences?.allergies ?? [],
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customer registrations"
        title="Leads"
        description={
          <p>
            Contact new registrations on WhatsApp or by phone. Once you have spoken to them, confirm, pause or cancel in{" "}
            <Link href="/admin/subscriptions" className="font-semibold text-brand-primary hover:underline">
              Subscriptions
            </Link>
            .
          </p>
        }
      />
      <LeadsClient rows={rows} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Admin Leads",
};
