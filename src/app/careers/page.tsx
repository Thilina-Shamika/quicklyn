import { getCareersPage } from "@/lib/wordpress";
import { CareersContent } from "@/components/careers/CareersContent";

export default async function CareersPage() {
  const page = await getCareersPage();

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Careers content is not available. Please ensure the WordPress page with
          ACF fields is published.
        </p>
      </main>
    );
  }

  const heading = (page.acf.haeding ?? page.title?.rendered ?? "Careers").trim();
  const description = (page.acf.description ?? "").trim();
  const image1Url = page.acf.image_1?.url;
  const image2Url = page.acf.image_2?.url;
  const image3Url = page.acf.image_3?.url;
  const desktopBackgroundUrl =
    page.acf.desktop_background?.url ??
    page.acf.desktop_background_image?.url;
  const mobileBackgroundUrl = page.acf.background_image?.url;

  return (
    <CareersContent
      heading={heading}
      description={description}
      image1Url={image1Url}
      image2Url={image2Url}
      image3Url={image3Url}
      desktopBackgroundUrl={desktopBackgroundUrl}
      mobileBackgroundUrl={mobileBackgroundUrl}
    />
  );
}
