"use client";

import type { ContentFieldDefinition } from "@/lib/content-validation";

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

        return (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-semibold text-content-secondary">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </label>

            {field.type === "richtext" ? (
              <textarea
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                rows={5}
                maxLength={field.maxLength}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            ) : field.type === "boolean" ? (
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(field.key, e.target.checked)}
                className="h-4 w-4"
              />
            ) : field.type === "number" ? (
              <input
                type="number"
                value={typeof value === "number" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            ) : (
              <input
                type="text"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                maxLength={field.maxLength}
                placeholder={field.type === "url" || field.type === "image_url" ? "https://" : undefined}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            )}

            {field.helpText && !error && <p className="text-[11px] text-content-secondary">{field.helpText}</p>}
            {error && <p className="text-[11px] text-red-600">{error}</p>}
          </div>
        );
      })}
    </div>
  );
}
