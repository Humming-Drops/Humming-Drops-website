import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { hasPermission } from "@/lib/auth/server";
import { listContentPages } from "@/lib/content-storage";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import {
  AdminPageHeader,
  adminButton,
  adminInput,
  adminLabel,
  adminTable,
} from "@/components/admin/admin-ui";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const canWrite = await hasPermission("content:write");

  if (!canWrite) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to manage website content.
      </div>
    );
  }

  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase().slice(0, 80);
  const status = ["draft", "published", "archived"].includes(params.status ?? "") ? (params.status as string) : "";
  const allRows = await listContentPages();
  const rows = allRows.filter(
    ({ page }) =>
      (!status || page.status === status) &&
      (!q || page.title.toLowerCase().includes(q) || page.slug.toLowerCase().includes(q))
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Template-driven CMS"
        title="Website content"
        actions={
          <Link href="/admin/content/new" className={adminButton("primary")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New page
          </Link>
        }
      />

      <form method="get" className="flex flex-wrap items-end gap-3">
        <div className="w-full space-y-1.5 sm:w-56">
          <label htmlFor="content-search" className={adminLabel}>
            Search title or slug
          </label>
          <input id="content-search" name="q" type="search" defaultValue={params.q ?? ""} className={adminInput} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 sm:w-40 sm:flex-none">
          <label htmlFor="content-status" className={adminLabel}>
            Status
          </label>
          <select id="content-status" name="status" defaultValue={status} className={adminInput}>
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button type="submit" className={adminButton("secondary")}>
          Apply
        </button>
      </form>

      <div tabIndex={0} role="region" aria-label="Content pages table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Title</th>
              <th className={adminTable.th}>Slug</th>
              <th className={adminTable.th}>Template</th>
              <th className={adminTable.th}>Status</th>
              <th className={adminTable.th}>Updated</th>
              <th className={adminTable.th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ page, templateName }) => (
              <tr key={page.id} className={adminTable.row}>
                <td className={`${adminTable.td} font-medium text-content-primary`}>{page.title}</td>
                <td className={`${adminTable.mono} text-content-secondary`}>/content/{page.slug}</td>
                <td className={adminTable.td}>{templateName}</td>
                <td className={adminTable.td}>
                  <StatusBadge status={page.status} />
                </td>
                <td className={`${adminTable.td} text-content-secondary`}>
                  {new Date(page.updatedAt).toLocaleDateString("en-IN")}
                </td>
                <td className={`${adminTable.td} text-right`}>
                  <Link
                    href={`/admin/content/${page.id}`}
                    className={adminButton("secondary", "sm")}
                    aria-label={`Edit ${page.title}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <EmptyTableState
            title={allRows.length === 0 ? "No content pages yet" : "No pages match your filter"}
            description={allRows.length === 0 ? "Create your first page from a template to get started." : "Try a different search or status."}
          />
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Admin Content",
};
