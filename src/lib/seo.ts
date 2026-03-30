import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/wordpress";

export const SITE_NAME = "Quicklyn";
export const DEFAULT_DESCRIPTION =
  "Trusted, vetted cleaning professionals delivering consistent, white-glove service across NYC.";

/** Resolves relative URLs in metadata (OG images, etc.) */
export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Set false for thin/utility pages if you ever need it */
  index?: boolean;
};

/** Avoid "Quicklyn | Quicklyn" and duplicate brand suffixes (bad for Google sitelinks). */
export function formatDocumentTitle(raw: string): string {
  const t = raw.trim();
  if (!t) return SITE_NAME;
  const brandSuffix = ` | ${SITE_NAME}`;
  // WordPress may already send "Page Title | Quicklyn"
  if (t.toLowerCase().endsWith(brandSuffix.toLowerCase())) return t;
  // Single-word brand only → give a real page label
  if (t === SITE_NAME) return `${SITE_NAME} | Home`;
  return `${t}${brandSuffix}`;
}

/** Blog / CMS titles: never duplicate "| Quicklyn". */
export function formatArticleTitle(postTitle: string): string {
  const t = postTitle.trim();
  if (!t) return `Blog | ${SITE_NAME}`;
  if (/\|\s*Quicklyn\s*$/i.test(t)) return t;
  if (t === SITE_NAME) return `${SITE_NAME} | Blog`;
  return `${t} | ${SITE_NAME}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetaInput): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = formatDocumentTitle(title);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
