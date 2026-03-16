import { NextResponse } from "next/server";
import { getSiteUrl, getProductsForSitemap } from "@/lib/wordpress";
import { buildUrlSetXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const base = getSiteUrl();
  const products = await getProductsForSitemap();
  const lastmod = new Date().toISOString().split("T")[0];
  const urls = products.map((p) => ({
    loc: `${base}/product/${p.slug}`,
    lastmod: p.modified ? p.modified.split("T")[0] : lastmod,
    changefreq: "weekly" as const,
    priority: "0.8",
  }));
  const xml = buildUrlSetXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
