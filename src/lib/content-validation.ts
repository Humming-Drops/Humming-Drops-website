/**
 * Template-driven CMS field validation.
 *
 * A content template's `schema` column (jsonb) is a `ContentTemplateSchema`.
 * Content page `data` (jsonb) must validate against its template's schema
 * before it can be saved as a draft or published.
 */

export type ContentFieldType =
  | "text"
  | "richtext"
  | "url"
  | "image_url"
  | "number"
  | "boolean";

export interface ContentFieldDefinition {
  key: string;
  label: string;
  type: ContentFieldType;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
}

export interface ContentTemplateSchema {
  fields: ContentFieldDefinition[];
}

export interface ContentValidationError {
  field: string;
  message: string;
}

const URL_PATTERN = /^https?:\/\/[^\s]+$/i;

export function isContentTemplateSchema(value: unknown): value is ContentTemplateSchema {
  if (!value || typeof value !== "object") return false;
  const fields = (value as { fields?: unknown }).fields;
  if (!Array.isArray(fields)) return false;
  return fields.every(
    (f) =>
      f &&
      typeof f === "object" &&
      typeof (f as ContentFieldDefinition).key === "string" &&
      typeof (f as ContentFieldDefinition).label === "string" &&
      typeof (f as ContentFieldDefinition).type === "string"
  );
}

/**
 * Validates a content page's `data` object against its template's field
 * schema. Returns an empty array when the data is valid.
 */
export function validateContentData(
  schema: ContentTemplateSchema,
  data: Record<string, unknown>
): ContentValidationError[] {
  const errors: ContentValidationError[] = [];

  if (!data || typeof data !== "object") {
    return [{ field: "_root", message: "Content data must be an object." }];
  }

  for (const field of schema.fields) {
    const value = data[field.key];
    const isEmpty = value === undefined || value === null || value === "";

    if (field.required && isEmpty) {
      errors.push({ field: field.key, message: `${field.label} is required.` });
      continue;
    }

    if (isEmpty) continue;

    switch (field.type) {
      case "text":
      case "richtext":
        if (typeof value !== "string") {
          errors.push({ field: field.key, message: `${field.label} must be text.` });
        } else if (field.maxLength && value.length > field.maxLength) {
          errors.push({
            field: field.key,
            message: `${field.label} must be ${field.maxLength} characters or fewer.`,
          });
        }
        break;
      case "url":
      case "image_url":
        if (typeof value !== "string" || !URL_PATTERN.test(value)) {
          errors.push({ field: field.key, message: `${field.label} must be a valid http(s) URL.` });
        }
        break;
      case "number":
        if (typeof value !== "number" || Number.isNaN(value)) {
          errors.push({ field: field.key, message: `${field.label} must be a number.` });
        }
        break;
      case "boolean":
        if (typeof value !== "boolean") {
          errors.push({ field: field.key, message: `${field.label} must be true or false.` });
        }
        break;
      default:
        errors.push({ field: field.key, message: `${field.label} has an unknown field type.` });
    }
  }

  // Reject unknown keys outright so drafts can't silently accumulate
  // fields that fall outside the approved template contract.
  const allowedKeys = new Set(schema.fields.map((f) => f.key));
  for (const key of Object.keys(data)) {
    if (!allowedKeys.has(key)) {
      errors.push({ field: key, message: `"${key}" is not a field on this template.` });
    }
  }

  return errors;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidContentSlug(slug: string): boolean {
  return typeof slug === "string" && slug.length >= 3 && slug.length <= 80 && SLUG_PATTERN.test(slug);
}
