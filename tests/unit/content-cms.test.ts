import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  isContentTemplateSchema,
  isValidContentSlug,
  validateContentData,
  type ContentTemplateSchema,
} from "../../src/lib/content-validation";

const announcementSchema: ContentTemplateSchema = {
  fields: [
    { key: "headline", label: "Headline", type: "text", required: true, maxLength: 120 },
    { key: "body", label: "Body", type: "richtext", required: true, maxLength: 500 },
    { key: "ctaLabel", label: "CTA label", type: "text", required: false, maxLength: 40 },
    { key: "ctaUrl", label: "CTA link", type: "url", required: false },
  ],
};

describe("Content template schema shape", () => {
  it("recognizes a well-formed template schema", () => {
    assert.equal(isContentTemplateSchema(announcementSchema), true);
  });

  it("rejects malformed schemas", () => {
    assert.equal(isContentTemplateSchema(null), false);
    assert.equal(isContentTemplateSchema({}), false);
    assert.equal(isContentTemplateSchema({ fields: "nope" }), false);
    assert.equal(isContentTemplateSchema({ fields: [{ key: "x" }] }), false);
  });
});

describe("validateContentData", () => {
  it("accepts valid data with only required fields filled", () => {
    const errors = validateContentData(announcementSchema, {
      headline: "Delivery paused Monday",
      body: "Kitchen closed for maintenance; deliveries resume Tuesday.",
    });
    assert.deepEqual(errors, []);
  });

  it("flags missing required fields", () => {
    const errors = validateContentData(announcementSchema, { headline: "Only headline" });
    assert.ok(errors.some((e) => e.field === "body"));
  });

  it("flags fields exceeding maxLength", () => {
    const errors = validateContentData(announcementSchema, {
      headline: "x".repeat(200),
      body: "Valid body text.",
    });
    assert.ok(errors.some((e) => e.field === "headline"));
  });

  it("flags a malformed URL field", () => {
    const errors = validateContentData(announcementSchema, {
      headline: "Hi",
      body: "Body",
      ctaUrl: "not-a-url",
    });
    assert.ok(errors.some((e) => e.field === "ctaUrl"));
  });

  it("accepts a well-formed URL field", () => {
    const errors = validateContentData(announcementSchema, {
      headline: "Hi",
      body: "Body",
      ctaUrl: "https://hummingdrops.com/update",
    });
    assert.deepEqual(errors, []);
  });

  it("rejects keys that are not part of the template", () => {
    const errors = validateContentData(announcementSchema, {
      headline: "Hi",
      body: "Body",
      unapprovedField: "sneaky",
    });
    assert.ok(errors.some((e) => e.field === "unapprovedField"));
  });

  it("rejects a non-object data payload", () => {
    const errors = validateContentData(announcementSchema, null as unknown as Record<string, unknown>);
    assert.ok(errors.length > 0);
  });
});

describe("isValidContentSlug", () => {
  it("accepts lowercase hyphenated slugs", () => {
    assert.equal(isValidContentSlug("monsoon-delivery-update"), true);
  });

  it("rejects uppercase, spaces, and short slugs", () => {
    assert.equal(isValidContentSlug("Monsoon Update"), false);
    assert.equal(isValidContentSlug("ab"), false);
    assert.equal(isValidContentSlug(""), false);
  });
});
