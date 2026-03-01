"use client";

import Image from "next/image";
import Link from "next/link";
import type { WPAppLink } from "@/lib/wordpress";

interface AppDownloadBannerProps {
  data: WPAppLink | null;
}

/** Renders "to [highlighted % phrase] with code X" - percentage part in theme yellow */
function renderSubHeadingWithHighlight(
  subHeading: string,
  codeOnly: string,
  className?: string
) {
  const trimmed = subHeading?.trim() || "";
  const code = codeOnly?.trim() || "";
  const percentMatch = trimmed.match(/(.*?)(\d+%[^]*?)(?=\s*$|\s*with)/i) || trimmed.match(/(.*?)(\d+%.*)/i);
  if (!percentMatch || !percentMatch[2]) {
    return (
      <span className={className}>
        to {trimmed || "Save 15%"}
        {code ? ` with code ${code}` : ""}
      </span>
    );
  }
  const before = (percentMatch[1] ?? "").trim();
  const highlight = (percentMatch[2] ?? "").trim();
  return (
    <span className={className}>
      to {before ? `${before} ` : ""}
      <span className="font-semibold text-[#FFDA00]">{highlight}</span>
      {code ? ` with code ${code}` : ""}
    </span>
  );
}

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  const acf = data?.acf;
  if (!acf) return null;

  const heading = acf.heading?.trim() || "Download the Quicklyn app to";
  const subHeading = acf.sub_heading?.trim() || "";
  const codeOnly = acf.code_only?.trim() || (acf.discount_code?.replace(/^use code:\s*/i, "").trim()) || "";
  const bgImage = acf.background_image?.url;
  const googlePlayUrl = acf.image_01?.url;
  const appStoreUrl = acf.image_02?.url;
  const link01 = (typeof acf.link_01 === "object" && acf.link_01?.url) ? acf.link_01.url : "#";
  const link02 = typeof acf.link_02 === "string" ? acf.link_02 : "#";
  const isLocal =
    (bgImage?.includes("quicklyn-headless.local") || googlePlayUrl?.includes("quicklyn-headless.local") || appStoreUrl?.includes("quicklyn-headless.local")) ||
    (bgImage?.includes("quick.rootholdings") || googlePlayUrl?.includes("quick.rootholdings") || appStoreUrl?.includes("quick.rootholdings"));

  return (
    <div className="mt-5 w-full">
      {/* Mobile: simple stacked layout (unchanged) */}
      <div className="relative flex min-h-[140px] w-full flex-col overflow-hidden rounded-2xl bg-[#1e645a] px-5 py-4 shadow-lg md:hidden">
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-bold leading-tight text-white">
            {heading}
          </h3>
          <p className="mt-1 text-sm leading-snug text-white">
            {renderSubHeadingWithHighlight(subHeading, codeOnly)}
          </p>
        </div>
        {bgImage ? (
          <div className="relative mx-auto my-2 flex h-[100px] w-[70px] justify-center">
            <Image
              src={bgImage}
              alt=""
              fill
              className="object-contain object-center"
              sizes="70px"
              unoptimized={!!isLocal}
            />
          </div>
        ) : null}
        <div className="mt-2 flex flex-col items-start gap-2">
          {googlePlayUrl && link01 ? (
            <Link href={link01} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-3 py-2 shadow">
              <Image src={googlePlayUrl} alt="Get it on Google Play" width={99} height={35} className="h-7 w-auto object-contain" unoptimized={!!isLocal} />
            </Link>
          ) : null}
          {appStoreUrl && link02 ? (
            <Link href={link02} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-3 py-2 shadow">
              <Image src={appStoreUrl} alt="Download on the App Store" width={100} height={35} className="h-7 w-auto object-contain" unoptimized={!!isLocal} />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Desktop / tablet: block with 2 columns + phone on top of block */}
      <div className="relative hidden min-h-[120px] w-full overflow-visible rounded-2xl border border-white/[0.28] bg-[#1a585c] px-4 py-5 md:block md:min-h-[140px] md:grid md:grid-cols-2 md:items-center md:gap-6 md:px-8 md:py-6">
        <div className="relative z-10 flex flex-col justify-center">
          <h3 className="text-[25px] font-bold leading-tight text-white">
            {heading}
          </h3>
          <p className="mt-1 text-[18px] leading-snug text-white">
            {renderSubHeadingWithHighlight(subHeading, codeOnly)}
          </p>
        </div>
        <div className="relative z-10 mt-3 flex flex-row flex-wrap items-center gap-3 md:mt-0 md:justify-end">
          {googlePlayUrl && link01 ? (
            <Link href={link01} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-white p-0 shadow transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/50">
              <Image src={googlePlayUrl} alt="Get it on Google Play" width={99} height={35} className="h-16 w-auto object-contain" unoptimized={!!isLocal} />
            </Link>
          ) : null}
          {appStoreUrl && link02 ? (
            <Link href={link02} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-white p-0 shadow transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/50">
              <Image src={appStoreUrl} alt="Download on the App Store" width={100} height={35} className="h-16 w-auto object-contain" unoptimized={!!isLocal} />
            </Link>
          ) : null}
        </div>
        {bgImage ? (
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 flex justify-center pb-0" style={{ transform: "translate(-50%, 1.5rem)" }}>
            <div className="relative h-[240px] w-[150px] lg:h-[280px] lg:w-[175px]">
              <Image src={bgImage} alt="" fill className="object-contain object-bottom" sizes="175px" unoptimized={!!isLocal} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
