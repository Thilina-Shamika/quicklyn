import type { OurMissionTeamItem } from "@/types/wordpress";

function StarRating({
  count = 5,
  size = "md",
}: {
  count?: number;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex justify-center gap-0.5" aria-hidden>
      {Array.from({ length: Math.min(5, Math.max(0, count)) }).map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} text-[#FFDA00]`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface OurTeamSectionProps {
  team: OurMissionTeamItem[];
  backgroundCheckIconUrl: string | undefined;
  backgroundCheckHeading: string;
  backgroundCheckDescription: string;
}

export function OurTeamSection({
  team,
  backgroundCheckIconUrl,
  backgroundCheckHeading,
  backgroundCheckDescription,
}: OurTeamSectionProps) {
  const hasTeam = team?.length > 0;
  const hasBackgroundCheck =
    backgroundCheckHeading || backgroundCheckDescription || backgroundCheckIconUrl;

  if (!hasTeam && !hasBackgroundCheck) return null;

  return (
    <section className="relative z-10 -mt-20 pl-8 pr-6 pb-24 pt-0 md:px-6 md:-mt-24 md:pb-32">
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

        {/* Team member row - overlapping circles, name & stars inside, no scrollbar */}
        {hasTeam && (
          <div className="no-scrollbar -mx-6 mt-8 overflow-x-auto pb-2 md:mt-10">
            <div className="flex py-2 pl-6">
              {team.map((member, index) => {
                const imgUrl = member.employee_image?.url;
                const name = member.employee_name?.trim() || "Team member";
                const stars = member.rating_stars
                  ? parseInt(member.rating_stars, 10)
                  : 5;
                return (
                  <div
                    key={`${member.employee_name ?? index}-${index}`}
                    className="relative flex-shrink-0 overflow-visible"
                    style={{
                      marginLeft: index === 0 ? 0 : "-1.75rem",
                      zIndex: team.length - index,
                    }}
                  >
                    <div
                      className="relative h-44 w-44 overflow-hidden rounded-full md:h-56 md:w-56"
                      style={{
                        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.25))",
                      }}
                    >
                      {imgUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={imgUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/10" />
                      )}
                      {/* Name and stars inside circle - bottom overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end rounded-b-full bg-gradient-to-t from-black/75 via-black/40 to-transparent px-2 pb-3 pt-8"
                        aria-hidden
                      >
                        <p className="text-center text-xs font-medium text-white drop-shadow-md md:text-sm">
                          {name}
                        </p>
                        <div className="mt-0.5">
                          <StarRating
                            count={isNaN(stars) ? 5 : stars}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
