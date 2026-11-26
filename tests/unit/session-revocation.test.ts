import { describe, it, expect, vi } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";
import { passwordFingerprint } from "@/lib/auth/revocation";
import { visibleAdminSections } from "@/lib/auth/admin-sections";
import { getServerAuthoritativeCheckoutMode } from "@/lib/checkout-config";

describe("session identity", () => {
  it("gives every session its own id and keeps the password fingerprint", async () => {
    const base = { userId: "u", email: "a@example.invalid", role: "customer", pv: passwordFingerprint("hash-1") };
    const first = await verifySessionToken(await createSessionToken(base));
    const second = await verifySessionToken(await createSessionToken(base));
    expect(first?.jti).toBeTruthy();
    expect(first?.jti).not.toBe(second?.jti);
    expect(first?.pv).not.toBe(passwordFingerprint("hash-2"));
  });
});

describe("admin navigation", () => {
  it("lists only sections the role may open", async () => {
    const sections = await visibleAdminSections(async (p) => p === "content:write");
    expect(sections.map((s) => s.label)).toEqual(["Overview", "Content"]);
  });
});

describe("checkout mode", () => {
  it("ignores the public variable on the server", () => {
    vi.stubEnv("CHECKOUT_MODE", "");
    vi.stubEnv("NEXT_PUBLIC_CHECKOUT_MODE", "online_gateway");
    expect(getServerAuthoritativeCheckoutMode()).toBe("assisted_lead");
    vi.unstubAllEnvs();
  });
});
