"use client";

import { useEffect, useState } from "react";

const TRANSITION_DURATION_MS = 400;

interface HeroBackgroundProps {
  heroImageUrl: string;
}

export function HeroBackground({ heroImageUrl }: HeroBackgroundProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setScrolled(true), 150);
    return () => clearTimeout(t);
  }, []);

  const transition = `transform ${TRANSITION_DURATION_MS}ms ease-out, opacity ${TRANSITION_DURATION_MS}ms ease-out`;

  return (
    <>
      <div
        className="absolute left-0 right-0 top-0 z-0 flex justify-center"
        style={{
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "scale(1)" : "scale(0.85)",
          transition,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImageUrl}
          alt=""
          className="max-h-full max-w-full w-auto h-auto object-contain object-top"
          aria-hidden
        />
      </div>
    </>
  );
}
