import assert from "node:assert";

// 1. Test Subscription Status Guardrail
function isSubscriptionActive(status) {
  return status === "confirmed_active";
}

function isPendingConfirmation(status) {
  return status === "pending_confirmation" || status === "registration_submitted";
}

assert.strictEqual(isSubscriptionActive("pending_confirmation"), false, "pending_confirmation must NOT be active!");
assert.strictEqual(isSubscriptionActive("registration_submitted"), false, "registration_submitted must NOT be active!");
assert.strictEqual(isSubscriptionActive("confirmed_active"), true, "confirmed_active must be active!");

assert.strictEqual(isPendingConfirmation("pending_confirmation"), true);
assert.strictEqual(isPendingConfirmation("registration_submitted"), true);
assert.strictEqual(isPendingConfirmation("confirmed_active"), false);

// 2. Test Server Authoritative Checkout Mode
function getServerAuthoritativeCheckoutMode(env) {
  const serverMode = env.CHECKOUT_MODE || env.NEXT_PUBLIC_CHECKOUT_MODE;
  if (serverMode === "online_gateway" || serverMode === "gateway") {
    return "online_gateway";
  }
  return "assisted_lead";
}

// Client tampering simulation
const clientTamperedEnv = { NEXT_PUBLIC_CHECKOUT_MODE: "fake_free_mode" };
assert.strictEqual(getServerAuthoritativeCheckoutMode(clientTamperedEnv), "assisted_lead", "Must fallback safely on unrecognized client mode");

const serverGatewayEnv = { CHECKOUT_MODE: "online_gateway" };
assert.strictEqual(getServerAuthoritativeCheckoutMode(serverGatewayEnv), "online_gateway");

console.log("✓ All Phase 1 Guardrail Tests Passed Successfully!");
