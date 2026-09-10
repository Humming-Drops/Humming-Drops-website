import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = 3099;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

console.log("------------------------------------------------------------");
console.log("PHASE 4.6 BACKEND INTEGRATION TEST SUITE");
console.log("------------------------------------------------------------");

// 1. Start Next.js production server
console.log(`Starting Next.js server on port ${PORT}...`);
const serverProcess = spawn("npx.cmd", ["next", "start", "-p", String(PORT)], {
  cwd: process.cwd(),
  stdio: "pipe",
  shell: true,
});

serverProcess.stderr.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("ExperimentalWarning")) {
    console.error(`[Server stderr]: ${str}`);
  }
});

// Wait for server to become responsive
async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/subscriptions/lead`);
      if (res.status === 200 || res.status === 400 || res.status === 404) {
        return true;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw new Error("Server failed to start within timeout.");
}

async function runTests() {
  try {
    await waitForServer();
    console.log("✓ Next.js server is ready. Running API contract tests...\n");

    // -------------------------------------------------------------
    // TEST 1: Missing required fields must be rejected (400)
    // -------------------------------------------------------------
    console.log("Test 1: Reject missing required fields...");
    const resMissing = await fetch(`${BASE_URL}/api/subscriptions/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(resMissing.status, 400, "Missing fields must return 400");
    const jsonMissing = await resMissing.json();
    assert.strictEqual(jsonMissing.success, false);
    console.log("  ✓ Test 1 Passed: Rejected payload with missing fields.");

    // -------------------------------------------------------------
    // TEST 2: Invalid Indian mobile number must be rejected (400)
    // -------------------------------------------------------------
    console.log("Test 2: Reject invalid mobile phone numbers...");
    const resBadPhone = await fetch(`${BASE_URL}/api/subscriptions/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "standard",
        customer: { fullName: "Aarav Sharma", phone: "12345", email: "aarav@example.com" },
        deliveryAddress: {
          flatNo: "101",
          buildingName: "Palm Grove",
          streetAddress: "1st Main",
          area: "Indiranagar",
          pincode: "560038",
        },
      }),
    });
    assert.strictEqual(resBadPhone.status, 400);
    const jsonBadPhone = await resBadPhone.json();
    assert.strictEqual(jsonBadPhone.field, "customer.phone");
    console.log("  ✓ Test 2 Passed: Invalid phone rejected with field error.");

    // -------------------------------------------------------------
    // TEST 3: Invalid email format must be rejected (400)
    // -------------------------------------------------------------
    console.log("Test 3: Reject invalid email address...");
    const resBadEmail = await fetch(`${BASE_URL}/api/subscriptions/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "standard",
        customer: { fullName: "Aarav Sharma", phone: "9876543210", email: "not-an-email" },
        deliveryAddress: {
          flatNo: "101",
          buildingName: "Palm Grove",
          streetAddress: "1st Main",
          area: "Indiranagar",
          pincode: "560038",
        },
      }),
    });
    assert.strictEqual(resBadEmail.status, 400);
    const jsonBadEmail = await resBadEmail.json();
    assert.strictEqual(jsonBadEmail.field, "customer.email");
    console.log("  ✓ Test 3 Passed: Invalid email rejected with field error.");

    // -------------------------------------------------------------
    // TEST 4: Valid submission succeeds (201) with strict invariants
    // -------------------------------------------------------------
    console.log("Test 4: Valid submission with Mode B assisted registration...");
    const validPayload = {
      planId: "premium",
      customer: {
        fullName: "Dr. Vikram Patel",
        phone: "+91 98450 12345",
        email: "vikram.patel@example.com",
      },
      deliveryAddress: {
        flatNo: "Penthouse B",
        buildingName: "Sobha Amber",
        streetAddress: "Sarjapur Outer Ring Road",
        area: "Bellandur",
        city: "Bangalore",
        pincode: "560103",
        deliveryNotes: "Leave at front desk with security",
      },
      dietaryPreferences: {
        dietaryType: "vegan",
        allergies: ["Peanuts & Tree Nuts"],
        notes: "Please pack sprouts separately",
      },
      // ATTEMPT SPOOFING: Client sends low price and active status
      monthlyPriceINR: 100,
      price: 50,
      status: "confirmed_active",
      hasActivePerks: true,
    };

    const resValid = await fetch(`${BASE_URL}/api/subscriptions/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    assert.strictEqual(resValid.status, 201, "Valid registration must return 201 Created");
    const jsonValid = await resValid.json();

    assert.strictEqual(jsonValid.success, true);
    assert.ok(jsonValid.leadReferenceCode, "Must return reference code");
    assert.match(jsonValid.leadReferenceCode, /^HD-REG-\d{4}-\d+$/);

    // Guardrail: Status must strictly be pending_confirmation
    assert.strictEqual(
      jsonValid.status,
      "pending_confirmation",
      "Status must NEVER be active upon lead submission!"
    );
    assert.strictEqual(
      jsonValid.hasActivePerks,
      false,
      "hasActivePerks must strictly be false!"
    );

    // Guardrail: Canonical pricing enforced (ignores spoofed 100/50)
    assert.strictEqual(
      jsonValid.plan.monthlyPriceINR,
      4000,
      "Server must enforce canonical ₹4000 Premium price!"
    );

    // Guardrail: WhatsApp URL must be properly constructed
    assert.ok(jsonValid.whatsappRedirectUrl.includes("wa.me/918618902810"));
    assert.ok(jsonValid.whatsappRedirectUrl.includes(encodeURIComponent(jsonValid.leadReferenceCode)));

    console.log(`  ✓ Test 4 Passed: Lead created with reference ${jsonValid.leadReferenceCode}`);
    console.log(`  ✓ Invariant Verified: status = 'pending_confirmation', hasActivePerks = false`);
    console.log(`  ✓ Pricing Verified: Canonical ₹4000 enforced (spoofed ₹100 ignored)`);

    // -------------------------------------------------------------
    // TEST 5: Verify Server Persistence in leads.json
    // -------------------------------------------------------------
    console.log("Test 5: Verify server persistence in data/leads.json...");
    assert.ok(fs.existsSync(LEADS_FILE), "data/leads.json must exist!");
    const fileContent = fs.readFileSync(LEADS_FILE, "utf8");
    const persistedLeads = JSON.parse(fileContent);

    const savedLead = persistedLeads.find((l) => l.leadReferenceCode === jsonValid.leadReferenceCode);
    assert.ok(savedLead, "Persisted lead record must be found in storage");
    assert.strictEqual(savedLead.status, "pending_confirmation");
    assert.strictEqual(savedLead.hasActivePerks, false);
    assert.strictEqual(savedLead.monthlyPriceINR, 4000);
    assert.strictEqual(savedLead.customer.fullName, "Dr. Vikram Patel");
    assert.strictEqual(savedLead.customer.phone, "9845012345");
    assert.strictEqual(savedLead.deliveryAddress.city, "Bangalore");
    console.log("  ✓ Test 5 Passed: Lead safely stored with complete audit data.");

    // -------------------------------------------------------------
    // TEST 6: Verify GET /api/subscriptions/lead?ref=...
    // -------------------------------------------------------------
    console.log("Test 6: Verify lead retrieval query...");
    const resGet = await fetch(`${BASE_URL}/api/subscriptions/lead?ref=${jsonValid.leadReferenceCode}`);
    assert.strictEqual(resGet.status, 200);
    const jsonGet = await resGet.json();
    assert.strictEqual(jsonGet.leadReferenceCode, jsonValid.leadReferenceCode);
    assert.strictEqual(jsonGet.status, "pending_confirmation");
    console.log("  ✓ Test 6 Passed: Lead query returns accurate record.");

    console.log("\n============================================================");
    console.log("ALL PHASE 4.6 BACKEND INTEGRATION TESTS PASSED (6/6)");
    console.log("============================================================\n");
  } finally {
    console.log("Shutting down test server...");
    // Kill server process tree on Windows
    if (serverProcess.pid) {
      spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"], { stdio: "ignore" });
    }
  }
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  if (serverProcess.pid) {
    spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"], { stdio: "ignore" });
  }
  process.exit(1);
});
