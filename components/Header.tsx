"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the menu and returns focus; focus moves into the panel on open.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-loam/10 bg-limestone/95 backdrop-blur-sm">
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-4 sm:h-[5rem]">
        <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
          <Image src="/monogram.png" alt="" width={600} height={600} priority className="h-12 w-auto sm:hidden" />
          <Image src="/logo-long.png" alt="" width={1800} height={457} priority className="hidden h-[3.25rem] w-auto sm:block" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group relative block px-3 py-2 text-[0.98rem] text-loam/70 transition-colors hover:text-loam aria-[current=page]:text-loam"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-0.5 h-[2px] origin-left scale-x-0 bg-coneflower transition-transform duration-200 group-hover:scale-x-[0.4] group-aria-[current=page]:scale-x-100 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a href={site.phoneHref} className="hidden text-[0.95rem] text-loam/75 hover:text-loam lg:inline">
            {site.phone}
          </a>
          <Link href="/contact" className="btn-primary min-h-[2.625rem] px-4 text-[0.92rem] sm:px-5">
            <span className="sm:hidden">Book a visit</span>
            <span className="hidden sm:inline">Book a garden visit</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-loam hover:bg-loam/5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d={open ? "M5 5l12 12" : "M3 7h16"} className="transition-all duration-200 motion-reduce:transition-none" />
              <path d={open ? "M17 5L5 17" : "M3 14h11"} className="transition-all duration-200 motion-reduce:transition-none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsed with grid rows so it can animate; `invisible` keeps it out of the tab order. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="wrap border-t border-loam/10 pb-6 pt-2">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-baseline justify-between border-b border-loam/10 py-3.5 font-display text-[1.75rem] font-light text-loam"
                  >
                    {item.label}
                    {isActive(item.href) && <span className="font-sans text-sm text-coneflower">You&apos;re here</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-loam/70">
              Or call me on{" "}
              <a href={site.phoneHref} className="link text-loam">
                {site.phone}
              </a>
            </p>
          </nav>
        </div>
      </div>
    </header>
  );
}
