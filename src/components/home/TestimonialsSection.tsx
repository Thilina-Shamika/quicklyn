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
  const touchIdRef = useRef<number | null>(null);
  const gestureDirectionRef = useRef<"horizontal" | "vertical" | null>(null);
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

  // iOS: document-level touch + direction lock so swipe ON the card works: horizontal = carousel, vertical = page scroll.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const DIRECTION_THRESHOLD = 8;
    const SWIPE_THRESHOLD = 40;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const target = touch.target as Node;
      if (!el.contains(target)) return;
      isDraggingRef.current = true;
      touchIdRef.current = touch.identifier;
      gestureDirectionRef.current = null;
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || touchIdRef.current === null) return;
      const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current);
      if (!touch) return;
      const dx = touch.clientX - touchStartXRef.current;
      const dy = touch.clientY - touchStartYRef.current;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (gestureDirectionRef.current === null && (adx > DIRECTION_THRESHOLD || ady > DIRECTION_THRESHOLD)) {
        gestureDirectionRef.current = adx >= ady ? "horizontal" : "vertical";
      }
      if (gestureDirectionRef.current === "horizontal") {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const ct = e.changedTouches?.[0];
      if (!ct || ct.identifier !== touchIdRef.current) {
        isDraggingRef.current = false;
        touchIdRef.current = null;
        gestureDirectionRef.current = null;
        return;
      }
      if (gestureDirectionRef.current === "horizontal") {
        const deltaX = ct.clientX - touchStartXRef.current;
        if (deltaX > SWIPE_THRESHOLD) goPrev();
        else if (deltaX < -SWIPE_THRESHOLD) goNext();
      }
      isDraggingRef.current = false;
      touchIdRef.current = null;
      gestureDirectionRef.current = null;
    };

    const capture = true;
    const passiveFalse: AddEventListenerOptions = { capture, passive: false };
    document.addEventListener("touchstart", onTouchStart, capture);
    document.addEventListener("touchmove", onTouchMove, passiveFalse);
    document.addEventListener("touchend", onTouchEnd, capture);
    document.addEventListener("touchcancel", onTouchEnd, capture);

    return () => {
      document.removeEventListener("touchstart", onTouchStart, capture);
      document.removeEventListener("touchmove", onTouchMove, passiveFalse);
      document.removeEventListener("touchend", onTouchEnd, capture);
      document.removeEventListener("touchcancel", onTouchEnd, capture);
    };
  }, [goPrev, goNext]);

  if (!count) return null;

  return (
    <section className={`relative w-full overflow-hidden pb-8 pt-16 ${transparentBackground ? "" : "bg-[#226d71]"}`}>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-10 ml-[23px] text-left text-[31px] font-semibold leading-tight text-white md:hidden">
          Trusted by Our Community
        </h2>

        {/* Desktop / Tablet testimonials */}
        <div className="hidden md:block">
          <h2 className="mx-auto mb-8 max-w-md text-center text-[32px] font-semibold leading-[1.05] text-white lg:mb-10 lg:text-[44px]">
            Trusted by
            <br />
            Our Community
          </h2>

          <div className="relative mx-auto h-[420px] w-full max-w-[1180px] overflow-visible lg:h-[520px]">
            <div className="pointer-events-none absolute inset-x-0 top-[68px] hidden h-px bg-white/35 lg:top-[78px]" />
            {testimonials.map((item, index) => {
              let offset = (index - currentIndex + count) % count;
              if (offset > count / 2) offset -= count;
              const isVisible = offset >= -2 && offset <= 2;
              if (!isVisible) return null;

              const isCenter = offset === 0;
              const translateX =
                offset === 0 ? 0 : offset === -1 ? -320 : offset === 1 ? 320 : offset === -2 ? -620 : 620;
              const translateY =
                offset === 0 ? 8 : offset === -1 || offset === 1 ? 42 : 145;
              const scale = isCenter ? 1 : offset === -1 || offset === 1 ? 0.92 : 0.82;
              const rotate =
                offset === 0 ? 0 : offset === -1 ? -14 : offset === 1 ? 14 : offset === -2 ? -28 : 28;
              const opacity = isCenter ? 1 : offset === -1 || offset === 1 ? 0.92 : 0.55;
              const zIndex = isCenter ? 30 : offset === -1 || offset === 1 ? 20 : 10;
              const cardWidthClass = isCenter
                ? "w-[320px] lg:w-[380px]"
                : "w-[300px] lg:w-[360px]";
              const quoteScaleClass = isCenter ? "h-8 w-8" : "h-6 w-6";
              const contentPadding = isCenter ? "px-10 py-10 lg:px-12 lg:py-12" : "px-8 py-8 lg:px-10 lg:py-10";
              const cardClasses = isCenter
                ? "border-white/65 bg-[#185b5d]"
                : "border-white/50 bg-[#1b6668]/88";

              return (
                <div
                  key={item.id}
                  className={`absolute left-1/2 top-1/2 flex min-h-[320px] flex-col items-center justify-center rounded-[34px] border shadow-[0_14px_30px_rgba(0,0,0,0.12)] lg:min-h-[380px] lg:rounded-[38px] ${cardWidthClass} ${contentPadding} ${cardClasses}`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                    opacity,
                    zIndex,
                    transition: "transform 0.35s ease-out, opacity 0.35s ease-out",
                    willChange: "transform",
                  }}
                >
                  <QuoteIcon className={`absolute left-6 top-6 text-white/90 ${quoteScaleClass}`} />
                  <QuoteIcon className={`absolute bottom-6 right-6 rotate-180 text-white/90 ${quoteScaleClass}`} />

                  <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                    <StarRating count={parseInt(item.acf?.stars || "5", 10)} />
                    <p
                      className={`mx-auto mb-4 w-full max-w-full text-white/95 ${
                        isCenter
                          ? "text-[13px] leading-[1.6] lg:text-[15px]"
                          : "text-[12px] leading-[1.55] lg:text-[14px]"
                      }`}
                    >
                      {item.acf?.testimonial?.trim() || item.title.rendered}
                    </p>
                    <p className={`shrink-0 font-medium text-white/90 ${isCenter ? "text-[13px] lg:text-[14px]" : "text-[12px] lg:text-[13px]"}`}>
                      {item.acf?.name?.trim() || item.title.rendered}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 lg:mt-4 lg:gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white/90 transition hover:bg-white/10 lg:h-10 lg:w-10"
            >
              <svg
                className="h-4 w-4"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white/90 transition hover:bg-white/10 lg:h-10 lg:w-10"
            >
              <svg
                className="h-4 w-4"
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

        {/* Mobile layout (unchanged) */}
        <div className="md:hidden">
          <div className="-ml-[calc((100vw-100%)/2)] w-screen">
            <div
              ref={carouselRef}
              className="relative mx-auto h-[420px] w-full overflow-hidden cursor-grab select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                touchAction: "pan-y",
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
      </div>
    </section>
  );
}
