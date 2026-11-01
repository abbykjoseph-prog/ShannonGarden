// The single source of plant data for every interaction on the site
// (home watering can, the planting scene on /about, the bed designer on /contact).

import type { ComponentType } from "react";
import {
  AsterArt,
  ConeflowerArt,
  HostaArt,
  LavenderArt,
  MilkweedArt,
  MonardaArt,
  RudbeckiaArt,
  ServiceberryArt,
  TomatoArt,
} from "@/components/PlantArt/art";

export type Light = "sun" | "part shade" | "shade";

export type Plant = {
  id: string;
  commonName: string;
  botanicalName: string;
  /** One or two plain sentences: what it is, and why it's good in a Toronto garden. */
  description: string;
  light: Light[];
  bloom: string;
  nativeToOntario: boolean;
  /** Side-on drawing from the base up, built from stem, leaf and bloom parts so it can grow. */
  Art: ComponentType;
  /** Roughly how tall the drawing is, in drawing units. */
  height: number;
  /** How it arrives for planting: a seed packet, or a young plant in a pot. */
  start: "seed" | "pot";
  /** Main flower or fruit colour, for packets and small labels. */
  tone: string;
};

export const plants: Plant[] = [
  {
    id: "coneflower",
    commonName: "Purple coneflower",
    botanicalName: "Echinacea purpurea",
    description:
      "A tough, long-flowering native with pink-purple petals around a spiky orange cone. It shrugs off heat and drought, and goldfinches eat the seed heads in fall.",
    light: ["sun"],
    bloom: "July to September",
    nativeToOntario: true,
    Art: ConeflowerArt,
    height: 170,
    start: "seed",
    tone: "#C2678F",
  },
  {
    id: "rudbeckia",
    commonName: "Black-eyed Susan",
    botanicalName: "Rudbeckia hirta",
    description:
      "Bright gold daisies with dark centres that flower for weeks in midsummer. Easy, cheerful and happy in a dry, sunny front yard.",
    light: ["sun"],
    bloom: "July to September",
    nativeToOntario: true,
    Art: RudbeckiaArt,
    height: 145,
    start: "seed",
    tone: "#E3A92B",
  },
  {
    id: "monarda",
    commonName: "Wild bergamot",
    botanicalName: "Monarda fistulosa",
    description:
      "A native mint relative with shaggy lavender flowers that bees and hummingbirds love. The leaves smell like oregano when you brush past.",
    light: ["sun", "part shade"],
    bloom: "July to August",
    nativeToOntario: true,
    Art: MonardaArt,
    height: 160,
    start: "seed",
    tone: "#B79BC9",
  },
  {
    id: "aster",
    commonName: "New England aster",
    botanicalName: "Symphyotrichum novae-angliae",
    description:
      "The big purple finale of the Toronto garden year. It feeds migrating monarchs and late bees when almost nothing else is in flower.",
    light: ["sun", "part shade"],
    bloom: "September to October",
    nativeToOntario: true,
    Art: AsterArt,
    height: 140,
    start: "seed",
    tone: "#7E5BB0",
  },
  {
    id: "milkweed",
    commonName: "Butterfly milkweed",
    botanicalName: "Asclepias tuberosa",
    description:
      "A compact native with flat clusters of bright orange flowers. It's a host plant for monarch caterpillars and loves a hot, dry, sandy spot.",
    light: ["sun"],
    bloom: "June to August",
    nativeToOntario: true,
    Art: MilkweedArt,
    height: 120,
    start: "seed",
    tone: "#E2803A",
  },
  {
    id: "lavender",
    commonName: "English lavender",
    botanicalName: "Lavandula angustifolia",
    description:
      "A fragrant Mediterranean herb that gets through Toronto winters in sharp-draining soil. Bees love it, and it's happy in a pot on a sunny balcony.",
    light: ["sun"],
    bloom: "June to August",
    nativeToOntario: false,
    Art: LavenderArt,
    height: 100,
    start: "pot",
    tone: "#8E7CC3",
  },
  {
    id: "hosta",
    commonName: "Hosta",
    botanicalName: "Hosta spp.",
    description:
      "Big, bold leaves for the shady corners where little else will grow. Tall stems of pale lavender bells appear in summer.",
    light: ["part shade", "shade"],
    bloom: "July to August",
    nativeToOntario: false,
    Art: HostaArt,
    height: 150,
    start: "pot",
    tone: "#CDBDE0",
  },
  {
    id: "serviceberry",
    commonName: "Serviceberry",
    botanicalName: "Amelanchier canadensis",
    description:
      "A small native tree with white blossoms in April, berries in June for the birds (and you), and orange leaves in fall. A good fit for a small city yard.",
    light: ["sun", "part shade"],
    bloom: "April to May",
    nativeToOntario: true,
    Art: ServiceberryArt,
    height: 200,
    start: "pot",
    tone: "#FBFBF7",
  },
  {
    id: "tomato",
    commonName: "Cherry tomato",
    botanicalName: "Solanum lycopersicum 'Sungold'",
    description:
      "One for fun: sweet orange cherry tomatoes from midsummer to frost. Give it your sunniest spot and a stake to lean on.",
    light: ["sun"],
    bloom: "Fruit July to October",
    nativeToOntario: false,
    Art: TomatoArt,
    height: 140,
    start: "seed",
    tone: "#E0672E",
  },
];

export function getPlant(id: string): Plant {
  const p = plants.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown plant: ${id}`);
  return p;
}
