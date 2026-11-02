import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, Clock, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "Contact Us & Bangalore Kitchen | Humming Drops",
  description: "Get in touch with Humming Drops and MedCity Smiles in Bangalore. Doorstep breakfast delivery support.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FCFDF9] min-h-[calc(100vh-4rem)] py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Care &amp; Kitchen Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132A1C] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-[#405347] leading-relaxed">
            Have questions about your morning breakfast box, delivery area, or the MedCity Smiles community? We are here to help.
          </p>
        </div>

        {/* Stacked List of Contact Cards (Single column, min-height 56px, 12px gap) */}
        <div className="space-y-3 w-full">
          {/* Phone Row */}
          <a
            href={`tel:${OFFICIAL_CONTACT.phone}`}
            className="w-full min-h-[56px] p-4 rounded-2xl bg-white border border-[#E3EFE5] shadow-card flex items-center justify-between gap-3.5 hover:border-emerald-300 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Phone Support</span>
                <span className="text-sm sm:text-base font-extrabold text-stone-900">{OFFICIAL_CONTACT.phone}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0">
              Call
            </span>
          </a>

          {/* WhatsApp Row */}
          <a
            href="https://wa.me/918618902810"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[56px] p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-card flex items-center justify-between gap-3.5 hover:border-emerald-400 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-[#25D366] stroke-white" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">WhatsApp Support</span>
                <span className="text-sm sm:text-base font-extrabold text-stone-900">+91 8618902810</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1">
              <span>Chat</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          {/* Email Row */}
          <a
            href={`mailto:${OFFICIAL_CONTACT.email}`}
            className="w-full min-h-[56px] p-4 rounded-2xl bg-white border border-[#E3EFE5] shadow-card flex items-center justify-between gap-3.5 hover:border-emerald-300 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Email Inquiries</span>
                <span className="text-sm sm:text-base font-extrabold text-stone-900 truncate block">{OFFICIAL_CONTACT.email}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full shrink-0">
              Email
            </span>
          </a>

          {/* Address / Google Maps Row */}
          <a
            href="https://maps.google.com/?q=Berrybeats+Cafe+Bangalore"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[56px] p-4 rounded-2xl bg-white border border-[#E3EFE5] shadow-card flex items-center justify-between gap-3.5 hover:border-emerald-300 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Bangalore Kitchen</span>
                <span className="text-xs sm:text-sm font-bold text-stone-900">{OFFICIAL_CONTACT.kitchenLocation}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1">
              <span>Maps</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>

        {/* Stacked Action Buttons (Full width, 48px height, 12px gap) */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            asChild
            className="w-full justify-center min-h-[48px] text-base font-bold rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md"
          >
            <Link href="/subscribe?plan=standard" className="flex items-center justify-center gap-2">
              <span>Start Your Subscription</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full justify-center min-h-[48px] text-base font-bold rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white border-transparent shadow-sm"
          >
            <a
              href="https://wa.me/918618902810"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </a>
          </Button>
        </div>

        {/* Delivery Timings Footer Note */}
        <div className="p-4 rounded-2xl bg-white border border-[#E3EFE5] text-center text-xs text-[#657B6F] flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fresh morning doorstep arrival before 7:30 AM daily across Bangalore</span>
        </div>
      </div>
    </div>
  );
}
