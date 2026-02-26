import { getAppLink } from "@/lib/wordpress";
import { GetTheAppContent } from "@/components/get-the-app/GetTheAppContent";

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
  const headingRaw = (acf.heading ?? data.title?.rendered ?? "").trim();
  const headingDisplay = headingRaw.endsWith("!")
    ? headingRaw
    : `${headingRaw} Today!`;
  const subHeading = (acf.sub_heading ?? "").trim();
  const discountCodeRaw = (
    acf.discount_code ?? acf.promo_code ?? acf.code ?? ""
  ).trim();
  const discountCodeLabel =
    discountCodeRaw.replace(/^USE CODE:\s*/i, "") || "QWEB15";
  const googlePlayUrl = acf.image_01?.url;
  const appStoreUrl = acf.image_02?.url;
  const link01 = acf.link_01?.url ?? "#";
  const link02 =
    typeof acf.link_02 === "string"
      ? acf.link_02
      : (acf.link_02 as unknown as { url?: string })?.url ?? "#";
  const bookingUrl = acf.booking_link?.url ?? "#";
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
