# ADR-003: Pluggable Payment & Fulfillment Architecture (Mode A vs. Mode B)

**Date:** 2026-09-23  
**Status:** ACCEPTED  
**Deciders:** Lead Architect, Security Engineer, Product Lead  
**Tags:** checkout, payments, razorpay, whatsapp, strategy-pattern  

---

## Context and Problem Statement

From the client-provided brochure, Humming Drops highlights two conversion paradigms:
1. High-touch personalized concierge onboarding via phone/WhatsApp (`8618902810`), featuring QR codes to "Scan and Register" and direct chat with MedCity Health Labs.
2. Direct e-commerce subscription plans (Standard ₹3,500/month, Premium ₹4,000/month).

The client has **not yet confirmed** whether launch day operations will accept automated online credit card / UPI payments through Razorpay (`online_gateway`), OR operate via assisted lead capture with WhatsApp and direct Bangalore coordinator confirmation (`assisted_lead`).

Hardcoding either payment gateway logic or manual registration logic risks major architectural rework when client sign-off occurs.

## Considered Options

1. **Pluggable Strategy Pattern (`CheckoutStrategy`):** Decoupled UI presentation and backend processing supporting Mode A (`online_gateway`) and Mode B (`assisted_lead`) via environment configuration.
2. **Hardcode Razorpay Online Checkout only:** Reject lead-capture mode.
3. **Hardcode WhatsApp Link only:** Eliminate backend checkout API and order records entirely.
4. **Duplicate the subscription flow into two separate routes (`/subscribe/online` vs `/subscribe/whatsapp`).**

## Decision Outcome

Chosen option: **Option 1: Pluggable Strategy Pattern (`CheckoutStrategy`)**.

### Architectural Design

* **Server Authority:** The authoritative operational mode is defined by the server environment variable `CHECKOUT_MODE`. The client environment variable `NEXT_PUBLIC_CHECKOUT_MODE` serves solely as a presentation hint for UI controls.
* **Mode A (Online Payment Gateway):**
  * Invokes `POST /api/payments/order` to generate a Razorpay order.
  * Launches Razorpay standard checkout popup on client.
  * Verifies HMAC SHA-256 signature on `POST /api/payments/verify`.
  * Listens to asynchronous webhooks on `POST /api/payments/webhook`.
* **Mode B (Assisted Lead Registration & WhatsApp Handoff):**
  * Invokes `POST /api/subscriptions/lead` to register the customer's plan selection, Bangalore address, and dietary notes.
  * Issues an authoritative reference code (`HD-REG-YYYY-XXXXX`).
  * Persists the record with invariant status `pending_confirmation`.
  * Generates a pre-filled WhatsApp link (`https://wa.me/918618902810?text=...`) for one-tap client dispatch to the Bangalore hub coordinator.

## Consequences

### Positive
* Switching between Mode A and Mode B requires changing only an environment variable (`CHECKOUT_MODE=online_gateway` vs `CHECKOUT_MODE=assisted_lead`).
* Zero schema migrations or UX refactoring required upon client payment decision.
* Eliminates business downtime regardless of payment gateway approval timeline.

### Negative / Trade-offs
* Both code paths (Razorpay API handlers and Lead Ingestion handlers) must be maintained and verified in automated tests.
