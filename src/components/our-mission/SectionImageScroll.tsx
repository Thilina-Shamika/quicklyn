"use client";

import { useEffect, useRef, useState } from "react";
import { SectionImageSlider } from "./SectionImageSlider";

const TRANSITION_DURATION_MS = 600;
const INITIAL_SCALE = 2.2;

interface SectionImageScrollProps {
  /** When provided, shows image slider with fade (desktop + mobile). */
  sectionImages?: { url: string; alt?: string }[];
  /** Fallback single image when sectionImages is empty (e.g. legacy section_image). */
  sectionImageUrl?: string;
}

export function SectionImageScroll({
  sectionImages = [],
  sectionImageUrl,
}: SectionImageScrollProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isIntersectingRef = useRef(false);
  const images = sectionImages.length > 0 ? sectionImages : sectionImageUrl ? [{ url: sectionImageUrl, alt: "" }] : [];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const SCROLL_THRESHOLD = 150;

    const checkTrigger = () => {
      const scrolledEnough = window.scrollY > SCROLL_THRESHOLD;
      if (scrolledEnough && isIntersectingRef.current) {
        setInView(true);
      } else if (!scrolledEnough || !isIntersectingRef.current) {
        setInView(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        const scrolledEnough = window.scrollY > SCROLL_THRESHOLD;
        if (entry.isIntersecting && scrolledEnough) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(el);
    window.addEventListener("scroll", checkTrigger, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkTrigger);
    };
  }, []);

  const transition = `transform ${TRANSITION_DURATION_MS}ms ease-out, opacity ${TRANSITION_DURATION_MS}ms ease-out`;

  if (images.length === 0) return null;

  return (
    <section className="relative z-10 overflow-visible px-6 pt-0 pb-12 md:pb-16">
      <div
        ref={ref}
        className="relative mx-auto max-w-2xl my-6 md:my-8 overflow-visible rounded-2xl"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : `scale(${INITIAL_SCALE})`,
          transformOrigin: "center center",
          transition,
        }}
      >
        <SectionImageSlider
          images={images}
          imgClassName="w-full object-cover"
        />
      </div>
    </section>
  );
}
