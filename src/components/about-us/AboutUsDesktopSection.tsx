"use client";

/* eslint-disable @next/next/no-img-element */

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
  const isLocal =
    headerLogoUrl &&
    (headerLogoUrl.includes("quicklyn-headless.local") ||
      headerLogoUrl.includes("quick.rootholdings"));

  return (
    <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-[200px] lg:px-8 lg:pb-20 lg:pt-[200px]">
      {/* Centered title and logo */}
      <header className="text-center">
        <h1
          className="font-medium tracking-wide text-white"
          style={{ fontSize: "clamp(28px,3vw,36px)" }}
        >
          {heading}
        </h1>
        <div className="mt-2 flex justify-center">
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
          {features.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {item.iconUrl ? (
                <img
                  src={item.iconUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 object-contain"
                  aria-hidden
                />
              ) : (
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-white/10 text-white/80"
                  aria-hidden
                >
                  •
                </span>
              )}
              <span
                className="font-medium text-white"
                style={{ fontSize: "20px", lineHeight: "28px" }}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
