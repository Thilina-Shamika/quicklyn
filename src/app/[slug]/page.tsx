import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceLandingBySlug } from "@/lib/wordpress";
import { ServiceLandingFirstSection } from "@/components/service-landing/ServiceLandingFirstSection";
import { ServiceLandingSecondSection } from "@/components/service-landing/ServiceLandingSecondSection";
import { ServiceLandingThirdSection } from "@/components/service-landing/ServiceLandingThirdSection";
import { ServiceLandingFourthSection } from "@/components/service-landing/ServiceLandingFourthSection";
import { ServiceLandingFifthSixthSection } from "@/components/service-landing/ServiceLandingFifthSixthSection";
import { ServiceLandingSections789Block } from "@/components/service-landing/ServiceLandingSections789Block";
import { ServiceLandingEighthSection } from "@/components/service-landing/ServiceLandingEighthSection";
import { ServiceLandingNinthSection } from "@/components/service-landing/ServiceLandingNinthSection";
import { ServiceLandingSeventhSection } from "@/components/service-landing/ServiceLandingSeventhSection";
import { buildPageMetadata, SITE_NAME } from "@/lib/seo";
import type {
  ServiceLandingBannerPoint,
  ServiceLandingFeatureItem,
  ServiceLandingSecondItem,
  ServiceLandingThirdAccordionItem,
  ServiceLandingApartmentType,
  ServiceLandingWhatToExpectItem,
  ServiceLandingWhyChooseItem,
} from "@/types/wordpress";

