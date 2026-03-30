import { buildPageMetadata } from "@/lib/seo";
import { getContactUsPage, getSocialLinks } from "@/lib/wordpress";
import type { WPSocialLink } from "@/lib/wordpress";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import Link from "next/link";

function ContactSocialIcon({ slug, className }: { slug: string; className?: string }) {
  const name = slug.toLowerCase();
  if (name.includes("linkedin")) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (name.includes("instagram")) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  if (name.includes("facebook")) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8a1 1 0 011 1z" />
    </svg>
  );
}

export const metadata = buildPageMetadata({
  title: "Contact Us | Quicklyn",
  description:
    "Get in touch with Quicklyn — questions, support, or booking help for NYC cleaning services.",
  path: "/contact-us",
});

export default async function ContactUsPage() {
  const [page, socialLinks] = await Promise.all([
    getContactUsPage(),
    getSocialLinks(),
  ]);

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Contact Us content is not available. Please ensure the WordPress page
          with ACF fields is published.
        </p>
      </main>
    );
  }

  const heading = page.acf.heading?.trim() || page.title.rendered;
  const description = page.acf.description?.trim() || "";
  const email = page.acf.email?.trim() || "";
  const phone = page.acf.phone_number?.trim() || "";

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <ContactPageContent>
      {/* Mobile */}
      <div className="relative z-10 mx-auto max-w-2xl px-8 pt-32 pb-12 md:hidden md:px-12 md:pt-44 md:pb-16">
        <header className="text-center">
          <h1
            className="font-semibold tracking-tight"
            style={{ fontSize: "43px" }}
          >
            {heading}
          </h1>
          {description && (
            <p className="mt-3 text-white/95" style={{ fontSize: "12px" }}>
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="rounded-xl border border-white/80 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ fontSize: "12px" }}
              >
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="rounded-xl border border-white/80 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ fontSize: "12px" }}
              >
                {phone}
              </a>
            )}
          </div>
        </header>

        <section className="mt-14">
          <ContactForm />
        </section>
      </div>

      {/* Desktop / tablet: two-column layout per design */}
      <div className="relative z-10 hidden min-h-screen md:flex md:items-center md:justify-center">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column: heading, description, contact details, social */}
            <div className="flex flex-col">
              <h1
                className="font-semibold tracking-tight text-white"
                style={{ fontSize: "clamp(42px,5vw,64px)", lineHeight: "1.1" }}
              >
                {heading}
              </h1>
              {description && (
                <p className="mt-4 text-lg leading-relaxed text-white/95 lg:text-xl">
                  {description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-2">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="block text-white transition hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
                      style={{ fontSize: "18px" }}
                    >
                      {email}
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="block text-white transition hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
                      style={{ fontSize: "18px" }}
                    >
                      {phone}
                    </a>
                  )}
                </div>
                {socialLinks.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm uppercase tracking-wider text-white/90">
                      Find us on,
                    </span>
                    <div className="flex items-center gap-4">
                      {socialLinks.map((item: WPSocialLink) => {
                        const url = item.acf?.social_media_link?.url?.trim();
                        const name = (item.acf?.social_media_name || item.title?.rendered || item.slug || "").trim();
                        const label = name || "Social link";
                        const target = item.acf?.social_media_link?.target || "_blank";
                        if (!url) return null;
                        return (
                          <Link
                            key={item.id}
                            href={url}
                            target={target}
                            rel={target === "_blank" ? "noopener noreferrer" : undefined}
                            className="text-white transition hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label={label}
                          >
                            <ContactSocialIcon slug={item.slug || name} className="h-6 w-6" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: form */}
            <div className="flex flex-col">
              <ContactForm layout="desktop" />
            </div>
          </div>
        </div>
      </div>
      </ContactPageContent>
    </main>
  );
}
