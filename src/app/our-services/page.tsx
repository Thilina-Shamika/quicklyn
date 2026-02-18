import Link from "next/link";
import { getOurServicesPage, getServices } from "@/lib/wordpress";
import { OurServicesHero } from "@/components/our-services/OurServicesHero";
import { OurMainServicesSection } from "@/components/our-services/OurMainServicesSection";

export default async function OurServicesPage() {
  const [page, services] = await Promise.all([
    getOurServicesPage(),
    getServices(),
  ]);

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Our Services content is not available. Please ensure the WordPress
          page with ACF fields is published.
        </p>
      </main>
    );
  }

  const {
    page_heading,
    ["1st_section_background"]: heroImage,
    service_sub_heading,
    service_description,
  } = page.acf;

  const heroImageUrl = heroImage?.url;
  const isLocalHero = !!heroImageUrl && heroImageUrl.includes("quicklyn-headless.local");

  const descriptionParagraphs =
    service_description
      ?.split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      <OurServicesHero
        heading={page_heading ?? "Our Services"}
        subHeading={service_sub_heading ?? undefined}
        descriptionParagraphs={descriptionParagraphs}
        heroImageUrl={heroImageUrl}
        heroImageAlt={heroImage?.alt || undefined}
        isLocalHero={isLocalHero}
      />

      <OurMainServicesSection services={services} />

      {/* Floating CTA at bottom, same behaviour as home page */}
      <Link
        href="#estimate"
        className="fixed left-1/2 z-[9999] flex h-12 w-[224px] -translate-x-1/2 items-center justify-center rounded-full bg-[#FFDA00] shadow-xl drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:ring-offset-2 focus:ring-offset-[#297476]"
        style={{
          minWidth: "224px",
          bottom: "max(36px, env(safe-area-inset-bottom, 0px) + 32px)",
        }}
      >
        <span className="text-base font-semibold text-[#1B5B5D]">
          Get An Estimate
        </span>
      </Link>
    </main>
  );
}

