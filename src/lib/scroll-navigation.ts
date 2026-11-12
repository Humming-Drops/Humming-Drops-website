"use client";

import type { MouseEvent } from "react";

const PREV_SCROLL_STATE_KEY = "__hdPrevScrollY";
const DEFAULT_NAVBAR_HEIGHT = 64;
const NAVBAR_HIDE_AFTER_Y = 72;
const NAVBAR_DELTA_THRESHOLD = 8;

/**
 * Target viewport offset from top edge when the smart navbar hides (40-50px spec).
 */
const HIDDEN_NAVBAR_TARGET_TOP = 45;

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
  // Measure only the sticky top bar (`header > div`), ignoring any open mobile drawer panel
  const topBar = document.querySelector("header > div") ?? document.querySelector("header");
  const measured = topBar?.getBoundingClientRect().height;
  return measured && measured > 0 && measured <= 100
    ? Math.round(measured)
    : DEFAULT_NAVBAR_HEIGHT;
}

function getResponsiveOffsets(): { hiddenGap: number; visibleGap: number } {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  if (width >= 1024) {
    return { hiddenGap: HIDDEN_NAVBAR_TARGET_TOP, visibleGap: 32 };
  }
  if (width >= 640) {
    return { hiddenGap: HIDDEN_NAVBAR_TARGET_TOP, visibleGap: 28 };
  }
  return { hiddenGap: HIDDEN_NAVBAR_TARGET_TOP, visibleGap: 24 };
}

function isHiddenOrDecorative(el: Element): boolean {
  if (el.getAttribute("aria-hidden") === "true") return true;
  if (el.classList.contains("sr-only")) return true;
  if (el.classList.contains("pointer-events-none")) return true;

  const rect = el.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) return true;

  const style = window.getComputedStyle(el);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number.parseFloat(style.opacity) === 0
  ) {
    return true;
  }

  return false;
}

function hasVisibleBoxSurface(style: CSSStyleDeclaration): boolean {
  const hasGradientOrImage = style.backgroundImage !== "none";
  const bg = style.backgroundColor;
  const hasOpaqueBg =
    Boolean(bg) &&
    bg !== "transparent" &&
    bg !== "rgba(0, 0, 0, 0)";
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
  return hasGradientOrImage || hasOpaqueBg || borderTop > 0;
}

/**
 * Finds the first meaningful visible UI element inside a destination section
 * (e.g., introductory badge pill, prominent styled card container, logo/image, or heading),
 * bypassing invisible layout wrappers and decorative ambient glows.
 */
export function findFirstMeaningfulElement(root: HTMLElement): HTMLElement {
  const explicitAnchor = root.querySelector<HTMLElement>("[data-scroll-anchor]");
  if (explicitAnchor && !isHiddenOrDecorative(explicitAnchor)) {
    return explicitAnchor;
  }

  const semanticTags = new Set(["H1", "H2", "H3", "H4", "IMG", "P", "BUTTON", "A"]);

  function walk(node: Element): HTMLElement | null {
    for (const child of Array.from(node.children)) {
      if (!(child instanceof HTMLElement) && child.tagName !== "IMG") continue;
      if (isHiddenOrDecorative(child)) continue;

      if (child instanceof HTMLElement) {
        if (semanticTags.has(child.tagName)) {
          return child;
        }

        const style = window.getComputedStyle(child);
        if (hasVisibleBoxSurface(style)) {
          return child;
        }

        const nested = walk(child);
        if (nested) return nested;
      }
    }
    return null;
  }

  return walk(root) ?? root;
}

function resolveTargetElement(id: string): HTMLElement | null {
  const resolvedId = SECTION_ALIAS_MAP[id] ?? id;
  return document.getElementById(resolvedId) ?? document.getElementById(id);
}

function computeTargetScrollY(anchorEl: HTMLElement): number {
  if (anchorEl.id === "main-content") {
    return 0;
  }

  const firstMeaningfulEl = findFirstMeaningfulElement(anchorEl);
  const currentY = Math.max(0, window.scrollY);
  const elementViewportTop = firstMeaningfulEl.getBoundingClientRect().top;
  const absoluteElementTop = elementViewportTop + currentY;

  const { hiddenGap, visibleGap } = getResponsiveOffsets();
  const navbarHeight = getNavbarHeight();

  const hiddenTargetY = Math.max(0, Math.round(absoluteElementTop - hiddenGap));
  const visibleTargetY = Math.max(0, Math.round(absoluteElementTop - (navbarHeight + visibleGap)));

  // Near the very top of the page, the smart navbar remains pinned open
  if (hiddenTargetY <= NAVBAR_HIDE_AFTER_Y) {
    return visibleTargetY;
  }

  // Scrolling downward past threshold hides the smart navbar -> land first element ~45px from top
  if (hiddenTargetY > currentY + NAVBAR_DELTA_THRESHOLD) {
    return hiddenTargetY;
  }

  // Scrolling upward reveals the smart navbar -> clear navbar height so content stays visible
  if (visibleTargetY < currentY - NAVBAR_DELTA_THRESHOLD) {
    return visibleTargetY;
  }

  const header = document.querySelector("header");
  const isNavbarCurrentlyHidden = Boolean(header?.classList.contains("-translate-y-full"));
  return isNavbarCurrentlyHidden ? hiddenTargetY : visibleTargetY;
}

export function scrollToElementById(
  id: string,
  options?: { instant?: boolean; moveFocus?: boolean }
): boolean {
  if (typeof document === "undefined") return false;
  const anchorEl = resolveTargetElement(id);
  if (!anchorEl) return false;

  // Release drawer scroll lock before measuring viewport geometry
  if (document.body.style.overflow === "hidden") {
    document.body.style.overflow = "";
  }

  const targetScrollY = computeTargetScrollY(anchorEl);
  const useInstant = Boolean(options?.instant) || prefersReducedMotion();

  window.scrollTo({
    top: targetScrollY,
    behavior: useInstant ? "auto" : "smooth",
  });

  if (options?.moveFocus || anchorEl.id === "main-content" || anchorEl.hasAttribute("tabindex")) {
    if (!anchorEl.hasAttribute("tabindex")) {
      anchorEl.setAttribute("tabindex", "-1");
      anchorEl.style.outline = "none";
    }
    anchorEl.focus({ preventScroll: true });
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
    MouseEvent<HTMLAnchorElement> | globalThis.MouseEvent,
    | "defaultPrevented"
    | "button"
    | "metaKey"
    | "ctrlKey"
    | "shiftKey"
    | "altKey"
    | "preventDefault"
    | "detail"
  > & { currentTarget?: EventTarget | null; target?: EventTarget | null },
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

  if (!resolveTargetElement(hashId)) return false;

  event.preventDefault();
  onAfterHandled?.();

  // Prevent pointer clicks inside <header> from locking `:focus-within` / `:focus-visible` open
  const clickedEl =
    event.currentTarget instanceof HTMLElement
      ? event.currentTarget
      : event.target instanceof Element
        ? event.target.closest("a")
        : null;
  const isPointerClick = event.detail !== 0;
  if (isPointerClick && clickedEl instanceof HTMLElement) {
    clickedEl.blur();
  }

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

  // Defer one animation frame so React can unmount any open drawer before measuring layout
  window.requestAnimationFrame(() => {
    scrollToElementById(hashId, { moveFocus: !isPointerClick });
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
