import assert from "node:assert";
import crypto from "node:crypto";
import { spawn, execSync } from "node:child_process";

const PORT = 3098;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const TEST_KEY_SECRET = "test_razorpay_secret_1234567890abcdef";
const TEST_WEBHOOK_SECRET = "test_webhook_secret_abcdef1234567890";
const TEST_ADMIN_KEY = "test_admin_key_998877";

console.log("============================================================");
console.log("PAYMENTS ENGINE & WEBHOOK VERIFICATION TEST SUITE (TC-111 - TC-118)");
console.log("============================================================\n");

const env = {
  ...process.env,
  PORT: String(PORT),
  CHECKOUT_MODE: "online_gateway",
  NEXT_PUBLIC_CHECKOUT_MODE: "online_gateway",
  RAZORPAY_KEY_ID: "rzp_test_placeholder_key",
  RAZORPAY_KEY_SECRET: TEST_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET,
  ADMIN_API_KEY: TEST_ADMIN_KEY,
  MOCK_RAZORPAY: "true",
};

console.log(`Starting Next.js server on port ${PORT}...`);
const serverProcess = spawn("npx.cmd", ["next", "dev", "-p", String(PORT)], {
  cwd: process.cwd(),
  env,
  stdio: "pipe",
  shell: true,
});

serverProcess.stdout.on("data", (data) => {
  const str = data.toString();
  if (str.includes("Error") || str.includes("error") || str.includes("[PAYMENTS") || str.includes("WEBHOOK")) {
    console.log(`[Server stdout]: ${str.trim()}`);
  }
});

serverProcess.stderr.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("ExperimentalWarning") && !str.includes("Fast Refresh")) {
    console.error(`[Server stderr]: ${str.trim()}`);
  }
});

function cleanupServer() {
  if (serverProcess && serverProcess.pid) {
    try {
      execSync(`taskkill /PID ${serverProcess.pid} /T /F`, { stdio: "ignore" });
    } catch {
      // Process already terminated
    }
  }
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 400) {
        return true;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error("Server failed to become responsive within timeout.");
}

