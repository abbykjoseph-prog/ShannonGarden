import Link from "next/link";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Let's walk your garden together.",
  body = `A first visit is a chance for me to see the space, test the soil and hear what you want from it. No obligation, and you'll get honest advice either way.`,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="wrap py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-sage-soft px-7 py-14 sm:px-14 md:flex md:items-end md:justify-between md:gap-12">
        <Sprigs />
        <div className="relative max-w-xl">
          <h2 className="text-4xl leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-4 text-ink/75">{body}</p>
        </div>
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row md:mt-0 md:flex-col md:items-stretch">
          <Link href="/contact" className="btn-primary">Book a garden visit</Link>
          <a href={site.phoneHref} className="btn-ghost">Call {site.phone}</a>
        </div>
      </div>
    </section>
  );
}

function Sprigs() {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -top-10 h-56 w-56 text-forest/10">
      <g fill="currentColor">
        <path d="M100 200V70" stroke="currentColor" strokeWidth="6" />
        <path d="M100 120c-30 0-52-18-56-50 32 0 54 18 56 50Z" />
        <path d="M100 90c30 0 52-18 56-50-32 0-54 18-56 50Z" />
        <path d="M100 160c-26 0-44-14-48-40 26 0 46 14 48 40Z" />
      </g>
    </svg>
  );
}
