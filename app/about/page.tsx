import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { CtaBand } from "@/components/CtaBand";
import { principles, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shannon",
  description: `Meet ${site.person}: a lifetime of growing things and ${site.yearsProfessional} years of garden work for clients, offering garden design and care in Toronto and the GTA.`,
};

const degree = `a double degree in ${site.education.firstField} and ${site.education.secondField}`;

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
            Growing things since childhood. {site.yearsProfessional} years gardening for clients in the GTA.
          </figcaption>
        </figure>

        <div className="space-y-14 md:col-span-7">
          <div>
            <h2 className="text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">A lifetime of growing things</h2>
            <div className="mt-4 max-w-prose space-y-4 text-loam/80">
              <p>
                I&apos;ve been growing and looking after plants for as long as I can remember: seeds on windowsills,
                vegetable beds, cuttings passed between neighbours, houseplants rescued from the curb. Most of what I know
                I learned by watching plants closely, year after year, and noticing what they needed.
              </p>
              <p>
                For the last {site.yearsProfessional} years I&apos;ve been doing it for clients across the GTA. Heavy clay,
                dry shade under old maples, boulevards burned by road salt, windy balconies high up. Each garden teaches
                me something, and when I suggest a plant or a pruning cut I&apos;ll always tell you why.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">Why city gardens</h2>
            <div className="mt-4 max-w-prose space-y-4 text-loam/80">
              <p>
                I hold {degree}, and it shapes how I think about gardens. They&apos;re one of the most direct ways a
                neighbourhood can look after itself: shade, food, habitat, and somewhere for people to stop and talk.
              </p>
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
