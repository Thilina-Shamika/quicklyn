import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/wordpress";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: [] },
    sitemap: `${base}/sitemap_index.xml`,
  };
}
