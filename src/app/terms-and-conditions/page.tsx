import { buildPageMetadata } from "@/lib/seo";
import { getTermsPage } from "@/lib/wordpress";
import { sanitizeWordPressHtml } from "@/lib/sanitizeHtml";

export const metadata = buildPageMetadata({
  title: "Terms & Conditions | Quicklyn",
  description: "Terms and conditions for Quicklyn cleaning services.",
  path: "/terms-and-conditions",
});

export default async function TermsAndConditionsPage() {
  const page = await getTermsPage();
  const bodyHtml = page?.content?.rendered?.trim() ?? "";

  if (!page || !bodyHtml) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Terms &amp; Conditions content is not available. Please ensure the
          WordPress page is published.
        </p>
      </main>
    );
  }

  const heading =
    page.acf?.page_heading?.trim() ||
    page.title?.rendered?.trim() ||
    "Terms & Conditions";

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      {/* Mobile layout */}
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20 md:hidden">
        <h1
          className="mb-12 text-center font-semibold uppercase tracking-wide"
          style={{ fontSize: "27px", lineHeight: "30px" }}
        >
          {heading}
        </h1>

        <div
          className="blog-article-content"
          dangerouslySetInnerHTML={{ __html: sanitizeWordPressHtml(bodyHtml) }}
        />
      </div>

      {/* Desktop / tablet layout */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-[1180px] px-6 pt-44 pb-28 lg:pt-48">
          <h1
            className="capitalize text-left font-semibold text-white"
            style={{ fontSize: "64px", lineHeight: "72px" }}
          >
            {heading}
          </h1>

          <div
            className="blog-article-content mt-10"
            dangerouslySetInnerHTML={{ __html: sanitizeWordPressHtml(bodyHtml) }}
          />
        </div>
      </div>
    </main>
  );
}
