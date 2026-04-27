type Props = {
  finalThoughtsHeading?: string;
  finalThoughtsDescription?: string;
};

export function ServiceLandingNinthSection({
  finalThoughtsHeading,
  finalThoughtsDescription,
}: Props) {
  const h9 = finalThoughtsHeading?.trim() ?? "";
  const raw = finalThoughtsDescription?.replace(/\r\n/g, "\n").trim() ?? "";
  const paragraphs = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!h9 && paragraphs.length === 0) return null;

  return (
    <div
      className="w-full min-h-0 border-t border-white/10 text-white"
      data-section="9"
    >
      <div className="mx-auto w-full max-w-6xl border-b border-dashed border-white/25 px-5 py-[60px] sm:px-6 lg:px-8">
        {h9 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:items-start md:gap-12 lg:gap-16">
            <h2 className="m-0 text-balance text-[67px] font-semibold leading-[64px] text-white">
              {h9}
            </h2>
            <div className="min-w-0 space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="m-0 text-[16px] font-light leading-[1.65] text-white/95 sm:text-[17px] md:leading-8"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-w-0 space-y-4">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="m-0 text-[16px] font-light leading-[1.65] text-white/95 sm:text-[17px] md:leading-8"
              >
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
