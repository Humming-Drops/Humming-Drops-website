"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentFieldEditor } from "@/components/content/content-field-editor";
import { isValidContentSlug, validateContentData, type ContentTemplateSchema } from "@/lib/content-validation";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  adminButton,
  adminErrorText,
  adminHelpText,
  adminInput,
  adminLabel,
} from "@/components/admin/admin-ui";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

interface TemplateOption {
  id: string;
  slug: string;
  name: string;
  description: string;
  schema: ContentTemplateSchema;
}

export default function NewContentPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateOption[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [data, setData] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const formErrorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formError) formErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formError]);

  useEffect(() => {
    fetch("/api/admin/content/templates")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to load templates.");
        return res.json();
      })
      .then((json) => {
        setTemplates(json.templates);
        if (json.templates?.length > 0) setTemplateId(json.templates[0].id);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  const selectedTemplate = templates?.find((t) => t.id === templateId) ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const local: Record<string, string> = {};
    if (!title.trim()) local.title = "Enter a title.";
    if (!isValidContentSlug(slug)) {
      local.slug = "Use 3-80 characters: lowercase letters, numbers and single hyphens (e.g. monsoon-update).";
    }
    if (selectedTemplate) {
      for (const err of validateContentData(selectedTemplate.schema, data)) {
        if (err.field !== "_root") local[err.field] = err.message;
      }
    }
    if (Object.keys(local).length > 0) {
      setFieldErrors(local);
      const firstKey = Object.keys(local)[0];
      const first =
        firstKey === "title" ? "content-title" : firstKey === "slug" ? "content-slug" : fieldDomId(firstKey);
      requestAnimationFrame(() => document.getElementById(first)?.focus());
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, slug, title, data }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (Array.isArray(json.details)) {
          const errs: Record<string, string> = {};
          for (const d of json.details) errs[d.field] = d.message;
          setFieldErrors(errs);
        }
        setFormError(json.error || "Failed to create page.");
        if (Array.isArray(json.details) && json.details.some((d: { field: string }) => d.field === "slug")) {
          requestAnimationFrame(() => document.getElementById("content-slug")?.focus());
        }
        setIsSubmitting(false);
        return;
      }

      // Keep the button disabled until navigation finishes, so a slow route
      // load can't invite a second, duplicate submit.
      setCreatedId(json.page.id);
      router.push(`/admin/content/${json.page.id}`);
    } catch {
      setFormError("Network error creating the page.");
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return <AdminNotice tone="error">{loadError}</AdminNotice>;
  }

  if (!templates) {
    return <AdminLoadingState label="Loading templates" />;
  }

  if (templates.length === 0) {
    return (
      <AdminNotice>No content templates are available yet.</AdminNotice>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <AdminPageHeader eyebrow="Template-driven CMS" title="New page" />

      {formError && (
        <div ref={formErrorRef}>
          <AdminNotice tone="error">{formError}</AdminNotice>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="content-template" className={adminLabel}>
          Template
        </label>
        <select
          id="content-template"
          value={templateId}
          onChange={(e) => {
            const next = templates.find((t) => t.id === e.target.value);
            setTemplateId(e.target.value);
            // Keep values for fields the new template also has (e.g. Body).
            const keep = new Set(next?.schema.fields.map((f) => f.key) ?? []);
            setData((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => keep.has(k))));
            setFieldErrors({});
          }}
          className={adminInput}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {selectedTemplate && <p className={adminHelpText}>{selectedTemplate.description}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="content-title" className={adminLabel}>
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="content-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFormError(null);
            if (!slugTouched) {
              const next = slugify(e.target.value);
              setSlug(next);
              if (isValidContentSlug(next)) setFieldErrors(({ slug: _slug, ...rest }) => rest);
            }
            if (e.target.value.trim()) setFieldErrors(({ title: _title, ...rest }) => rest);
          }}
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "content-title-error" : undefined}
          className={adminInput}
        />
        {fieldErrors.title && (
          <p id="content-title-error" role="alert" className={adminErrorText}>
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="content-slug" className={adminLabel}>
          URL slug <span className="text-red-600">*</span>
        </label>
        <input
          id="content-slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setFormError(null);
            setSlug(e.target.value.toLowerCase());
            if (isValidContentSlug(e.target.value.toLowerCase())) setFieldErrors(({ slug: _slug, ...rest }) => rest);
          }}
          aria-invalid={fieldErrors.slug ? true : undefined}
          aria-describedby={fieldErrors.slug ? "content-slug-help content-slug-error" : "content-slug-help"}
          placeholder="e.g. monsoon-delivery-update"
          className={`${adminInput} font-mono`}
        />
        <p id="content-slug-help" className={adminHelpText}>
          Filled in from the title. Lowercase letters, numbers and hyphens only; it cannot be changed after the page is created.
          {isValidContentSlug(slug) ? ` Published at /content/${slug}` : ""}
        </p>
        {fieldErrors.slug && (
          <p id="content-slug-error" role="alert" className={adminErrorText}>
            {fieldErrors.slug}
          </p>
        )}
      </div>

      {selectedTemplate && (
        <ContentFieldEditor
          fields={selectedTemplate.schema.fields}
          data={data}
          onChange={(key, value) => {
            setData((prev) => ({ ...prev, [key]: value }));
            setFieldErrors(({ [key]: _cleared, ...rest }) => rest);
          }}
          fieldErrors={fieldErrors}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || createdId !== null}
          className={adminButton("primary")}
        >
          {createdId ? "Opening editor…" : isSubmitting ? "Saving…" : "Save draft"}
        </button>
        <Link href="/admin/content" className={adminButton("secondary")}>
          Cancel
        </Link>
        {createdId ? (
          <p role="status" className={adminHelpText}>
            Saved as a draft.{" "}
            <Link href={`/admin/content/${createdId}`} className="font-semibold text-brand-primary underline">
              Open the editor
            </Link>{" "}
            if it doesn&apos;t open by itself.
          </p>
        ) : (
          <p className={adminHelpText}>New pages are saved as drafts. Nothing is public until you publish.</p>
        )}
      </div>
    </form>
  );
}

/** DOM id ContentFieldEditor gives each template field. */
function fieldDomId(key: string): string {
  return `content-field-${key}`;
}
