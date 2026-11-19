import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("password reset", () => {
  it("hashResetToken is a deterministic SHA-256 hex digest", async () => {
    const { hashResetToken } = await import("../../src/lib/auth/password-reset");
    const a = hashResetToken("token-1");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(hashResetToken("token-1")).toBe(a);
    expect(hashResetToken("token-2")).not.toBe(a);
  });

  it("forgot-password route never reveals whether an account exists", () => {
    const src = readFileSync(
      path.join(process.cwd(), "src/app/api/auth/forgot-password/route.ts"),
      "utf8"
    );
    // The only success body is the shared GENERIC constant.
    expect(src.match(/NextResponse\.json\(GENERIC\)/g)?.length).toBe(1);
    expect(src).not.toMatch(/not found|no account|does not exist/i);
  });

  it("raw tokens are never stored: schema only has tokenHash", () => {
    const src = readFileSync(path.join(process.cwd(), "src/lib/db/schema.ts"), "utf8");
    const block = src.slice(src.indexOf('pgTable("password_reset_tokens"'));
    expect(block.slice(0, 600)).toMatch(/tokenHash/);
    expect(block.slice(0, 600)).not.toMatch(/\btoken:\s*text/);
  });
});
