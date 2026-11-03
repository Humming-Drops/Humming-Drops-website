import crypto from "crypto";

const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies a Clerk (Svix) webhook signature by hand, following Svix's
 * documented manual-verification algorithm:
 *   signed content = "{svix-id}.{svix-timestamp}.{raw body}"
 *   expected sig    = base64(HMAC-SHA256(base64-decoded secret, signed content))
 * `svix-signature` may contain multiple whitespace-separated "v1,<sig>"
 * candidates; any one matching is sufficient (key rotation support).
 * The timestamp is also bounds-checked to reject stale/replayed deliveries.
 */
export function verifyClerkWebhookSignature(params: {
  payload: string;
  svixId: string;
  svixTimestamp: string;
  svixSignature: string;
  secret: string;
}): boolean {
  const { payload, svixId, svixTimestamp, svixSignature, secret } = params;

  if (!secret.startsWith("whsec_")) return false;

  const timestampNum = Number(svixTimestamp);
  if (!Number.isFinite(timestampNum)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > TOLERANCE_SECONDS) return false;

  let secretBytes: Buffer;
  try {
    secretBytes = Buffer.from(secret.slice("whsec_".length), "base64");
  } catch {
    return false;
  }

  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected, "base64");

  const candidates = svixSignature.split(" ").map((s) => s.trim()).filter(Boolean);
  for (const candidate of candidates) {
    const [version, sig] = candidate.split(",");
    if (version !== "v1" || !sig) continue;

    let sigBuf: Buffer;
    try {
      sigBuf = Buffer.from(sig, "base64");
    } catch {
      continue;
    }
    if (sigBuf.length !== expectedBuf.length) continue;
    if (crypto.timingSafeEqual(sigBuf, expectedBuf)) return true;
  }

  return false;
}

export interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

export interface ClerkPhoneNumber {
  id: string;
  phone_number: string;
}

export interface ClerkUserEventData {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
  phone_numbers?: ClerkPhoneNumber[];
  primary_phone_number_id?: string | null;
  deleted?: boolean;
}

export function extractPrimaryEmail(data: ClerkUserEventData): string | null {
  const addresses = data.email_addresses ?? [];
  const primary = addresses.find((a) => a.id === data.primary_email_address_id);
  const email = primary?.email_address ?? addresses[0]?.email_address ?? null;
  return email ? email.trim().toLowerCase() : null;
}

export function extractPrimaryPhone(data: ClerkUserEventData): string | null {
  const numbers = data.phone_numbers ?? [];
  const primary = numbers.find((n) => n.id === data.primary_phone_number_id);
  const phone = primary?.phone_number ?? numbers[0]?.phone_number ?? null;
  return phone ? phone.trim() : null;
}
