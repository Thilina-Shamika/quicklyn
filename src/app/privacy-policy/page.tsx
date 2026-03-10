import { getPrivacyPolicyPage } from "@/lib/wordpress";
import { TermsAccordion } from "@/components/terms/TermsAccordion";

export const metadata = {
  title: "Privacy Policy | Quicklyn",
  description: "Privacy policy for Quicklyn cleaning services.",
};

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicyPage();

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Privacy Policy content is not available. Please ensure the WordPress
          page with ACF fields is published.
        </p>
      </main>
    );
  }

  const heading =
    page.acf.page_heading?.trim() ||
    page.title?.rendered?.trim() ||
    "Privacy Policy";
  const termsList = page.acf.terms_list ?? [];

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      {/* Mobile layout (unchanged) */}
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20 md:hidden">
        <h1
          className="mb-12 text-center font-semibold uppercase tracking-wide"
          style={{ fontSize: "27px", lineHeight: "30px" }}
        >
          {heading}
        </h1>

        <TermsAccordion items={termsList} />
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

          <div className="mt-10">
            <TermsAccordion items={termsList} />
          </div>
        </div>
      </div>
    </main>
  );
}

