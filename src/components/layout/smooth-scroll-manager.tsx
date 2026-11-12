"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  handleHashPopState,
  handleSamePageHashClick,
  scrollToElementById,
} from "@/lib/scroll-navigation";

/**
 * Centralizes smooth same-page hash link scrolling, cross-page hash landing
 * alignment, and back/forward hash restoration with a single listener pair.
 */
export function SmoothScrollManager() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      handleSamePageHashClick(event, href);
    };

    // Capture phase ensures same-page hash links (including Next.js <Link>) are
    // intercepted before React/Next delegates call preventDefault and native scrollIntoView.
    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", handleHashPopState);

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", handleHashPopState);
    };
  }, []);

  // Ensure direct hash URLs and cross-page hash links align with smart navbar state
  useEffect(() => {
    const isRouteChange = previousPathRef.current !== null && previousPathRef.current !== pathname;
    previousPathRef.current = pathname;

    const hashId = window.location.hash.replace(/^#/, "");
    if (!hashId) return;

    let innerRafId: number | null = null;
    const outerRafId = window.requestAnimationFrame(() => {
      innerRafId = window.requestAnimationFrame(() => {
        scrollToElementById(hashId, { instant: !isRouteChange });
      });
    });

    return () => {
      window.cancelAnimationFrame(outerRafId);
      if (innerRafId !== null) {
        window.cancelAnimationFrame(innerRafId);
      }
    };
  }, [pathname]);

  return null;
}