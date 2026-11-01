"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { nav, site } from "@/lib/site";

/*
 * Desktop (lg and up): at the top of the page there's no nav bar, just the long logo, large and centred.
 * Scrolling down moves that logo up into the bar's left slot (FLIP-style translate + scale) while it fades,
 * the bar fades in with a small downward settle, and the square monogram fades in where the logo lands.
 * Back at the very top, the same sequence plays in reverse. Below lg it's always the compact bar.
 */
const DOCK_AT = 40; // px scrolled before docking; it only undocks again at 0
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const BIG_W = 544; // the opening logo's width (34rem)
const BIG_H = (BIG_W * 457) / 1800;
const BIG_TOP = 30;

type Flip = { fromX: number; toX: number; toY: number; scale: number };

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

const t = (prop: string, ms: number, delay = 0) => `${prop} ${ms}ms ${EASE} ${delay}ms`;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [flip, setFlip] = useState<Flip | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLImageElement>(null);
  const desktop = useMedia("(min-width: 1024px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const docked = scrolled || focusInside;

  // Scroll with hysteresis, throttled to one check per frame: dock past 40px, undock only at the very top.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled((was) => (was ? y > 0 : y > DOCK_AT));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Measure where the big logo starts (centred) and where it lands (the monogram's slot in the bar).
  useEffect(() => {
    if (!desktop) return;
    const measure = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const box = slot.parentElement!; // offsets ignore transforms, so this is the bar's resting layout
      const scale = (slot.offsetHeight * 0.92) / BIG_H;
      setFlip({
        fromX: (document.documentElement.clientWidth - BIG_W) / 2,
        toX: box.offsetLeft + (box.offsetParent as HTMLElement | null ? (box.offsetParent as HTMLElement).offsetLeft : 0),
        toY: box.offsetTop + (slot.offsetHeight - BIG_H * scale) / 2,
        scale,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [desktop]);

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

  // Timings. Docking: the logo moves first, the bar follows ~120ms later, the monogram arrives last.
  // Undocking plays it backwards. Reduced motion: a plain 200ms crossfade, nothing moves.
  const fade = (ms: number, delay: number) => (reduced ? t("opacity", 200) : t("opacity", ms, delay));
  const bigStyle: CSSProperties = {
    transform:
      !flip || reduced
        ? `translate(${flip?.fromX ?? 0}px, ${BIG_TOP}px)`
        : docked
          ? `translate(${flip.toX}px, ${flip.toY}px) scale(${flip.scale})`
          : `translate(${flip.fromX}px, ${BIG_TOP}px)`,
    opacity: docked ? 0 : 1,
    transition: reduced ? t("opacity", 200) : [t("transform", 650), docked ? t("opacity", 450, 200) : t("opacity", 420, 120)].join(", "),
    visibility: flip ? "visible" : "hidden",
  };
  const barStyle: CSSProperties | undefined = desktop
    ? {
        opacity: docked ? 1 : 0,
        transform: docked || reduced ? "none" : "translateY(-8px)",
        transition: reduced ? t("opacity", 200) : docked ? `${t("opacity", 520, 120)}, ${t("transform", 520, 120)}` : `${t("opacity", 420, 60)}, ${t("transform", 420, 60)}`,
        pointerEvents: docked ? "auto" : "none",
      }
    : undefined;
  const slotStyle: CSSProperties | undefined = desktop
    ? { opacity: docked ? 1 : 0, transition: docked ? fade(280, 420) : fade(220, 0) }
    : undefined;

  return (
    <>
      {/* Desktop opening logo. Mouse-only link; the bar's monogram is the keyboard route home. */}
      <Link
        href="/"
        tabIndex={-1}
        aria-hidden
        className={`fixed left-0 top-0 z-30 hidden w-[34rem] origin-top-left lg:block ${docked ? "pointer-events-none" : ""}`}
        style={bigStyle}
      >
        <Image src="/logo-long.png" alt="" width={1800} height={457} priority className="h-auto w-full" />
      </Link>

      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur-sm lg:fixed lg:inset-x-0"
        style={barStyle}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="shrink-0" aria-label={`${site.businessName}, home`}>
            <Image ref={slotRef} src="/monogram.png" alt="" width={600} height={600} priority className="h-12 w-auto sm:h-14" style={slotStyle} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative block px-3 py-2 text-[0.98rem] text-ink/70 transition-colors hover:text-ink aria-[current=page]:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-0.5 h-[2px] origin-left scale-x-0 bg-clay transition-transform duration-200 group-hover:scale-x-[0.4] group-aria-[current=page]:scale-x-100 motion-reduce:transition-none"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/contact" className="btn-primary min-h-[2.625rem] px-4 text-[0.92rem] sm:px-5">
              <span className="sm:hidden">Book a visit</span>
              <span className="hidden sm:inline">Book a garden visit</span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
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
            <nav aria-label="Mobile" className="wrap border-t border-ink/10 pb-6 pt-2">
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex items-baseline justify-between border-b border-ink/10 py-3.5 font-display text-[1.75rem] font-light text-ink"
                    >
                      {item.label}
                      {isActive(item.href) && <span className="font-sans text-sm text-clay">You&apos;re here</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Reserves the opening logo's space on desktop so nothing shifts when the header docks. */}
      <div aria-hidden className="hidden h-[12.5rem] lg:block" />
    </>
  );
}
