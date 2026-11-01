"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { nav, site } from "@/lib/site";

/*
 * Desktop (lg and up), fresh load of the home page only: the long logo, large and centred on a cream banner,
 * with no nav bar. The first scroll (or keyboard focus in the header) plays one transition to the compact bar:
 * the logo moves and scales into the bar's left slot while fading, the bar fades in a beat later, and the
 * square monogram fades in where the logo lands. It never goes back. Every other page, and Home reached by
 * client-side navigation, always shows the compact bar. Below lg it's always the compact bar.
 */
const DOCK_AT = 40; // px scrolled before the one-way transition
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const BIG_W = 544; // the opening logo's width (34rem)
const BIG_H = (BIG_W * 457) / 1800;
const BIG_TOP = 30;
const BANNER_H = 200; // matches the 12.5rem spacer below the header
const BAR_H = 80;
const GAP = BANNER_H - BAR_H; // the space the banner reserved, closed up once the bar docks

// useLayoutEffect on the client (so the gap closes before paint), a plain effect during the server render.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Set once the opening has played (or been skipped) in this visit. Module scope survives client-side
// navigation but resets on a full page load, which is exactly when the big logo should show again.
// Only ever written in effects, so it's never shared between requests on the server.
let introDone = false;

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
  // `intro`: the big logo is showing. `introPage`: this page view began with it (its banner and logo stay
  // mounted to play their exit). `reserve`: the banner's space is still held open above the page.
  const [intro, setIntro] = useState(() => pathname === "/" && !introDone);
  const [introPage, setIntroPage] = useState(intro);
  const [reserve, setReserve] = useState(intro);
  const closeFrom = useRef<number | null>(null);
  const [flip, setFlip] = useState<Flip | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLImageElement>(null);
  const firstPath = useRef(pathname);
  const desktop = useMedia("(min-width: 1024px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const docked = !intro;

  // Ends the opening: the bar docks and the banner's reserved space closes up.
  const dock = () => {
    introDone = true;
    closeFrom.current = window.scrollY;
    setIntro(false);
    setReserve(false);
  };

  // Closing the gap without a jump: scroll up by the same amount, so nothing moves on screen. If the page
  // isn't scrolled far enough to absorb it all, the rest is a short transform slide in step with the banner.
  useIsoLayoutEffect(() => {
    const y = closeFrom.current;
    if (reserve || y === null) return;
    closeFrom.current = null;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const target = Math.max(0, y - GAP);
    window.scrollTo(0, target);
    const shift = GAP - (y - target);
    if (shift <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
    els.forEach((el) => {
      el.style.transition = "none";
      el.style.transform = `translateY(${shift}px)`;
    });
    void els[0]?.offsetHeight; // commit the starting position before animating from it
    els.forEach((el) => {
      el.style.transition = t("transform", 650);
      el.style.transform = "";
    });
    const done = window.setTimeout(() => els.forEach((el) => (el.style.transition = "")), 700);
    return () => window.clearTimeout(done);
  }, [reserve]);

  // One way only: the first scroll past 40px ends the opening for this visit.
  useEffect(() => {
    if (!intro) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      if (window.scrollY > DOCK_AT) dock();
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
  }, [intro]);

  // Leaving the first page (client-side) ends the opening for good, and drops its reserved space.
  useEffect(() => {
    if (pathname === firstPath.current) return;
    introDone = true;
    setIntro(false);
    setIntroPage(false);
    setReserve(false);
  }, [pathname]);

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

  // Keyboard focus landing in the hidden bar brings it in, so focus is never on something invisible.
  useEffect(() => {
    if (!intro) return;
    const onFocusIn = (e: FocusEvent) => {
      if (headerRef.current?.contains(e.target as Node | null)) dock();
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [intro]);

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

  // Timings: the logo moves first, the bar follows ~120ms later, the monogram arrives last.
  // Reduced motion: a plain 200ms crossfade, nothing moves.
  const fade = (ms: number, delay: number) => (reduced ? t("opacity", 200) : t("opacity", ms, delay));
  const bigStyle: CSSProperties = {
    transform:
      !flip || reduced
        ? // Before measuring (including the server render), centre it with CSS so the first paint is right.
          `translate(${flip ? `${flip.fromX}px` : `calc(50vw - ${BIG_W / 2}px)`}, ${BIG_TOP}px)`
        : docked
          ? `translate(${flip.toX}px, ${flip.toY}px) scale(${flip.scale})`
          : `translate(${flip.fromX}px, ${BIG_TOP}px)`,
    opacity: docked ? 0 : 1,
    transition: reduced ? t("opacity", 200) : `${t("transform", 650)}, ${t("opacity", 450, 200)}`,
  };
  const barStyle: CSSProperties | undefined = desktop
    ? {
        opacity: docked ? 1 : 0,
        transform: docked || reduced ? "none" : "translateY(-8px)",
        transition: reduced ? t("opacity", 200) : `${t("opacity", 520, 120)}, ${t("transform", 520, 120)}`,
        pointerEvents: docked ? "auto" : "none",
      }
    : undefined;
  // The cream banner behind the big logo shrinks (scaleY, from the top) into the bar's background.
  const bannerStyle: CSSProperties = {
    transform: docked && !reduced ? `scaleY(${BAR_H / BANNER_H})` : "none",
    opacity: docked && reduced ? 0 : 1,
    transition: reduced ? t("opacity", 200) : t("transform", 650),
  };
  const slotStyle: CSSProperties | undefined = desktop
    ? { opacity: docked ? 1 : 0, transition: fade(280, 420) }
    : undefined;

  return (
    <>
      {introPage && (
        <>
          {/* Desktop cream banner behind the opening logo, with a quiet brand-green rule along its bottom edge. */}
          <div aria-hidden className="fixed inset-x-0 top-0 z-20 hidden origin-top border-b border-forest/15 bg-cream-warm lg:block" style={{ height: BANNER_H, ...bannerStyle }} />

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
        </>
      )}

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 border-b border-forest/15 bg-cream-warm/95 backdrop-blur-sm lg:fixed lg:inset-x-0 lg:bg-cream-warm/90 ${
          // Server render and first paint of the opening: no bar on desktop yet (inline styles take over after).
          intro ? "lg:pointer-events-none lg:-translate-y-2 lg:opacity-0" : ""
        }`}
        style={barStyle}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="shrink-0" aria-label={`${site.businessName}, home`}>
            <Image ref={slotRef} src="/monogram.png" alt="" width={600} height={600} priority className={`h-12 w-auto sm:h-14 ${intro ? "lg:opacity-0" : ""}`} style={slotStyle} />
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

      {/* Reserves the bar's space on desktop (the banner's while the home opening is showing). */}
      <div aria-hidden className={`hidden lg:block ${reserve ? "h-[12.5rem]" : "h-20"}`} />
    </>
  );
}
