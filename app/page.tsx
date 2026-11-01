import type { Metadata } from "next";
import Link from "next/link";
import { WateringCan } from "@/components/WateringCan";
import { ThisMonth } from "@/components/ThisMonth";
import { CtaBand } from "@/components/CtaBand";
import { approach, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Garden design and care in Toronto and the GTA` },
  description: `Garden design and care in Toronto and the GTA from ${site.person}, who has been growing things her whole life. Planting, seasonal care, balconies and native pollinator gardens. One gardener, start to finish.`,
};

// Re-render daily so the server-rendered month is current before the visitor's own clock takes over.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <section className="wrap grid items-center gap-x-14 gap-y-12 pb-16 pt-10 md:grid-cols-12 md:pb-24 md:pt-16">
        <div className="md:col-span-5">
          <h1 className="text-[3.1rem] leading-[0.98] sm:text-7xl lg:text-[5.4rem]">
            City gardens, <em className="text-green">grown properly.</em>
          </h1>
          <p className="mt-7 max-w-[42ch] text-[1.15rem] text-loam/80">
            I&apos;m {site.person}. I&apos;ve been growing things my whole life, and for the last few years I&apos;ve been
            doing it for clients across the Greater Toronto Area. One gardener, start to finish.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Book a garden visit</Link>
            <Link href="/work" className="btn-quiet">See recent work</Link>
          </div>
        </div>
        <div className="md:col-span-7">
          <WateringCan />
        </div>
      </section>

      <section aria-labelledby="how" className="border-t border-loam/15">
        <div className="wrap grid gap-x-16 gap-y-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <h2 id="how" className="text-[2.4rem] leading-[1.05] sm:text-5xl">Horticulture is a craft. City gardens deserve it.</h2>
            <p className="mt-5 max-w-prose text-loam/75">
              Most city gardens are planted in a day and left to fend for themselves. I&apos;d rather do it slowly and
              properly, the way I&apos;ve looked after plants since I was small, and the way I&apos;ve worked in Toronto
              gardens for the past {site.yearsProfessional} years.
            </p>
          </div>
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 md:col-span-7 md:pt-2">
            {approach.map((a, i) => (
              <li key={a.title}>
                <p className="font-display text-xl italic text-green">{i + 1}.</p>
                <h3 className="mt-1 text-[1.65rem] leading-tight">{a.title}</h3>
                <p className="mt-2 text-loam/75">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="services" className="bg-paper">
        <div className="wrap py-20 md:py-28">
          <div className="grid gap-6 md:grid-cols-12">
            <h2 id="services" className="text-[2.4rem] leading-[1.05] sm:text-5xl md:col-span-6">What I can do for your garden</h2>
            <p className="max-w-prose text-loam/70 md:col-span-5 md:col-start-8 md:pt-3">
              Every job is priced after I&apos;ve seen the garden. Most people start with one of these and keep me on for the
              seasons after.
            </p>
          </div>

          <ul className="mt-14 border-t border-loam/20">
            {services.map((s, i) => (
              <li key={s.slug} className="grid gap-x-12 gap-y-4 border-b border-loam/20 py-10 md:grid-cols-12 md:py-12">
                <div className={i % 2 ? "md:col-span-5 md:col-start-2" : "md:col-span-5"}>
                  <h3 className={i === 0 ? "text-[2.2rem] leading-[1.05] sm:text-[2.75rem]" : "text-[1.9rem] leading-[1.1] sm:text-[2.25rem]"}>
                    {s.title}
                  </h3>
                  <p className="mt-2 font-display text-[1.25rem] italic leading-snug text-green">{s.lede}</p>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <p className="max-w-prose text-loam/80">{s.body}</p>
                  <p className="mt-3 text-[0.95rem] text-loam/60">Includes: {s.points.join(", ").toLowerCase()}.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ThisMonth initialMonth={new Date().getMonth()} />

      <CtaBand />
    </>
  );
}
