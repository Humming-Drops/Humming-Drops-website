# ADR-008: Component Architecture using Tailwind CSS, shadcn/ui & Radix Primitives

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Frontend Lead, Accessibility Engineer  
**Tags:** ui, components, tailwind, shadcn, radix, accessibility  

---

## Context and Problem Statement

The frontend requires accessible, responsive, composable, and customizable UI primitives (`Button`, `Card`, `Badge`, `Dialog`, `Tabs`, `Accordion`, `Dropdown`, `Input`) that support:
* Dual brand styling (Humming Drops and MedCity Smiles).
* Full keyboard navigation and screen reader accessibility (WCAG 2.1 AA).
* High performance without CSS runtime bloat.
* Zero vendor lock-in to heavyweight third-party component frameworks that prevent design token overrides.

## Considered Options

1. **shadcn/ui approach (copy-owned primitives in `@/components/ui/` based on Radix UI and Tailwind CSS).**
2. **Heavyweight component library with bundled styles (MUI / Material UI, Ant Design, Chakra UI).**
3. **Pure custom hand-rolled CSS/HTML components without accessibility primitives.**
4. **Bootstrap / vanilla Tailwind UI components.**

## Decision Outcome

Chosen option: **Option 1: shadcn/ui approach (copy-owned primitives with Radix UI and Tailwind CSS)**.

### Architectural Justification

* **Component Source Code Ownership:** Primitives live directly inside `src/components/ui/`. We have 100% control over the DOM structure, class composition, and styling without fighting CSS library specificity.
* **Headless Accessibility:** Built on Radix UI, guaranteeing ARIA roles, keyboard navigation (focus traps, arrow key tabs, Escape key dismissal), and screen reader announcements out of the box.
* **Class Merging Utility:** Uses `clsx` and `tailwind-merge` (`cn()` helper in `src/lib/utils.ts`) to enable clean override and composition of classes without duplicate CSS declarations.
* **Framer Motion Integration:** Allows subtle, performant micro-interactions (< 300ms) with full support for `prefers-reduced-motion`.

## Consequences

### Positive
* Zero runtime CSS overhead; fully compiled static utility classes.
* Complete freedom to adapt components to Humming Drops botanical and MedCity Smiles mindful tokens.
* Out-of-the-box WCAG 2.1 AA compliance.

### Negative / Trade-offs
* Primitives reside directly in the project codebase and must be maintained by the development team.
