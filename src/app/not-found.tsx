import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | Quicklyn",
  description:
    "We couldn’t find that page. Explore Quicklyn’s cleaning services in NYC or head home.",
  robots: { index: false, follow: true },
};

const SUGGESTIONS: Array<{ href: string; label: string; hint: string }> = [
  {
    href: "/",
    label: "Home",
    hint: "Overview, services, and how to book",
  },
  {
    href: "/our-services",
    label: "Our services",
    hint: "Deep cleaning, apartment cleaning, move-in/out & more",
  },
  {
    href: "/book-a-cleaning",
    label: "Book a cleaning",
    hint: "Get an estimate and reserve a visit",
  },
  {
    href: "/contact-us",
    label: "Contact us",
    hint: "Questions, support, or partnership inquiries",
  },
  {
    href: "/blogs",
    label: "Blog",
    hint: "Tips, guides, and home care ideas",
  },
  {
    href: "/get-the-app",
    label: "Get the app",
    hint: "Download Quicklyn on iOS or Android",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#2a7a7c] px-6 pb-24 pt-28 text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="font-semibold tracking-[0.2em] text-[#ffda00]"
          style={{ fontSize: "13px" }}
        >
          404
        </p>
        <h1
          className="mt-3 font-semibold leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(32px, 8vw, 48px)" }}
        >
          This page isn’t here
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/85 md:text-[16px]">
          The link may be outdated, or the page may have moved. You can go back home or
          explore services below—we’re glad you’re here.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-[15px] font-medium text-white transition hover:bg-white/20"
        >
          Back to home
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="suggestions-heading">
        <h2
          id="suggestions-heading"
          className="text-center text-[18px] font-semibold text-white md:text-[20px]"
        >
          You might be looking for
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col rounded-2xl border border-[#76aaab] bg-[#1f6b6d] p-5 text-left transition hover:border-[#ffda00]/50 hover:bg-[#195b5d]"
              >
                <span className="text-[16px] font-semibold text-white">{item.label}</span>
                <span className="mt-1 text-[13px] leading-snug text-white/75">{item.hint}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-[#ffda00]">
                  Open
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
