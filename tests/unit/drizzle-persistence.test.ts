import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it } from "vitest";
import {
  subscriptionStatusEnum,
  fulfillmentModeEnum,
  dietaryTypeEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  userRoleEnum,
  users,
  profiles,
  subscriptionPlans,
  userSubscriptions,
  deliveryAddresses,
  dietaryPreferences,
  healthVitals,
  payments,
  subscriptionAuditLogs,
  usersRelations,
  userSubscriptionsRelations,
} from "../../src/lib/db/schema";
import { isDatabaseConfigured } from "../../src/lib/db";
import {
  JsonFileLeadRepository,
  HybridLeadRepository,
  CANONICAL_PLANS,
  type CreateLeadDTO,
} from "../../src/lib/lead-storage";
import { migrateJsonLeadsToPostgres } from "../../src/lib/db/migrate-leads";

async function verifyDrizzlePersistence() {
  console.log("▶ Drizzle ORM Schema & Relational Definitions");

  // Verify PostgreSQL Enums
  assert.equal(subscriptionStatusEnum.enumName, "subscription_status");
  assert.deepEqual(subscriptionStatusEnum.enumValues, [
    "registration_submitted",
    "pending_confirmation",
    "confirmed_active",
    "paused",
    "cancelled",
    "expired",
  ]);

  assert.equal(fulfillmentModeEnum.enumName, "fulfillment_mode");
  assert.deepEqual(fulfillmentModeEnum.enumValues, [
    "assisted_lead",
    "online_gateway",
  ]);

  assert.equal(dietaryTypeEnum.enumName, "dietary_type");
  assert.deepEqual(dietaryTypeEnum.enumValues, ["standard", "vegan", "pure_fruit"]);

  assert.equal(paymentMethodEnum.enumName, "payment_method");
  assert.deepEqual(paymentMethodEnum.enumValues, [
    "razorpay",
    "whatsapp_assisted",
    "manual_offline",
  ]);

  assert.equal(userRoleEnum.enumName, "user_role");
  assert.deepEqual(userRoleEnum.enumValues, [
    "customer",
    "admin",
    "operations",
    "nutritionist",
    "super_admin",
    "business_admin",
    "operations_manager",
    "finance_manager",
    "content_manager",
    "read_only_auditor",
  ]);

  // Verify Tables existence and core properties
  assert.ok(users, "users table defined");
  assert.ok(profiles, "profiles table defined");
  assert.ok(subscriptionPlans, "subscriptionPlans table defined");
  assert.ok(userSubscriptions, "userSubscriptions table defined");
  assert.ok(deliveryAddresses, "deliveryAddresses table defined");
  assert.ok(dietaryPreferences, "dietaryPreferences table defined");
  assert.ok(healthVitals, "healthVitals table defined");
  assert.ok(payments, "payments table defined");
  assert.ok(subscriptionAuditLogs, "subscriptionAuditLogs table defined");

  // Verify Relations Graph
  assert.ok(usersRelations, "users relations defined");
  assert.ok(userSubscriptionsRelations, "userSubscriptions relations defined");
  console.log("  ✔ PostgreSQL schema, enums, tables, and relations verified");

  console.log("▶ Canonical Subscription Plans");
  assert.equal(CANONICAL_PLANS.standard.monthlyPriceINR, 3500);
  assert.equal(CANONICAL_PLANS.standard.perDayPriceINR, 116);
  assert.equal(CANONICAL_PLANS.premium.monthlyPriceINR, 4000);
  assert.equal(CANONICAL_PLANS.premium.perDayPriceINR, 133);
  console.log("  ✔ Canonical pricing constants match verified business truths");

  console.log("▶ Database Configuration & Hybrid Repository Cutover");
  const originalDbUrl = process.env.DATABASE_URL;

  // Test when DATABASE_URL is unset
  delete process.env.DATABASE_URL;
  assert.equal(isDatabaseConfigured(), false);

  const hybridRepo = new HybridLeadRepository();
  assert.equal(hybridRepo.getActiveDriverName(), "local_json_fallback");
  console.log("  ✔ Successfully defaults to local_json_fallback when DATABASE_URL is absent");

  // Test migration safety when unconfigured
  const migrationResult = await migrateJsonLeadsToPostgres();
  assert.equal(migrationResult.success, false);
  assert.ok(migrationResult.message.includes("DATABASE_URL is not configured"));
  console.log("  ✔ Migration utility gracefully halts when DATABASE_URL is not set");

  // Restore env if originally set
  if (originalDbUrl) {
    process.env.DATABASE_URL = originalDbUrl;
  }

  console.log("▶ Local JSON Repository Isolation & Strict Invariants");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hd-test-"));
  const tempJsonPath = path.join(tempDir, "leads.test.json");

  const isolatedJsonRepo = new JsonFileLeadRepository(tempJsonPath);

  const sampleLead: CreateLeadDTO = {
    leadReferenceCode: "HD-REG-2026-TEST01",
    planId: "standard",
    planName: "Standard",
    monthlyPriceINR: 3500,
    customer: {
      fullName: "Priya Sharma",
      phone: "9876543210",
      email: "priya@example.com",
    },
    deliveryAddress: {
      flatNo: "302",
      buildingName: "Sobha Amber",
      streetAddress: "Bellandur Outer Ring Rd",
      area: "Bellandur",
      city: "Bangalore",
      pincode: "560103",
    },
    dietaryPreferences: {
      dietaryType: "standard",
      allergies: ["peanuts"],
      notes: "Low glycemic breakfast preferred",
    },
    fulfillmentMode: "assisted_lead",
  };

  const created = await isolatedJsonRepo.createLead(sampleLead);
  assert.equal(created.status, "pending_confirmation");
  assert.equal(created.hasActivePerks, false);
  assert.equal(created.leadReferenceCode, "HD-REG-2026-TEST01");

  const fetched = await isolatedJsonRepo.getLeadByReference("HD-REG-2026-TEST01");
  assert.ok(fetched);
  assert.equal(fetched?.customer.fullName, "Priya Sharma");

  // Clean up temp
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("  ✔ Lead repository enforces pending_confirmation and hasActivePerks=false");
}

describe("Drizzle persistence and schema invariants", () => {
  it("verifies the persistence foundation", async () => {
    await verifyDrizzlePersistence();
  });
});
