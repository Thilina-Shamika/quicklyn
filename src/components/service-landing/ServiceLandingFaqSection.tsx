import { ServiceLandingFaqAccordion } from "./ServiceLandingFaqAccordion";
import type { ServiceLandingFaqItem } from "@/types/wordpress";

/** Dashed horizontal rule that fades out toward the left and right edges. */
const FADED_DASHED_HAIRLINE =
  "h-px w-full shrink-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.9)_0,rgba(255,255,255,0.9)_7px,transparent_7px,transparent_14px)] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.35)_18%,rgba(0,0,0,1)_32%,rgba(0,0,0,1)_68%,rgba(0,0,0,0.35)_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.35)_18%,rgba(0,0,0,1)_32%,rgba(0,0,0,1)_68%,rgba(0,0,0,0.35)_82%,transparent_100%)]";

type Props = {
  heading?: string;
  items: ServiceLandingFaqItem[];
  accordionIdPrefix: string;
};

export function ServiceLandingFaqSection({
  heading,
  items,
  accordionIdPrefix,
}: Props) {
  const h = heading?.trim() ?? "";
  const faqItems = items.filter(
    (row) => (row.question ?? "").trim() || (row.answer ?? "").trim(),
  );

  if (!h && faqItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full min-h-0 text-white" data-section="faq">
      <div className={FADED_DASHED_HAIRLINE} aria-hidden />
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-start md:gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          {h ? (
            <h2 className="m-0 text-balance text-left text-[48px] font-medium leading-[1.2] text-white md:pt-1">
              {h}
            </h2>
          ) : (
            <div className="hidden md:block" aria-hidden />
          )}
          {faqItems.length > 0 ? (
            <ServiceLandingFaqAccordion
              items={faqItems}
              idPrefix={accordionIdPrefix}
            />
          ) : null}
        </div>
      </div>
      <div className={FADED_DASHED_HAIRLINE} aria-hidden />
    </div>
  );
}
