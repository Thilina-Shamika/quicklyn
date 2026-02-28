"use client";

import Image from "next/image";
import Link from "next/link";
import CountUp from "react-countup";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import type { CounterItem, WPImage, WhyListItem } from "@/types/wordpress";
import type { WPService } from "@/lib/wordpress";

interface ServicesSectionProps {
  background?: WPImage;
  backgroundDesktop?: WPImage;
  counters?: CounterItem[];
  services: WPService[];
  sectionHeading?: string;
  whyList?: WhyListItem[];
  whyIcon?: WPImage;
}

export function ServicesSection({
  background,
  backgroundDesktop,
  counters = [],
  services,
  sectionHeading,
  whyList = [],
  whyIcon,
}: ServicesSectionProps) {
  const bgUrl = background?.url;
  const bgDesktopUrl = backgroundDesktop?.url || bgUrl;
  const whyIconUrl = whyIcon?.url;
  const isSignatureService = (service: WPService) => {
    const normalizedId = String(service.acf?.id || service.slug || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return normalizedId === "signaturepro";
  };
  const findServiceByKeywords = (keywords: string[]) =>
    services.find((service) => {
      const text = (
        `${service.acf?.service_heading || ""} ${service.title?.rendered || ""}`
      ).toLowerCase();
      return keywords.every((kw) => text.includes(kw));
    });
  const orderedDesktopServices = (() => {
    const preferred = [
      findServiceByKeywords(["deep"]),
      findServiceByKeywords(["apartment"]),
      findServiceByKeywords(["move"]),
      findServiceByKeywords(["airbnb"]),
      findServiceByKeywords(["signature"]),
    ].filter(Boolean) as WPService[];
    const used = new Set(preferred.map((s) => s.id));
    const fill = services.filter((s) => !used.has(s.id)).slice(0, Math.max(0, 5 - preferred.length));
    return [...preferred, ...fill].slice(0, 5);
  })();
  const desktopCardSlots = [
    "leftTop",
    "topCenter",
    "rightTop",
    "leftBottom",
    "rightBottom",
  ] as const;
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
  const whyDesktopSectionRef = useRef<HTMLDivElement | null>(null);
  const whyDesktopViewportRef = useRef<HTMLDivElement | null>(null);
  const whyDesktopTrackRef = useRef<HTMLDivElement | null>(null);
  const [whyDesktopTranslateX, setWhyDesktopTranslateX] = useState(0);
  const [whyDesktopOuterHeight, setWhyDesktopOuterHeight] = useState<number | null>(null);
  const whyDesktopProgressRef = useRef(0);
  const whyDesktopMaxTranslateRef = useRef(0);
  const whyDesktopTouchYRef = useRef<number | null>(null);
  const whyDesktopLockActiveRef = useRef(false);
  const whyDesktopLockedScrollYRef = useRef<number | null>(null);

  const gap = 20;

  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const pointerDownRef = useRef(false);

  // Desktop services cards hover offset (parallax-style movement)
  const [servicesHoverOffset, setServicesHoverOffset] = useState({ x: 0, y: 0 });

  const handleServicesMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = ((event.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const normY = ((event.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setServicesHoverOffset({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
    });
  };

  const handleServicesMouseLeave = () => {
    setServicesHoverOffset({ x: 0, y: 0 });
  };

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setWhyDesktopProgress = (next: number) => {
      const max = Math.max(0, whyDesktopMaxTranslateRef.current);
      const clamped = Math.max(0, Math.min(max, next));
      whyDesktopProgressRef.current = clamped;
      setWhyDesktopTranslateX(-clamped);
      return clamped;
    };

    const updateDesktopWhyMeasurements = () => {
      if (window.innerWidth < 768) {
        setBodyLock(false);
        whyDesktopMaxTranslateRef.current = 0;
        setWhyDesktopTranslateX(0);
        setWhyDesktopOuterHeight(null);
        return;
      }
      const viewportEl = whyDesktopViewportRef.current;
      const trackEl = whyDesktopTrackRef.current;
      if (!viewportEl || !trackEl) return;

      const maxTranslate = Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);
      whyDesktopMaxTranslateRef.current = maxTranslate;
      setWhyDesktopOuterHeight(window.innerHeight);
      setWhyDesktopProgress(whyDesktopProgressRef.current);
    };

    const setBodyLock = (locked: boolean) => {
      if (whyDesktopLockActiveRef.current === locked) return;
      whyDesktopLockActiveRef.current = locked;
      if (locked) {
        whyDesktopLockedScrollYRef.current = window.scrollY;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.overscrollBehavior = "";
        whyDesktopLockedScrollYRef.current = null;
      }
    };

    const getLockState = () => {
      if (window.innerWidth < 768) {
        return { canLock: false, rectTop: 0, rectBottom: 0, pinned: false };
      }
      const sectionEl = whyDesktopSectionRef.current;
      if (!sectionEl) {
        return { canLock: false, rectTop: 0, rectBottom: 0, pinned: false };
      }
      const rect = sectionEl.getBoundingClientRect();
      const pinned = rect.top <= 0 && rect.bottom >= window.innerHeight;
      // Enter lock a little before pin so we can snap the section to the top and start horizontal motion.
      const nearEntry =
        rect.top <= Math.max(120, window.innerHeight * 0.22) &&
        rect.bottom > window.innerHeight * 0.8;
      return { canLock: nearEntry, rectTop: rect.top, rectBottom: rect.bottom, pinned };
    };

    const alignSectionToTop = (rectTop: number) => {
      if (Math.abs(rectTop) < 1) return;
      window.scrollTo({ top: window.scrollY + rectTop, behavior: "auto" });
    };

    const lockSection = (rectTop: number) => {
      alignSectionToTop(rectTop);
      setBodyLock(true);
      // Re-align after lock styles apply to avoid 1-frame drift on some browsers.
      requestAnimationFrame(() => {
        const sectionEl = whyDesktopSectionRef.current;
        if (!sectionEl) return;
        const rect = sectionEl.getBoundingClientRect();
        if (Math.abs(rect.top) > 0.5) {
          window.scrollTo({ top: window.scrollY + rect.top, behavior: "auto" });
        }
      });
    };

    const consumeDelta = (deltaY: number) => {
      const lockState = getLockState();
      const max = whyDesktopMaxTranslateRef.current;
      const current = whyDesktopProgressRef.current;
      if (max <= 0 || !lockState.canLock) {
        setBodyLock(false);
        return false;
      }

      if (deltaY > 0 && current < max) {
        if (!whyDesktopLockActiveRef.current) lockSection(lockState.rectTop);
        setWhyDesktopProgress(current + deltaY * 1.05);
        return true;
      }
      if (deltaY < 0 && current > 0) {
        if (!whyDesktopLockActiveRef.current) lockSection(lockState.rectTop);
        setWhyDesktopProgress(current + deltaY * 1.05);
        return true;
      }

      setBodyLock(false);
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (consumeDelta(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      whyDesktopTouchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const lastY = whyDesktopTouchYRef.current;
      const currentY = e.touches[0].clientY;
      if (lastY == null) {
        whyDesktopTouchYRef.current = currentY;
        return;
      }
      const deltaY = lastY - currentY;
      if (consumeDelta(deltaY * 1.2)) {
        e.preventDefault();
        e.stopPropagation();
        whyDesktopTouchYRef.current = currentY;
      } else {
        whyDesktopTouchYRef.current = currentY;
      }
    };

    const onTouchEnd = () => {
      whyDesktopTouchYRef.current = null;
    };

    updateDesktopWhyMeasurements();

    window.addEventListener("resize", updateDesktopWhyMeasurements);
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });

    return () => {
      window.removeEventListener("resize", updateDesktopWhyMeasurements);
      setBodyLock(false);
      document.removeEventListener("wheel", onWheel as EventListener, true);
      document.removeEventListener("touchstart", onTouchStart as EventListener, true);
      document.removeEventListener("touchmove", onTouchMove as EventListener, true);
      document.removeEventListener("touchend", onTouchEnd as EventListener, true);
      document.removeEventListener("touchcancel", onTouchEnd as EventListener, true);
    };
  }, [whyList.length]);

  return (
    <section className="relative z-20 -mt-[60px] w-full overflow-x-hidden overflow-y-visible bg-transparent pb-16 pt-[100px] md:-mt-[90px] md:pt-[120px]">
      {/* Background texture for section 2 */}
      {(bgUrl || bgDesktopUrl) && (
        <div className="pointer-events-none absolute inset-0 z-0">
          {bgUrl && (
            <Image
              src={bgUrl}
              alt=""
              fill
              className="object-cover md:hidden"
              style={{ objectPosition: "center top" }}
              sizes="100vw"
              priority={false}
              unoptimized={
                bgUrl.includes("quicklyn-headless.local") ||
                bgUrl.includes("quick.rootholdings")
              }
            />
          )}
          {bgDesktopUrl && (
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(41,122,124,0) 0%, #297a7c 100%), url(${bgDesktopUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top",
                backgroundSize: "cover",
              }}
              aria-hidden
            />
          )}
        </div>
      )}

      <div className="relative z-10 mx-auto flex w-full flex-col items-center px-6 text-center">
        {/* Counters - mobile unchanged */}
        <div className="mx-auto mb-10 flex w-full max-w-[240px] flex-col gap-4 px-0 text-left md:hidden">
          {(counters ?? []).map((item, index) => (
            <div key={`${item.counter_text}-${index}`} className="w-full">
              {index > 0 && (
                <div className="my-4 h-px w-full bg-white/25" aria-hidden />
              )}
              <div className="hero-text-shadow flex w-full items-center justify-between gap-4">
                <div
                  className="flex items-baseline gap-1 text-[52px] leading-none text-white"
                  style={{ fontWeight: 200 }}
                >
                  <span style={{ fontWeight: 200 }}>
                    <CountUp
                      start={0}
                      end={Number(item.counter_number) || 0}
                      duration={1.5}
                    />
                  </span>
                  <span style={{ fontWeight: 200 }}>{item.counter_suffix}</span>
                </div>
                <div className="max-w-[55%] text-left text-[18px] font-normal leading-snug text-white">
                  {item.counter_text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counters - desktop/tablet: 2 columns, 2 counters each (when available) */}
        {(counters ?? []).length > 0 &&
          (() => {
            const items = counters ?? [];
            const mid = Math.ceil(items.length / 2);
            const left = items.slice(0, mid);
            const right = items.slice(mid);
            const columns = [left, right];
            return (
              <div className="mb-8 hidden w-full max-w-[820px] md:-mt-4 md:block lg:mb-14">
                <div className="px-4 py-4 lg:px-6 lg:py-5">
                  <div className="flex flex-col gap-6 md:flex-row">
                    {columns.map((colItems, colIndex) => (
                      <div
                        key={`counter-col-${colIndex}`}
                        className={`flex flex-col gap-4 ${
                          colIndex === 0
                            ? "md:w-[45%] md:pl-[30px] md:items-end md:text-right"
                            : "md:w-[55%] md:border-l md:border-white/25 md:pl-10"
                        }`}
                      >
                        {colItems.map((item, index) => (
                          <div
                            key={`desktop-${item.counter_text}-${colIndex}-${index}`}
                            className="hero-text-shadow flex min-w-0 items-center gap-4 lg:gap-5"
                          >
                            <div
                              className="flex flex-shrink-0 items-baseline leading-none text-white"
                              style={{ fontWeight: 200 }}
                            >
                              <span className="text-[54px] tracking-[-0.03em] lg:text-[72px]">
                                <CountUp
                                  start={0}
                                  end={Number(item.counter_number) || 0}
                                  duration={1.5}
                                />
                              </span>
                              <span className="ml-1 text-[40px] tracking-[-0.02em] lg:text-[54px]">
                                {item.counter_suffix}
                              </span>
                            </div>
                            <div className="min-w-0 max-w-[160px] text-left text-[16px] font-normal leading-tight text-white/95 lg:max-w-[210px] lg:text-[20px]">
                              {item.counter_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Section heading (mobile only) */}
        <h2 className="mt-10 mb-[30px] text-[68px] font-medium leading-[58px] text-white md:hidden">
          <span className="block">Our</span>
          <span className="block">Services</span>
        </h2>

        {/* Desktop / tablet services layout */}
        <div
          className="relative hidden w-full max-w-[1100px] md:mt-10 md:block"
          onMouseMove={handleServicesMouseMove}
          onMouseLeave={handleServicesMouseLeave}
        >
          <div className="relative mx-auto h-[420px] w-full lg:h-[520px]">
            <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
              <span className="hero-text-shadow block text-center text-[120px] font-medium leading-[0.82] tracking-[-0.05em] text-white/90 lg:text-[180px]">
                Our
              </span>
              <span className="hero-text-shadow -mt-2 block text-center text-[120px] font-medium leading-[0.82] tracking-[-0.05em] text-white/90 lg:-mt-4 lg:text-[180px]">
                Services
              </span>
            </div>

            {orderedDesktopServices.map((service, idx) => {
              const slot = desktopCardSlots[idx];
              const title = service.acf?.service_heading || service.title?.rendered || "Service";
              const desc = service.acf?.service_description || "";
              const isSignature = isSignatureService(service);
              const cardPos =
                slot === "leftTop"
                  ? "left-[2%] top-[14%] w-[22%] min-w-[170px] max-w-[240px] lg:left-[4%] lg:top-[13%] lg:max-w-[260px]"
                  : slot === "topCenter"
                    ? "left-[32%] -top-[5%] w-[38%] min-w-[260px] max-w-[420px] -translate-x-1/2 lg:left-[31%] lg:-top-[5%] lg:max-w-[440px]"
                    : slot === "rightTop"
                      ? "right-[0%] top-[18%] w-[28%] min-w-[220px] max-w-[320px] lg:right-[2%] lg:top-[17%] lg:max-w-[340px]"
                      : slot === "leftBottom"
                        ? "left-[6%] top-[78%] w-[32%] min-w-[240px] max-w-[360px] lg:left-[8%] lg:top-[78%] lg:max-w-[380px]"
                        : "right-[14%] top-[78%] w-[28%] min-w-[220px] max-w-[300px] lg:right-[12%] lg:top-[78%] lg:max-w-[320px]";

              return (
                <article
                  key={`desktop-card-${service.id}`}
                  className={`group absolute z-10 rounded-[22px] bg-[#175c5e]/95 px-5 py-4 text-left shadow-[0_8px_18px_rgba(0,0,0,0.18)] backdrop-blur-[2px] lg:rounded-[26px] lg:px-7 lg:py-5 ${cardPos}`}
                  style={{
                    transform: `translate3d(${servicesHoverOffset.x * 10}px, ${
                      servicesHoverOffset.y * 8
                    }px, 0)`,
                    transition: "transform 0.18s ease-out",
                  }}
                >
                  <Link
                    href={`/our-services#service-${service.slug}`}
                    className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center gap-1 overflow-hidden rounded-full text-[#1B5B5D] transition-all duration-200 ease-out hover:opacity-95 lg:h-7 lg:w-7 ${
                      isSignature ? "bg-[#FFDA00]" : "bg-white/90"
                    } group-hover:md:w-[116px] group-hover:md:pl-3 group-hover:md:pr-4`}
                    aria-label={`Open ${title}`}
                  >
                    <span className="hidden whitespace-nowrap text-[12px] font-semibold text-[#1B5B5D] group-hover:md:inline lg:text-[13px]">
                      Learn More
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-4 w-4 flex-shrink-0 lg:h-4 lg:w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 20L20 4" />
                      <path d="M4 4H20V20" />
                    </svg>
                  </Link>

                  <div className="transition-all duration-200 group-hover:md:pt-5">
                    <h3
                      className={`pr-8 text-[20px] font-medium leading-[1.05] tracking-[-0.02em] text-white lg:text-[28px] ${
                        isSignature ? "text-[#FFDA00]" : ""
                      }`}
                    >
                      <span>{title}</span>
                      {isSignature && (
                        <span className="ml-1 inline-flex align-middle text-[#FFDA00]" aria-hidden>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 lg:h-5 lg:w-5"
                            fill="currentColor"
                          >
                            <path d="M12 1l1.8 5.2L19 8l-5.2 1.8L12 15l-1.8-5.2L5 8l5.2-1.8L12 1z" />
                            <path d="M19 13l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
                          </svg>
                        </span>
                      )}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-[12px] leading-relaxed text-white/90 lg:mt-4 lg:text-[14px]">
                      {desc}
                    </p>
                  </div>
                </article>
              );
            })}

            <div className="absolute bottom-[14%] left-1/2 z-20 -translate-x-1/2 lg:bottom-[16%]">
              <Link
                href="/our-services"
                className="flex items-center gap-2 text-[18px] font-medium text-white lg:text-[22px]"
              >
                <span>Learn More</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5 lg:h-6 lg:w-6"
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
          </div>
        </div>

        {/* Services cards carousel — viewport + transform (no native scroll) so iOS swipe works with document-level touch */}
        <div
          ref={viewportRef}
          className="mt-[10px] w-full overflow-hidden cursor-grab md:hidden"
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
              className="group relative my-[20px] flex-shrink-0 select-none overflow-visible rounded-2xl bg-[#175c5e] p-5 text-left text-white transition-transform hover:-translate-y-1"
              style={{
                minWidth: "78%",
                maxWidth: "78%",
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
                <h3
                  className={`text-[23px] font-normal leading-[26px] ${
                    isSignatureService(service) ? "text-[#FFDA00]" : ""
                  }`}
                >
                  <span>{service.acf?.service_heading || service.title.rendered}</span>
                  {isSignatureService(service) && (
                    <span className="ml-1 inline-flex align-middle text-[#FFDA00]" aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M12 1l1.8 5.2L19 8l-5.2 1.8L12 15l-1.8-5.2L5 8l5.2-1.8L12 1z" />
                        <path d="M19 13l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
                      </svg>
                    </span>
                  )}
                </h3>
              </div>

              <p className="mb-3 line-clamp-3 text-[12px] leading-normal text-white/80">
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
          <div className="mt-4 flex w-full items-center justify-between px-6 md:hidden">
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
          <>
          <div className="mt-16 w-full px-6 md:hidden">
            {sectionHeading && (
<h2 className="mb-4 text-center text-[36px] font-semibold leading-snug text-white">
              {sectionHeading}
            </h2>
            )}

            <div className="mx-auto w-full max-w-sm space-y-3 pt-5 pb-0 pr-[20px]">
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
                      <p className="text-[20px] font-normal leading-[25px] text-white">
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
          <div
            ref={whyDesktopSectionRef}
            className="relative mt-16 hidden w-full pt-[120px] pb-12 md:mt-0 md:block"
          >
            <div className="sticky top-0 h-[80vh]">
              <div className="mx-auto h-full w-screen max-w-none px-0">
                <div className="relative h-full">
                  {/* Centered wrapper to align left content with nav width */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="mx-auto flex h-full w-full max-w-[1280px] px-8 lg:px-6">
                      <div className="relative h-full w-[42%] min-w-[300px] max-w-[470px]">
                        <div className="pointer-events-auto absolute top-1/2 left-0 z-20 w-full -translate-y-1/2">
                          <div className="relative flex flex-col justify-center pl-4 pr-10 lg:pl-6 lg:pr-16">
                            <div className="mb-6 lg:mb-8">
                              {whyIconUrl ? (
                                <Image
                                  src={whyIconUrl}
                                  alt={whyIcon?.alt || "Why Quicklyn icon"}
                                  width={320}
                                  height={320}
                                  className="block h-[260px] w-[260px] object-contain opacity-95 lg:h-[340px] lg:w-[340px]"
                                  unoptimized={
                                    whyIconUrl.includes("quicklyn-headless.local") ||
                                    whyIconUrl.includes("quick.rootholdings")
                                  }
                                />
                              ) : (
                                <svg
                                  viewBox="0 0 128 128"
                                  className="block h-[260px] w-[260px] text-[#0f4a4d]/80 lg:h-[340px] lg:w-[340px]"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden
                                >
                                  <circle cx="54" cy="54" r="26" />
                                  <path d="M73 73l28 28" />
                                  <path d="M34 76c6-9 14-13 20-13s14 4 20 13" />
                                  <circle cx="54" cy="46" r="6" />
                                  <path d="M22 86v-6c0-7 5-12 12-12h3" />
                                  <path d="M86 68h8c7 0 12 5 12 12v6" />
                                </svg>
                              )}
                            </div>
                            <div className="inline-block rounded-[40px] -mt-8">
                              <h3 className="hero-text-shadow text-left text-[52px] font-semibold leading-[0.95] tracking-[-0.03em] text-white lg:text-[76px]">
                                <span className="block">Why</span>
                                <span className="block">
                                  {(sectionHeading || "Quicklyn").replace(/^Why\s+/i, "")}?
                                </span>
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full-width cards on the right */}
                  <div className="relative z-10 flex h-full items-center">
                    <div
                      ref={whyDesktopViewportRef}
                      className="relative ml-[34%] w-[66%] overflow-hidden"
                    >
                      <div
                        ref={whyDesktopTrackRef}
                        className="flex will-change-transform pl-[34%] lg:pl-[38%]"
                        style={{ transform: `translate3d(${whyDesktopTranslateX}px, 0, 0)` }}
                      >
                        {whyList.map((item, index) => (
                          <article
                            key={`why-desktop-${item.list_heading}-${index}`}
                            className="flex h-[420px] w-[320px] flex-shrink-0 flex-col justify-start border border-white/25 px-6 py-8 text-left text-white lg:h-[500px] lg:w-[380px] lg:px-10 lg:py-10"
                          >
                            <h4 className="text-[22px] font-semibold leading-tight text-white lg:text-[28px]">
                              {item.list_heading}
                            </h4>
                            <p className="mt-auto text-[14px] leading-relaxed text-white/90 lg:text-[16px]">
                              {item.list_description}
                            </p>
                          </article>
                        ))}
                        <div className="h-[420px] w-[220px] flex-shrink-0 border-y border-transparent lg:h-[500px] lg:w-[260px]" aria-hidden />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </section>
  );
}
