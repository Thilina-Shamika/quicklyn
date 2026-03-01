"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Image from "next/image";

interface AboutUsDesktopSectionProps {
  heading: string;
  headerLogoUrl: string | undefined;
  descriptionParagraphs: string[];
  features: { title: string; iconUrl?: string }[];
}

export function AboutUsDesktopSection({
  heading,
  headerLogoUrl,
  descriptionParagraphs,
  features,
}: AboutUsDesktopSectionProps) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), 100);
    return () => clearTimeout(t);
  }, []);

  const isLocal =
    headerLogoUrl &&
    (headerLogoUrl.includes("quicklyn-headless.local") ||
      headerLogoUrl.includes("quick.rootholdings"));

  return (
    <section className="mx-auto max-w-[1180px] overflow-visible px-6 pb-16 pt-[200px] lg:px-8 lg:pb-20 lg:pt-[200px]">
      {/* Centered title and logo */}
      <header className="overflow-visible text-center">
        <h1
          className={`font-medium tracking-wide text-white transition-all duration-700 ease-out ${
            active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ fontSize: "clamp(28px,3vw,36px)" }}
        >
          {heading}
        </h1>
        <div className="relative z-[100] mt-2 flex justify-center overflow-visible">
          <div
            className={`origin-center transition-all duration-700 ease-out ${
              active ? "scale-100 opacity-100" : "scale-[8] opacity-0"
            }`}
          >
            {headerLogoUrl ? (
              <Image
                src={headerLogoUrl}
                alt="Quicklyn"
                width={360}
                height={100}
                className="h-24 w-auto object-contain lg:h-28"
                unoptimized={!!isLocal}
              />
            ) : (
              <span
                className="font-semibold text-white"
                style={{ fontSize: "clamp(56px,8vw,80px)", lineHeight: 1.1 }}
              >
                Quicklyn
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Two columns: intro text left, features right */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-0">
        <div className="space-y-6 lg:pr-12 lg:border-r lg:border-white/30">
          {descriptionParagraphs.map((p, i) => (
            <p
              key={i}
              className="text-left text-white/95"
              style={{ fontSize: "18px", lineHeight: "28px" }}
            >
              {p}
            </p>
          ))}
        </div>

        <div className="flex flex-col justify-center space-y-8 lg:pl-12">
          {features.map((item, index) => {
            const words = item.title.trim().split(/\s+/).filter(Boolean);
            const mid = Math.ceil(words.length / 2) || 1;
            const line1 = words.slice(0, mid).join(" ");
            const line2 = words.slice(mid).join(" ");
            return (
              <div key={index} className="flex items-start gap-4">
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 object-contain lg:h-16 lg:w-16"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-white/10 text-white/80 lg:h-16 lg:w-16"
                    aria-hidden
                  >
                    •
                  </span>
                )}
                <span
                  className="font-normal leading-[30px] text-white"
                  style={{ fontSize: "23px", lineHeight: "30px" }}
                >
                  {line1}
                  {line2 ? (
                    <>
                      <br />
                      {line2}
                    </>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
