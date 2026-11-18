import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "vitest";

const source = readFileSync("src/lib/staff-admin.ts", "utf8");

describe("staff-admin credential safety (ADM-01)", () => {
  it("never selects the full users row", () => {
    assert.doesNotMatch(source, /\.select\(\)\s*\.from\(users\)/);
  });

  it("never selects passwordHash or clerkUserId", () => {
    assert.doesNotMatch(source, /users\.passwordHash/);
    assert.doesNotMatch(source, /users\.clerkUserId/);
  });
});
