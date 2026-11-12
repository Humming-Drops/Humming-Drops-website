import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

export const CLERK_AUTH_APPEARANCE = {
  variables: {
    colorPrimary: "#15803D",
    colorBackground: "#ffffff",
    colorText: "#132A1C",
    colorTextSecondary: "#405347",
    colorInputBackground: "#ffffff",
    colorInputText: "#132A1C",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    card: "w-full shadow-card border border-[#E2ECE4] rounded-3xl",
    headerTitle: "font-display font-extrabold text-[#132A1C]",
    headerSubtitle: "text-[#405347]",
    formButtonPrimary:
      "rounded-full font-bold bg-[#15803D] hover:bg-[#144518] shadow-sm transition-colors normal-case text-sm",
    socialButtonsBlockButton:
      "rounded-xl border-[#E2ECE4] hover:bg-[#ECFDF3] transition-colors",
    formFieldInput:
      "rounded-xl border-[#E2ECE4] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20",
    footerActionLink: "text-[#15803D] hover:text-[#144518] font-semibold",
  },
};

interface AuthShellProps {
  badgeText: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ badgeText, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas relative overflow-hidden flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label="Humming Drops Home"
          >
            <div className="relative h-9 w-36">
              <Image
                src="/images/humming-drops-logo.png"
                alt="Humming Drops"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle border border-line-subtle text-brand-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>{badgeText}</span>
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-content-secondary max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex justify-center">{children}</div>

        <p className="text-center text-xs text-content-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
          <span>Secured by Clerk · Fresh morning delivery across Bangalore</span>
        </p>
      </div>
    </div>
  );
}
