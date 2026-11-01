import type { Area, Plan, PlantForm, Pt } from "./types";

// Draws a top-down planting plan from data, in the style of a designer's sheet.
const W = 400;
const H = 260;
const LOT = { x: 16, y: 16, w: 368, h: 228 };
const INK = "#1E2A1F";
const PAPER = "#FBFBF7";
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const areaFill: Record<Area["kind"], string> = {
  turf: "turf",
  paving: "paving",
  mulch: "mulch",
  bed: "bed",
  deck: "deck",
  planter: "planter",
};

function rectPoints([x, y, w, h]: [number, number, number, number]): Pt[] {
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
}

// Closed Catmull-Rom spline through the points, for soft bed edges.
function smoothPath(pts: Pt[]) {
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d + "Z";
}

const polyPath = (pts: Pt[]) => `M${pts.map((p) => p.join(" ")).join("L")}Z`;

function centroid(pts: Pt[]): Pt {
  const [sx, sy] = pts.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
  return [sx / pts.length, sy / pts.length];
}

function AreaShape({ area, id }: { area: Area; id: string }) {
  const pts = area.points ?? rectPoints(area.rect!);
  const d = area.kind === "bed" && area.points ? smoothPath(pts) : polyPath(pts);
  const [lx, ly] = centroid(pts);
  return (
    <g>
      <path
        d={d}
        fill={`url(#${id}-${areaFill[area.kind]})`}
        stroke={INK}
        strokeOpacity={area.kind === "mulch" ? 0 : area.kind === "bed" ? 0.8 : 0.45}
        strokeWidth={area.kind === "planter" ? 2.4 : area.kind === "bed" ? 1.1 : 0.7}
      />
      {area.label && <Label x={lx} y={ly} text={area.label} />}
    </g>
  );
}

function Label({ x, y, text, italic }: { x: number; y: number; text: string; italic?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="8"
      fill={INK}
      fillOpacity="0.75"
      stroke={PAPER}
      strokeWidth="2.5"
      paintOrder="stroke"
      style={{ fontFamily: italic ? '"Newsreader Variable", serif' : '"Schibsted Grotesk Variable", sans-serif', fontStyle: italic ? "italic" : "normal" }}
    >
      {text}
    </text>
  );
}

function PlantSymbol({ x, y, r, form, tone }: { x: number; y: number; r: number; form: PlantForm; tone: string }) {
  if (form === "grass") {
    return (
      <g>
        <circle cx={x} cy={y} r={r} fill={tone} fillOpacity="0.35" />
        {Array.from({ length: 10 }, (_, k) => {
          const a = (k / 10) * Math.PI * 2;
          return <line key={k} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} stroke={INK} strokeOpacity="0.55" strokeWidth="0.5" />;
        })}
      </g>
    );
  }
  if (form === "fern") {
    return (
      <g>
        {Array.from({ length: 6 }, (_, k) => (
          <ellipse key={k} cx={x} cy={y - r * 0.5} rx={r * 0.24} ry={r * 0.52} transform={`rotate(${k * 60} ${x} ${y})`} fill={tone} fillOpacity="0.6" stroke={INK} strokeOpacity="0.5" strokeWidth="0.4" />
        ))}
      </g>
    );
  }
  if (form === "shrub") {
    const bumps = 14;
    let d = "";
    for (let k = 0; k <= bumps; k++) {
      const a = (k / bumps) * Math.PI * 2;
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      if (k === 0) d = `M${px} ${py}`;
      else {
        const m = a - Math.PI / bumps;
        d += `Q${x + Math.cos(m) * r * 1.14} ${y + Math.sin(m) * r * 1.14} ${px} ${py}`;
      }
    }
    return (
      <g>
        <path d={d} fill={tone} fillOpacity="0.45" stroke={INK} strokeOpacity="0.7" strokeWidth="0.7" />
        <path d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} stroke={INK} strokeWidth="0.7" />
      </g>
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={tone} fillOpacity="0.6" stroke={INK} strokeOpacity="0.6" strokeWidth="0.5" />
      <circle cx={x} cy={y} r="0.8" fill={INK} />
    </g>
  );
}

function SteppingStones({ points }: { points: Pt[] }) {
  const stones: { x: number; y: number; a: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    for (let t = i === 0 ? 0 : 10; t < len; t += 20) stones.push({ x: x1 + ((x2 - x1) * t) / len, y: y1 + ((y2 - y1) * t) / len, a });
  }
  return (
    <g>
      {stones.map((s, i) => (
        <rect key={i} x={s.x - 5} y={s.y - 7} width="10" height="14" rx="3" transform={`rotate(${s.a} ${s.x} ${s.y})`} fill="#D7D8D0" stroke={INK} strokeOpacity="0.6" strokeWidth="0.6" />
      ))}
    </g>
  );
}

