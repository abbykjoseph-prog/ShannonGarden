import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a garden visit",
  description: `Book a garden visit with ${site.person} for garden design and care in Toronto and the GTA. Serving ${site.serviceArea.slice(0, 6).join(", ")} and more.`,
};

const steps = [
  { title: "You get in touch", body: `Tell me a little about your garden. I reply ${site.responseTime}.` },
  { title: "I visit", body: "We walk the garden together. I look at soil, light and drainage and listen to what you want from the space." },
  { title: "You get a plan and a quote", body: "A clear written proposal with what I'd do, when, and what it costs. No pressure." },
  { title: "I do the work", body: "Planting, care visits or coaching, all done by me. Same person, every time." },
];

export default function Contact() {
  return (
    <>
      <PageIntro eyebrow="Contact" title={<>Book a <em className="text-forest">garden visit.</em></>}>
        <p>
          The first step is a visit to your garden, anywhere in the Greater Toronto Area. Send a note below or call me
          directly.
        </p>
      </PageIntro>

      <section className="wrap grid gap-14 pb-24 md:grid-cols-[1.35fr_0.9fr] md:gap-16">
        <div className="rounded-[2rem] bg-sage-soft/70 p-6 ring-1 ring-forest/10 sm:p-10">
          <ContactForm />
        </div>

        <aside className="space-y-10">
          <div>
            <h2 className="text-2xl">Reach me directly</h2>
            <ul className="mt-4 space-y-2 text-lg">
              <li><a href={site.phoneHref} className="text-forest-deep underline decoration-forest/30 underline-offset-4 hover:decoration-forest">{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="text-forest-deep underline decoration-forest/30 underline-offset-4 hover:decoration-forest">{site.email}</a></li>
            </ul>
            <p className="mt-3 text-sm text-ink/60">{site.seasonNote}</p>
          </div>

          <div>
            <h2 className="text-2xl">Where I work</h2>
            <p className="mt-2 text-ink/70">Garden design and care in Toronto and the GTA, including:</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.serviceArea.map((a) => (
                <li key={a} className="rounded-full border border-forest/20 px-3 py-1 text-sm text-forest-deep">{a}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink/60">Not on the list? Ask anyway.</p>
          </div>

          <div>
            <h2 className="text-2xl">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-display text-xl italic text-clay">{i + 1}.</span>
                  <div>
                    <p className="font-semibold text-forest-deep">{s.title}</p>
                    <p className="text-[0.95rem] text-ink/70">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
