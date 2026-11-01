"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Can } from "./Can";
import { Plant } from "./Plants";
import { CAN_BOUNDS, CAN_START, PATCHES, PATCH_RX, PATCH_RY, POUR_TIP, SCENE, SOAK_MS, cracks } from "./patches";
import s from "./WateringCan.module.css";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fresh = () => PATCHES.map(() => 0);

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

/** Which dry patch the water would land on from this can position, if any. */
function patchUnder(x: number, moist: number[]) {
  const landX = x + POUR_TIP.x;
  return PATCHES.findIndex((p, i) => moist[i] < 1 && Math.abs(p.cx - landX) < PATCH_RX * 0.8);
}

export function WateringCan() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  const [can, setCan] = useState(CAN_START);
  const [dragging, setDragging] = useState(false);
  const [auto, setAuto] = useState<number | null>(null); // patch being watered from a button press
  const [moist, setMoist] = useState(fresh);
  const [started, setStarted] = useState(false);
  const [announce, setAnnounce] = useState("");
  const grabOffset = useRef({ x: 0, y: 0 });
  const moistRef = useRef(moist);
  moistRef.current = moist;

  const pouring = auto ?? (dragging ? patchUnder(can.x, moist) : -1);
  const grown = moist.map((m) => m >= 1);
  const allGrown = grown.every(Boolean);
  const crackPaths = useMemo(() => PATCHES.map((_, i) => cracks(i + 3)), []);

  const finish = useCallback((i: number) => {
    const p = PATCHES[i];
    setAnnounce(`The ${p.patchName} patch is soaked. ${p.common}, ${p.latin}, is coming into flower.`);
  }, []);

  // Soak whichever patch is being poured on, about 1.5s of continuous watering.
  useEffect(() => {
    if (pouring < 0) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const prev = moistRef.current;
      if (prev[pouring] < 1) {
        const next = [...prev];
        next[pouring] = Math.min(1, prev[pouring] + dt / SOAK_MS);
        moistRef.current = next;
        setMoist(next);
        if (next[pouring] >= 1) {
          finish(pouring);
          setAuto(null);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pouring, finish]);

  const toScene = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: pt.x, y: pt.y };
  };

  const onCanDown = (e: React.PointerEvent<SVGGElement>) => {
    if (e.button !== 0 || auto !== null) return;
    const p = toScene(e);
    grabOffset.current = { x: p.x - can.x, y: p.y - can.y };
    svgRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    setStarted(true);
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const p = toScene(e);
    setCan({
      x: clamp(p.x - grabOffset.current.x, CAN_BOUNDS.minX, CAN_BOUNDS.maxX),
      y: clamp(p.y - grabOffset.current.y, CAN_BOUNDS.minY, CAN_BOUNDS.maxY),
    });
  };

  const onUp = () => setDragging(false);

  // Keyboard and tap path: the same watering, triggered from a patch button.
  const waterPatch = (i: number) => {
    if (moistRef.current[i] >= 1 || dragging) return;
    setStarted(true);
    if (reduced) {
      const next = [...moistRef.current];
      next[i] = 1;
      moistRef.current = next;
      setMoist(next);
      finish(i);
      return;
    }
    setCan({ x: PATCHES[i].cx - POUR_TIP.x, y: 150 });
    // Let the can glide over before it starts to pour.
    window.setTimeout(() => setAuto(i), 480);
  };

  const replant = () => {
    setMoist(fresh());
    moistRef.current = fresh();
    setAuto(null);
    setCan(CAN_START);
    setAnnounce("The bed is replanted with dry soil.");
  };

  const tip = { x: can.x + POUR_TIP.x, y: can.y + POUR_TIP.y };
  const target = pouring >= 0 ? PATCHES[pouring] : null;

  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#DDE4D3]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
          className="block h-auto w-full select-none"
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden
        >
          <defs>
            {PATCHES.map((p, i) => (
              <clipPath key={i} id={`patch-${i}`}>
                <ellipse cx={p.cx} cy={p.cy} rx={PATCH_RX} ry={PATCH_RY} />
              </clipPath>
            ))}
          </defs>

          {/* city fence boards behind the bed */}
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={i * 40 + 2} y={48 + (i % 3) * 3} width="37" height="300" fill={i % 2 ? "#D3DBC8" : "#D7DFCC"} />
          ))}
          <rect x="0" y="120" width="560" height="5" fill="#C9D2BD" />
          <rect x="0" y="250" width="560" height="5" fill="#C9D2BD" />

          {/* ground and shadow */}
          <rect x="0" y="392" width="560" height="48" fill="#A9B79B" />
          <ellipse cx="280" cy="410" rx="260" ry="10" fill="#1E2A1F" opacity="0.12" />

          {/* raised bed: soil surface in perspective, timber front */}
          <path d="M70 282H490L522 338H38Z" fill="#6B4F3A" />
          <path d="M70 282H490" stroke="#5A4231" strokeWidth="2" />
          <rect x="34" y="336" width="492" height="10" rx="2" fill="#9C7A58" />
          <rect x="38" y="346" width="484" height="58" fill="#8A6A4C" />
          <path d="M38 365H522M38 385H522M150 346v19M330 346v19M240 365v20M440 365v20M110 385v19M390 385v19" stroke="#6E5239" strokeWidth="1.5" />

          {/* the three dry patches, darkening as they soak */}
          {PATCHES.map((p, i) => (
            <g key={p.kind}>
              <ellipse cx={p.cx} cy={p.cy} rx={PATCH_RX} ry={PATCH_RY} fill="#B39A7E" />
              <g clipPath={`url(#patch-${i})`} opacity={1 - moist[i]}>
                <g transform={`translate(${p.cx} ${p.cy})`} stroke="#7E644C" strokeWidth="1.2" fill="none" strokeLinejoin="round">
                  {crackPaths[i].map((d, k) => (
                    <path key={k} d={d} />
                  ))}
                </g>
              </g>
              <ellipse cx={p.cx} cy={p.cy} rx={PATCH_RX} ry={PATCH_RY} fill="#3E2C20" opacity={moist[i] * 0.95} />
              {moist[i] > 0.85 && <ellipse cx={p.cx - 12} cy={p.cy - 4} rx="14" ry="3" fill="#FFFFFF" opacity={(moist[i] - 0.85) * 1.2} />}
            </g>
          ))}

          {/* plants grow once a patch is soaked */}
          {PATCHES.map((p, i) => grown[i] && <Plant key={p.kind} kind={p.kind} cx={p.cx} cy={p.cy - 2} />)}

          {/* water */}
          {target && !reduced && (
            <g>
              {Array.from({ length: 8 }, (_, k) => (
                <g key={k} transform={`translate(${tip.x - 8 + (k % 4) * 5} ${tip.y + 4})`}>
                  <path
                    className={s.drop}
                    d="M0-4C1.6-1 2.4 0.4 2.4 1.6a2.4 2.4 0 0 1-4.8 0C-2.4.4-1.6-1 0-4Z"
                    fill="#8CB8D4"
                    style={{ "--d": `${k * -70}ms`, "--fall": `${target.cy - tip.y - 8}px` } as CSSProperties}
                  />
                </g>
              ))}
              <ellipse className={s.ripple} cx={tip.x - 2} cy={target.cy} rx="20" ry="5" fill="none" stroke="#8CB8D4" strokeWidth="1.5" />
            </g>
          )}

          {/* the can */}
          <g
            className={dragging ? "" : s.canMoving}
            style={{ transform: `translate(${can.x}px, ${can.y}px)` }}
          >
            <g
              onPointerDown={onCanDown}
              style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
            >
              <Can tilted={pouring >= 0} />
              {/* generous invisible grab area for fingers */}
              <circle r="72" cx="20" cy="-10" fill="transparent" />
            </g>
          </g>
        </svg>

        {/* Each patch is also a button: the keyboard and tap path to the same growth. */}
        {PATCHES.map((p, i) => (
          <button
            key={p.kind}
            type="button"
            onClick={() => waterPatch(i)}
            aria-disabled={grown[i]}
            aria-label={grown[i] ? `${p.common} is in flower` : `Water the ${p.patchName} patch`}
            className="absolute rounded-[50%] focus-visible:outline-offset-0"
            style={{
              left: `${((p.cx - PATCH_RX) / SCENE.w) * 100}%`,
              top: `${((p.cy - PATCH_RY - 6) / SCENE.h) * 100}%`,
              width: `${((PATCH_RX * 2) / SCENE.w) * 100}%`,
              height: `${((PATCH_RY * 2 + 12) / SCENE.h) * 100}%`,
            }}
          />
        ))}

        {/* plant tags, once in flower */}
        {PATCHES.map(
          (p, i) =>
            grown[i] && (
              <div
                key={p.kind}
                className={`${s.tag} pointer-events-none absolute w-[30%] -translate-x-1/2 text-center`}
                style={{ left: `${(p.cx / SCENE.w) * 100}%`, top: `${(352 / SCENE.h) * 100}%` }}
              >
                <span className="inline-block rounded-[3px] bg-paper px-2 py-1 leading-tight shadow-[0_1px_0_rgb(30_42_31/0.2)] sm:px-2.5">
                  <span className="block text-[0.68rem] font-semibold sm:text-[0.8rem]">{p.common}</span>
                  <span className="latin block text-[0.74rem] text-loam/75 sm:text-[0.9rem]">{p.latin}</span>
                </span>
              </div>
            ),
        )}

        <p
          className={`${s.hint} pointer-events-none absolute left-4 top-4 rounded-full bg-paper/95 px-3.5 py-1.5 text-[0.88rem] font-semibold text-loam`}
          style={{ opacity: started ? 0 : 1 }}
          aria-hidden={started}
        >
          Drag the can over the dry soil
        </p>
      </div>

      <figcaption className="mt-4 flex min-h-[2.75rem] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[0.98rem]">
        {allGrown ? (
          <p className={s.done}>
            That&apos;s the job, more or less.{" "}
            <Link href="/contact" className="link font-semibold">
              Want me to do yours?
            </Link>
          </p>
        ) : (
          <p className="text-loam/65">Three native Ontario perennials, waiting for water.</p>
        )}
        {moist.some((m) => m > 0) && (
          <button type="button" onClick={replant} className="link text-[0.95rem] text-loam/75">
            Replant
          </button>
        )}
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </figure>
  );
}
