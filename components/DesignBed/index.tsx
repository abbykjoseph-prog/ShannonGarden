"use client";

import { useEffect, useRef, useState } from "react";
import { PlantArt, PlantLabel } from "@/components/PlantArt";
import { useSvgDrag } from "@/components/scene/useSvgDrag";
import { getPlant, type Plant } from "@/lib/plants";
import s from "./DesignBed.module.css";

type Pt = { x: number; y: number };

const W = 480;
const H = 380;
// Four plants of different heights and colours, from lib/plants.ts.
const IDS = ["coneflower", "lavender", "rudbeckia", "hosta"];
const SHELF_Y = 110;
const SLOTS: Record<string, Pt> = Object.fromEntries(IDS.map((id, i) => [id, { x: 78 + i * 108, y: SHELF_Y }]));
// The bed's soil surface, in a slight 3/4 view: a back edge and a wider front edge.
const BED = { backY: 170, frontY: 296, backL: 70, backR: 410, frontL: 30, frontR: 450 };
const CENTRE = { x: 240, y: 236 };
const TRAY_K = 0.42;
const GAP = 58; // how far apart plant bases settle
const STEP = 12; // keyboard marker step

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const depth = (y: number) => clamp((y - BED.backY) / (BED.frontY - BED.backY), 0, 1);
/** Plants further back are drawn smaller. */
const scaleAt = (y: number) => 0.42 + 0.22 * depth(y);

function clampToBed(p: Pt): Pt {
  const y = clamp(p.y, BED.backY + 12, BED.frontY - 8);
  const t = depth(y);
  const left = BED.backL + (BED.frontL - BED.backL) * t + 20;
  const right = BED.backR + (BED.frontR - BED.backR) * t - 20;
  return { x: clamp(p.x, left, right), y };
}

/** Nudge a spot away from plants already in the bed so they don't overlap. */
function settle(p: Pt, others: Pt[]): Pt {
  let q = clampToBed(p);
  for (let i = 0; i < 24; i++) {
    let moved = false;
    for (const o of others) {
      const dx = q.x - o.x;
      const dy = (q.y - o.y) * 1.6; // depth is foreshortened
      const d = Math.hypot(dx, dy) || 0.01;
      if (d < GAP) {
        const push = (GAP - d) / d;
        q = clampToBed({ x: q.x + dx * push * 0.6 + (dx === 0 ? 4 : 0), y: q.y + (dy / 1.6) * push * 0.6 });
        moved = true;
      }
    }
    if (!moved) break;
  }
  return q;
}

