import {
  isLikelyServiceLandingHtml,
  ServiceLandingRichText,
} from "@/components/service-landing/ServiceLandingRichText";
import {
  decodeCommonWpHtmlEntities,
  sanitizeHomeHeadingInline,
} from "@/lib/sanitizeHtml";

const HEADING_CLASS =
  "text-balance text-[46px] font-normal leading-[1.15] text-white [&_a]:font-medium [&_a]:text-[#ffda00] [&_a]:underline [&_b]:font-bold [&_em]:italic [&_i]:italic [&_strong]:font-bold [&_u]:underline";

function ExtraPointsHeading({ text }: { text: string }) {
  const raw = text.trim();
  if (!raw) return null;
  const t = decodeCommonWpHtmlEntities(raw);

  if (isLikelyServiceLandingHtml(t)) {
    return (
      <h3
        className={HEADING_CLASS}
        dangerouslySetInnerHTML={{
          __html: sanitizeHomeHeadingInline(t),
        }}
      />
    );
  }

  return <h3 className={HEADING_CLASS}>{t}</h3>;
}

type Props = {
  heading?: string;
  description?: string;
  points: string[];
};

export function ServiceLandingExtraPointsSection({
  heading,
  description,
  points,
}: Props) {
  const hasHeading = Boolean(heading?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasPoints = points.length > 0;

  if (!hasHeading && !hasDescription && !hasPoints) return null;

  return (
    <div className="border-b border-white/25">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
          {(hasHeading || hasDescription) && (
            <div className="min-w-0 space-y-5 md:space-y-6">
              {hasHeading ? <ExtraPointsHeading text={heading!} /> : null}
              {hasDescription ? (
                isLikelyServiceLandingHtml(description!) ? (
                  <ServiceLandingRichText
                    content={description!}
                    className="text-[16px] font-normal leading-[1.65] text-white/95 sm:text-[17px] md:text-[18px] md:leading-[29px] [&_p:last-child]:mb-0"
                  />
                ) : (
                  <p className="text-[16px] font-normal leading-[1.65] text-white/95 sm:text-[17px] md:text-[18px] md:leading-[29px]">
                    {description}
                  </p>
                )
              ) : null}
            </div>
          )}

          {hasPoints ? (
            <ul className="m-0 list-none space-y-3 p-0 md:pt-1 lg:space-y-4">
              {points.map((point, i) => (
                <li key={`${point}-${i}`} className="flex gap-3.5">
                  <span
                    className="mt-[0.55em] inline-block h-2 w-2 min-w-2 shrink-0 rounded-full bg-white"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 text-[16px] font-normal leading-[1.65] text-white sm:text-[17px] md:text-[18px] md:leading-[29px]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
