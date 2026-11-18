import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Get help recovering your Humming Drops account.",
};

const linkClass =
  "inline-flex items-center gap-2.5 min-h-[44px] font-semibold text-brand-primary hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-content-secondary">
            Automatic password reset is not available yet. Contact the Humming Drops team and we will help you regain
            access to your account.
          </p>
        </div>

        <Card className="p-6 sm:p-7 space-y-1">
          <a href={`mailto:${OFFICIAL_CONTACT.email}?subject=Password%20reset%20help`} className={linkClass}>
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{OFFICIAL_CONTACT.email}</span>
          </a>
          <a href={OFFICIAL_CONTACT.whatsappUrl("Hello Humming Drops, I need help signing in to my account.")} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
          </a>
          <a href={`tel:+91${OFFICIAL_CONTACT.phone}`} className={linkClass}>
            <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>+91 {OFFICIAL_CONTACT.phone}</span>
          </a>
        </Card>

        <div className="text-center text-xs text-content-secondary">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-brand-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
