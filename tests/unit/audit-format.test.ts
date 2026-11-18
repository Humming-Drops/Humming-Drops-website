import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  auditKindPrefix,
  auditResourceHref,
  humanizeAuditAction,
  parseAuditKind,
  parsePageNumber,
} from "../../src/lib/audit-format";

describe("audit-format", () => {
  it("humanizes known and unknown actions", () => {
    assert.equal(humanizeAuditAction("staff.role_assigned"), "Staff role assigned");
    assert.equal(humanizeAuditAction("content.published"), "Content page published");
    assert.equal(humanizeAuditAction("something.new_thing"), "Something new thing");
    assert.equal(humanizeAuditAction(""), "Unknown action");
  });

  it("links resources to admin pages", () => {
    assert.equal(auditResourceHref("content_page", "abc"), "/admin/content/abc");
    assert.equal(auditResourceHref("user_subscription", "x"), "/admin/subscriptions");
    assert.equal(auditResourceHref("user_role", "x"), "/admin/staff");
    assert.equal(auditResourceHref("profile", "x"), null);
    assert.equal(auditResourceHref(null, null), null);
  });

  it("parses filters and page numbers defensively", () => {
    assert.equal(parseAuditKind("staff"), "staff");
    assert.equal(parseAuditKind("'; drop table"), "all");
    assert.equal(auditKindPrefix("health"), "health.");
    assert.equal(auditKindPrefix("all"), null);
    assert.equal(parsePageNumber("3"), 3);
    assert.equal(parsePageNumber("-1"), 1);
    assert.equal(parsePageNumber("abc"), 1);
    assert.equal(parsePageNumber(undefined), 1);
  });
});
