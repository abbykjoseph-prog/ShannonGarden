import Link from "next/link";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Let's walk your garden together.",
  body = "On the first visit I look at the soil, the light and what's growing, and hear what you want from the space. You'll get honest advice either way.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-t border-loam/15">
      <div className="wrap grid gap-8 py-16 md:grid-cols-12 md:items-end md:py-24">
        <div className="md:col-span-7">
          <h2 className="text-[2.4rem] leading-[1.05] sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-prose text-loam/75">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end">
          <Link href="/contact" className="btn-primary">Book a garden visit</Link>
          <a href={site.phoneHref} className="btn-quiet">Call {site.phone}</a>
        </div>
      </div>
    </section>
  );
}
