"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";

/*
 * Desktop (lg and up): at the top of the page there's no nav bar, just the long logo, large and centred.
 * Once the page scrolls past a sentinel ~60px down (or keyboard focus enters the header), the bar slides in
 * and the long logo shrinks towards the bar's left slot, where the square monogram takes over.
 * Below lg it's always the compact bar with the monogram and a menu button.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const docked = scrolled || focusInside;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keyboard focus inside the hidden bar brings it in, so focus is never on something invisible.
  useEffect(() => {
    const inHeader = (t: EventTarget | null) => !!headerRef.current?.contains(t as Node | null);
    const onFocusIn = (e: FocusEvent) => setFocusInside(inHeader(e.target));
    const onPointerDown = (e: PointerEvent) => !inHeader(e.target) && setFocusInside(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

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
    <>
      {/* Scrolling past this flips the desktop header into its docked state. */}
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute left-0 top-[60px] h-px w-px" />

      {/* Desktop opening logo. Mouse-only link; the bar's monogram is the keyboard route home. */}
      <Link
        href="/"
        tabIndex={-1}
        aria-hidden
        className={`fixed left-0 top-0 z-30 hidden w-[34rem] origin-top-left transition-[transform,opacity] duration-500 ease-[cubic-bezier(.3,.7,.3,1)] motion-reduce:transition-none lg:block ${
          docked ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{
          transform: docked
            ? "translate(max(3rem, calc((100vw - 84rem) / 2 + 3rem)), 0.9rem) scale(0.36)"
            : "translate(calc(50vw - 17rem), 1.9rem)",
        }}
      >
        <Image src="/logo-long.png" alt="" width={1800} height={457} priority className="h-auto w-full" />
      </Link>

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 border-b border-loam/10 bg-limestone/95 backdrop-blur-sm transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none lg:fixed lg:inset-x-0 ${
          docked ? "" : "lg:pointer-events-none lg:-translate-y-full lg:opacity-0"
        }`}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
            <Image
              src="/monogram.png"
              alt=""
              width={600}
              height={600}
              priority
              className={`h-12 w-auto transition-opacity duration-300 motion-reduce:transition-none sm:h-14 lg:delay-150 ${docked ? "" : "lg:opacity-0"}`}
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-3">
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-loam hover:bg-loam/5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d={open ? "M5 5l12 12" : "M3 7h16"} />
                <path d={open ? "M17 5L5 17" : "M3 14h11"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsed with grid rows so it can animate; `invisible` keeps it out of the tab order. */}
        <div
          id="mobile-menu"
          ref={panelRef}
          className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
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

      {/* Reserves the opening logo's space on desktop so nothing shifts when the header docks. */}
      <div aria-hidden className="hidden h-[12.5rem] lg:block" />
    </>
  );
}
