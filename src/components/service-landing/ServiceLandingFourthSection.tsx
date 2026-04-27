import { Fragment } from "react";
import Image from "next/image";
import type {
  ServiceLandingBannerPoint,
  ServiceLandingFeatureItem,
  WPImage,
} from "@/types/wordpress";

function unoptimizedCmsUrl(url: string) {
  return (
    url.includes("quick.rootholdings") || url.includes("quicklyn-headless.local")
  );
}

function getAcfImageUrl(
  image: WPImage | null | undefined,
): string | undefined {
  if (!image) return undefined;
  const u = image.url;
  if (typeof u === "string" && u.trim()) return u.trim();
  const src = (image as { source_url?: string }).source_url;
  if (typeof src === "string" && src.trim()) return src.trim();
  return undefined;
}

const HIGHLIGHT = "High Demand";

function highlightHeadingLine(t: string) {
  const i = t.indexOf(HIGHLIGHT);
  if (i === -1) {
    return <span className="text-white">{t}</span>;
  }
  return (
    <span className="text-white">
      {t.slice(0, i)}
      <span className="text-[#ffda00]">{HIGHLIGHT}</span>
      {t.slice(i + HIGHLIGHT.length)}
    </span>
  );
}

function FourthSectionTitle({ text }: { text: string }) {
  const t = text.replace(/\s{2,}/g, " ").trim();
  if (!t) return null;
  return (
    <h2 className="text-center text-2xl font-bold leading-tight text-balance sm:text-3xl md:text-4xl">
      {highlightHeadingLine(t)}
    </h2>
  );
}

/** 34px / 44px. Supports `<br>`, newlines, or break at the first `—` / `–`, else natural wrap. */
function BannerHeadingContent({ text }: { text: string }) {
  const t = text.trim();
  if (/<\s*br\s*\/?>/i.test(t)) {
    const segments = t.split(/<\s*br\s*\/?>/gi);
    return (
      <>
        {segments.map((segment, i) => (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            {segment}
          </Fragment>
        ))}
      </>
    );
  }
  const byNewline = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) {
    return (
      <>
        {byNewline.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </>
    );
  }
  const emDash = "—";
  const enDash = "–";
  const idxEm = t.indexOf(emDash);
  const idxEn = t.indexOf(enDash);
  const idx = idxEm !== -1 ? idxEm : idxEn !== -1 ? idxEn : -1;
  if (idx !== -1) {
    const first = t.slice(0, idx + 1).trimEnd();
    const second = t.slice(idx + 1).trim();
    return (
      <>
        <span className="block">{first}</span>
        <span className="block">{second}</span>
      </>
    );
  }
  return (
    <span className="mx-auto block max-w-[min(100%,32rem)] sm:max-w-[36rem] md:max-w-[40rem]">
      {t}
    </span>
  );
}

type Props = {
  heading?: string;
  subHeading?: string;
  features: ServiceLandingFeatureItem[];
  descriptionText?: string;
  /** `acf.4th_section_banner` from REST — fills the rounded, inset-shadow panel. */
  bannerImage?: WPImage | null;
  /** `acf.banner_heading` */
  bannerHeading?: string;
  /** `acf.banner_contents` */
  bannerPoints: ServiceLandingBannerPoint[];
  /** `acf.4th_section_description_banner` */
  descriptionBanner?: string;
};

function hasContent(p: Props): boolean {
  const f = p.features?.filter(
    (x) => (x?.feature_name ?? "").toString().trim().length > 0,
  );
  return Boolean(
    p.heading?.trim() ||
      p.subHeading?.trim() ||
      p.descriptionText?.trim() ||
      (f && f.length > 0) ||
      p.bannerImage,
  );
}

