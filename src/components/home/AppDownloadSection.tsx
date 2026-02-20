"use client";

import Image from "next/image";
import Link from "next/link";
import type { WPAppLink } from "@/lib/wordpress";

interface AppDownloadSectionProps {
  data: WPAppLink | null;
  showBottomCta?: boolean;
  noInnerBottomPadding?: boolean;
}

export function AppDownloadSection({
  data,
  showBottomCta = true,
  noInnerBottomPadding = false,
}: AppDownloadSectionProps) {
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

  // Highlight "15%" in sub-heading with yellow
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

  const sectionPadding = noInnerBottomPadding ? "pt-5 pb-[35px]" : "py-16";
  const roundedCorners = noInnerBottomPadding ? "rounded-3xl" : "";
  const imageNegativeMarginTop = noInnerBottomPadding ? "-90px" : "-24px";
  const ribbonCode = discountCode ?? "";

  return (
    <section
      className={`relative isolate z-[100] w-full overflow-visible bg-[#2a7a7c] ${sectionPadding} ${roundedCorners}`}
    >
      {/* Yellow ribbon: code from app link endpoint — only when code is provided */}
      {ribbonCode && (
        <div
          className="absolute inset-0 z-30 overflow-hidden rounded-3xl pointer-events-none"
          style={{ height: "100%", width: "100%" }}
        >
          <div
            className="absolute flex min-w-[400px] items-center justify-center px-8 py-2"
            style={{
              left: "75%",
              top: "25%",
              background: "#ffda00",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              transform: "translate(-50%, -50%) rotate(30deg)",
              transformOrigin: "center center",
            }}
          >
            <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-wide text-black">
              {ribbonCode}
            </span>
          </div>
        </div>
      )}
      {/* Gradient overlay inside container only (right side): top transparent → bottom #2a7a7c */}
      <div
        className="pointer-events-none absolute left-1/2 right-6 top-5 z-[5] rounded-b-3xl rounded-tr-3xl md:right-6"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #2a7a7c 100%)",
          bottom: noInnerBottomPadding ? "35px" : "4rem",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-4xl overflow-visible px-6">
        {/* First block 80%, second block below — image pulled up behind first */}
        <div className="relative flex flex-col overflow-visible">
          <div className="relative z-10 w-[65%] min-w-0 mt-6 rounded-xl text-left">
            <h2 className="text-2xl font-normal leading-tight text-white md:text-3xl">
              {heading}
            </h2>
            {renderSubHeading()}
          </div>

          <div className="relative z-0 -mt-24 w-full min-w-0 overflow-visible rounded-xl flex items-center justify-end -mr-6 md:-mr-12">
            {bgImage && (
              <div
                className="relative h-[260px] w-[280px] shrink-0 md:h-[320px] md:w-[340px] overflow-visible"
                style={{
                  marginTop: imageNegativeMarginTop,
                  marginLeft: "auto",
                  transform: "translateX(30px)",
                }}
              >
                <Image
                  src={bgImage}
                  alt=""
                  fill
                  className="object-contain object-right"
                  sizes="55vw"
                  unoptimized={!!isLocal}
                />
              </div>
            )}
          </div>
        </div>

        {/* Discount code + store buttons: 2 columns (green / red) — on top of image */}
        <div className="relative z-20 -mt-6">
          <div className="grid grid-cols-2 gap-4">
            {googlePlayUrl && (
              <Link
                href={link01}
                target={acf.link_01?.target || "_blank"}
                rel="noopener noreferrer"
                className="focus:outline-none flex justify-start"
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
                className="focus:outline-none flex justify-start md:justify-end"
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

        {/* Bottom: OR, Book link, description */}
        {showBottomCta && (
          <div className="mt-12 flex flex-col items-end text-right">
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
        )}
      </div>
    </section>
  );
}
