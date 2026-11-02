# ADR-006: Health Vitals & Customer PII Privacy Isolation and Access Boundaries

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Security Engineer, Compliance Lead, Lead Architect  
**Tags:** security, compliance, pii, health-data, rbac  

---

## Context and Problem Statement

Humming Drops and MedCity Smiles incorporate preventative health monitoring as a core subscriber value proposition:
* Free monthly tests: Blood Sugar (Fasting & PP), Cholesterol (Lipid Profile), and Blood Pressure.
* Doctor & Nutritionist community consultations.
* Delivery addresses, phone numbers, and dietary/allergy preferences.

Medical records and vitals represent sensitive personal data under Indian healthcare data regulations (DISHA guidelines, Digital Personal Data Protection Act - DPDP 2023). Unauthenticated access, public caching, or cross-tenant leakage of customer health data would constitute severe security and legal breaches.

## Considered Options

1. **Strict Cryptographic & Session Boundary with Owner-Only Isolation:**
   * Isolate health vitals endpoints behind authenticated session checks.
   * Separate general subscription tables from sensitive health tables.
   * Enforce Row Level Security (RLS) in PostgreSQL.
   * Never expose PII on public unauthenticated GET routes.
2. **Shared user profile JSON object containing vitals and contact data.**
3. **Client-side storage only (localStorage) for health logs.**

## Decision Outcome

Chosen option: **Option 1: Strict Cryptographic & Session Boundary with Owner-Only Isolation**.

### Architecture & Security Rules

1. **Route Shell Guarding:**
   * `/dashboard/health` and `/api/health/*` require valid JWT authentication.
   * Unauthenticated requests are immediately redirected to `/login` or rejected with HTTP 401.
2. **Database Isolation:**
   * Health records (`health_vitals`, `lab_test_results`) must reside in dedicated tables separated from public marketing content and lead queues.
   * Row Level Security (RLS) policies enforce `user_id = auth.uid()`.
3. **No Unauthenticated PII Listing:**
   * Lead capture lookup `GET /api/subscriptions/lead` must strictly require an exact reference code (`ref=HD-REG-...`).
   * No API endpoint may ever return a bulk, unpaginated, unauthenticated list of customer leads, addresses, or phone numbers.
4. **Audit Logging:**
   * Access to medical data and vitals updates must generate timestamped audit logs.

## Consequences

### Positive
* Full compliance with privacy regulations (DPDP Act 2023).
* Guaranteed protection against horizontal privilege escalation (user A inspecting user B's medical tests).
* High user trust in MedCity Smiles clinical integrity.

### Negative / Trade-offs
* Requires authentication integration before users can view real test history.
