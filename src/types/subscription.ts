import { PlanTier } from "./plans";

/**
 * Subscription Lifecycle State Model
 * Guardrail: An assisted WhatsApp registration with 'pending_confirmation' status
 * must NOT automatically be treated as an active subscription.
 * Lifecycle: registration_submitted -> pending_confirmation -> confirmed_active
 */
export type SubscriptionStatus =
  | "registration_submitted"
  | "pending_confirmation"
  | "confirmed_active"
  | "paused"
  | "cancelled"
  | "expired";

export type FulfillmentMode = "online_gateway" | "assisted_lead";

export type DietaryType = "standard" | "vegan" | "pure_fruit";

export interface DeliveryAddressInput {
  flatNo: string;
  buildingName: string;
  streetAddress: string;
  area: string;
  city: string; // Defaults to "Bangalore"
  pincode: string;
  deliveryNotes?: string; // Optional timing/delivery instructions (Provisional per CIR-01/02)
}

export interface DietaryPreferencesInput {
  dietaryType: DietaryType;
  allergies: string[];
  notes?: string;
}

export interface SubscriptionOnboardingPayload {
  planId: PlanTier;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
  };
  deliveryAddress: DeliveryAddressInput;
  dietaryPreferences: DietaryPreferencesInput;
  preferredFulfillmentMode: FulfillmentMode;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: PlanTier;
  status: SubscriptionStatus;
  fulfillmentMode: FulfillmentMode;
  leadReferenceCode?: string; // e.g. "HD-REG-74291"
  startDate?: string;
  renewalDate?: string;
  pauseStart?: string;
  pauseEnd?: string;
  createdAt: string;
}

/**
 * Guard function to enforce access control.
 * Only 'confirmed_active' subscriptions can receive daily boxes,
 * MedCity Labs discounts, or active member privileges.
 */
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === "confirmed_active";
}

export function isPendingConfirmation(status: SubscriptionStatus): boolean {
  return status === "pending_confirmation" || status === "registration_submitted";
}
