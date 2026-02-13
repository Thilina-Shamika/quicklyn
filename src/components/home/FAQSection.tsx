"use client";

import Link from "next/link";
import { useState } from "react";
import type { WPFAQ } from "@/lib/wordpress";

interface FAQSectionProps {
  faqs: WPFAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <section className="relative z-0 w-full overflow-hidden bg-[#226d71] pb-16 pt-8">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6">
        <h2 className="mb-8 text-center text-[63px] font-medium uppercase tracking-wide text-white">
          FAQ
        </h2>

        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            const acf = item.acf;
            const question = acf?.question || item.title.rendered;
            const part1 = acf?.answer_part_01?.trim() || "";
            const part2 = acf?.answer_part_02?.trim() || "";
            const linkText = acf?.link_text_01?.trim();
            const linkUrl = acf?.link01?.url || "#";
            const hasAnswer = !!(part1 || part2 || linkText);

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-[#1a5d5f] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-white focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <span className="text-[12px] font-medium leading-snug">
                    {question}
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

                {hasAnswer && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/15 px-5 pb-4 pt-2">
                        <div className="space-y-2 text-[12px] leading-relaxed text-white/95">
                          {part1 && <p>{part1}</p>}
                          {linkText && (
                            <p>
                              <Link
                                href={linkUrl}
                                target={acf?.link01?.target || "_self"}
                                className="inline-flex items-center gap-1.5 font-medium text-[#ffda00] underline underline-offset-2 hover:text-[#ffda00]/90"
                              >
                                {linkText}
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 17L17 7M17 7H7M17 7v10"
                                  />
                                </svg>
                              </Link>
                            </p>
                          )}
                          {part2 && <p>{part2}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact section */}
        <div className="mt-12 text-center">
          <p className="text-base font-medium text-white">
            Have More Questions?
          </p>
          <p className="mt-1 text-sm text-white/90">
            Reach Out Anytime, We&apos;re Ready To Assist!
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white underline underline-offset-2 hover:text-white/90"
          >
            Contact Us
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
