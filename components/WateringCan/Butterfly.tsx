"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import s from "./WateringCan.module.css";
import { POUR_TIP, SCENE } from "./patches";

export type FlyPhase = "flying" | "hover" | "falling" | "grounded" | "shaking" | "takeoff" | "hidden";

const FALL_MS = 900;
const SHAKE_AT = 1500;
const TAKEOFF_AT = 2100;
const DONE_AT = 3000;
const REDUCED_AWAY_MS = 1500;
const HIT_AFTER_MS = 220; // continuous watering before it counts as a soaking
const REST = { x: 300, y: 132 }; // where it hovers when motion is reduced

// A lazy figure-of-eight over the flowers. t in seconds.
function flight(t: number) {
  return {
    x: 280 + 165 * Math.sin(t * 0.42) + 18 * Math.sin(t * 1.7),
    y: 150 + 34 * Math.sin(t * 0.9 + 1) + 9 * Math.sin(t * 2.3),
  };
}

const groundY = (x: number) => (x > 64 && x < 496 ? 322 : 418);
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

type Options = {
  active: boolean;
  reduced: boolean;
  wrapRef: MutableRefObject<HTMLDivElement | null>;
  canRef: MutableRefObject<{ x: number; y: number }>;
  draggingRef: MutableRefObject<boolean>;
  moveCan: (pos: { x: number; y: number } | "rest") => void;
};

/**
 * Drives the butterfly with requestAnimationFrame so the can can "see" where it is.
 * Pour on it and it falls, sits a moment, shakes off the water and flies again.
 */
