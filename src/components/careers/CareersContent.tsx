"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CareersForm } from "./CareersForm";

export interface CareersContentProps {
  heading: string;
  description: string;
  image1Url: string | undefined;
  image2Url: string | undefined;
  image3Url: string | undefined;
  desktopBackgroundUrl?: string | undefined;
}

export function CareersContent({
  heading,
  description,
  image1Url,
  image2Url,
  image3Url,
  desktopBackgroundUrl,
}: CareersContentProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [sentinelOutOfView, setSentinelOutOfView] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const active = hasScrolled && sentinelOutOfView;

  useEffect(() => {
    const handleScroll = () => setHasScrolled(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSentinelOutOfView(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2a7a7c] text-white">
      {/* Subtle wave texture from bottom-left */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 100%, #3a9a9c, transparent)`,
        }}
      />

      <div
        ref={sentinelRef}
        className="absolute left-0 right-0 top-20 h-px w-full pointer-events-none"
        aria-hidden
      />

      {/* Mobile layout (keep existing behavior) */}
      <div className="md:hidden">
        {/* Top: three images — diagonal by default; staggered overlapping when scrolled */}
        <section className="relative z-10 min-h-[340px] pt-28 md:min-h-[580px] md:pt-40">
          <div
            className={`relative mx-auto mt-10 transition-all duration-500 ease-out md:mt-14 ${
              active
                ? "h-[500px] w-full max-w-2xl px-4 md:h-[560px]"
                : "h-[320px] w-[110px] md:h-[380px] md:w-[122px]"
            }`}
          >
            {/* Image 1 — default: top-right. Scrolled: rightmost, hindmost, full opacity, original size */}
            {image1Url && (
              <div
                className={`absolute transition-all duration-500 ease-out ${
                  active
                    ? "right-[12%] top-[38%] z-10 h-[270px] w-[95px] opacity-100 md:right-[10%] md:top-[36%] md:h-[320px] md:w-[110px]"
                    : "right-0 top-0 h-[165px] w-[48px] opacity-35 md:h-[195px] md:w-[58px]"
                }`}
              >
                <Image
                  src={image1Url}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="130px"
                  unoptimized={image1Url.includes("quick.rootholdings")}
                />
              </div>
            )}
            {/* Image 2 — default: middle-left. Scrolled: leftmost, foremost, full opacity, original size */}
            {image2Url && (
              <div
                className={`absolute transition-all duration-500 ease-out ${
                  active
                    ? "left-[12%] top-[32%] z-30 h-[320px] w-[110px] opacity-100 md:left-[10%] md:top-[30%] md:h-[370px] md:w-[125px]"
                    : "left-0 top-[26%] h-[155px] w-[50px] opacity-35 md:top-[24%] md:h-[185px] md:w-[60px]"
                }`}
              >
                <Image
                  src={image2Url}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="150px"
                  unoptimized={image2Url.includes("quick.rootholdings")}
                />
              </div>
            )}
            {/* Image 3 — default: bottom-right. Scrolled: center, middle layer, full opacity, original size */}
            {image3Url && (
              <div
                className={`absolute transition-all duration-500 ease-out ${
                  active
                    ? "left-[36%] top-[20%] z-20 h-[340px] w-[115px] opacity-100 md:left-[34%] md:top-[18%] md:h-[400px] md:w-[135px]"
                    : "right-0 top-[52%] mt-1 h-[160px] w-[48px] opacity-35 md:top-[51%] md:mt-1.5 md:h-[195px] md:w-[58px]"
                }`}
              >
                <Image
                  src={image3Url}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="135px"
                  unoptimized={image3Url.includes("quick.rootholdings")}
                />
              </div>
            )}
          </div>
        </section>

        {/* Below images: heading then description — moves up when scrolled */}
        <section className="relative z-10 px-6 pb-12 pt-16 md:pb-16 md:pt-20">
          <div
            className={`mx-auto max-w-2xl text-center transition-all duration-500 ease-out ${
              active ? "-translate-y-20 md:-translate-y-24" : "translate-y-0"
            }`}
          >
            <h1
              className={`mt-8 font-semibold tracking-tight transition-opacity duration-500 ease-out ${
                active ? "text-white" : "text-white/30"
              }`}
              style={{ fontSize: "39px", lineHeight: "39px" }}
            >
              {heading}
            </h1>
            {description && (() => {
              const paragraphs = description.split(/\n\n+/).filter(Boolean);
              const [first, ...rest] = paragraphs;
              return (
                <div className="mt-4">
                  {first && (
                    <p
                      className={`font-normal transition-opacity duration-500 ease-out whitespace-pre-line ${
                        active ? "text-white" : "text-white/30"
                      }`}
                      style={{ fontSize: "12px" }}
                    >
                      {first}
                    </p>
                  )}
                  {rest.length > 0 && (
                    <p
                      className={`overflow-hidden font-normal whitespace-pre-line text-white transition-all duration-500 ease-out ${
                        active ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                      style={{ fontSize: "12px" }}
                    >
                      {rest.join("\n\n")}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </section>
      </div>

      {/* Desktop / tablet hero */}
      <section className="relative z-0 hidden px-8 md:block md:min-h-[70vh] lg:min-h-[80vh] lg:px-16">
        <div className="mx-auto flex max-w-6xl items-stretch gap-10 lg:gap-14">
          {/* Left text block */}
          <div className="flex-1 max-w-xl flex flex-col justify-center">
            <h1
              className="mt-8 text-left font-semibold tracking-tight text-white"
              style={{ fontSize: "86px", lineHeight: "77px" }}
            >
              {(() => {
                const text = heading.trim();
                if (/^join the quicklyn team$/i.test(text)) {
                  return (
                    <>
                      <span className="block">Join the</span>
                      <span className="block">Quicklyn</span>
                      <span className="block">Team</span>
                    </>
                  );
                }
                const words = text.split(/\s+/);
                if (words.length <= 3) {
                  return words.map((word, idx) => (
                    <span key={idx} className="block">
                      {word}
                    </span>
                  ));
                }
                return text;
              })()}
            </h1>
            {description && (
              <p className="mt-6 max-w-md text-left text-[15px] leading-[26px] text-white/90">
                {description}
              </p>
            )}
          </div>

          {/* Right image band column */}
          <div className="relative flex-1">
            <div className="relative h-full min-h-[600px] w-full overflow-hidden bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] lg:min-h-[720px]">
              <div className="absolute inset-0 flex">
                {image1Url && (
                  <div className="relative flex-1">
                    <Image
                      src={image1Url}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="33vw"
                      unoptimized={image1Url.includes("quick.rootholdings")}
                    />
                  </div>
                )}
                {image2Url && (
                  <div className="relative flex-1">
                    <Image
                      src={image2Url}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="33vw"
                      unoptimized={image2Url.includes("quick.rootholdings")}
                    />
                  </div>
                )}
                {image3Url && (
                  <div className="relative flex-1">
                    <Image
                      src={image3Url}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="33vw"
                      unoptimized={image3Url.includes("quick.rootholdings")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form section - mobile (unchanged background) */}
      <section className="relative z-10 flex justify-center px-6 pb-20 md:hidden">
        <CareersForm />
      </section>

      {/* Form section - desktop/tablet with background image from desktop_background */}
      <section
        className="relative z-10 hidden justify-center px-6 pb-[100px] pt-20 md:-mt-16 md:flex md:items-start md:min-h-[140vh] lg:min-h-[170vh]"
        style={
          desktopBackgroundUrl
            ? {
                backgroundImage: `url(${encodeURI(desktopBackgroundUrl)})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <CareersForm />
      </section>
    </main>
  );
}
