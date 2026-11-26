import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { apiError, isUuid } from "../../src/lib/api-response";

describe("api-response helpers", () => {
  it("isUuid accepts UUIDs and rejects junk", () => {
    assert.equal(isUuid("90ff5b35-78f8-4139-8f80-7c5d4a47864a"), true);
    assert.equal(isUuid("not-a-uuid"), false);
    assert.equal(isUuid(undefined), false);
    assert.equal(isUuid(""), false);
  });

  it("apiError returns the unified envelope", async () => {
    const res = apiError("Bad", 400, { details: ["x"] });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { success: false, error: "Bad", details: ["x"] });
  });
});
