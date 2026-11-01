"use client";

import { useEffect, useState } from "react";
import { monthlyTasks } from "@/lib/site";

// A seasonal calendar. It opens on the visitor's current month (the server's month is only a first guess).
export function ThisMonth({ initialMonth }: { initialMonth: number }) {
  const [now, setNow] = useState(initialMonth);
  const [month, setMonth] = useState(initialMonth);
  useEffect(() => {
    const m = new Date().getMonth();
    setNow(m);
    setMonth(m);
  }, []);

  const { month: name, note, tasks } = monthlyTasks[month];

  return (
    <section aria-labelledby="this-month" className="bg-limestone-deep">
      <div className="wrap py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 id="this-month" className="text-[2.4rem] leading-[1.05] sm:text-5xl md:col-span-7">
            {month === now ? "This month" : name} in a Toronto garden
          </h2>
          <p className="max-w-prose text-loam/75 md:col-span-5 md:pt-3">
            Zone 5b to 6a. Real jobs for the month, the same ones I&apos;m doing in clients&apos; gardens.
          </p>
        </div>

        <div role="group" aria-label="Choose a month" className="mt-10 grid grid-cols-6 border-y border-loam/20 sm:grid-cols-12">
          {monthlyTasks.map((m, i) => (
            <button
              key={m.month}
              type="button"
              aria-pressed={i === month}
              onClick={() => setMonth(i)}
              className={`relative py-3 text-center text-[0.92rem] transition-colors ${
                i === month ? "bg-green text-limestone" : "text-loam/70 hover:bg-loam/5 hover:text-loam"
              }`}
            >
              <abbr title={m.month} className="no-underline">{m.month.slice(0, 3)}</abbr>
              {i === now && (
                <span className={`absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full ${i === month ? "bg-limestone" : "bg-coneflower"}`}>
                  <span className="sr-only"> (now)</span>
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="font-display text-2xl italic leading-snug text-green md:col-span-4">{note}</p>
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 md:col-span-8">
            {tasks.map((t, i) => (
              <li key={t.title} className="grid grid-cols-[1.75rem_1fr]">
                <span className="font-display text-xl italic text-loam/50">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-[1.05rem] font-semibold tracking-normal">{t.title}</h3>
                  <p className="mt-1.5 text-[0.98rem] text-loam/75">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
