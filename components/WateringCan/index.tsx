"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlantLabel } from "@/components/PlantArt";
import { getPlant } from "@/lib/plants";
import { ButterflyArt, useButterfly } from "./Butterfly";
import { CAN_MAX_X, CAN_MIN_X, CAN_START_X, CAN_Y, GROUND, POUR_TIP, SCENE, TILT } from "./geometry";
import s from "./WateringCan.module.css";

// Five native Ontario perennials in a raised bed (restored from the original build). Hold to pour;
// plants under the stream grow. Names come from lib/plants.ts; the drawings are this scene's own.
const PLANTS = [
  { id: "coneflower", x: 150, petal: "#D58AA6", centre: "#7A4A25" },
  { id: "rudbeckia", x: 225, petal: "#E7B53B", centre: "#3A2A1A" },
  { id: "milkweed", x: 300, petal: "#E2803A", centre: "#C4552A" },
  { id: "monarda", x: 375, petal: "#B79BC9", centre: "#8B6AA3" },
  { id: "aster", x: 450, petal: "#8467B3", centre: "#E6B63C" },
];

const REACH = 34;
const GROWTH_PER_MS = 0.055;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ramp = (g: number, from: number, to: number) => clamp((g - from) / (to - from), 0, 1);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function WateringCan() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [canX, setCanX] = useState(CAN_START_X);
  const [pouring, setPouring] = useState(false);
  const [growth, setGrowth] = useState<number[]>(() => PLANTS.map(() => 0));
  const [lastBloom, setLastBloom] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const [flyIn, setFlyIn] = useState(false);
  const canXRef = useRef(canX);
  canXRef.current = canX;
  const growthRef = useRef(growth);
  growthRef.current = growth;
  const canRef = useRef({ x: canX, y: CAN_Y });
  canRef.current = { x: canX, y: CAN_Y };
  const pouringRef = useRef(pouring);
  pouringRef.current = pouring;

  const allBloomed = growth.every((g) => g >= 100);
  const started = growth.some((g) => g > 0);

  // Grow whichever plant is under the stream while pouring.
  useEffect(() => {
    if (!pouring) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const tx = canXRef.current + POUR_TIP.x;
      const i = PLANTS.findIndex((p) => Math.abs(p.x - tx) < REACH);
      const prev = growthRef.current;
      if (i >= 0 && prev[i] < 100) {
        const next = [...prev];
        next[i] = Math.min(100, prev[i] + dt * GROWTH_PER_MS);
        growthRef.current = next;
        setGrowth(next);
        if (next[i] >= 100) {
          const plant = getPlant(PLANTS[i].id);
          setLastBloom(i);
          setAnnounce(`${plant.commonName}, ${plant.botanicalName}, is in flower.`);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pouring]);

  // The butterfly arrives once the last flower has opened.
  useEffect(() => {
    if (!allBloomed) {
      setFlyIn(false);
      return;
    }
    const t = window.setTimeout(() => setFlyIn(true), reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [allBloomed, reduced]);

  const moveCan = useCallback((pos: { x: number; y: number } | "rest") => {
    if (pos !== "rest") setCanX(clamp(pos.x, CAN_MIN_X, CAN_MAX_X));
  }, []);

  // Pouring on the butterfly counts while the user is holding the can down.
  const fly = useButterfly({ active: flyIn, reduced, wrapRef, canRef, draggingRef: pouringRef, moveCan });

  const moveTo = useCallback((clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * SCENE.w;
    // The pointer steers the spout, which is what the user is aiming.
    setCanX(clamp(x - POUR_TIP.x, CAN_MIN_X, CAN_MAX_X));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setCanX((x) => clamp(x + (e.key === "ArrowLeft" ? -75 : 75), CAN_MIN_X, CAN_MAX_X));
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
    setAnnounce("The bed is replanted.");
  };

  const tilted = pouring || fly.pouringOn;
  const streamEnd = fly.pouringOn ? fly.posRef.current.y - 6 : GROUND - 4;

  return (
    <figure className="relative">
      <div ref={wrapRef} className="relative overflow-hidden rounded-[2rem] bg-sage-soft ring-1 ring-forest/10">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
          className="block h-auto w-full cursor-grab select-none touch-pan-y focus:outline-none active:cursor-grabbing"
          role="application"
          tabIndex={0}
          aria-label="Watering can game. Use the left and right arrow keys to move the can over a plant, then hold Space or Enter to water it."
          onPointerMove={(e) => moveTo(e.clientX)}
          onPointerDown={(e) => {
            moveTo(e.clientX);
            try {
              (e.target as Element).setPointerCapture?.(e.pointerId);
            } catch {
              // The pointer may already be gone; pouring still works while it's held over the scene.
            }
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
            <Plant key={p.id} x={p.x} g={growth[i]} petal={p.petal} centre={p.centre} />
          ))}

          {/* water stream */}
          {tilted && (
            <g aria-hidden>
              {[0, 1, 2, 3, 4].map((k) => (
                <line
                  key={k}
                  x1={canX + POUR_TIP.x - 6 + k * 3}
                  y1={CAN_Y + POUR_TIP.y + 4}
                  x2={canX + POUR_TIP.x - 10 + k * 5}
                  y2={streamEnd}
                  stroke="#7FB2D0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  className={s.stream}
                  style={{ animationDelay: `${k * -0.09}s` }}
                  opacity={0.85}
                />
              ))}
              <ellipse cx={canX + POUR_TIP.x - 2} cy={streamEnd + 2} rx="18" ry="4" fill="#7FB2D0" opacity="0.35" />
            </g>
          )}

          {/* butterfly, once everything is in flower */}
          {flyIn && fly.phase !== "hidden" && (
            <g ref={fly.gRef}>
              <ButterflyArt phase={fly.phase} />
            </g>
          )}

          {/* watering can */}
          <g transform={`translate(${canX} ${CAN_Y})`} style={{ transition: "transform 120ms ease-out" }}>
            <g
              style={{
                transform: `rotate(${tilted ? TILT : 0}deg)`,
                transformBox: "view-box",
                transformOrigin: "0 0",
                transition: reduced ? "none" : "transform 260ms cubic-bezier(.3,.7,.3,1)",
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
        </svg>

        {flyIn && (
          <button
            ref={fly.buttonRef}
            type="button"
            onClick={fly.waterFromButton}
            aria-label="Water the butterfly"
            className="absolute left-0 top-0 -ml-6 -mt-6 h-12 w-12 rounded-full"
          />
        )}

        <p
          className={`${s.oops} pointer-events-none absolute inset-x-0 bottom-2 text-center`}
          style={{ opacity: fly.oops ? 1 : 0 }}
          aria-hidden
        >
          <span className="inline-block rounded-full bg-cream px-3 py-1 text-[0.88rem] font-semibold text-forest-deep sm:text-[0.95rem]">
            Oops! Easy there, we need our pollinators.
          </span>
        </p>

        <p
          className={`${s.hint} pointer-events-none absolute left-5 top-5 rounded-full bg-cream/90 px-3.5 py-1.5 text-xs font-semibold text-forest-deep shadow-sm`}
          style={{ opacity: started ? 0 : 1 }}
          aria-hidden={started}
        >
          <span aria-hidden>↔ </span>Move, then press and hold to water
        </p>
      </div>

      <figcaption className="mt-4">
        {/* Fixed height, sized for the longest name wrapping to two lines, so Replant never moves. */}
        <div className="h-[7.25rem]">
          {lastBloom !== null ? (
            <div key={lastBloom} className={`${s.tag} inline-block rounded-md bg-cream-warm px-4 py-2.5 ring-1 ring-forest/10`}>
              <PlantLabel plant={getPlant(PLANTS[lastBloom].id)} />
            </div>
          ) : (
            <p className="pt-2.5 text-ink/70">Five native perennials, just planted.</p>
          )}
        </div>
        <button
          type="button"
          onClick={reset}
          className={`text-[0.98rem] font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest ${started ? "" : "invisible"}`}
        >
          Replant the bed
        </button>
        <p className="mt-3 min-h-[1.7em] text-[0.98rem] text-ink/70">
          {allBloomed && <span className={s.done}>That&apos;s the job: steady care, done properly.</span>}
        </p>
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
      <p className="sr-only" aria-live="polite">
        {fly.announce}
      </p>
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
