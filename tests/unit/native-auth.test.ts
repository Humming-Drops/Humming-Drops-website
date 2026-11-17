import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth/password";
import {
  createSessionToken,
  verifySessionToken,
  getSessionCookieOptions,
  SESSION_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "../../src/lib/auth/session";

describe("Native Authentication & 48-Hour Session Lifecycle", () => {
  describe("Password Hashing & Verification (scrypt + timingSafeEqual)", () => {
    it("successfully hashes and verifies matching password", async () => {
      const plaintext = "SuperSecretPassword123!";
      const hash = await hashPassword(plaintext);

      expect(typeof hash).toBe("string");
      expect(hash).toContain(":"); // format: salt:key

      const isMatch = await verifyPassword(plaintext, hash);
      expect(isMatch).toBe(true);
    });

    it("rejects non-matching password", async () => {
      const hash = await hashPassword("CorrectPassword123!");
      const isMatch = await verifyPassword("WrongPassword!", hash);
      expect(isMatch).toBe(false);
    });

    it("handles malformed hashes safely without throwing unhandled exceptions", async () => {
      expect(await verifyPassword("Password123!", "invalid_hash_string")).toBe(false);
      expect(await verifyPassword("Password123!", "")).toBe(false);
      expect(await verifyPassword("Password123!", null as any)).toBe(false);
    });
  });

  describe("Session Token & 48-Hour Auto-Session Expiration Invariant", () => {
    it("enforces standard 48-hour session lifetime (172,800 seconds)", () => {
      expect(SESSION_MAX_AGE_SECONDS).toBe(48 * 60 * 60);
      expect(SESSION_MAX_AGE_SECONDS).toBe(172800);
      expect(SESSION_COOKIE_NAME).toBe("hd_session");

      const cookieOpts = getSessionCookieOptions();
      expect(cookieOpts.name).toBe("hd_session");
      expect(cookieOpts.httpOnly).toBe(true);
      expect(cookieOpts.path).toBe("/");
      expect(cookieOpts.maxAge).toBe(172800);
    });

    it("generates a signed token that successfully verifies with unexpired duration", async () => {
      const token = await createSessionToken({
        userId: "usr_test_123",
        email: "subscriber@hummingdrops.com",
        role: "customer",
        fullName: "Test Subscriber",
      });

      expect(typeof token).toBe("string");
      expect(token).toContain(".");

      const session = await verifySessionToken(token);
      expect(session).not.toBeNull();
      expect(session?.userId).toBe("usr_test_123");
      expect(session?.email).toBe("subscriber@hummingdrops.com");
      expect(session?.role).toBe("customer");
      expect(session?.fullName).toBe("Test Subscriber");
      expect(session?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it("immediately expires and rejects a session when TTL exceeds 48 hours / expired", async () => {
      // Create token with -10 seconds remaining (already expired)
      const expiredToken = await createSessionToken(
        {
          userId: "usr_expired_123",
          email: "expired@hummingdrops.com",
          role: "customer",
        },
        -10
      );

      const session = await verifySessionToken(expiredToken);
      expect(session).toBeNull();
    });

    it("rejects tampered session tokens", async () => {
      const validToken = await createSessionToken({
        userId: "usr_secure_123",
        email: "secure@hummingdrops.com",
        role: "customer",
      });

      const [payloadPart, sigPart] = validToken.split(".");

      // Tamper payload by altering base64 characters
      const tamperedPayload = payloadPart.slice(0, -2) + "==";
      const tamperedToken = `${tamperedPayload}.${sigPart}`;

      const session = await verifySessionToken(tamperedToken);
      expect(session).toBeNull();
    });

    it("rejects empty or corrupt token strings safely", async () => {
      expect(await verifySessionToken("")).toBeNull();
      expect(await verifySessionToken(null)).toBeNull();
      expect(await verifySessionToken(undefined)).toBeNull();
      expect(await verifySessionToken("not_a_valid_token")).toBeNull();
    });
  });
});
