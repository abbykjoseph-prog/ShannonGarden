"use client";

import { Bloom, INK, Leaf, Stem } from "./parts";

// Each plant is drawn side-on from its base at (0,0), growing up (negative y).

export function ConeflowerArt() {
  return (
    <>
      <Stem d="M0 0C-4-50 6-100 2-152" />
      <Leaf x={0} y={-4} angle={-18} d={350} />
      <Leaf x={0} y={-3} angle={-22} flip d={420} />
      <Leaf x={1} y={-62} size={0.7} angle={-28} d={560} />
      <Leaf x={3} y={-98} size={0.55} angle={-30} flip d={660} />
      <Bloom x={2} y={-152}>
        {/* drooping petals around a domed cone */}
        {[25, 45, 65, 85, 105, 125, 145, 165].map((a) => (
          <ellipse key={a} cx="0" cy="0" rx="3.6" ry="15" transform={`rotate(${a - 90}) translate(0 14)`} fill="#C2678F" stroke="#9E4C70" strokeWidth="0.6" />
        ))}
        <path d="M-11 0C-11-17 11-17 11 0Z" fill="#9A5226" />
        {[-6, -2, 2, 6, -4, 0, 4].map((x, i) => (
          <circle key={i} cx={x} cy={i < 4 ? -3 : -8} r="1.2" fill="#C4782F" />
        ))}
      </Bloom>
    </>
  );
}

export function RudbeckiaArt() {
  return (
    <>
      <Stem d="M0 0C3-40-4-86 1-126" />
      <Leaf x={0} y={-4} angle={-14} shape="oval" size={1.1} d={350} />
      <Leaf x={0} y={-4} angle={-18} shape="oval" flip size={1.05} d={420} />
      <Leaf x={-1} y={-56} angle={-26} shape="oval" size={0.75} flip d={560} />
      <Leaf x={0} y={-86} angle={-30} shape="oval" size={0.6} d={660} />
      <Bloom x={1} y={-126}>
        <g transform="scale(1 0.86)">
          {Array.from({ length: 13 }, (_, i) => (
            <ellipse key={i} cx="0" cy="-14" rx="4.2" ry="12" transform={`rotate(${(i * 360) / 13})`} fill="#E3A92B" stroke="#C48A17" strokeWidth="0.6" />
          ))}
          <circle r="8.5" fill="#3B2516" />
          <circle r="4" cx="-2" cy="-2" fill="#54361F" />
        </g>
      </Bloom>
    </>
  );
}

export function MonardaArt() {
  return (
    <>
      <Stem d="M0 0C-2-45 2-90 0-138" />
      <Leaf x={0} y={-30} angle={-24} size={0.85} d={350} />
      <Leaf x={0} y={-30} angle={-24} size={0.85} flip d={400} />
      <Leaf x={0} y={-74} angle={-28} size={0.7} d={540} />
      <Leaf x={0} y={-74} angle={-28} size={0.7} flip d={590} />
      <Leaf x={0} y={-106} angle={-32} size={0.5} d={680} />
      <Leaf x={0} y={-106} angle={-32} size={0.5} flip d={720} />
      <Bloom x={0} y={-138}>
        {/* a whorl of thin tubular florets around a round head, with pale bracts below */}
        {[-40, -20, 0, 20, 40].map((a) => (
          <ellipse key={`b${a}`} cx="0" cy="0" rx="4" ry="8" transform={`rotate(${a + 180}) translate(0 -7)`} fill="#D9C7DE" />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <path key={i} d="M0 0C-2-6 2-12 0-19" transform={`rotate(${-84 + i * 12})`} fill="none" stroke="#B79BC9" strokeWidth="3.2" strokeLinecap="round" />
        ))}
        <circle r="8.5" fill="#8E6FA8" />
      </Bloom>
    </>
  );
}

function Daisy({ x, y, r = 1, petal, centre }: { x: number; y: number; r?: number; petal: string; centre: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-7" rx="1.6" ry="6" transform={`rotate(${i * 22.5})`} fill={petal} />
      ))}
      <circle r="3.4" fill={centre} />
    </g>
  );
}

export function AsterArt() {
  return (
    <>
      <Stem d="M0 0C-2-40 2-80 0-124" />
      <Stem d="M0-50C-10-70-22-90-26-108" width={2.6} />
      <Stem d="M0-62C10-80 20-96 24-112" width={2.6} />
      {[-14, -32, -48, -66, -84, -100].map((y, i) => (
        <Leaf key={y} x={0} y={y} shape="narrow" size={0.8 - i * 0.06} angle={-22} flip={i % 2 === 0} d={340 + i * 60} />
      ))}
      <Bloom x={0} y={0}>
        {[
          [0, -126, 1.15], [-26, -110, 1], [24, -114, 1], [-12, -116, 0.85], [12, -104, 0.85], [-30, -94, 0.8],
        ].map(([x, y, r], i) => (
          <Daisy key={i} x={x} y={y} r={r} petal="#7E5BB0" centre="#E6B63C" />
        ))}
      </Bloom>
    </>
  );
}

