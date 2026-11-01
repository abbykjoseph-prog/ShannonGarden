import type { Metadata } from "next";
import Link from "next/link";
import { WateringCan } from "@/components/WateringCan";
import { ThisMonth } from "@/components/ThisMonth";
import { CtaBand } from "@/components/CtaBand";
import { approach, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Garden design and care in Toronto and the GTA` },
  description: `Garden design and care in Toronto and the GTA from ${site.person}, a trained horticulturist. Design, planting, seasonal maintenance, balconies and native pollinator gardens. One gardener, start to finish.`,
};

// Re-render daily so the server-rendered month is current before the client takes over.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="wrap grid items-center gap-12 pb-20 pt-12 md:grid-cols-[1fr_1.05fr] md:gap-16 md:pb-28 md:pt-20">
        <div>
          <p className="eyebrow">{site.educationShort} · {site.region}</p>
          <h1 className="mt-5 text-[3.2rem] leading-[0.98] sm:text-7xl lg:text-[5.25rem]">
            City gardens, <em className="text-forest">grown properly.</em>
          </h1>
          <p className="mt-7 max-w-lg text-lg text-ink/75">
            I&apos;m {site.person}, a trained horticulturist who designs, plants and tends gardens across the Greater
            Toronto Area. One gardener, start to finish.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Book a garden visit</Link>
            <Link href="/work" className="btn-ghost">See recent work</Link>
          </div>
          <dl className="mt-12 flex gap-10 border-t border-forest/15 pt-6 text-sm">
            <div>
              <dt className="text-ink/55">Experience</dt>
              <dd className="mt-1 font-display text-2xl text-forest-deep">{site.yearsExperience}+ years</dd>
            </div>
            <div>
              <dt className="text-ink/55">Your gardener</dt>
              <dd className="mt-1 font-display text-2xl text-forest-deep">Always Shannon</dd>
            </div>
          </dl>
        </div>
        <WateringCan />
      </section>

      {/* How I work */}
      <section aria-labelledby="how" className="border-y border-forest/10 bg-cream-warm/60">
        <div className="wrap grid gap-12 py-20 md:grid-cols-[0.8fr_1.4fr] md:py-28">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 id="how" className="mt-4 text-4xl leading-tight sm:text-5xl">
              Horticulture is a craft. City gardens deserve it.
            </h2>
            <p className="mt-5 text-ink/75">
              Most city gardens are planted fast and left to fend for themselves. I&apos;d rather do it slowly and
              properly, with the knowledge that comes from training and {site.yearsExperience} years of getting my
              hands dirty in Toronto soil.
            </p>
          </div>
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {approach.map((a, i) => (
              <li key={a.title} className="border-t border-forest/20 pt-5">
                <span className="font-display text-lg italic text-clay">0{i + 1}</span>
                <h3 className="mt-1 text-2xl">{a.title}</h3>
                <p className="mt-2 text-[0.98rem] text-ink/75">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services" className="wrap py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services" className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
              What I can do for your garden
            </h2>
          </div>
          <p className="max-w-sm text-ink/70">
            Every job is quoted after a site visit. Most clients start with one service and stay for the seasons.
          </p>
        </div>

        <ul className="mt-14 divide-y divide-forest/15 border-y border-forest/15">
          {services.map((s, i) => (
            <li
              key={s.slug}
              className={`grid gap-6 py-10 md:grid-cols-12 md:gap-10 ${i % 2 === 1 ? "md:[&>*:first-child]:col-start-2" : ""}`}
            >
              <div className="md:col-span-5">
                <span className="font-display text-sm italic text-clay">{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`mt-1 leading-[1.05] ${i === 0 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>
                  {s.title}
                </h3>
                <p className="mt-3 font-display text-xl italic text-forest">{s.lede}</p>
              </div>
              <div className={`md:col-span-6 ${i % 2 === 1 ? "" : "md:col-start-7"}`}>
                <p className="text-ink/75">{s.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="rounded-full bg-sage-soft px-3.5 py-1.5 text-sm text-forest-deep">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ThisMonth initialMonth={new Date().getMonth()} />

      <CtaBand />
    </>
  );
}
