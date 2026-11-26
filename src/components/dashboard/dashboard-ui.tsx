import React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Shared building blocks for every /dashboard page so the subscriber
 * portal uses one page-header pattern, one card style and one spacing
 * rhythm. Pages compose these instead of hand-rolling their own chrome.
 */

/** Root wrapper for a dashboard page: one vertical rhythm everywhere. */
export function DashboardPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

interface DashboardPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small status line above the title (status pill, reference code). */
  meta?: React.ReactNode;
  /** Right-aligned actions (stack below the title on mobile). */
  actions?: React.ReactNode;
}

export function DashboardPageHeader({ title, description, meta, actions }: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-line-subtle">
      <div className="space-y-2 min-w-0">
        {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary break-words">{title}</h1>
        {description && <p className="text-sm text-content-secondary max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Status pill used in a page header's `meta` slot. */
export function DashboardStatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
      {children}
    </span>
  );
}

const CARD_TONES = {
  default: "border-line-subtle bg-surface",
  brand: "border-forest-200 bg-forest-50/40",
  teal: "border-teal-200 bg-teal-50/40",
  warning: "border-amber-200 bg-amber-50/60 text-amber-950",
  danger: "border-red-200 bg-red-50/70 text-red-800",
} as const;

export type DashboardCardTone = keyof typeof CARD_TONES;

type DashboardCardProps = {
  as?: "section" | "div" | "li";
  tone?: DashboardCardTone;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/** The one card surface for dashboard content. */
export function DashboardCard({ as: Tag = "section", tone = "default", className, children, ...rest }: DashboardCardProps) {
  return (
    <Tag className={cn("rounded-2xl border p-5 sm:p-6", CARD_TONES[tone], className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Card heading: optional lucide icon + title, same size on every page. */
export function DashboardCardTitle({
  id,
  icon: Icon,
  iconClassName,
  children,
}: {
  id?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className={cn("w-5 h-5 mt-1 shrink-0 text-forest-700", iconClassName)} aria-hidden="true" />}
      <h2 id={id} className="font-display text-lg font-bold text-content-primary">
        {children}
      </h2>
    </div>
  );
}

export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2",
        className
      )}
    >
      {children}
    </p>
  );
}

export function DashboardError({ title, detail }: { title: string; detail?: string }) {
  return (
    <DashboardCard as="div" tone="danger" role="alert" className="flex items-start gap-3 text-sm">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-bold">{title}</p>
        {detail && <p className="text-xs text-red-700">{detail}</p>}
      </div>
    </DashboardCard>
  );
}

export function DashboardLoading({ label }: { label: string }) {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-busy="true" aria-label={label}>
      <div className="space-y-3 pb-6 border-b border-line-subtle">
        <div className="h-5 w-32 rounded-full bg-muted" />
        <div className="h-8 w-64 max-w-full rounded-xl bg-muted" />
      </div>
      <div className="h-40 rounded-2xl bg-muted/60 border border-line-subtle" />
    </div>
  );
}
