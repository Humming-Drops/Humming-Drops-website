"use client";

import { useEffect } from "react";
import { handleHashPopState, handleSamePageHashClick } from "@/lib/scroll-navigation";

/**
 * Centralizes smooth same-page hash link scrolling and back/forward hash
 * restoration across server- and client-rendered pages with a single listener pair.
 */
export function SmoothScrollManager() {
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

    document.addEventListener("click", onDocumentClick);
    window.addEventListener("popstate", handleHashPopState);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener("popstate", handleHashPopState);
    };
  }, []);

  return null;
}
