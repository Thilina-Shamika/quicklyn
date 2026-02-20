"use client";

import Image from "next/image";
import type { WhyListItem } from "@/types/wordpress";

interface WhyQuicklynSectionProps {
  heading?: string;
  items?: WhyListItem[];
}

export function WhyQuicklynSection({ heading, items = [] }: WhyQuicklynSectionProps) {
  if (!items.length && !heading) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0b3b3c] py-16">
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 text-center">
        {heading && (
          <h2 className="hero-text-shadow mb-10 text-[28px] font-semibold leading-tight text-white">
            {heading}
          </h2>
        )}

        <div className="w-full space-y-6">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const iconUrl = item.icon?.url;

            return (
              <div key={`${item.list_heading}-${index}`} className="flex items-start gap-4">
                {/* Icon + connecting line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full p-[20px] shadow-lg" style={{ backgroundColor: "#348284" }}>
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt={item.icon?.alt || item.list_heading}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                        unoptimized={
                          iconUrl.includes("quicklyn-headless.local") ||
                          iconUrl.includes("quick.rootholdings")
                        }
                      />
                    )}
                  </div>
                  {!isLast && <div className="mt-2 h-12 w-px bg-white/20" aria-hidden />}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="hero-text-shadow text-[21px] font-normal leading-snug text-white">
                    {item.list_heading}
                  </p>
                  <p className="mt-1 text-[12px] font-normal text-white/60">Learn More...</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

