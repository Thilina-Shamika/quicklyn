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

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetaInput): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes("Quicklyn") ? title : `${title} | ${SITE_NAME}`;

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
