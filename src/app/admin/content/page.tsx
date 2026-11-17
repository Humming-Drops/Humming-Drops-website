import Link from "next/link";
import { hasPermission } from "@/lib/clerk-auth";
import { listContentPages } from "@/lib/content-storage";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";

export default async function AdminContentPage() {
  const canWrite = await hasPermission("content:write");

  if (!canWrite) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to manage website content.
      </div>
    );
  }

  const rows = await listContentPages();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-content-secondary">Template-driven CMS</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">Website content</h2>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex items-center min-h-[38px] rounded-full bg-brand-primary hover:bg-brand-hover px-4 py-2 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
        >
          New page
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle bg-muted/40 text-xs font-semibold text-content-secondary">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ page, templateName }) => (
              <tr key={page.id} className="border-b border-line-subtle last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-content-primary">{page.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-content-secondary">/content/{page.slug}</td>
                <td className="px-4 py-3">{templateName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={page.status} />
                </td>
                <td className="px-4 py-3 text-content-secondary whitespace-nowrap">
                  {new Date(page.updatedAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/content/${page.id}`}
                    className="text-xs font-semibold text-brand-primary hover:underline rounded px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
            title="No content pages yet"
            description="Create your first page from a template to get started."
          />
        )}
      </div>
    </div>
  );
}
