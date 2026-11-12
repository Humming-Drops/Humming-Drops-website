import React from "react";
import { Inbox } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const STATUS_BADGE_MAP: Record<string, { label: string; variant: NonNullable<BadgeProps["variant"]> }> = {
  confirmed_active: { label: "Active", variant: "success" },
  active: { label: "Active", variant: "success" },
  paid: { label: "Paid", variant: "success" },
  captured: { label: "Captured", variant: "success" },
  pending_confirmation: { label: "Pending", variant: "warning" },
  pending: { label: "Pending", variant: "warning" },
  created: { label: "Created", variant: "info" },
  paused: { label: "Paused", variant: "neutral" },
  cancelled: { label: "Cancelled", variant: "error" },
  failed: { label: "Failed", variant: "error" },
  expired: { label: "Expired", variant: "neutral" },
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const mapped = STATUS_BADGE_MAP[normalized];
  const label = mapped?.label ?? status.replace(/_/g, " ");
  const variant = mapped?.variant ?? "neutral";

  return (
    <Badge variant={variant} size="sm" className="capitalize whitespace-nowrap">
      {label}
    </Badge>
  );
}

export function EmptyTableState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 space-y-2">
      <div className="w-11 h-11 rounded-2xl bg-muted/70 border border-line-subtle flex items-center justify-center text-content-muted">
        <Inbox className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-display text-sm font-bold text-content-primary">{title}</h3>
      <p className="text-xs text-content-secondary max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
