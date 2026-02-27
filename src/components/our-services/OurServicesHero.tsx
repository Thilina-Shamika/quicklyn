"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface OurServicesHeroProps {
  heading: string;
  subHeading?: string;
  descriptionParagraphs: string[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  desktopHeroImageUrl?: string;
  desktopHeroImageAlt?: string;
  isLocalHero: boolean;
}

export function OurServicesHero({
  heading,
  subHeading,
  descriptionParagraphs,
  heroImageUrl,
  heroImageAlt,
  desktopHeroImageUrl,
  desktopHeroImageAlt,
  isLocalHero,
}: OurServicesHeroProps) {
  const [isActive, setIsActive] = useState(false);
  const [desktopIntroDone, setDesktopIntroDone] = useState(false);

  // Mobile: run hero animation on page load (no scroll trigger)
  useEffect(() => {
    const t = setTimeout(() => setIsActive(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Desktop intro animation: mark as done after first render
  useEffect(() => {
    setDesktopIntroDone(true);
  }, []);

  // Split sub-heading so the last four words can be bolded
  let subHeadingFirstPart: string | null = null;
  let subHeadingLastPart: string | null = null;
  if (subHeading) {
    const words = subHeading.trim().split(/\s+/);
    if (words.length > 4) {
      subHeadingFirstPart = words.slice(0, -4).join(" ");
      subHeadingLastPart = words.slice(-4).join(" ");
    } else {
      subHeadingFirstPart = subHeading;
      subHeadingLastPart = null;
    }
  }

  const headingMarginTop = isActive ? "45%" : "65%";
  const headingColor = isActive ? "#ffffff" : "#368284";
  const bgTransform = isActive
    ? "scale(1.8) translateX(-15%)"
    : "scale(1.8) translateX(0%)";

  const headingWords = heading.trim().split(/\s+/).filter(Boolean);
  const desktopHeadingTop = headingWords[0] ?? "Our";
  const desktopHeadingBottom =
    headingWords.slice(1).join(" ") || headingWords[0] || "Services";

  return (
    <>
      <section className="relative hidden w-full overflow-hidden bg-[#2a7a7c] md:block">
        {/* Desktop hero background image from ACF (1st section desktop background) */}
        {(desktopHeroImageUrl || heroImageUrl) && (
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <Image
              src={desktopHeroImageUrl || heroImageUrl || ""}
              alt={
                desktopHeroImageAlt ||
                heroImageAlt ||
                heading ||
                "Our Services background"
              }
              fill
              className="object-contain object-center"
              sizes="100vw"
              priority
              unoptimized={isLocalHero}
              style={{
                transform: desktopIntroDone
                  ? "translateX(0%) translateY(6%) scale(1.35)"
                  : "translateX(30%) translateY(6%) scale(1.35)",
                transition: "transform 0.6s ease-out",
                transformOrigin: "center center",
              }}
            />
          </div>
        )}

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-[1320px] items-end justify-between px-10 pb-0 pt-36 lg:min-h-[700px] lg:px-14 lg:pb-4 lg:pt-40">
          <div className="flex w-full max-w-[520px] flex-col items-start">
            <h1
              className="hero-text-shadow text-left font-semibold tracking-[-0.06em] text-white text-[240px] leading-[180px]"
              style={{
                opacity: desktopIntroDone ? 1 : 0,
                transform: desktopIntroDone ? "translateY(0)" : "translateY(-80px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              }}
            >
              <span className="block">{desktopHeadingTop}</span>
              <span className="block">{desktopHeadingBottom}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-0 w-full items-center justify-center overflow-hidden py-16 md:hidden">
        {/* Van background from ACF (no cropping, original image) */}
        {heroImageUrl && (
          <div className="pointer-events-none absolute inset-0 z-0 flex items-start justify-end pt-[90px]">
            <div
              className="relative mr-[-90px] h-[260px] w-[70%] transition-transform duration-300 ease-out"
              style={{ transform: bgTransform, transformOrigin: "right center" }}
            >
              <Image
                src={heroImageUrl}
                alt={heroImageAlt || heading || "Our Services background"}
                fill
                className="object-contain object-right"
                sizes="50vw"
                priority
                unoptimized={isLocalHero}
              />
            </div>
          </div>
        )}

        {/* Content column */}
        <div className="relative z-10 mx-auto flex w-full flex-col items-center px-6 py-16 text-center">
          <h1
            className="mx-auto text-[67px] font-semibold leading-[65px] transition-all duration-300"
            style={{
              marginTop: headingMarginTop,
              paddingBottom: isActive ? "0.75rem" : "0.25rem",
              color: headingColor,
              transition:
                "margin-top 0.3s ease, padding-bottom 0.3s ease, color 0.3s ease",
            }}
          >
            {heading}
          </h1>

          {subHeading && (
            <p
              className={`mt-2 mb-4 text-[25px] leading-[28px] text-white transition-all duration-300 ${
                isActive
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-50 translate-y-2"
              }`}
            >
              {subHeadingFirstPart}
              {subHeadingLastPart && (
                <>
                  {" "}
                  <span className="font-semibold">{subHeadingLastPart}</span>
                </>
              )}
            </p>
          )}

          {descriptionParagraphs.length > 0 && (
            <div
              className={`mb-8 space-y-4 text-[12px] leading-[19px] text-white/90 transition-all duration-300 ${
                isActive
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-50 translate-y-2"
              }`}
            >
              {descriptionParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
