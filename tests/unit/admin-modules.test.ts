import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { validatePauseRange } from "../../src/lib/subscription-admin";

describe("validatePauseRange", () => {
  it("accepts a well-formed forward-ordered range", () => {
    assert.equal(validatePauseRange("2026-12-01", "2026-12-10"), null);
  });

  it("accepts a single-day pause (start === end)", () => {
    assert.equal(validatePauseRange("2026-12-01", "2026-12-01"), null);
  });

  it("rejects an end date before the start date", () => {
    const error = validatePauseRange("2026-12-10", "2026-12-01");
    assert.ok(error);
    assert.match(error!, /on or after/);
  });

  it("rejects malformed date strings", () => {
    assert.ok(validatePauseRange("12/01/2026", "2026-12-10"));
    assert.ok(validatePauseRange("2026-12-01", "not-a-date"));
    assert.ok(validatePauseRange("", ""));
  });
});
