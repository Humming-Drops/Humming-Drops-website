import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { validateDatabaseUrl } from "../../src/lib/db/validate-url";

describe("validateDatabaseUrl", () => {
  it("rejects an unset DATABASE_URL", () => {
    const result = validateDatabaseUrl(undefined, "production");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("not set")));
  });

  it("rejects a malformed URL", () => {
    const result = validateDatabaseUrl("not a url at all", "development");
    assert.equal(result.valid, false);
  });

  it("rejects a non-postgres scheme", () => {
    const result = validateDatabaseUrl("mysql://user:pass@host:3306/db", "development");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("postgres://")));
  });

  it("rejects a URL with no database name", () => {
    const result = validateDatabaseUrl("postgresql://user:pass@host:5432", "development");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("database name")));
  });

  it("accepts a well-formed development URL without requiring sslmode", () => {
    const result = validateDatabaseUrl("postgresql://postgres:postgres@localhost:5432/hummingdrops_dev", "development");
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it("rejects a localhost host when NODE_ENV is production", () => {
    const result = validateDatabaseUrl("postgresql://postgres:postgres@localhost:5432/hummingdrops_prod", "production");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("localhost")));
  });

  it("warns (but does not fail) a production URL missing sslmode", () => {
    const result = validateDatabaseUrl(
      "postgresql://postgres:pw@roundhouse.proxy.rlwy.net:5432/railway",
      "production"
    );
    assert.equal(result.valid, true);
    assert.ok(result.warnings.some((w) => w.includes("sslmode")));
  });

  it("accepts a fully-specified production URL with sslmode=require", () => {
    const result = validateDatabaseUrl(
      "postgresql://postgres:pw@roundhouse.proxy.rlwy.net:5432/railway?sslmode=require",
      "production"
    );
    assert.equal(result.valid, true);
    assert.equal(result.warnings.length, 0);
  });
});
