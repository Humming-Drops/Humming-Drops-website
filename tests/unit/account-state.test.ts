import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { deriveAccountState } from "../../src/lib/use-subscriber-account";

describe("deriveAccountState (CUS-02: only confirmed_active is active)", () => {
  it("maps lifecycle statuses", () => {
    assert.equal(deriveAccountState("confirmed_active"), "active");
    assert.equal(deriveAccountState("pending_confirmation"), "pending");
    assert.equal(deriveAccountState("registration_submitted"), "pending");
    assert.equal(deriveAccountState("paused"), "paused");
    assert.equal(deriveAccountState("cancelled"), "ended");
    assert.equal(deriveAccountState("expired"), "ended");
  });
  it("treats missing subscription as none", () => {
    assert.equal(deriveAccountState(null), "none");
    assert.equal(deriveAccountState(undefined), "none");
  });
});
