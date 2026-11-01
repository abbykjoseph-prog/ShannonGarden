"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Five native Ontario perennials in a raised bed. Hold to pour; plants under the stream grow.
const PLANTS = [
  { x: 150, latin: "Echinacea purpurea", common: "Purple coneflower", petal: "#D58AA6", centre: "#7A4A25" },
  { x: 225, latin: "Rudbeckia hirta", common: "Black-eyed Susan", petal: "#E7B53B", centre: "#3A2A1A" },
  { x: 300, latin: "Asclepias tuberosa", common: "Butterfly milkweed", petal: "#E2803A", centre: "#C4552A" },
  { x: 375, latin: "Monarda fistulosa", common: "Wild bergamot", petal: "#B79BC9", centre: "#8B6AA3" },
  { x: 450, latin: "Symphyotrichum novae-angliae", common: "New England aster", petal: "#8467B3", centre: "#E6B63C" },
];

const GROUND = 340;
const CAN_Y = 112;
const TILT = 35;
const MIN_X = 52;
const MAX_X = 372;
// Spout tip in the can's local frame, rotated by TILT when pouring.
const TIP = { x: 94, y: -36 };
const rad = (TILT * Math.PI) / 180;
const TIP_POUR = {
  x: TIP.x * Math.cos(rad) - TIP.y * Math.sin(rad),
  y: TIP.x * Math.sin(rad) + TIP.y * Math.cos(rad),
};
const REACH = 34;
const GROWTH_PER_MS = 0.055;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ramp = (g: number, from: number, to: number) => clamp((g - from) / (to - from), 0, 1);

