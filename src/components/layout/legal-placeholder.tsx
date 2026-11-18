import Link from "next/link";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

interface LegalPlaceholderProps {
  title: string;
  topics: string[];
}

/**
 * Shared shell for legal pages whose wording must come from the client / legal counsel.
 * No legal text is invented here (CLAUDE.md §2).
 */
export function LegalPlaceholder({ title, topics }: LegalPlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-content-primary tracking-tight">{title}</h1>

      <div role="note" className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-950 space-y-2">
        <p className="font-bold">PLACEHOLDER — CLIENT CONTENT REQUIRED</p>
        <p>
          The official {title.toLowerCase()} has not been supplied yet. It must be provided or approved by Humming Drops
          and its legal advisor before launch. This is especially important for how health information from the
          MedCity Smiles program is collected and used.
        </p>
      </div>

      <section aria-labelledby="legal-topics" className="space-y-2">
        <h2 id="legal-topics" className="font-display text-lg font-bold text-content-primary">
          Topics this page must cover
        </h2>
        <ul className="list-disc pl-5 text-sm text-content-secondary space-y-1">
          {topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-content-secondary">
        Questions in the meantime? Email{" "}
        <a className="font-semibold text-brand-primary underline" href={`mailto:${OFFICIAL_CONTACT.email}`}>
          {OFFICIAL_CONTACT.email}
        </a>{" "}
        or call{" "}
        <a className="font-semibold text-brand-primary underline" href={`tel:+91${OFFICIAL_CONTACT.phone}`}>
          +91 {OFFICIAL_CONTACT.phone}
        </a>
        .
      </p>

      <Link href="/" className="inline-block text-sm font-semibold text-brand-primary hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
