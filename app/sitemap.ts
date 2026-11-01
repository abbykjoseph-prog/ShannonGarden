import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...nav, { href: "/privacy" }, { href: "/terms" }].map((n) => ({ url: `${site.url}${n.href === "/" ? "" : n.href}`, changeFrequency: "monthly" }));
}
