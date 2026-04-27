"use client";

import { useId, useState } from "react";
import type { ServiceLandingThirdAccordionItem } from "@/types/wordpress";

const chevron = (
  <svg
    className="h-4 w-4 shrink-0 text-white/90"
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
  items: ServiceLandingThirdAccordionItem[];
};

export function ServiceLandingThirdSectionAccordion({ items }: Props) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number>(-1);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="m-0 list-none p-0">
      {items.map((row, index) => {
        const id = `${baseId}-panel-${index}`;
        const isOpen = openIndex === index;
        const title = (row.cleaning_heading ?? "").trim() || "Option";
        const rawHtml = (row.cleaning_description ?? "").trim();
        return (
          <li
            key={`${row.cleaning_heading ?? "opt"}-${index}`}
            className="border-b border-white/25 first:border-t first:border-t-white/25"
          >
            <h3 className="m-0 p-0">
              <button
                type="button"
                onClick={() => {
                  setOpenIndex((i) => (i === index ? -1 : index));
                }}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-[21px] font-normal text-white/95 sm:py-5"
                aria-expanded={isOpen}
                aria-controls={id}
                id={`${id}-label`}
              >
                <span className="min-w-0 pr-2">{title}</span>
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
              {rawHtml ? (
                <div
                  className="max-w-prose pb-5 pl-0 pr-2 text-white/90 sm:pr-0 [&_a]:text-[#ffda00] [&_a]:underline [&_p]:mb-3 [&_p]:text-[15px] [&_p]:leading-7 sm:[&_p]:text-[16px] sm:[&_p]:leading-8 md:[&_p]:text-[17px] md:[&_p]:leading-9 [&_p]:last:mb-0 [&_ul]:mb-2 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5"
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
