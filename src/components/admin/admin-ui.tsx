import React from "react";
import { cn } from "@/lib/utils";

/*
 * Admin console primitives. Every /admin page uses these so headers,
 * buttons, inputs, tables and notices share one visual pattern.
 */

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const BUTTON_VARIANTS = {
  primary: "bg-brand-primary text-white hover:bg-brand-hover focus-visible:ring-brand-primary",
  secondary:
    "border border-line-subtle bg-surface text-content-primary hover:bg-muted/60 focus-visible:ring-brand-primary",
  danger: "border border-red-200 bg-surface text-red-700 hover:bg-red-50 focus-visible:ring-red-600",
  ghost: "text-content-secondary hover:bg-muted/60 hover:text-content-primary focus-visible:ring-brand-primary",
} as const;

const BUTTON_SIZES = {
  md: "min-h-[44px] lg:min-h-[40px] px-4 py-2",
  sm: "min-h-[44px] lg:min-h-[36px] px-3 py-1.5",
} as const;

export function adminButton(
  variant: keyof typeof BUTTON_VARIANTS = "primary",
  size: keyof typeof BUTTON_SIZES = "md",
  className?: string
) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

export const adminLabel = "block text-xs font-semibold text-content-secondary";

export const adminInput =
  "w-full min-h-[44px] lg:min-h-[40px] rounded-xl border border-line-subtle bg-surface px-3 py-2 text-sm text-content-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20";

export const adminHelpText = "text-xs text-content-secondary";
export const adminErrorText = "text-xs text-red-700";

export const adminCard = "rounded-2xl border border-line-subtle bg-surface shadow-card";

export const adminTable = {
  shell: cn(
    adminCard,
    // `relative` keeps sr-only header labels inside the scroll container
    // instead of widening the page.
    "relative overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
  ),
  table: "min-w-full whitespace-nowrap text-left text-sm",
  head: "border-b border-line-subtle bg-muted/40 text-xs font-semibold text-content-secondary",
  th: "px-4 py-3 font-semibold",
  row: "border-b border-line-subtle last:border-0 transition-colors hover:bg-muted/20",
  td: "px-4 py-3",
  mono: "px-4 py-3 font-mono text-xs",
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm text-content-secondary">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-extrabold text-content-primary sm:text-3xl">{title}</h2>
        {description && <div className="mt-1 max-w-2xl text-sm text-content-secondary">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-end gap-3">{actions}</div>}
    </div>
  );
}

export function AdminSectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-base font-bold text-content-primary">{children}</h3>;
}

export function AdminNotice({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : tone === "success" ? "status" : undefined}
      className={cn(
        "rounded-xl border p-4 text-sm",
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : tone === "success"
            ? "border-emerald-200 bg-emerald-50 font-medium text-emerald-800"
            : "border-line-subtle bg-surface text-content-secondary",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminLoadingState({ label }: { label: string }) {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label={label}>
      {/* Only the placeholder bars pulse; the text stays at full contrast. */}
      <div className="animate-pulse space-y-2 motion-reduce:animate-none" aria-hidden="true">
        <div className="h-4 w-36 rounded bg-muted/70" />
        <div className="h-8 w-48 rounded-xl bg-muted/70" />
      </div>
      <div className="flex h-64 items-center justify-center rounded-2xl border border-line-subtle bg-surface">
        <p className="text-sm text-content-secondary">{label}…</p>
      </div>
    </div>
  );
}
