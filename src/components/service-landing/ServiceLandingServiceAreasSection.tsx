import type { ServiceLandingServiceAreaItem } from "@/types/wordpress";
import {
  isLikelyServiceLandingHtml,
  ServiceLandingRichText,
} from "@/components/service-landing/ServiceLandingRichText";
import { cn } from "@/lib/utils";

function ServiceAreaPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

/** Distribute items into up to `maxColumns` columns, filling column 1 first; never returns empty trailing columns. */
function chunkIntoColumns<T>(items: T[], maxColumns: number): T[][] {
  const n = items.length;
  if (n === 0) {
    return [];
  }
  const columnCount = Math.min(Math.max(1, maxColumns), n);
  const perCol = Math.ceil(n / columnCount);
  const columns: T[][] = [];
  for (let c = 0; c < columnCount; c++) {
    const start = c * perCol;
    const end = Math.min(start + perCol, n);
    columns.push(items.slice(start, end));
  }
  return columns;
}

function gridColsClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-3";
  return "grid-cols-4";
}

function splitServiceAreaHeading(raw: string): { primary: string; secondary: string } {
  const t = raw.replace(/\s{2,}/g, " ").trim();
  if (!t) return { primary: "", secondary: "" };
  const m = t.match(/^(.+?)\s+in\s+(.+)$/i);
  if (m) {
    return {
      primary: m[1]!.trim(),
      secondary: `In ${m[2]!.trim()}`,
    };
  }
  return { primary: t, secondary: "" };
}

type Props = {
  heading?: string;
  description?: string;
  items: ServiceLandingServiceAreaItem[];
};

function AreaColumns({
  names,
  maxColumns,
  className,
}: {
  names: string[];
  maxColumns: number;
  className?: string;
}) {
  const cols = chunkIntoColumns(names, maxColumns);
  const colCount = cols.length;
  return (
    <div className={cn(className, gridColsClass(colCount))}>
      {cols.map((col, ci) => (
        <ul
          key={ci}
          className="min-w-0 list-none space-y-0 p-0"
          role="list"
        >
          {col.map((name, ri) => (
            <li
              key={`${ci}-${ri}-${name}`}
              className={`flex items-center gap-2.5 border-white/35 py-3 first:pt-0 lg:py-3.5 ${
                ri < col.length - 1 ? "border-b" : ""
              }`}
            >
              <ServiceAreaPinIcon className="h-4 w-4 shrink-0 text-white" />
              <span className="text-left text-[13px] font-normal uppercase leading-snug tracking-[0.04em] text-white sm:text-sm">
                {name}
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function ServiceLandingServiceAreasSection({
  heading,
  description,
  items,
}: Props) {
  const primaryHeading = heading?.replace(/\s{2,}/g, " ").trim() ?? "";
  const primaryDescription = description?.replace(/\r\n/g, "\n").trim() ?? "";
  const names = items
    .map((row) => row.service_area_name?.replace(/\s{2,}/g, " ").trim())
    .filter((s): s is string => Boolean(s));

  if (!primaryHeading && !primaryDescription && names.length === 0) {
    return null;
  }

  const { primary: titleLine1, secondary: titleLine2 } =
    splitServiceAreaHeading(primaryHeading);

  const hasHeadingBlock = Boolean(titleLine1);
  const hasIntroRow = hasHeadingBlock || Boolean(primaryDescription);
  const introGridClass =
    hasHeadingBlock && primaryDescription
      ? "lg:grid-cols-2 lg:gap-x-14 lg:gap-y-10"
      : "lg:grid-cols-1";

  return (
    <section
      className="relative w-full bg-[#2a787a] text-white"
      aria-labelledby={hasHeadingBlock ? "service-areas-heading" : undefined}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:px-8 md:pb-[120px] md:pt-[150px]">
        {hasIntroRow ? (
          <div className={`grid gap-8 lg:items-start ${introGridClass}`}>
            <div className="max-w-xl lg:max-w-none">
              {titleLine1 ? (
                <h2 id="service-areas-heading" className="m-0 p-0">
                  <span className="block text-[54px] font-bold italic leading-[63px] tracking-tight text-white">
                    {titleLine1}
                  </span>
                  {titleLine2 ? (
                    <span className="mt-1 block text-[54px] font-normal leading-[63px] tracking-tight text-white">
                      {titleLine2}
                    </span>
                  ) : null}
                </h2>
              ) : null}
            </div>
            {primaryDescription ? (
              isLikelyServiceLandingHtml(primaryDescription) ? (
                <ServiceLandingRichText
                  content={primaryDescription}
                  className="m-0 max-w-none text-[18px] font-normal leading-[31px] text-white lg:pt-1 [&_p]:mb-3 [&_p:last-child]:mb-0"
                />
              ) : (
                <p className="m-0 max-w-none text-[18px] font-normal leading-[31px] text-white lg:pt-1">
                  {primaryDescription}
                </p>
              )
            ) : null}
          </div>
        ) : null}

        {names.length > 0 ? (
          <>
            <AreaColumns
              names={names}
              maxColumns={4}
              className="mt-10 hidden gap-8 lg:grid lg:gap-10"
            />
            <AreaColumns
              names={names}
              maxColumns={2}
              className="mt-10 hidden gap-x-8 sm:grid sm:gap-y-0 lg:hidden"
            />
            <AreaColumns
              names={names}
              maxColumns={1}
              className="mt-10 grid sm:hidden"
            />
          </>
        ) : null}
      </div>
    </section>
  );
}
