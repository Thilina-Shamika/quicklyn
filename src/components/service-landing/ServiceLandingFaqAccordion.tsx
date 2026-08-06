"use client";

import { useState } from "react";
import { ServiceLandingRichText } from "@/components/service-landing/ServiceLandingRichText";
import { isLikelyServiceLandingHtml } from "@/lib/sanitizeHtml";
import type { ServiceLandingFaqItem } from "@/types/wordpress";

const chevron = (
  <svg
    className="h-4 w-4 shrink-0 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

type Props = {
  items: ServiceLandingFaqItem[];
  idPrefix: string;
};

export function ServiceLandingFaqAccordion({ items, idPrefix }: Props) {
  const baseId = idPrefix.replace(/[^a-zA-Z0-9_-]/g, "-") || "faq";
  const [openIndex, setOpenIndex] = useState<number>(-1);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="m-0 list-none p-0">
      {items.map((row, index) => {
        const id = `${baseId}-panel-${index}`;
        const isOpen = openIndex === index;
        const question = (row.question ?? "").trim();
        const rawAnswer = (row.answer ?? "").trim();
        if (!question && !rawAnswer) return null;

        return (
          <li
            key={`${question || "faq"}-${index}`}
            className="border-b border-white first:border-t first:border-t-white"
          >
            <h3 className="m-0 p-0">
              <button
                type="button"
                onClick={() => {
                  setOpenIndex((i) => (i === index ? -1 : index));
                }}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-[17px] font-medium text-white sm:py-5 sm:text-[18px] md:text-[19px]"
                aria-expanded={isOpen}
                aria-controls={id}
                id={`${id}-label`}
              >
                <span className="min-w-0 pr-2">{question || "Question"}</span>
                <span
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  {chevron}
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              aria-labelledby={`${id}-label`}
              className={isOpen ? "block h-auto w-full" : "hidden"}
            >
              {rawAnswer ? (
                <div className="max-w-prose pb-5 pl-0 pr-2 text-white/95 sm:pr-0">
                  {isLikelyServiceLandingHtml(rawAnswer) ? (
                    <ServiceLandingRichText
                      content={rawAnswer}
                      className="text-[15px] font-normal leading-7 sm:text-[16px] sm:leading-8 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5"
                    />
                  ) : (
                    <p className="m-0 text-[15px] font-normal leading-7 sm:text-[16px] sm:leading-8">
                      {rawAnswer}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
