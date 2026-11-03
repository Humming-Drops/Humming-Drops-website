import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, it } from "vitest";
import {
  extractPrimaryEmail,
  extractPrimaryPhone,
  verifyClerkWebhookSignature,
  type ClerkUserEventData,
} from "../../src/lib/clerk-webhook";

const TEST_SECRET = `whsec_${Buffer.from("test-signing-secret-bytes").toString("base64")}`;

function signSvix(secret: string, svixId: string, svixTimestamp: string, payload: string): string {
  const secretBytes = Buffer.from(secret.slice("whsec_".length), "base64");
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const sig = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  return `v1,${sig}`;
}

describe("verifyClerkWebhookSignature", () => {
  const svixId = "msg_test123";
  const payload = JSON.stringify({ type: "user.created", data: { id: "user_abc" } });

  it("accepts a correctly signed payload", () => {
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const svixSignature = signSvix(TEST_SECRET, svixId, svixTimestamp, payload);
    assert.equal(
      verifyClerkWebhookSignature({ payload, svixId, svixTimestamp, svixSignature, secret: TEST_SECRET }),
      true
    );
  });

  it("rejects a tampered payload", () => {
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const svixSignature = signSvix(TEST_SECRET, svixId, svixTimestamp, payload);
    const tamperedPayload = JSON.stringify({ type: "user.deleted", data: { id: "user_abc" } });
    assert.equal(
      verifyClerkWebhookSignature({
        payload: tamperedPayload,
        svixId,
        svixTimestamp,
        svixSignature,
        secret: TEST_SECRET,
      }),
      false
    );
  });

  it("rejects a signature produced with the wrong secret", () => {
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const wrongSecret = `whsec_${Buffer.from("a-different-secret").toString("base64")}`;
    const svixSignature = signSvix(wrongSecret, svixId, svixTimestamp, payload);
    assert.equal(
      verifyClerkWebhookSignature({ payload, svixId, svixTimestamp, svixSignature, secret: TEST_SECRET }),
      false
    );
  });

  it("rejects a stale timestamp outside the replay tolerance window", () => {
    const staleTimestamp = String(Math.floor(Date.now() / 1000) - 3600);
    const svixSignature = signSvix(TEST_SECRET, svixId, staleTimestamp, payload);
    assert.equal(
      verifyClerkWebhookSignature({
        payload,
        svixId,
        svixTimestamp: staleTimestamp,
        svixSignature,
        secret: TEST_SECRET,
      }),
      false
    );
  });

  it("accepts when the matching candidate is among several space-separated signatures", () => {
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const validSig = signSvix(TEST_SECRET, svixId, svixTimestamp, payload);
    const decoySig = "v1,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    const svixSignature = `${decoySig} ${validSig}`;
    assert.equal(
      verifyClerkWebhookSignature({ payload, svixId, svixTimestamp, svixSignature, secret: TEST_SECRET }),
      true
    );
  });

  it("rejects when the secret does not have the whsec_ prefix", () => {
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const svixSignature = signSvix(TEST_SECRET, svixId, svixTimestamp, payload);
    assert.equal(
      verifyClerkWebhookSignature({
        payload,
        svixId,
        svixTimestamp,
        svixSignature,
        secret: "not-a-whsec-secret",
      }),
      false
    );
  });
});

describe("extractPrimaryEmail", () => {
  it("picks the address matching primary_email_address_id", () => {
    const data: ClerkUserEventData = {
      id: "user_1",
      email_addresses: [
        { id: "idn_1", email_address: "old@example.com" },
        { id: "idn_2", email_address: "Current@Example.com" },
      ],
      primary_email_address_id: "idn_2",
    };
    assert.equal(extractPrimaryEmail(data), "current@example.com");
  });

  it("falls back to the first address when no primary id matches", () => {
    const data: ClerkUserEventData = {
      id: "user_1",
      email_addresses: [{ id: "idn_1", email_address: "only@example.com" }],
      primary_email_address_id: "idn_missing",
    };
    assert.equal(extractPrimaryEmail(data), "only@example.com");
  });

  it("returns null when there are no email addresses", () => {
    assert.equal(extractPrimaryEmail({ id: "user_1" }), null);
  });
});

describe("extractPrimaryPhone", () => {
  it("picks the number matching primary_phone_number_id", () => {
    const data: ClerkUserEventData = {
      id: "user_1",
      phone_numbers: [
        { id: "idn_1", phone_number: "+910000000000" },
        { id: "idn_2", phone_number: "+919876543210" },
      ],
      primary_phone_number_id: "idn_2",
    };
    assert.equal(extractPrimaryPhone(data), "+919876543210");
  });

  it("returns null when there are no phone numbers (Clerk signup without a phone)", () => {
    assert.equal(extractPrimaryPhone({ id: "user_1" }), null);
  });
});
