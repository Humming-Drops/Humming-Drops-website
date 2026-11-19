"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentFieldEditor } from "@/components/content/content-field-editor";
import { isValidContentSlug, type ContentTemplateSchema } from "@/lib/content-validation";
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
    if (Object.keys(local).length > 0) {
      setFieldErrors(local);
      const first = local.slug ? "content-slug" : "content-title";
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
      const json = await res.json();

      if (!res.ok) {
        if (Array.isArray(json.details)) {
          const errs: Record<string, string> = {};
          for (const d of json.details) errs[d.field] = d.message;
          setFieldErrors(errs);
        }
        setFormError(json.error || "Failed to create page.");
        return;
      }

      router.push(`/admin/content/${json.page.id}`);
    } catch {
      setFormError("Network error creating the page.");
    } finally {
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
            setTemplateId(e.target.value);
            setData({});
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
        <label htmlFor="content-slug" className={adminLabel}>
          URL slug <span className="text-red-600">*</span>
        </label>
        <input
          id="content-slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value.toLowerCase());
          }}
          aria-invalid={fieldErrors.slug ? true : undefined}
          aria-describedby={fieldErrors.slug ? "content-slug-help content-slug-error" : "content-slug-help"}
          placeholder="e.g. monsoon-delivery-update"
          className={`${adminInput} font-mono`}
        />
        <p id="content-slug-help" className={adminHelpText}>
          Lowercase letters, numbers, and hyphens only.
          {isValidContentSlug(slug) ? ` Published at /content/${slug}` : ""}
        </p>
        {fieldErrors.slug && (
          <p id="content-slug-error" role="alert" className={adminErrorText}>
            {fieldErrors.slug}
          </p>
        )}
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
            if (!slugTouched) setSlug(slugify(e.target.value));
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

      {selectedTemplate && (
        <ContentFieldEditor
          fields={selectedTemplate.schema.fields}
          data={data}
          onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
          fieldErrors={fieldErrors}
        />
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={adminButton("primary")}
      >
        {isSubmitting ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
