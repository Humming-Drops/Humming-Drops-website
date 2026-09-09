import { FulfillmentMode } from "@/types/subscription";

/**
 * Checkout Mode Configuration & Security Module
 *
 * GUARDRAIL 1: CHECKOUT MODE SECURITY
 * `NEXT_PUBLIC_CHECKOUT_MODE` may be used for client-side/UI configuration (e.g. rendering
 * the WhatsApp submission button vs launching the payment modal), but it MUST NEVER be
 * trusted for pricing, payment verification, subscription activation, authorization,
 * or other security-sensitive decisions.
 *
 * Server-side configuration (`CHECKOUT_MODE` or server validation logic) MUST determine
 * authoritative payment/fulfillment behavior.
 */

export const DEFAULT_CHECKOUT_MODE: FulfillmentMode = "assisted_lead";

/**
 * Client-safe UI presentation hint only.
 * DO NOT use this function on API routes or server actions to authorize or activate orders.
 */
export function getClientCheckoutPresentationMode(): FulfillmentMode {
  const envMode = process.env.NEXT_PUBLIC_CHECKOUT_MODE;
  if (envMode === "online_gateway" || envMode === "gateway") {
    return "online_gateway";
  }
  return DEFAULT_CHECKOUT_MODE;
}

/**
 * Server-only authoritative checkout mode.
 * Reads private server environment variable `CHECKOUT_MODE` (without NEXT_PUBLIC prefix).
 */
export function getServerAuthoritativeCheckoutMode(): FulfillmentMode {
  // Check private server-only env variable first
  const serverMode = process.env.CHECKOUT_MODE || process.env.NEXT_PUBLIC_CHECKOUT_MODE;
  if (serverMode === "online_gateway" || serverMode === "gateway") {
    return "online_gateway";
  }
  return DEFAULT_CHECKOUT_MODE;
}

/**
 * Contact & Support configuration
 * Authoritative source from client brochure (Page 8)
 */
export const OFFICIAL_CONTACT = {
  phone: "8618902810",
  email: "hummingdrops@gmail.com",
  website: "www.hummingdrops.com",
  kitchenLocation: "Berrybeats cafe, Bangalore",
  partners: {
    medCityLabs: "MedCity Health Labs",
    berrybeats: "CARE by Berrybeats",
  },
  whatsappUrl(prefilledText?: string): string {
    const base = "https://wa.me/918618902810";
    if (!prefilledText) return base;
    return `${base}?text=${encodeURIComponent(prefilledText)}`;
  },
};
