"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContentFieldEditor } from "@/components/content/content-field-editor";
import { ContentRenderer } from "@/components/content/content-renderer";
import type { ContentTemplateSchema } from "@/lib/content-validation";

interface PageState {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  data: Record<string, unknown>;
}

interface TemplateState {
  slug: string;
  name: string;
  schema: ContentTemplateSchema;
}

interface AuditLogEntry {
  id: string;
  action: string;
  createdAt: string;
}

export default function EditContentPage() {
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState<PageState | null>(null);
  const [template, setTemplate] = useState<TemplateState | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [title, setTitle] = useState("");
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/content/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to load page.");
        return res.json();
      })
      .then((json) => {
        setPage(json.page);
        setTemplate(json.template);
        setAuditLogs(json.auditLogs ?? []);
        setTitle(json.page.title);
        setData(json.page.data ?? {});
      })
      .catch((err) => setLoadError(err.message));
  }, [params.id]);

  const saveDraft = async () => {
    setActionError(null);
    setFieldErrors({});
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (Array.isArray(json.details)) {
          const errs: Record<string, string> = {};
          for (const d of json.details) errs[d.field] = d.message;
          setFieldErrors(errs);
        }
        setActionError(json.error || "Failed to save draft.");
        return;
      }
      setPage(json.page);
    } catch {
      setActionError("Network error saving the draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async () => {
    if (!page) return;
    setActionError(null);
    setIsPublishing(true);
    const action = page.status === "published" ? "unpublish" : "publish";
    try {
      const res = await fetch(`/api/admin/content/${params.id}/${action}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || `Failed to ${action} page.`);
        return;
      }
      setPage(json.page);
    } catch {
      setActionError(`Network error trying to ${action} the page.`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loadError) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>;
  }
  if (!page || !template) {
    return <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">Loading…</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-content-secondary">{template.name}</p>
          <h2 className="font-display text-2xl font-extrabold text-content-primary">{page.title}</h2>
          <p className="font-mono text-xs text-content-secondary">/content/{page.slug}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            page.status === "published"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-surface-muted text-content-secondary border-line-subtle"
          }`}
        >
          {page.status}
        </span>
      </div>

      {actionError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{actionError}</div>}

      <div className="flex gap-3 border-b border-line-subtle pb-2 text-xs font-semibold" role="tablist" aria-label="Page editor view">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "edit"}
          onClick={() => setMode("edit")}
          className={`rounded px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${
            mode === "edit" ? "text-brand-primary" : "text-content-secondary hover:text-content-primary"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "preview"}
          onClick={() => setMode("preview")}
          className={`rounded px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${
            mode === "preview" ? "text-brand-primary" : "text-content-secondary hover:text-content-primary"
          }`}
        >
          Preview
        </button>
      </div>

      {mode === "preview" ? (
        <div className="rounded-2xl border border-line-subtle bg-canvas p-6">
          <ContentRenderer templateSlug={template.slug} data={data} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="content-edit-title" className="text-xs font-semibold text-content-secondary">
              Title
            </label>
            <input
              id="content-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-line-subtle bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
            {fieldErrors.title && <p className="text-[11px] text-red-600">{fieldErrors.title}</p>}
          </div>

          <ContentFieldEditor
            fields={template.schema.fields}
            data={data}
            onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
            fieldErrors={fieldErrors}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving}
              className="rounded-full bg-brand-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-primary-hover transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {isSaving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={togglePublish}
              disabled={isPublishing}
              className="rounded-full border border-line-subtle px-5 py-2.5 text-xs font-semibold text-content-primary hover:bg-surface-muted transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-2"
            >
              {isPublishing ? "Working…" : page.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line-subtle bg-surface p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-content-secondary">Audit trail</h3>
        {auditLogs.length === 0 ? (
          <p className="mt-2 text-xs text-content-secondary">No changes recorded yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs text-content-secondary">
            {auditLogs.map((log) => (
              <li key={log.id}>
                {log.action} — {new Date(log.createdAt).toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
