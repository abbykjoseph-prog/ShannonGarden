// Shared by the contact form (client) and /api/contact (server) so both check the same rules.
export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  area: string;
  help: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {};
  if (!f.name.trim()) e.name = "Please tell me your name.";
  if (!f.email.trim()) e.email = "I need an email address to reply to you.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "That email address looks incomplete. Check for a missing @ or a typo.";
  if (f.phone.trim() && f.phone.replace(/\D/g, "").length < 10) e.phone = "Phone numbers need 10 digits, including the area code. Or leave it blank.";
  if (!f.area.trim()) e.area = "Add your neighbourhood or postal code so I know where the garden is.";
  if (!f.help) e.help = "Pick the kind of help closest to what you need. “Not sure yet” is fine.";
  if (f.message.trim().length < 10) e.message = "A sentence or two about the garden helps me prepare for the visit.";
  return e;
}
