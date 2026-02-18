"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface OurServicesHeroProps {
  heading: string;
  subHeading?: string;
  descriptionParagraphs: string[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  isLocalHero: boolean;
}

export function OurServicesHero({
  heading,
  subHeading,
  descriptionParagraphs,
  heroImageUrl,
  heroImageAlt,
  isLocalHero,
}: OurServicesHeroProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setIsActive(y > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <section className="relative flex min-h-0 w-full items-center justify-center overflow-hidden py-16 md:py-20">
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
          className="text-[67px] font-semibold leading-[65px] mx-auto transition-all duration-300"
          style={{
            marginTop: headingMarginTop,
            paddingBottom: isActive ? "0.75rem" : "0.25rem",
            color: headingColor,
            transition: "margin-top 0.3s ease, padding-bottom 0.3s ease, color 0.3s ease",
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
  );
}

