import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ServiceLandingWhyChooseItem, WPImage } from "@/types/wordpress";

const ACCENT = "Why Choose Quicklyn";

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

function EighthSectionHeading({ text }: { text: string }) {
  const t = text.trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  const idx = lower.indexOf(ACCENT.toLowerCase());
  if (idx === -1) {
    return (
      <h2 className="text-balance text-center text-[51px] font-light leading-[64px] text-white">
        {t}
      </h2>
    );
  }
  const endAccent = idx + ACCENT.length;
  const before = idx > 0 ? t.slice(0, idx) : "";
  const after = t.slice(endAccent);
  return (
    <h2 className="text-balance text-center text-[51px] font-light leading-[64px]">
      {before ? <span className="text-white">{before}</span> : null}
      <span className="text-[#ffda00]">{t.slice(idx, endAccent)}</span>
      <span className="text-white">{after}</span>
    </h2>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none text-lg text-white/50 ${className ?? ""}`}
      aria-hidden
    >
      ✦
    </span>
  );
}

/** Staggered, overlapping layout (md+) — order matches ACF: top row L→R, then bottom row L→R. */
const WHY_CHOOSE_CARD_LAYOUT: readonly string[] = [
  "md:absolute md:left-0 md:top-0 md:z-[28] md:w-[min(100%,20rem)] md:max-w-[48%] md:-rotate-12",
  "md:absolute md:left-1/2 md:top-[9%] md:z-[12] md:w-[min(100%,20rem)] md:max-w-[48%] md:-translate-x-1/2 md:-rotate-[3deg]",
  "md:absolute md:right-0 md:top-0 md:z-[28] md:w-[min(100%,20rem)] md:max-w-[48%] md:-rotate-[15deg]",
  "md:absolute md:left-[2%] md:top-[46%] md:z-[40] md:w-[min(100%,34rem)] md:max-w-[65%] md:-rotate-[8deg]",
  "md:absolute md:right-[0%] md:top-[48%] md:z-[24] md:w-[min(100%,20rem)] md:max-w-[48%] md:rotate-[7deg]",
];

function WhyChooseCard({
  text,
  icon,
  className,
}: {
  text: string;
  icon: WPImage | null | undefined;
  className?: string;
}) {
  const src = getAcfImageUrl(icon);
  return (
    <div
      className={cn(
        "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:gap-4 sm:px-5 sm:py-4",
        "max-md:mx-auto max-md:max-w-lg max-md:rotate-[-1deg]",
        className,
      )}
    >
      {src ? (
        <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
          <Image
            src={src}
            alt={icon?.alt?.trim() || ""}
            width={64}
            height={64}
            className="h-full w-full object-contain"
            unoptimized={unoptimizedCmsUrl(src)}
          />
        </div>
      ) : (
        <div className="h-12 w-12 shrink-0 rounded-lg bg-white/5 sm:h-14 sm:w-14" />
      )}
      <p className="m-0 min-w-0 flex-1 text-left text-[27px] font-light leading-[37px] text-white">
        {text}
      </p>
    </div>
  );
}

type Props = {
  section8Heading?: string;
  section8Description?: string;
  whyChooseItems: ServiceLandingWhyChooseItem[];
  whyChooseDisclaimer?: string;
};

export function ServiceLandingEighthSection({
  section8Heading,
  section8Description,
  whyChooseItems,
  whyChooseDisclaimer,
}: Props) {
  const h8 = section8Heading?.trim() ?? "";
  const d8 = section8Description?.replace(/\r\n/g, "\n").trim() ?? "";
  const items = whyChooseItems
    .map((row) => ({
      text: row.why_choose_text?.trim() ?? "",
      icon: row.why_choose_icon,
    }))
    .filter((x) => Boolean(x.text));
  const disc = whyChooseDisclaimer?.replace(/\r\n/g, "\n").trim() ?? "";

  const hasContent = Boolean(
    h8 || d8 || items.length > 0 || disc,
  );
  if (!hasContent) return null;

  const whyPrimary = items.slice(0, 5);
  const whyExtra = items.slice(5);

  return (
    <div
      className="relative w-full min-h-0 border-t border-white/10 text-white"
      data-section="8"
    >
      <div className="pointer-events-none absolute left-[4%] top-4 hidden h-20 w-24 opacity-80 sm:left-[6%] sm:block md:left-[8%] md:h-24 md:w-28">
        <Sparkle className="absolute left-0 top-0" />
        <Sparkle className="absolute left-1/2 top-8 -translate-x-1/2" />
      </div>
      <div className="pointer-events-none absolute right-[4%] top-2 hidden w-20 sm:right-[6%] sm:block md:right-[8%]">
        <Sparkle className="absolute right-0 top-0" />
        <Sparkle className="absolute right-4 top-10" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-[60px] sm:px-6 lg:px-8">
        {h8 ? <EighthSectionHeading text={h8} /> : null}
        {d8 ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-[15px] font-light leading-relaxed text-white/90 sm:mt-5 sm:text-[16px] md:mt-6">
            {d8}
          </p>
        ) : null}

        {whyPrimary.length > 0 ? (
          <div
            className="relative isolate mt-8 w-full min-h-0 sm:mt-10 md:mt-12 md:min-h-[26rem] md:pb-4 lg:min-h-[32rem] xl:min-h-[36rem]"
            aria-label="Why choose us"
          >
            {whyPrimary.map((row, i) => (
              <WhyChooseCard
                key={`why-${i}`}
                text={row.text}
                icon={row.icon}
                className={WHY_CHOOSE_CARD_LAYOUT[i] ?? "md:static"}
              />
            ))}
          </div>
        ) : null}
        {whyExtra.length > 0 ? (
          <div className="mt-6 flex w-full max-w-3xl flex-col gap-4 sm:mt-8">
            {whyExtra.map((row, i) => (
              <WhyChooseCard
                key={`why-extra-${i}`}
                text={row.text}
                icon={row.icon}
                className="md:mx-auto"
              />
            ))}
          </div>
        ) : null}

        {disc ? (
          <p className="mx-auto mt-10 max-w-3xl text-center text-[14px] font-light leading-relaxed text-white/85 sm:mt-12 sm:text-[15px] md:text-[16px]">
            {disc}
          </p>
        ) : null}
      </div>
    </div>
  );
}
