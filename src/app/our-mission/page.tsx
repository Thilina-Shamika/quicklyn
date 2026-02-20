import Link from "next/link";
import {
  getOurMissionPage,
  getHeader,
  getHomePage,
  getTestimonials,
} from "@/lib/wordpress";
import { HeroMissionText } from "@/components/our-mission/HeroMissionText";
import { HeroHeadingLogoArrow } from "@/components/our-mission/HeroHeadingLogoArrow";
import { HeroBackground } from "@/components/our-mission/HeroBackground";
import { SectionImageScroll } from "@/components/our-mission/SectionImageScroll";
import { OurTeamSection } from "@/components/our-mission/OurTeamSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata = {
  title: "Our Mission | Quicklyn",
  description:
    "Behind Quicklyn — our mission to set a new standard in home services.",
};

export default async function OurMissionPage() {
  const [page, header, homePage, testimonials] = await Promise.all([
    getOurMissionPage(),
    getHeader(),
    getHomePage(),
    getTestimonials(),
  ]);

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Our Mission content is not available. Please ensure the WordPress
          page with ACF fields is published.
        </p>
      </main>
    );
  }

  const heading = page.acf.page_heading?.trim() || "Behind";
  const heroImageUrl = page.acf.hero_image?.url;
  const pageBg = page.acf.page_background_image;
  const bgImage =
    typeof pageBg === "object" && pageBg !== null && "url" in pageBg
      ? (pageBg as { url?: string }).url
      : undefined;
  const sectionBgImage =
    bgImage ||
    "https://placehold.co/1200x600/256d6e/ffffff?text=Page+background+image";
  const headerLogoUrl = header?.acf?.header_logo?.url;
  const estimateUrl = homePage?.acf?.estimate_button_link?.url || "/#estimate";
  const estimateText =
    homePage?.acf?.estimate_button_text?.trim() || "Get An Estimate";
  const missionHeading = page.acf.sub_heading?.trim() || "Our Mission";
  const missionDescription = page.acf.description?.trim() || "";
  const sectionImageUrl = page.acf.section_image?.url;
  const commitmentHeading =
    page.acf.commitment_heading?.trim() || "Our Commitment To You";
  const commitmentDescription = page.acf.commitment_description?.trim() || "";
  const team = page.acf.team ?? [];
  const backgroundCheckIconUrl = page.acf.background_check_icon?.url;
  const backgroundCheckHeading =
    page.acf.background_check_heading?.trim() || "Background Checked Team";
  const backgroundCheckDescription =
    page.acf.background_check_desctiption?.trim() || "";

  const missionParagraphs = missionDescription
    .split(/\r?\n\r?\n/)
    .filter(Boolean);
  const commitmentParagraphs = commitmentDescription
    .split(/\r?\n\r?\n/)
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Full-page background color - teal base for entire Our Mission page */}
      <div
        className="fixed inset-0 z-0 bg-[#2a7a7c] pointer-events-none"
        aria-hidden
      />
      {/* Full-page background image - on top of teal */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sectionBgImage}
        alt=""
        className="fixed inset-0 z-0 h-full w-full object-cover object-top object-center pointer-events-none"
        aria-hidden
      />
      <main className="relative z-10">
      {/* Hero section: centered heading, logo, arrow */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-0 md:pt-28">
        {/* Hero image background - scaled down & hidden until scroll, then scale up & visible */}
        {heroImageUrl && <HeroBackground heroImageUrl={heroImageUrl} />}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <HeroHeadingLogoArrow
            heading={heading}
            headerLogoUrl={headerLogoUrl}
          />

          <HeroMissionText
            missionHeading={missionHeading}
            missionParagraphs={missionParagraphs}
            missionDescription={missionDescription}
          />
        </div>
      </section>

      {/* Section image - no page background */}
      {sectionImageUrl && (
        <SectionImageScroll sectionImageUrl={sectionImageUrl} />
      )}

      {/* Our mission section: commitment only */}
      <section className="relative z-10 min-h-[60vh] overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 pb-0 pt-16 md:pt-20">
          <h2
            className="text-center font-semibold"
            style={{
              fontSize: "32px",
              lineHeight: "33px",
            }}
          >
            {commitmentHeading}
          </h2>
          <div
            className="mt-5 space-y-3 text-center text-white/95 md:mt-6"
            style={{ fontSize: "12px", lineHeight: "19px" }}
          >
            {commitmentParagraphs.length > 0 ? (
              commitmentParagraphs.map((p, i) => (
                <p key={i}>{p.trim()}</p>
              ))
            ) : (
              <p>{commitmentDescription}</p>
            )}
          </div>
        </div>
      </section>

      {/* Our Team + Background Checked Team */}
      <OurTeamSection
        team={team}
        backgroundCheckIconUrl={backgroundCheckIconUrl}
        backgroundCheckHeading={backgroundCheckHeading}
        backgroundCheckDescription={backgroundCheckDescription}
      />

      {/* Testimonials - same as home page */}
      <TestimonialsSection testimonials={testimonials} transparentBackground />

      </main>

      {/* Fixed Get An Estimate button */}
      <Link
        href={estimateUrl}
        className="fixed left-1/2 z-[9999] flex h-12 w-[224px] -translate-x-1/2 items-center justify-center rounded-full bg-[#FFDA00] shadow-xl drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:ring-offset-2 focus:ring-offset-[#297476]"
        style={{
          minWidth: "224px",
          bottom: "max(36px, env(safe-area-inset-bottom, 0px) + 32px)",
        }}
      >
        <span className="text-base font-semibold text-[#1B5B5D]">
          {estimateText}
        </span>
      </Link>
    </div>
  );
}
