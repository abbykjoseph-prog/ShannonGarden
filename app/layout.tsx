import type { Metadata } from "next";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/schibsted-grotesk/index.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Garden design and care in Toronto and the GTA`,
    template: `%s | ${site.name}`,
  },
  description: `${site.person} is a trained horticulturist offering ${site.localSeo}: design, planting, seasonal care, balconies and native pollinator gardens.`,
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: site.name, locale: "en_CA", type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  founder: site.person,
  telephone: site.phone,
  email: site.email,
  url: site.url,
  areaServed: site.serviceArea.map((name) => ({ "@type": "City", name })),
  description: `Garden design and care in Toronto and the GTA by trained horticulturist ${site.person}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