function where(p: Pt) {
  const t = depth(p.y);
  const row = t < 0.34 ? "back" : t < 0.67 ? "middle" : "front";
  const side = p.x < 190 ? "left" : p.x > 290 ? "right" : "centre";
  return row === "middle" && side === "centre" ? "middle" : `${row} ${side}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);
  return reduced;
}

/** The bed and whatever's planted in it. Used live, and again inside the photo. */
function BedArt({ placed, live }: { placed: [Plant, Pt][]; live?: React.ReactNode }) {
  return (
    <>
      <path d={`M${BED.backL} ${BED.backY}H${BED.backR}L${BED.frontR} ${BED.frontY}H${BED.frontL}Z`} fill="#6B4F3A" />
      <path d={`M${BED.backL} ${BED.backY}H${BED.backR}`} stroke="#5A4231" strokeWidth="2" />
      <rect x={BED.frontL - 4} y={BED.frontY - 2} width={BED.frontR - BED.frontL + 8} height="10" rx="2" fill="#9C7A58" />
      <rect x={BED.frontL} y={BED.frontY + 8} width={BED.frontR - BED.frontL} height="40" fill="#8A6A4C" />
      <path d={`M${BED.frontL} ${BED.frontY + 28}H${BED.frontR}M150 ${BED.frontY + 8}v20M330 ${BED.frontY + 8}v20M240 ${BED.frontY + 28}v20`} stroke="#6E5239" strokeWidth="1.5" />
      {[...placed]
        .sort((a, b) => a[1].y - b[1].y)
        .map(([plant, p]) => (
          <g key={plant.id}>
            <ellipse cx={p.x} cy={p.y + 1} rx={22 * scaleAt(p.y)} ry={6 * scaleAt(p.y)} fill="#3E2C20" opacity="0.55" />
            <PlantArt plant={plant} x={p.x} y={p.y} scale={scaleAt(p.y)} grow={false} />
          </g>
        ))}
      {live}
    </>
  );
}

export function DesignBed() {
  const svgRef = useRef<SVGSVGElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { begin, svgHandlers, dragging } = useSvgDrag(svgRef);

  const [placed, setPlaced] = useState<Record<string, Pt | null>>(() => Object.fromEntries(IDS.map((id) => [id, null])));
  const [dragPos, setDragPos] = useState<Pt | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [kbd, setKbd] = useState<{ id: string; at: Pt } | null>(null);
  const [photo, setPhoto] = useState<"none" | "flash" | "shown">("none");
  const [announce, setAnnounce] = useState("");
  const timer = useRef<number>();

  const allIn = IDS.every((id) => placed[id]);
  const active = dragging ?? kbd?.id ?? selected;
  const info = active ? getPlant(active) : null;

  // All four in: a short pause, a flash, then the photo drops in.
  useEffect(() => {
    if (!allIn || photo !== "none") return;
    timer.current = window.setTimeout(() => {
      setPhoto(reduced ? "shown" : "flash");
      setAnnounce("Picture perfect! All four plants are in the bed, and here's the photo.");
    }, 650);
    return () => window.clearTimeout(timer.current);
  }, [allIn, photo, reduced]);

  // The flash peaks, then the photo drops in under it.
  useEffect(() => {
    if (photo !== "flash") return;
    const t = window.setTimeout(() => setPhoto("shown"), 220);
    return () => window.clearTimeout(t);
  }, [photo]);

  const place = (id: string, p: Pt) => {
    const others = IDS.filter((o) => o !== id && placed[o]).map((o) => placed[o]!);
    const at = settle(p, others);
    setPlaced((prev) => ({ ...prev, [id]: at }));
    setSelected(id);
    setAnnounce(`${getPlant(id).commonName} planted at the ${where(at)} of the bed.`);
    return at;
  };

  const drop = (id: string, p: Pt) => {
    setDragPos(null);
    if (Number.isNaN(p.x)) return;
    if (p.y > BED.backY - 24) place(id, p);
    else {
      setPlaced((prev) => ({ ...prev, [id]: null }));
      setAnnounce(`${getPlant(id).commonName} is back in the tray.`);
    }
  };

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (photo !== "none") return;
    const from = placed[id] ?? SLOTS[id];
    setSelected(id);
    setDragPos(from);
    begin(e, id, from, setDragPos, (p) => drop(id, p));
  };

  // Keyboard: pick a plant (Enter), move the marker with the arrow keys, Enter to plant, Escape to cancel.
  const pickUp = (id: string) => {
    if (photo !== "none") return;
    setSelected(id);
    setKbd({ id, at: placed[id] ?? CENTRE });
    setAnnounce(`${getPlant(id).commonName} picked up. Use the arrow keys to choose a spot, Enter to plant it, Escape to cancel.`);
    requestAnimationFrame(() => markerRef.current?.focus());
  };

  const onMarkerKey = (e: React.KeyboardEvent) => {
    if (!kbd) return;
    const moves: Record<string, Pt> = { ArrowLeft: { x: -STEP, y: 0 }, ArrowRight: { x: STEP, y: 0 }, ArrowUp: { x: 0, y: -STEP / 1.5 }, ArrowDown: { x: 0, y: STEP / 1.5 } };
    if (moves[e.key]) {
      e.preventDefault();
      setKbd({ ...kbd, at: clampToBed({ x: kbd.at.x + moves[e.key].x, y: kbd.at.y + moves[e.key].y }) });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = kbd.id;
      place(id, kbd.at);
      setKbd(null);
      requestAnimationFrame(() => document.getElementById(`bed-move-${id}`)?.focus());
    } else if (e.key === "Escape") {
      const id = kbd.id;
      setKbd(null);
      setAnnounce("Cancelled.");
      requestAnimationFrame(() => document.getElementById(placed[id] ? `bed-move-${id}` : `bed-pick-${id}`)?.focus());
    }
  };

  const replant = () => {
    window.clearTimeout(timer.current);
    setPlaced(Object.fromEntries(IDS.map((id) => [id, null])));
    setSelected(null);
    setKbd(null);
    setPhoto("none");
    setAnnounce("The bed is empty again and the plants are back in the tray.");
  };

  const inBed: [Plant, Pt][] = IDS.filter((id) => placed[id] && id !== dragging).map((id) => [getPlant(id), placed[id]!]);
  const pct = (p: Pt) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` });

  return (
    <figure>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#DDE4D3]">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" aria-hidden {...svgHandlers}>
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={i * 40 + 2} y={20 + (i % 3) * 3} width="37" height="240" fill={i % 2 ? "#D3DBC8" : "#D7DFCC"} />
          ))}
          <rect x="0" y="210" width={W} height="5" fill="#C9D2BD" />
          <rect x="0" y="340" width={W} height="40" fill="#A9B79B" />

          {/* the tray shelf */}
          <rect x="22" y={SHELF_Y} width={W - 44} height="9" rx="2" fill="#9C7A58" />
          <rect x="22" y={SHELF_Y + 9} width={W - 44} height="3" fill="#7A5A40" />

          <BedArt
            placed={inBed}
            live={
              kbd && (
                <g className={s.marker}>
                  <ellipse cx={kbd.at.x} cy={kbd.at.y} rx="24" ry="8" fill="none" stroke="#FBFBF7" strokeWidth="2" strokeDasharray="5 4" />
                  <g opacity="0.55">
                    <PlantArt plant={getPlant(kbd.id)} x={kbd.at.x} y={kbd.at.y} scale={scaleAt(kbd.at.y)} grow={false} />
                  </g>
                </g>
              )
            }
          />

          {/* plants still in the tray */}
          {IDS.filter((id) => !placed[id] && id !== dragging).map((id) => (
            <g key={id} style={{ cursor: "grab", touchAction: "none" }} onPointerDown={(e) => startDrag(e, id)} opacity={kbd?.id === id ? 0.35 : 1}>
              <PlantArt plant={getPlant(id)} x={SLOTS[id].x} y={SLOTS[id].y} scale={TRAY_K} grow={false} />
              <rect x={SLOTS[id].x - 34} y={SLOTS[id].y - 80} width="68" height="84" fill="transparent" />
            </g>
          ))}

          {/* plants in the bed can be picked up again */}
          {inBed.map(([plant, p]) => (
            <rect
              key={plant.id}
              x={p.x - 26}
              y={p.y - plant.height * scaleAt(p.y) * 0.8}
              width="52"
              height={plant.height * scaleAt(p.y) * 0.8 + 8}
              fill="transparent"
              style={{ cursor: "grab", touchAction: "none" }}
              onPointerDown={(e) => startDrag(e, plant.id)}
            />
          ))}

          {/* the one being dragged, drawn on top */}
          {dragging && dragPos && (
            <PlantArt plant={getPlant(dragging)} x={dragPos.x} y={dragPos.y} scale={dragPos.y > BED.backY - 24 ? scaleAt(dragPos.y) : TRAY_K} grow={false} />
          )}
        </svg>

        {/* Keyboard controls. Pointer users drag in the drawing, so these let pointer events through. */}
        {IDS.map((id) => {
          const p = placed[id];
          const name = getPlant(id).commonName.toLowerCase();
          return p ? (
            <button
              key={id}
              id={`bed-move-${id}`}
              type="button"
              onClick={() => pickUp(id)}
              aria-label={`Move the ${name}`}
              className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={pct(p)}
            />
          ) : (
            <button
              key={id}
              id={`bed-pick-${id}`}
              type="button"
              onClick={() => pickUp(id)}
              aria-label={`Pick up the ${name}`}
              className="pointer-events-none absolute h-[20%] w-[15%] -translate-x-1/2 -translate-y-full rounded-lg"
              style={pct(SLOTS[id])}
            />
          );
        })}
        {kbd && (
          <div
            ref={markerRef}
            tabIndex={0}
            role="application"
            aria-label={`Placing the ${getPlant(kbd.id).commonName.toLowerCase()}. Arrow keys move the marker, Enter plants it here, Escape cancels.`}
            onKeyDown={onMarkerKey}
            onBlur={() => setKbd(null)}
            className="pointer-events-none absolute rounded-xl"
            style={{ left: "5%", right: "5%", top: `${((BED.backY - 10) / H) * 100}%`, bottom: `${((H - BED.frontY - 10) / H) * 100}%` }}
          />
        )}

        {photo === "flash" && <div aria-hidden className={`${s.flash} pointer-events-none absolute inset-0 bg-white`} />}

        {photo === "shown" && (
          <div className="absolute inset-0 flex items-center justify-center bg-loam/10 p-[6%]">
            <div className={`${s.polaroid} w-[78%] bg-paper p-[3%] pb-0 shadow-[0_10px_30px_rgb(30_42_31/0.3)]`} style={{ transform: "rotate(-3deg)" }}>
              <svg viewBox={`10 ${BED.backY - 120} ${W - 20} ${BED.frontY - BED.backY + 168}`} className="block w-full bg-[#DDE4D3]" role="img" aria-label="A photo of your planted bed">
                <BedArt placed={IDS.map((id) => [getPlant(id), placed[id]!] as [Plant, Pt])} />
              </svg>
              <p className="py-[4%] text-center text-[clamp(1.5rem,4vw,2.1rem)] leading-none text-loam" style={{ fontFamily: '"Caveat Variable", cursive' }}>
                Picture perfect
              </p>
            </div>
          </div>
        )}
      </div>

      <figcaption className="mt-4">
        {/* Fixed height, sized for the longest name and description, so the button below never moves. */}
        <div className="h-[11rem] sm:h-[9.5rem]">
          {info ? (
            <div key={info.id}>
              <PlantLabel plant={info} description />
            </div>
          ) : (
            <p className="pt-1 text-loam/65">Drag a plant into the bed.</p>
          )}
        </div>
        <button
          type="button"
          onClick={replant}
          className={`btn-quiet ${IDS.some((id) => placed[id]) || photo !== "none" ? "" : "invisible"}`}
        >
          Replant the bed
        </button>
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </figure>
  );
}
