// Draft - have the client review before launch; not legal advice.
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: `Terms for using the ${site.businessName} website.`,
};

export default function Terms() {
  return (
    <LegalPage eyebrow="Terms and conditions" title="Terms and conditions">
      <p>
        This website is operated by {site.ownerName}, trading as {site.businessName}. These terms cover your use of it. By
        using it, you agree to them.
      </p>

      <h2>Information on this site</h2>
      <p>
        The content here, including the monthly garden tasks, is general information to help you look after your garden.
        It isn&apos;t advice for your particular site, and every garden is different. I try to keep it accurate and up to
        date but can&apos;t promise it always will be.
      </p>

      <h2>Quotes and work</h2>
      <p>
        Prices are only given after a site visit, in a written quote. Any work I do for you is covered by what we agree in
        that quote, not by anything on this website.
      </p>

      <h2>Plants are living things</h2>
      <p>
        I choose and care for plants so they have the best chance to thrive, but weather, pests, wildlife and aftercare
        are outside my control. I don&apos;t guarantee plant survival beyond what we agree in writing.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Some pages link to other websites. I&apos;m not responsible for their content or how they handle your information.
      </p>

      <h2>Content and logo</h2>
      <p>
        The text, drawings and the {site.businessName} name and logo belong to {site.ownerName}. Please don&apos;t reuse them without
        asking.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, I&apos;m not liable for any loss arising from your use of this website or reliance on
        its content.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there.</p>

      <h2>Changes</h2>
      <p>
        I may update these terms from time to time. The date at the top shows when they last changed. Questions? Get in
        touch through the <Link href="/contact" className="link">contact page</Link>.
      </p>
    </LegalPage>
  );
}
