import Link from "next/link";
import { getOurServicesPage, getServices, getAppLink } from "@/lib/wordpress";
import { OurServicesHero } from "@/components/our-services/OurServicesHero";
import { OurMainServicesSection } from "@/components/our-services/OurMainServicesSection";
import { OurServicesExtrasSection } from "@/components/our-services/OurServicesExtrasSection";
import { OurServicesFeatureListSection } from "@/components/our-services/OurServicesFeatureListSection";
import { HomeAppDownloadSection } from "@/components/home/HomeAppDownloadSection";

export default async function OurServicesPage() {
  const [page, services, appLink] = await Promise.all([
    getOurServicesPage(),
    getServices(),
    getAppLink(),
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
    ["1st_section_desktop_background"]: desktopHeroImageNew,
    desktop_background_image: desktopHeroImageLegacy,
    service_sub_heading,
    service_description,
  } = page.acf;

  const heroImageUrl = heroImage?.url;
  const desktopHeroImage = desktopHeroImageNew ?? desktopHeroImageLegacy ?? heroImage;
  const desktopHeroImageUrl = desktopHeroImage?.url;
  const isLocalHero =
    (!!heroImageUrl && heroImageUrl.includes("quicklyn-headless.local")) ||
    (!!desktopHeroImageUrl &&
      desktopHeroImageUrl.includes("quicklyn-headless.local"));

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
        desktopHeroImageUrl={desktopHeroImageUrl}
        desktopHeroImageAlt={desktopHeroImage?.alt || undefined}
        isLocalHero={isLocalHero}
      />

      {/* Desktop / tablet intro text section (service sub heading + description) */}
      {(service_sub_heading || descriptionParagraphs.length > 0) && (
        <section className="hidden bg-[#2a7a7c] text-white md:block">
          <div className="mx-auto flex w-full max-w-[1180px] items-start gap-10 px-6 pt-20 pb-6 lg:px-6 lg:pt-24 lg:pb-8">
            <div className="w-[40%] max-w-[420px] py-6">
              {service_sub_heading && (
                <h2 className="text-[40px] leading-[1.1] font-normal text-white">
                  {service_sub_heading}
                </h2>
              )}
            </div>
            <div className="w-[60%] max-w-[520px] space-y-4 py-6 text-[16px] leading-[1.7] text-white/90">
              {descriptionParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <OurMainServicesSection services={services} appLink={appLink} />

      <OurServicesExtrasSection extras={page.acf.extras_list ?? []} />

      <OurServicesFeatureListSection
        features={page.acf.feature_list ?? []}
        backgroundImage={page.acf.background_image}
      />

      <HomeAppDownloadSection data={appLink} sectionBackgroundColor="#2a7a7c" tightBottom />

      {/* Floating CTA at bottom, same behaviour as home page */}
      <Link
        href="/book-a-cleaning"
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
