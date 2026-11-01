import type { Metadata } from "next";
import Image from "next/image";
import { PlantSomething } from "@/components/PlantSomething";
import { CtaBand } from "@/components/CtaBand";
import { principles, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shannon",
  description: `Meet ${site.ownerName}: a lifetime of growing things and ${site.yearsProfessional} years of garden work for clients, offering garden design and care in Toronto and the GTA.`,
};

const degree = `a double degree in ${site.education.firstField} and ${site.education.secondField}`;

export default function About() {
  return (
    <>
      <section className="wrap grid items-start gap-x-14 gap-y-10 pb-16 pt-14 md:grid-cols-12 md:pb-24 md:pt-20">
        <div className="md:col-span-5">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-[2.9rem] leading-[1] sm:text-6xl lg:text-[4.2rem]">
            Bringing the craft of horticulture <em className="text-forest">back into city life.</em>
          </h1>
          <p className="mt-6 max-w-prose text-[1.15rem] text-ink/75">
            I&apos;m {site.ownerName}. I design, plant and look after gardens across the Greater Toronto Area, and I do every
            part of it myself.
          </p>
        </div>
        <div className="md:col-span-7">
          <PlantSomething />
        </div>
      </section>

      <section className="wrap grid gap-x-16 gap-y-14 pb-20 md:grid-cols-12 md:pb-28">
        {/* PLACEHOLDER - swap for a real photo of Shannon (e.g. /public/shannon.jpg with next/image). */}
        <figure className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <div className="bg-cream-warm p-3 shadow-[0_1px_0_rgb(28_33_27/0.15)] ring-1 ring-ink/10 sm:p-4">
            <div className="relative flex aspect-[4/5] flex-col items-center justify-center gap-4 border border-forest/20 bg-sage-soft text-center">
              <Image src="/monogram.png" alt="" width={600} height={600} className="h-24 w-auto opacity-25" />
              <span className="font-display text-[1.4rem] italic text-ink/70">Portrait of {site.ownerName}</span>
              <span className="text-[0.88rem] text-ink/50">Photo to come</span>
            </div>
          </div>
          <figcaption className="mt-3 text-[0.95rem] text-ink/65">
            Growing things since childhood. {site.yearsProfessional} years gardening for clients in the GTA.
          </figcaption>
        </figure>

        <div className="space-y-14 md:col-span-7">
          <div>
            <h2 className="text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">A lifetime of growing things</h2>
            <div className="mt-4 max-w-prose space-y-4 text-ink/80">
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
            <div className="mt-4 max-w-prose space-y-4 text-ink/80">
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

          <blockquote className="border-l-[3px] border-clay py-1 pl-6">
            <p className="font-display text-[1.9rem] italic leading-[1.2] text-ink sm:text-[2.3rem]">
              The person who walks your garden on the first visit is the person who plants it and comes back to tend it.
            </p>
            <p className="mt-4 max-w-prose text-ink/75">
              There&apos;s no sales team and no rotating crew. I know your garden because I planted it, and I notice when
              something&apos;s not right.
            </p>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="principles" className="bg-cream-warm/60">
        <div className="wrap grid gap-x-16 gap-y-10 py-20 md:grid-cols-12 md:py-24">
          <h2 id="principles" className="text-[2.4rem] leading-[1.05] sm:text-5xl md:col-span-4">What you can count on</h2>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 md:col-span-8">
            {principles.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-[1.5rem] leading-tight">{p.title}</dt>
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
