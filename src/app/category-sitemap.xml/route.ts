import { NextResponse } from "next/server";
import { getSiteUrl, getCategoriesForSitemap } from "@/lib/wordpress";
import { buildUrlSetXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const base = getSiteUrl();
  const categories = await getCategoriesForSitemap();
  const lastmod = new Date().toISOString().split("T")[0];
  const urls = categories.map((c) => ({
    loc: `${base}/category/${c.slug}`,
    lastmod,
    changefreq: "weekly" as const,
    priority: "0.6",
  }));
  const xml = buildUrlSetXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
