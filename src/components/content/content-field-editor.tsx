"use client";

import type { ContentFieldDefinition } from "@/lib/content-validation";
import { adminErrorText, adminHelpText, adminInput, adminLabel } from "@/components/admin/admin-ui";

interface ContentFieldEditorProps {
  fields: ContentFieldDefinition[];
  data: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  fieldErrors: Record<string, string>;
}

/**
 * Renders one input per field in a content template's schema. Field
 * types map to the subset of input types validateContentData() checks
 * against in src/lib/content-validation.ts.
 */
export function ContentFieldEditor({ fields, data, onChange, fieldErrors }: ContentFieldEditorProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const value = data[field.key];
        const error = fieldErrors[field.key];
        const fieldId = `content-field-${field.key}`;
        const a11y = {
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${fieldId}-error` : field.helpText ? `${fieldId}-help` : undefined,
        } as const;

        return (
          <div key={field.key} className="space-y-1.5">
            <label htmlFor={fieldId} className={adminLabel}>
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </label>

            {field.type === "richtext" ? (
              <textarea
                id={fieldId}
                {...a11y}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                rows={5}
                maxLength={field.maxLength}
                className={adminInput}
              />
            ) : field.type === "boolean" ? (
              <div className="pt-0.5">
                <input
                  id={fieldId}
                  {...a11y}
                {...a11y}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="h-4 w-4 rounded border-line-subtle text-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            ) : field.type === "number" ? (
              <input
                id={fieldId}
                {...a11y}
                type="number"
                value={typeof value === "number" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value === "" ? undefined : Number(e.target.value))}
                className={adminInput}
              />
            ) : (
              <input
                id={fieldId}
                {...a11y}
                type="text"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                maxLength={field.maxLength}
                placeholder={field.type === "url" || field.type === "image_url" ? "https://" : undefined}
                className={adminInput}
              />
            )}

            {field.helpText && !error && <p id={`${fieldId}-help`} className={adminHelpText}>{field.helpText}</p>}
            {error && (
              <p id={`${fieldId}-error`} role="alert" className={adminErrorText}>
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
