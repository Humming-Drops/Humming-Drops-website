"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  label: string;
  href: string;
  accent?: "brand" | "teal";
}

interface PortalNavProps {
  items: PortalNavItem[];
  ariaLabel: string;
}

export function PortalNav({ items, ariaLabel }: PortalNavProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav aria-label={ariaLabel}>
        {/* Mobile & Tablet: Horizontal scrollable pill tabs */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {items.map((item) => {
            const active = isItemActive(item.href);
            const isTeal = item.accent === "teal";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                  isTeal
                    ? "focus-visible:ring-teal-700"
                    : "focus-visible:ring-brand-primary",
                  active
                    ? isTeal
                      ? "bg-teal-700 text-white border-teal-700 shadow-2xs font-bold"
                      : "bg-brand-primary text-white border-brand-primary shadow-2xs font-bold"
                    : "bg-surface text-content-secondary border-line-subtle hover:text-content-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop: Vertical sidebar */}
        <div className="hidden md:flex flex-col space-y-1 text-sm font-medium">
          {items.map((item) => {
            const active = isItemActive(item.href);
            const isTeal = item.accent === "teal";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block px-3.5 py-2.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2",
                  isTeal
                    ? "focus-visible:ring-teal-700"
                    : "focus-visible:ring-brand-primary",
                  active
                    ? isTeal
                      ? "bg-surface text-teal-900 font-bold shadow-2xs border border-teal-200"
                      : "bg-surface text-brand-primary font-bold shadow-2xs border border-line-subtle"
                    : isTeal
                    ? "text-content-secondary hover:bg-surface hover:text-teal-900"
                    : "text-content-secondary hover:bg-surface hover:text-brand-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
