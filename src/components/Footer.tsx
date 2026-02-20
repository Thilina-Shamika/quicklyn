"use client";

import Image from "next/image";
import Link from "next/link";
import type { WPFooter, WPAppLink } from "@/lib/wordpress";

interface FooterProps {
  data: WPFooter | null;
  appLink: WPAppLink | null;
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

export function Footer({ data, appLink }: FooterProps) {
  if (!data?.acf) return null;

  const acf = data.acf;
  const logo = acf.logo?.url;
  const description = acf.footer_description?.trim() || "";
  const navItems = acf.footer_navigation ?? [];
  const leftNav = navItems.slice(0, 6);
  const rightNav = navItems.slice(6, 12);
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

  return (
    <footer
      className="relative w-full overflow-hidden  text-white"
      style={{
        backgroundColor: footerBgUrl ? undefined : "#0f1419",
        ...(footerBgUrl && {
          backgroundImage: `url(${footerBgUrl})`,
          backgroundPosition: "left top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }),
      }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-[100px] pt-[90px]">
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
            {leftNav.map((item) => (
              <Link
                key={item.menu_name}
                href={item.page_link?.url || "#"}
                target={item.page_link?.target || "_self"}
                rel={item.page_link?.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-[13px] text-white/90 transition hover:text-white"
              >
                {item.menu_name}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation secondary">
            {rightNav.map((item) => (
              <Link
                key={item.menu_name}
                href={item.page_link?.url || "#"}
                target={item.page_link?.target || "_self"}
                rel={item.page_link?.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-[13px] text-white/90 transition hover:text-white"
              >
                {item.menu_name}
              </Link>
            ))}
          </nav>
        </div>

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

        {/* Social icons */}
        <div className="mb-8 flex justify-center gap-6">
          <a
            href="#"
            aria-label="Facebook"
            className="text-white/80 transition hover:text-white"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-white/80 transition hover:text-white"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-white/80 transition hover:text-white"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-white/70">{copyrightText}</p>
      </div>
    </footer>
  );
}
