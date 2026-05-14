import { NextResponse } from "next/server";
import { getAllServiceLandingSlugsForSitemap, getSiteUrl } from "@/lib/wordpress";
import { buildUrlSetXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATIC_PAGES: Array<{ path: string; priority?: string; changefreq?: string }> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about-us", priority: "0.9", changefreq: "monthly" },
  { path: "/our-services", priority: "0.9", changefreq: "monthly" },
  { path: "/our-mission", priority: "0.8", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.9", changefreq: "monthly" },
  { path: "/careers", priority: "0.8", changefreq: "weekly" },
  { path: "/gift-cards", priority: "0.8", changefreq: "monthly" },
  { path: "/book-a-cleaning", priority: "0.9", changefreq: "monthly" },
  { path: "/get-the-app", priority: "0.8", changefreq: "monthly" },
  { path: "/blogs", priority: "0.8", changefreq: "weekly" },
  { path: "/terms-and-conditions", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
];

export async function GET() {
  const base = getSiteUrl();
  const lastmod = new Date().toISOString().split("T")[0];
  const staticUrls = STATIC_PAGES.map((p) => ({
    loc: `${base}${p.path}`,
    lastmod,
    changefreq: p.changefreq,
    priority: p.priority,
  }));

  const serviceSlugs = await getAllServiceLandingSlugsForSitemap();
  const serviceUrls = serviceSlugs.map((p) => ({
    loc: `${base}/${p.slug}`,
    lastmod: p.modified ? p.modified.split("T")[0] : lastmod,
    changefreq: "weekly" as const,
    priority: "0.85",
  }));

  const urls = [...staticUrls, ...serviceUrls];
  const xml = buildUrlSetXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
