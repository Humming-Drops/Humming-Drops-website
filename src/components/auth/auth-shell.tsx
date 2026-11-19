import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Shared building blocks for every account screen (sign in, register, password reset,
 * staff sign in, onboarding) and the subscribe form, so they read as one family:
 * same card, heading scale, label, 48px input, primary button and alert styles.
 */

export const authLabelClass = "block text-sm font-medium text-stone-800 mb-1.5";

/** 48px input. text-base on mobile prevents iOS focus zoom. Invalid fields turn red via aria-invalid. */
export const authInputClass =
  "block w-full h-12 px-4 rounded-xl border border-[#E2ECE4] bg-white text-base sm:text-sm text-stone-900 placeholder:text-stone-400 transition focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-300 read-only:bg-stone-50 read-only:text-stone-600 disabled:bg-stone-50 disabled:text-stone-600";

/** Add to authInputClass when a leading icon is shown. */
export const authInputWithIconClass = "pl-10";

export const authHintClass = "mt-1.5 text-xs text-stone-500";
export const authFieldErrorClass = "mt-1.5 text-xs font-medium text-red-700";

export const authButtonClass =
  "w-full h-12 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 hover:translate-y-0 focus-visible:ring-forest-600";

export const authLinkClass =
  "font-semibold text-forest-800 hover:text-forest-950 hover:underline underline-offset-4 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600";

/** Leading icon slot inside a relative input wrapper. */
export function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
      {children}
    </span>
  );
}

/** Page wrapper for single-card screens (forgot / reset password, onboarding). */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-canvas flex justify-center items-start sm:items-center px-4 py-10 sm:py-16 min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  );
}

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-white border border-[#E2ECE4] rounded-3xl p-6 sm:p-8 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuthHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
        {title}
      </h1>
      {description ? <p className="mt-2 text-sm text-stone-600 leading-relaxed">{description}</p> : null}
    </div>
  );
}

export function AuthErrorAlert({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      role="alert"
      className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-sm text-red-800"
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AuthSuccessAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="mb-6 rounded-2xl border border-forest-200 bg-forest-50 p-4 flex items-start gap-3 text-sm text-forest-900"
    >
      <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Divider row at the bottom of a card ("New here? Create an account"). */
export function AuthFooterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-6 border-t border-[#E2ECE4] text-center text-sm text-stone-600">
      {children}
    </div>
  );
}