export function useButterfly({ active, reduced, wrapRef, canRef, draggingRef, moveCan }: Options) {
  const gRef = useRef<SVGGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<FlyPhase>("flying");
  const [pouringOn, setPouringOn] = useState(false);
  const [oops, setOops] = useState(false);
  const [announce, setAnnounce] = useState("");

  const phaseRef = useRef<FlyPhase>("flying");
  const pos = useRef({ ...REST });
  const hit = useRef({ x: 0, y: 0, at: 0 });
  const contactMs = useRef(0);
  const pouringRef = useRef(false);

  const go = useCallback((p: FlyPhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);
  const pour = useCallback((on: boolean) => {
    if (pouringRef.current !== on) {
      pouringRef.current = on;
      setPouringOn(on);
    }
  }, []);

  const soak = useCallback(() => {
    if (phaseRef.current !== "flying" && phaseRef.current !== "hover") return;
    pour(false);
    hit.current = { ...pos.current, at: performance.now() };
    setOops(true);
    setAnnounce("Oops! Easy there, we need our pollinators.");
    go(reduced ? "hidden" : "falling");
  }, [reduced, go, pour]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const ph = phaseRef.current;
      const since = now - hit.current.at;
      let x = pos.current.x, y = pos.current.y, rot = 0;

      if (reduced) {
        x = REST.x;
        y = REST.y;
        if (ph === "hidden" && since > REDUCED_AWAY_MS) {
          setOops(false);
          setAnnounce("");
          go("flying");
        }
      } else if (ph === "flying" || ph === "takeoff") {
        clock += dt / 1000;
        const f = flight(clock);
        rot = 10 * Math.sin(clock * 3);
        if (ph === "takeoff") {
          const q = ease(Math.min(1, (since - TAKEOFF_AT) / (DONE_AT - TAKEOFF_AT)));
          const gy = groundY(hit.current.x);
          x = hit.current.x + (f.x - hit.current.x) * q;
          y = gy + (f.y - gy) * q;
          if (since >= DONE_AT) go("flying");
        } else {
          x = f.x;
          y = f.y;
        }
      } else if (ph === "falling") {
        const p = Math.min(1, since / FALL_MS);
        x = hit.current.x + 16 * Math.sin(p * Math.PI * 3) * (1 - p);
        y = hit.current.y + (groundY(hit.current.x) - hit.current.y) * p * p;
        rot = 55 * Math.sin(p * Math.PI * 4) * (1 - p);
        if (p >= 1) go("grounded");
      } else if (ph === "grounded" || ph === "shaking") {
        x = hit.current.x;
        y = groundY(hit.current.x);
        if (ph === "grounded" && since >= SHAKE_AT) go("shaking");
        if (ph === "shaking" && since >= TAKEOFF_AT) {
          setOops(false);
          setAnnounce("");
          go("takeoff");
        }
      }
      pos.current = { x, y };

      // Is the can pouring on it? Only while it's flying and the user is dragging.
      if (phaseRef.current === "flying" && draggingRef.current) {
        const tipX = canRef.current.x + POUR_TIP.x;
        const tipY = canRef.current.y + POUR_TIP.y;
        const over = Math.abs(tipX - x) < 26 && tipY < y - 4;
        pour(over);
        contactMs.current = over ? contactMs.current + dt : 0;
        if (contactMs.current >= HIT_AFTER_MS) {
          contactMs.current = 0;
          soak();
        }
      } else if (phaseRef.current === "flying") {
        pour(false);
      }

      gRef.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
      const wrap = wrapRef.current;
      if (wrap && buttonRef.current) {
        const k = wrap.clientWidth / SCENE.w;
        buttonRef.current.style.transform = `translate(${(x * k).toFixed(1)}px, ${(y * k).toFixed(1)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, wrapRef, canRef, draggingRef, soak, go, pour]);

  // Reset when the bed is replanted.
  useEffect(() => {
    if (active) return;
    phaseRef.current = "flying";
    setPhase("flying");
    setOops(false);
    pour(false);
  }, [active, pour]);

  // Keyboard: hold the butterfly still, bring the can over and give it a short pour.
  const waterFromButton = () => {
    if (phaseRef.current !== "flying") return;
    if (reduced) {
      soak();
      return;
    }
    go("hover");
    const p = pos.current;
    moveCan({ x: p.x - POUR_TIP.x, y: p.y - POUR_TIP.y - 48 });
    window.setTimeout(() => pour(true), 480);
    window.setTimeout(() => {
      soak();
      moveCan("rest");
    }, 900);
  };

  return { gRef, buttonRef, phase, pouringOn, posRef: pos, oops, announce, waterFromButton };
}

export function ButterflyArt({ phase }: { phase: FlyPhase }) {
  const mode = phase === "shaking" ? s.shake : phase === "falling" || phase === "grounded" ? s.still : s.flap;
  const wing = (
    <>
      <path d="M0-2C-6-20-26-26-30-14-33-4-18 2 0 0Z" fill="#E2803A" stroke="#2A1E14" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M0 1C-14 2-24 10-20 20-15 26-4 16 0 4Z" fill="#D86E2A" stroke="#2A1E14" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M-4-4L-24-14M-4 2L-18 14" stroke="#2A1E14" strokeWidth="0.8" />
      <circle cx="-27" cy="-13" r="1.3" fill="#F6F1E6" />
      <circle cx="-22" cy="-20" r="1.1" fill="#F6F1E6" />
      <circle cx="-18" cy="19" r="1.1" fill="#F6F1E6" />
    </>
  );
  return (
    <g className={mode}>
      <g className={s.wing}>{wing}</g>
      <g transform="scale(-1 1)">
        <g className={s.wing}>{wing}</g>
      </g>
      <path d="M0-8v22" stroke="#2A1E14" strokeWidth="3" strokeLinecap="round" />
      <path d="M0-8C-2-14-5-17-7-18M0-8C2-14 5-17 7-18" stroke="#2A1E14" strokeWidth="0.9" fill="none" />
      {phase === "shaking" &&
        [
          [-34, -14], [-26, 10], [-18, -26], [34, -12], [26, 12], [18, -24],
        ].map(([dx, dy], i) => (
          <circle
            key={i}
            r="1.8"
            fill="#8CB8D4"
            className={s.flick}
            style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--d": `${(i % 3) * 120}ms` } as CSSProperties}
          />
        ))}
    </g>
  );
}
