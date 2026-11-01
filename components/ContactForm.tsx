"use client";

import { useRef, useState } from "react";
import { validateContact, type ContactErrors, type ContactFields } from "@/lib/contact";
import { services, site } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; name: string }
  | { kind: "unavailable" }
  | { kind: "failed" };

const empty: ContactFields = { name: "", email: "", phone: "", area: "", help: "", message: "" };

const labels: Record<keyof ContactFields, string> = {
  name: "Your name",
  email: "Email",
  phone: "Phone",
  area: "Neighbourhood or postal code",
  help: "What kind of help?",
  message: "Tell me about your garden",
};

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof ContactFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    // Clear a field's error as soon as it's fixed.
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: validateContact({ ...values, [k]: e.target.value })[k] }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    const first = (Object.keys(labels) as (keyof ContactFields)[]).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      if (res.ok) {
        setStatus({ kind: "sent", name: values.name.trim().split(/\s+/)[0] });
        setValues(empty);
      } else if (res.status === 503) {
        setStatus({ kind: "unavailable" });
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) setErrors(data.errors);
        setStatus(data.errors ? { kind: "idle" } : { kind: "failed" });
      } else {
        setStatus({ kind: "failed" });
      }
    } catch {
      setStatus({ kind: "failed" });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Garden visit request")}&body=${encodeURIComponent(
    [values.name && `Name: ${values.name}`, values.area && `Area: ${values.area}`, values.help && `Help with: ${values.help}`, "", values.message]
      .filter((l) => l !== "")
      .join("\n"),
  )}`;

  const field = (k: keyof ContactFields) =>
    `mt-1.5 block w-full rounded-lg border bg-paper px-3.5 py-3 text-loam placeholder:text-loam/40 transition-colors focus:outline-none focus-visible:outline-none focus:ring-[3px] focus:ring-coneflower/35 ${
      errors[k] ? "border-coneflower" : "border-loam/25 focus:border-loam/60"
    }`;

  const describe = (k: keyof ContactFields, hint?: string) => [hint && `${k}-hint`, errors[k] && `${k}-error`].filter(Boolean).join(" ") || undefined;

  const Err = ({ k }: { k: keyof ContactFields }) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-[0.92rem] text-coneflower">
        {errors[k]}
      </p>
    ) : null;

  if (status.kind === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="animate-[settle_300ms_ease-out] motion-reduce:animate-none">
        <h2 className="text-3xl">Thanks, {status.name}. Your note is with me.</h2>
        <p className="mt-3 max-w-prose text-loam/80">
          I&apos;ll reply {site.responseTime} to arrange a time to see the garden. If it&apos;s urgent, my number is on
          this page under &ldquo;Reach me directly&rdquo;.
        </p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="link mt-6 text-[0.98rem]">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="font-semibold">{labels.name}</label>
        <input id="name" name="name" value={values.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describe("name")} className={field("name")} />
        <Err k="name" />
      </div>
      <div>
        <label htmlFor="email" className="font-semibold">{labels.email}</label>
        <input id="email" name="email" type="email" inputMode="email" value={values.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describe("email")} className={field("email")} />
        <Err k="email" />
      </div>
      <div>
        <label htmlFor="phone" className="font-semibold">
          {labels.phone} <span className="font-normal text-loam/60">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" value={values.phone} onChange={set("phone")} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describe("phone")} className={field("phone")} />
        <Err k="phone" />
      </div>
      <div>
        <label htmlFor="area" className="font-semibold">{labels.area}</label>
        <input id="area" name="area" value={values.area} onChange={set("area")} autoComplete="postal-code" placeholder="e.g. Leslieville or M4L" aria-invalid={!!errors.area} aria-describedby={describe("area")} className={field("area")} />
        <Err k="area" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="help" className="font-semibold">{labels.help}</label>
        <select id="help" name="help" value={values.help} onChange={set("help")} aria-invalid={!!errors.help} aria-describedby={describe("help")} className={`${field("help")} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%231E2A1F%22 stroke-width=%221.6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}>
          <option value="" disabled>Choose one</option>
          {services.map((s) => (
            <option key={s.slug}>{s.title}</option>
          ))}
          <option>Not sure yet</option>
        </select>
        <Err k="help" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="font-semibold">{labels.message}</label>
        <p id="message-hint" className="text-[0.92rem] text-loam/65">Roughly how big, sun or shade, what&apos;s there now and what you&apos;d like.</p>
        <textarea id="message" name="message" rows={5} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={describe("message", "hint")} className={field("message")} />
        <Err k="message" />
      </div>

      {/* Honeypot for bots; hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status.kind === "sending"} className="btn-primary w-full disabled:cursor-progress disabled:opacity-70 sm:w-auto">
          {status.kind === "sending" ? "Sending your note…" : "Send my note to Shannon"}
        </button>

        {Object.keys(errors).some((k) => errors[k as keyof ContactFields]) && status.kind === "idle" && (
          <p className="mt-3 text-[0.95rem] text-coneflower">A few details need fixing before this can send. They&apos;re marked above.</p>
        )}

        {(status.kind === "unavailable" || status.kind === "failed") && (
          <div ref={statusRef} tabIndex={-1} role="alert" className="mt-5 animate-[settle_300ms_ease-out] rounded-lg border-l-[3px] border-coneflower bg-paper p-4 motion-reduce:animate-none">
            <p className="font-semibold">Your message hasn&apos;t been sent.</p>
            <p className="mt-1 text-loam/80">
              {status.kind === "unavailable"
                ? "The contact form isn't switched on yet."
                : "Something went wrong on my end."}{" "}
              Please email me directly at{" "}
              <a href={mailto} className="link font-semibold">{site.email}</a> (this opens your email with what you wrote).
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
