import { getAboutUsPage, getHeader } from "@/lib/wordpress";
import type { AboutUsFeatureItem, AboutUsTeamMember } from "@/types/wordpress";
import { AboutUsScrollSection } from "@/components/about-us/AboutUsScrollSection";
import { AboutUsExecutiveTeam } from "@/components/about-us/AboutUsExecutiveTeam";
import { AboutUsInvestorRelations } from "@/components/about-us/AboutUsInvestorRelations";

export const metadata = {
  title: "About us | Quicklyn",
  description:
    "Quicklyn is a technology-driven platform focused on making everyday services faster, more reliable, and easier to access.",
};

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
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0 bg-[#2a7a7c] pointer-events-none"
        aria-hidden
      />
      {pageBackground ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={pageBackground}
          alt=""
          className="fixed inset-0 z-0 h-full w-full object-cover object-top pointer-events-none"
          aria-hidden
        />
      ) : (
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-30"
          aria-hidden
        >
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

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-20 pt-28 md:pt-32">
        <AboutUsScrollSection
          heading={heading}
          headerLogoUrl={headerLogoUrl}
          descriptionParagraphs={descriptionParagraphs}
          features={features}
        />

        {/* Executive Team */}
        {team.length > 0 && <AboutUsExecutiveTeam team={team} />}

        {/* Investor Relations */}
        {(investorTitle || investorParagraphs.length > 0 || contactUrl) && (
          <AboutUsInvestorRelations
            investorTitle={investorTitle}
            investorParagraphs={investorParagraphs}
            contactUrl={contactUrl}
            contactLabel={contactLabel}
          />
        )}
      </main>
    </div>
  );
}
