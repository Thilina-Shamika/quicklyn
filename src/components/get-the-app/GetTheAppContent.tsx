"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface GetTheAppContentProps {
  headingDisplay: string;
  subHeading: string;
  discountCodeLabel: string;
  googlePlayUrl: string | undefined;
  appStoreUrl: string | undefined;
  link01: string;
  link02: string;
  link01Target: string;
  bookingUrl: string;
  bookingTarget: string;
  bookingText: string;
  description: string;
  phoneImageUrl: string | undefined;
  backImageUrl: string | undefined;
}

export function GetTheAppContent({
  headingDisplay,
  subHeading,
  discountCodeLabel,
  googlePlayUrl,
  appStoreUrl,
  link01,
  link02,
  link01Target,
  bookingUrl,
  bookingTarget,
  bookingText,
  description,
  phoneImageUrl,
  backImageUrl,
}: GetTheAppContentProps) {
  const [active, setActive] = useState(false);
  const [isCopyHovered, setIsCopyHovered] = useState(false);
  const [copyTooltipLabel, setCopyTooltipLabel] = useState("Copy");

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 150);
    return () => clearTimeout(t);
  }, []);

  const codeOnly = discountCodeLabel?.trim() || "";

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const handleCopyCode = async () => {
    if (!codeOnly) return;
    try {
      await navigator.clipboard.writeText(codeOnly);
      setCopyTooltipLabel("Copied");
    } catch {
      setCopyTooltipLabel("Copy");
    }
    window.setTimeout(() => {
      setCopyTooltipLabel("Copy");
    }, 1200);
  };

  const renderDesktopUseCodeLine = () => {
    if (!codeOnly) return null;

    const codeRegex = new RegExp(escapeRegExp(codeOnly), "i");
    const text = `use code ${codeOnly} to save 15% instantly.`;
    const parts = text.split(new RegExp(`(${escapeRegExp(codeOnly)})`, "i"));

    return (
      <p className="mt-7 text-[24px] leading-[36px] text-white">
        {parts.map((part, i) => {
          if (!codeRegex.test(part)) {
            return <span key={i}>{part}</span>;
          }

          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setIsCopyHovered(true)}
              onMouseLeave={() => {
                setIsCopyHovered(false);
                setCopyTooltipLabel("Copy");
              }}
              onClick={handleCopyCode}
              className="relative mx-1 inline-flex items-center px-1.5 py-0.5 align-baseline font-semibold text-[#ffda00] focus:outline-none"
            >
              <span
                className="pointer-events-none absolute inset-0 -z-10 rounded-[999px] border border-dashed border-white/55 opacity-90"
                style={{ transform: "rotate(-8deg) scale(1.18, 1.35)" }}
                aria-hidden
              />
              {part}
              {isCopyHovered && (
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-white/20 bg-[#114b4d] px-2.5 py-1 text-[12px] font-medium leading-none text-white shadow-md">
                  {copyTooltipLabel}
                </span>
              )}
            </button>
          );
        })}
      </p>
    );
  };

  const renderSubHeading = (className?: string) => {
    if (!subHeading) return null;
    const parts = subHeading.split(/(\d+%\s*off?|\d+%)/i);
    return (
      <p className={className ?? "mt-3 text-sm text-white md:text-base"}>
        {parts.map((part, i) =>
          /\d+%/.test(part) ? (
            <span key={i} className="font-bold text-[#ffda00]">
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
    <main className="relative min-h-screen md:min-h-[45vh] lg:min-h-[50vh] bg-[#2a7a7c] text-white">
      {backImageUrl ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${encodeURI(backImageUrl)})` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-[#2a7a7c]" aria-hidden />
      )}

      {/* Mobile layout */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-[20%] pb-12 md:hidden">
        {phoneImageUrl && (
          <div
            className={`relative h-[320px] w-[230px] shrink-0 -mb-8 mt-20 transition-all duration-500 ease-out md:-mb-12 md:mt-32 md:h-[420px] md:w-[300px] ${
              active ? "-translate-y-[50px] opacity-100" : "translate-y-0 opacity-40"
            }`}
          >
            <Image
              src={phoneImageUrl}
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 200px, 260px"
              unoptimized={phoneImageUrl.includes("quicklyn-headless.local")}
            />
          </div>
        )}

        <h1
          className={`mt-6 max-w-md text-center font-semibold text-white transition-all duration-200 ease-out ${
            active ? "-translate-y-[50px] opacity-100" : "translate-y-0 opacity-45"
          }`}
          style={{ fontSize: "30px", lineHeight: "37px" }}
        >
          {headingDisplay}
        </h1>

        <div
          className={`-mt-8 flex flex-wrap items-center justify-center gap-4 transition-opacity duration-300 ease-out md:-mt-10 ${
            active ? "opacity-100" : "opacity-45"
          }`}
        >
          {googlePlayUrl && (
            <Link
              href={link01}
              target={link01Target}
              rel="noopener noreferrer"
              className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <Image
                src={googlePlayUrl}
                alt="Get it on Google Play"
                width={180}
                height={60}
                className="h-11 w-auto object-contain md:h-12"
                unoptimized={googlePlayUrl.includes("quicklyn-headless.local")}
              />
            </Link>
          )}
          {appStoreUrl && (
            <Link
              href={link02}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <Image
                src={appStoreUrl}
                alt="Download on the App Store"
                width={180}
                height={60}
                className="h-11 w-auto object-contain md:h-12"
                unoptimized={appStoreUrl.includes("quicklyn-headless.local")}
              />
            </Link>
          )}
        </div>

        <div className="mt-4 text-center">{renderSubHeading()}</div>

        {discountCodeLabel && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center rounded-2xl border-2 border-dashed border-white bg-[#1f6b6d] px-6 py-3">
              <span className="text-sm font-medium text-white">
                USE CODE{" "}
                <span className="font-bold text-[#ffda00]">
                  {discountCodeLabel}
                </span>
              </span>
            </div>
          </div>
        )}

        {(bookingText || description) && (
          <div className="mt-12 flex w-full flex-col items-end text-right">
            <p className="text-sm font-medium uppercase tracking-wide text-white/90">
              OR
            </p>
            <Link
              href={bookingUrl}
              target={bookingTarget}
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
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
              <p className="mt-2 text-sm text-white/80">{description}</p>
            )}
          </div>
        )}
      </div>

      {/* Desktop / tablet layout */}
      <div className="relative hidden items-start px-10 pb-0 pt-28 md:flex lg:px-20">
        <div className="relative mx-auto flex h-full w-full max-w-[1320px] items-center justify-center">
          {/* Left phone */}
          {phoneImageUrl && (
            <div
              className={`pointer-events-none absolute -left-10 -bottom-40 hidden h-[360px] w-[230px] drop-shadow-2xl transition-transform duration-700 ease-out lg:-left-6 lg:block lg:h-[440px] lg:w-[280px] ${
                active ? "-rotate-[12deg] translate-y-0" : "-rotate-[20deg] translate-y-16"
              }`}
            >
              <Image
                src={phoneImageUrl}
                alt=""
                fill
                className="object-contain object-bottom [transform:scaleX(-1)]"
                sizes="280px"
                unoptimized={phoneImageUrl.includes("quicklyn-headless.local")}
              />
            </div>
          )}

          {/* Right phone */}
          {phoneImageUrl && (
            <div
              className={`pointer-events-none absolute -right-10 -bottom-[300px] hidden h-[580px] w-[380px] drop-shadow-2xl transition-transform duration-700 ease-out lg:-right-2 lg:block lg:h-[700px] lg:w-[460px] ${
                active ? "rotate-[12deg] translate-y-0" : "rotate-[24deg] translate-y-16"
              }`}
            >
              <Image
                src={phoneImageUrl}
                alt=""
                fill
                className="object-contain object-bottom"
                sizes="360px"
                unoptimized={phoneImageUrl.includes("quicklyn-headless.local")}
              />
            </div>
          )}

          {/* Center content */}
          <div className="relative z-10 mt-20 max-w-[1100px] text-center lg:mt-24">
            <h1
              className={`text-[87px] font-normal leading-[89px] text-white transition-all duration-700 ease-out ${
                active ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
              }`}
            >
              {headingDisplay}
            </h1>

            <div
              className={`transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              {renderSubHeading("mt-6 text-[22px] leading-[34px] text-white/90")}
              {renderDesktopUseCodeLine()}
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center justify-center gap-5 transition-transform duration-700 ease-out ${
                active ? "translate-y-0" : "translate-y-12"
              }`}
            >
              {googlePlayUrl && (
                <Link
                  href={link01}
                  target={link01Target}
                  rel="noopener noreferrer"
                  className="rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <Image
                    src={googlePlayUrl}
                    alt="Get it on Google Play"
                    width={210}
                    height={68}
                    className="h-14 w-auto object-contain"
                    sizes="210px"
                    unoptimized={googlePlayUrl.includes("quicklyn-headless.local")}
                  />
                </Link>
              )}
              {appStoreUrl && (
                <Link
                  href={link02}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <Image
                    src={appStoreUrl}
                    alt="Download on the App Store"
                    width={210}
                    height={68}
                    className="h-14 w-auto object-contain"
                    sizes="210px"
                    unoptimized={appStoreUrl.includes("quicklyn-headless.local")}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
