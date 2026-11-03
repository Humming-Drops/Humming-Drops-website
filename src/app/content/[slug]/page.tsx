import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedPageBySlug } from "@/lib/content-storage";
import { ContentRenderer } from "@/components/content/content-renderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPublishedPageBySlug(slug);
  return { title: row ? `${row.page.title} — Humming Drops` : "Page not found" };
}

export default async function PublicContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getPublishedPageBySlug(slug);

  if (!row) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <ContentRenderer templateSlug={row.template.slug} data={row.page.data as Record<string, unknown>} />
    </div>
  );
}