export function WateringCan() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [canX, setCanX] = useState(140);
  const [pouring, setPouring] = useState(false);
  const [growth, setGrowth] = useState<number[]>(() => PLANTS.map(() => 0));
  const [lastBloom, setLastBloom] = useState<number | null>(null);
  const canXRef = useRef(canX);
  canXRef.current = canX;
  const growthRef = useRef(growth);
  growthRef.current = growth;

  const bloomed = growth.filter((g) => g >= 100).length;
  const allBloomed = bloomed === PLANTS.length;
  const started = growth.some((g) => g > 0);

  // Grow whichever plant is under the stream while pouring.
  useEffect(() => {
    if (!pouring) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const tx = canXRef.current + TIP_POUR.x;
      const i = PLANTS.findIndex((p) => Math.abs(p.x - tx) < REACH);
      const prev = growthRef.current;
      if (i >= 0 && prev[i] < 100) {
        const next = [...prev];
        next[i] = Math.min(100, prev[i] + dt * GROWTH_PER_MS);
        growthRef.current = next;
        setGrowth(next);
        if (next[i] >= 100) setLastBloom(i);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pouring]);

  const moveTo = useCallback((clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * 540;
    // The pointer steers the spout, which is what the user is aiming.
    setCanX(clamp(x - TIP_POUR.x, MIN_X, MAX_X));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setCanX((x) => clamp(x + (e.key === "ArrowLeft" ? -75 : 75), MIN_X, MAX_X));
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setPouring(true);
    }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") setPouring(false);
  };

  const reset = () => {
    setGrowth(PLANTS.map(() => 0));
    setLastBloom(null);
  };

  const status = allBloomed
    ? "Every plant is in flower."
    : started
      ? `${bloomed} of ${PLANTS.length} plants in flower.`
      : "Five native perennials, just planted.";

  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-[2rem] bg-sage-soft ring-1 ring-forest/10">
        <svg
          ref={svgRef}
          viewBox="0 0 540 440"
          className="block h-auto w-full cursor-grab select-none touch-pan-y focus:outline-none active:cursor-grabbing"
          role="application"
          tabIndex={0}
          aria-label="Watering can game. Use the left and right arrow keys to move the can over a plant, then hold Space or Enter to water it."
          aria-describedby="can-status"
          onPointerMove={(e) => moveTo(e.clientX)}
          onPointerDown={(e) => {
            moveTo(e.clientX);
            (e.target as Element).setPointerCapture?.(e.pointerId);
            setPouring(true);
          }}
          onPointerUp={() => setPouring(false)}
          onPointerCancel={() => setPouring(false)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPouring(false)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => setPouring(false)}
        >
          {/* sky details */}
          <circle cx="470" cy="70" r="34" fill="#F3E2B8" opacity="0.85" />
          <path d="M40 92c14-10 30-10 42 0 10-7 26-7 34 3H40Z" fill="#F6F1E6" opacity="0.8" />

          {/* far shrubs */}
          <path d="M0 300c40-46 92-50 130-14 34-40 92-44 132-6 40-34 110-40 150 2 40-30 100-28 128 4v60H0Z" fill="#A9BF9F" opacity="0.55" />

          {/* raised bed */}
          <rect x="96" y={GROUND - 4} width="412" height="18" rx="6" fill="#3A2A1D" />
          <rect x="88" y={GROUND + 12} width="428" height="64" rx="6" fill="#6B4A33" />
          <path d={`M88 ${GROUND + 30}h428M88 ${GROUND + 52}h428`} stroke="#5A3D29" strokeWidth="2" />
          <rect x="0" y="420" width="540" height="20" fill="#8FA884" />

          {/* damp soil where it's been watered */}
          {PLANTS.map((p, i) => (
            <ellipse key={`damp-${p.x}`} cx={p.x} cy={GROUND + 3} rx="30" ry="6" fill="#241912" opacity={Math.min(0.75, growth[i] / 60)} />
          ))}

          {/* plants */}
          {PLANTS.map((p, i) => (
            <Plant key={p.latin} x={p.x} g={growth[i]} petal={p.petal} centre={p.centre} />
          ))}

          {/* water stream */}
          {pouring && (
            <g aria-hidden>
              {[0, 1, 2, 3, 4].map((k) => (
                <line
                  key={k}
                  x1={canX + TIP_POUR.x - 6 + k * 3}
                  y1={CAN_Y + TIP_POUR.y + 4}
                  x2={canX + TIP_POUR.x - 10 + k * 5}
                  y2={GROUND - 4}
                  stroke="#7FB2D0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  className="animate-[pour_0.45s_linear_infinite]"
                  style={{ animationDelay: `${k * -0.09}s` }}
                  opacity={0.85}
                />
              ))}
              <ellipse cx={canX + TIP_POUR.x - 2} cy={GROUND - 2} rx="18" ry="4" fill="#7FB2D0" opacity="0.35" />
            </g>
          )}

          {/* watering can */}
          <g
            transform={`translate(${canX} ${CAN_Y})`}
            style={{ transition: "transform 120ms ease-out" }}
          >
            <g
              style={{
                transform: `rotate(${pouring ? TILT : 0}deg)`,
                transformBox: "view-box",
                transformOrigin: "0 0",
                transition: "transform 260ms cubic-bezier(.3,.7,.3,1)",
              }}
            >
              <path d="M-36-30C-36-78 26-78 26-30" fill="none" stroke="#8E4A2A" strokeWidth="8" strokeLinecap="round" />
              <path d="M33 2 88-38l7 9-62 49Z" fill="#B5643C" />
              <rect x="84" y="-46" width="16" height="20" rx="4" transform="rotate(-36 92 -36)" fill="#8E4A2A" />
              <path d="M-46-34h80l4 70h-88Z" fill="#B5643C" />
              <path d="M-46-34h80l1 12h-82Z" fill="#8E4A2A" />
              <path d="M-38-14v44" stroke="#D88A5E" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
            </g>
          </g>

          {/* butterfly when everything is in flower */}
          {allBloomed && (
            <g className="animate-[flutter_6s_ease-in-out_infinite]" aria-hidden>
              <g transform="translate(300 170)">
                <path d="M0 0c-14-18-30-12-26 2 3 10 18 10 26-2Z" fill="#E2803A" />
                <path d="M0 0c14-18 30-12 26 2-3 10-18 10-26-2Z" fill="#E2803A" />
                <path d="M0 2c-10 8-18 18-8 20 6 1 8-10 8-20Zm0 0c10 8 18 18 8 20-6 1-8-10-8-20Z" fill="#C4552A" />
                <path d="M0-4v24" stroke="#2A1E14" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            </g>
          )}
        </svg>

        {!started && (
          <p className="pointer-events-none absolute left-5 top-5 rounded-full bg-cream/90 px-3.5 py-1.5 text-xs font-semibold text-forest-deep shadow-sm">
            <span aria-hidden>↔ </span>Move, then press and hold to water
          </p>
        )}
      </div>

      <figcaption className="mt-4 flex min-h-[3rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-ink/70">
        <span id="can-status" aria-live="polite">
          {lastBloom !== null ? (
            <>
              <span className="latin text-base text-forest-deep">{PLANTS[lastBloom].latin}</span>{" "}
              <span>({PLANTS[lastBloom].common}) is in flower. </span>
              <span className="text-ink/55">{allBloomed ? "That's the job: steady care, done properly." : `${bloomed} of ${PLANTS.length}.`}</span>
            </>
          ) : (
            status
          )}
        </span>
        {started && (
          <button type="button" onClick={reset} className="text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest">
            Replant the bed
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function Plant({ x, g, petal, centre }: { x: number; g: number; petal: string; centre: string }) {
  const stem = ramp(g, 5, 70) * 120;
  const leaves = ramp(g, 22, 60);
  const bud = ramp(g, 62, 85);
  const bloom = ramp(g, 85, 100);
  const top = GROUND - stem;

  return (
    <g aria-hidden>
      {/* seed mound */}
      <ellipse cx={x} cy={GROUND - 1} rx="9" ry="3.5" fill="#4A3424" />
      {stem > 0 && (
        <path
          d={`M${x} ${GROUND}C${x - 4} ${GROUND - stem * 0.4} ${x + 4} ${GROUND - stem * 0.7} ${x} ${top}`}
          stroke="#4E7246"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {leaves > 0 && (
        <>
          <Leaf x={x} y={GROUND - stem * 0.32} s={leaves} dir={-1} />
          <Leaf x={x} y={GROUND - stem * 0.52} s={leaves * 0.85} dir={1} />
          {g > 45 && <Leaf x={x} y={GROUND - stem * 0.72} s={leaves * 0.6} dir={-1} />}
        </>
      )}
      {bud > 0 && bloom === 0 && <ellipse cx={x} cy={top - 4 * bud} rx={5 * bud} ry={7 * bud} fill="#5E7F59" />}
      {bloom > 0 && (
        <g transform={`translate(${x} ${top - 4}) scale(${0.3 + bloom * 0.7})`}>
          {Array.from({ length: 10 }, (_, k) => (
            <ellipse key={k} cx="0" cy="-13" rx="4.6" ry="11" fill={petal} transform={`rotate(${k * 36})`} />
          ))}
          <circle r="7.5" fill={centre} />
        </g>
      )}
    </g>
  );
}

function Leaf({ x, y, s, dir }: { x: number; y: number; s: number; dir: 1 | -1 }) {
  return (
    <path
      d="M0 0C6-12 22-16 34-12 26 0 12 6 0 0Z"
      fill="#5E7F59"
      transform={`translate(${x} ${y}) scale(${dir * s} ${s}) rotate(-12)`}
    />
  );
}
