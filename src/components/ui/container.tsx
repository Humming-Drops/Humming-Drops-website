import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "wide" | "narrow" | "form" | "full";
  as?: React.ElementType;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "wide", as: Component = "div", ...props }, ref) => {
    const getSizeClasses = () => {
      switch (size) {
        case "narrow":
          return "max-w-reading mx-auto";
        case "form":
          return "max-w-form-flow mx-auto";
        case "full":
          return "w-full";
        case "wide":
        default:
          return "max-w-7xl mx-auto";
      }
    };

    return (
      <Component
        ref={ref}
        className={cn("w-full px-4 sm:px-6 lg:px-8", getSizeClasses(), className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
