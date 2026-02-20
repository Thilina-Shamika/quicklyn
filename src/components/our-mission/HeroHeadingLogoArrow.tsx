"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const TRANSITION_DURATION_MS = 400;

interface HeroHeadingLogoArrowProps {
  heading: string;
  headerLogoUrl: string | undefined;
}

export function HeroHeadingLogoArrow({
  heading,
  headerLogoUrl,
}: HeroHeadingLogoArrowProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transition = `transform ${TRANSITION_DURATION_MS}ms ease-out, opacity ${TRANSITION_DURATION_MS}ms ease-out, margin-top ${TRANSITION_DURATION_MS}ms ease-out`;

  return (
    <>
      <h1
        className="mt-28 text-center font-normal tracking-wide md:mt-36"
        style={{
          fontSize: "36px",
          lineHeight: "1.2",
          opacity: scrolled ? 1 : 0.25,
          transform: scrolled ? "translateY(-32px)" : "translateY(0)",
          transition,
        }}
      >
        {heading}
      </h1>

      <div
        style={{
          opacity: scrolled ? 1 : 0.25,
          transform: scrolled ? "translateY(-32px)" : "translateY(0)",
          transition,
        }}
      >
        {headerLogoUrl ? (
          <Image
            src={headerLogoUrl}
            alt="Quicklyn"
            width={180}
            height={48}
            className="h-12 w-auto object-contain md:h-16"
            unoptimized={
                headerLogoUrl.includes("quicklyn-headless.local") ||
                headerLogoUrl.includes("quick.rootholdings")
              }
          />
        ) : (
          <span className="text-3xl font-medium lowercase text-white md:text-4xl">
            Quicklyn
          </span>
        )}
      </div>

      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/4 md:h-14 md:w-14"
        style={{
          opacity: scrolled ? 1 : 0.2,
          marginTop: scrolled ? "0.5rem" : "-3.75rem",
          transition,
        }}
        aria-hidden
      >
        <ChevronDownIcon className="h-6 w-6 text-white md:h-7 md:w-7" />
      </div>
    </>
  );
}
