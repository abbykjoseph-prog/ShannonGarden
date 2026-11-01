// Draft - have the client review before launch; not legal advice.
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} handles your information. No cookies, no analytics, no tracking.`,
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains what information {site.name} collects through this website and what I do with it. I&apos;m
        {" "}{site.person}, a sole proprietor in Ontario, and I follow Canada&apos;s federal privacy law for businesses, the
        Personal Information Protection and Electronic Documents Act (PIPEDA).
      </p>

      <h2>The short version</h2>
      <ul>
        <li>This site doesn&apos;t use cookies.</li>
        <li>There are no analytics, no tracking pixels and no advertising scripts.</li>
        <li>If you use the contact form, your details are only used to reply to you. They are never sold or shared for marketing.</li>
      </ul>

      <h2>What the contact form collects</h2>
      <p>
        When you send a note through the <Link href="/contact" className="link">contact form</Link>, it collects your name,
        email address, phone number (if you choose to give it), neighbourhood or postal code, the kind of help you&apos;re
        after, and your message.
      </p>
      <p>
        I use this only to reply to your enquiry and, if we go ahead, to arrange and carry out the work. I don&apos;t add
        you to a mailing list.
      </p>

      <h2>How it&apos;s sent and stored</h2>
      <p>
        The form sends your message to my email inbox using Resend, an email delivery service. Resend processes the
        message only to deliver it, and its servers may be outside Canada, including in the United States.
      </p>
      <p>
        I keep enquiries in my email for as long as I need them to reply and for any work that follows, then delete them
        within two years of our last contact. {/* TODO confirm the retention period with Shannon */} If you become a client,
        I may keep basic records (such as invoices) for longer where tax law requires it.
      </p>

      <h2>Hosting</h2>
      <p>
        This website is hosted on Vercel. Like any web host, Vercel may briefly process technical information such as
        your IP address to deliver pages and protect the site from abuse. I don&apos;t use that information to identify
        or track you.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask to see the information I hold about you, have it corrected, or have it deleted. Contact me through the{" "}
        <Link href="/contact" className="link">contact page</Link> and I&apos;ll respond within 30 days.
      </p>
      <p>
        If you&apos;re not happy with how I&apos;ve handled your information, you can contact the{" "}
        <a href="https://www.priv.gc.ca" className="link" rel="noopener noreferrer">Office of the Privacy Commissioner of Canada</a>.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, I&apos;ll update it here and change the date at the top.</p>
    </LegalPage>
  );
}
