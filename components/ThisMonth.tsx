"use client";

import { useEffect, useState } from "react";
import { monthlyTasks } from "@/lib/site";

// Rendered with the server's month, then corrected to the visitor's own month on mount.
export function ThisMonth({ initialMonth }: { initialMonth: number }) {
  const [month, setMonth] = useState(initialMonth);
  useEffect(() => setMonth(new Date().getMonth()), []);

  const { month: name, note, tasks } = monthlyTasks[month];
  const next = monthlyTasks[(month + 1) % 12].month;

  return (
    <section aria-labelledby="this-month" className="bg-forest text-cream">
      <div className="wrap grid gap-12 py-20 md:grid-cols-[0.9fr_1.6fr] md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Zone 5b–6a · updated monthly</p>
          <h2 id="this-month" className="mt-4 text-4xl leading-[1.05] text-cream sm:text-5xl">
            This month in a Toronto garden: <em className="text-sage">{name}</em>
          </h2>
          <p className="mt-5 max-w-sm text-cream/75">{note}</p>
          <p className="mt-8 text-sm text-cream/55">Check back in {next} for the next round.</p>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-cream/15 sm:grid-cols-2">
          {tasks.map((t, i) => (
            <li key={t.title} className="bg-forest p-7">
              <span className="font-display text-sm italic text-sage">No. {i + 1}</span>
              <h3 className="mt-2 font-display text-2xl leading-tight text-cream">{t.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/75">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
