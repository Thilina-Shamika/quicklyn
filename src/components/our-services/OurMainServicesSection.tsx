"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { WPService } from "@/lib/wordpress";

function getFirstParagraph(text: string): string {
  if (!text?.trim()) return "";
  const trimmed = text.trim();
  const pMatch = trimmed.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (pMatch) return pMatch[1].replace(/<[^>]+>/g, "").trim();
  return trimmed.split(/\n\n+/)[0]?.trim() ?? trimmed;
}

function isSignaturePro(service: WPService): boolean {
  return service.acf.id === "signaturepro" || service.slug === "signaturepro";
}

function hasContent(value: string | undefined): boolean {
  if (value == null) return false;
  const stripped = value.replace(/<[^>]+>/g, "").trim();
  return stripped.length > 0;
}

interface OurMainServicesSectionProps {
  services: WPService[];
}

function ServiceAccordionItem({
  service,
  isOpen,
  onToggle,
}: {
  service: WPService;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const acf = service.acf;
  const heading = acf.service_heading ?? service.title.rendered;
  const fullDescription = acf.service_description ?? "";
  const isSigPro = isSignaturePro(service);
  const headerDescription = isSigPro ? getFirstParagraph(fullDescription) : fullDescription;
  const image = acf.service_image;
  const whatsIncluded = acf.whats_included;
  const supplies = acf.supplies;
  const rawTimeList = Array.isArray(acf.approximate_time_list)
    ? acf.approximate_time_list
    : acf.approximate_time_list && typeof acf.approximate_time_list === "object"
      ? [acf.approximate_time_list]
      : [];
  const timeList = rawTimeList.filter(
    (item) => (item.type?.trim() || item.hours?.trim()) !== ""
  );
  const hourlyRate = acf.hourly_rate;
  const note = acf.note;

  return (
    <div
      id={`service-${service.slug}`}
      className="overflow-hidden rounded-3xl border border-[#528e91] bg-[rgba(217,217,217,0.13)] shadow-lg scroll-mt-24"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#226d71]"
        aria-expanded={isOpen}
        aria-controls={`service-content-${service.id}`}
        id={`service-header-${service.id}`}
      >
        <div className="min-w-0 flex-1">
          <h3
            className={`text-[22px] ${isSigPro ? "font-semibold text-[#ffda00]" : "font-normal text-white"}`}
          >
            {heading}
            {isSigPro ? (
              <span className="ml-1 inline-block align-middle" aria-hidden>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#ffda00"
                  className="inline-block"
                >
                  <path d="M12 2l1.4 4.2L18 7.6l-4.2 1.4L12 13l-1.4-4.2L6 7.6l4.2-1.4L12 2z" />
                  <path d="M19 11l.7 2.1L22 14l-2.1.7L19 17l-.7-2.1L16 14l2.1-.7L19 11z" />
                  <path d="M5 11l.7 2.1L8 14l-2.1.7L5 17l-.7-2.1L2 14l2.1-.7L5 11z" />
                </svg>
              </span>
            ) : null}
          </h3>
          {hasContent(headerDescription) ? (
            <p className="mt-1 line-clamp-3 text-[12px] font-normal text-white/90">
              {headerDescription}
            </p>
          ) : null}
        </div>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300 ease-out ${isSigPro ? "text-[#ffda00]" : "text-white/90"}`}
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        id={`service-content-${service.id}`}
        role="region"
        aria-labelledby={`service-header-${service.id}`}
        aria-hidden={!isOpen}
        className="grid border-t border-white/15 transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-0 px-5 pb-5 pt-2">
          {hasContent(fullDescription) ? (
            <div
              className="mb-4 text-sm text-white/90 prose prose-sm max-w-none prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0"
              dangerouslySetInnerHTML={{ __html: fullDescription }}
            />
          ) : null}
          {image?.url ? (
            <div className="mb-5 overflow-hidden rounded-xl">
              <Image
                src={image.url}
                alt={image.alt || heading}
                width={768}
                height={143}
                className="h-auto w-full object-cover"
                unoptimized={image.url.includes("quick.rootholdings.com.mv")}
              />
            </div>
          ) : null}

          {(hasContent(whatsIncluded) || hasContent(supplies)) ? (
            <>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 py-4 items-start">
                {hasContent(whatsIncluded) ? (
                  <>
                    <span className="shrink-0 font-semibold text-white leading-tight">
                      What&apos;s
                      <br />
                      Included:
                    </span>
                    <span className="min-w-0 text-sm text-white/90 leading-snug">
                      {whatsIncluded}
                    </span>
                  </>
                ) : null}
                {hasContent(supplies) ? (
                  <>
                    <span className="shrink-0 font-semibold text-white leading-tight">
                      Supplies:
                    </span>
                    <div
                      className="min-w-0 text-sm text-white/90 prose prose-sm max-w-none prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-p:leading-snug whitespace-pre-line [&_p]:whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: supplies! }}
                    />
                  </>
                ) : null}
              </div>
              <hr className="border-white/20" />
            </>
          ) : null}

          {timeList.length > 0 ? (
            <>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 py-4 items-start">
                <span className="shrink-0 font-semibold text-white leading-tight pt-0.5">
                  Approximate
                  <br />
                  Time:
                </span>
                <ul className="min-w-0 space-y-0 text-sm text-white/90">
                  {timeList.map((item, i) => (
                    <li
                      key={i}
                      className="flex border-b border-dashed border-white/40 py-2 first:pt-0 last:border-b-0 last:pb-0"
                    >
                      <span className="flex-[8] capitalize">
                        {item.type}
                      </span>
                      <span className="flex-[4] text-right uppercase">
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="border-white/20" />
            </>
          ) : null}

          {hasContent(hourlyRate) ? (
            <div className="bg-[#1a585c] px-4 py-3 -mx-5 my-4 rounded-none">
              <p className="text-center font-semibold text-white">
                {hourlyRate}
              </p>
            </div>
          ) : null}

          {hasContent(note) ? (
            <p className="px-4 py-3 text-center text-xs text-white/80 md:text-sm">
              {note}
            </p>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OurMainServicesSection({ services }: OurMainServicesSectionProps) {
  const sortedServices = useMemo(() => {
    const list = [...services];
    const idx = list.findIndex((s) => isSignaturePro(s));
    if (idx === -1) return list;
    const [sig] = list.splice(idx, 1);
    return [...list, sig];
  }, [services]);

  const [openId, setOpenId] = useState<number | null>(
    sortedServices.length > 0 ? sortedServices[0].id : null
  );

  // On load, if URL hash is #service-{slug}, expand that accordion and scroll to it
  useEffect(() => {
    if (typeof window === "undefined" || !sortedServices.length) return;
    const hash = window.location.hash?.slice(1);
    if (!hash || !hash.startsWith("service-")) return;
    const slug = hash.replace(/^service-/, "");
    const service = sortedServices.find((s) => s.slug === slug);
    if (!service) return;
    setOpenId(service.id);
    const el = document.getElementById(hash);
    if (el) {
      const scroll = () =>
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      const t = setTimeout(scroll, 350);
      return () => clearTimeout(t);
    }
  }, [sortedServices]);

  if (!sortedServices.length) return null;

  return (
    <section
      className="bg-[#2a7a7c] -mt-8 pt-0 pb-12 md:pb-16"
      aria-labelledby="main-services-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="main-services-heading"
          className="mb-8 text-center text-white"
        >
          <span className="block text-[32px] font-normal leading-tight">
            Our Main
          </span>
          <span className="block text-[57px] font-semibold uppercase leading-tight">
            Services
          </span>
        </h2>
        <div className="space-y-4">
          {sortedServices.map((service) => (
            <ServiceAccordionItem
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              onToggle={() =>
                setOpenId((prev) => (prev === service.id ? null : service.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
