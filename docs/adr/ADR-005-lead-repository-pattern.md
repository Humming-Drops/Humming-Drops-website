# ADR-005: Data Storage Isolation via Repository Pattern (`ILeadRepository`)

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Backend Lead, Lead Architect  
**Tags:** persistence, repository-pattern, storage, drizzle, postgresql  

---

## Context and Problem Statement

The platform requires data persistence for customer leads, subscription requests, order history, and delivery addresses.
During early milestones and local demonstrations, a cloud database connection may not be pre-provisioned or may introduce external network latency and credential failure risks. However, coupling route handlers directly to file storage (`fs.writeFile`) or hardcoding database queries into API handlers violates architectural layering and makes future migration difficult.

## Considered Options

1. **Repository Pattern (`ILeadRepository` interface) with Pluggable Implementations:**
   * `JsonFileLeadRepository`: Zero-dependency local file storage (`data/leads.json`) for demo/offline verification.
   * `PostgresDrizzleLeadRepository` / `SupabaseLeadRepository`: Production-grade PostgreSQL storage using Drizzle ORM / Supabase client with connection pooling and ACID compliance.
2. **Direct database queries inside Next.js Route Handlers (`src/app/api/...`)**
3. **ORM calls coupled directly to route handler logic**
4. **Third-party SaaS CRM integration only (e.g. HubSpot / Airtable)**

## Decision Outcome

Chosen option: **Option 1: Repository Pattern (`ILeadRepository` interface) with Pluggable Implementations**.

### Architectural Specification

* **Repository Interface (`src/lib/lead-storage.ts`):**
  ```typescript
  export interface ILeadRepository {
    createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord>;
    getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null>;
    getAllLeads(): Promise<PersistedLeadRecord[]>;
  }
  ```
* **Separation of Concerns:**
  * Route handlers (`src/app/api/subscriptions/lead/route.ts`) depend strictly on `ILeadRepository`.
  * The factory method `getLeadRepository()` reads runtime configuration and supplies the appropriate implementation.
* **Migration Path:**
  * Transitioning from `data/leads.json` to PostgreSQL (via Drizzle ORM on Railway / Supabase) in Phase 9 requires implementing `ILeadRepository` with SQL queries, with zero breaking changes to route contracts, tests, or client UI.

## Consequences

### Positive
* Zero external infrastructure required for local unit testing, CI runs, or offline evaluations.
* Clean separation of domain logic from storage technology.
* Swap to PostgreSQL/Drizzle ORM is a drop-in replacement.

### Negative / Trade-offs
* Local JSON file storage is not multi-process concurrency safe and must never be deployed to distributed serverless multi-region environments without switching to the database repository.
