"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ExtrasListItem } from "@/types/wordpress";

interface OurServicesExtrasSectionProps {
  extras: ExtrasListItem[];
}

function hasContent(value: string | undefined | null): boolean {
  if (!value) return false;
  const stripped = value.replace(/<[^>]+>/g, "").trim();
  return stripped.length > 0;
}

export function OurServicesExtrasSection({
  extras,
}: OurServicesExtrasSectionProps) {
  const validExtras = (extras ?? []).filter(
    (item) => item && item.extras_heading?.trim().length,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!validExtras.length) return null;

  const active = validExtras[activeIndex] ?? validExtras[0];
  if (!active) return null;

  const {
    extras_heading,
    extras_approximate_time,
    extras_icon,
    extras_description,
  } = active;

  const strippedDescription =
    extras_description?.replace(/<[^>]+>/g, "").trim() ?? "";
  const shouldShowReadMore = strippedDescription.length > 400;

  const goToIndex = (index: number) => {
    if (!validExtras.length) return;
    const normalizedIndex =
      ((index % validExtras.length) + validExtras.length) % validExtras.length;
    if (normalizedIndex === activeIndex) return;

    setIsTransitioning(true);
    // brief fade-out then swap content and fade back in
    setTimeout(() => {
      setActiveIndex(normalizedIndex);
      setIsExpanded(false);
      setIsTransitioning(false);
    }, 150);
  };

  const firstParagraphRaw = strippedDescription
    ? strippedDescription.split(/\n\n+/)[0]?.trim() ?? ""
    : "";
  const firstParagraph = firstParagraphRaw.replace(/<[^>]+>/g, "").trim();

  return (
    <section className="bg-[#2a7a7c] pb-16 pt-10 text-white">
      {/* Mobile: unchanged layout */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:hidden">
        <h2 className="mb-6 text-center text-[44px] font-semibold tracking-normal">
          The Extras
        </h2>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {validExtras.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${item.extras_heading}-${index}`}
                type="button"
                onClick={() => goToIndex(index)}
                className={`rounded-[8px] border border-[#7eafaf] px-4 py-1.5 text-[13px] capitalize text-white transition-colors duration-200 ${
                  isActive
                    ? "bg-[#195b5d]"
                    : "bg-[rgba(255,255,255,0.11)] text-white/85 hover:bg-white/10"
                }`}
              >
                {item.extras_heading}
              </button>
            );
          })}
        </div>

        <article
          className="relative rounded-3xl px-6 py-8 transition-opacity duration-300 ease-out"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <div>
            <h3 className="mb-4 text-2xl font-semibold">{extras_heading}</h3>

            <div className="flex items-start justify-between gap-4">
              {hasContent(extras_approximate_time) && (
                <div className="mb-4 text-sm">
                  <p className="font-semibold">Approximate Time:</p>
                  <p className="mt-1 text-white/90">
                    {extras_approximate_time}
                  </p>
                </div>
              )}

              {extras_icon?.url && (
                <div className="shrink-0">
                  <Image
                    src={extras_icon.url}
                    alt={extras_icon.alt || extras_heading}
                    width={extras_icon.width || 60}
                    height={extras_icon.height || 60}
                    className="h-16 w-16 object-contain"
                    unoptimized={extras_icon.url.includes(
                      "quick.rootholdings.com.mv",
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="my-5 border-white/20" />

          {hasContent(extras_description) && (
            <div
              className={`max-w-none text-white/90 text-[12px] leading-[19px] space-y-2
              [&_p]:mt-0 [&_p]:mb-2
              [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-2
              [&_li]:mb-1 ${
                !isExpanded && shouldShowReadMore ? " line-clamp-7" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: extras_description! }}
            />
          )}

          {shouldShowReadMore && (
            <button
              type="button"
              className="mt-3 text-[12px] font-medium text-white underline underline-offset-2"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? "Read less" : "Read more..."}
            </button>
          )}

          {validExtras.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous extra"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white hover:bg-white/10"
                onClick={() => goToIndex(activeIndex - 1)}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Next extra"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white hover:bg-white/10"
                onClick={() => goToIndex(activeIndex + 1)}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6L15 12L9 18" />
                </svg>
              </button>
            </div>
          )}
        </article>
      </div>

      {/* Desktop: two-column layout per image */}
      <div className="mx-auto hidden max-w-[1180px] px-6 md:block">
        <h2 className="mb-8 text-center text-[96px] font-semibold tracking-normal">
          The Extras
        </h2>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {validExtras.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`desktop-${item.extras_heading}-${index}`}
                type="button"
                onClick={() => goToIndex(index)}
                className={`border-0 bg-transparent px-4 py-2 text-[27px] capitalize transition-colors duration-200 hover:font-semibold ${
                  isActive ? "font-semibold text-[#ffda00]" : "text-white/85"
                }`}
              >
                {item.extras_heading}
              </button>
            );
          })}
        </div>

        <article
          className="relative grid grid-cols-1 gap-10 pt-[40px] transition-opacity duration-300 ease-out lg:grid-cols-[1fr_1fr]"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {/* Left: title, icon, intro description */}
          <div className="flex flex-col">
            <div className="flex items-start gap-4">
              <h3 className="line-clamp-2 pb-5 text-[53px] font-normal leading-[61px] text-white">
                {(() => {
                  const words = extras_heading.trim().split(/\s+/);
                  const firstLine = words[0] ?? "";
                  const secondLine = words.slice(1).join(" ");
                  return secondLine ? (
                    <>
                      {firstLine}
                      <br />
                      {secondLine}
                    </>
                  ) : (
                    firstLine
                  );
                })()}
              </h3>
              {extras_icon?.url && (
                <div className="shrink-0">
                  <Image
                    src={extras_icon.url}
                    alt={extras_icon.alt || extras_heading}
                    width={extras_icon.width || 72}
                    height={extras_icon.height || 72}
                    className="h-20 w-20 object-contain lg:h-24 lg:w-24"
                    unoptimized={extras_icon.url.includes(
                      "quick.rootholdings.com.mv",
                    )}
                  />
                </div>
              )}
            </div>
            {firstParagraph && (
              <p className="mt-4 max-w-none text-[14px] leading-[1.6] text-white/90 lg:text-[15px]">
                {firstParagraph}
              </p>
            )}
          </div>

          {/* Right: Approximate Time + arrows in one row, then full description */}
          <div className="flex flex-col">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/25 pb-6">
              {hasContent(extras_approximate_time) && (
                <div>
                  <p className="text-[14px] font-semibold text-white">
                    Approximate Time:
                  </p>
                  <p className="mt-1 text-[14px] text-white/90">
                    {extras_approximate_time}
                  </p>
                </div>
              )}

              {validExtras.length > 1 && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous extra"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10 transition-colors"
                    onClick={() => goToIndex(activeIndex - 1)}
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next extra"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10 transition-colors"
                    onClick={() => goToIndex(activeIndex + 1)}
                  >
                    <ArrowRight className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>

            {hasContent(extras_description) && (
              <div
                className="max-w-none text-[14px] leading-[1.6] text-white/90 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_li]:mb-1 [&_h3]:mb-2 [&_h3]:text-[12px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-white"
                dangerouslySetInnerHTML={{ __html: extras_description! }}
              />
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
