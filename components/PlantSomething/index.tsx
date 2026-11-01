"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlantArt, PlantLabel } from "@/components/PlantArt";
import { useSvgDrag } from "@/components/scene/useSvgDrag";
import { Can } from "@/components/scene/Can";
import { Droplets } from "@/components/scene/Droplets";
import { POUR_TIP, SOAK_MS } from "@/components/scene/pour";
import { plants, type Plant } from "@/lib/plants";
import s from "./PlantSomething.module.css";

type Phase = "dig" | "plant" | "water" | "grown";
type Pt = { x: number; y: number };

// A wide (about 1.9:1) scene: the seed tray on the left, the plot in the middle, the tools waiting on the right.
const W = 560;
const H = 300;
const SPOT = { x: 300, y: 222 };
const PILE = { x: 354, y: 218 };
const SHOVEL_REST = { x: 505, y: 176 };
const TRAY = { x: 64, y: 284 };
const CAN_REST = { x: 430, y: 80 };
const DIGS = 1; // one push of the shovel digs the whole hole
const CAN_K = 0.78; // the can is drawn for the larger home scene
const HOLE_SCALE = [0, 1];

const STEPS: { phase: Phase; label: string; hint: string; action: string }[] = [
  { phase: "dig", label: "Dig", hint: "Drag the shovel into the soil to dig", action: "Dig" },
  { phase: "plant", label: "Plant", hint: "Drop the seed in the hole", action: "Plant the seed" },
  { phase: "water", label: "Water", hint: "Water it in", action: "Water" },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

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

function pickPlant(exceptId?: string): Plant {
  const pool = plants.filter((p) => p.id !== exceptId);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** One plant, three steps: dig a hole, drop it in, water it in. */
export function PlantSomething() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const { begin, svgHandlers, dragging } = useSvgDrag(svgRef);

  const [plant, setPlant] = useState<Plant>(plants[0]);
  const [phase, setPhase] = useState<Phase>("dig");
  const [digs, setDigs] = useState(0);
  const [shovel, setShovel] = useState<Pt>(SHOVEL_REST);
  const [item, setItem] = useState<Pt>(TRAY);
  const [sunk, setSunk] = useState(false);
  const [filled, setFilled] = useState(false);
  const [can, setCan] = useState<Pt>(CAN_REST);
  const [autoPour, setAutoPour] = useState(false);
  const [moist, setMoist] = useState(0);
  const [announce, setAnnounce] = useState("");
  const armed = useRef(true);
  const digsRef = useRef(0);
  const moistRef = useRef(0);
  const timers = useRef<number[]>([]);

  // A different plant each visit (chosen after mount so server and browser agree on first render).
  useEffect(() => setPlant(pickPlant()), []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const tip = { x: can.x + POUR_TIP.x * CAN_K, y: can.y + POUR_TIP.y * CAN_K };
  const overSpot = Math.abs(tip.x - SPOT.x) < 40 && tip.y < SPOT.y;
  const pouring = phase === "water" && (autoPour || (dragging === "can" && overSpot));

  // ---- 1. Dig ----------------------------------------------------------------

  const dig = useCallback(() => {
    if (digsRef.current >= DIGS) return;
    digsRef.current += 1;
    setDigs(digsRef.current);
    if (digsRef.current === DIGS) {
      later(() => {
        setPhase("plant");
        setShovel(SHOVEL_REST);
        setAnnounce(`Hole dug. Step 2 of 3, plant: ${startText(plant)} is in the tray.`);
      }, 450);
    }
  }, [plant]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveShovel = (p: Pt) => {
    const next = { x: clamp(p.x, 40, 540), y: clamp(p.y, 140, SPOT.y + 4) };
    setShovel(next);
    const inSoil = Math.abs(next.x - SPOT.x) < 38 && next.y >= SPOT.y - 6;
    if (inSoil && armed.current) {
      armed.current = false;
      dig();
    } else if (next.y < SPOT.y - 40) {
      armed.current = true;
    }
  };

  const digFromButton = () => {
    if (phase !== "dig") return;
    if (reduced) {
      while (digsRef.current < DIGS) dig();
      return;
    }
    for (let k = digsRef.current; k < DIGS; k++) {
      const t = (k - digsRef.current) * 620;
      later(() => setShovel({ x: SPOT.x + 4, y: SPOT.y + 2 }), t);
      later(dig, t + 300);
      later(() => setShovel({ x: SPOT.x + 14, y: SPOT.y - 64 }), t + 340);
    }
  };

  // ---- 2. Plant --------------------------------------------------------------

  const plantIt = () => {
    setItem(SPOT);
    setSunk(true);
    later(() => {
      setFilled(true);
      setPhase("water");
      setAnnounce(`Planted and covered over. Step 3 of 3, water: the watering can is ready.`);
    }, reduced ? 0 : 420);
  };

  const dropItem = (p: Pt) => {
    if (Math.abs(p.x - SPOT.x) < 42 && Math.abs(p.y - SPOT.y) < 34) plantIt();
    else setItem(TRAY);
  };

  const plantFromButton = () => {
    if (phase !== "plant") return;
    setItem(SPOT);
    later(plantIt, reduced ? 0 : 320);
  };

  // ---- 3. Water --------------------------------------------------------------

  useEffect(() => {
    if (!pouring) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      moistRef.current = Math.min(1, moistRef.current + dt / SOAK_MS);
      setMoist(moistRef.current);
      if (moistRef.current >= 1) {
        setAutoPour(false);
        setCan(CAN_REST);
        setPhase("grown");
        setAnnounce(`Watered in. ${plant.commonName}, ${plant.botanicalName}, is growing.`);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pouring, plant]);

  const waterFromButton = () => {
    if (phase !== "water") return;
    if (reduced) {
      moistRef.current = 1;
      setMoist(1);
      setPhase("grown");
      setAnnounce(`Watered in. ${plant.commonName}, ${plant.botanicalName}, is growing.`);
      return;
    }
    setCan({ x: SPOT.x - POUR_TIP.x * CAN_K, y: 100 });
    later(() => setAutoPour(true), 480);
  };

  // ---- Reset -----------------------------------------------------------------

  const plantAnother = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const next = pickPlant(plant.id);
    setPlant(next);
    setPhase("dig");
    digsRef.current = 0;
    setDigs(0);
    armed.current = true;
    setShovel(SHOVEL_REST);
    setItem(TRAY);
    setSunk(false);
    setFilled(false);
    setCan(CAN_REST);
    setAutoPour(false);
    moistRef.current = 0;
    setMoist(0);
    setAnnounce(`New patch of soil. Step 1 of 3, dig.`);
  };

  const step = STEPS.findIndex((x) => x.phase === phase);
  const current = STEPS[step] && {
    ...STEPS[step],
    ...(phase === "plant" && plant.start === "pot" ? { hint: "Drop the plant in the hole", action: "Plant it" } : {}),
  };
  const holeK = filled ? 0 : HOLE_SCALE[digs];

  return (
    <figure>
      <ol className="mb-2 flex gap-5 text-[0.92rem]" aria-label="Steps">
        {STEPS.map((x, i) => {
          const done = phase === "grown" || i < step;
          const now = i === step;
          return (
            <li key={x.phase} aria-current={now ? "step" : undefined} className={`flex items-center gap-2 ${now ? "font-semibold text-ink" : done ? "text-forest" : "text-ink/55"}`}>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[0.8rem] ${
                  now ? "border-ink bg-ink text-cream" : done ? "border-forest bg-forest text-cream" : "border-ink/40"
                }`}
              >
                {done ? <span aria-hidden>✓</span> : i + 1}
              </span>
              {x.label}
              {done && <span className="sr-only"> (done)</span>}
            </li>
          );
        })}
      </ol>

      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#E3EBDC]">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" aria-hidden {...svgHandlers}>
          {/* sky, sun and distant shrubs, as in the original home scene */}
<circle cx="490" cy="50" r="26" fill="#F3E2B8" opacity="0.85" />
          <path d="M34 64c14-10 30-10 42 0 10-7 26-7 34 3H34Z" fill="#F6F1E6" opacity="0.8" />
          <path d="M0 200c40-46 92-50 130-14 34-40 92-44 132-6 40-34 110-40 150 2 40-30 100-28 148 4v80H0Z" fill="#A9BF9F" opacity="0.55" />
          <rect x="0" y="252" width={W} height="48" fill="#8FA884" />

          {/* a patch of open ground */}
          <path d="M150 192H450L482 252H118Z" fill="#6B4F3A" />
          <path d="M150 192H450" stroke="#5A4231" strokeWidth="2" />
          <path d="M118 252H482L480 258H120Z" fill="#5A4231" />

          {/* watered soil */}
          <ellipse cx={SPOT.x} cy={SPOT.y + 2} rx="46" ry="13" fill="#3E2C20" opacity={moist * 0.95} />

          {/* the hole, deepening with each scoop */}
          <g transform={`translate(${SPOT.x} ${SPOT.y})`}>
            <g className={s.dig} style={{ transform: `scale(${holeK})`, opacity: holeK ? 1 : 0 }}>
              <ellipse rx="30" ry="10" fill="#3E2C20" />
              <ellipse rx="30" ry="10" fill="none" stroke="#2E2018" strokeWidth="2" />
              <ellipse cy="2.5" rx="21" ry="6" fill="#24180F" />
            </g>
          </g>

          {/* the spoil pile beside it */}
          <g transform={`translate(${PILE.x} ${PILE.y})`}>
            <g className={s.dig} style={{ transform: `scale(${holeK})`, opacity: holeK ? 1 : 0 }}>
              <path d="M-28 0C-22-14-8-21 2-21 13-21 24-13 30 0Z" fill="#7A5A42" />
              <path d="M-14-8l3-2M4-14l3 1M12-6l3-2" stroke="#5A4231" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>

          {/* backfilled and settled */}
          {filled && (
            <g transform={`translate(${SPOT.x} ${SPOT.y + 2})`}>
              <path className={s.settle} d="M-26 0C-16-9 16-9 26 0Z" fill="#5E4433" />
            </g>
          )}

          {phase === "grown" && <PlantArt key={plant.id} plant={plant} x={SPOT.x} y={SPOT.y - 2} />}

          {/* 2. the seed packet or potted plant, in its tray */}
          <rect x={TRAY.x - 44} y={TRAY.y - 2} width="88" height="14" rx="2" fill="#9C7A58" opacity={phase === "plant" || phase === "dig" ? 1 : 0} className={s.fade} />
          {(phase === "plant" || (phase === "water" && !filled)) && (
            <g
              className={dragging === "item" ? "" : s.glide}
              style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
            >
              <g className={s.sink} style={{ transform: sunk ? "scale(0.2)" : "none", opacity: sunk ? 0 : 1 }}>
                <g
                  style={{ cursor: dragging === "item" ? "grabbing" : "grab", touchAction: "none" }}
                  onPointerDown={(e) => phase === "plant" && begin(e, "item", item, (p) => setItem({ x: clamp(p.x, 20, 540), y: clamp(p.y, 56, 296) }), dropItem)}
                >
                  <StartItem plant={plant} />
                  <rect x="-30" y="-56" width="60" height="64" fill="transparent" />
                </g>
              </g>
            </g>
          )}

          {/* water */}
          {pouring && !reduced && <Droplets x={tip.x} y={tip.y} landY={SPOT.y} />}

          {/* 1. the shovel */}
          <g className={s.fade} style={{ opacity: phase === "dig" ? 1 : 0, pointerEvents: phase === "dig" ? "auto" : "none" }}>
            <g className={dragging === "shovel" ? "" : s.glide} style={{ transform: `translate(${shovel.x}px, ${shovel.y}px)` }}>
              <g
                transform="rotate(-12)"
                style={{ cursor: dragging === "shovel" ? "grabbing" : "grab", touchAction: "none" }}
                onPointerDown={(e) => begin(e, "shovel", shovel, moveShovel, () => setShovel((p) => ({ ...p, y: Math.min(p.y, SPOT.y - 46) })))}
              >
                <Shovel />
                <rect x="-26" y="-150" width="52" height="160" fill="transparent" />
              </g>
            </g>
          </g>

          {/* 3. the can */}
          <g className={s.fade} style={{ opacity: phase === "water" ? 1 : 0, pointerEvents: phase === "water" ? "auto" : "none" }}>
            <g className={dragging === "can" ? "" : s.glide} style={{ transform: `translate(${can.x}px, ${can.y}px)` }}>
              <g
                style={{ cursor: dragging === "can" ? "grabbing" : "grab", touchAction: "none" }}
                onPointerDown={(e) => !autoPour && begin(e, "can", can, (p) => setCan({ x: clamp(p.x, 44, 470), y: clamp(p.y, 56, 160) }), () => undefined)}
              >
                <g transform={`scale(${CAN_K})`}>
                  <Can tilted={pouring} />
                  <circle r="72" cx="20" cy="-10" fill="transparent" />
                </g>
              </g>
            </g>
          </g>
        </svg>

        {current && (
          <p className="pointer-events-none absolute left-4 top-4 rounded-full bg-cream/95 px-3.5 py-1.5 text-[0.88rem] font-semibold text-ink">
            {current.hint}
          </p>
        )}

        {/* The same three steps as buttons, for keyboards and switch users. */}
        {current && (
          <button
            type="button"
            onClick={phase === "dig" ? digFromButton : phase === "plant" ? plantFromButton : waterFromButton}
            className="absolute bottom-3 right-3 rounded-full bg-cream px-4 py-2 text-[0.92rem] font-semibold text-ink shadow-[0_1px_0_rgb(28_33_27/0.2)] hover:bg-cream"
          >
            {current.action}
          </button>
        )}
      </div>

      <figcaption className="mt-3">
        {/* Fixed height, sized for the longest name and description, so the button below never moves. */}
        <div className="h-[11rem] md:h-[5.75rem]">
          {phase === "grown" ? (
            <div key={plant.id} className="animate-[settle_400ms_ease-out_1.2s_both] motion-reduce:animate-none">
              <PlantLabel plant={plant} description row />
            </div>
          ) : (
            <p className="pt-1 text-ink/65">Something from my plant list is waiting in the tray. Dig, plant, water, and see what grows.</p>
          )}
        </div>
        <button type="button" onClick={plantAnother} className={`btn-quiet ${phase === "grown" ? "" : "invisible"}`}>
          Plant another
        </button>
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </figure>
  );
}

function startText(plant: Plant) {
  return plant.start === "pot" ? `a young ${plant.commonName.toLowerCase()} in a pot` : `a packet of ${plant.commonName.toLowerCase()} seeds`;
}

function StartItem({ plant }: { plant: Plant }) {
  if (plant.start === "pot") {
    return (
      <g>
        <path d="M-6-26C-14-36-20-38-24-36-20-30-12-28-6-26ZM4-28C10-40 18-44 22-42 20-34 12-30 4-28Z" fill="#5E7F59" stroke="#46663F" strokeWidth="0.8" />
        <path d="M0-24V-40" stroke="#4E7246" strokeWidth="2" />
        <path d="M-15-26H15L11 0H-11Z" fill="#A0643F" stroke="#7A4A2E" strokeWidth="1" />
        <rect x="-17" y="-29" width="34" height="6" rx="1.5" fill="#B0714A" stroke="#7A4A2E" strokeWidth="1" />
      </g>
    );
  }
  return (
    <g>
      <rect x="-16" y="-46" width="32" height="46" rx="2" fill="#F6F1E6" stroke="#1C211B" strokeOpacity="0.3" />
      <rect x="-16" y="-46" width="32" height="8" rx="2" fill={plant.tone} />
      <path d="M0-8V-18" stroke="#4E7246" strokeWidth="1.6" />
      <circle cx="0" cy="-23" r="6" fill={plant.tone} stroke="#1C211B" strokeOpacity="0.25" />
      <circle cx="0" cy="-23" r="2" fill="#5A4231" />
    </g>
  );
}

function Shovel() {
  return (
    <g>
      <path d="M-10-128C-10-144 10-144 10-128" fill="none" stroke="#7A5A40" strokeWidth="4" />
      <path d="M-10-128H10" stroke="#7A5A40" strokeWidth="4" strokeLinecap="round" />
      <path d="M0-128V-34" stroke="#8A6A4C" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M-12-36H12L10-9C6 0-6 0-10-9Z" fill="#A7AFA6" stroke="#6F786F" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M-5-30V-12" stroke="#C9CFC6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}
