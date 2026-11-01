"use client";

import type { Plant } from "@/lib/plants";
import { GrowContext, plantClass } from "./parts";

/** Draws a plant from lib/plants.ts with its base at (x, y). With `grow`, it grows in when it mounts. */
export function PlantArt({ plant, x, y, scale = 1, grow = true }: { plant: Plant; x: number; y: number; scale?: number; grow?: boolean }) {
  const { Art } = plant;
  return (
    <GrowContext.Provider value={grow}>
      <g transform={`translate(${x} ${y})${scale !== 1 ? ` scale(${scale})` : ""}`} className={grow ? plantClass : undefined} aria-hidden>
        <Art />
      </g>
    </GrowContext.Provider>
  );
}

/** The shared plant tag typography used under every interaction. */
export function PlantLabel({ plant, description = false, row = false }: { plant: Plant; description?: boolean; row?: boolean }) {
  return (
    <div className={row ? "md:grid md:grid-cols-[13rem_1fr] md:gap-x-6" : undefined}>
      <div>
        <p className="text-[1.25rem] font-semibold leading-tight text-ink">{plant.commonName}</p>
        <p className="latin mt-0.5 text-[1.02rem] leading-snug text-ink/80">{plant.botanicalName}</p>
      </div>
      {description && (
        <p className={`max-w-prose text-[0.98rem] leading-snug text-ink/75 ${row ? "mt-2 md:mt-0.5" : "mt-2"}`}>{plant.description}</p>
      )}
    </div>
  );
}
