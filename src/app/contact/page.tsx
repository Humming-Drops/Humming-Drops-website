import type { Metadata } from "next";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "Contact Us & Bangalore Kitchen",
  description: "Get in touch with Humming Drops and MedCity Smiles in Bangalore.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-stone-600">
          Have questions about your morning breakfast box or the MedCity Smiles community? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-2">
          <div className="text-xs uppercase font-semibold text-stone-400">Phone &amp; WhatsApp</div>
          <div className="text-xl font-bold text-stone-900">{OFFICIAL_CONTACT.phone}</div>
          <p className="text-xs text-stone-500">Available for customer assistance and morning delivery queries.</p>
        </div>

        <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-2">
          <div className="text-xs uppercase font-semibold text-stone-400">Official Email</div>
          <div className="text-xl font-bold text-stone-900">{OFFICIAL_CONTACT.email}</div>
          <p className="text-xs text-stone-500">Inquiries, partnerships, and corporate subscriptions.</p>
        </div>

        <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-2 sm:col-span-2">
          <div className="text-xs uppercase font-semibold text-stone-400">Bangalore Operational Kitchen</div>
          <div className="text-xl font-bold text-stone-900">{OFFICIAL_CONTACT.kitchenLocation}</div>
          <p className="text-xs text-stone-500">Where our daily breakfast boxes are prepared fresh every morning.</p>
        </div>
      </div>
    </div>
  );
}
