import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import { getGiftCardsPage, getAppLink } from "@/lib/wordpress";
import { GiftCardsWidget } from "@/components/gift-cards/GiftCardsWidget";
import { HomeAppDownloadSection } from "@/components/home/HomeAppDownloadSection";

export const metadata = buildPageMetadata({
  title: "Gift Cards | Quicklyn",
  description: "Send a Quicklyn gift card — the perfect present for a spotless home.",
  path: "/gift-cards",
});

export default async function GiftCardsPage() {
  const [page, appLink] = await Promise.all([getGiftCardsPage(), getAppLink()]);

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Gift Cards content is not available. Please ensure the WordPress page
          with ACF fields is published.
        </p>
      </main>
    );
  }

  const acf = page.acf;
  const heading = acf.heading?.trim() || page.title?.rendered?.trim() || "Gift Cards";
  const description = acf.description?.trim() || "";
  const heroImageUrl = acf.hero_back_image?.url || "";
  const pageBgUrl = acf.page_background?.url || "";
  const heroMobileImageUrl =
    // Prefer dedicated mobile hero image when available
    (acf as any).mobile_image?.url || heroImageUrl;

  const heroLines = [heading];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2a7a7c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#2a7a7c]" aria-hidden />

      <div className="relative z-10">
        {/* Mobile + tablet */}
        <section
          className="mx-auto max-w-3xl px-6 pt-32 pb-16 md:pt-40 md:pb-20 lg:hidden bg-[#2a7a7c] min-h-[640px] md:min-h-0"
        >
          <div className="grid gap-4 md:gap-8">
            <div>
              <h1
                className="relative z-10 mx-auto max-w-[260px] pt-20 font-semibold tracking-tight text-center text-[40px] leading-[39px] md:mx-0 md:max-w-none md:pt-0 md:text-left md:text-[42px] md:leading-tight"
              >
                {heading}
              </h1>

              {heroMobileImageUrl && (
                <div className="md:hidden -mx-6 -mt-28">
                  <div className="relative h-[640px] w-full m-0 p-0 overflow-hidden">
                    <Image
                      src={heroMobileImageUrl}
                      alt=""
                      fill
                      className="m-0 p-0 object-contain transform scale-150 -translate-x-14"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </div>
              )}

              {description && (
                <p
                  className="relative z-20 -mt-6 max-w-md text-center text-[14px] leading-[19px] font-normal text-white/90 whitespace-pre-line md:mt-4 md:text-left"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Desktop hero */}
        <section
          className="hidden lg:block pb-24 pt-40 bg-[#2a7a7c]"
          style={
            heroImageUrl
              ? {
                  backgroundImage: `url(${heroImageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0 top 120px",
                  backgroundSize: "1100px auto",
                }
              : undefined
          }
        >
          <div className="mx-auto w-full max-w-[1180px] px-8 pt-36 pb-8">
            <div className="grid grid-cols-[3fr_2fr] items-center gap-10">
              <div>
                <h1
                  className="font-semibold tracking-tight"
                  style={{ fontSize: "96px", lineHeight: "87px" }}
                >
                  {heroLines.length > 0 ? heroLines.map((l, i) => <span key={i} className="block">{l}</span>) : heading}
                </h1>
                {description && (
                  <p
                    className="mt-4 max-w-md text-[14px] leading-[19px] font-normal text-white/90 whitespace-pre-line"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Widget + download section with page background */}
        <section
          className="w-full px-6 pb-6 lg:px-8 lg:pb-10"
          style={
            pageBgUrl
              ? {
                  backgroundImage: `linear-gradient(to top, #2a7a7c 0%, rgba(42, 122, 124, 0.9) 30%, transparent 75%), url(${pageBgUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center bottom, center top",
                  backgroundSize: "100% 100%, cover",
                }
              : {
                  backgroundImage:
                    "linear-gradient(to top, #2a7a7c 0%, rgba(42, 122, 124, 0.9) 30%, transparent 75%)",
                }
          }
        >
          <div className="mx-auto w-full max-w-[1180px]">
            <GiftCardsWidget />
          </div>

          {/* Download section (same as home, but without its own background) */}
          <div className="mt-10">
            <HomeAppDownloadSection
              data={appLink}
              transparentBackground
              sectionBackgroundColor="transparent"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

