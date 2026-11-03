"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentFieldEditor } from "@/components/content/content-field-editor";
import type { ContentTemplateSchema } from "@/lib/content-validation";

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
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>;
  }

  if (!templates) {
    return <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">Loading templates…</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        No content templates are available yet.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-content-secondary">Template-driven CMS</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">New page</h2>
      </div>

      {formError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{formError}</div>}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-content-secondary">Template</label>
        <select
          value={templateId}
          onChange={(e) => {
            setTemplateId(e.target.value);
            setData({});
          }}
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {selectedTemplate && <p className="text-[11px] text-content-secondary">{selectedTemplate.description}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-content-secondary">
          URL slug <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          placeholder="e.g. monsoon-delivery-update"
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-mono"
        />
        <p className="text-[11px] text-content-secondary">
          Lowercase letters, numbers, and hyphens only. Published at /content/{slug || "<slug>"}
        </p>
        {fieldErrors.slug && <p className="text-[11px] text-red-600">{fieldErrors.slug}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-content-secondary">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
        />
        {fieldErrors.title && <p className="text-[11px] text-red-600">{fieldErrors.title}</p>}
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
        className="rounded-full bg-brand-primary px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
