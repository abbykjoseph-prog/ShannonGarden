import type { Metadata } from "next";
import Image from "next/image";
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
      <PageIntro title={<>Bringing the craft of horticulture <em className="text-green">back into city life.</em></>}>
        <p>
          I&apos;m {site.person}. I design, plant and look after gardens across the Greater Toronto Area, and I do every
          part of it myself.
        </p>
      </PageIntro>

      <section className="wrap grid gap-x-16 gap-y-14 pb-20 md:grid-cols-12 md:pb-28">
        {/* PLACEHOLDER - swap for a real photo of Shannon (e.g. /public/shannon.jpg with next/image). */}
        <figure className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <div className="bg-paper p-3 shadow-[0_1px_0_rgb(30_42_31/0.15)] ring-1 ring-loam/10 sm:p-4">
            <div className="relative flex aspect-[4/5] flex-col items-center justify-center gap-4 border border-loam/15 bg-limestone-deep text-center">
              <Image src="/monogram.png" alt="" width={600} height={600} className="h-24 w-auto opacity-25" />
              <span className="font-display text-[1.4rem] italic text-loam/70">Portrait of Shannon</span>
              <span className="text-[0.88rem] text-loam/50">Photo to come</span>
            </div>
          </div>
          <figcaption className="mt-3 text-[0.95rem] text-loam/65">
            {site.education}. {site.yearsExperience} years in Toronto gardens.
          </figcaption>
        </figure>

        <div className="space-y-14 md:col-span-7">
          <div>
            <h2 className="text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">Trained in the science, grown in the soil</h2>
            <div className="mt-4 max-w-prose space-y-4 text-loam/80">
              <p>
                I studied horticulture formally ({site.education}): plant science, soils, propagation, pests and
                diseases, and design. That training is behind everything I do. When I recommend a plant or a pruning cut,
                there&apos;s a reason for it, and I&apos;m happy to explain it.
              </p>
              <p>
                I&apos;ve spent {site.yearsExperience} years since then putting it into practice in real Toronto gardens.
                Heavy clay, dry shade under old maples, boulevards burned by road salt, balconies twenty storeys up. Each
                one taught me something the textbooks didn&apos;t.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">Why city gardens</h2>
            <div className="mt-4 max-w-prose space-y-4 text-loam/80">
              <p>
                Most of us live in the city, and it&apos;s where nature most needs a foothold. A well-planted front yard
                cools the sidewalk, soaks up rain, feeds bees and birds, and makes a street feel looked after. A balcony
                of herbs changes how you cook and how it feels to come home.
              </p>
              <p>
                Somewhere along the way, city gardening turned into something you buy once and replace. I want to bring
                back the craft of it: knowing your soil, choosing plants that belong, and caring for a garden over years
                so it gets better instead of tired.
              </p>
            </div>
          </div>

          <blockquote className="border-l-[3px] border-coneflower py-1 pl-6">
            <p className="font-display text-[1.9rem] italic leading-[1.2] text-loam sm:text-[2.3rem]">
              The person who walks your garden on the first visit is the person who plants it and comes back to tend it.
            </p>
            <p className="mt-4 max-w-prose text-loam/75">
              There&apos;s no sales team and no rotating crew. I know your garden because I planted it, and I notice when
              something&apos;s not right.
            </p>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="principles" className="bg-paper">
        <div className="wrap grid gap-x-16 gap-y-10 py-20 md:grid-cols-12 md:py-24">
          <h2 id="principles" className="text-[2.4rem] leading-[1.05] sm:text-5xl md:col-span-4">What you can count on</h2>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 md:col-span-8">
            {principles.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-[1.5rem] leading-tight">{p.title}</dt>
                <dd className="mt-2 text-loam/75">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand title="Want to talk about your garden?" />
    </>
  );
}
