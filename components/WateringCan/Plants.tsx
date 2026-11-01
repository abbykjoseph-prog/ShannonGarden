import type { CSSProperties } from "react";
import s from "./WateringCan.module.css";
import type { PlantKind } from "./patches";

const STEM = "#4E7246";
const LEAF = "#5E7F59";
const LEAF_DARK = "#46663F";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// A leaf drawn from its attachment point (0,0) outwards to the right. `flip` mirrors it to the left.
function Leaf({ x, y, size = 1, angle = -20, flip = false, d = 0, shape = "lance" }: { x: number; y: number; size?: number; angle?: number; flip?: boolean; d?: number; shape?: "lance" | "oval" }) {
  const path =
    shape === "lance"
      ? "M0 0C10-9 32-12 46-3 32 4 12 5 0 0Z"
      : "M0 0C6-12 24-15 34-6 30 4 14 8 0 0Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -size : size} ${size}) rotate(${angle})`}>
      <path className={s.leaf} style={delay(d)} d={path} fill={LEAF} stroke={LEAF_DARK} strokeWidth="0.8" />
    </g>
  );
}

function Stem({ d }: { d: string }) {
  return <path className={s.stem} d={d} pathLength={1} fill="none" stroke={STEM} strokeWidth="3.6" strokeLinecap="round" />;
}

function Coneflower() {
  return (
    <>
      <Stem d="M0 0C-4-50 6-100 2-152" />
      <Leaf x={0} y={-4} angle={-18} d={350} />
      <Leaf x={0} y={-3} angle={-22} flip d={420} />
      <Leaf x={1} y={-62} size={0.7} angle={-28} d={560} />
      <Leaf x={3} y={-98} size={0.55} angle={-30} flip d={660} />
      <g transform="translate(2 -152)">
        <g className={s.flower} style={delay(1100)}>
          {/* drooping petals around a domed cone */}
          {[25, 45, 65, 85, 105, 125, 145, 165].map((a) => (
            <ellipse key={a} cx="0" cy="0" rx="3.6" ry="15" transform={`rotate(${a - 90}) translate(0 14)`} fill="#C2678F" stroke="#9E4C70" strokeWidth="0.6" />
          ))}
          <path d="M-11 0C-11-17 11-17 11 0Z" fill="#9A5226" />
          {[-6, -2, 2, 6, -4, 0, 4].map((x, i) => (
            <circle key={i} cx={x} cy={i < 4 ? -3 : -8} r="1.2" fill="#C4782F" />
          ))}
        </g>
      </g>
    </>
  );
}

function Rudbeckia() {
  return (
    <>
      <Stem d="M0 0C3-40-4-86 1-126" />
      <Leaf x={0} y={-4} angle={-14} shape="oval" size={1.1} d={350} />
      <Leaf x={0} y={-4} angle={-18} shape="oval" flip size={1.05} d={420} />
      <Leaf x={-1} y={-56} angle={-26} shape="oval" size={0.75} flip d={560} />
      <Leaf x={0} y={-86} angle={-30} shape="oval" size={0.6} d={660} />
      <g transform="translate(1 -126)">
        <g className={s.flower} style={delay(1100)}>
          <g transform="scale(1 0.86)">
            {Array.from({ length: 13 }, (_, i) => (
              <ellipse key={i} cx="0" cy="-14" rx="4.2" ry="12" transform={`rotate(${(i * 360) / 13})`} fill="#E3A92B" stroke="#C48A17" strokeWidth="0.6" />
            ))}
            <circle r="8.5" fill="#3B2516" />
            <circle r="4" cx="-2" cy="-2" fill="#54361F" />
          </g>
        </g>
      </g>
    </>
  );
}

function Monarda() {
  return (
    <>
      <Stem d="M0 0C-2-45 2-90 0-138" />
      <Leaf x={0} y={-30} angle={-24} size={0.85} d={350} />
      <Leaf x={0} y={-30} angle={-24} size={0.85} flip d={400} />
      <Leaf x={0} y={-74} angle={-28} size={0.7} d={540} />
      <Leaf x={0} y={-74} angle={-28} size={0.7} flip d={590} />
      <Leaf x={0} y={-106} angle={-32} size={0.5} d={680} />
      <Leaf x={0} y={-106} angle={-32} size={0.5} flip d={720} />
      <g transform="translate(0 -138)">
        <g className={s.flower} style={delay(1100)}>
          {/* a whorl of thin tubular florets around a round head, with pale bracts below */}
          {[-40, -20, 0, 20, 40].map((a) => (
            <ellipse key={`b${a}`} cx="0" cy="0" rx="4" ry="8" transform={`rotate(${a + 180}) translate(0 -7)`} fill="#D9C7DE" />
          ))}
          {Array.from({ length: 15 }, (_, i) => {
            const a = -84 + i * 12;
            return (
              <path key={i} d="M0 0C-2-6 2-12 0-19" transform={`rotate(${a})`} fill="none" stroke="#B79BC9" strokeWidth="3.2" strokeLinecap="round" />
            );
          })}
          <circle r="8.5" fill="#8E6FA8" />
        </g>
      </g>
    </>
  );
}

export function Plant({ kind, cx, cy }: { kind: PlantKind; cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`} className={s.plant} aria-hidden>
      {kind === "coneflower" && <Coneflower />}
      {kind === "rudbeckia" && <Rudbeckia />}
      {kind === "monarda" && <Monarda />}
    </g>
  );
}
