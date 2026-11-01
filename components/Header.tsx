"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";

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
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/90 backdrop-blur">
      <div className="wrap flex h-[5rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Shannon Boudreau Gardens, home">
          <Image src="/logo-long.png" alt="" width={1800} height={457} priority className="h-11 w-auto sm:h-[3.25rem]" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group relative px-3 py-2 text-[0.95rem] font-medium text-ink/75 transition-colors hover:text-forest-deep aria-[current=page]:text-forest-deep"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-clay transition-transform group-hover:scale-x-50 group-aria-[current=page]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            Book a garden visit
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest/25 text-forest-deep md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h9" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-forest/10 bg-cream md:hidden"
      >
        <nav aria-label="Mobile" className="wrap py-4">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-center justify-between border-b border-forest/10 py-3.5 font-display text-2xl text-forest-deep aria-[current=page]:text-clay"
                >
                  {item.label}
                  {isActive(item.href) && <span className="text-xs font-sans uppercase tracking-widest">You are here</span>}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-primary mt-5 w-full">
            Book a garden visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
