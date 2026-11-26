import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { isUniqueViolation, violatedConstraint } from "../../src/lib/db/errors";
import { telLink, whatsappLink } from "../../src/lib/whatsapp";
import { auditEntrySummary, humanizeAuditAction, NOISY_AUDIT_ACTIONS } from "../../src/lib/audit-format";

describe("db error helpers", () => {
  it("detects a bare postgres unique violation", () => {
    assert.equal(isUniqueViolation({ code: "23505", constraint_name: "users_phone_unique" }), true);
    assert.equal(violatedConstraint({ code: "23505", constraint_name: "users_phone_unique" }), "users_phone_unique");
  });

  it("detects a unique violation wrapped by drizzle (on .cause)", () => {
    const wrapped = Object.assign(new Error("Failed query: insert into users ..."), {
      cause: { code: "23505", constraint_name: "content_pages_slug_unique" },
    });
    assert.equal(isUniqueViolation(wrapped), true);
    assert.equal(violatedConstraint(wrapped), "content_pages_slug_unique");
  });

  it("ignores other errors", () => {
    assert.equal(isUniqueViolation(new Error("boom")), false);
    assert.equal(isUniqueViolation({ code: "23503" }), false);
    assert.equal(isUniqueViolation(null), false);
    assert.equal(violatedConstraint(new Error("x")), "");
  });
});

describe("whatsapp / tel links", () => {
  it("adds the 91 country code to a 10-digit number", () => {
    assert.equal(whatsappLink("8618902810"), "https://wa.me/918618902810");
    assert.equal(whatsappLink("+91 86189 02810"), "https://wa.me/918618902810");
    assert.equal(telLink("8618902810"), "tel:+918618902810");
  });

  it("returns null for missing or malformed numbers", () => {
    assert.equal(whatsappLink(""), null);
    assert.equal(whatsappLink(null), null);
    assert.equal(whatsappLink("12345"), null);
    assert.equal(telLink(undefined), null);
  });
});

describe("audit entry summaries", () => {
  it("names the content page that changed", () => {
    assert.equal(
      auditEntrySummary("content_page", { snapshot: { title: "Monsoon update", slug: "monsoon-update" } }),
      "Monsoon update (/content/monsoon-update)"
    );
    assert.equal(auditEntrySummary("content_page", { snapshot: { title: "Only title" } }), "Only title");
  });

  it("names the subscription reference and status change", () => {
    assert.equal(
      auditEntrySummary("user_subscription", {
        reference: "HD-REG-2026-12345",
        previousStatus: "pending_confirmation",
        newStatus: "confirmed_active",
      }),
      "HD-REG-2026-12345 · pending confirmation → confirmed active"
    );
  });

  it("returns null when there is nothing useful", () => {
    assert.equal(auditEntrySummary("content_page", null), null);
    assert.equal(auditEntrySummary("user_role", { roleId: "x" }), null);
  });

  it("labels subscription actions and hides noisy self-views by default", () => {
    assert.equal(humanizeAuditAction("subscription.cancelled"), "Subscription cancelled");
    assert.ok(NOISY_AUDIT_ACTIONS.includes("health.self_access_read"));
  });
});
