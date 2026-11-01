export type PlantKind = "coneflower" | "rudbeckia" | "monarda";

export const SCENE = { w: 560, h: 440 };

export const PATCHES: {
  kind: PlantKind;
  cx: number;
  cy: number;
  common: string;
  latin: string;
  patchName: string;
}[] = [
  { kind: "coneflower", cx: 150, cy: 309, common: "Purple coneflower", latin: "Echinacea purpurea", patchName: "coneflower" },
  { kind: "rudbeckia", cx: 280, cy: 309, common: "Black-eyed Susan", latin: "Rudbeckia hirta", patchName: "black-eyed Susan" },
  { kind: "monarda", cx: 410, cy: 309, common: "Wild bergamot", latin: "Monarda fistulosa", patchName: "wild bergamot" },
];

export const PATCH_RX = 54;
export const PATCH_RY = 17;

/** Milliseconds of continuous watering to soak a patch. */
export const SOAK_MS = 1500;

// Can geometry, in the can's own frame (pivot at the body's centre).
export const TILT_DEG = 35;
const SPOUT = { x: 94, y: -36 };
const rad = (TILT_DEG * Math.PI) / 180;
/** Where the rose (sprinkler head) ends up once the can is tilted to pour. */
export const POUR_TIP = {
  x: SPOUT.x * Math.cos(rad) - SPOUT.y * Math.sin(rad),
  y: SPOUT.x * Math.sin(rad) + SPOUT.y * Math.cos(rad),
};

export const CAN_BOUNDS = { minX: 50, maxX: 462, minY: 72, maxY: 236 };
export const CAN_START = { x: 446, y: 86 };

/** Deterministic jagged crack lines inside a patch, so server and client draw the same thing. */
export function cracks(seed: number) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const lines: string[] = [];
  for (let i = 0; i < 7; i++) {
    let x = (rnd() - 0.5) * PATCH_RX * 1.5;
    let y = (rnd() - 0.5) * PATCH_RY * 1.4;
    let a = rnd() * Math.PI * 2;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    for (let k = 0; k < 4; k++) {
      a += (rnd() - 0.5) * 1.4;
      x += Math.cos(a) * (8 + rnd() * 10);
      y += Math.sin(a) * (3 + rnd() * 4);
      d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    lines.push(d);
  }
  return lines;
}
