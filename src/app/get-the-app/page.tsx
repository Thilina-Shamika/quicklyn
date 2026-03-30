import { buildPageMetadata } from "@/lib/seo";
import { getAppLink } from "@/lib/wordpress";
import { GetTheAppContent } from "@/components/get-the-app/GetTheAppContent";

export const metadata = buildPageMetadata({
  title: "Get the App | Quicklyn",
  description:
    "Download the Quicklyn app to book cleaning, manage visits, and get exclusive offers.",
  path: "/get-the-app",
});

export default async function GetTheAppPage() {
  const data = await getAppLink();

  if (!data?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c]">
        <p className="text-center text-sm text-white/80">
          Get the App content is not available.
        </p>
      </main>
    );
  }

  const acf = data.acf;
  const headingDisplay =
    (acf.heading && String(acf.heading).trim()) ||
    (data.title?.rendered || "").trim();
  const subHeading = (acf.sub_heading ?? "").trim();
  /** Code from code-only ACF field (code_only or code), for display in "Use code X to save 15%..." */
  const codeOnly =
    (acf.code_only ?? acf.code ?? "").trim().replace(/^USE CODE:\s*/i, "") ||
    "QWEB15";
  const discountCodeLabel = codeOnly;
  const googlePlayUrl = acf.image_01?.url;
  const appStoreUrl = acf.image_02?.url;
  const link01 = acf.link_01?.url ?? "#";
  const link02 =
    typeof acf.link_02 === "string"
      ? acf.link_02
      : (acf.link_02 as unknown as { url?: string })?.url ?? "#";
  const bookingUrl =
    (acf.booking_link?.url?.trim() && acf.booking_link.url.trim() !== "#")
      ? acf.booking_link.url.trim()
      : "/book-a-cleaning";
  const bookingTarget = acf.booking_link?.target ?? "_self";
  const bookingText = acf.booking_text?.trim() ?? "Book A Cleaning Now";
  const description = acf.description?.trim() ?? "";
  const phoneImageUrl = acf.background_image?.url;
  const backImageUrl =
    (acf.back_image_desktop ?? acf.back_image ?? acf.background_image)?.url;

  return (
    <GetTheAppContent
      headingDisplay={headingDisplay}
      subHeading={subHeading}
      discountCodeLabel={discountCodeLabel}
      googlePlayUrl={googlePlayUrl}
      appStoreUrl={appStoreUrl}
      link01={link01}
      link02={link02}
      link01Target={acf.link_01?.target ?? "_blank"}
      bookingUrl={bookingUrl}
      bookingTarget={bookingTarget}
      bookingText={bookingText}
      description={description}
      phoneImageUrl={phoneImageUrl}
      backImageUrl={backImageUrl}
    />
  );
}
