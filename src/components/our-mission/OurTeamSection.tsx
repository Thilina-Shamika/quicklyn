interface OurTeamSectionProps {
  /** When set, shows this image in place of the team block (profile pics removed). */
  ourTeamStaticImageUrl?: string | null;
  backgroundCheckIconUrl: string | undefined;
  backgroundCheckHeading: string;
  backgroundCheckDescription: string;
}

export function OurTeamSection({
  ourTeamStaticImageUrl,
  backgroundCheckIconUrl,
  backgroundCheckHeading,
  backgroundCheckDescription,
}: OurTeamSectionProps) {
  const hasStaticImage = Boolean(ourTeamStaticImageUrl);
  const hasBackgroundCheck =
    backgroundCheckHeading || backgroundCheckDescription || backgroundCheckIconUrl;

  if (!hasStaticImage && !hasBackgroundCheck) return null;

  return (
    <section className="relative z-10 -mt-10 px-6 pb-0 pt-0 md:mt-0 md:-mt-24 md:pb-0">
      <div className="mx-auto max-w-5xl">
        {/* Our Team heading + line */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white md:hidden">
            Our Team
          </h2>
          <h2
            className="hidden font-semibold text-white md:block"
            style={{ fontSize: "100px", lineHeight: "80px" }}
          >
            Our Team
          </h2>
          <span
            className="h-px flex-1 max-w-[120px] bg-white/60"
            aria-hidden
          />
        </div>

        {/* Our Team: static image only (profile pics removed) */}
        {hasStaticImage && (
          <div className="mt-8 md:mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ourTeamStaticImageUrl!}
              alt="Our team"
              className="w-full max-w-full object-contain object-left"
            />
          </div>
        )}

        {/* Background Checked Team — mobile (unchanged) */}
        {hasBackgroundCheck && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-row flex-wrap items-center gap-3 md:gap-4">
              {backgroundCheckIconUrl && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={backgroundCheckIconUrl}
                    alt=""
                    className="h-16 w-16 object-contain md:h-20 md:w-20"
                    aria-hidden
                  />
                </div>
              )}
              {backgroundCheckHeading && (
                <h3
                  className="max-w-[12rem] font-bold text-white text-left md:max-w-[14rem]"
                  style={{ fontSize: "17px", lineHeight: "21px" }}
                >
                  {backgroundCheckHeading}
                </h3>
              )}
            </div>
            {backgroundCheckDescription && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/95 md:mt-4 md:text-base">
                {backgroundCheckDescription}
              </p>
            )}
          </div>
        )}

        {/* Background Checked Team — desktop: horizontal block, heading 2 lines, 33/37px semibold, description 16/25px regular */}
        {hasBackgroundCheck && (
          <div className="mt-4 hidden px-6 py-6 md:block lg:px-8 lg:py-8">
            <div className="flex flex-row flex-wrap items-center gap-6 lg:gap-8">
              {backgroundCheckIconUrl && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={backgroundCheckIconUrl}
                    alt=""
                    className="h-16 w-16 object-contain [filter:brightness(0)_invert(1)] lg:h-20 lg:w-20"
                    aria-hidden
                  />
                </div>
              )}
              {backgroundCheckHeading && (
                <h3
                  className="flex-1 font-semibold text-white"
                  style={{ fontSize: "33px", lineHeight: "37px" }}
                >
                  {(() => {
                    const t = backgroundCheckHeading.trim();
                    if (t === "Background Checked Team")
                      return (
                        <>
                          <span className="block">Background</span>
                          <span className="block">Checked Team</span>
                        </>
                      );
                    const words = t.split(/\s+/);
                    if (words.length <= 2)
                      return words.map((w, i) => (
                        <span key={i} className="block">
                          {w}
                        </span>
                      ));
                    return (
                      <>
                        <span className="block">{words[0]}</span>
                        <span className="block">{words.slice(1).join(" ")}</span>
                      </>
                    );
                  })()}
                </h3>
              )}
              {backgroundCheckDescription && (
                <p
                  className="max-w-xl flex-1 font-normal text-white"
                  style={{ fontSize: "16px", lineHeight: "25px" }}
                >
                  {backgroundCheckDescription}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
