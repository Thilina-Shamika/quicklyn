import Image from "next/image";
import type { ReactNode } from "react";
import type { WPImage } from "@/types/wordpress";

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

type Props = {
  /** ACF `7th_section_8th_section_background` — shared art for sections 7–9. */
  background?: WPImage | null;
  children: ReactNode;
};

/**
 * One full-bleed block: fallback teal + optional cover image, then inner sections
 * (7, 8, 9) as `children`.
 */
export function ServiceLandingSections789Block({
  background,
  children,
}: Props) {
  const bgUrl = getAcfImageUrl(background);

  return (
    <section
      className="relative w-full min-h-0 text-white"
      aria-label="Additional service information"
    >
      <div className="relative w-full overflow-x-clip bg-[#2a7a7c]">
        {bgUrl ? (
          <div className="pointer-events-none absolute inset-0 z-0 min-h-full">
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
        ) : null}
        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
}
