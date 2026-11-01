import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-forest-night text-cream/80">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/logo-long-light.png" alt={site.name} width={1800} height={457} className="h-14 w-auto" />
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">
            Garden design and care in Toronto and the GTA. One trained horticulturist, from the first visit to the last
            clean-up of the season.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sage">Get in touch</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            <li><a className="hover:text-cream" href={site.phoneHref}>{site.phone}</a></li>
            <li><a className="hover:text-cream" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li className="pt-2"><Link href="/contact" className="text-cream underline decoration-clay underline-offset-4 hover:decoration-2">Book a garden visit</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sage">Pages</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            {nav.map((item) => (
              <li key={item.href}><Link className="hover:text-cream" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Serving {site.serviceArea.slice(0, 4).join(", ")} and across the GTA.</p>
          <p>Toronto, Ontario</p>
        </div>
      </div>
    </footer>
  );
}
