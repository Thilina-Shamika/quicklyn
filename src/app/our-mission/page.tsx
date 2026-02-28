import Link from "next/link";
import {
  getOurMissionPage,
  getHeader,
  getHomePage,
  getTestimonials,
  getAppLink,
} from "@/lib/wordpress";
import { HeroMissionText } from "@/components/our-mission/HeroMissionText";
import { HeroHeadingLogoArrow } from "@/components/our-mission/HeroHeadingLogoArrow";
import { HeroBackground } from "@/components/our-mission/HeroBackground";
import { OurMissionHeroDesktop } from "@/components/our-mission/OurMissionHeroDesktop";
import { SectionImageScroll } from "@/components/our-mission/SectionImageScroll";
import { OurTeamSection } from "@/components/our-mission/OurTeamSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeAppDownloadSection } from "@/components/home/HomeAppDownloadSection";

export const metadata = {
  title: "Our Mission | Quicklyn",
  description:
    "Behind Quicklyn — our mission to set a new standard in home services.",
};

export default async function OurMissionPage() {
  const [page, header, homePage, testimonials, appLink] = await Promise.all([
    getOurMissionPage(),
    getHeader(),
    getHomePage(),
    getTestimonials(),
    getAppLink(),
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
  const desktopHeroImageUrl = page.acf.desktop_background?.url ?? heroImageUrl;
  const pageBg = page.acf.page_background_image;
  const bgImage =
    typeof pageBg === "object" && pageBg !== null && "url" in pageBg
      ? (pageBg as { url?: string }).url
      : undefined;
  const sectionBgImage =
    bgImage ||
    "https://placehold.co/1200x600/256d6e/ffffff?text=Page+background+image";
  const headerLogoUrl = header?.acf?.header_logo?.url;
  const estimateUrl = "/book-a-cleaning";
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#2a7a7c] text-white">
      {/* Full-page background — mobile only (desktop has no page background) */}
      <div
        className="fixed inset-0 z-0 bg-[#2a7a7c] pointer-events-none md:hidden"
        aria-hidden
      />
      {sectionBgImage && (
        <div
          className="fixed inset-0 z-0 pointer-events-none md:hidden"
          style={{
            backgroundImage: `url(${sectionBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
      )}
      <main className="relative z-10">
      {/* Mobile hero: centered heading, logo, arrow, mission text (unchanged) */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-0 md:hidden md:pt-28">
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

      {/* Desktop / tablet hero: full-width image + overlay, Behind + logo + scroll arrow */}
      <OurMissionHeroDesktop
        heading={heading}
        headerLogoUrl={headerLogoUrl}
        heroImageUrl={desktopHeroImageUrl}
      />

      {/* Desktop / tablet: Our Mission section — two columns: text left, image right (no section background) */}
      <section className="relative z-10 hidden overflow-hidden px-6 pt-8 pb-16 md:block lg:pt-10 lg:pb-20">
        <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex flex-1 flex-col justify-center">
            {missionHeading && (
              <h2
                className="font-semibold text-white"
                style={{ fontSize: "96px", lineHeight: "86px" }}
              >
                {missionHeading.split(/\s+/).map((word, i) => (
                  <span key={i} className="block">
                    {word}
                  </span>
                ))}
              </h2>
            )}
            {missionDescription && (
              <div className="mt-6 space-y-4 text-left text-base leading-relaxed text-white/95 lg:text-[18px]">
                {missionParagraphs.length > 0 ? (
                  missionParagraphs.map((p, i) => (
                    <p key={i}>{p.trim()}</p>
                  ))
                ) : (
                  <p>{missionDescription}</p>
                )}
              </div>
            )}
          </div>
          {sectionImageUrl && (
            <div className="flex flex-1 shrink-0 justify-center lg:max-w-[50%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sectionImageUrl}
                alt=""
                className="w-full max-w-md rounded-2xl object-cover lg:max-w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Section image — mobile only (desktop uses image in Our Mission section above) */}
      {sectionImageUrl && (
        <div className="md:hidden">
          <SectionImageScroll sectionImageUrl={sectionImageUrl} />
        </div>
      )}

      {/* Our mission section: commitment — mobile (unchanged) */}
      <section className="relative z-10 min-h-[60vh] overflow-hidden md:hidden">
        <div className="mx-auto max-w-3xl px-6 pb-0 pt-0 md:pt-2">
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

      {/* Our Commitment — desktop: optional bg image + linear gradient overlay */}
      <section className="relative hidden min-h-[60vh] overflow-hidden bg-[#2a7a7c] md:block">
        {sectionBgImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${sectionBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden
          />
        )}
        {/* Linear gradient: top #2a7a7c → middle transparent → bottom #2a7a7c */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: "linear-gradient(to bottom, #2a7a7c 0%, transparent 50%, #2a7a7c 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 pt-0 pb-16 lg:pt-2 lg:pb-20">
          <div className="w-full max-w-xl text-center lg:max-w-2xl">
            <h2
              className="text-center font-semibold text-white"
              style={{ fontSize: "49px", lineHeight: "52px" }}
            >
              {(() => {
                const words = commitmentHeading.trim().split(/\s+/);
                if (words.length <= 3)
                  return words.map((word, i) => (
                    <span key={i} className="block">
                      {word}
                    </span>
                  ));
                return (
                  <>
                    <span className="block">{words[0]}</span>
                    <span className="block">{words[1]}</span>
                    <span className="block">{words.slice(2).join(" ")}</span>
                  </>
                );
              })()}
            </h2>
            <div
              className="mt-6 space-y-4 font-normal text-white"
              style={{ fontSize: "18px", lineHeight: "31px" }}
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
        </div>
        {/* Our Team — desktop: below commitment text block */}
        <div className="relative z-10 hidden md:block">
          <OurTeamSection
            team={team}
            backgroundCheckIconUrl={backgroundCheckIconUrl}
            backgroundCheckHeading={backgroundCheckHeading}
            backgroundCheckDescription={backgroundCheckDescription}
          />
        </div>
      </section>

      {/* Our Team + Background Checked Team — mobile only (desktop is inside Our Commitment section above) */}
      <div className="md:hidden">
        <OurTeamSection
          team={team}
          backgroundCheckIconUrl={backgroundCheckIconUrl}
          backgroundCheckHeading={backgroundCheckHeading}
          backgroundCheckDescription={backgroundCheckDescription}
        />
      </div>

      {/* Testimonials - same as home page; mobile: pull up to reduce gap from Our Team */}
      <div className="-mt-20 md:mt-0">
        <TestimonialsSection testimonials={testimonials} transparentBackground />
      </div>

      {/* Download the app - same as home page, no section background, no duplicate text */}
      <HomeAppDownloadSection data={appLink} transparentBackground />

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
