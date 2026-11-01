import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { CtaBand } from "@/components/CtaBand";
import { projects, site, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recent work and client words",
  description: `Recent garden design, planting and care projects by ${site.person} in Leslieville, Midtown, Liberty Village and across Toronto and the GTA.`,
};

// Illustrated stand-ins for project photos, one mood per project.
const tones: Record<string, { bg: string; fg: string; accent: string }> = {
  fern: { bg: "#2F4630", fg: "#6E8F62", accent: "#A9BF9F" },
  meadow: { bg: "#E9DDB5", fg: "#7C9A5E", accent: "#C4699A" },
  terrace: { bg: "#D9E2DE", fg: "#5E7F59", accent: "#B5643C" },
  border: { bg: "#E4EBDC", fg: "#4E7246", accent: "#8467B3" },
};

function ProjectArt({ tone }: { tone: string }) {
  const t = tones[tone];
  return (
    <svg aria-hidden viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="400" height="260" fill={t.bg} />
      {Array.from({ length: 18 }, (_, i) => {
        const x = 12 + i * 22 + ((i * 7) % 9);
        const h = 70 + ((i * 37) % 90);
        return (
          <g key={i}>
            <path d={`M${x} 260 Q${x + ((i % 3) - 1) * 10} ${260 - h / 2} ${x + ((i % 2) * 2 - 1) * 6} ${260 - h}`} stroke={t.fg} strokeWidth="3" fill="none" />
            <path d={`M${x} ${260 - h * 0.45}c-10-6-18-4-22 4 10 4 18 2 22-4Z`} fill={t.fg} />
            {i % 3 === 0 && <circle cx={x + ((i % 2) * 2 - 1) * 6} cy={260 - h} r="6" fill={t.accent} />}
          </g>
        );
      })}
    </svg>
  );
}

export default function Work() {
  return (
    <>
      <PageIntro eyebrow="Work & testimonials" title={<>Gardens across the city, <em className="text-forest">tended by one pair of hands.</em></>}>
        <p>
          A few recent projects from around Toronto. Each one was designed, planted and cared for by me, from first visit
          to follow-up.
        </p>
      </PageIntro>

      <section aria-label="Projects" className="wrap pb-20 md:pb-28">
        <ul className="space-y-20 md:space-y-28">
          {projects.map((p, i) => (
            <li key={p.title} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <div className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="aspect-[16/11] overflow-hidden rounded-[2rem]">
                  <ProjectArt tone={p.tone} />
                </div>
              </div>
              <div className="md:col-span-5">
                <p className="eyebrow">{p.place} · {p.year}</p>
                <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{p.title}</h2>
                <p className="mt-2 text-sm font-semibold text-clay">{p.type}</p>
                <p className="mt-4 text-ink/75">{p.summary}</p>
                <div className="mt-5 border-t border-forest/15 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">In the planting</p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {p.plants.map((pl) => (
                      <li key={pl} className="latin text-lg text-forest-deep">{pl}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="words" className="bg-forest text-cream">
        <div className="wrap py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Client words</p>
          <h2 id="words" className="mt-4 text-4xl text-cream sm:text-5xl">What clients say</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {testimonials.map((t, i) => (
              <figure key={i} className={i === 0 ? "md:col-span-3 md:max-w-4xl" : ""}>
                <blockquote className={`font-display leading-snug text-cream ${i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-sage">
                  {t.name}, {t.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Could your garden be next?" />
    </>
  );
}
