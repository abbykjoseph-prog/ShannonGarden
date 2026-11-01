"use client";

import { useState } from "react";
import { checkPostalCode } from "@/lib/postal";

export function PostalChecker() {
  const [value, setValue] = useState("");
  const answer = checkPostalCode(value);
  const tone = { yes: "border-green", likely: "border-green", outside: "border-loam/40", invalid: "border-coneflower" };

  return (
    <div>
      <label htmlFor="postal" className="font-semibold">Your postal code</label>
      <input
        id="postal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={7}
        autoComplete="postal-code"
        placeholder="M4L 1A1"
        aria-describedby="postal-answer"
        className="mt-1.5 block w-40 rounded-lg border border-loam/25 bg-paper px-3.5 py-2.5 uppercase tracking-wide text-loam placeholder:normal-case placeholder:tracking-normal placeholder:text-loam/40 focus:border-loam/60 focus:outline-none focus:ring-[3px] focus:ring-coneflower/35"
      />
      <p id="postal-answer" aria-live="polite" className="mt-3 min-h-[3.3em] text-[0.98rem]">
        {answer ? (
          <span key={answer.message} className={`block animate-[settle_250ms_ease-out] border-l-[3px] pl-3 motion-reduce:animate-none ${tone[answer.status]}`}>
            {answer.message}
          </span>
        ) : (
          <span className="text-loam/60">The first three characters are enough.</span>
        )}
      </p>
    </div>
  );
}
