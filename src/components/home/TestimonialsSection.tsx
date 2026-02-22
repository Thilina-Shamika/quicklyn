"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import type { WPTestimonial } from "@/lib/wordpress";

interface TestimonialsSectionProps {
  testimonials: WPTestimonial[];
  /** When true, section has no background (e.g. on Our Mission so page background shows). Default false = use teal section background (e.g. home). */
  transparentBackground?: boolean;
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="mb-3 flex justify-center gap-0.5" aria-hidden>
      {Array.from({ length: Math.min(5, Math.max(0, count)) }).map((_, i) => (
        <span key={i} className="text-[#FFDA00]" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
    </svg>
  );
}

export function TestimonialsSection({ testimonials, transparentBackground }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = testimonials.length;
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    const threshold = 20;
    if (deltaX > threshold) {
      isDraggingRef.current = false;
      goPrev();
    } else if (deltaX < -threshold) {
      isDraggingRef.current = false;
      goNext();
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      (event.currentTarget as HTMLDivElement).releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // ignore
    }
    isDraggingRef.current = false;
  };

  // iOS: attach touch to carousel element + touch-action: none so Safari gives us the gesture. preventDefault on first touchmove.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const SWIPE_THRESHOLD = 35;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDraggingRef.current = true;
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current || !e.changedTouches?.length) {
        isDraggingRef.current = false;
        return;
      }
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - touchStartXRef.current;
      if (deltaX > SWIPE_THRESHOLD) goPrev();
      else if (deltaX < -SWIPE_THRESHOLD) goNext();
      isDraggingRef.current = false;
    };

    const opts: AddEventListenerOptions = { capture: true, passive: false };
    el.addEventListener("touchstart", onTouchStart, opts);
    el.addEventListener("touchmove", onTouchMove, opts);
    el.addEventListener("touchend", onTouchEnd, opts);
    el.addEventListener("touchcancel", onTouchEnd, opts);

    return () => {
      el.removeEventListener("touchstart", onTouchStart, opts);
      el.removeEventListener("touchmove", onTouchMove, opts);
      el.removeEventListener("touchend", onTouchEnd, opts);
      el.removeEventListener("touchcancel", onTouchEnd, opts);
    };
  }, [goPrev, goNext]);

  if (!count) return null;

  return (
    <section className={`relative w-full overflow-hidden pb-8 pt-16 ${transparentBackground ? "" : "bg-[#226d71]"}`}>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <h2 className="mb-10 ml-[23px] text-left text-[31px] font-semibold leading-tight text-white">
          Trusted by Our Community
        </h2>

        {/* Full-width carousel: no side gaps */}
        <div className="-ml-[calc((100vw-100%)/2)] w-screen">
          <div
            ref={carouselRef}
            className="relative mx-auto h-[420px] w-full overflow-hidden cursor-grab select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              touchAction: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
              WebkitTouchCallout: "none",
            }}
          >
          {testimonials.map((item, index) => {
            let offset = (index - currentIndex + count) % count;
            if (offset > count / 2) offset -= count;
            const isVisible = offset >= -1 && offset <= 1;
            if (!isVisible) return null;

            const isCenter = offset === 0;
            const translateX = offset * 180;
            const scale = isCenter ? 1 : 0.88;
            const rotate = isCenter ? 0 : offset * 8;
            const opacity = isCenter ? 1 : 0.45;
            const zIndex = isCenter ? 10 : 1;

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[70%] max-w-[280px] select-none rounded-[32px] border border-[#89b0b1] bg-[#1a5d5f] px-6 py-6 shadow-lg transition-all duration-300 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                  opacity,
                  zIndex,
                }}
              >
                <QuoteIcon className="absolute left-4 top-4 h-6 w-6 text-white/80" />
                <QuoteIcon className="absolute bottom-4 right-4 h-6 w-6 rotate-180 text-white/80" />

                <div className="relative pt-2 text-center">
                  <StarRating count={parseInt(item.acf?.stars || "5", 10)} />
                  <p className="mb-4 min-h-[100px] text-[14px] leading-relaxed text-white">
                    {item.acf?.testimonial?.trim() || item.title.rendered}
                  </p>
                  <p className="text-[14px] font-medium text-white">
                    {item.acf?.name?.trim() || item.title.rendered}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Navigation arrows */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition hover:bg-white/10"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition hover:bg-white/10"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
