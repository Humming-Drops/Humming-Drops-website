"use client";

import type { MouseEvent } from "react";

const PREV_SCROLL_STATE_KEY = "__hdPrevScrollY";
const DEFAULT_NAVBAR_HEIGHT = 64;
const NAVBAR_HIDE_AFTER_Y = 72;
const NAVBAR_DELTA_THRESHOLD = 8;

const SECTION_ALIAS_MAP: Record<string, string> = {
  pillars: "why-medcity",
  "box-anatomy": "box-experience",
};

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

function getNavbarHeight(): number {
  if (typeof document === "undefined") return DEFAULT_NAVBAR_HEIGHT;
  const header = document.querySelector("header");
  const measured = header?.getBoundingClientRect().height;
  return measured && measured > 0 ? Math.round(measured) : DEFAULT_NAVBAR_HEIGHT;
}

function getResponsiveOffsets(): { hiddenGap: number; visibleGap: number } {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  if (width >= 1024) {
    // Desktop: 44px below top edge when navbar hides (~Screenshot 1), 36px below visible navbar
    return { hiddenGap: 44, visibleGap: 36 };
  }
  if (width >= 640) {
    // Tablet: 36px when navbar hides, 28px below visible navbar
    return { hiddenGap: 36, visibleGap: 28 };
  }
  // Mobile: 24px when navbar hides, 20px below visible navbar
  return { hiddenGap: 24, visibleGap: 20 };
}

function computeTargetScrollY(element: HTMLElement): number {
  const resolvedId = SECTION_ALIAS_MAP[element.id];
  const anchorEl = resolvedId ? document.getElementById(resolvedId) ?? element : element;

  if (anchorEl.id === "main-content") {
    return 0;
  }

  const rect = anchorEl.getBoundingClientRect();
  const currentY = Math.max(0, window.scrollY);
  const elementTop = rect.top + currentY;
  const paddingTop = Number.parseFloat(window.getComputedStyle(anchorEl).paddingTop) || 0;

  // Position relative to the first meaningful content inside the section (below internal band padding)
  const contentTop = elementTop + paddingTop;
  const { hiddenGap, visibleGap } = getResponsiveOffsets();
  const navbarHeight = getNavbarHeight();

  const hiddenTargetY = Math.max(0, Math.round(contentTop - hiddenGap));
  const visibleTargetY = Math.max(0, Math.round(contentTop - (navbarHeight + visibleGap)));

  // Near page top, the smart navbar stays visible so reserve visible-navbar clearance
  if (hiddenTargetY <= NAVBAR_HIDE_AFTER_Y) {
    return visibleTargetY;
  }

  // Downward scroll hides the smart navbar -> frame content cleanly ~44px from desktop viewport top
  if (hiddenTargetY > currentY + NAVBAR_DELTA_THRESHOLD) {
    return hiddenTargetY;
  }

  // Upward scroll reveals the smart navbar -> leave breathing room below it
  if (visibleTargetY < currentY - NAVBAR_DELTA_THRESHOLD) {
    return visibleTargetY;
  }

  const header = document.querySelector("header");
  const isNavbarCurrentlyHidden = Boolean(header?.classList.contains("-translate-y-full"));
  return isNavbarCurrentlyHidden ? hiddenTargetY : visibleTargetY;
}

export function scrollToElementById(
  id: string,
  options?: { instant?: boolean }
): boolean {
  if (typeof document === "undefined") return false;
  const element = document.getElementById(id);
  if (!element) return false;

  // Release drawer scroll lock before measuring or scrolling
  if (document.body.style.overflow === "hidden") {
    document.body.style.overflow = "";
  }

  const targetScrollY = computeTargetScrollY(element);
  const useInstant = Boolean(options?.instant) || prefersReducedMotion();

  window.scrollTo({
    top: targetScrollY,
    behavior: useInstant ? "auto" : "smooth",
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
