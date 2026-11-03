import Link from "next/link";
import { hasPermission } from "@/lib/clerk-auth";
import { listContentPages } from "@/lib/content-storage";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-stone-100 text-stone-700 border-stone-200",
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
  archived: "bg-stone-100 text-stone-500 border-stone-200",
};

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-content-secondary">Template-driven CMS</p>
          <h2 className="font-display text-3xl font-extrabold text-content-primary">Website content</h2>
        </div>
        <Link
          href="/admin/content/new"
          className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
        >
          New page
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle text-xs text-content-secondary">
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
              <tr key={page.id} className="border-b border-line-subtle last:border-0">
                <td className="px-4 py-3 font-medium text-content-primary">{page.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-content-secondary">/content/{page.slug}</td>
                <td className="px-4 py-3">{templateName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[page.status] ?? ""}`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-content-secondary">
                  {new Date(page.updatedAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/content/${page.id}`} className="text-xs font-semibold text-brand-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-sm text-content-secondary">
            No content pages yet. Create your first page from a template to get started.
          </p>
        )}
      </div>
    </div>
  );
}
