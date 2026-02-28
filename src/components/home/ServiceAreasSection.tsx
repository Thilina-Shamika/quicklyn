"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HomePageACF } from "@/types/wordpress";

interface ServiceAreasSectionProps {
  data: HomePageACF;
}

export function ServiceAreasSection({ data }: ServiceAreasSectionProps) {
  const heading = data["4th_section_heading"];
  const subHeading = data["4th_section_sub_heading"];
  const description = data["4th_section_description"];
  const map = data["4th_section_map"];
  const desktopMapWithoutPin = data["desktop_map_without_pin"];
  const desktopMapWithPin = data["desktop_map_with_pin"];

  const desktopMapRef = useRef<HTMLDivElement | null>(null);
  const [isMapInView, setIsMapInView] = useState(false);

  useEffect(() => {
    const el = desktopMapRef.current;
    if (!el) return;
    let delayId: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delayId = setTimeout(() => setIsMapInView(true), 400);
        } else {
          if (delayId) clearTimeout(delayId);
          delayId = null;
          setIsMapInView(false);
        }
      },
      { threshold: 0.35, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => {
      if (delayId) clearTimeout(delayId);
      observer.disconnect();
    };
  }, []);

  if (!heading && !subHeading && !description && !map) return null;

  const mapUrl = map?.url;
  const isLocalMap =
    !!mapUrl &&
    (mapUrl.includes("quicklyn-headless.local") ||
      mapUrl.includes("quick.rootholdings"));

  const desktopMapWithoutPinUrl = desktopMapWithoutPin?.url;
  const isDesktopMapWithoutPinLocal =
    !!desktopMapWithoutPinUrl &&
    (desktopMapWithoutPinUrl.includes("quicklyn-headless.local") ||
      desktopMapWithoutPinUrl.includes("quick.rootholdings"));

  const desktopMapWithPinUrl = desktopMapWithPin?.url;
  const isDesktopMapWithPinLocal =
    !!desktopMapWithPinUrl &&
    (desktopMapWithPinUrl.includes("quicklyn-headless.local") ||
      desktopMapWithPinUrl.includes("quick.rootholdings"));

  return (
    <section className="relative w-full overflow-hidden bg-[#297a7c] pb-0 pt-0">
      {/* Linear overlay: 100% #226e71 → 0% transparent */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, #226e71 0%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Map image as right-aligned background */}
        {mapUrl && (
          <div className="pointer-events-none absolute right-0 top-[190px] mr-[20px] h-[260px] w-[75%]">
            <Image
              src={mapUrl}
              alt={map.alt || heading || "Service areas map"}
              fill
              className="object-contain object-right"
              priority={false}
              unoptimized={isLocalMap}
            />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
          {heading && (
            <h2 className="mb-8 text-center text-[40px] font-semibold leading-[42px] text-white">
              {heading}
            </h2>
          )}

          <div className="w-[50%] text-left">
            {subHeading && (
              <p className="mb-3 text-[20px] font-normal leading-snug text-white">
                {subHeading}
              </p>
            )}
            {description && (
              <p className="text-[12px] leading-relaxed text-white/85">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop / tablet layout */}
      <div className="relative z-10 mx-auto hidden w-full max-w-[1260px] px-8 py-10 md:block lg:px-6 lg:py-14">
        <div className="grid grid-cols-12 items-center gap-6 lg:gap-10">
          <div className="col-span-3">
            {heading && (
              <h2
                className={`hero-text-shadow text-left text-[54px] font-medium leading-[84px] tracking-[-0.03em] text-white lg:text-[99px] transition-all duration-700 ${
                  isMapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {heading.split(/\s+/).map((word, index) => (
                  <span key={`${word}-${index}`} className="block">
                    {word}
                  </span>
                ))}
              </h2>
            )}
          </div>

          <div className="col-span-5 -ml-14 lg:-ml-20" ref={desktopMapRef}>
            {desktopMapWithoutPinUrl ? (
              <div className="relative h-[400px] w-full max-w-[560px] overflow-visible lg:h-[520px] lg:max-w-[680px]">
                {/* Base map without pins */}
                <Image
                  src={desktopMapWithoutPinUrl}
                  alt={
                    desktopMapWithoutPin?.alt ||
                    heading ||
                    "Service areas map"
                  }
                  fill
                  className={`object-contain object-center transition-opacity duration-500 lg:scale-[1.2] ${
                    isMapInView ? "opacity-0" : "opacity-100"
                  }`}
                  priority={false}
                  unoptimized={isDesktopMapWithoutPinLocal}
                />

                {/* Map with pins – visible when section is in view */}
                {desktopMapWithPinUrl && (
                  <Image
                    src={desktopMapWithPinUrl}
                    alt={
                      desktopMapWithPin?.alt ||
                      heading ||
                      "Service areas map with locations"
                    }
                    fill
                    className={`object-contain object-center transition-opacity duration-700 lg:scale-[1.2] ${
                      isMapInView ? "opacity-100" : "opacity-0"
                    }`}
                    priority={false}
                    unoptimized={isDesktopMapWithPinLocal}
                  />
                )}
              </div>
            ) : null}
          </div>

          <div className="col-span-4 pl-2 text-left lg:pl-6">
            {subHeading && (
              <h3 className="text-[30px] font-medium leading-tight text-white lg:text-[40px]">
                {subHeading}
              </h3>
            )}
            {description && (
              <p className="mt-5 max-w-[290px] text-[13px] leading-[1.75] text-white/90 lg:mt-6 lg:max-w-[340px] lg:text-[16px] lg:leading-[1.8]">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
