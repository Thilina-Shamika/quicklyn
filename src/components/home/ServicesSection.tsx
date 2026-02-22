"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import type { CounterItem, WPImage, WhyListItem } from "@/types/wordpress";
import type { WPService } from "@/lib/wordpress";

interface ServicesSectionProps {
  background?: WPImage;
  counters?: CounterItem[];
  services: WPService[];
  sectionHeading?: string;
  whyList?: WhyListItem[];
}

export function ServicesSection({
  background,
  counters = [],
  services,
  sectionHeading,
  whyList = [],
}: ServicesSectionProps) {
  const bgUrl = background?.url;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollOffsetPx, setScrollOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollOffsetRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartScrollRef = useRef(0);
  const touchIdRef = useRef<number | null>(null);
  const gestureDirectionRef = useRef<"horizontal" | "vertical" | null>(null);
  const maxScrollRef = useRef(0);
  const [openWhyIndex, setOpenWhyIndex] = useState<number | null>(null);

  const gap = 20;

  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const pointerDownRef = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    pointerDownRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = scrollOffsetRef.current;
    maxScrollRef.current = Math.max(0, track.scrollWidth - viewport.offsetWidth);
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    event.preventDefault();
    const dx = event.clientX - dragStartXRef.current;
    const next = Math.max(0, Math.min(maxScrollRef.current, dragStartScrollRef.current - dx));
    scrollOffsetRef.current = next;
    track.style.transform = `translateX(-${next}px)`;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerDownRef.current = false;
    const track = trackRef.current;
    if (track) {
      try {
        track.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    }
    snapToNearest();
  };

  function scrollOffsetForIndex(index: number, cardWidth: number) {
    return index === 0 ? 0 : 20 + index * (cardWidth + gap);
  }
  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return;
    const cardWidth = first.offsetWidth;
    const current = scrollOffsetRef.current;
    const nearestIndex =
      current < 20 + (cardWidth + gap) / 2
        ? 0
        : Math.max(
            0,
            Math.min(
              services.length - 1,
              Math.round((current - 20) / (cardWidth + gap)),
            ),
          );
    const snapped = scrollOffsetForIndex(nearestIndex, cardWidth);
    scrollOffsetRef.current = snapped;
    setScrollOffsetPx(snapped);
    setActiveIndex(nearestIndex);
  }, [services.length]);

  useEffect(() => {
    scrollOffsetRef.current = scrollOffsetPx;
  }, [scrollOffsetPx]);

  // Document-level touch + direction lock (same as testimonials) so iOS swipe works. No native scroll — we use transform.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const DIRECTION_THRESHOLD = 8;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (!viewport.contains(touch.target as Node)) return;
      touchIdRef.current = touch.identifier;
      gestureDirectionRef.current = null;
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      touchStartScrollRef.current = scrollOffsetRef.current;
      maxScrollRef.current = Math.max(
        0,
        track.scrollWidth - viewport.offsetWidth,
      );
      setIsDragging(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      const t = Array.from(e.touches).find((x) => x.identifier === touchIdRef.current);
      if (!t) return;
      const dx = t.clientX - touchStartXRef.current;
      const dy = t.clientY - touchStartYRef.current;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (gestureDirectionRef.current === null && (adx > DIRECTION_THRESHOLD || ady > DIRECTION_THRESHOLD)) {
        gestureDirectionRef.current = adx >= ady ? "horizontal" : "vertical";
      }
      if (gestureDirectionRef.current === "horizontal") {
        e.preventDefault();
        const next = Math.max(
          0,
          Math.min(maxScrollRef.current, touchStartScrollRef.current - dx),
        );
        scrollOffsetRef.current = next;
        track.style.transform = `translateX(-${next}px)`;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const ct = e.changedTouches?.[0];
      if (!ct || ct.identifier !== touchIdRef.current) {
        touchIdRef.current = null;
        gestureDirectionRef.current = null;
        setIsDragging(false);
        return;
      }
      if (gestureDirectionRef.current === "horizontal") {
        snapToNearest();
      }
      touchIdRef.current = null;
      gestureDirectionRef.current = null;
      setIsDragging(false);
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
  }, [snapToNearest]);

  return (
    <section className="relative z-20 -mt-[60px] w-full overflow-hidden bg-transparent pb-16 pt-[100px]">
      {/* Background texture for section 2 */}
      {bgUrl && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={bgUrl}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "center top" }}
            sizes="100vw"
            priority={false}
            unoptimized={
            bgUrl.includes("quicklyn-headless.local") ||
            bgUrl.includes("quick.rootholdings")
          }
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex w-full flex-col items-center px-6 text-center">
        {/* Counters stacked vertically with line between rows */}
        <div className="mx-auto mb-10 flex w-full max-w-[240px] flex-col gap-4 px-0 text-left">
          {(counters ?? []).map((item, index) => (
            <div key={`${item.counter_text}-${index}`} className="w-full">
              {index > 0 && (
                <div className="my-4 h-px w-full bg-white/25" aria-hidden />
              )}
              <div className="hero-text-shadow flex w-full items-center justify-between gap-4">
                <div
                  className="flex items-baseline gap-1 text-[52px] md:text-[64px] leading-none text-white"
                  style={{ fontWeight: 200 }}
                >
                  <span style={{ fontWeight: 200 }}>{item.counter_number}</span>
                  <span style={{ fontWeight: 200 }}>{item.counter_suffix}</span>
                </div>
                <div className="max-w-[55%] text-left text-[18px] md:text-[22px] font-normal leading-snug text-white">
                  {item.counter_text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section heading (two lines: Our / Services) */}
        <h2 className="mt-10 mb-[30px] text-[68px] font-medium leading-[58px] text-white">
          <span className="block">Our</span>
          <span className="block">Services</span>
        </h2>

        {/* Services cards carousel — viewport + transform (no native scroll) so iOS swipe works with document-level touch */}
        <div
          ref={viewportRef}
          className="mt-[10px] overflow-hidden cursor-grab"
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex w-screen -ml-[calc((100vw-100%)/2)] -mr-6 pl-6 pr-6 pb-2 pt-1"
            style={{
              columnGap: gap,
              transform: `translateX(-${scrollOffsetPx}px)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
          >
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group relative my-[20px] flex-shrink-0 select-none overflow-visible rounded-2xl bg-[#175c5e] p-6 text-left text-white transition-transform hover:-translate-y-1"
              style={{
                minWidth: "61%",
                maxWidth: "53%",
                minHeight: "180px",
                marginLeft: index === 0 ? "20px" : undefined,
              }}
            >
              <Link
                href={`/our-services#service-${service.slug}`}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFDA00] p-0 text-[#1B5B5D] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 16L16 8" />
                  <path d="M9 8H16V15" />
                </svg>
              </Link>

              <div className="mb-3 pr-10">
                <h3 className="text-[18px] font-semibold">
                  {service.acf?.service_heading || service.title.rendered}
                </h3>
              </div>

              <p className="mb-3 line-clamp-3 text-[10px] leading-relaxed text-white/80">
                {service.acf?.service_description}
              </p>
            </article>
          ))}
          {services.length > 1 && (
            <div
              className="flex-shrink-0"
              style={{ minWidth: "45vw" }}
              aria-hidden
            />
          )}
          </div>
        </div>

        {/* Carousel bullets + Learn more link */}
        {services.length > 1 && (
          <div className="mt-4 flex w-full items-center justify-between px-6">
            <div className="flex items-center gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    index === activeIndex ? "bg-white" : "bg-white/30"
                  }`}
                  onClick={() => {
                    const track = trackRef.current;
                    const first = track?.children[0] as HTMLElement | undefined;
                    if (track && first) {
                      const cardWidth = first.offsetWidth;
                      const snapped = scrollOffsetForIndex(index, cardWidth);
                      scrollOffsetRef.current = snapped;
                      setScrollOffsetPx(snapped);
                    }
                    setActiveIndex(index);
                  }}
                />
              ))}
            </div>

            {/* Learn more text + arrow, aligned right */}
            <Link
              href="/our-services"
              className="flex items-center gap-2 text-base font-medium text-white"
            >
              <span>Learn more</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 16L16 8" />
                <path d="M9 8H16V15" />
              </svg>
            </Link>
          </div>
        )}

        {/* Why Quicklyn list (3rd section content) */}
        {(sectionHeading || whyList.length > 0) && (
          <div className="mt-16 w-full px-6">
            {sectionHeading && (
<h2 className="mb-8 text-center text-[36px] font-semibold leading-snug text-white">
              {sectionHeading}
            </h2>
            )}

            <div className="mx-auto w-full max-w-sm space-y-3">
              {whyList.map((item, index) => {
                const isLast = index === whyList.length - 1;
                const isOpen = openWhyIndex === index;
                const iconUrl = item.icon?.url;

                return (
                  <div key={`${item.list_heading}-${index}`} className="flex items-stretch gap-4">
                    {/* Icon + connecting line */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center rounded-full p-[20px] shadow-lg" style={{ backgroundColor: "#348284" }}>
                        {iconUrl && (
                          <Image
                            src={iconUrl}
                            alt={item.icon?.alt || item.list_heading}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                            unoptimized={
                            iconUrl.includes("quicklyn-headless.local") ||
                            iconUrl.includes("quick.rootholdings")
                          }
                          />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="mt-2 min-h-[40px] flex-1 w-0 border-l-2 border-dashed border-white transition-all duration-300"
                          aria-hidden
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-left">
                      <p className="text-[21px] font-normal leading-snug text-white">
                        {item.list_heading}
                      </p>
                      <button
                        type="button"
                        className="mt-1 text-[13px] font-normal text-white/60 underline-offset-2 hover:underline"
                        onClick={() =>
                          setOpenWhyIndex(isOpen ? null : index)
                        }
                      >
                        Learn More...
                      </button>
                      {item.list_description && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                          }`}
                          aria-hidden={!isOpen}
                        >
                          <p className="text-[14px] leading-relaxed text-white/80">
                            {item.list_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

