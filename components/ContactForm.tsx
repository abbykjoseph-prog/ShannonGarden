"use client";

import { useState } from "react";
import { services, site } from "@/lib/site";

// No backend yet: the form composes an email in the visitor's mail app.
// TODO swap for a form service (e.g. Formspree) or a Vercel route handler if wanted.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const subject = `Garden visit request from ${get("name")}`;
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      ...(get("phone") ? [`Phone: ${get("phone")}`] : []),
      `Neighbourhood: ${get("area")}`,
      `Interested in: ${get("service")}`,
      "",
      get("message"),
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = "mt-2 w-full rounded-xl border border-forest/25 bg-cream px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
  const label = "text-sm font-semibold text-forest-deep";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={label}>Your name</label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="phone" className={label}>Phone <span className="font-normal text-ink/50">(optional)</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor="area" className={label}>Neighbourhood or city</label>
        <input id="area" name="area" required placeholder="e.g. Leslieville, Etobicoke" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="service" className={label}>What can I help with?</label>
        <select id="service" name="service" className={field} defaultValue={services[0].title}>
          {services.map((s) => (
            <option key={s.slug}>{s.title}</option>
          ))}
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>Tell me about your garden</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Size, sun or shade, what's there now, and what you'd love it to be."
          className={field}
        />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary">Send request</button>
        <p className="text-sm text-ink/60" aria-live="polite">
          {sent
            ? `Your email app should have opened with your message. If not, write to ${site.email}.`
            : "This opens your email app with your message ready to send."}
        </p>
      </div>
    </form>
  );
}
