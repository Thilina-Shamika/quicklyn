"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mapWordPressUrlToNextPath, type WPHeader } from "@/lib/wordpress";
import { MobileFlyoverMenu } from "@/components/MobileFlyoverMenu";

const SCROLL_THRESHOLD = 80;

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

interface GlobalHeaderProps {
  header: WPHeader | null;
}

export function GlobalHeader({ header }: GlobalHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setScrolledPastHero(typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerLogoUrl = header?.acf?.header_logo?.url;
  const isLocalLogo =
    headerLogoUrl?.includes("quicklyn-headless.local") ||
    headerLogoUrl?.includes("quick.rootholdings");
  const navItems = (header?.acf?.navitgation ?? []).filter(
    (item) => (item.menu_item_name || item.menu_item_link?.title || "").trim().length > 0,
  );
  const ctaItem =
    navItems.find((item) => {
      const label = (item.menu_item_name || item.menu_item_link?.title || "").trim().toUpperCase();
      return label.includes("GET THE APP");
    }) ?? null;
  const primaryNavItems = navItems
    .filter((item) => item !== ctaItem)
    .slice(0, 5);
  const desktopFallbackNav = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/our-services" },
    { label: "Our Mission", href: "/our-mission" },
    { label: "Book Now", href: "/book-a-cleaning" },
  ];
  const promoCopy = "Save 15% On Your First Booking : Code QWEB15";
  const promoTrack = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="inline-flex items-center gap-5 whitespace-nowrap">
      <span>
        <span className="font-semibold text-[#FFDA00]">Save 15%</span>
        <span className="text-white/95"> On Your First Booking : Code </span>
        <span className="font-semibold text-white">QWEB15</span>
      </span>
      <span className="text-white/80" aria-hidden>
        •
      </span>
    </span>
  ));

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-[9999] flex w-full flex-col bg-transparent"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Mobile top bar */}
        <div
          className="flex shrink-0 justify-center px-4 py-2.5 text-center md:hidden"
          style={{ backgroundColor: "#2a7a7c" }}
        >
          <p className="hero-text-shadow text-[12px] text-white">
            <span className="font-bold text-[#FFDA00]">Save 15%</span>
            <span className="text-white">
              {" "}
              On your first cleaning — code QWEB15
            </span>
          </p>
        </div>

        {/* Mobile header */}
        <header
          className="flex shrink-0 items-center justify-between px-6 py-3 transition-colors duration-300 md:hidden"
          style={{
            backgroundColor: scrolledPastHero ? "#2a7a7c" : "transparent",
          }}
        >
          <div className="flex items-center gap-2">
            {headerLogoUrl ? (
              <Link href="/" className="block">
                <Image
                  src={headerLogoUrl}
                  alt="Quicklyn"
                  width={88}
                  height={20}
                  className="h-7 w-auto object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]"
                  unoptimized={!!isLocalLogo}
                />
              </Link>
            ) : (
              <>
                <LeafIcon className="text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]" />
                <span className="hero-text-shadow text-xl font-medium lowercase text-white">
                  quicklyn
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-white"
            aria-label="Open menu"
          >
            <HamburgerIcon className="text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]" />
          </button>
        </header>

        {/* Desktop / Tablet header */}
        <div className="hidden md:block">
          <div
            className="relative overflow-hidden px-6 py-2 text-white"
            style={{ backgroundColor: "#2a7a7c" }}
            aria-label={promoCopy}
          >
            <div className="desktop-promo-marquee flex min-w-max items-center gap-5 text-sm font-medium">
              {promoTrack}
              {promoTrack}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1180px] px-6 pt-6 lg:pt-7">
            <header className="flex items-center rounded-full border border-white/15 bg-[#1c6a6f]/90 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md lg:px-8 lg:py-4">
              <div className="flex min-h-[44px] min-w-[150px] items-center lg:min-h-[48px]">
                {headerLogoUrl ? (
                  <Link href="/" className="inline-flex items-center">
                    <Image
                      src={headerLogoUrl}
                      alt="Quicklyn"
                      width={138}
                      height={34}
                      className="h-7 w-auto object-contain"
                      unoptimized={!!isLocalLogo}
                    />
                  </Link>
                ) : (
                  <span className="text-2xl font-semibold text-white">quicklyn</span>
                )}
              </div>

              <nav className="mx-auto flex items-center gap-5 lg:gap-8" aria-label="Primary navigation">
                {primaryNavItems.length > 0
                  ? primaryNavItems.map((item, index) => {
                      const label = (item.menu_item_name || item.menu_item_link?.title || "").trim();
                      const href = mapWordPressUrlToNextPath(item.menu_item_link?.url);
                      return (
                        <Link
                          key={`${label}-${index}`}
                          href={href}
                          className="font-semibold text-white transition duration-200 hover:text-[#ffda00]"
                          style={{ fontSize: "19px" }}
                        >
                          {label}
                        </Link>
                      );
                    })
                  : desktopFallbackNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="font-semibold text-white transition duration-200 hover:text-[#ffda00]"
                        style={{ fontSize: "19px" }}
                      >
                        {item.label}
                      </Link>
                    ))}
              </nav>

              <Link
                href={mapWordPressUrlToNextPath(ctaItem?.menu_item_link?.url) || "/get-the-app"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#FFDA00] px-5 text-sm font-semibold text-[#1B5B5D] shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition hover:opacity-95 lg:h-12 lg:px-6 lg:text-base"
              >
                <span>{(ctaItem?.menu_item_name || ctaItem?.menu_item_link?.title || "Get The App").trim()}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
                </svg>
              </Link>
            </header>
          </div>
        </div>
      </div>

      <MobileFlyoverMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={header}
      />
    </>
  );
}
