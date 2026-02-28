"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WPAppLink } from "@/lib/wordpress";

interface HomeAppDownloadSectionProps {
  data: WPAppLink | null;
  /** Optional section background color (e.g. "#2a7a7c" for our-services page). Defaults to #226d71. */
  sectionBackgroundColor?: string;
  /** When true, removes bottom padding so there is no gap before the footer (e.g. our-services page). */
  tightBottom?: boolean;
  /** When true, section has no background color (transparent). */
  transparentBackground?: boolean;
}

type LottiePlayer = {
  loadAnimation: (config: {
    container: Element;
    renderer: "svg";
    loop: boolean;
    autoplay: boolean;
    path: string;
  }) => LottieAnimation;
};

type LottieAnimation = {
  stop: () => void;
  goToAndStop: (value: number, isFrame?: boolean) => void;
  setDirection: (direction: 1 | -1) => void;
  play: () => void;
  playSegments: (segments: [number, number], forceFlag?: boolean) => void;
  addEventListener: (name: string, cb: () => void) => void;
  removeEventListener?: (name: string, cb: () => void) => void;
  destroy: () => void;
  currentFrame?: number;
  totalFrames?: number;
};

declare global {
  interface Window {
    lottie?: LottiePlayer;
  }
}

let lottieScriptPromise: Promise<LottiePlayer | null> | null = null;

