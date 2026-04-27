import Image from "next/image";
import Link from "next/link";
import {
  decodeCommonWpHtmlEntities,
  sanitizeServiceLandingHeadingLine,
  sanitizeServiceLandingSection6Heading,
} from "@/lib/sanitizeHtml";
import type {
  ServiceLandingApartmentType,
  ServiceLandingWhatToExpectItem,
  WPImage,
} from "@/types/wordpress";

function unoptimizedCmsUrl(url: string) {
  return (
    url.includes("quick.rootholdings") || url.includes("quicklyn-headless.local")
  );
}

function getAcfImageUrl(
  image: WPImage | null | undefined,
): string | undefined {
  if (!image) return undefined;
  const u = image.url;
  if (typeof u === "string" && u.trim()) return u.trim();
  const src = (image as { source_url?: string }).source_url;
  if (typeof src === "string" && src.trim()) return src.trim();
  return undefined;
}

const EMPHASIS_5 = "Different Layouts";
const EMPHASIS_6 = "What to Expect";

const FIFTH_HEADING_BASE_CLASS =
  "max-w-[19ch] text-balance text-[53px] font-light leading-[63px] text-white md:max-w-[20ch] [&_b]:font-bold [&_em]:italic [&_i]:italic [&_strong]:font-bold";

const SECTION_DISCLAIMER_CLASS =
  "mx-auto max-w-[56rem] text-center text-[18px] font-light italic leading-[29px] text-[#f5f5f5]";

/** Horizontal rule: transparent → solid → transparent (for between section 5 and 6). */
function ServiceLandingSection5Separator() {
  return (
    <div
      className="w-full py-[130px]"
      role="separator"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div
          className="h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_12%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.45)_88%,transparent_100%)]"
          aria-hidden
        />
      </div>
    </div>
  );
}

function FifthSectionHeading({ text }: { text: string }) {
  const raw = text.trim();
  if (!raw) return null;
  const t = decodeCommonWpHtmlEntities(raw);

  if (/<\s*(strong|b|i|em)\b/i.test(t)) {
    return (
      <h2
        className={FIFTH_HEADING_BASE_CLASS}
        dangerouslySetInnerHTML={{
          __html: sanitizeServiceLandingHeadingLine(t),
        }}
      />
    );
  }

  const i = t.toLowerCase().indexOf(EMPHASIS_5.toLowerCase());
  if (i === -1) {
    return <h2 className={FIFTH_HEADING_BASE_CLASS}>{t}</h2>;
  }
  return (
    <h2 className={FIFTH_HEADING_BASE_CLASS}>
      <span className="text-white">
        {t.slice(0, i)}
        <span className="font-light italic text-white">
          {t.slice(i, i + EMPHASIS_5.length)}
        </span>
        {t.slice(i + EMPHASIS_5.length)}
      </span>
    </h2>
  );
}

const SIXTH_HEADING_BASE_CLASS =
  "mb-5 text-balance text-center text-[52px] font-normal leading-[50px] text-white [&_b]:font-bold [&_em]:italic [&_i]:italic [&_strong]:font-bold";

function SixthSectionHeading({ text }: { text: string }) {
  const raw = text.trim();
  if (!raw) return null;
  const t = decodeCommonWpHtmlEntities(raw);

  if (/<\s*(strong|b|i|em|br)\b/i.test(t)) {
    return (
      <h2
        className={SIXTH_HEADING_BASE_CLASS}
        dangerouslySetInnerHTML={{
          __html: sanitizeServiceLandingSection6Heading(t),
        }}
      />
    );
  }

  const i = t.toLowerCase().indexOf(EMPHASIS_6.toLowerCase());
  if (i === -1) {
    return <h2 className={SIXTH_HEADING_BASE_CLASS}>{t}</h2>;
  }
  return (
    <h2 className={SIXTH_HEADING_BASE_CLASS}>
      {i > 0 ? <span className="text-white">{t.slice(0, i)}</span> : null}
      <span className="font-extralight italic text-white">
        {t.slice(i, i + EMPHASIS_6.length)}
      </span>
      <span className="text-white">{t.slice(i + EMPHASIS_6.length)}</span>
    </h2>
  );
}

