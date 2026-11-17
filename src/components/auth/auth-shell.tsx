import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

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
          <span>Encrypted Session Security · Fresh morning delivery across Bangalore</span>
        </p>
      </div>
    </div>
  );
}
