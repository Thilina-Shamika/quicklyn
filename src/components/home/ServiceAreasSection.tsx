"use client";

import Image from "next/image";
import type { HomePageACF } from "@/types/wordpress";

interface ServiceAreasSectionProps {
  data: HomePageACF;
}

export function ServiceAreasSection({ data }: ServiceAreasSectionProps) {
  const heading = data["4th_section_heading"];
  const subHeading = data["4th_section_sub_heading"];
  const description = data["4th_section_description"];
  const map = data["4th_section_map"];

  if (!heading && !subHeading && !description && !map) return null;

  const mapUrl = map?.url;
  const isLocalMap =
    !!mapUrl &&
    (mapUrl.includes("quicklyn-headless.local") ||
      mapUrl.includes("quick.rootholdings"));

  return (
    <section className="relative w-full overflow-hidden bg-[#226d71] pb-16 pt-14">
      {/* Map image as right-aligned background */}
      {mapUrl && (
        <div className="pointer-events-none absolute right-0 top-[190px] mr-[20px] h-[260px] w-[75%] md:w-[65%]">
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
        {/* Main heading centered */}
        {heading && (
          <h2 className="mb-8 text-center text-[40px] font-semibold leading-[42px] text-white">
            {heading}
          </h2>
        )}

        {/* Text overlay on left */}
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
    </section>
  );
}

