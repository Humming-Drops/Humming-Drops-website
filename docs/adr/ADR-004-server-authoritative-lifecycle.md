# ADR-004: Server-Authoritative Lead Lifecycle State Machine

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Security Engineer, Backend Lead, Lead Architect  
**Tags:** security, lifecycle, state-machine, invariants, subscription  

---

## Context and Problem Statement

In Mode B (Assisted Lead Registration), prospective subscribers submit contact details, delivery addresses, and plan selections before any money is transferred.
If the frontend or an unauthenticated API request were permitted to declare a subscription "active", malicious users could bypass payment or coordinator review to access subscriber-only perks (such as MedCity Smiles member benefits, doctor consultations, or delivery scheduling).

Furthermore, malicious users could tamper with payload pricing (e.g. submitting `monthlyPriceINR: 1` instead of `₹3,500` or `₹4,000`).

## Considered Options

1. **Strict Server-Authoritative State Machine with Invariant Enforcement:** The server enforces canonical prices, sets `status: "pending_confirmation"`, and forces `hasActivePerks: false` on lead ingestion.
2. **Client-driven state assignment:** Allow the client payload to specify status.
3. **Database trigger only:** Rely solely on database defaults without application layer validation.

## Decision Outcome

Chosen option: **Option 1: Strict Server-Authoritative State Machine with Invariant Enforcement**.

### Architectural Invariants

1. **State Machine Transitions:**
   ```
   [User Form Submit] 
          │
          ▼
   registration_submitted ──► pending_confirmation ──► [Hub Coordinator Review]
                                                            │
                                  ┌─────────────────────────┴─────────────────────────┐
                                  ▼                                                   ▼
                         confirmed / active                                  cancelled / rejected
   ```
2. **Strict Invariant Guardrail:**
   * Every newly registered lead record is initialized with:
     * `status = "pending_confirmation"`
     * `hasActivePerks = false`
   * Under no circumstances can a lead creation request produce an `active`, `trialing`, or `confirmed` status.
3. **Canonical Server Pricing Guardrail:**
   * Incoming plan requests are matched against hardcoded server pricing:
     * Standard Plan (`standard`): Exactly `3500` INR.
     * Premium Plan (`premium`): Exactly `4000` INR.
   * Any payload containing tampered, manipulated, or unrecognized amounts is rejected immediately with HTTP 400.
4. **Input Sanitization & Validation:**
   * Full names sanitized against XSS injection vectors.
   * Phone numbers strictly validated against Indian mobile standards (`^[6-9]\d{9}$`).
   * Emails validated against standard RFC 5322 regex.
   * Bangalore address fields validated for length and pin code format.

## Consequences

### Positive
* Complete immunity against price tampering and unauthorized perk activation.
* Explicit audit trail with timestamped reference codes (`HD-REG-YYYY-XXXXX`).
* Clear boundaries for Bangalore hub coordinators reviewing unconfirmed orders.

### Negative / Trade-offs
* Requires server validation code and strict unit/integration test coverage (`test-phase4-backend-flow.mjs`).
