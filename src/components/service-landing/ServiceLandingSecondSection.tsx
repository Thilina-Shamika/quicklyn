import Image from "next/image";
import type { ServiceLandingSecondItem, WPImage } from "@/types/wordpress";
import type { ReactNode } from "react";

function unoptimizedCmsUrl(url: string) {
  return (
    url.includes("quick.rootholdings") || url.includes("quicklyn-headless.local")
  );
}

function iconDims(img: WPImage) {
  return {
    width: img.width > 0 ? Math.min(img.width, 64) : 40,
    height: img.height > 0 ? Math.min(img.height, 64) : 40,
  };
}

function SecondSectionRowIcon({
  before,
  after,
  label,
}: {
  before?: WPImage;
  after?: WPImage;
  label: string;
}) {
  const primary = before?.url ? before : after?.url ? after : undefined;
  if (!primary?.url) return null;
  const hasSwap = Boolean(
    before?.url && after?.url && before.url !== after.url,
  );
  return (
    <div
      className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-white/[0.64] bg-white/10 shadow-none transition-all duration-300 group-hover/feat:border-white group-hover/feat:bg-white group-hover/feat:shadow-[0_0_28px_rgba(255,255,255,0.4)] md:h-20 md:w-20"
      aria-hidden
    >
      {hasSwap && before && after ? (
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            {...iconDims(before)}
            src={before.url}
            alt={before.alt || label}
            className="h-10 w-10 object-contain transition-opacity duration-300 group-hover/feat:opacity-0 md:h-12 md:w-12"
            unoptimized={unoptimizedCmsUrl(before.url)}
          />
          <Image
            {...iconDims(after)}
            src={after.url}
            alt={after.alt || label}
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 object-contain object-center opacity-0 transition-opacity duration-300 group-hover/feat:opacity-100 md:h-12 md:w-12"
            unoptimized={unoptimizedCmsUrl(after.url)}
          />
        </div>
      ) : (
        <Image
          {...iconDims(primary)}
          src={primary.url}
          alt={primary.alt || label}
          className="h-10 w-10 object-contain md:h-12 md:w-12"
          unoptimized={unoptimizedCmsUrl(primary.url)}
        />
      )}
    </div>
  );
}

/**
 * Yellow highlight for e.g. "$50 per hour", italic for parentheticals, matching the design.
 */
function RichSecondDescription({ text }: { text: string }): ReactNode {
  const re = /(\$[0-9,]+\s*per hour)|(\([^)]+\))/gi;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const r = new RegExp(re);
  while ((m = r.exec(text)) !== null) {
    if (m.index > last) {
      out.push(text.slice(last, m.index));
    }
    if (m[1]) {
      out.push(
        <span key={`h-${m.index}`} className="font-medium text-[#ffda00]">
          {m[1]}
        </span>,
      );
    } else if (m[2]) {
      out.push(
        <em key={`e-${m.index}`} className="text-white/95">
          {m[2]}{" "}
        </em>,
      );
    }
    last = r.lastIndex;
  }
  if (last < text.length) {
    out.push(text.slice(last));
  }
  return <>{out.length > 0 ? out : text}</>;
}

type Props = {
  items: ServiceLandingSecondItem[] | null | false | undefined;
};

function pickField(
  item: ServiceLandingSecondItem & Record<string, unknown>,
  key: string,
): string {
  const v = item[key];
  return typeof v === "string" ? v.trim() : "";
}

