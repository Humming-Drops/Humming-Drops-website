"use client";

import type { MouseEvent } from "react";

const PREV_SCROLL_STATE_KEY = "__hdPrevScrollY";

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToElementById(id: string): boolean {
  if (typeof document === "undefined") return false;
  const element = document.getElementById(id);
  if (!element) return false;

  // Release drawer scroll lock before measuring or scrolling
  if (document.body.style.overflow === "hidden") {
    document.body.style.overflow = "";
  }

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  // Preserve keyboard navigation order for main content or programmatically focusable targets
  if (id === "main-content" || element.hasAttribute("tabindex")) {
    element.focus({ preventScroll: true });
  }

  return true;
}

/**
 * Intercepts same-page hash navigation links to deliver reduced-motion-aware
 * smooth scrolling while preserving URL hashes and Next.js history state.
 * Cross-page, external, or standard route links fall through untouched.
 */
export function handleSamePageHashClick(
  event: Pick<
    MouseEvent<HTMLAnchorElement>,
    "defaultPrevented" | "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "preventDefault"
  >,
  href: string,
  onAfterHandled?: () => void
): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return false;

  const rawPath = href.slice(0, hashIndex);
  const hashId = href.slice(hashIndex + 1);
  if (!hashId) return false;

  const currentPath = normalizePath(window.location.pathname || "/");
  const targetPath = rawPath === "" ? currentPath : normalizePath(rawPath);
  if (targetPath !== currentPath) return false;

  if (!document.getElementById(hashId)) return false;

  event.preventDefault();
  onAfterHandled?.();

  const nextHash = `#${hashId}`;
  if (window.location.hash !== nextHash) {
    const existingState =
      window.history.state && typeof window.history.state === "object"
        ? (window.history.state as Record<string, unknown>)
        : {};
    window.history.replaceState(
      { ...existingState, [PREV_SCROLL_STATE_KEY]: window.scrollY },
      "",
      window.location.href
    );
    window.history.pushState(existingState, "", `${targetPath}${nextHash}`);
  }

  window.requestAnimationFrame(() => {
    scrollToElementById(hashId);
  });

  return true;
}

/**
 * Restores target section or prior scroll position on browser back/forward navigation.
 */
export function handleHashPopState(): void {
  if (typeof window === "undefined") return;
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    window.requestAnimationFrame(() => {
      scrollToElementById(hash);
    });
    return;
  }

  const state = window.history.state as Record<string, unknown> | null;
  const savedY = state?.[PREV_SCROLL_STATE_KEY];
  if (typeof savedY === "number" && Number.isFinite(savedY)) {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: savedY,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  }
}
