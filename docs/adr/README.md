# Architecture Decision Records (ADRs)

**Project:** Humming Drops & MedCity Smiles Web Platform  
**Status:** Authoritative Repository Architecture Decisions  
**Standard:** Michael Nygard ADR Template  

---

## What is an Architecture Decision Record?

An Architecture Decision Record (ADR) captures a single significant architectural decision along with its context, considered options, decision outcome, and consequences. ADRs serve as the permanent institutional memory of the technical architecture, preventing inadvertent regressions, unjustified refactorings, or conflicting technical choices.

---

## Status Definitions

* **PROPOSED:** Under review and evaluation by the technical architecture team.
* **ACCEPTED:** Formally approved and implemented in the active codebase.
* **DEPRECATED:** No longer considered active or recommended for new implementation.
* **SUPERSEDED:** Replaced by a subsequent ADR (linked in references).

---

## ADR Index

| ADR ID | Title | Status | Date | Impact Area |
| :--- | :--- | :--- | :--- | :--- |
| **[ADR-001](ADR-001-nextjs-typescript-strict.md)** | Next.js 15+ App Router with TypeScript Strict Mode | **ACCEPTED** | 2026-09-23 | Core Framework & Type Safety |
| **[ADR-002](ADR-002-dual-brand-visual-hierarchy.md)** | Dual-Brand Visual Hierarchy via CSS Custom Property Switching | **ACCEPTED** | 2026-09-23 | Design System & Theming |
| **[ADR-003](ADR-003-pluggable-checkout-strategy.md)** | Pluggable Payment & Fulfillment Architecture (Mode A vs. Mode B) | **ACCEPTED** | 2026-09-23 | Checkout & E-Commerce Core |
| **[ADR-004](ADR-004-server-authoritative-lifecycle.md)** | Server-Authoritative Lead Lifecycle State Machine (`pending_confirmation != active`) | **ACCEPTED** | 2026-09-23 | Subscription Lifecycle & Security |
| **[ADR-005](ADR-005-lead-repository-pattern.md)** | Data Storage Isolation via Repository Pattern (`ILeadRepository`) | **ACCEPTED** | 2026-09-23 | Persistence & Storage Abstraction |
| **[ADR-006](ADR-006-health-pii-data-isolation.md)** | Health Vitals & Customer PII Privacy Isolation and Access Boundaries | **ACCEPTED** | 2026-09-23 | Medical Data Privacy & Security |
| **[ADR-007](ADR-007-client-truth-guardrail.md)** | Client Brochure Supremacy & Provisional Assumptions Management (`CIR-01` to `CIR-07`) | **ACCEPTED** | 2026-09-23 | Business Logic & Domain Invariants |
| **[ADR-008](ADR-008-component-design-system.md)** | Component Architecture using Tailwind CSS, shadcn/ui & Radix Primitives | **ACCEPTED** | 2026-09-23 | Frontend UI Primitives & Accessibility |
