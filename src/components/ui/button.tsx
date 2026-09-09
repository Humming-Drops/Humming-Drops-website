import React from "react";
import { cn } from "@/lib/utils";
import { BrandTheme } from "@/types/theme";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  brand?: BrandTheme | "auto";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      brand = "auto",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Brand-specific variant overrides if explicitly specified
    const getVariantClasses = () => {
      if (brand === "humming") {
        switch (variant) {
          case "primary":
            return "bg-forest-900 text-white hover:bg-forest-800 active:bg-forest-950 shadow-sm";
          case "secondary":
            return "bg-forest-50 text-forest-900 hover:bg-forest-100 active:bg-forest-200 border border-forest-200";
          case "outline":
            return "border-2 border-forest-900 text-forest-900 hover:bg-forest-50 active:bg-forest-100";
          case "ghost":
            return "text-forest-900 hover:bg-forest-50 active:bg-forest-100";
          case "link":
            return "text-forest-900 underline-offset-4 hover:underline p-0 h-auto";
        }
      }

      if (brand === "medcity") {
        switch (variant) {
          case "primary":
            return "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 shadow-sm";
          case "secondary":
            return "bg-teal-50 text-teal-900 hover:bg-teal-100 active:bg-teal-200 border border-teal-200";
          case "outline":
            return "border-2 border-teal-700 text-teal-700 hover:bg-teal-50 active:bg-teal-100";
          case "ghost":
            return "text-teal-900 hover:bg-teal-50 active:bg-teal-100";
          case "link":
            return "text-teal-700 underline-offset-4 hover:underline p-0 h-auto";
        }
      }

      // Default / Auto (Semantic theme-adaptive via CSS variables)
      switch (variant) {
        case "primary":
          return "bg-brand-primary text-brand-contrast hover:bg-brand-hover active:opacity-95 shadow-sm";
        case "secondary":
          return "bg-brand-subtle text-brand-text hover:bg-brand-subtle-hover border border-line-subtle";
        case "outline":
          return "border-2 border-brand-primary text-brand-primary hover:bg-brand-subtle";
        case "ghost":
          return "text-content-primary hover:bg-brand-subtle";
        case "link":
          return "text-brand-primary underline-offset-4 hover:underline p-0 h-auto";
      }
    };

    const getSizeClasses = () => {
      if (variant === "link") return "";
      switch (size) {
        case "sm":
          return "h-9 px-3 text-xs font-semibold rounded-lg gap-1.5";
        case "lg":
          return "h-12 px-6 text-base font-semibold rounded-2xl gap-2.5";
        case "md":
        default:
          return "h-11 px-5 text-sm font-semibold rounded-xl gap-2";
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
          getVariantClasses(),
          getSizeClasses(),
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
