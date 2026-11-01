import s from "./WateringCan.module.css";
import { TILT_DEG } from "./patches";

// A galvanised-style can in the brand green, drawn around its pivot (0,0). The spout points right.
export function Can({ tilted }: { tilted: boolean }) {
  return (
    <g className={s.tilt} style={{ transform: `rotate(${tilted ? TILT_DEG : 0}deg)` }}>
      <path d="M-38-30C-38-80 28-80 28-30" fill="none" stroke="#283D27" strokeWidth="8" strokeLinecap="round" />
      <path d="M32 4L88-38l7 9-61 50Z" fill="#395437" stroke="#283D27" strokeWidth="1.2" strokeLinejoin="round" />
      <g transform="rotate(-36 92 -36)">
        <rect x="86" y="-47" width="13" height="22" rx="3" fill="#283D27" />
        {[-41, -36, -31].map((y) => (
          <circle key={y} cx="99" cy={y} r="1" fill="#C5D1BF" />
        ))}
      </g>
      <path d="M-48-35h82l4 72h-90Z" fill="#395437" stroke="#283D27" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M-48-35h82l1 11h-84Z" fill="#283D27" />
      <path d="M-50 28h88" stroke="#283D27" strokeWidth="2" />
      <path d="M-38-14v36" stroke="#C5D1BF" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
    </g>
  );
}
