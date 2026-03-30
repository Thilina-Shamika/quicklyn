import { getSiteUrl } from "@/lib/wordpress";
import { SITE_NAME } from "@/lib/seo";

/** LocalBusiness / Organization structured data for rich results */
export function OrganizationJsonLd() {
  const url = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url,
    description:
      "Premium cleaning services in New York City. Trusted, vetted cleaning professionals.",
    areaServed: {
      "@type": "City",
      name: "New York",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
