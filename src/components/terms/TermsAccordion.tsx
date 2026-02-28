"use client";

import { useState } from "react";
import type { TermsListItem } from "@/types/wordpress";

interface TermsAccordionProps {
  items: TermsListItem[];
}

function padNum(n: number): string {
  return String(n).padStart(2, "0");
}

export function TermsAccordion({ items }: TermsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items?.length) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const number = padNum(index + 1);
        const title = item.terms_title?.trim() || `Item ${number}`;
        const hasContent = !!item.terms?.trim();

        return (
          <div
            key={`${index}-${title}`}
            className="overflow-hidden rounded-2xl bg-[#3f888a] transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-white focus:outline-none focus:ring-0 md:px-5 md:py-3.5 md:focus:ring-2 md:focus:ring-white/30 md:focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`terms-content-${index}`}
              id={`terms-heading-${index}`}
            >
              <span className="text-sm font-semibold uppercase tracking-wide md:text-[23px]">
                {number}. {title}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {hasContent && (
              <div
                id={`terms-content-${index}`}
                role="region"
                aria-labelledby={`terms-heading-${index}`}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/20 px-4 pb-4 pt-2 md:px-5 md:pb-4 md:pt-3">
                    <div
                      className="prose prose-invert max-w-none text-sm leading-relaxed text-white/95 prose-p:mb-2 prose-p:last:mb-0 prose-a:text-[#ffda00] prose-a:underline prose-a:underline-offset-2"
                      dangerouslySetInnerHTML={{ __html: item.terms }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
