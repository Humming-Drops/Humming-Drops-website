import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "interactive" | "flat" | "subtle";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "raised":
          return "bg-surface border border-line-subtle shadow-raised";
        case "interactive":
          return "bg-surface border border-line-subtle shadow-card hover:shadow-raised hover:border-brand-primary/40 active:translate-y-0.5 transition-all duration-normal cursor-pointer";
        case "flat":
          return "bg-muted border border-line-subtle";
        case "subtle":
          return "bg-subtle border border-brand-subtle";
        case "default":
        default:
          return "bg-surface border border-line-subtle shadow-card";
      }
    };

    return (
      <div
        ref={ref}
        className={cn("rounded-2xl overflow-hidden", getVariantClasses(), className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-display text-card-h3 font-bold text-content-primary tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-sm text-content-secondary font-sans leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-line-subtle/50 mt-auto", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
