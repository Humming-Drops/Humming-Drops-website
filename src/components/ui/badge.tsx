import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "brand"
    | "accent"
    | "outline"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral";
  size?: "sm" | "md" | "lg";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "brand", size = "md", children, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "brand":
          return "bg-brand-subtle text-brand-text border border-brand-subtle/80";
        case "accent":
          return "bg-accent-citrus-subtle text-accent-citrus-text border border-accent-citrus-subtle";
        case "outline":
          return "border border-line-strong text-content-primary bg-transparent";
        case "success":
          return "bg-status-success-bg text-status-success-text border border-status-success-border";
        case "warning":
          return "bg-status-warning-bg text-status-warning-text border border-status-warning-border";
        case "error":
          return "bg-status-error-bg text-status-error-text border border-status-error-border";
        case "info":
          return "bg-status-info-bg text-status-info-text border border-status-info-border";
        case "neutral":
        default:
          return "bg-muted text-content-secondary border border-line-subtle";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-[11px] font-semibold py-0.5 px-2 gap-1 rounded-pill";
        case "lg":
          return "text-sm font-semibold py-1 px-3.5 gap-2 rounded-pill";
        case "md":
        default:
          return "text-xs font-semibold py-1 px-2.5 gap-1.5 rounded-pill";
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans tracking-tight transition-colors select-none",
          getVariantClasses(),
          getSizeClasses(),
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
