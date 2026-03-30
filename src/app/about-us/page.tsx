import { buildPageMetadata } from "@/lib/seo";
import { getAboutUsPage, getHeader } from "@/lib/wordpress";
import type { AboutUsFeatureItem, AboutUsTeamMember } from "@/types/wordpress";
import { AboutUsScrollSection } from "@/components/about-us/AboutUsScrollSection";
import { AboutUsDesktopSection } from "@/components/about-us/AboutUsDesktopSection";
import { AboutUsExecutiveTeam } from "@/components/about-us/AboutUsExecutiveTeam";
import { AboutUsInvestorRelations } from "@/components/about-us/AboutUsInvestorRelations";

export const metadata = buildPageMetadata({
  title: "About us | Quicklyn",
  description:
    "Quicklyn is a technology-driven platform focused on making everyday services faster, more reliable, and easier to access.",
  path: "/about-us",
});

export default async function AboutUsPage() {
  const [page, header] = await Promise.all([
    getAboutUsPage(),
    getHeader(),
  ]);

  const headerLogoUrl = header?.acf?.header_logo?.url;
  const acf = page?.acf;

  if (!acf) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2a7a7c] px-6 text-white">
        <p className="text-center text-sm text-white/80">
          About us content is not available.
        </p>
      </div>
    );
  }

  const heading = (acf.heading && String(acf.heading).trim()) || "About";
  const descriptionText = acf.description ? String(acf.description).trim() : "";
  const descriptionParagraphs = descriptionText
    ? descriptionText.split(/\r?\n\r?\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const pageBackground =
    acf.page_background &&
    typeof acf.page_background === "object" &&
    "url" in acf.page_background
      ? (acf.page_background as { url?: string }).url
      : undefined;

  const desktopBg =
    acf.desktop_background && typeof acf.desktop_background === "object" && "url" in acf.desktop_background
      ? (acf.desktop_background as { url?: string }).url
      : acf.desktop_background_image && typeof acf.desktop_background_image === "object" && "url" in acf.desktop_background_image
        ? (acf.desktop_background_image as { url?: string }).url
        : undefined;
  const desktopBackgroundUrl = desktopBg || pageBackground;

  const features: { title: string; iconUrl?: string }[] = Array.isArray(acf.features)
    ? (acf.features as AboutUsFeatureItem[]).map((f) => ({
        title: (f.feature_name || f.feature_title || "").trim(),
        iconUrl:
          f.feature_icon && typeof f.feature_icon === "object" && "url" in f.feature_icon
            ? (f.feature_icon as { url?: string }).url
            : undefined,
      }))
    : [];

  const team = (Array.isArray(acf.executive_team)
    ? acf.executive_team
    : []) as AboutUsTeamMember[];

  const investorTitle = acf.investor_title ? String(acf.investor_title).trim() : "";
  const investorDescription = acf.investor_description
    ? String(acf.investor_description).trim()
    : "";
  const investorParagraphs = investorDescription
    ? investorDescription.split(/\r?\n\r?\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const contactEmail = acf.contact_email ? String(acf.contact_email).trim() : "";
  const contactLink = acf.contact_link && typeof acf.contact_link === "object" && "url" in acf.contact_link
    ? (acf.contact_link as { url?: string; title?: string })
    : null;
  const contactUrl = contactLink?.url || (contactEmail ? `mailto:${contactEmail}` : "");
  const contactLabel = (contactLink?.title && String(contactLink.title).trim()) || contactEmail || "Contact us";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#2a7a7c] text-white">
      {/* Mobile background */}
      <div
        className="fixed inset-0 z-0 bg-[#2a7a7c] pointer-events-none md:hidden"
        aria-hidden
      />
      <div className="fixed inset-0 z-0 pointer-events-none md:hidden" aria-hidden>
        {pageBackground ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pageBackground}
            alt=""
            className="h-full w-full object-cover object-top"
            aria-hidden
          />
        ) : (
          <div className="opacity-30" aria-hidden>
            <svg
              className="h-full w-full object-cover"
              viewBox="0 0 1200 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 200 Q300 100 600 200 T1200 200 V800 H0 Z"
                fill="rgba(255,255,255,0.06)"
              />
              <path
                d="M0 400 Q400 300 800 400 T1600 400 V800 H0 Z"
                fill="rgba(255,255,255,0.05)"
              />
              <path
                d="M0 600 Q350 500 700 600 T1400 600 V800 H0 Z"
                fill="rgba(255,255,255,0.04)"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Desktop/tablet background — full page, above body background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        aria-hidden
        style={{ isolation: "isolate" }}
      >
        <div className="absolute inset-0 bg-[#2a7a7c]" aria-hidden />
        {desktopBackgroundUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={desktopBackgroundUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            aria-hidden
          />
        ) : (
          <svg
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0 200 Q300 100 600 200 T1200 200 V800 H0 Z"
              fill="rgba(255,255,255,0.06)"
            />
            <path
              d="M0 400 Q400 300 800 400 T1600 400 V800 H0 Z"
              fill="rgba(255,255,255,0.05)"
            />
            <path
              d="M0 600 Q350 500 700 600 T1400 600 V800 H0 Z"
              fill="rgba(255,255,255,0.04)"
            />
          </svg>
        )}
      </div>

      {/* Mobile: unchanged */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-20 pt-28 md:hidden md:pt-32">
        <AboutUsScrollSection
          heading={heading}
          headerLogoUrl={headerLogoUrl}
          descriptionParagraphs={descriptionParagraphs}
          features={features}
        />
        {team.length > 0 && <AboutUsExecutiveTeam team={team} />}
        {(investorTitle || investorParagraphs.length > 0 || contactUrl) && (
          <AboutUsInvestorRelations
            investorTitle={investorTitle}
            investorParagraphs={investorParagraphs}
            contactUrl={contactUrl}
            contactLabel={contactLabel}
          />
        )}
      </main>

      {/* Desktop/tablet: centered title + logo, two columns (intro | features), then team + investor */}
      <div className="relative z-10 hidden md:block">
        <AboutUsDesktopSection
          heading={heading}
          headerLogoUrl={headerLogoUrl}
          descriptionParagraphs={descriptionParagraphs}
          features={features}
        />
        {team.length > 0 && (
          <div className="mx-auto max-w-[1180px] px-6 lg:px-8">
            <AboutUsExecutiveTeam team={team} layout="desktop" />
          </div>
        )}
        {(investorTitle || investorParagraphs.length > 0 || contactUrl) && (
          <div className="mx-auto max-w-[1180px] px-6 pb-20 lg:px-8 lg:pb-24">
            <AboutUsInvestorRelations
              investorTitle={investorTitle}
              investorParagraphs={investorParagraphs}
              contactUrl={contactUrl}
              contactLabel={contactLabel}
              layout="desktop"
            />
          </div>
        )}
      </div>
    </div>
  );
}
