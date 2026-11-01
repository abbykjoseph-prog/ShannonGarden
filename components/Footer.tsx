import Image from "next/image";
import Link from "next/link";
import { gtaRegions, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-loam text-moss">
      <div className="wrap grid gap-x-12 gap-y-12 pb-14 pt-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image src="/logo-long-light.png" alt={site.name} width={1800} height={457} className="h-14 w-auto sm:h-16" />
          <p className="mt-6 max-w-[36ch] text-limestone/80">
            Garden design and care in Toronto and the GTA. One trained horticulturist, from the first visit to the last
            clean-up of the season.
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-sans text-[0.95rem] font-semibold tracking-normal text-limestone">Talk to me</h2>
          <ul className="mt-3 space-y-1.5">
            <li><a className="hover:text-limestone" href={site.phoneHref}>{site.phone}</a></li>
            <li><a className="hover:text-limestone" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
          <Link href="/contact" className="mt-5 inline-block text-limestone underline decoration-coneflower decoration-2 underline-offset-4">
            Book a garden visit
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <h2 className="font-sans text-[0.95rem] font-semibold tracking-normal text-limestone">Where I work</h2>
            <ul className="mt-3 space-y-1.5">
              {gtaRegions.map((r) => (
                <li key={r.name}>{r.short}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans text-[0.95rem] font-semibold tracking-normal text-limestone">Pages</h2>
            <ul className="mt-3 space-y-1.5">
              {nav.map((item) => (
                <li key={item.href}><Link className="hover:text-limestone" href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-limestone/10">
        <div className="wrap flex items-center justify-between gap-6 py-6 text-sm text-moss/70">
          <p>© {new Date().getFullYear()} {site.name}, Toronto, Ontario</p>
          <Image src="/monogram-light.png" alt="" width={600} height={600} className="h-10 w-auto opacity-60" />
        </div>
      </div>
    </footer>
  );
}
