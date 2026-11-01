"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import s from "./PlantArt.module.css";

// One illustrator's kit: every plant on the site is drawn from these parts, side-on, from its base at (0,0).
export const INK = {
  stem: "#4E7246",
  leaf: "#5E7F59",
  leafDark: "#46663F",
  wood: "#6B4F3A",
};

/** When false, parts render fully grown with no animation (thumbnails, the designed bed, the photo). */
export const GrowContext = createContext(true);

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Stem({ d, width = 3.6, color = INK.stem }: { d: string; width?: number; color?: string }) {
  const grow = useContext(GrowContext);
  return <path className={grow ? s.stem : undefined} d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

const LEAF_SHAPES = {
  lance: "M0 0C10-9 32-12 46-3 32 4 12 5 0 0Z",
  oval: "M0 0C6-12 24-15 34-6 30 4 14 8 0 0Z",
  narrow: "M0 0C8-5 24-7 34-2 24 2 10 3 0 0Z",
  broad: "M0 0C4-22 40-30 58-12 52 8 20 14 0 0Z",
};

/** A leaf drawn from its attachment point outwards to the right. `flip` mirrors it to the left. */
export function Leaf({
  x,
  y,
  size = 1,
  angle = -20,
  flip = false,
  d = 0,
  shape = "lance",
  fill = INK.leaf,
  vein = false,
}: {
  x: number;
  y: number;
  size?: number;
  angle?: number;
  flip?: boolean;
  d?: number;
  shape?: keyof typeof LEAF_SHAPES;
  fill?: string;
  vein?: boolean;
}) {
  const grow = useContext(GrowContext);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -size : size} ${size}) rotate(${angle})`}>
      <g className={grow ? s.leaf : undefined} style={grow ? delay(d) : undefined}>
        <path d={LEAF_SHAPES[shape]} fill={fill} stroke={INK.leafDark} strokeWidth="0.8" />
        {vein && <path d="M2 0C18-6 36-8 52-10" fill="none" stroke={INK.leafDark} strokeWidth="0.8" opacity="0.6" />}
      </g>
    </g>
  );
}

/** The showy part: flower head, fruit or canopy. Drawn around (x, y), opens after the leaves. */
export function Bloom({ x, y, d = 1100, children }: { x: number; y: number; d?: number; children: ReactNode }) {
  const grow = useContext(GrowContext);
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={grow ? s.flower : undefined} style={grow ? delay(d) : undefined}>
        {children}
      </g>
    </g>
  );
}

export const plantClass = s.plant;
