"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { WPFooter, WPAppLink, WPSocialLink } from "@/lib/wordpress";
import { mapWordPressUrlToNextPath } from "@/lib/wordpress";

interface FooterProps {
  data: WPFooter | null;
  appLink: WPAppLink | null;
  socialLinks?: WPSocialLink[];
}

function highlightNewYork(text: string) {
  if (!text) return null;
  const parts = text.split(/\b(New York)\b/i);
  return (
    <>
      {parts.map((part, i) =>
        /^New York$/i.test(part) ? (
          <strong key={i}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SocialIcon({ slug, className }: { slug: string; className?: string }) {
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
  if (name.includes("twitter") || name.includes("x.com")) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8a1 1 0 011 1z" />
    </svg>
  );
}

export function Footer({ data, appLink, socialLinks = [] }: FooterProps) {
  if (!data?.acf) return null;

  const pathname = usePathname();
  const isCareersPage = pathname === "/careers";

  const acf = data.acf;
  const logo = acf.logo?.url;
  const description = acf.footer_description?.trim() || "";
  const navItems = acf.footer_navigation ?? [];
  const leftNav = navItems.slice(0, 6);
  const rightNav = navItems.slice(6, 12);
  const contactEmail = acf.contact_email?.trim() || "";
  const contactPhone = acf.contact_phone?.trim() || "";
  const subscriptionText = acf.subscription_text?.trim() || "Sign Up To Our Newsletter";
  const downloadText = acf.download_text?.trim() || "Download The Quicklyn App Today";
  const copyrightText = acf.copyright_and_branding?.trim() || "Copyright ©2025 Quicklyn | All rights reserved.";

  const googlePlayUrl = appLink?.acf?.image_01?.url;
  const appStoreUrl = appLink?.acf?.image_02?.url;
  const googlePlayLink = appLink?.acf?.link_01?.url || "#";
  const link02 = appLink?.acf?.link_02;
  const appStoreLink =
    typeof link02 === "string" ? link02 : (link02 as { url?: string } | undefined)?.url ?? "#";
  const isLocal =
    (googlePlayUrl &&
      (googlePlayUrl.includes("quicklyn-headless.local") ||
        googlePlayUrl.includes("quick.rootholdings"))) ||
    (appStoreUrl &&
      (appStoreUrl.includes("quicklyn-headless.local") ||
        appStoreUrl.includes("quick.rootholdings")));
  const footerBgUrl = acf.footer_background?.url;
  const footerBgDesktopUrl = acf.footer_background_desktop?.url;
  const footerBgIsLocal =
    (footerBgUrl &&
      (footerBgUrl.includes("quicklyn-headless.local") ||
        footerBgUrl.includes("quick.rootholdings"))) ||
    (footerBgDesktopUrl &&
      (footerBgDesktopUrl.includes("quicklyn-headless.local") ||
        footerBgDesktopUrl.includes("quick.rootholdings")));

  return (
    <footer
      className={`relative w-full overflow-hidden text-white ${
        isCareersPage ? "z-20 md:-mt-[320px] lg:-mt-[420px]" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block" aria-hidden />
      {footerBgUrl && (
        <div className="pointer-events-none absolute inset-0 z-0 md:hidden" aria-hidden>
          <Image
            src={footerBgUrl}
            alt=""
            fill
            className="object-cover object-left-top"
            sizes="100vw"
            unoptimized={!!footerBgIsLocal}
          />
        </div>
      )}
      {(footerBgDesktopUrl || footerBgUrl) && (
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block" aria-hidden>
          <Image
            src={footerBgDesktopUrl || footerBgUrl || ""}
            alt=""
            fill
            className="object-cover object-left-top"
            sizes="100vw"
            unoptimized={!!footerBgIsLocal}
          />
        </div>
      )}
      <div className="relative z-10 hidden md:block">
        <div className="mx-auto flex min-h-[720px] max-w-[1320px] items-center px-10 pb-[70px] pt-[110px] lg:min-h-[820px] lg:px-14 lg:pb-[70px] lg:pt-[130px]">
          <div className="grid w-full translate-y-8 grid-cols-[260px_1px_minmax(0,1fr)] gap-10 lg:translate-y-10 lg:grid-cols-[300px_1px_minmax(0,1fr)] lg:gap-14">
            <div className="flex min-h-[360px] flex-col">
              <div>
                {logo && (
                  <Link href="/" className="mb-5 inline-block">
                    <Image
                      src={logo}
                      alt="Quicklyn"
                      width={140}
                      height={32}
                      className="h-8 w-auto object-contain"
                      unoptimized={
                        logo.includes("quicklyn-headless.local") ||
                        logo.includes("quick.rootholdings")
                      }
                    />
                  </Link>
                )}
                {description && (
                  <p className="max-w-[210px] text-[12px] leading-relaxed text-white/90">
                    {highlightNewYork(description)}
                  </p>
                )}
              </div>

              <div className="mt-auto pt-12">
                <p className="mb-3 text-[11px] text-white/75">{subscriptionText}</p>
                <form
                  className="flex w-full max-w-[210px] overflow-hidden rounded border border-white/35"
                  onSubmit={(e) => e.preventDefault()}
                  data-lpignore="true"
                  data-form-type="other"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-[72%] min-w-0 border-0 bg-transparent px-3 py-2 text-[11px] text-white placeholder:text-white/45 focus:outline-none focus:ring-0"
                    aria-label="Email for newsletter"
                    autoComplete="off"
                    data-lpignore="true"
                  />
                  <button
                    type="submit"
                    className="w-[28%] shrink-0 border-l border-white/35 bg-white px-2 py-2 text-[9px] font-medium uppercase tracking-wide text-[#141414]"
                  >
                    Submit
                  </button>
                </form>
                <p className="mt-7 max-w-[240px] text-[10px] text-white/55">{copyrightText}</p>
              </div>
            </div>

            <div className="w-px self-stretch bg-white/20" />

            <div className="flex min-h-[360px] flex-col">
              <div className="grid grid-cols-3 gap-x-10 gap-y-3 pt-4 lg:gap-x-14">
                <nav className="flex flex-col gap-3" aria-label="Footer navigation">
                  {leftNav.map((item) => {
                    const href = mapWordPressUrlToNextPath(item.page_link?.url);
                    return (
                      <Link
                        key={item.menu_name}
                        href={href}
                        className="text-[12px] text-white/90 transition hover:text-white"
                      >
                        {item.menu_name}
                      </Link>
                    );
                  })}
                </nav>
                <nav className="flex flex-col gap-3" aria-label="Footer navigation secondary">
                  {rightNav.slice(0, Math.ceil(rightNav.length / 2)).map((item) => {
                    const href = mapWordPressUrlToNextPath(item.page_link?.url);
                    return (
                      <Link
                        key={item.menu_name}
                        href={href}
                        className="text-[12px] text-white/90 transition hover:text-white"
                      >
                        {item.menu_name}
                      </Link>
                    );
                  })}
                </nav>
                <nav className="flex flex-col gap-3" aria-label="Footer navigation tertiary">
                  {rightNav.slice(Math.ceil(rightNav.length / 2)).map((item) => {
                    const href = mapWordPressUrlToNextPath(item.page_link?.url);
                    return (
                      <Link
                        key={item.menu_name}
                        href={href}
                        className="text-[12px] text-white/90 transition hover:text-white"
                      >
                        {item.menu_name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-auto flex items-end justify-between gap-8 pt-10">
                <div className="flex items-center gap-5">
                  {socialLinks.map((item) => {
                    const url = item.acf?.social_media_link?.url?.trim();
                    const name = (item.acf?.social_media_name || item.title?.rendered || item.slug || "").trim();
                    const label = name || "Social link";
                    const target = item.acf?.social_media_link?.target || "_blank";
                    const rel = target === "_blank" ? "noopener noreferrer" : undefined;
                    if (!url) return null;
                    return (
                      <a
                        key={item.id}
                        href={url}
                        target={target}
                        rel={rel}
                        aria-label={label}
                        className="text-white/85 transition hover:text-white"
                      >
                        <SocialIcon slug={item.slug || name} className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  {googlePlayUrl && (
                    <Link
                      href={googlePlayLink}
                      target={appLink?.acf?.link_01?.target || "_blank"}
                      rel="noopener noreferrer"
                      className="focus:outline-none"
                      aria-label={downloadText}
                    >
                      <Image
                        src={googlePlayUrl}
                        alt="Get it on Google Play"
                        width={124}
                        height={40}
                        className="h-9 w-auto object-contain"
                        unoptimized={!!isLocal}
                      />
                    </Link>
                  )}
                  {appStoreUrl && (
                    <Link
                      href={appStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus:outline-none"
                      aria-label={downloadText}
                    >
                      <Image
                        src={appStoreUrl}
                        alt="Download on the App Store"
                        width={124}
                        height={40}
                        className="h-9 w-auto object-contain"
                        unoptimized={!!isLocal}
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 md:hidden">
        <div className="mx-auto max-w-5xl px-6 pb-[100px] pt-[90px]">
          {/* Logo + description */}
          <div className="mb-10">
            {logo && (
              <Link href="/" className="mb-4 inline-block">
                <Image
                  src={logo}
                  alt="Quicklyn"
                  width={120}
                  height={28}
                  className="h-7 w-auto object-contain"
                  unoptimized={
                  logo.includes("quicklyn-headless.local") ||
                  logo.includes("quick.rootholdings")
                }
                />
              </Link>
            )}
            {description && (
              <p className="max-w-md text-[12px] leading-relaxed text-white/95">
                {highlightNewYork(description)}
              </p>
            )}
          </div>

          {/* Two columns of navigation: 60% / 40% */}
          <div className="mb-10 grid gap-x-8 gap-y-1" style={{ gridTemplateColumns: "60% 40%" }}>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {leftNav.map((item) => {
                const href = mapWordPressUrlToNextPath(item.page_link?.url);
                return (
                  <Link
                    key={item.menu_name}
                    href={href}
                    className="text-[13px] text-white/90 transition hover:text-white"
                  >
                    {item.menu_name}
                  </Link>
                );
              })}
            </nav>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation secondary">
              {rightNav.map((item) => {
                const href = mapWordPressUrlToNextPath(item.page_link?.url);
                return (
                  <Link
                    key={item.menu_name}
                    href={href}
                    className="text-[13px] text-white/90 transition hover:text-white"
                  >
                    {item.menu_name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Contact email & phone (above newsletter) */}
          {(contactEmail || contactPhone) && (
            <div className="mb-8 flex flex-col gap-3 text-left">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-[13px] text-white/95 transition hover:text-white"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 text-[13px] text-white/95 transition hover:text-white"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{contactPhone}</span>
                </a>
              )}
            </div>
          )}

          {/* Newsletter */}
          <div className="mb-10 text-left">
            <h3 className="mb-4 text-base font-medium text-white">{subscriptionText}</h3>
            <form
              className="flex w-full overflow-hidden rounded-lg border border-[#AAAAAA]"
              onSubmit={(e) => e.preventDefault()}
              data-lpignore="true"
              data-form-type="other"
            >
              <input
                type="email"
                placeholder="Email"
                className="w-[72%] min-w-0 border-0 bg-[#1E1E1E] px-4 py-2.5 text-sm text-white placeholder:text-[#888888] focus:border-0 focus:outline-none focus:ring-0"
                aria-label="Email for newsletter"
                autoComplete="off"
                data-lpignore="true"
              />
              <button
                type="submit"
                className="w-[28%] shrink-0 border-0 border-l border-[#AAAAAA] bg-white px-4 py-2.5 text-sm font-medium text-[#1E1E1E] transition hover:bg-gray-50"
              >
                SUBMIT
              </button>
            </form>
          </div>

          {/* App download */}
          <div className="mb-8 text-center">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-wide text-white/95">
              {downloadText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {googlePlayUrl && (
                <Link
                  href={googlePlayLink}
                  target={appLink?.acf?.link_01?.target || "_blank"}
                  rel="noopener noreferrer"
                  className="focus:outline-none"
                >
                  <Image
                    src={googlePlayUrl}
                    alt="Get it on Google Play"
                    width={140}
                    height={48}
                    className="h-12 w-auto object-contain"
                    unoptimized={!!isLocal}
                  />
                </Link>
              )}
              {appStoreUrl && (
                <Link
                  href={appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none"
                >
                  <Image
                    src={appStoreUrl}
                    alt="Download on the App Store"
                    width={140}
                    height={48}
                    className="h-12 w-auto object-contain"
                    unoptimized={!!isLocal}
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Social icons from API */}
          <div className="mb-8 flex justify-center gap-6">
            {socialLinks.map((item) => {
              const url = item.acf?.social_media_link?.url?.trim();
              const name = (item.acf?.social_media_name || item.title?.rendered || item.slug || "").trim();
              const label = name || "Social link";
              const target = item.acf?.social_media_link?.target || "_blank";
              const rel = target === "_blank" ? "noopener noreferrer" : undefined;
              if (!url) return null;
              return (
                <a
                  key={item.id}
                  href={url}
                  target={target}
                  rel={rel}
                  aria-label={label}
                  className="text-white/80 transition hover:text-white"
                >
                  <SocialIcon slug={item.slug || name} className="h-6 w-6" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-white/70">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
