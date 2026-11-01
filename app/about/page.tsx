import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { CtaBand } from "@/components/CtaBand";
import { principles, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shannon",
  description: `Meet ${site.person}, a trained horticulturist with ${site.yearsExperience} years of experience offering garden design and care in Toronto and the GTA.`,
};

export default function About() {
  return (
    <>
      <PageIntro eyebrow="About" title={<>Bringing the craft of horticulture <em className="text-forest">back into city life.</em></>}>
        <p>
          I&apos;m {site.person}. I design, plant and look after gardens across the Greater Toronto Area, and I do every
          part of it myself.
        </p>
      </PageIntro>

      <section className="wrap grid gap-14 pb-20 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:pb-28">
        {/* Portrait placeholder: swap for a real photo of Shannon when available. */}
        <figure className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-forest/20 bg-sage-soft">
            <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-forest/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <svg aria-hidden viewBox="0 0 64 64" className="h-16 w-16 text-forest/40">
                <path d="M32 58V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M32 34c0-11-7-17-19-17 0 11 7 17 19 17Z" fill="currentColor" />
                <path d="M32 28c0-10 7-16 19-16 0 11-7 16-19 16Z" fill="currentColor" opacity=".7" />
              </svg>
              <span className="font-display text-xl italic text-forest-deep">Portrait of Shannon</span>
              <span className="text-xs uppercase tracking-[0.18em] text-ink/45">Photo coming soon</span>
            </div>
          </div>
          <figcaption className="mt-4 flex justify-between text-sm text-ink/60">
            <span>{site.education}</span>
            <span>{site.yearsExperience} years</span>
          </figcaption>
        </figure>

        <div className="space-y-12 text-lg leading-relaxed text-ink/80">
          <div>
            <h2 className="text-3xl sm:text-4xl">Trained in the science, grown in the soil</h2>
            <p className="mt-4">
              I studied horticulture formally ({site.education}), learning plant science, soil, propagation, pest and
              disease management and design. That training is the backbone of everything I do: when I recommend a plant
              or a pruning cut, there&apos;s a reason behind it.
            </p>
            <p className="mt-4">
              Since then I&apos;ve spent {site.yearsExperience} years putting it into practice in real Toronto gardens.
              Clay soils, deep shade under old maples, salt-burned boulevards, balconies twenty storeys up. Every one
              taught me something the textbooks didn&apos;t.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl">Why city gardens</h2>
            <p className="mt-4">
              Cities are where most of us live, and where nature most needs a foothold. A well-planted front yard cools
              the sidewalk, soaks up rain, feeds bees and birds, and makes a street feel cared for. A balcony full of
              herbs changes how you cook and how you feel coming home.
            </p>
            <p className="mt-4">
              Somewhere along the way, gardening in the city became something you buy once and replace. I want to bring
              back the craft of it: knowing your soil, choosing plants that belong, and caring for a garden over years
              so it gets better instead of tired.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-forest p-8 text-cream sm:p-10">
            <h2 className="text-3xl text-cream sm:text-4xl">One person, start to finish</h2>
            <p className="mt-4 text-cream/80">
              I&apos;m not a company with a sales team and a rotating crew. The person who walks your garden on the first
              visit is the person who draws the plan, sources the plants, puts them in the ground and comes back to tend
              them. I know your garden because I planted it.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles" className="border-t border-forest/10 bg-cream-warm/60">
        <div className="wrap py-20 md:py-28">
          <p className="eyebrow">Principles</p>
          <h2 id="principles" className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">What you can count on</h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="border-l-2 border-clay/60 pl-6">
                <dt className="font-display text-2xl text-forest-deep">{p.title}</dt>
                <dd className="mt-2 text-ink/75">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand title="Want to talk about your garden?" />
    </>
  );
}
