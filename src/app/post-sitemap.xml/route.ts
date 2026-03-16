import { NextResponse } from "next/server";
import { getSiteUrl, getAllPostSlugsForSitemap } from "@/lib/wordpress";
import { buildUrlSetXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const base = getSiteUrl();
  const posts = await getAllPostSlugsForSitemap();
  const urls = posts.map((p) => ({
    loc: `${base}/blogs/${p.slug}`,
    lastmod: p.modified ? p.modified.split("T")[0] : undefined,
    changefreq: "weekly" as const,
    priority: "0.7",
  }));
  const xml = buildUrlSetXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
