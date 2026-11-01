import type { Metadata } from "next";
import { DesignBed } from "@/components/DesignBed";
import { ContactForm } from "@/components/ContactForm";
import { PostalChecker } from "@/components/PostalChecker";
import { contactSteps, gtaRegions, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a garden visit",
  description: `Book a garden visit with ${site.ownerName} for garden design and care in Toronto and the GTA, including Durham, York, Peel and Halton.`,
};

export default function Contact() {
  return (
    <>
      <section className="wrap grid gap-x-12 gap-y-8 pb-20 pt-6 md:pt-8 lg:grid-cols-3 lg:gap-y-4 lg:pt-4">
        {/* Desktop: text in the left third, centred on the drawing (its bottom padding offsets the panel under it). */}
        <div className="lg:col-span-1 lg:row-start-1 lg:self-center lg:pb-[5.5rem]">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 text-[2.9rem] leading-[1] sm:text-6xl lg:text-[3.6rem]">
            Book a <em className="text-forest">garden visit.</em>
          </h1>
          <p className="mt-6 max-w-prose text-[1.15rem] text-ink/75">
            The first step is a visit to your garden. Send me a note below and I&apos;ll reply {site.responseTime} to find a
            time.
          </p>
        </div>

        {/* On phones the form comes first; on desktop the bed sits beside the heading. */}
        <div className="rounded-2xl bg-sage-soft/70 p-5 ring-1 ring-forest/10 sm:p-8 lg:col-span-2 lg:row-start-2 lg:p-6">
          <h2 className="mb-3 text-[1.6rem] leading-tight">Send me a note</h2>
          <ContactForm />
        </div>

        <div className="lg:col-span-2 lg:col-start-2 lg:row-start-1">
          <DesignBed />
        </div>

        <aside className="space-y-12 lg:col-span-1 lg:col-start-3 lg:row-start-2">
          <div>
            <h2 className="text-[1.9rem] leading-tight">Reach me directly</h2>
            <ul className="mt-3 space-y-1 text-[1.15rem]">
              <li>
                <a href={site.phoneHref} className="link">{site.phone}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link">{site.email}</a>
              </li>
            </ul>
            <p className="mt-3 text-[0.95rem] text-ink/65">{site.seasonNote}</p>
          </div>

          <div>
            <h2 className="text-[1.9rem] leading-tight">Do you come to my area?</h2>
            <p className="mt-2 max-w-prose text-ink/75">Most likely, if you&apos;re in Toronto or the 905 GTA. Check your postal code:</p>
            <div className="mt-4">
              <PostalChecker />
            </div>
            <dl className="mt-6 space-y-3 border-t border-ink/15 pt-5">
              {gtaRegions.map((r) => (
                <div key={r.name}>
                  <dt className="font-semibold">{r.name}</dt>
                  <dd className="text-[0.95rem] text-ink/65">{r.places}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      <section aria-labelledby="next" className="border-t border-ink/15">
        <div className="wrap py-16 md:py-24">
          <h2 id="next" className="text-[2.4rem] leading-[1.05] sm:text-5xl">What happens next</h2>
          <ol className="mt-10 grid gap-y-8 md:grid-cols-4">
            {contactSteps.map((s, i) => (
              <li key={s.title} className="relative grid grid-cols-[3rem_1fr] md:block md:pr-8">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-cream font-display text-xl">
                  {i + 1}
                </span>
                {i < contactSteps.length - 1 && (
                  <span aria-hidden className="absolute left-5 top-10 h-[calc(100%-1rem)] w-px bg-ink/25 md:left-10 md:top-5 md:h-px md:w-[calc(100%-2.5rem)]" />
                )}
                <div className="md:mt-5">
                  <h3 className="font-sans text-[1.08rem] font-semibold tracking-normal">{s.title}</h3>
                  <p className="mt-1.5 max-w-[34ch] text-ink/75">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
