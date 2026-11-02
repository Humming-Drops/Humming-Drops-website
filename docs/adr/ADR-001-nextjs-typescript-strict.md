# ADR-001: Next.js 15+ App Router with TypeScript Strict Mode

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Lead Architect, Frontend Lead  
**Tags:** framework, frontend, typescript, app-router, nextjs  

---

## Context and Problem Statement

Humming Drops and MedCity Smiles require a modern, performant, SEO-friendly, and type-safe web platform that seamlessly hosts:
1. Two public, content-rich brand homepages with fast load times and Core Web Vitals optimization.
2. A client-facing interactive onboarding and subscription checkout wizard.
3. Server-side API route handlers for payment processing, lead capture, and webhook reception.
4. An authenticated subscriber portal and wellness tracking dashboard.

We need a unified framework that balances server-side rendering (SSR), static content caching, edge execution, and strict type verification across the entire lifecycle.

## Considered Options

1. **Next.js 15+ with App Router and TypeScript Strict Mode**
2. **Next.js with legacy Pages Router (`pages/`)**
3. **Vite SPA (React) with separate Express/Node.js API backend**
4. **Remix / React Router v7**

## Decision Outcome

Chosen option: **Option 1: Next.js 15+ with App Router and TypeScript Strict Mode**.

### Justification

* **Unified Monorepo Architecture:** Next.js App Router allows server API routes (`src/app/api/...`) and React Server Components (RSC) to live within the same repository, sharing domain types (`src/types/`) without boilerplate build tooling.
* **Strict Type Safety:** Configured with `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true` in `tsconfig.json`. This guarantees compile-time prevention of null/undefined access and enforces contract conformance.
* **Streaming & Suspense:** Native streaming and nested layouts (`src/app/layout.tsx`, `src/app/dashboard/layout.tsx`) prevent full-page rerenders when navigating between dashboard tabs or brand experiences.
* **Performance Baseline:** Automatic image optimization (`next/image`), font self-hosting (`next/font/google`), and asset minification ensure adherence to Lighthouse 90+ targets.

## Consequences

### Positive
* Type-safe contracts between API endpoints, server actions, and UI components.
* Zero build drift between client models and backend validators.
* Native Vercel deployment with edge CDN caching and isolated serverless execution.

### Negative / Trade-offs
* Requires careful differentiation between Server Components (default) and Client Components (`"use client"`).
* Higher memory overhead during local compilation (`next build`) compared to lightweight SPAs.