export function MilkweedArt() {
  return (
    <>
      <Stem d="M0 0C-3-36 3-72 0-104" />
      {[-12, -26, -40, -54, -68, -82].map((y, i) => (
        <Leaf key={y} x={0} y={y} shape="narrow" size={0.85 - i * 0.05} angle={-30} flip={i % 2 === 1} d={340 + i * 60} />
      ))}
      <Bloom x={0} y={-108}>
        {/* a flat-topped umbel of small orange flowers */}
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 13) * Math.PI;
          return <circle key={i} cx={+(-Math.cos(a) * 18).toFixed(2)} cy={+(-Math.sin(a) * 7).toFixed(2)} r="4" fill="#E2803A" stroke="#C4552A" strokeWidth="0.6" />;
        })}
        {[-10, -3, 4, 11].map((x) => (
          <circle key={x} cx={x} cy="-2" r="3.6" fill="#EE9548" stroke="#C4552A" strokeWidth="0.6" />
        ))}
      </Bloom>
    </>
  );
}

export function LavenderArt() {
  const spikes = [-28, -16, -6, 4, 14, 26];
  return (
    <>
      {spikes.map((a, i) => (
        <Stem key={a} d={`M0 0C${a * 0.2} -30 ${a * 0.7} -60 ${a} -${88 - Math.abs(a) * 0.6}`} width={1.8} color="#7F9579" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Leaf key={i} x={0} y={-2} shape="narrow" size={0.6} angle={-10 - i * 9} flip={i % 2 === 0} fill="#8DA08A" d={320 + i * 30} />
      ))}
      <Bloom x={0} y={0}>
        {spikes.map((a) => {
          const top = -(88 - Math.abs(a) * 0.6);
          return (
            <g key={a} transform={`translate(${a} ${top})`}>
              {[0, 5, 10, 15, 20].map((dy) => (
                <ellipse key={dy} cx="0" cy={dy} rx={3.4 - dy * 0.05} ry="3" fill={dy % 10 ? "#9A88CF" : "#7E6CB8"} />
              ))}
            </g>
          );
        })}
      </Bloom>
    </>
  );
}

export function HostaArt() {
  return (
    <>
      <Stem d="M0 0C2-36-2-72 1-108" width={2.4} />
      {(
        [
          [-6, false], [-6, true], [-28, false], [-28, true], [-52, false],
        ] as const
      ).map(([angle, flip], i) => (
        <Leaf key={i} x={0} y={-2} shape="broad" size={0.85 - i * 0.04} angle={angle} flip={flip} fill="#6E8F7A" vein d={300 + i * 70} />
      ))}
      <Bloom x={1} y={-108}>
        {/* pale lavender bells hanging along the top of the scape */}
        {[0, 9, 18, 27, 36].map((dy, i) => (
          <path
            key={dy}
            d="M0 0C-4 2-6 8-5 12H5C6 8 4 2 0 0Z"
            transform={`translate(${i % 2 ? 4 : -4} ${dy}) rotate(${i % 2 ? -25 : 25})`}
            fill="#CDBDE0"
            stroke="#A08CBC"
            strokeWidth="0.6"
          />
        ))}
      </Bloom>
    </>
  );
}

export function ServiceberryArt() {
  return (
    <>
      <Stem d="M0 0C-2-50 2-110 0-150" width={5} color={INK.wood} />
      <Stem d="M0-96C-12-110-24-124-30-140" width={3} color={INK.wood} />
      <Stem d="M0-110C10-124 20-136 26-150" width={3} color={INK.wood} />
      <Leaf x={0} y={-40} size={0.5} shape="oval" d={500} />
      <Leaf x={0} y={-62} size={0.45} shape="oval" flip d={600} />
      <Bloom x={0} y={-150} d={1050}>
        {/* a young canopy in spring blossom */}
        {[
          [-30, 4, 22], [0, -10, 26], [28, 2, 22], [-14, 18, 20], [16, 18, 20], [0, 8, 22],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#7E9F6E" : "#6E8F62"} stroke={INK.leafDark} strokeWidth="0.8" />
        ))}
        {[
          [-34, -6], [-12, -24], [10, -20], [32, -6], [-22, 14], [4, 2], [24, 16], [-4, 24], [-40, 14], [38, 12],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-2.6" rx="1.6" ry="2.6" transform={`rotate(${a})`} fill="#F6F1E6" />
            ))}
          </g>
        ))}
      </Bloom>
    </>
  );
}

export function TomatoArt() {
  return (
    <>
      <Stem d="M10 4V-128" width={2.2} color="#B49A7C" />
      <Stem d="M0 0C-3-40 4-80 0-118" />
      {[-20, -44, -68, -92].map((y, i) => (
        <g key={y}>
          <Leaf x={0} y={y} shape="oval" size={0.62} angle={-12} flip={i % 2 === 0} d={340 + i * 80} />
          <Leaf x={0} y={y - 6} shape="oval" size={0.45} angle={-34} flip={i % 2 === 0} d={380 + i * 80} />
        </g>
      ))}
      <Bloom x={0} y={-60}>
        {/* trusses of small orange-red fruit */}
        {[
          [-22, -8], [-28, 2], [-16, 4], [20, -36], [26, -26], [14, -24], [-18, -50], [-10, -42],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5.5" fill={i % 3 ? "#E0672E" : "#D9532B"} stroke="#A83E1E" strokeWidth="0.6" />
            <path d={`M${x - 3} ${y - 5}l3 1.5 3-1.5`} stroke={INK.leafDark} strokeWidth="1" fill="none" />
          </g>
        ))}
      </Bloom>
    </>
  );
}
