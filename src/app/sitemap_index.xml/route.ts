import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/wordpress";
import { buildSitemapIndexXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const base = getSiteUrl();
  const sitemaps = [
    `${base}/page-sitemap.xml`,
    `${base}/post-sitemap.xml`,
    `${base}/category-sitemap.xml`,
    `${base}/post_tag-sitemap.xml`,
    `${base}/product-sitemap.xml`,
  ];
  const xml = buildSitemapIndexXml(sitemaps, base);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
