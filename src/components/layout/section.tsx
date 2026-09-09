import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  bg?: "canvas" | "surface" | "muted" | "subtle" | "transparent";
  spacing?: "compact" | "standard" | "generous" | "none";
  containerSize?: "wide" | "narrow" | "form" | "full" | "none";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      as: Component = "section",
      bg = "transparent",
      spacing = "standard",
      containerSize = "wide",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getBgClasses = () => {
      switch (bg) {
        case "canvas":
          return "bg-canvas";
        case "surface":
          return "bg-surface";
        case "muted":
          return "bg-muted";
        case "subtle":
          return "bg-subtle";
        case "transparent":
        default:
          return "bg-transparent";
      }
    };

    const getSpacingClasses = () => {
      switch (spacing) {
        case "compact":
          return "py-10 md:py-14";
        case "generous":
          return "py-20 md:py-28";
        case "none":
          return "py-0";
        case "standard":
        default:
          return "py-14 md:py-20";
      }
    };

    const content =
      containerSize === "none" ? (
        children
      ) : (
        <Container size={containerSize}>{children}</Container>
      );

    return (
      <Component
        ref={ref}
        className={cn(
          "w-full relative transition-brand",
          getBgClasses(),
          getSpacingClasses(),
          className
        )}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Section.displayName = "Section";
