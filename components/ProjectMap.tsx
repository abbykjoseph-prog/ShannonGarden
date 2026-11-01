"use client";

import { projects } from "@/lib/site";

// A small hand-drawn map of the GTA with a dot for each project on /work. Dots are links to the projects.
const LAKE = "M0 214C46 208 96 196 140 184S214 160 250 158 300 156 330 146 372 126 400 118V260H0Z";

export function ProjectMap() {
  const jump = (e: React.MouseEvent, slug: string) => {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${slug}`);
    target.focus({ preventScroll: true });
  };

  return (
    <figure>
      <svg viewBox="0 0 400 260" className="block h-auto w-full" role="group" aria-label="Map of the Greater Toronto Area showing where these projects are">
        <rect width="400" height="260" rx="18" fill="#EFE7D6" />

        {/* Lake Ontario, the Toronto Islands, and a few roads for bearings */}
        <path d={LAKE} fill="#E3EBDC" />
        <path d="M0 214C46 208 96 196 140 184S214 160 250 158 300 156 330 146 372 126 400 118" fill="none" stroke="#395437" strokeOpacity="0.45" strokeWidth="1.4" />
        <path d="M248 170c6-4 18-5 26-1-4 6-18 7-26 1Z" fill="#C9D8BF" stroke="#395437" strokeOpacity="0.35" strokeWidth="0.8" />
        <g fill="none" stroke="#6B4A33" strokeOpacity="0.35" strokeLinecap="round" strokeDasharray="1 4" strokeWidth="1.6">
          <path d="M60 86C140 76 220 70 300 68S370 62 396 58" />
          <path d="M40 202C110 186 180 166 252 156" />
          <path d="M296 150C300 120 306 92 316 64" />
          <path d="M262 156C261 120 260 80 258 22" />
        </g>
        <text x="300" y="60" fontSize="8" fill="#6B4A33" fillOpacity="0.6" style={{ fontFamily: '"Schibsted Grotesk Variable", sans-serif' }}>
          Hwy 401
        </text>
        <text x="150" y="236" fontSize="12" fill="#395437" fillOpacity="0.6" style={{ fontFamily: '"Newsreader Variable", serif', fontStyle: "italic" }}>
          Lake Ontario
        </text>

        {projects.map((p) => {
          const labelLeft = p.map.x > 280;
          return (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              onClick={(e) => jump(e, p.slug)}
              aria-label={`Jump to the ${p.place} project: ${p.title}`}
              className="group cursor-pointer focus:outline-none"
            >
              <circle cx={p.map.x} cy={p.map.y} r="15" fill="transparent" />
              <circle
                cx={p.map.x}
                cy={p.map.y}
                r="10"
                className="fill-clay/0 transition-colors group-hover:fill-clay/20 group-focus-visible:fill-clay/25 group-focus:fill-clay/25"
              />
              <circle cx={p.map.x} cy={p.map.y} r="5" fill="#395437" stroke="#F6F1E6" strokeWidth="1.6" />
              <text
                x={p.map.x + (labelLeft ? 10 : -10)}
                y={p.map.y - 10}
                textAnchor={labelLeft ? "start" : "end"}
                fontSize="11"
                className="fill-ink/70 transition-colors group-hover:fill-clay group-focus:fill-clay group-focus-visible:underline"
                style={{ fontFamily: '"Schibsted Grotesk Variable", sans-serif', fontWeight: 600 }}
              >
                {p.place}
              </text>
            </a>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[0.88rem] text-ink/60">Tap a dot to jump to that garden.</figcaption>
    </figure>
  );
}
