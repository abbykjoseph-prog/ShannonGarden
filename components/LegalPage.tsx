import { site } from "@/lib/site";

// Shared layout for the privacy policy and terms: a readable single column.
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="wrap pb-24 pt-14 md:pt-20">
      <h1 className="text-[2.9rem] leading-[1] sm:text-6xl">{title}</h1>
      <p className="mt-4 text-ink/65">Last updated: {site.legalUpdated}</p>
      <div className="mt-10 max-w-prose space-y-5 text-ink/85 [&_h2]:mt-12 [&_h2]:text-[1.8rem] [&_h2]:leading-tight [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </article>
  );
}
