import type { CSSProperties } from "react";
import s from "./WateringCan.module.css";

/** Water falling from the can's rose at (x, y) down to landY, with a ripple where it lands. */
export function Droplets({ x, y, landY, ripple = true }: { x: number; y: number; landY: number; ripple?: boolean }) {
  return (
    <g aria-hidden>
      {Array.from({ length: 8 }, (_, k) => (
        <g key={k} transform={`translate(${x - 8 + (k % 4) * 5} ${y + 4})`}>
          <path
            className={s.drop}
            d="M0-4C1.6-1 2.4 0.4 2.4 1.6a2.4 2.4 0 0 1-4.8 0C-2.4.4-1.6-1 0-4Z"
            fill="#8CB8D4"
            style={{ "--d": `${k * -70}ms`, "--fall": `${landY - y - 8}px` } as CSSProperties}
          />
        </g>
      ))}
      {ripple && <ellipse className={s.ripple} cx={x - 2} cy={landY} rx="20" ry="5" fill="none" stroke="#8CB8D4" strokeWidth="1.5" />}
    </g>
  );
}
