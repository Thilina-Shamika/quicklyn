"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePageACF } from "@/types/wordpress";
import type { WPAppLink, WPHeader } from "@/lib/wordpress";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

interface HeroSectionProps {
  data: HomePageACF;
  header?: WPHeader | null;
  appLink?: WPAppLink | null;
}

export function HeroSection({ data, header, appLink }: HeroSectionProps) {
  const bgUrl = data.background_image?.url || PLACEHOLDER_IMAGE;
  const appStoreUrl = data.appstore?.url ?? "";
  const googlePlayUrl = data.google_play?.url ?? "";
  const appLinkAcf = appLink?.acf;
  const googlePlayHref = appLinkAcf?.link_01?.url || "#";
  const appStoreHref = typeof appLinkAcf?.link_02 === "string" ? appLinkAcf.link_02 : "#";
  const estimateLink = "/book-a-cleaning";
  const [mobileIntroDone, setMobileIntroDone] = useState(false);
  const [desktopGradientFadedOut, setDesktopGradientFadedOut] = useState(false);
  const isLocalImage =
    bgUrl.includes("quicklyn-headless.local") ||
    bgUrl.includes("quick.rootholdings");
  const popImg1 = data.pop_img_1?.url;
  const popImg2 = data.pop_img_2?.url;
  const popImg3 = data.pop_img_3?.url;
  const desktopHeadingParts = (data.section_1_heading || "")
    .replace(/Premium\s+/i, "Premium\n")
    .replace(/Services\s+in/i, "Services\nin")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  // Mobile: on load show zoomed in, then animate to zoomed out (no scroll trigger)
  useEffect(() => {
    const t = setTimeout(() => {
      setMobileIntroDone(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Desktop/tablet: gradient overlay visible initially, fades out when page loads
  useEffect(() => {
    setDesktopGradientFadedOut(true);
  }, []);

  // Mobile: pre-load state (before intro) and final state (after intro)
  const mobileIntroActive = !mobileIntroDone;
  // Before page load on mobile: image is ~50% more zoomed than the final state
  // and shifted ~10% to the left, but uses the SAME rotation as the final state.
  // After intro: tuned final transform (scaled up for a zoomed crop, rotation -12deg).
  const bgTransform = mobileIntroActive
    ? "translate(-10%, -8%) scale(6.2) rotate(-12deg)"
    : "translate(-40%, -8%) scale(4.4) rotate(-12deg)";
  // Keep the background image flush with the top so it can fill the full viewport height
  const bgMarginTop = "0%";
  // Mobile heading: before load it's 20px lower and slightly transparent; after load it moves up and becomes fully opaque
  const headingColor = "#ffffff";
  const headingTop = mobileIntroActive ? "calc(17vh + 20px)" : "17vh";
  const headingOpacity = mobileIntroActive ? 0.7 : 1;
  const tealOverlayOpacity = 0.4;
  /** Mobile-only: bottom edge of black fade (softer than full black). */
  const mobileHeroBottomGradient =
    "linear-gradient(to top, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)";

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden md:hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 origin-center"
          style={{
            transform: bgTransform,
            marginTop: bgMarginTop,
            transition: "transform 0.6s ease-out",
          }}
        >
          <Image
            src={bgUrl}
            alt=""
            fill
            className="object-contain"
            style={{ objectPosition: "center center" }}
            sizes="100vw"
            priority
            unoptimized={isLocalImage}
          />
        </div>

        {/* Mobile teal overlay over the hero background (slightly transparent at all times) */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundColor: "rgba(42, 122, 124, 0.4)",
          }}
          aria-hidden
        />

        {/* Mobile bottom black gradient overlays over the hero image (stacked for stronger effect).
            All start fully transparent before page load, then fade in when the intro completes. */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: mobileHeroBottomGradient,
            opacity: mobileIntroActive ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: mobileHeroBottomGradient,
            opacity: mobileIntroActive ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            background: mobileHeroBottomGradient,
            opacity: mobileIntroActive ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background: mobileHeroBottomGradient,
            opacity: mobileIntroActive ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
          aria-hidden
        />

        {/* Heading */}
        <div
          className="absolute left-0 right-0 flex justify-center px-6 text-center"
          style={{
            top: headingTop,
            zIndex: 6,
            transition: "top 0.6s ease-out",
          }}
        >
          <h1
            className="hero-text-shadow max-w-[320px] text-[35px] font-semibold leading-[39px] tracking-[-0.02em]"
            style={{
              color: headingColor,
              opacity: headingOpacity,
              transition: "opacity 0.6s ease-out",
            }}
          >
            {data.section_1_heading}
          </h1>
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex min-h-screen flex-col pt-[100px]"
          style={{ paddingTop: "calc(100px + env(safe-area-inset-top, 0px))" }}
        >
          {/* Main content */}
          <div
            className="flex flex-1 flex-col items-center px-6 pb-0 text-center"
            style={{ paddingTop: "max(0px, calc(18vh - 120px))" }}
          >
            {/* Spacer between (separate) heading layer and badges */}
            <div className="min-h-[40vh] shrink-0" aria-hidden />

            {/* Store badges */}
            <div className="mb-6 mt-8 flex flex-wrap items-center justify-center gap-[14px]">
              {appStoreUrl && (
                <Link
                  href={appStoreHref || "#"}
                  target={appLinkAcf?.link_02 ? "_blank" : undefined}
                  rel={appLinkAcf?.link_02 ? "noopener noreferrer" : undefined}
                  className="relative z-[10] block transition hover:opacity-95"
                >
                  <Image
                    src={appStoreUrl}
                    alt="Download on the App Store"
                    width={122}
                    height={46}
                    className="h-[46px] w-auto object-contain"
                    unoptimized={isLocalImage}
                  />
                </Link>
              )}
              {googlePlayUrl && (
                <Link
                  href={googlePlayHref || "#"}
                  target={appLinkAcf?.link_01?.target || (googlePlayHref ? "_blank" : undefined)}
                  rel={googlePlayHref ? "noopener noreferrer" : undefined}
                  className="relative z-[10] block transition hover:opacity-95"
                >
                  <Image
                    src={googlePlayUrl}
                    alt="GET IT ON Google Play"
                    width={122}
                    height={46}
                    className="h-[46px] w-auto object-contain"
                    unoptimized={isLocalImage}
                  />
                </Link>
              )}
            </div>

            {/* Description */}
            <p className="hero-text-shadow relative z-[20] mb-6 max-w-[280px] text-[16px] leading-relaxed text-white/90">
              {data.section_1_description}
            </p>
          </div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[#1a5d5f] md:block">
        <div className="relative min-h-[1080px] lg:min-h-[1200px]">
          <Image
            src={bgUrl}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={isLocalImage}
            style={{
              transform: desktopGradientFadedOut
                ? "translateY(-18%) scale(1.42) rotate(0deg)"
                : "translateY(-8%) scale(1.15) rotate(-4deg)",
              transition: "transform 0.6s ease-out",
              transformOrigin: "center center",
              objectPosition: "center bottom",
            }}
          />

          {/* Intro gradient: visible before load, fades out when page loads */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopGradientFadedOut ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(to top right, #000000 0%, rgba(24,91,93,0.5) 100%)",
            }}
            aria-hidden
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopGradientFadedOut ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(90deg, rgba(25,91,93,1) 0%, rgba(25,91,93,0) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopGradientFadedOut ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(90deg, #206c70 0%, rgba(32,108,112,0.2) 30%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopGradientFadedOut ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(90deg, #206c70 0%, rgba(32,108,112,0.2) 30%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopGradientFadedOut ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(to top, rgba(25,91,93,1) 0%, rgba(25,91,93,0) 45%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex min-h-[1080px] w-full max-w-[1320px] -mt-6 items-center px-8 pb-24 pt-0 lg:-mt-8 lg:min-h-[1200px] lg:px-8 lg:pt-0">
            <div className="grid w-full grid-cols-12 items-center gap-6 lg:gap-8">
              <div className="col-span-7 md:col-span-7 lg:col-span-6 pr-2 md:-translate-y-6 lg:-translate-y-8">
                <h1
                  className="hero-text-shadow font-semibold tracking-[-0.03em] text-white md:max-w-[880px] lg:max-w-[560px] text-[40px] leading-[47px] lg:text-[60px] lg:leading-[59px]"
                >
                  {desktopHeadingParts.length > 0 ? (
                    desktopHeadingParts.map((part, index) => (
                      <span key={`${part}-${index}`} className="block">
                        {part}
                      </span>
                    ))
                  ) : (
                    data.section_1_heading
                  )}
                </h1>

                <p className="hero-text-shadow mt-6 max-w-[500px] text-[19px] leading-[1.45] text-white/90 lg:mt-7 lg:max-w-[500px] lg:text-[20px]">
                  {data.section_1_description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10">
                  {googlePlayUrl && (
                    <Link
                      href={googlePlayHref || "#"}
                      target={appLinkAcf?.link_01?.target || (googlePlayHref ? "_blank" : undefined)}
                      rel={googlePlayHref ? "noopener noreferrer" : undefined}
                      className="transition hover:opacity-95"
                    >
                      <div className="rounded-xl bg-white/90 p-0 shadow-[0_10px_18px_rgba(0,0,0,0.18)]">
                        <Image
                          src={googlePlayUrl}
                          alt="Get it on Google Play"
                          width={180}
                          height={60}
                          className="h-[48px] w-auto object-contain lg:h-[52px]"
                          unoptimized={isLocalImage}
                        />
                      </div>
                    </Link>
                  )}
                  {appStoreUrl && (
                    <Link
                      href={appStoreHref || "#"}
                      target={appLinkAcf?.link_02 ? "_blank" : undefined}
                      rel={appStoreHref ? "noopener noreferrer" : undefined}
                      className="transition hover:opacity-95"
                    >
                      <div className="rounded-xl bg-white/90 p-0 shadow-[0_10px_18px_rgba(0,0,0,0.18)]">
                        <Image
                          src={appStoreUrl}
                          alt="Download on the App Store"
                          width={180}
                          height={60}
                          className="h-[48px] w-auto object-contain lg:h-[52px]"
                          unoptimized={isLocalImage}
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              <div
                className="relative col-span-5 h-[440px] lg:col-span-5 lg:h-[520px]"
                style={{
                  transform: desktopGradientFadedOut ? "scale(1)" : "scale(0.2)",
                  opacity: desktopGradientFadedOut ? 1 : 0,
                  transformOrigin: "center center",
                  transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                }}
              >
                {popImg2 && (
                  <div className="absolute md:right-0 md:top-[7%] z-20 rotate-[6deg] transition-transform duration-300 hover:scale-105 lg:right-[15%] lg:top-[17%]">
                    <Image
                      src={popImg2}
                      alt=""
                      width={345}
                      height={172}
                      className="h-auto md:w-[150px] lg:w-[235px]"
                      unoptimized={isLocalImage}
                    />
                  </div>
                )}

                {popImg1 && (
                  <div className="absolute md:left-[26%] md:top-[26%] z-20 -rotate-[11deg] transition-transform duration-300 hover:scale-105 lg:-left-[5%] lg:top-[35%]">
                    <Image
                      src={popImg1}
                      alt=""
                      width={265}
                      height={300}
                      className="h-auto md:w-[180px] lg:w-[270px]"
                      unoptimized={isLocalImage}
                    />
                  </div>
                )}

                {popImg3 && (
                  <div className="absolute md:right-[-4%] md:top-[64%] z-20 rotate-[8deg] transition-transform duration-300 hover:scale-105 lg:right-[8%] lg:top-[54%]">
                    <Image
                      src={popImg3}
                      alt=""
                      width={298}
                      height={359}
                      className="h-auto md:w-[165px] lg:w-[230px]"
                      unoptimized={isLocalImage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