function loadLottiePlayer() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieScriptPromise) return lottieScriptPromise;

  lottieScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-home-lottie="true"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(window.lottie ?? null), { once: true });
      existing.addEventListener("error", () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
    script.async = true;
    script.dataset.homeLottie = "true";
    script.onload = () => resolve(window.lottie ?? null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return lottieScriptPromise;
}

const DEFAULT_SECTION_BG = "#226d71";

export function HomeAppDownloadSection({
  data,
  sectionBackgroundColor = DEFAULT_SECTION_BG,
  tightBottom = false,
  transparentBackground = false,
}: HomeAppDownloadSectionProps) {
  const lottieMountRef = useRef<HTMLDivElement | null>(null);
  const lottieAnimationRef = useRef<LottieAnimation | null>(null);
  const lottieHideTimeoutRef = useRef<number | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);
  const [showLottieHint, setShowLottieHint] = useState(false);
  const [isCopyHovered, setIsCopyHovered] = useState(false);
  const [copyTooltipLabel, setCopyTooltipLabel] = useState("Copy");

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

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const handleDownloadHintEnter = () => {
    const animation = lottieAnimationRef.current;
    if (!animation) return;
    if (lottieHideTimeoutRef.current) {
      window.clearTimeout(lottieHideTimeoutRef.current);
      lottieHideTimeoutRef.current = null;
    }
    setShowLottieHint(true);
    animation.stop();
    animation.goToAndStop(0, true);
    animation.setDirection(1);
    animation.play();
  };

  const handleDownloadHintLeave = () => {
    const animation = lottieAnimationRef.current;
    if (!animation) {
      setShowLottieHint(false);
      return;
    }
    animation.stop();
    const currentFrame = animation.currentFrame ?? 0;
    const totalFrames = animation.totalFrames ?? 100;
    if (currentFrame <= 0) {
      setShowLottieHint(false);
      return;
    }
    animation.setDirection(-1);
    animation.playSegments([Math.max(0, currentFrame), 0], true);
    const duration = Math.max(150, Math.round((currentFrame / totalFrames) * 1000));
    lottieHideTimeoutRef.current = window.setTimeout(() => {
      setShowLottieHint(false);
    }, duration);
  };

  const handleCopyCode = async () => {
    if (!codeOnly) return;
    try {
      await navigator.clipboard.writeText(codeOnly);
      setCopyTooltipLabel("Copied");
    } catch {
      setCopyTooltipLabel("Copy");
    }
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopyTooltipLabel("Copy");
    }, 1200);
  };

  const renderDesktopUseCodeLine = () => {
    if (!codeOnly) {
      return null;
    }

    const codeRegex = new RegExp(escapeRegExp(codeOnly), "i");
    const normalizedText = `use code: ${codeOnly} to save instantly.`;
    const parts = normalizedText.split(new RegExp(`(${escapeRegExp(codeOnly)})`, "i"));

    return (
      <p className="mt-3 text-[26px] font-normal leading-[1.25] text-white/95">
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

  useEffect(() => {
    let cancelled = false;
    const mount = lottieMountRef.current;
    if (!mount) return;

    loadLottiePlayer().then((player) => {
      if (cancelled || !player || !lottieMountRef.current) return;
      const instance = player.loadAnimation({
        container: lottieMountRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "http://13.127.151.161:8002/wp-content/uploads/2026/01/Untitled-file-2.json",
      });
      lottieAnimationRef.current = instance;

      const handleDomLoaded = () => {
        instance.goToAndStop(0, true);
      };
      instance.addEventListener("DOMLoaded", handleDomLoaded);
    });

    return () => {
      cancelled = true;
      if (lottieHideTimeoutRef.current) {
        window.clearTimeout(lottieHideTimeoutRef.current);
      }
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      lottieAnimationRef.current?.destroy();
      lottieAnimationRef.current = null;
    };
  }, []);

  if (!data?.acf) return null;

  const acf = data.acf;
  const heading = acf.heading?.trim() || data.title.rendered;
  const subHeading = acf.sub_heading?.trim() || "";
  const discountCode = (acf.discount_code ?? acf.promo_code ?? acf.code)?.trim();
  const codeOnly =
    acf.code_only?.trim() ||
    discountCode?.replace(/^use\s*code\s*:\s*/i, "").trim();
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

  const renderHighlightedText = (value: string, className?: string) => {
    const parts = value.split(/(\d+%\s*off\b|\d+%|[A-Z0-9]{4,})/i);
    return (
      <span className={className}>
        {parts.map((part, i) => {
          if (/^\d+%\s*off$/i.test(part)) {
            return (
              <span key={i} className="font-semibold text-[#ffda00]">
                {part}
              </span>
            );
          }
          if (/^\d+%$/.test(part)) {
            return (
              <span key={i} className="font-semibold text-[#ffda00]">
                {part}
              </span>
            );
          }
          if (discountCode && part.toUpperCase() === discountCode.toUpperCase()) {
            return (
              <span key={i} className="font-semibold text-[#ffda00] underline decoration-white/40 underline-offset-4">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <section
      className={`relative isolate z-[100] mt-0 w-full overflow-x-hidden overflow-y-visible pt-48 md:pt-[7.5rem] lg:pt-[9rem] ${tightBottom ? "pb-0" : "pb-16"}`}
      style={
        transparentBackground
          ? undefined
          : { backgroundColor: sectionBackgroundColor }
      }
    >
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_0%,transparent_22%,rgba(255,255,255,0.05)_22%,rgba(255,255,255,0.05)_34%,transparent_34%,transparent_48%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.04)_62%,transparent_62%,transparent_100%)]" />
      </div>
      {bgImage && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-[70%] md:hidden"
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
              background: `linear-gradient(to bottom, transparent 0%, ${transparentBackground ? "transparent" : sectionBackgroundColor} 100%)`,
            }}
          />
        </div>
      )}

      <div className="relative z-10 hidden md:block">
        <div className="mx-auto w-full max-w-[1320px] px-10 lg:px-14">
          <div className="relative min-h-[430px] overflow-visible pt-[78px] lg:min-h-[520px] lg:pt-[96px]">
            <div className="relative z-10 rounded-[34px] bg-[#1a5d5f]/95 px-14 py-12 shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:-mt-8 md:bg-transparent md:p-[120px] md:shadow-none lg:-mt-10 lg:rounded-[38px]">
              <div
                className="pointer-events-none absolute inset-0 z-0 hidden rounded-[34px] lg:rounded-[38px] md:block"
                style={{
                  background: "linear-gradient(to right, #185b5d 0%, #185b5d 50%, transparent 100%)",
                }}
                aria-hidden
              />
              <div className="absolute inset-y-0 right-[255px] z-0 hidden w-[170px] bg-gradient-to-r from-[#1a5d5f] via-[#1a5d5f]/90 to-transparent lg:right-[340px] lg:block md:opacity-0" aria-hidden />

              {bgImage && (
                <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-[420px] w-[330px] lg:-right-2 lg:h-[560px] lg:w-[430px]">
                  <Image
                    src={bgImage}
                    alt=""
                    fill
                    className="object-contain object-right-bottom"
                    sizes="430px"
                    unoptimized={!!isLocal}
                  />
                </div>
              )}

              <div className="relative z-30 max-w-[900px] pr-[145px] lg:max-w-[980px] lg:pr-[220px]">
                <h2 className="font-normal text-white" style={{ fontSize: "41px", lineHeight: "50px" }}>
                  {renderHighlightedText(heading)}
                </h2>
                {subHeading && (
                  <p className="mt-2 font-semibold text-white/95" style={{ fontSize: "41px", lineHeight: "50px" }}>
                    {renderHighlightedText(subHeading)}
                  </p>
                )}
                {renderDesktopUseCodeLine()}

                <div className="mt-7 flex items-center gap-3 lg:mt-8 lg:gap-4">
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
                        width={150}
                        height={52}
                        className="h-[44px] w-auto object-contain lg:h-[48px]"
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
                        width={150}
                        height={52}
                        className="h-[44px] w-auto object-contain lg:h-[48px]"
                        unoptimized={!!isLocal}
                      />
                    </Link>
                  )}
                  <div
                    className="app-download-box relative ml-4 hidden text-[14px] leading-tight text-white/85 md:block"
                    onMouseEnter={handleDownloadHintEnter}
                    onMouseLeave={handleDownloadHintLeave}
                  >
                    <div
                      className={`pointer-events-none absolute left-[-95px] top-[-107px] z-20 h-[76px] w-[201px] transition-opacity duration-300 ${
                        showLottieHint ? "visible opacity-100" : "invisible opacity-0"
                      }`}
                      aria-hidden
                    >
                      <div
                        ref={lottieMountRef}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="relative">Download The<br />App Now!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-end text-right lg:mt-4">
            <p className="text-[20px] font-light uppercase tracking-wide text-white/95">OR</p>
            <Link
              href={bookingUrl}
              target={acf.booking_link?.target || "_self"}
              className="mt-3 inline-flex items-center gap-2 text-[28px] font-semibold text-white hover:text-white/90 focus:outline-none lg:text-[30px]"
            >
              {bookingText}
              <svg
                className="h-7 w-7"
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
              <p className="mt-5 max-w-[360px] text-[15px] leading-relaxed text-white/85 lg:text-[16px]">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 md:hidden">
        <div className="mx-auto w-full max-w-4xl px-6">
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

        <div className="mt-12 flex flex-col items-end pr-6 text-right">
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
      </div>
    </section>
  );
}
