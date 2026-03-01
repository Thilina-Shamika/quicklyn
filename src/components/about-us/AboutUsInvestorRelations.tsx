"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TRANSITION_MS = 500;

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

interface AboutUsInvestorRelationsProps {
  investorTitle: string;
  investorParagraphs: string[];
  contactUrl: string;
  contactLabel: string;
  layout?: "mobile" | "desktop";
}

export function AboutUsInvestorRelations({
  investorTitle,
  investorParagraphs,
  contactUrl,
  contactLabel,
  layout = "mobile",
}: AboutUsInvestorRelationsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transition = `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`;
  const opacity = inView ? 1 : 0.12;
  const transform = inView ? "scale(1)" : "scale(0.5)";

  if (layout === "desktop") {
    return (
      <section
        ref={sectionRef}
        className="mt-20 pb-24 lg:mt-24 lg:pb-28"
        style={{
          opacity,
          transform,
          transition,
        }}
      >
        <div className="mx-auto max-w-[1180px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Left: heading + CTA, button aligned to description bottom via flex */}
            <div className="flex h-full flex-col justify-between">
              {investorTitle && (
                <h2
                  className="text-left font-normal text-white"
                  style={{ fontSize: "96px", lineHeight: "89px" }}
                >
                  {investorTitle}
                </h2>
              )}
              {contactUrl && (
                <div className="mt-8 lg:mt-0">
                  <Link
                    href={contactUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-transparent px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    <PaperPlaneIcon className="h-5 w-5" />
                    <span>{contactLabel}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right: description paragraphs */}
            {investorParagraphs.length > 0 && (
              <div className="space-y-5 text-left text-white/95 lg:ml-auto lg:max-w-[520px]">
                {investorParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="font-normal"
                    style={{ fontSize: "19px", lineHeight: "32px" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="mt-16 rounded-2xl px-6 py-10"
      style={{
        background: "linear-gradient(180deg, #2A7A7C 0%, #185B5D 100%)",
        opacity,
        transform,
        transition,
      }}
    >
      {investorTitle && (
        <h2
          className="text-left font-normal text-white"
          style={{ fontSize: "40px", lineHeight: "43px" }}
        >
          {investorTitle}
        </h2>
      )}
      {investorParagraphs.length > 0 && (
        <div className="mt-5 space-y-4 text-left text-white/95">
          {investorParagraphs.map((p, i) => (
            <p
              key={i}
              className="font-normal"
              style={{ fontSize: "12px", lineHeight: "19px" }}
            >
              {p}
            </p>
          ))}
        </div>
      )}
      {contactUrl && (
        <div className="mt-8 flex justify-center">
          <Link
            href={contactUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3.5 text-white transition hover:bg-white/10"
          >
            <PaperPlaneIcon className="h-5 w-5" />
            <span>{contactLabel}</span>
          </Link>
        </div>
      )}
    </section>
  );
}
