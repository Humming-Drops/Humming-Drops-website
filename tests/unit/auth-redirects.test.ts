import { describe, it, expect } from "vitest";
import {
  buildRegisterRedirectUrl,
  getSafeSubscriptionReturnUrl,
  isSafeRedirectUrl,
  isValidPlanTier,
} from "@/lib/auth-redirects";

describe("Phase 2A: Authentication Gate & Subscription Plan Preservation", () => {
  const BASE_URL = "http://localhost:3000";

  describe("Scenario 1 & 2: Plan parameter preservation during redirect", () => {
    it("preserves standard plan when redirecting unauthenticated guest to /register", () => {
      const redirectUrl = buildRegisterRedirectUrl(BASE_URL, "standard");
      expect(redirectUrl.pathname).toBe("/register");
      expect(redirectUrl.searchParams.get("redirect_url")).toBe("/subscribe?plan=standard");
    });

    it("preserves premium plan when redirecting unauthenticated guest to /register", () => {
      const redirectUrl = buildRegisterRedirectUrl(BASE_URL, "premium");
      expect(redirectUrl.pathname).toBe("/register");
      expect(redirectUrl.searchParams.get("redirect_url")).toBe("/subscribe?plan=premium");
    });
  });

  describe("Scenario 3 & 4: Return destination handling", () => {
    it("returns correct subscription route for post-registration destination", () => {
      const returnUrl = getSafeSubscriptionReturnUrl("standard");
      expect(returnUrl).toBe("/subscribe?plan=standard");
    });

    it("returns correct subscription route for post-signin destination", () => {
      const returnUrl = getSafeSubscriptionReturnUrl("premium");
      expect(returnUrl).toBe("/subscribe?plan=premium");
    });
  });

  describe("Scenario 5: Plan identifier validation for direct access", () => {
    it("validates standard and premium plans as valid tiers", () => {
      expect(isValidPlanTier("standard")).toBe(true);
      expect(isValidPlanTier("premium")).toBe(true);
    });
  });

  describe("Scenario 6 & 7: Direct visits to auth pages without redirect_url", () => {
    it("returns base /subscribe when plan parameter is not provided", () => {
      const redirectUrl = buildRegisterRedirectUrl(BASE_URL, null);
      expect(redirectUrl.pathname).toBe("/register");
      expect(redirectUrl.searchParams.get("redirect_url")).toBe("/subscribe");
    });

    it("accepts safe internal paths when direct visits provide internal return destinations", () => {
      expect(isSafeRedirectUrl("/dashboard/overview")).toBe(true);
      expect(isSafeRedirectUrl("/subscribe")).toBe(true);
      expect(isSafeRedirectUrl("/subscribe?plan=standard")).toBe(true);
      expect(isSafeRedirectUrl("/subscribe?plan=premium")).toBe(true);
    });
  });

  describe("Scenario 8: Authenticated customer redirection forward destination", () => {
    it("resolves safe destination for already authenticated customer visiting /register", () => {
      const safeTarget = isSafeRedirectUrl("/subscribe?plan=standard")
        ? "/subscribe?plan=standard"
        : "/subscribe";
      expect(safeTarget).toBe("/subscribe?plan=standard");
    });

    it("defaults to /subscribe if redirect destination is absent or unsafe", () => {
      const unsafeParam = "https://attacker.com";
      const safeTarget = isSafeRedirectUrl(unsafeParam) ? unsafeParam : "/subscribe";
      expect(safeTarget).toBe("/subscribe");
    });
  });

  describe("Scenario 9: Open redirect prevention & malicious URL rejection", () => {
    it("rejects absolute external URLs", () => {
      expect(isSafeRedirectUrl("https://malicious.com")).toBe(false);
      expect(isSafeRedirectUrl("http://malicious.com")).toBe(false);
      expect(isSafeRedirectUrl("https://evil.com/phishing")).toBe(false);
    });

    it("rejects protocol-relative URLs (//)", () => {
      expect(isSafeRedirectUrl("//malicious.com")).toBe(false);
      expect(isSafeRedirectUrl("//evil.com/subscribe")).toBe(false);
      expect(isSafeRedirectUrl("/\\malicious.com")).toBe(false);
    });

    it("rejects javascript: and data: URIs", () => {
      expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeRedirectUrl("data:text/html,<script>evil()</script>")).toBe(false);
    });

    it("rejects backslash directory traversal and control characters", () => {
      expect(isSafeRedirectUrl("/\\attacker.com")).toBe(false);
      expect(isSafeRedirectUrl("/subscribe\\attacker.com")).toBe(false);
      expect(isSafeRedirectUrl("/subscribe\nattacker.com")).toBe(false);
      expect(isSafeRedirectUrl("/subscribe\rattacker.com")).toBe(false);
      expect(isSafeRedirectUrl("/subscribe attacker.com")).toBe(false);
    });

    it("rejects null, undefined, and non-string inputs", () => {
      expect(isSafeRedirectUrl(null)).toBe(false);
      expect(isSafeRedirectUrl(undefined)).toBe(false);
      expect(isSafeRedirectUrl("")).toBe(false);
    });
  });

  describe("Scenario 10: Missing or invalid plan query parameters", () => {
    it("falls back safely to /subscribe for arbitrary invalid plan parameters", () => {
      expect(isValidPlanTier("vip")).toBe(false);
      expect(isValidPlanTier("enterprise")).toBe(false);
      expect(isValidPlanTier("standard' OR '1'='1")).toBe(false);
      expect(isValidPlanTier("<script>")).toBe(false);
      expect(isValidPlanTier(undefined)).toBe(false);
      expect(isValidPlanTier("")).toBe(false);

      expect(getSafeSubscriptionReturnUrl("vip")).toBe("/subscribe");
      expect(getSafeSubscriptionReturnUrl("")).toBe("/subscribe");
      expect(getSafeSubscriptionReturnUrl(undefined)).toBe("/subscribe");
    });

    it("generates clean /register?redirect_url=/subscribe for invalid plan inputs", () => {
      const redirectUrl = buildRegisterRedirectUrl(BASE_URL, "malicious_plan");
      expect(redirectUrl.pathname).toBe("/register");
      expect(redirectUrl.searchParams.get("redirect_url")).toBe("/subscribe");
    });
  });
});

