import { describe, it, expect, afterEach, vi } from "vitest";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { getSecretKey } from "@/lib/auth/session";
import { clearAttempts, isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { validatePauseRange } from "@/lib/subscription-admin";
import { resolveAccountRole } from "@/lib/staff-admin";

afterEach(() => vi.unstubAllEnvs());

describe("redirect targets", () => {
  it("rejects dot segments that normalise to another host", () => {
    for (const url of ["/..//evil.com", "/.//evil.com", "/%2e%2e//evil.com"]) {
      expect(isSafeRedirectUrl(url)).toBe(false);
    }
    expect(isSafeRedirectUrl("/subscribe?plan=standard")).toBe(true);
  });
});

describe("session secret", () => {
  it("refuses missing or published secrets in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXTAUTH_SECRET", "");
    for (const bad of ["", "short", "hummingdrops_secure_session_signing_secret_2026_dev_key"]) {
      vi.stubEnv("SESSION_SECRET", bad);
      expect(() => getSecretKey()).toThrow();
    }
    vi.stubEnv("SESSION_SECRET", "x".repeat(48));
    expect(getSecretKey()).toBe("x".repeat(48));
  });
});

describe("rate limiting", () => {
  it("blocks at the limit and resets after the window", () => {
    clearAttempts("k");
    for (let i = 0; i < 3; i++) recordAttempt("k", 1000, 0);
    expect(isRateLimited("k", 3, 1000, 500)).toBe(true);
    expect(isRateLimited("k", 3, 1000, 1500)).toBe(false);
  });
});

describe("pause dates", () => {
  it("rejects impossible, past and non-text dates", () => {
    expect(validatePauseRange("2099-02-30", "2099-03-02")).toBeTruthy();
    expect(validatePauseRange("2020-01-01", "2020-01-02")).toBeTruthy();
    expect(validatePauseRange(5 as unknown as string, "2099-01-01")).toBeTruthy();
    expect(validatePauseRange("2099-01-01", "2099-01-02")).toBeNull();
  });
});

describe("account role follows grants", () => {
  it("promotes, demotes and keeps legacy admins", () => {
    expect(resolveAccountRole("customer", ["content_manager"])).toBe("content_manager");
    expect(resolveAccountRole("content_manager", [], "content_manager")).toBe("customer");
    expect(resolveAccountRole("admin", ["content_manager"])).toBe("admin");
    expect(resolveAccountRole("admin", [], "super_admin")).toBe("customer");
  });
});
