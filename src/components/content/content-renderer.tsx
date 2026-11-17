interface ContentRendererProps {
  templateSlug: string;
  data: Record<string, unknown>;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Renders a published (or previewed) content page's data according to its
 * template. New templates fall back to a generic field list so an
 * unrecognized template slug never breaks rendering.
 */
export function ContentRenderer({ templateSlug, data }: ContentRendererProps) {
  if (templateSlug === "announcement-banner") {
    return (
      <div className="rounded-3xl border border-line-subtle bg-surface p-6 sm:p-8 space-y-3">
        <h1 className="font-display text-2xl font-extrabold text-content-primary">{text(data.headline)}</h1>
        <p className="text-sm text-content-secondary whitespace-pre-wrap">{text(data.body)}</p>
        {Boolean(data.ctaUrl) && (
          <a
            href={text(data.ctaUrl)}
            className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            {text(data.ctaLabel) || "Learn more"}
          </a>
        )}
      </div>
    );
  }

  if (templateSlug === "simple-page") {
    return (
      <article className="mx-auto max-w-reading space-y-4 py-8">
        <h1 className="font-display text-3xl font-extrabold text-content-primary">{text(data.heading)}</h1>
        {Boolean(data.imageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={text(data.imageUrl)}
            alt={text(data.heading) || "Content page visual"}
            className="w-full rounded-2xl"
          />
        )}
        <p className="text-sm text-content-secondary whitespace-pre-wrap leading-relaxed">{text(data.body)}</p>
      </article>
    );
  }

  return (
    <dl className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-content-secondary">{key}</dt>
          <dd className="text-sm text-content-primary whitespace-pre-wrap">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
