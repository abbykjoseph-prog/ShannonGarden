"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { PlanDrawing } from "./PlanDrawing";
import type { Plan } from "./types";

type Props = {
  id: string;
  title: string;
  plan: Plan;
  /** When present, real photos replace the drawn plans. */
  photos?: { before: string; after: string };
};

const clamp = (v: number) => Math.min(100, Math.max(0, v));

export function PlanSlider({ id, title, plan, photos }: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const fromPointer = useCallback((clientX: number) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (box) setPos(clamp(Math.round(((clientX - box.left) / box.width) * 100)));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -25, PageUp: 25 };
    if (e.key in step) setPos((p) => clamp(p + step[e.key]));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const layer = (state: "before" | "after") =>
    photos ? (
      <Image src={photos[state]} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
    ) : (
      <PlanDrawing plan={plan} state={state} id={`${id}-${state}`} />
    );

  return (
    <div>
      <div
        ref={boxRef}
        className="relative aspect-[400/260] touch-pan-y select-none overflow-hidden rounded-[1.25rem] bg-cream ring-1 ring-ink/15"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Pointer already released; a plain click still moves the handle.
          }
          setDragging(true);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging && fromPointer(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <div className="absolute inset-0">{layer("after")}</div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {layer("before")}
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-[3px] bg-ink/85 px-2 py-0.5 text-[0.8rem] text-cream">Before</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-[3px] bg-forest px-2 py-0.5 text-[0.8rem] text-cream">After</span>

        <div className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-ink" />
          <div
            role="slider"
            tabIndex={0}
            aria-label={`${title}, before and after`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pos}
            aria-valuetext={`${pos}% before, ${100 - pos}% after`}
            onKeyDown={onKeyDown}
            className={`pointer-events-auto absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[0_1px_0_rgb(28_33_27/0.25)] transition-transform duration-150 motion-reduce:transition-none ${
              dragging ? "scale-110" : ""
            }`}
          >
            <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 1L1 6l5 5M14 1l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>

      {!photos && (
        <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-[0.95rem] sm:grid-cols-2">
          {plan.key.map((k) => (
            <div key={k.code} className="flex items-baseline gap-2.5">
              <dt className="flex h-5 w-5 shrink-0 translate-y-[3px] items-center justify-center rounded-full border border-ink text-[0.7rem] font-bold">
                {k.code}
              </dt>
              <dd>
                <span className="latin text-[1.08rem]">{k.latin}</span>{" "}
                <span className="text-ink/65">{k.common}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