export function ServiceLandingFourthSection({
  heading,
  subHeading,
  features,
  descriptionText,
  bannerImage,
  bannerHeading,
  bannerPoints,
  descriptionBanner,
}: Props) {
  if (
    !hasContent({
      heading,
      subHeading,
      features,
      descriptionText,
      bannerImage,
      bannerHeading,
      bannerPoints,
      descriptionBanner,
    })
  ) {
    return null;
  }

  const featureNames = (features ?? [])
    .map((f) => (f?.feature_name ?? "").trim())
    .filter(Boolean);
  const points = (bannerPoints ?? [])
    .map((b) => (b?.point_name ?? "").trim())
    .filter(Boolean);
  const bannerUrl = getAcfImageUrl(bannerImage ?? undefined);
  const alt = bannerImage?.alt?.trim() || "Banner";
  const showBannerText =
    Boolean(bannerHeading?.trim()) ||
    points.length > 0 ||
    Boolean(descriptionBanner?.trim());
  const hasBannerImage = Boolean(bannerUrl);

  return (
    <section className="w-full text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        {heading ? <FourthSectionTitle text={heading} /> : null}

        {subHeading ? (
          <p className="mt-5 text-center text-sm text-white/95 sm:text-base md:mt-6">
            {subHeading}
          </p>
        ) : null}

        {featureNames.length > 0 ? (
          <div
            className="mt-8 flex flex-col gap-0 divide-y divide-white/30 md:mt-10 md:flex-row md:items-stretch md:justify-center md:divide-x md:divide-y-0 md:divide-white/30"
            role="list"
          >
            {featureNames.map((name, i) => (
              <div
                key={i}
                className="flex-1 px-2 py-4 text-center text-xs font-medium leading-snug text-white/95 first:pl-0 last:pr-0 sm:px-4 sm:text-sm md:py-0"
                role="listitem"
              >
                {name}
              </div>
            ))}
          </div>
        ) : null}

        {descriptionText ? (
          <p className="mt-6 text-center text-sm italic text-white/95 md:mt-8 md:text-base">
            {descriptionText}
          </p>
        ) : null}

        {hasBannerImage && (
          <div
            className={[
              "relative -mx-4 mt-10 w-[calc(100%+2rem)] overflow-x-visible overflow-y-visible sm:-mx-5 sm:mt-12 sm:w-[calc(100%+2.5rem)] md:-mx-6 md:mt-14 md:w-[calc(100%+3rem)] lg:-mx-7 lg:w-[calc(100%+3.5rem)] xl:-mx-8 xl:w-[calc(100%+4rem)]",
              !showBannerText ? "max-sm:hidden" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/*
              Rounded image panel (no inset shadow) + overlay copy; points/description
              column inset from the left to clear the figure in the art.
            */}
            <div className="relative overflow-visible pl-1 pt-6 sm:pl-2 sm:pt-8 md:pl-3 md:pt-10">
              <div
                className={[
                  "relative isolate overflow-hidden",
                  "rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] lg:rounded-[2.5rem]",
                  showBannerText ? "max-sm:bg-[#2a7a7c]" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-0 max-sm:hidden"
                  aria-hidden={showBannerText}
                >
                  <Image
                    src={bannerUrl!}
                    alt={showBannerText ? "" : alt}
                    fill
                    className="object-cover object-center md:object-left"
                    sizes="(min-width: 1280px) 1500px, 100vw"
                    unoptimized={unoptimizedCmsUrl(bannerUrl!)}
                    priority={false}
                  />
                </div>
              {showBannerText ? (
                <div
                  className="relative z-10 flex w-full min-h-[min(68vw,26rem)] flex-col justify-center gap-6 px-5 py-8 sm:min-h-[28rem] sm:gap-7 sm:px-7 sm:py-10 md:min-h-[32rem] md:gap-8 md:px-9 md:py-11 lg:min-h-[34rem] lg:px-11"
                >
                  {bannerHeading ? (
                    <h3
                      className="w-full pt-[60px] pb-[25px] text-center text-[34px] font-normal leading-[44px] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]"
                    >
                      <BannerHeadingContent text={bannerHeading} />
                    </h3>
                  ) : null}
                  {(points.length > 0 || descriptionBanner) && (
                    <div className="grid w-full grid-cols-1 items-start gap-6 sm:gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-x-8 md:gap-y-0 md:pl-[24%] lg:pl-[22%] lg:gap-x-10 xl:pl-[23%]">
                      {points.length > 0 ? (
                        <ul className="ml-1 w-full list-none space-y-1 p-0 pl-2 text-left text-[23px] font-normal leading-[42px] sm:ml-2 sm:pl-3 md:ml-3 md:pl-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                          {points.map((p, i) => (
                            <li key={i} className="group flex gap-3.5">
                              <span
                                className="[filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.35))] mt-[0.45em] inline-block h-[0.7em] w-[0.7em] min-w-[0.7em] shrink-0 bg-white transition-colors duration-200 [mask-image:url('/images/service-landing/banner-list-arrow.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%] [-webkit-mask-image:url('/images/service-landing/banner-list-arrow.png')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%] group-hover:bg-[#ffda00]"
                                aria-hidden
                              />
                              <span className="min-w-0 flex-1 text-white transition-colors duration-200 group-hover:text-[#ffda00]">
                                {p}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {descriptionBanner ? (
                        <p className="w-full max-w-[16rem] text-left text-[18px] font-normal leading-[29px] text-white/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] sm:max-w-[17rem] md:max-w-[18rem]">
                          {descriptionBanner}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="pointer-events-none relative w-full min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem]"
                  style={{
                    aspectRatio: bannerImage
                      ? (bannerImage.width > 0 ? bannerImage.width : 16) /
                        (bannerImage.height > 0 ? bannerImage.height : 9)
                      : 16 / 9,
                  }}
                  aria-hidden
                />
              )}
            </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
