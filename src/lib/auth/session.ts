/**
 * Edge-compatible and Node-compatible Session Management
 * Uses the standard Web Crypto API (supported in Edge Middleware and Node 18+)
 */

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  fullName?: string;
  exp: number; // Unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = "hd_session";
// Auto session expiration: 48 hours (users must re-authenticate at least once every 48 hours)
export const SESSION_MAX_AGE_SECONDS = 48 * 60 * 60; // 172,800 seconds

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "hummingdrops_secure_session_signing_secret_2026_dev_key"
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed JWT-style session token: `<payloadBase64>.<signatureBase64>`
 */
export async function createSessionToken(
  data: Omit<SessionPayload, "exp">,
  expiresInSeconds: number = SESSION_MAX_AGE_SECONDS
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload: SessionPayload = { ...data, exp };

  const enc = new TextEncoder();
  const payloadBytes = enc.encode(JSON.stringify(payload));
  const payloadPart = base64UrlEncode(payloadBytes);

  const key = await getHmacKey(getSecretKey());
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadPart)
  );

  const signaturePart = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${payloadPart}.${signaturePart}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey(getSecretKey());
    const signatureBytes = base64UrlDecode(signaturePart);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      enc.encode(payloadPart)
    );

    if (!isValid) {
      return null;
    }

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadPart));
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration options for response headers.
 */
export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
