/** Build a sitemap index XML that references child sitemaps. */
export function buildSitemapIndexXml(sitemapUrls: string[], baseUrl: string): string {
  const lastmod = new Date().toISOString().split("T")[0];
  const entries = sitemapUrls
    .map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/** Build a URL set sitemap XML. */
export function buildUrlSetXml(
  urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>,
): string {
  const entries = urls
    .map((u) => {
      let entry = `  <url>\n    <loc>${escapeXml(u.loc)}</loc>`;
      if (u.lastmod) entry += `\n    <lastmod>${u.lastmod}</lastmod>`;
      if (u.changefreq) entry += `\n    <changefreq>${u.changefreq}</changefreq>`;
      if (u.priority !== undefined) entry += `\n    <priority>${u.priority}</priority>`;
      entry += "\n  </url>";
      return entry;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
