import {
  decodeCommonWpHtmlEntities,
  sanitizeServiceLandingSection6Heading,
  sanitizeWordPressHtml,
} from "@/lib/sanitizeHtml";

const EMPHASIS_7 = "Apartment Cleaning";

const SEVENTH_HEADING_BASE_CLASS =
  "text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-tight text-white md:leading-[1.15] [&_b]:font-bold [&_em]:italic [&_i]:italic [&_strong]:font-bold";

function SeventhSectionHeading({ text }: { text: string }) {
  const raw = text.trim();
  if (!raw) return null;
  const t = decodeCommonWpHtmlEntities(raw);

  if (/<\s*(strong|b|i|em|br)\b/i.test(t)) {
    return (
      <h2
        className={SEVENTH_HEADING_BASE_CLASS}
        dangerouslySetInnerHTML={{
          __html: sanitizeServiceLandingSection6Heading(t),
        }}
      />
    );
  }

  const i = t.toLowerCase().indexOf(EMPHASIS_7.toLowerCase());
  if (i === -1) {
    return <h2 className={SEVENTH_HEADING_BASE_CLASS}>{t}</h2>;
  }
  return (
    <h2 className={SEVENTH_HEADING_BASE_CLASS}>
      {i > 0 ? <span className="text-white">{t.slice(0, i)}</span> : null}
      <span className="font-bold italic text-white">
        {t.slice(i, i + EMPHASIS_7.length)}
      </span>
      <span className="text-white">{t.slice(i + EMPHASIS_7.length)}</span>
    </h2>
  );
}

const STRUCTURE_CLASS =
  "m-0 text-[15px] font-light leading-relaxed text-white/95 sm:text-[16px] [&>p]:m-0 [&>p]:mb-2 [&>p]:text-[15px] [&>p]:text-white/90 [&>p]:last:mb-0 sm:[&>p]:text-[16px] [&_li]:pl-0.5 [&_strong]:font-bold [&_ul]:m-0 [&_ul]:mt-1.5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5";

type Props = {
  section7Heading?: string;
  section7Description?: string;
  structure?: string;
  bottomDescription?: string;
};

export function ServiceLandingSeventhSection({
  section7Heading,
  section7Description,
  structure: structureRaw,
  bottomDescription,
}: Props) {
  const h7 = section7Heading?.trim() ?? "";
  const d7 = section7Description?.replace(/\r\n/g, "\n").trim() ?? "";
  const structure = structureRaw?.trim() ?? "";
  const bottom = bottomDescription?.replace(/\r\n/g, "\n").trim() ?? "";
  const structureHtml = structure ? sanitizeWordPressHtml(structure) : "";

  const hasContent = Boolean(
    h7 || d7 || structureHtml || bottom,
  );
  if (!hasContent) return null;

  return (
    <div className="relative w-full min-h-0 text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-[60px] sm:px-6 lg:px-8">
        <div
          className="relative mx-auto w-full max-w-6xl rounded-[2.5rem] border border-white/80 px-6 pb-20 pt-9 sm:rounded-[2.75rem] sm:px-8 sm:pb-24 sm:pt-10 md:px-12 md:pb-28 md:pt-12 lg:rounded-[3rem] lg:px-14"
          data-section="7"
        >
          <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="min-w-0 space-y-4">
              {h7 ? <SeventhSectionHeading text={h7} /> : null}
              {d7 ? (
                <p className="max-w-prose text-[17px] font-light leading-relaxed text-white/90 sm:text-[18px]">
                  {d7}
                </p>
              ) : null}
            </div>
            {structureHtml ? (
              <div
                className={STRUCTURE_CLASS}
                dangerouslySetInnerHTML={{ __html: structureHtml }}
              />
            ) : null}
          </div>

          {bottom ? (
            <p
              className="absolute bottom-0 left-1/2 z-[1] w-[min(100%-1.5rem,40rem)] -translate-x-1/2 translate-y-1/2 bg-[#2a7a7c] px-3 py-0.5 text-center text-[15px] font-light leading-relaxed text-white/95 sm:px-4 sm:text-[16px]"
            >
              {bottom}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
