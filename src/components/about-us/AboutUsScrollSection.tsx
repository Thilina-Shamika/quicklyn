"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TRANSITION_MS = 400;
const SCROLL_THRESHOLD = 50;

function FeatureRow({ title, iconUrl }: { title: string; iconUrl?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-5">
      {iconUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={iconUrl}
          alt=""
          className="h-12 w-12 shrink-0 object-contain"
          aria-hidden
        />
      ) : null}
      <span
        className="text-center font-medium text-white"
        style={{ fontSize: "19px" }}
      >
        {title}
      </span>
    </div>
  );
}

interface AboutUsScrollSectionProps {
  heading: string;
  headerLogoUrl: string | undefined;
  descriptionParagraphs: string[];
  features: { title: string; iconUrl?: string }[];
}

export function AboutUsScrollSection({
  heading,
  headerLogoUrl,
  descriptionParagraphs,
  features,
}: AboutUsScrollSectionProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transition = `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`;

  const headerOpacity = scrolled ? 1 : 0.15;
  const headerTransform = scrolled ? "translateY(-40px)" : "translateY(0)";

  const descOpacity = scrolled ? 1 : 0.15;
  const descTransform = scrolled ? "translateY(-40px)" : "translateY(0)";

  const featuresOpacity = scrolled ? 1 : 0;
  const featuresTransform = scrolled ? "translateY(-12px)" : "translateY(0)";
  const featuresVisible = scrolled;

  return (
    <>
      {/* Header: heading + logo — high transparency until scroll, then full opacity + move up */}
      <header
        className="mt-[60px] text-center"
        style={{
          opacity: headerOpacity,
          transform: headerTransform,
          transition,
        }}
      >
        <h1
          className="font-medium tracking-wide text-white"
          style={{ fontSize: "33px" }}
        >
          {heading}
        </h1>
        <div className="flex justify-center">
          {headerLogoUrl ? (
            <Image
              src={headerLogoUrl}
              alt="Quicklyn"
              width={200}
              height={56}
              className="h-14 w-auto object-contain md:h-16"
              unoptimized={
                headerLogoUrl.includes("quicklyn-headless.local") ||
                headerLogoUrl.includes("quick.rootholdings")
              }
            />
          ) : (
            <span className="text-4xl font-medium lowercase text-white md:text-5xl">
              Quicklyn
            </span>
          )}
        </div>
      </header>

      {/* Description — same behavior as header */}
      {descriptionParagraphs.length > 0 && (
        <div
          className="mt-10 space-y-4 text-center text-white/95"
          style={{
            opacity: descOpacity,
            transform: descTransform,
            transition,
          }}
        >
          {descriptionParagraphs.map((p, i) => (
            <p
              key={i}
              className="text-center text-white/95"
              style={{ fontSize: "12px", lineHeight: "19px" }}
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Features — hidden until scroll, then visible with slight move up */}
      {features.length > 0 && (
        <div
          className="mt-14"
          style={{
            opacity: featuresOpacity,
            transform: featuresTransform,
            transition,
            visibility: featuresVisible ? "visible" : "hidden",
          }}
        >
          {features.map((item, index) => (
            <div key={index}>
              {index > 0 && (
                <div
                  className="border-t border-dashed border-white/30"
                  aria-hidden
                />
              )}
              <FeatureRow title={item.title} iconUrl={item.iconUrl} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