/** ACF can send `false` for empty repeaters; `false ?? []` is still `false`. */
function normalizeSecondSectionItems(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingSecondItem[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["2nd_section_items"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingSecondItem[];
  }
  return [];
}

function normalizeThirdSectionAccordion(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingThirdAccordionItem[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["3rd_section_accordion"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingThirdAccordionItem[];
  }
  return [];
}

function normalizeFourthSectionFeatures(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingFeatureItem[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["features"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingFeatureItem[];
  }
  return [];
}

function normalizeBannerContents(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingBannerPoint[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["banner_contents"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingBannerPoint[];
  }
  return [];
}

function normalizeApartmentTypes(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingApartmentType[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["apartment_types"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingApartmentType[];
  }
  return [];
}

function normalizeWhatToExpect(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingWhatToExpectItem[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["what_to_expect"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingWhatToExpectItem[];
  }
  return [];
}

function normalizeWhyChooseQuicklyn(
  acf: Record<string, unknown> | null | undefined,
): ServiceLandingWhyChooseItem[] {
  if (!acf || typeof acf !== "object") return [];
  const raw = acf["why_choose_quicklyn"];
  if (Array.isArray(raw)) {
    return raw as ServiceLandingWhyChooseItem[];
  }
  return [];
}

function excerptPlain(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getServiceLandingBySlug(slug);
  if (!post?.acf) {
    return { title: "Not found" };
  }

  const title = post.title.rendered.trim() || post.acf["1st_section_heading"] || slug;
  const descSource =
    post.acf["1st_section_description_1"] ||
    post.acf["1st_section_description_2"] ||
    "";
  const description = descSource
    ? excerptPlain(descSource)
    : `Professional cleaning services from ${SITE_NAME}.`;
  const path = `/${post.slug}`;

  const meta = buildPageMetadata({ title, description, path });
  const imageUrl = post.acf["1st_section_image"]?.url;
  if (imageUrl) {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        images: [{ url: imageUrl, alt: post.acf["1st_section_image"]?.alt || title }],
      },
      twitter: {
        ...meta.twitter,
        card: "summary_large_image",
        images: [imageUrl],
      },
    };
  }
  return meta;
}

export default async function ServiceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getServiceLandingBySlug(slug);

  if (!post?.acf) {
    notFound();
  }

  const acf = post.acf;
  const heading = acf["1st_section_heading"]?.trim() || post.title.rendered;
  const description1 = acf["1st_section_description_1"]?.trim() ?? "";
  const description2 = acf["1st_section_description_2"]?.trim() ?? "";
  const image = acf["1st_section_image"];
  const secondSectionItems = normalizeSecondSectionItems(
    acf as Record<string, unknown>,
  );
  const thirdSectionAccordion = normalizeThirdSectionAccordion(
    acf as Record<string, unknown>,
  );
  const thirdHeading = acf["3rd_section_heading"]?.trim();
  const thirdDescription = acf["3rd_section_description"]?.trim();
  const thirdBackground = acf["3rd_section_background_image"];
  const thirdTopCurve =
    acf["top_curve"] ?? acf["3rd_section_top_curve"];
  const thirdBottomCurve =
    acf["bottom_curve"] ?? acf["3rd_section_bottom_curve"];
  const acfRec = acf as Record<string, unknown>;
  const fourthFeatures = normalizeFourthSectionFeatures(acfRec);
  const fourthBannerPoints = normalizeBannerContents(acfRec);
  const fourthHeading = acf["4th_section_heading"]?.trim();
  const fourthSubHeading = acf["4th_section_sub_heading"]?.trim();
  const fourthDescriptionText = acf["4th_section_description_text"]?.trim();
  const fourthBanner = acf["4th_section_banner"];
  const fourthBannerHeading = acf["banner_heading"]?.trim();
  const fourthDescriptionBanner =
    acf["4th_section_description_banner"]?.trim();
  const fifthSixthBackground = acf["5th_section_background_image"];
  const fifthHeading = acf["5th_section_heading"]?.trim();
  const fifthDescription = acf["5th_section_description"]?.trim();
  const bookButtonText = acf["button_text"]?.trim();
  const bookButtonUrl = acf["button_url"]?.trim();
  const apartmentTypes = normalizeApartmentTypes(acfRec);
  const serviceDisclaimer =
    acf["service_desclaimer"]?.trim() ??
    (acfRec["service_disclaimer"] as string | undefined)?.trim();
  const sixthHeading = acf["6th_section_heading"]?.trim();
  const sixthSubHeading = acf["6th_section_sub_heading"]?.trim();
  const whatToExpect = normalizeWhatToExpect(acfRec);
  const whatToExpectDisclaimer = acf["what_to_expect_disclaimer"]?.trim();
  const seventhHeading = acf["7th_section_heading"]?.trim();
  const seventhDescription = acf["7th_section_description"]?.trim();
  const seventhStructure = acfRec["structure"] as string | undefined;
  const bottomDescription = acf["bottom_description"]?.trim();
  const sections789Background = acf["7th_section_8th_section_background"];
  const whyChooseQuicklyn = normalizeWhyChooseQuicklyn(acfRec);
  const eighthHeading = acf["8th_section_heading"]?.trim();
  const eighthDescription = acf["8th_section_description"]?.trim();
  const whyChooseDisclaimer = acf["why_choose_us_disclaimer"]?.trim();
  const finalThoughts = acf["final_thoughts"]?.trim();
  const finalThoughtsDescription = acf["final_thoughts_description"]?.trim();
  const hasSections789Content = Boolean(
    seventhHeading ||
      seventhDescription ||
      (typeof seventhStructure === "string" && seventhStructure.trim()) ||
      bottomDescription ||
      eighthHeading ||
      eighthDescription ||
      whyChooseQuicklyn.length > 0 ||
      whyChooseDisclaimer ||
      finalThoughts ||
      finalThoughtsDescription,
  );

  return (
    <main className="m-0 min-h-screen w-full bg-[#2a7a7c] pb-0 text-white">
      <ServiceLandingFirstSection
        heading={heading}
        description1={description1}
        description2={description2}
        image={image}
      />
      <ServiceLandingSecondSection items={secondSectionItems} />
      <ServiceLandingThirdSection
        heading={thirdHeading}
        description={thirdDescription}
        accordion={thirdSectionAccordion}
        background={thirdBackground}
        topCurve={thirdTopCurve}
        bottomCurve={thirdBottomCurve}
      />
      <ServiceLandingFourthSection
        heading={fourthHeading}
        subHeading={fourthSubHeading}
        features={fourthFeatures}
        descriptionText={fourthDescriptionText}
        bannerImage={fourthBanner}
        bannerHeading={fourthBannerHeading}
        bannerPoints={fourthBannerPoints}
        descriptionBanner={fourthDescriptionBanner}
      />
      <ServiceLandingFifthSixthSection
        background={fifthSixthBackground}
        section5Heading={fifthHeading}
        section5Description={fifthDescription}
        buttonText={bookButtonText}
        buttonUrl={bookButtonUrl}
        apartmentTypes={apartmentTypes}
        serviceDisclaimer={serviceDisclaimer}
        section6Heading={sixthHeading}
        section6SubHeading={sixthSubHeading}
        whatToExpect={whatToExpect}
        whatToExpectDisclaimer={whatToExpectDisclaimer}
      />
      {hasSections789Content ? (
        <ServiceLandingSections789Block background={sections789Background}>
          <ServiceLandingSeventhSection
            section7Heading={seventhHeading}
            section7Description={seventhDescription}
            structure={seventhStructure}
            bottomDescription={bottomDescription}
          />
          <ServiceLandingEighthSection
            section8Heading={eighthHeading}
            section8Description={eighthDescription}
            whyChooseItems={whyChooseQuicklyn}
            whyChooseDisclaimer={whyChooseDisclaimer}
          />
          <ServiceLandingNinthSection
            finalThoughtsHeading={finalThoughts}
            finalThoughtsDescription={finalThoughtsDescription}
          />
        </ServiceLandingSections789Block>
      ) : null}
    </main>
  );
}