export function ServiceLandingSecondSection({ items: itemsIn }: Props) {
  // ACF can send `false` for "empty" repeaters; never call .filter on that.
  const items = Array.isArray(itemsIn) ? itemsIn : [];
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 mb-[20px] bg-[#2a7a7c] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <ul className="flex flex-col gap-8 sm:gap-2">
          {items.map((item, index) => {
            const itemRecord = item as ServiceLandingSecondItem &
              Record<string, unknown>;
            const desc =
              pickField(itemRecord, "2nd_section_description") ||
              pickField(itemRecord, "2nd_section_Description");
            const label =
              pickField(itemRecord, "heading") || pickField(itemRecord, "Heading");
            const before =
              item.before_hover?.url
                ? item.before_hover
                : item.image?.url
                  ? item.image
                  : undefined;
            const after = item.after_hover?.url ? item.after_hover : undefined;
            const rowA11yName =
              desc.length > 0
                ? `${label}. ${desc.replace(/\s+/g, " ").trim().slice(0, 200)}`
                : label;
            const rowId = `service-2nd-row-${index}`;
            return (
              <li
                key={`2nd-item-${String(label)}-${index}`}
                id={rowId}
                className="relative list-none"
                // Later rows stack above earlier ones at seams so a row cannot steal the next item’s input.
                style={{ zIndex: index + 1 }}
              >
                <a
                  href={`#${rowId}`}
                  className="group/feat text-inherit no-underline relative block w-full min-w-0 cursor-pointer overflow-visible rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50 sm:overflow-hidden sm:rounded-2xl"
                  aria-label={rowA11yName}
                >
                  <div
                    className="pointer-events-none absolute inset-0 -z-0 hidden rounded-2xl bg-gradient-to-r from-white/0 via-white/[0.12] to-white/0 opacity-0 transition-opacity duration-300 group-hover/feat:opacity-100 sm:block"
                    aria-hidden
                  />
                  <div
                    className="relative z-10 grid min-w-0 grid-cols-[72px_minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-x-4 gap-y-1.5 py-0 sm:grid-cols-[minmax(0,35fr)_minmax(0,10fr)_minmax(0,65fr)] sm:grid-rows-1 sm:items-stretch sm:gap-0 sm:py-6 md:py-7 lg:py-8"
                  >
                    <div className="col-start-2 row-start-1 flex min-h-0 w-full min-w-0 items-start justify-start pr-0 pb-0 sm:col-start-1 sm:row-start-1 sm:h-full sm:min-h-0 sm:justify-end sm:pb-0 sm:pr-2 sm:pl-0 md:pr-3">
                      <h3 className="min-w-0 text-balance text-left text-[14px] font-bold uppercase italic leading-snug tracking-wide transition-[font-weight] duration-200 group-hover/feat:font-semibold sm:text-right sm:text-[33px] sm:font-light sm:normal-case sm:tracking-tight sm:italic">
                        {label}
                      </h3>
                    </div>
                    <div className="relative col-start-1 row-span-2 row-start-1 flex min-h-0 w-full items-start justify-center self-stretch px-0 pb-0 sm:col-start-2 sm:row-span-1 sm:row-start-1 sm:h-full sm:min-h-0 sm:px-2 md:px-3">
                      {index < items.length - 1 ? (
                        <span
                          className="pointer-events-none absolute bottom-[-2rem] left-1/2 top-[72px] z-[5] w-0 -translate-x-1/2 border-l-2 border-dashed border-white/40 sm:hidden"
                          aria-hidden
                        />
                      ) : null}
                      <div className="relative z-10 mx-auto flex justify-center sm:mx-0">
                        <SecondSectionRowIcon
                          before={before}
                          after={after}
                          label={label}
                        />
                      </div>
                    </div>
                    <div className="col-start-2 row-start-2 flex min-h-0 w-full min-w-0 items-start justify-start pl-0 sm:col-start-3 sm:row-start-1 sm:h-full sm:min-h-0 sm:justify-start sm:pl-2 sm:pr-0 md:pl-3">
                      <p className="min-w-0 w-full max-w-[50ch] text-balance text-left text-[15px] leading-[24px] text-white/95 sm:pl-1 sm:text-[17px] sm:leading-[30px] md:text-[18px] md:leading-[33px]">
                        {desc ? <RichSecondDescription text={desc} /> : null}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
