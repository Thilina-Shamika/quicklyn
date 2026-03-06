import Image from "next/image";
import Link from "next/link";
import type { WPGetEstimate } from "@/types/wordpress";
import { mapWordPressUrlToNextPath } from "@/lib/wordpress";

interface GetEstimateButtonProps {
  estimate: WPGetEstimate | null;
  fallbackText: string;
  fallbackHref?: string;
}

export function GetEstimateButton({
  estimate,
  fallbackText,
  fallbackHref = "/book-a-cleaning",
}: GetEstimateButtonProps) {
  const before = estimate?.acf?.before_hover || null;
  const after = estimate?.acf?.after_hover || null;
  const targetUrl =
    mapWordPressUrlToNextPath(estimate?.acf?.link?.url || "") ||
    fallbackHref;

  const hasImages = before?.url && after?.url;

  return (
    <Link
      href={targetUrl}
      className="fixed left-1/2 z-[99999] flex h-12 w-[224px] -translate-x-1/2 items-center justify-center rounded-full focus:outline-none group"
      style={{
        minWidth: "224px",
        bottom: "max(36px, env(safe-area-inset-bottom, 0px) + 32px)",
        backgroundColor: hasImages ? "transparent" : "#FFDA00",
      }}
    >
      {hasImages ? (
        <div className="relative h-12 w-[224px]">
          <Image
            src={before.url}
            alt={before.alt || fallbackText}
            fill
            className="object-contain object-center opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0"
            sizes="224px"
          />
          <Image
            src={after.url}
            alt={after.alt || fallbackText}
            fill
            className="object-contain object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            sizes="224px"
          />
        </div>
      ) : (
        <span className="text-base font-semibold text-[#1B5B5D]">
          {fallbackText}
        </span>
      )}
    </Link>
  );
}

