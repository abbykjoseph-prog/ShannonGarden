import Image from "next/image";

// A testimonial styled as a white nursery plant tag: rounded head, punched hole, pointed stake.
export function PlantTag({ quote, name, place, tilt = -1.5 }: { quote: string; name: string; place: string; tilt?: number }) {
  return (
    <figure
      className="relative mx-auto w-full max-w-[17rem] drop-shadow-[0_2px_1px_rgb(28_33_27/0.18)]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        className="bg-cream-warm px-6 pb-16 pt-11"
        style={{
          clipPath:
            "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 64px), 50% 100%, 0 calc(100% - 64px), 0 14px)",
        }}
      >
        <span aria-hidden className="absolute left-1/2 top-4 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-cream shadow-[inset_0_1px_2px_rgb(28_33_27/0.35)]" />
        <Image src="/monogram.png" alt="" width={600} height={600} className="mx-auto h-9 w-auto opacity-80" />
        <blockquote className="mt-4 font-display text-[1.2rem] leading-snug text-ink">&ldquo;{quote}&rdquo;</blockquote>
        <figcaption className="mt-4 border-t border-ink/15 pt-3 text-[0.92rem]">
          <span className="font-semibold">{name}</span>
          <span className="text-ink/60">, {place}</span>
        </figcaption>
      </div>
    </figure>
  );
}
