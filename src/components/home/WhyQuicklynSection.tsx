"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { WhyListItem } from "@/types/wordpress";

/** Line-art SVG icons matching the Why Quicklyn design */
function ClockDollarIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 text-white lg:h-20 lg:w-20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="24" />
      <path d="M32 20v12l8 8" />
      <path d="M38 22h-4c-2 0-4 1.5-4 4s2 4 4 4h4c2 0 4 1.5 4 4s-2 4-4 4h-4" />
    </svg>
  );
}
function ShieldDocsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 text-white lg:h-20 lg:w-20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 14h16v20H18z" />
      <path d="M24 14V8a6 6 0 0112 0v6" />
      <path d="M18 22h16" />
      <path d="M26 34h10v16H26z" strokeDasharray="2 2" />
      <path d="M32 38l-4 8h8l-4-8z" />
      <path d="M30 44h4" />
    </svg>
  );
}
function HandPhoneIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 text-white lg:h-20 lg:w-20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 48c-2 2-6 2-8-2-2-4 0-10 4-14" />
      <path d="M26 42c-2-2-2-6 2-10 4-4 10-4 14 0" />
      <path d="M30 36c0-4 4-8 8-8 4 0 8 4 8 8" />
      <rect x="36" y="12" width="16" height="32" rx="3" />
      <path d="M40 20h8M40 26h8M40 32h8" />
    </svg>
  );
}
function HandCoinIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 text-white lg:h-20 lg:w-20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 48c-2 0-6-2-6-8v-6c0-6 4-8 6-8" />
      <path d="M24 26v2" />
      <path d="M40 48c2 0 6-2 6-8v-6c0-6-4-8-6-8" />
      <circle cx="32" cy="24" r="12" />
      <path d="M32 10v28M24 18h16M24 30h16" />
      <path d="M30 24c0-2 1-4 2-4s2 2 2 4-1 4-2 4-2-2-2-4z" />
    </svg>
  );
}
const WHY_ICONS = [<ClockDollarIcon key="1" />, <ShieldDocsIcon key="2" />, <HandPhoneIcon key="3" />, <HandCoinIcon key="4" />];

function WhyGridCell({
  item,
  index,
  isOpen,
  onToggle,
  IconComponent,
  showBottomBorder,
}: {
  item: WhyListItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  IconComponent: ReactNode;
  showBottomBorder: boolean;
}) {
  const iconUrl = item.icon?.url;
  const hasContent = item.list_heading || item.list_description;
  return (
    <div
      className={`relative flex flex-col p-[30px] text-left ${showBottomBorder ? "border-b border-white/30" : ""}`}
    >
      <div className="flex items-start gap-6 md:gap-8">
        <div className="flex-shrink-0">
          {iconUrl ? (
            <Image
              src={iconUrl}
              alt={item.icon?.alt || item.list_heading || ""}
              width={64}
              height={64}
              className="h-16 w-16 object-contain lg:h-20 lg:w-20"
              unoptimized={
                iconUrl.includes("quicklyn-headless.local") || iconUrl.includes("quick.rootholdings")
              }
            />
          ) : (
            IconComponent
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-[29px] font-normal leading-snug text-white">
            {item.list_heading}
          </h3>
          {hasContent && (
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 text-[16px] font-normal text-white/80 underline underline-offset-2 transition hover:text-white"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={`why-desc-${index}`}
              id={`why-trigger-${index}`}
            >
              Read More
              <svg
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {item.list_description && (
        <div
          id={`why-desc-${index}`}
          role="region"
          aria-labelledby={`why-trigger-${index}`}
          className={`grid transition-all duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-4 border-t border-white/20 pt-4 text-[14px] leading-relaxed text-white/90 md:text-[15px]">
              {item.list_description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface WhyQuicklynSectionProps {
  heading?: string;
  items?: WhyListItem[];
}

export function WhyQuicklynSection({ heading = "Why Quicklyn?", items = [] }: WhyQuicklynSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!items.length && !heading) return null;

  const gridItems = items.slice(0, 4);

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-8 md:py-20">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <h2 className="mt-10 mb-4 text-center text-[36px] font-semibold leading-tight text-white md:mb-16 md:text-[66px]">
          {heading}
        </h2>

        {/* Mobile: previous vertical list design */}
        <div className="mx-auto w-full max-w-[280px] space-y-3 rounded-2xl px-0 pt-5 pb-0 pr-5 md:hidden">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isOpen = expandedIndex === index;
            const iconUrl = item.icon?.url;
            const IconComponent = WHY_ICONS[index % WHY_ICONS.length];

            return (
              <div
                key={`mobile-${item.list_heading}-${index}`}
                className={`flex items-stretch gap-4 ${isOpen && !isLast ? "mb-9" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center rounded-full p-[20px] shadow-lg"
                    style={{ backgroundColor: "#348284" }}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={item.icon?.alt || item.list_heading || ""}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                        unoptimized={
                          iconUrl.includes("quicklyn-headless.local") ||
                          iconUrl.includes("quick.rootholdings")
                        }
                      />
                    ) : (
                      <div className="[&_svg]:h-12 [&_svg]:w-12">{IconComponent}</div>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className="mt-2 min-h-[40px] flex-1 w-px transition-all duration-300"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0 6px, rgba(255,255,255,0) 6px 12px)",
                      }}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[20px] font-normal leading-[25px] text-white">
                    {item.list_heading}
                  </p>
                  {!isOpen && (
                    <button
                      type="button"
                      className="mt-1 text-[13px] font-normal text-white/60 underline-offset-2 hover:underline"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                    >
                      Learn More...
                    </button>
                  )}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "mt-2 max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    {item.list_description && (
                      <p className="text-[14px] leading-relaxed text-white/80">
                        {item.list_description}
                      </p>
                    )}
                    {isOpen && (
                      <button
                        type="button"
                        className="mt-2 text-[13px] font-normal text-white/60 underline-offset-2 hover:underline"
                        onClick={() => setExpandedIndex(null)}
                      >
                        See less
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop & tablet: 2 columns - only expanding column grows, right stays fixed */}
        <div className="hidden md:flex w-full overflow-hidden rounded-2xl">
          {/* Left column - grows when cells expand */}
          <div className="flex flex-1 flex-col">
            {gridItems.filter((_, i) => i % 2 === 0).map((item, colIndex) => {
              const index = colIndex * 2;
              return (
                <WhyGridCell
                  key={`left-${index}`}
                  item={item}
                  index={index}
                  isOpen={expandedIndex === index}
                  onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  IconComponent={WHY_ICONS[index % WHY_ICONS.length]}
                  showBottomBorder={index < 2}
                />
              );
            })}
          </div>
          <div className="w-px flex-shrink-0 bg-white/30 self-stretch" aria-hidden />
          {/* Right column - fixed position, doesn't move when left expands */}
          <div className="flex flex-1 flex-col self-start">
            {gridItems.filter((_, i) => i % 2 === 1).map((item, colIndex) => {
              const index = colIndex * 2 + 1;
              return (
                <WhyGridCell
                  key={`right-${index}`}
                  item={item}
                  index={index}
                  isOpen={expandedIndex === index}
                  onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  IconComponent={WHY_ICONS[index % WHY_ICONS.length]}
                  showBottomBorder={index < 2}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
