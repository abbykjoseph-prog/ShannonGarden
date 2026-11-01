"use client";

import { useCallback, useRef, useState, type RefObject } from "react";

type Pt = { x: number; y: number };
type Active = { id: string; dx: number; dy: number; onMove: (p: Pt) => void; onEnd: (p: Pt) => void };

/**
 * Pointer-event dragging for things inside an SVG scene: mouse, touch and pen alike.
 * Put `touch-action: none` on the draggable item only, so the rest of the page still scrolls on phones.
 */
export function useSvgDrag(svgRef: RefObject<SVGSVGElement>) {
  const active = useRef<Active | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const toScene = useCallback(
    (clientX: number, clientY: number): Pt => {
      const svg = svgRef.current;
      const m = svg?.getScreenCTM();
      if (!svg || !m) return { x: 0, y: 0 };
      const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    },
    [svgRef],
  );

  /** Start dragging `id`, whose current anchor point is `at`. */
  const begin = (e: React.PointerEvent, id: string, at: Pt, onMove: Active["onMove"], onEnd: Active["onEnd"]) => {
    if (e.button !== 0) return;
    const p = toScene(e.clientX, e.clientY);
    active.current = { id, dx: p.x - at.x, dy: p.y - at.y, onMove, onEnd };
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // The pointer may already be gone; dragging still works while it's over the scene.
    }
    setDragging(id);
    e.preventDefault();
  };

  const point = (e: React.PointerEvent) => {
    const a = active.current!;
    const p = toScene(e.clientX, e.clientY);
    return { x: p.x - a.dx, y: p.y - a.dy };
  };

  const svgHandlers = {
    onPointerMove: (e: React.PointerEvent) => {
      if (active.current) active.current.onMove(point(e));
    },
    onPointerUp: (e: React.PointerEvent) => {
      const a = active.current;
      if (!a) return;
      const p = point(e);
      active.current = null;
      setDragging(null);
      a.onEnd(p);
    },
    onPointerCancel: () => {
      const a = active.current;
      active.current = null;
      setDragging(null);
      a?.onEnd({ x: NaN, y: NaN });
    },
  };

  return { begin, svgHandlers, dragging, toScene };
}
