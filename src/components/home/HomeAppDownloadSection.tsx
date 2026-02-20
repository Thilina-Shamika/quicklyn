"use client";

import Image from "next/image";
import Link from "next/link";
import type { WPAppLink } from "@/lib/wordpress";

interface HomeAppDownloadSectionProps {
  data: WPAppLink | null;
}

export function HomeAppDownloadSection({ data }: HomeAppDownloadSectionProps) {
  if (!data?.acf) return null;

  const acf = data.acf;
  const heading = acf.heading?.trim() || data.title.rendered;
  const subHeading = acf.sub_heading?.trim() || "";
  const discountCode = (acf.discount_code ?? acf.promo_code ?? acf.code)?.trim();
  const googlePlayUrl = acf.image_01?.url;
  const appStoreUrl = acf.image_02?.url;
  const link01 = acf.link_01?.url || "#";
  const link02 = typeof acf.link_02 === "string" ? acf.link_02 : acf.link_02 ?? "#";
  const bookingUrl = acf.booking_link?.url || "#";
  const bookingText = acf.booking_text?.trim() || "Book A Cleaning Now";
  const description = acf.description?.trim() || "";
  const bgImage = acf.background_image?.url;
  const isLocal =
    (googlePlayUrl &&
      (googlePlayUrl.includes("quicklyn-headless.local") ||
        googlePlayUrl.includes("quick.rootholdings"))) ||
    (appStoreUrl &&
      (appStoreUrl.includes("quicklyn-headless.local") ||
        appStoreUrl.includes("quick.rootholdings"))) ||
    (bgImage &&
      (bgImage.includes("quicklyn-headless.local") ||
        bgImage.includes("quick.rootholdings")));

  const renderSubHeading = () => {
    if (!subHeading) return null;
    const parts = subHeading.split(/(\d+%)/);
    return (
      <p className="mt-2 text-[14px] text-white">
        {parts.map((part, i) =>
          /\d+%/.test(part) ? (
            <span key={i} className="text-[#ffda00]">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  };

  return (
    <section className="relative isolate z-[100] w-full overflow-x-hidden overflow-y-visible bg-[#226d71] py-16">
      {bgImage && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-[70%] md:w-[55%]"
          style={{ marginTop: "-120px" }}
        >
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-contain object-right"
            sizes="55vw"
            unoptimized={!!isLocal}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #226d71 100%)",
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="w-[55%] text-left">
          <h2 className="text-2xl font-normal leading-tight text-white md:text-3xl">
            {heading}
          </h2>
          {renderSubHeading()}

          {discountCode && (
            <div className="mt-4 inline-block rounded-full border border-dashed border-white px-4 py-2">
              <span className="text-[14px] font-medium uppercase tracking-wide text-white">
                {discountCode}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 flex w-full flex-row items-center justify-start gap-4 px-0">
          {googlePlayUrl && (
            <Link
              href={link01}
              target={acf.link_01?.target || "_blank"}
              rel="noopener noreferrer"
              className="focus:outline-none"
            >
              <Image
                src={googlePlayUrl}
                alt="Get it on Google Play"
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
                unoptimized={!!isLocal}
              />
            </Link>
          )}
          {appStoreUrl && (
            <Link
              href={link02}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none"
            >
              <Image
                src={appStoreUrl}
                alt="Download on the App Store"
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
                unoptimized={!!isLocal}
              />
            </Link>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-12 flex flex-col items-end text-right pr-6">
        <p className="text-sm font-medium uppercase tracking-wide text-white">
          OR
        </p>
        <Link
          href={bookingUrl}
          target={acf.booking_link?.target || "_self"}
          className="mt-3 inline-flex items-center gap-2 text-[20px] font-semibold text-white hover:text-white/90 focus:outline-none"
        >
          {bookingText}
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </Link>
        {description && (
          <p className="mt-2 text-[14px] text-white/90">{description}</p>
        )}
      </div>
    </section>
  );
}
