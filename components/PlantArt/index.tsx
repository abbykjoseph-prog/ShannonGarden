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
export function PlantLabel({ plant, description = false }: { plant: Plant; description?: boolean }) {
  return (
    <div>
      <p className="text-[1.25rem] font-semibold leading-tight text-loam">{plant.commonName}</p>
      <p className="latin mt-0.5 text-[1.02rem] leading-snug text-loam/80">{plant.botanicalName}</p>
      {description && <p className="mt-2 max-w-prose text-[0.98rem] leading-snug text-loam/75">{plant.description}</p>}
    </div>
  );
}