export function PlanDrawing({ plan, state, id }: { plan: Plan; state: "before" | "after"; id: string }) {
  const areas = state === "before" ? plan.before : plan.after;
  const species = Object.fromEntries(plan.key.map((k) => [k.code, k]));
  const [hx, hy, hw, hh] = plan.house.rect;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" aria-hidden>
      <defs>
        <pattern id={`${id}-turf`} width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill="#E3E9D9" />
          <path d="M2 6l1-3M6 8.5l1-3M5.5 3l.8-2.4" stroke="#6E8F62" strokeWidth="0.6" strokeLinecap="round" />
        </pattern>
        <pattern id={`${id}-paving`} width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#E6E6DF" />
          <path d="M0 0h14M0 5h14M7 0v5M0 5v5M14 5v5" stroke={INK} strokeOpacity="0.22" strokeWidth="0.5" />
        </pattern>
        <pattern id={`${id}-mulch`} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#EEE9DF" />
          <circle cx="2" cy="2" r="0.55" fill="#6B4F3A" fillOpacity="0.5" />
          <circle cx="5.2" cy="5" r="0.45" fill="#6B4F3A" fillOpacity="0.4" />
        </pattern>
        <pattern id={`${id}-bed`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E9E2D3" />
          <circle cx="3" cy="3" r="0.4" fill="#6B4F3A" fillOpacity="0.45" />
        </pattern>
        <pattern id={`${id}-deck`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E8DCC8" />
          <path d="M0 5.5h6" stroke="#6B4F3A" strokeOpacity="0.45" strokeWidth="0.6" />
        </pattern>
        <pattern id={`${id}-planter`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E9E2D3" />
          <circle cx="3" cy="3" r="0.45" fill="#6B4F3A" fillOpacity="0.5" />
        </pattern>
        <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill={PAPER} />
          <path d="M0 0v5" stroke={INK} strokeOpacity="0.4" strokeWidth="0.7" />
        </pattern>
        <clipPath id={`${id}-lot`}>
          <rect x={LOT.x} y={LOT.y} width={LOT.w} height={LOT.h} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={PAPER} />

      <g clipPath={`url(#${id}-lot)`}>
        {areas.map((a, i) => (
          <AreaShape key={i} area={a} id={id} />
        ))}

        {state === "after" &&
          plan.paths?.map((p, i) =>
            p.kind === "stepping" ? (
              <SteppingStones key={i} points={p.points} />
            ) : (
              <g key={i}>
                <polyline points={p.points.map((q) => q.join(",")).join(" ")} fill="none" stroke="#D9CBB2" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={p.points.map((q) => q.join(",")).join(" ")} fill="none" stroke="#6B4F3A" strokeOpacity="0.45" strokeWidth="11" strokeDasharray="0.6 3.2" strokeLinejoin="round" />
              </g>
            ),
          )}

        {state === "after" &&
          plan.drifts.map((d, di) => {
            const sp = species[d.code];
            if (!sp) return null;
            return (
              <g key={di}>
                {Array.from({ length: d.n }, (_, i) => {
                  const rr = d.n === 1 ? 0 : d.spread * Math.sqrt((i + 0.5) / d.n);
                  const a = i * GOLDEN + di;
                  return <PlantSymbol key={i} x={d.cx + Math.cos(a) * rr} y={d.cy + Math.sin(a) * rr} r={sp.r} form={sp.form} tone={sp.tone} />;
                })}
              </g>
            );
          })}

        {plan.trees?.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r={t.r} fill="#6E8F62" fillOpacity={state === "before" ? 0.16 : 0.08} stroke={INK} strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="4 3" />
            <circle cx={t.x} cy={t.y} r="3" fill={INK} fillOpacity="0.7" />
            <Label x={t.x} y={t.y - t.r + 10} text={t.label} italic />
          </g>
        ))}

        {state === "after" &&
          plan.drifts.map((d, di) => (
            <g key={`tag-${di}`}>
              <circle cx={d.cx} cy={d.cy} r="5.5" fill={PAPER} stroke={INK} strokeWidth="0.7" />
              <text x={d.cx} y={d.cy + 0.3} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fontWeight="700" fill={INK} style={{ fontFamily: '"Schibsted Grotesk Variable", sans-serif' }}>
                {d.code}
              </text>
            </g>
          ))}

        <rect x={hx} y={hy} width={hw} height={hh} fill={`url(#${id}-hatch)`} stroke={INK} strokeWidth="1.2" />
        <Label x={hx + hw / 2} y={hy + hh / 2} text={plan.house.label} />
      </g>

      {/* property line */}
      <rect x={LOT.x} y={LOT.y} width={LOT.w} height={LOT.h} fill="none" stroke={INK} strokeWidth="0.9" strokeDasharray="10 2.5 2 2.5" />

      {/* north arrow */}
      <g transform={`translate(${W - 8} 9)`} fill={INK}>
        <path d="M0-5l2.6 7L0 .8-2.6 7Z" />
      </g>
    </svg>
  );
}
