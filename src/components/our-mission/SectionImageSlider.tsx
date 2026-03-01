"use client";

import { useEffect, useState } from "react";

const FADE_DURATION_MS = 800;
const SLIDE_INTERVAL_MS = 5000;

interface SectionImageSliderProps {
  /** List of images (from section_image_slide). When length > 1, shows fading slider. */
  images: { url: string; alt?: string }[];
  className?: string;
  imgClassName?: string;
}

export function SectionImageSlider({
  images,
  className = "",
  imgClassName = "",
}: SectionImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0].url}
          alt={images[0].alt ?? ""}
          className={`w-full object-cover rounded-2xl ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${className}`}
    >
      {images.map((img, i) => (
        <div
          key={img.url + i}
          className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
          aria-hidden={i !== activeIndex}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt ?? ""}
            className={`h-full w-full object-cover rounded-2xl ${imgClassName}`}
          />
        </div>
      ))}
    </div>
  );
}
