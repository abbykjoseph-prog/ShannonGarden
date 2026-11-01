import { NextResponse } from "next/server";
import { validateContact, type ContactFields } from "@/lib/contact";
import { site } from "@/lib/site";

// Sends contact form messages through Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO. CONTACT_FROM is optional and must be a sender on a domain verified in Resend.
export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Partial<ContactFields> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (body.website) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const fields: ContactFields = {
    name: String(body.name ?? "").slice(0, 200),
    email: String(body.email ?? "").slice(0, 200),
    phone: String(body.phone ?? "").slice(0, 50),
    area: String(body.area ?? "").slice(0, 200),
    help: String(body.help ?? "").slice(0, 200),
    message: String(body.message ?? "").slice(0, 5000),
  };
  const errors = validateContact(fields);
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "invalid", errors }, { status: 400 });
  }

  const text = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone || "not given"}`,
    `Neighbourhood / postal code: ${fields.area}`,
    `Help with: ${fields.help}`,
    "",
    fields.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || `${site.businessName} <onboarding@resend.dev>`,
      to: to.split(",").map((s) => s.trim()),
      reply_to: fields.email,
      subject: `Garden visit request: ${fields.name}, ${fields.area}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
