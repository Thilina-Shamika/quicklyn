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
  const estimateLink = data.estimate_button_link?.url ?? "#";
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLocalImage =
    bgUrl.includes("quicklyn-headless.local") ||
    bgUrl.includes("quick.rootholdings");
  const headerLogoUrl = header?.acf?.header_logo?.url;
  const isLocalLogo = headerLogoUrl?.includes("quicklyn-headless.local");
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

  // Scroll behavior - only on mobile: zoom out a bit when scrolled
  useEffect(() => {
    if (typeof window === "undefined" || !isMobile) {
      setIsCollapsed(false);
      return;
    }

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setIsCollapsed(y > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleHeroClick = () => {
    if (!isMobile) return;
    setIsCollapsed((prev) => !prev);
  };

  // Background: zoomed-in by default, zooms out a bit (≈3x) and shifts when scrolled/clicked on mobile
  const bgTransform = isCollapsed
    ? "translateX(0%) scale(2.5) rotate(-42deg)" // zoom out more + extra counter-clockwise when scrolled
    : "translateX(25%) scale(3.8) rotate(-35deg)";
  const bgMarginTop = isCollapsed ? "18%" : "40%"; // move up a bit when zoomed out

  const headingColor = isCollapsed ? "#ffffff" : "#75a4a5";
  const headingTop = isCollapsed ? "17vh" : "20vh";
  const tealOverlayOpacity = isCollapsed ? 0.4 : 1;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      onClick={handleHeroClick}
    >
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
  );
}

