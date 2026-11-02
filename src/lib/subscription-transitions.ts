/**
 * Subscription Lifecycle State Machine & Transition Rules
 *
 * Enforces business invariants:
 * 1. A new lead always initializes as "pending_confirmation" or "registration_submitted"
 * 2. Active member perks and daily delivery require "confirmed_active"
 * 3. Transitions must follow the authorized finite state machine
 */

import type { SubscriptionStatus } from "@/types/subscription";

/**
 * Valid state transition map.
 * Keys are current states, values are valid next states.
 */
export const VALID_SUBSCRIPTION_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  registration_submitted: ["pending_confirmation", "cancelled"],
  pending_confirmation: ["confirmed_active", "cancelled"],
  confirmed_active: ["paused", "cancelled", "expired"],
  paused: ["confirmed_active", "cancelled"],
  expired: ["confirmed_active"],
  cancelled: [], // Terminal state
};

/**
 * Validates whether a state transition from `from` to `to` is legally permitted.
 */
export function canTransitionSubscription(
  from: SubscriptionStatus,
  to: SubscriptionStatus
): boolean {
  if (from === to) return true; // Idempotent same-state is allowed
  const allowed = VALID_SUBSCRIPTION_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

/**
 * Validates initial lead status invariant:
 * Initial status MUST be either 'pending_confirmation' or 'registration_submitted'.
 * Returns true if valid, false if an attempt is made to initialize directly to active.
 */
export function isValidInitialLeadStatus(status: unknown): boolean {
  return status === "pending_confirmation" || status === "registration_submitted";
}

/**
 * Computes whether perks should be active based on subscription status.
 * STRICT INVARIANT: Only "confirmed_active" grants active perks.
 */
export function hasActivePerks(status: SubscriptionStatus): boolean {
  return status === "confirmed_active";
}
