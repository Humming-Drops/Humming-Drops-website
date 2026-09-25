import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock, Sparkles } from "lucide-react";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "Contact Us & Bangalore Kitchen | Humming Drops",
  description: "Get in touch with Humming Drops and MedCity Smiles in Bangalore. Doorstep breakfast delivery support.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FCFDF9] min-h-[calc(100vh-4rem)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Care &amp; Kitchen Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#132A1C] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-[#405347] leading-relaxed">
            Have questions about your morning breakfast box, delivery area, or the MedCity Smiles community? Our Bangalore team is here to assist.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* WhatsApp Direct Action */}
          <div className="p-5 sm:p-6 rounded-3xl border border-emerald-200/80 bg-white shadow-card flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-[#25D366] stroke-white" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Fastest Response
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#132A1C]">WhatsApp Chat</h2>
              <p className="text-xs sm:text-sm text-[#657B6F]">
                Quick orders, plan changes, delivery queries, and pause requests.
              </p>
            </div>
            <a
              href="https://wa.me/918618902810"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>Chat on WhatsApp (+91 8618902810)</span>
            </a>
          </div>

          {/* Direct Phone Call */}
          <div className="p-5 sm:p-6 rounded-3xl border border-[#E3EFE5] bg-white shadow-card flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  Direct Line
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#132A1C]">Call Support</h2>
              <p className="text-xs sm:text-sm text-[#657B6F]">
                Speak with our morning operations team directly.
              </p>
            </div>
            <a
              href={`tel:${OFFICIAL_CONTACT.phone}`}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Call: {OFFICIAL_CONTACT.phone}</span>
            </a>
          </div>

          {/* Email Support */}
          <div className="p-5 sm:p-6 rounded-3xl border border-[#E3EFE5] bg-white shadow-card flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  Official Email
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#132A1C]">Email Inquiries</h2>
              <p className="text-xs sm:text-sm text-[#657B6F]">
                Partnerships, feedback, corporate wellness, and institutional inquiries.
              </p>
            </div>
            <a
              href={`mailto:${OFFICIAL_CONTACT.email}`}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-sky-700" />
              <span>{OFFICIAL_CONTACT.email}</span>
            </a>
          </div>

          {/* Operating Kitchen & Timings */}
          <div className="p-5 sm:p-6 rounded-3xl border border-[#E3EFE5] bg-white shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Kitchen Partner
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#132A1C]">Bangalore Kitchen</h2>
              <p className="text-xs sm:text-sm text-[#405347] font-medium">
                {OFFICIAL_CONTACT.kitchenLocation}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E3EFE5] flex items-center gap-2 text-xs text-[#657B6F]">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Morning Doorstep Delivery: 5:30 AM – 7:30 AM Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