/** Splits e.g. "APROX TIME: 3 to 3.5 hours" into caps label + italic duration. */
function ApproxTimeLine({ time }: { time: string }) {
  const t = time.trim();
  const m = t.match(/^(APROX\s*TIME\s*:\s*)(.*)$/i);
  if (!m) {
    return (
      <p className="w-full min-w-0 text-right text-[18px] font-normal leading-[29px] text-white">
        {t}
      </p>
    );
  }
  const value = m[2]?.trim() ?? "";
  return (
    <p className="w-full min-w-0 max-w-full text-balance text-right text-[18px] font-normal leading-[29px] text-white">
      <span className="not-italic uppercase text-white/95">APROX TIME: </span>
      {value ? (
        <span className="whitespace-pre-wrap break-words pl-0.5 italic text-white">
          {value}
        </span>
      ) : null}
    </p>
  );
}

/**
 * Lighter top band + darker body, sharp edge between (matches apartment-type comp).
 */
function ApartmentTypeCard({
  title,
  time,
  body,
}: {
  title: string;
  time: string;
  body: string;
}) {
  const hasHeader = Boolean(title || time);
  return (
    <article className="mb-5 w-full min-w-0 last:mb-0 overflow-hidden rounded-2xl sm:rounded-3xl">
      {hasHeader ? (
        <div className="border-b border-white/10 bg-[#4A8E8E]/60 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-2">
            {title ? (
              <h3 className="min-w-0 flex-1 text-[37px] font-normal leading-[45px] text-white">
                {title}
              </h3>
            ) : (
              <span className="min-w-0 flex-1" />
            )}
            {time ? (
              <div className="shrink-0 self-start sm:ml-auto sm:max-w-[min(100%,20rem)]">
                <ApproxTimeLine time={time} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {body ? (
        <div className="bg-[#347C7C]/60 px-6 py-6 sm:px-8 sm:py-8">
          <p className="m-0 w-full min-w-0 text-left text-[18px] font-normal leading-[29px] text-white">
            {body}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function WhatToExpectList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="relative m-0 w-full min-w-0 list-none p-0">
      {items.map((line, index) => (
        <li
          key={index}
          className="group relative mb-4 w-full min-w-0 last:mb-0 sm:mb-5"
        >
          {/* Full-width row hover: linear #195b5d (left) → transparent (right) */}
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-l-full rounded-r-none
              border-0 opacity-0
              transition-all duration-300 ease-out
              group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(90deg, rgba(25,91,93,0.55) 0%, rgba(25,91,93,0.28) 30%, rgba(25,91,93,0.1) 55%, rgba(25,91,93,0.02) 75%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="relative z-10 flex w-full min-w-0
              items-stretch gap-4
              rounded-l-full rounded-r-2xl
              border border-transparent
              px-2.5
              py-2.5
              transition-all
              duration-300
              ease-out
              sm:gap-5
              sm:px-3.5
              sm:py-3
              group-hover:px-3
              group-hover:py-3.5
              sm:group-hover:px-4
              sm:group-hover:py-4"
          >
            <div className="relative isolate flex w-[5.5rem] shrink-0 flex-col items-center self-stretch sm:w-24">
              {index < items.length - 1 ? (
                <span
                  className="absolute left-1/2 top-20 z-[1] w-0 -translate-x-1/2 border-l-2 border-dotted border-white/25
                    h-[calc(100%-0.75rem)]"
                  aria-hidden
                />
              ) : null}
              <span
                className="relative z-20 flex h-20 w-20 shrink-0
                  items-center justify-center
                  rounded-full
                  border-2 border-white/50
                  bg-[#2a7a7c] p-2.5
                  text-center
                  text-[34px] font-normal
                  leading-[39px] tabular-nums
                  text-white/50
                  transition-all
                  duration-300
                  ease-out
                  sm:p-3
                  group-hover:border-white
                  group-hover:bg-white
                  group-hover:font-medium
                  group-hover:text-[#2a7a7c]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p
              className="m-0 min-w-0 flex-1 self-center
                py-1
                pl-0.5
                pr-1
                text-left text-[22px] font-normal
                leading-[36px]
                text-white/60
                transition-all
                duration-300
                ease-out
                sm:pr-1.5
                group-hover:text-white"
            >
              {line}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CtaButton({ label, href }: { label: string; href: string }) {
  const isExternal = /^https?:\/\//i.test(href);
  const className =
    "inline-flex h-12 min-w-0 max-w-full items-center justify-center gap-2 rounded-full bg-[#FFDA00] px-6 text-sm font-semibold text-[#1B5B5D] shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition hover:opacity-95 sm:px-8 sm:text-base";
  const child = (
    <>
      {label}
      <span className="text-base leading-none" aria-hidden>
        ↗
      </span>
    </>
  );
  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {child}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {child}
    </Link>
  );
}

type Props = {
  background?: WPImage | null;
  section5Heading?: string;
  section5Description?: string;
  buttonText?: string;
  buttonUrl?: string;
  apartmentTypes: ServiceLandingApartmentType[];
  serviceDisclaimer?: string;
  section6Heading?: string;
  section6SubHeading?: string;
  whatToExpect: ServiceLandingWhatToExpectItem[];
  whatToExpectDisclaimer?: string;
};

export function ServiceLandingFifthSixthSection({
  background,
  section5Heading,
  section5Description,
  buttonText,
  buttonUrl,
  apartmentTypes,
  serviceDisclaimer,
  section6Heading,
  section6SubHeading,
  whatToExpect,
  whatToExpectDisclaimer,
}: Props) {
  const h5 = section5Heading?.trim() ?? "";
  const d5 = section5Description?.replace(/\r\n/g, "\n").trim() ?? "";
  const types = apartmentTypes.filter((a) =>
    Boolean(
      a.apartment_type_name?.trim() ||
        a.approx_time?.trim() ||
        a.service_description?.trim(),
    ),
  );
  const h6 = section6Heading?.trim() ?? "";
  const s6 = section6SubHeading?.trim() ?? "";
  const steps = whatToExpect
    .map((r) => r.what_to_expect_points?.trim() ?? "")
    .filter(Boolean);
  const disc5 = serviceDisclaimer?.trim() ?? "";
  const disc6 = whatToExpectDisclaimer?.trim() ?? "";
  const btnLabel = buttonText?.trim() ?? "";
  const btnHref = buttonUrl?.trim() ?? "";
  const hasCta = Boolean(btnLabel && btnHref);

  const hasSection5 = Boolean(
    h5 || d5 || types.length > 0 || hasCta || disc5,
  );
  const hasSection6 = Boolean(
    h6 || s6 || steps.length > 0 || disc6,
  );

  const bgUrl = getAcfImageUrl(background);

  if (!hasSection5 && !hasSection6) {
    return null;
  }

  return (
    <section className="relative w-full min-h-0 text-white">
      <div className="relative w-full overflow-x-clip bg-[#2a7a7c]">
        {bgUrl ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 top-32 sm:top-40 md:top-56 lg:top-64">
            <Image
              src={bgUrl}
              alt={background?.alt?.trim() || ""}
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority={false}
              unoptimized={unoptimizedCmsUrl(bgUrl)}
            />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[#2a7a7c]"
            aria-hidden
          />
        )}

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
          {hasSection5 ? (
            <div className="mb-0">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:items-start md:gap-12 lg:gap-16">
                <div className="min-w-0 w-full max-w-sm space-y-5 md:pr-2">
                  {h5 ? <FifthSectionHeading text={h5} /> : null}
                  {d5 ? (
                    <p className="max-w-[40ch] text-[18px] font-normal leading-[29px] text-white/95">
                      {d5}
                    </p>
                  ) : null}
                  {hasCta ? <CtaButton label={btnLabel} href={btnHref} /> : null}
                </div>
                <div className="flex min-w-0 w-full flex-col">
                  {types.map((card, i) => {
                    const title = card.apartment_type_name?.trim() ?? "";
                    const time = card.approx_time?.trim() ?? "";
                    const body = card.service_description?.trim() ?? "";
                    if (!title && !body && !time) return null;
                    return (
                      <ApartmentTypeCard
                        key={i}
                        title={title}
                        time={time}
                        body={body}
                      />
                    );
                  })}
                  {disc5 ? (
                    <p
                      className={`${SECTION_DISCLAIMER_CLASS} mt-8 w-full sm:mt-10`}
                    >
                      {disc5}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          {hasSection5 ? <ServiceLandingSection5Separator /> : null}

          {hasSection6 ? (
            <div>
              <div className="mb-10 space-y-3 text-center sm:mb-12 md:mb-14">
                {h6 ? <SixthSectionHeading text={h6} /> : null}
                {s6 ? (
                  <p className="mx-auto max-w-3xl text-[16px] font-normal leading-relaxed text-white/95 sm:text-[17px]">
                    {s6}
                  </p>
                ) : null}
              </div>
              <div className="w-full min-w-0 md:pt-1">
                <WhatToExpectList items={steps} />
              </div>
              {disc6 ? (
                <p
                  className={`${SECTION_DISCLAIMER_CLASS} my-[100px]`}
                >
                  {disc6}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
