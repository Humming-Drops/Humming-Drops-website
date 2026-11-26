/** Builds a wa.me link for a stored Indian mobile number (10 digits, or 91 + 10 digits). */
export function whatsappLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `https://wa.me/91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `https://wa.me/${digits}`;
  return null;
}

/** tel: href with the +91 country code. */
export function telLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `tel:+91${digits}` : null;
}
