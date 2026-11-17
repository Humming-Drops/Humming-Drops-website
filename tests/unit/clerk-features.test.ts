import { describe, it, expect, vi } from "vitest";
import { isSafeRedirectUrl } from "../../src/lib/auth-redirects";

describe("Clerk Auth Route Protection & Redirect Security", () => {
  it("allows safe internal relative redirect URLs", () => {
    expect(isSafeRedirectUrl("/dashboard")).toBe(true);
    expect(isSafeRedirectUrl("/dashboard/overview")).toBe(true);
    expect(isSafeRedirectUrl("/subscribe")).toBe(true);
    expect(isSafeRedirectUrl("/onboarding?step=2")).toBe(true);
  });

  it("strictly blocks external open-redirect attempts", () => {
    expect(isSafeRedirectUrl("https://evil-phishing-site.com")).toBe(false);
    expect(isSafeRedirectUrl("http://attacker.com/steal-token")).toBe(false);
    expect(isSafeRedirectUrl("//evil.com")).toBe(false);
    expect(isSafeRedirectUrl("\\\\evil.com")).toBe(false);
    expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeRedirectUrl("data:text/html,<html>")).toBe(false);
  });

  it("handles empty or non-string inputs safely", () => {
    expect(isSafeRedirectUrl("")).toBe(false);
    expect(isSafeRedirectUrl(null as any)).toBe(false);
    expect(isSafeRedirectUrl(undefined as any)).toBe(false);
  });
});
