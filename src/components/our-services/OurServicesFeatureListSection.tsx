"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeatureListItem, WPImage } from "@/types/wordpress";

interface OurServicesFeatureListSectionProps {
  features: FeatureListItem[];
  backgroundImage?: WPImage;
}

export function OurServicesFeatureListSection({
  features,
  backgroundImage,
}: OurServicesFeatureListSectionProps) {
  if (!features || features.length === 0) return null;

  const validFeatures = features.filter(
    (item) => item && item.feature_name?.trim().length,
  );
  if (!validFeatures.length) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-[#2a7a7c] pb-16 pt-4 text-white px-8">
      {backgroundImage?.url && (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || "Features connector"}
            width={(backgroundImage.width || 141) * 1.8}
            height={(backgroundImage.height || 35) * 1.8}
            className="w-[320px] max-w-full object-contain opacity-95"
            unoptimized={backgroundImage.url.includes(
              "quick.rootholdings.com.mv",
            )}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className={`relative z-10 mx-auto flex max-w-md flex-col items-center gap-8 transform transition-all duration-500 ease-out ${
          isInView
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-75 translate-y-6 opacity-80"
        }`}
      >
        {validFeatures.map((item, index) => {
          const icon = item.feature_icon;
          const isEven = index % 2 === 0;
          return (
            <div
              key={`${item.feature_name}-${index}`}
              className={`relative z-10 flex w-full items-center gap-4 ${
                isEven ? "justify-start" : "justify-end"
              }`}
            >
              {isEven ? (
                <>
                  <div className="flex h-[116px] w-[116px] flex-shrink-0 items-center justify-center rounded-full bg-[#2f8b8d] shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
                    {icon?.url && (
                      <Image
                        src={icon.url}
                        alt={icon.alt || item.feature_name}
                        width={icon.width || 72}
                        height={icon.height || 72}
                        className="h-18 w-18 object-contain"
                        unoptimized={icon.url.includes(
                          "quick.rootholdings.com.mv",
                        )}
                      />
                    )}
                  </div>
                  <p className="max-w-[180px] text-left text-[19px] font-normal leading-snug">
                    {item.feature_name}
                  </p>
                </>
              ) : (
                <>
                  <p className="max-w-[180px] text-right text-[19px] font-normal leading-snug">
                    {item.feature_name}
                  </p>
                  <div className="flex h-[116px] w-[116px] flex-shrink-0 items-center justify-center rounded-full bg-[#2f8b8d] shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
                    {icon?.url && (
                      <Image
                        src={icon.url}
                        alt={icon.alt || item.feature_name}
                        width={icon.width || 72}
                        height={icon.height || 72}
                        className="h-18 w-18 object-contain"
                        unoptimized={icon.url.includes(
                          "quick.rootholdings.com.mv",
                        )}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

