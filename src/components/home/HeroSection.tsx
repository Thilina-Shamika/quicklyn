"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePageACF } from "@/types/wordpress";
import type { WPHeader } from "@/lib/wordpress";

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
}

export function HeroSection({ data, header }: HeroSectionProps) {
  const bgUrl = data.background_image?.url || PLACEHOLDER_IMAGE;
  const appStoreUrl = data.appstore?.url ?? "";
  const googlePlayUrl = data.google_play?.url ?? "";
  const estimateLink = "/book-a-cleaning";
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [desktopIntroDone, setDesktopIntroDone] = useState(false);
  const [mobileLoadIntroDone, setMobileLoadIntroDone] = useState(false);
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
  // Detect mobile viewport
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile: on load show zoomed in, then animate to zoomed out (no scroll trigger)
  useEffect(() => {
    if (!isMobile) return;
    const t = setTimeout(() => {
      setMobileLoadIntroDone(true);
      setIsCollapsed(true);
    }, 100);
    return () => clearTimeout(t);
  }, [isMobile]);

  // Desktop intro: render background slightly zoomed out / rotated on first paint,
  // then immediately snap to the final position once the page has loaded.
  useEffect(() => {
    setDesktopIntroDone(true);
  }, []);

  // Mobile: on load show zoomed in then animate to zoomed out (no scroll or tap)
  const mobileCollapsedDisplay = !mobileLoadIntroDone ? false : isCollapsed;
  const bgTransform = mobileCollapsedDisplay
    ? "translateX(0%) scale(2.5) rotate(-42deg)"
    : "translateX(25%) scale(3.8) rotate(-35deg)";
  const bgMarginTop = mobileCollapsedDisplay ? "18%" : "40%";
  const headingColor = mobileCollapsedDisplay ? "#ffffff" : "#75a4a5";
  const headingTop = mobileCollapsedDisplay ? "17vh" : "20vh";
  const tealOverlayOpacity = mobileCollapsedDisplay ? 0.4 : 1;

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden md:hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 origin-center"
          style={{
            transform: bgTransform,
            marginTop: bgMarginTop,
            transition: "transform 0.45s ease-out, margin-top 0.45s ease-out",
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

        {/* Heading */}
        <div
          className="absolute left-0 right-0 flex justify-center px-6 text-center"
          style={{
            top: headingTop,
            zIndex: 6,
            transition: "top 0.45s ease-out, color 0.45s ease-out",
          }}
        >
          <h1
            className="hero-text-shadow max-w-[320px] text-[35px] font-semibold leading-[35px]"
            style={{
              color: headingColor,
              transition: "color 0.45s ease-out",
            }}
          >
            {data.section_1_heading}
          </h1>
        </div>

        {/* Overlay: teal gradient (fades a bit when scrolled/clicked) */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            opacity: tealOverlayOpacity,
            transition: "opacity 0.45s ease-out",
            background:
              "linear-gradient(to bottom, rgba(24, 91, 93, 1) 0%, rgba(24, 91, 93, 0.47) 47%, rgba(24, 91, 93, 0.2) 100%)",
          }}
          aria-hidden
        />
        {/* Overlay: black fade (always same, no change on scroll) */}
        <div
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          }}
          aria-hidden
        />

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
                  href="#"
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
                  href="#"
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
        <div className="relative min-h-[900px] lg:min-h-[980px]">
          <Image
            src={bgUrl}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={isLocalImage}
            style={{
              transform: desktopIntroDone
                ? "translateX(10%) translateY(-4%) scaleX(-1) scale(1.08)"
                : "translateX(14%) translateY(2%) scaleX(-1) scale(0.94) rotate(8deg)",
              transition: "transform 0.4s ease-out",
              transformOrigin: "center center",
            }}
          />

          {/* Intro gradient: bottom-left → top-right, fades out after load */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: desktopIntroDone ? 0 : 1,
              transition: "opacity 0.45s ease-out",
              background:
                "linear-gradient(to top right, #000000 0%, rgba(24,91,93,0.5) 100%)",
            }}
            aria-hidden
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(25,91,93,1) 0%, rgba(25,91,93,0) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #206c70 0%, rgba(32,108,112,0.2) 30%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #206c70 0%, rgba(32,108,112,0.2) 30%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(25,91,93,1) 0%, rgba(25,91,93,0) 45%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex min-h-[900px] w-full max-w-[1320px] items-center px-8 pb-24 pt-[95px] lg:min-h-[980px] lg:px-8 lg:pt-[112px]">
            <div className="grid w-full grid-cols-12 items-center gap-6 lg:gap-8">
              <div className="col-span-6 pr-2 md:-translate-y-6 lg:col-span-6 lg:-translate-y-8">
                <h1 className="hero-text-shadow max-w-[560px] font-semibold tracking-[-0.03em] text-white lg:max-w-[560px]" style={{ fontSize: "60px", lineHeight: "59px" }}>
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
                    <Link href="#" className="transition hover:opacity-95">
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
                    <Link href="#" className="transition hover:opacity-95">
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
                  transform: desktopIntroDone ? "scale(1)" : "scale(0.7)",
                  opacity: desktopIntroDone ? 1 : 0,
                  transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
                  transformOrigin: "center center",
                }}
              >
                {popImg2 && (
                  <div className="absolute right-[16%] top-[18%] z-20 rotate-[6deg] transition-transform duration-300 hover:scale-105 lg:right-[15%] lg:top-[17%]">
                    <Image
                      src={popImg2}
                      alt=""
                      width={345}
                      height={172}
                      className="h-auto w-[180px] lg:w-[235px]"
                      unoptimized={isLocalImage}
                    />
                  </div>
                )}

                {popImg1 && (
                  <div className="absolute left-[10%] top-[38%] z-20 -rotate-[11deg] transition-transform duration-300 hover:scale-105 lg:left-[9%] lg:top-[35%]">
                    <Image
                      src={popImg1}
                      alt=""
                      width={265}
                      height={300}
                      className="h-auto w-[170px] lg:w-[215px]"
                      unoptimized={isLocalImage}
                    />
                  </div>
                )}

                {popImg3 && (
                  <div className="absolute right-[8%] top-[56%] z-20 rotate-[8deg] transition-transform duration-300 hover:scale-105 lg:right-[8%] lg:top-[54%]">
                    <Image
                      src={popImg3}
                      alt=""
                      width={298}
                      height={359}
                      className="h-auto w-[188px] lg:w-[230px]"
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
