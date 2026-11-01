import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { CtaBand } from "@/components/CtaBand";
import { PlanSlider } from "@/components/PlanSlider";
import { PlantTag } from "@/components/PlantTag";
import { projects, site, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recent work and what clients say",
  description: `Garden design and care in Toronto and the GTA: recent projects by ${site.ownerName} in Leslieville, Midtown, Liberty Village and Oakville, with before and after planting plans.`,
};

export default function Work() {
  return (
    <>
      <PageIntro eyebrow="Work & testimonials" title={<>Gardens across the city, <em className="text-forest">tended by one pair of hands.</em></>}>
        <p>
          A few recent projects from around the GTA. Drag the slider on each plan to compare the garden before and
          after. Every one was designed, planted and looked after by me.
        </p>
      </PageIntro>

      <div className="wrap space-y-24 pb-20 md:space-y-32 md:pb-28">
        {projects.map((p, i) => {
          const words = testimonials.find((t) => t.project === p.slug);
          return (
            <article key={p.slug} aria-labelledby={`${p.slug}-title`} className="grid gap-x-14 gap-y-8 md:grid-cols-12">
              <header className={`md:col-span-12 ${i % 2 ? "md:pl-[8%]" : ""}`}>
                <p className="text-[0.98rem] text-ink/65">
                  {p.place}, {p.year} · {p.type}
                </p>
                <h2 id={`${p.slug}-title`} className="mt-2 max-w-[22ch] text-[2.2rem] leading-[1.05] sm:text-5xl">
                  {p.title}
                </h2>
              </header>

              <div className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <PlanSlider id={p.slug} title={`${p.place}: ${p.title}`} plan={p.plan} photos={p.photos} />
              </div>

              <div className={`md:col-span-5 ${i % 2 ? "md:order-1" : ""}`}>
                <p className="max-w-prose text-ink/80">{p.brief}</p>
                <h3 className="mt-6 font-sans text-[1rem] font-semibold tracking-normal">What I did</h3>
                <ul className="mt-2 space-y-1.5 text-ink/80">
                  {p.done.map((d) => (
                    <li key={d} className="grid grid-cols-[1rem_1fr]">
                      <span aria-hidden className="mt-[0.7em] h-1 w-1 rounded-full bg-forest" />
                      {d}
                    </li>
                  ))}
                </ul>
                {words && (
                  <div className="mt-10">
                    <PlantTag quote={words.quote} name={words.name} place={words.place} tilt={i % 2 ? 1.5 : -1.5} />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <CtaBand title="Could your garden be next?" body="Tell me what you've got, even if it's a patch of tired lawn or a bare balcony. That's where most of these started." />
    </>
  );
}
