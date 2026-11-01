export type Pt = [number, number];
export type Rect = [x: number, y: number, w: number, h: number];

export type Area = {
  kind: "turf" | "paving" | "mulch" | "bed" | "deck" | "planter";
  rect?: Rect;
  points?: Pt[];
  label?: string;
};

export type PlantForm = "mound" | "grass" | "fern" | "shrub";

export type Plan = {
  /** Everything is drawn in a 400 × 260 sheet; the lot is the inset rectangle 16,16 → 384,244. */
  house: { rect: Rect; label: string };
  trees?: { x: number; y: number; r: number; label: string }[];
  before: Area[];
  after: Area[];
  paths?: { kind: "stepping" | "chip"; points: Pt[] }[];
  /** Groups of one species, laid out on a golden-angle spiral around (cx, cy). */
  drifts: { code: string; cx: number; cy: number; n: number; spread: number }[];
  key: { code: string; latin: string; common: string; form: PlantForm; r: number; tone: string }[];
};
