import Image from "next/image";
import Link from "next/link";
import type { WPImage } from "@/types/wordpress";

function splitHeading(heading: string): { first: string; second: string | null } {
  const t = heading.trim();
  if (!t) return { first: "", second: null };
  const words = t.split(/\s+/);
  if (words.length === 1) return { first: words[0]!, second: null };
  return {
    first: words.slice(0, -1).join(" "),
    second: words[words.length - 1]!,
  };
}

type Props = {
  heading: string;
  description1: string;
  description2: string;
  image?: WPImage | null;
};

export function ServiceLandingFirstSection({
  heading,
  description1,
  description2,
  image,
}: Props) {
  const { first, second } = splitHeading(heading);
  const rightParagraphs = description2
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const imageUrl = image?.url;
  const alt = image?.alt?.trim() || heading;
  const imageWidth = image?.width && image.width > 0 ? image.width : 1200;
  const imageHeight = image?.height && image.height > 0 ? image.height : 900;

  return (
    <section className="mt-0 mb-0 bg-[#2a7a7c] pb-0">
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-0 pt-44 text-white sm:px-6 sm:pt-48 md:pt-52 lg:px-8 lg:pt-60">
        <Link
          href="/our-services"
          className="mb-8 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/95 hover:text-white"
        >
          <span className="text-sm leading-none" aria-hidden>
            &lt;
          </span>
          All services
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[13fr_7fr] md:items-start md:gap-10 lg:gap-12">
          {/* Left column: heading, then 2 sub-columns (1st desc | image) */}
          <div className="min-w-0 space-y-0">
            <h1 className="font-sans leading-[0.9] text-white">
              <span className="block font-semibold tracking-tight text-[clamp(2.75rem,7vw+1.25rem,111px)] lg:text-[111px]">
                {first}
              </span>
              {second && (
                <span className="mt-1 block font-extralight italic tracking-tight text-[clamp(2.25rem,5.5vw+1rem,86px)] lg:text-[86px]">
                  {second}
                </span>
              )}
            </h1>
            <div className="mt-6 grid grid-cols-1 gap-8 translate-y-0 sm:-mt-11 sm:-translate-y-[45px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] sm:items-center sm:gap-5 md:-mt-14 lg:-mt-[4.5rem] lg:gap-6">
              <div className="min-w-0 text-[18px] leading-[33px] text-white/95 max-sm:mt-[20px]">
                {description1}
              </div>
              {imageUrl ? (
                <div className="mx-auto w-full min-w-0 max-w-[min(100%,40rem)] sm:mx-0 sm:ml-auto sm:max-w-[36rem]">
                  <Image
                    src={imageUrl}
                    alt={alt}
                    width={imageWidth}
                    height={imageHeight}
                    sizes="(max-width: 640px) min(100vw, 28rem), (max-width: 1280px) 42vw, 600px"
                    className="h-auto w-full max-w-full object-contain"
                    priority
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Right column: 2nd description */}
          <div className="min-w-0 w-full max-w-[50ch] space-y-4 text-[18px] leading-[33px] text-white/95">
            {rightParagraphs.map((p, i) => (
              <p key={i} className="text-balance">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
