/**
 * Input Sanitization & Validation Module
 * Humming Drops & MedCity Smiles Platform
 *
 * Implements strict sanitization, normalization, and validation rules for
 * customer contact information, delivery addresses, and dietary preferences.
 */

import type { DeliveryAddressInput } from "@/types/subscription";

/**
 * Normalizes raw phone input:
 * - Strips all whitespace, dashes, parentheses, plus signs
 * - Strips a leading country code (91) or trunk 0 -- but only when the
 *   cleaned digit count shows one is actually present (12 or 11
 *   digits). A real 10-digit mobile number can validly start with the
 *   digits "91" (e.g. 9123456789); stripping "91" unconditionally
 *   corrupted those numbers down to 8 digits and rejected them.
 * - Returns a clean 10-digit string
 */
export function normalizePhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const cleaned = raw.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.slice(2);
  }
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Validates 10-digit Indian mobile number:
 * Must be exactly 10 numeric digits starting with 6, 7, 8, or 9.
 */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Validates standard email address format.
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates 6-digit Indian postal code (PIN code).
 * Must not begin with 0.
 */
export function isValidPincode(pincode: string): boolean {
  if (typeof pincode !== "string") return false;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Checks if pincode belongs to the Bangalore postal division (560xxx).
 */
export function isBangalorePincode(pincode: string): boolean {
  if (!isValidPincode(pincode)) return false;
  return /^560\d{3}$/.test(pincode.trim());
}

/**
 * Sanitizes arbitrary string input:
 * - Converts to trimmed string
 * - Strips potentially malicious HTML/XML markup tags
 * - Truncates to specified maximum length
 */
export function sanitizeString(val: unknown, maxLength: number = 255): string {
  if (typeof val !== "string") return "";
  // Strip HTML tags and control characters
  const stripped = val.replace(/<[^>]*>?/gm, "").trim();
  return stripped.slice(0, maxLength);
}

/**
 * Sanitizes and validates a delivery address payload.
 */
export function sanitizeAddress(address: Partial<DeliveryAddressInput>): DeliveryAddressInput {
  return {
    flatNo: sanitizeString(address.flatNo, 50),
    buildingName: sanitizeString(address.buildingName, 100),
    streetAddress: sanitizeString(address.streetAddress, 150),
    area: sanitizeString(address.area, 100),
    city: "Bangalore",
    pincode: sanitizeString(address.pincode, 10),
    deliveryNotes: address.deliveryNotes ? sanitizeString(address.deliveryNotes, 300) : undefined,
  };
}
