"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContentFieldEditor } from "@/components/content/content-field-editor";
import { ContentRenderer } from "@/components/content/content-renderer";
import type { ContentTemplateSchema } from "@/lib/content-validation";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  AdminSectionHeading,
  adminButton,
  adminCard,
  adminErrorText,
  adminInput,
  adminLabel,
} from "@/components/admin/admin-ui";

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
  actorEmail?: string | null;
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

  const refreshAuditLogs = async () => {
    try {
      const res = await fetch(`/api/admin/content/${params.id}`);
      if (!res.ok) return;
      const json = await res.json();
      setAuditLogs(json.auditLogs ?? []);
    } catch {
      // The audit trail is informational; a failed refresh must not break the save.
    }
  };

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
      void refreshAuditLogs();
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
      void refreshAuditLogs();
    } catch {
      setActionError(`Network error trying to ${action} the page.`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loadError) {
    return <AdminNotice tone="error">{loadError}</AdminNotice>;
  }
  if (!page || !template) {
    return <AdminLoadingState label="Loading page" />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <AdminPageHeader
        eyebrow={template.name}
        title={<span className="break-words">{page.title}</span>}
        description={<p className="break-all font-mono text-xs">/content/{page.slug}</p>}
        actions={<StatusBadge status={page.status} />}
      />

      {actionError && <AdminNotice tone="error">{actionError}</AdminNotice>}

      <div className="flex gap-1 border-b border-line-subtle text-sm font-semibold" role="tablist" aria-label="Page editor view">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "edit"}
          onClick={() => setMode("edit")}
          className={`-mb-px min-h-[40px] rounded-t-lg border-b-2 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            mode === "edit"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-content-secondary hover:text-content-primary"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "preview"}
          onClick={() => setMode("preview")}
          className={`-mb-px min-h-[40px] rounded-t-lg border-b-2 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            mode === "preview"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-content-secondary hover:text-content-primary"
          }`}
        >
          Preview
        </button>
      </div>

      {mode === "preview" ? (
        <div className="rounded-2xl border border-line-subtle bg-canvas p-4 sm:p-6">
          <ContentRenderer templateSlug={template.slug} data={data} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="content-edit-title" className={adminLabel}>
              Title
            </label>
            <input
              id="content-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={adminInput}
            />
            {fieldErrors.title && <p className={adminErrorText}>{fieldErrors.title}</p>}
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
              className={adminButton("primary")}
            >
              {isSaving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={togglePublish}
              disabled={isPublishing}
              className={adminButton("secondary")}
            >
              {isPublishing ? "Working…" : page.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      )}

      <div className={`${adminCard} p-4 sm:p-5`}>
        <AdminSectionHeading>Audit trail</AdminSectionHeading>
        {auditLogs.length === 0 ? (
          <p className="mt-2 text-xs text-content-secondary">No changes recorded yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs text-content-secondary">
            {auditLogs.map((log) => (
              <li key={log.id}>
                {log.action} by {log.actorEmail ?? "system"} — {new Date(log.createdAt).toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
