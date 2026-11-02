# ADR-007: Client Brochure Supremacy & Provisional Assumptions Management

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Product Architect, Legal & Client Liaison  
**Tags:** governance, client-fidelity, assumptions, cir, compliance  

---

## Context and Problem Statement

A recurring hazard in agency and contract engineering is the unintentional invention or hallucination of business facts:
* Fictitious customer reviews and fabricated ratings.
* Unverified clinical or medical cure claims.
* Unsubstantiated delivery promises (e.g. "Guaranteed delivery in 15 minutes", "Cold chain refrigerated vans across all of Karnataka").
* Guessing pricing, partners, or refund terms without client authorization.

In our project, the client-provided brochure (`references/Humming-Drops-Brochure.pdf`) and official logo (`references/Humming drop Logo .png`) represent the sole authoritative truth.
However, several operational details remain unconfirmed.

## Considered Options

1. **Strict Client Brochure Supremacy & Tagged Provisional Assumptions (`CIR-01` to `CIR-07`):**
   * Treat the brochure as ground truth.
   * Mark all unconfirmed operational elements explicitly as `CLIENT INPUT REQUIRED / PROVISIONAL`.
   * Forbid hardcoding provisional items into database constraints, validation rules, or contractual UI promises.
2. **Best-guess standard e-commerce assumptions (e.g. assume 6 AM–8:30 AM delivery windows, standard 30-day billing, fixed delivery radii).**

## Decision Outcome

Chosen option: **Option 1: Strict Client Brochure Supremacy & Tagged Provisional Assumptions**.

### Catalog of Provisional Items (`CIR-01` to `CIR-07`)

| Tag | Assumption | Rule / Architectural Guardrail |
| :--- | :--- | :--- |
| **`CIR-01`** | Bangalore Delivery Corridors | Do NOT restrict addresses to hardcoded localities. Keep Bangalore address collection open with pincode. |
| **`CIR-02`** | Morning Delivery Windows | Do NOT promise rigid hourly delivery windows (e.g., 6:00–7:30 AM) in UI or database constraints. State "Delivered Fresh Every Morning". |
| **`CIR-03`** | Continuous Delivery Cycle | Do NOT hardcode 30-day continuous vs 26-day Mon–Sat delivery cycles into database dispatch math. |
| **`CIR-04`** | Delivery Pause Cutoff | Build subscription pause feature with flexible timestamp, avoiding an irreversible 8 PM hardcode until confirmed. |
| **`CIR-05`** | Home Phlebotomy vs Clinic Walk-In | Frame preventative health perk as "Free Monthly Checkup powered by MedCity Labs" without falsely promising at-home sample collection. |
| **`CIR-06`** | Customization & Fixed-Box Rules | Record dietary preferences/allergies as customer notes; do not promise custom ingredient swaps. |
| **`CIR-07`** | Payment Mode (Gateway vs Assisted Lead) | Implement pluggable `CheckoutStrategy` supporting both Mode A (Razorpay) and Mode B (Assisted Lead / WhatsApp). |

## Consequences

### Positive
* Zero liability for false advertising, unauthorized medical claims, or unfulfilled operational promises.
* Clean handover with clear client decision points.
* Codebase remains flexible and easy to align once client feedback is received.

### Negative / Trade-offs
* Requires careful code review to ensure provisional assumptions are not accidentally baked into validation schemas or UI commitments.