async function runTests() {
  try {
    await waitForServer();
    console.log("✓ Next.js server is responsive. Beginning test executions...\n");

    // -------------------------------------------------------------
    // Pre-requisite: Create a Lead in Mode B to test promotion
    // -------------------------------------------------------------
    const createLeadRes = await fetch(`${BASE_URL}/api/subscriptions/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "standard",
        customer: {
          fullName: "Aarav Sharma",
          phone: "9876543210",
          email: "aarav.test@example.com",
        },
        deliveryAddress: {
          flatNo: "402",
          buildingName: "Palm Meadows",
          streetAddress: "Indiranagar 100ft Road",
          area: "Indiranagar",
          pincode: "560038",
        },
        dietaryPreferences: {
          dietaryType: "standard",
          allergies: ["Peanuts & Tree Nuts"],
        },
      }),
    });
    if (createLeadRes.status !== 201) {
      const errText = await createLeadRes.text();
      console.error(`createLeadRes returned status ${createLeadRes.status}:`, errText);
    }
    assert.strictEqual(createLeadRes.status, 201, "Lead creation should return 201");
    const leadJson = await createLeadRes.json();
    const createdRef = leadJson.leadReferenceCode;
    assert(createdRef, "Lead reference code must be present in response");
    console.log(`✓ Pre-requisite: Created subscriber lead ${createdRef} (pending_confirmation)`);

    // -------------------------------------------------------------
    // TEST 1: TC-111 Price Tampering Defense (/api/payments/order)
    // -------------------------------------------------------------
    console.log("\n[TEST 1] TC-111: Price Tampering Defense");
    const tamperedOrderRes = await fetch(`${BASE_URL}/api/payments/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "standard",
        clientAmount: 500, // Attack attempt: trying to buy standard plan for ₹500
        leadReferenceCode: createdRef,
      }),
    });
    assert.strictEqual(tamperedOrderRes.status, 200, "Order creation should succeed");
    const tamperedOrderJson = await tamperedOrderRes.json();
    assert.strictEqual(tamperedOrderJson.success, true);
    assert.strictEqual(tamperedOrderJson.amountINR, 3500, "Price must be server-derived (₹3,500)");
    assert.strictEqual(tamperedOrderJson.amountSubunits, 350000, "Subunits must be 350,000 paise");
    assert(tamperedOrderJson.orderId.startsWith("order_"), "Valid orderId must be returned");
    console.log(`✓ TC-111 PASS: Client-submitted price was ignored. Order generated for ₹3,500 (${tamperedOrderJson.amountSubunits} paise).`);

    const activeOrderId = tamperedOrderJson.orderId;
    const paymentId = `pay_${Date.now()}`;

    // -------------------------------------------------------------
    // TEST 2: TC-113 Signature Tampering Rejection (/api/payments/verify)
    // -------------------------------------------------------------
    console.log("\n[TEST 2] TC-113: Signature Tampering Rejection");
    const corruptedSigRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: activeOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: "deadbeefcafebabe0123456789abcdef0123456789abcdef0123456789abcdef",
        leadReferenceCode: createdRef,
      }),
    });
    assert.strictEqual(corruptedSigRes.status, 400, "Tampered signature must return HTTP 400");
    const corruptedJson = await corruptedSigRes.json();
    assert.strictEqual(corruptedJson.success, false);
    console.log("✓ TC-113 PASS: Tampered signature rejected with HTTP 400 Bad Request.");

    // -------------------------------------------------------------
    // TEST 3: TC-112 HMAC Signature Verification & Lead Promotion
    // -------------------------------------------------------------
    console.log("\n[TEST 3] TC-112: HMAC Signature Verification & Subscription Activation");
    const payloadToSign = `${activeOrderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(payloadToSign)
      .digest("hex");

    const validVerifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: activeOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: validSignature,
        leadReferenceCode: createdRef,
      }),
    });
    assert.strictEqual(validVerifyRes.status, 200, "Valid signature must return HTTP 200");
    const verifyJson = await validVerifyRes.json();
    assert.strictEqual(verifyJson.success, true);
    assert.strictEqual(verifyJson.status, "confirmed_active");

    // Verify lead was promoted in database/file store
    const lookupRes = await fetch(`${BASE_URL}/api/subscriptions/lead?ref=${createdRef}`, {
      headers: { "x-api-key": TEST_ADMIN_KEY },
    });
    const lookupJson = await lookupRes.json();
    assert.strictEqual(lookupJson.status, "confirmed_active", "Lead status must be promoted to confirmed_active");
    assert.strictEqual(lookupJson.hasActivePerks, true, "Active perks must be enabled");
    console.log(`✓ TC-112 PASS: Valid signature accepted. Lead promoted to confirmed_active with hasActivePerks=true.`);

    // -------------------------------------------------------------
    // TEST 4: TC-114 Raw Stream Webhook Verification (/api/payments/webhook)
    // -------------------------------------------------------------
    console.log("\n[TEST 4] TC-114: Raw Stream Webhook Verification");
    const webhookEventId = `evt_test_${Date.now()}`;
    const webhookPayload = JSON.stringify({
      entity: "event",
      account_id: "acc_test",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: `pay_webhook_${Date.now()}`,
            order_id: activeOrderId,
            amount: 350000,
            status: "captured",
            notes: {
              leadReferenceCode: createdRef,
            },
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    });

    const validWebhookSig = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(webhookPayload)
      .digest("hex");

    const webhookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
        "x-razorpay-event-id": webhookEventId,
      },
      body: webhookPayload,
    });
    if (webhookRes.status !== 200) {
      const errText = await webhookRes.text();
      console.error(`Webhook returned status ${webhookRes.status}:`, errText);
    }
    assert.strictEqual(webhookRes.status, 200, "Webhook must be accepted with 200");
    const webhookJson = await webhookRes.json();
    assert.strictEqual(webhookJson.received, true);
    console.log("✓ TC-114 PASS: Valid raw body HMAC signature accepted with HTTP 200.");

    // -------------------------------------------------------------
    // TEST 5: TC-115 Webhook Payload Tampering Rejection
    // -------------------------------------------------------------
    console.log("\n[TEST 5] TC-115: Webhook Payload Tampering Rejection");
    const tamperedWebhookPayload = webhookPayload + " "; // Add extra space to break raw byte match
    const tamperedWebhookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig, // Old signature
        "x-razorpay-event-id": `evt_tampered_${Date.now()}`,
      },
      body: tamperedWebhookPayload,
    });
    assert.strictEqual(tamperedWebhookRes.status, 401, "Tampered raw payload must return 401");
    console.log("✓ TC-115 PASS: Byte mismatch on raw body rejected with HTTP 401 Unauthorized.");

    // -------------------------------------------------------------
    // TEST 6: TC-116 Webhook Event Deduplication
    // -------------------------------------------------------------
    console.log("\n[TEST 6] TC-116: Webhook Event Deduplication (Idempotency)");
    const duplicateWebhookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
        "x-razorpay-event-id": webhookEventId, // Identical event ID sent again
      },
      body: webhookPayload,
    });
    assert.strictEqual(duplicateWebhookRes.status, 200);
    const duplicateJson = await duplicateWebhookRes.json();
    assert.strictEqual(duplicateJson.received, true);
    assert.strictEqual(duplicateJson.note, "duplicate_ignored", "Duplicate event must be ignored");
    console.log("✓ TC-116 PASS: Duplicate webhook event returned HTTP 200 with duplicate_ignored.");

    // -------------------------------------------------------------
    // TEST 7: TC-117 Refund State Reconciliation & Perk Revocation
    // -------------------------------------------------------------
    console.log("\n[TEST 7] TC-117: Refund State Reconciliation");
    const refundPayload = JSON.stringify({
      entity: "event",
      event: "refund.processed",
      payload: {
        refund: {
          entity: {
            id: `rfnd_${Date.now()}`,
            payment_id: paymentId,
            amount: 350000,
            status: "processed",
            notes: {
              leadReferenceCode: createdRef,
            },
          },
        },
      },
    });

    const refundSig = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(refundPayload)
      .digest("hex");

    const refundRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": refundSig,
        "x-razorpay-event-id": `evt_refund_${Date.now()}`,
      },
      body: refundPayload,
    });
    assert.strictEqual(refundRes.status, 200);

    const lookupRefundLead = await fetch(`${BASE_URL}/api/subscriptions/lead?ref=${createdRef}`, {
      headers: { "x-api-key": TEST_ADMIN_KEY },
    });
    const refundLeadJson = await lookupRefundLead.json();
    assert.strictEqual(refundLeadJson.status, "cancelled", "Subscription must transition to cancelled");
    assert.strictEqual(refundLeadJson.hasActivePerks, false, "Clinical perks must be revoked");
    console.log("✓ TC-117 PASS: Refund processed. Subscription cancelled and MedCity perks revoked.");

    console.log("\n============================================================");
    console.log("ALL TEST CASES PASSED SUCCESSFULLY (TC-111 through TC-117)!");
    console.log("============================================================\n");
    cleanupServer();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED:", err);
    cleanupServer();
    process.exit(1);
  }
}

runTests();
