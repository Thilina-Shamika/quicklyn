import { NextResponse } from "next/server";
import { getSiteUrl, getTagsForSitemap } from "@/lib/wordpress";
import { buildUrlSetXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const base = getSiteUrl();
  const tags = await getTagsForSitemap();
  const lastmod = new Date().toISOString().split("T")[0];
  const urls = tags.map((t) => ({
    loc: `${base}/tag/${t.slug}`,
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
