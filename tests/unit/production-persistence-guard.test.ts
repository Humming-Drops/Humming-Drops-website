import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  ProductionPersistenceError,
  assertProductionPersistenceAllowed,
} from "../../src/lib/production-persistence-guard";
import { HybridLeadRepository } from "../../src/lib/lead-storage";
import { HybridPaymentRepository } from "../../src/lib/payment-storage";

describe("assertProductionPersistenceAllowed", () => {
  it("throws when PostgreSQL is unconfigured in production", () => {
    assert.throws(
      () => assertProductionPersistenceAllowed("test records", false, "production"),
      ProductionPersistenceError
    );
  });

  it("does not throw when PostgreSQL is configured, regardless of environment", () => {
    assert.doesNotThrow(() => assertProductionPersistenceAllowed("test records", true, "production"));
  });

  it("does not throw when unconfigured outside production (dev/test fallback is allowed)", () => {
    assert.doesNotThrow(() => assertProductionPersistenceAllowed("test records", false, "development"));
    assert.doesNotThrow(() => assertProductionPersistenceAllowed("test records", false, "test"));
    assert.doesNotThrow(() => assertProductionPersistenceAllowed("test records", false, undefined));
  });
});

describe("Production cannot silently fall back to JSON files", () => {
  const originalDbUrl = process.env.DATABASE_URL;
  const originalNodeEnv = process.env.NODE_ENV;

  async function withProductionUnconfigured<T>(fn: () => Promise<T>): Promise<T> {
    delete process.env.DATABASE_URL;
    (process.env as Record<string, string>).NODE_ENV = "production";
    try {
      return await fn();
    } finally {
      if (originalDbUrl !== undefined) process.env.DATABASE_URL = originalDbUrl;
      (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
    }
  }

  it("HybridLeadRepository refuses to read/write leads in production without DATABASE_URL", async () => {
    await withProductionUnconfigured(async () => {
      const repo = new HybridLeadRepository();
      await assert.rejects(() => repo.getAllLeads(), ProductionPersistenceError);
    });
  });

  it("HybridPaymentRepository refuses to read/write payments in production without DATABASE_URL", async () => {
    await withProductionUnconfigured(async () => {
      const repo = new HybridPaymentRepository();
      await assert.rejects(() => repo.listOrders(), ProductionPersistenceError);
      await assert.rejects(() => repo.hasWebhookEvent("evt_test"), ProductionPersistenceError);
    });
  });
});
