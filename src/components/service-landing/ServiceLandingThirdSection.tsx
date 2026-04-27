import Image from "next/image";
import { ServiceLandingThirdSectionAccordion } from "./ServiceLandingThirdSectionAccordion";
import type { ServiceLandingThirdAccordionItem, WPImage } from "@/types/wordpress";

function unoptimizedCmsUrl(url: string) {
  return (
    url.includes("quick.rootholdings") || url.includes("quicklyn-headless.local")
  );
}

/** ACF/REST may expose `url` (ACF) or `source_url` (raw media). */
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

function highlightServicesInLine(t: string) {
  const token = "Services";
  const i = t.indexOf(token);
  if (i === -1) {
    return <span className="text-white">{t}</span>;
  }
  return (
    <span className="text-white">
      {t.slice(0, i)}
      <span className="text-[#ffda00]">{token}</span>
      {t.slice(i + token.length)}
    </span>
  );
}

/** Highlights "Services" per line. Use newlines in CMS for an exact 3-line heading. */
function ThirdSectionHeadingText({ text }: { text: string }) {
  const t = text.trim();
  if (!t) return null;
  const lines = t
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return null;
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block text-balance">
          {highlightServicesInLine(line)}
        </span>
      ))}
    </>
  );
}

type Props = {
  heading?: string;
  description?: string;
  accordion: ServiceLandingThirdAccordionItem[];
  background?: WPImage | null;
  topCurve?: WPImage | null;
  bottomCurve?: WPImage | null;
};

function CurveOverlay({
  image,
  position,
}: {
  image: WPImage;
  position: "top" | "bottom";
}) {
  const url = getAcfImageUrl(image);
  if (!url) return null;
  const w = image.width > 0 ? image.width : 2560;
  const h = image.height > 0 ? image.height : 300;
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 z-10 w-full select-none drop-shadow-md ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
    >
      <Image
        src={url}
        alt={image.alt?.trim() || ""}
        width={w}
        height={h}
        className="block h-auto w-full max-w-none"
        sizes="100vw"
        priority={false}
        unoptimized={unoptimizedCmsUrl(url)}
      />
    </div>
  );
}

function ThirdSectionContentGrid({
  h,
  d,
  hasAccordion,
  accordion,
}: {
  h: string;
  d: string;
  hasAccordion: boolean;
  accordion: ServiceLandingThirdAccordionItem[];
}) {
  return (
    <div
      className={
        hasAccordion
          ? "grid w-full grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] md:items-start md:gap-12 lg:gap-16"
          : "grid w-full grid-cols-1 gap-6"
      }
    >
      <div className="min-w-0 self-start space-y-4 md:pr-2">
        {h ? (
          <h2 className="max-w-[16ch] text-balance text-[37px] font-normal leading-[47px] sm:max-w-[18ch] md:max-w-[20ch]">
            <ThirdSectionHeadingText text={h} />
          </h2>
        ) : null}
        {d ? (
          <p className="max-w-[52ch] text-[18px] font-normal leading-[33px] text-white/95">
            {d}
          </p>
        ) : null}
      </div>
      {hasAccordion ? (
        <div className="min-w-0 w-full self-start">
          <ServiceLandingThirdSectionAccordion items={accordion} />
        </div>
      ) : null}
    </div>
  );
}

export function ServiceLandingThirdSection({
  heading,
  description,
  accordion,
  background,
  topCurve,
  bottomCurve,
}: Props) {
  const h = heading?.trim() ?? "";
  const d = description?.replace(/\r\n/g, "\n").trim() ?? "";
  const hasText = Boolean(h || d);
  const hasAccordion = accordion.length > 0;
  const bgUrl = getAcfImageUrl(background);
  const topCurveUrl = getAcfImageUrl(topCurve);
  const bottomCurveUrl = getAcfImageUrl(bottomCurve);
  const hasTop = Boolean(topCurveUrl);
  const hasBottom = Boolean(bottomCurveUrl);
  if (!hasText && !hasAccordion && !hasTop && !hasBottom) {
    return null;
  }

  const hasLayeredBg = Boolean(bgUrl || hasTop || hasBottom);

  const mainPanelClass = hasLayeredBg
    ? "relative h-auto w-full overflow-x-clip overflow-y-visible bg-[#2a7a7c] text-white"
    : "relative h-auto w-full text-white";

  return (
    <section className="relative h-auto w-full min-h-0 text-white">
      <div className={mainPanelClass}>
        {bgUrl ? (
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={bgUrl}
              alt={background?.alt?.trim() || ""}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
              unoptimized={unoptimizedCmsUrl(bgUrl)}
            />
          </div>
        ) : hasLayeredBg ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[#2a7a7c]"
            aria-hidden
          />
        ) : null}

        {hasTop && topCurve ? (
          <CurveOverlay image={topCurve} position="top" />
        ) : null}
        {hasBottom && bottomCurve ? (
          <CurveOverlay image={bottomCurve} position="bottom" />
        ) : null}

        <div className="relative z-20 mx-auto h-auto w-full max-w-[1280px] shrink-0 px-5 py-[250px] sm:px-6 lg:px-8">
          <ThirdSectionContentGrid
            h={h}
            d={d}
            hasAccordion={hasAccordion}
            accordion={accordion}
          />
        </div>
      </div>
    </section>
  );
}
