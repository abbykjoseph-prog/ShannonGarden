"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "sbg-privacy-notice-dismissed";

/*
 * A small first-visit note. The dismissal is remembered in localStorage, not a cookie.
 * It isn't a dialog and never takes focus. On phones it steps aside while the watering can is on screen.
 */
export function PrivacyNotice() {
  const [show, setShow] = useState(false);
  const [canInView, setCanInView] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(KEY) === "1";
    } catch {
      // Storage blocked: show the note; dismissing just won't be remembered.
    }
    setShow(!dismissed);
  }, []);

  useEffect(() => {
    if (!show) return;
    const can = document.getElementById("watering-can");
    if (!can) return;
    const io = new IntersectionObserver(([e]) => setCanInView(e.isIntersecting));
    io.observe(can);
    return () => io.disconnect();
  }, [show]);

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // Ignore; it'll show again next visit.
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <section
      aria-label="Privacy note"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-loam/15 bg-paper px-4 py-3 shadow-[0_-2px_12px_rgb(30_42_31/0.08)] animate-[settle_300ms_ease-out] motion-reduce:animate-none sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-sm sm:rounded-xl sm:border sm:p-5 ${
        canInView ? "max-sm:hidden" : ""
      }`}
    >
      <p className="text-[0.95rem] leading-snug text-loam/85">
        This site doesn&apos;t use cookies or track you. If you use the contact form, your details are only used to reply
        to you.
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-4 sm:mt-4">
        <Link href="/privacy" className="link text-[0.95rem]">
          Privacy policy
        </Link>
        <button type="button" onClick={dismiss} className="btn-primary min-h-[2.5rem] px-5 text-[0.92rem]">
          Okay
        </button>
      </div>
    </section>
  );
}
