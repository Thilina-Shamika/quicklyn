"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  isServicesHubNavItem,
  mapWordPressUrlToNextPath,
  type ServiceNavItem,
  type WPHeader,
} from "@/lib/wordpress";
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

function ChevronDownNav({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Right-pointing arrowhead (filled), matches services submenu reference. */
function ServicesSubmenuArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 0 L10 6 L0 12 z" />
    </svg>
  );
}

/** Submenu label (inherits size/weight/color/italic from parent link). */
function ServiceSubmenuMultilineTitle({ title }: { title: string }) {
  const t = title.trim();
  return <span className="break-words text-inherit">{t}</span>;
}

/**
 * Unified dropdown shadow: emphasize left / right / bottom so the panel reads as sitting
 * on the pill without a cast upward into the navbar row.
 */
const SERVICES_PANEL_SHADOW =
  "shadow-[3px_0_14px_-4px_rgba(0,0,0,0.16),-3px_0_14px_-4px_rgba(0,0,0,0.16),0_16px_24px_-6px_rgba(0,0,0,0.22)]";

function ServicesDesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: ServiceNavItem[];
}) {
  if (items.length === 0) return null;
  return (
    /* w-max + inline-flex: width follows the label; dropdown shell uses w-max min-w-full to match or grow */
    <div className="group/menu relative z-[130] inline-flex w-max max-w-full shrink-0 flex-col">
      {/* In-flow label — no extra min-width/padding vs other nav links; fades when panel shows */}
      <Link
        href="/our-services"
        className="relative z-[1] inline-flex w-max min-w-0 shrink-0 items-center gap-0.5 whitespace-nowrap py-2 text-[19px] font-semibold text-white outline-none ring-offset-2 ring-offset-transparent transition-opacity duration-150 hover:text-[#ffda00] focus-visible:ring-2 focus-visible:ring-[#ffda00]/75 group-hover/menu:pointer-events-none group-hover/menu:opacity-0"
        style={{ fontSize: "19px" }}
      >
        {label}
        <ChevronDownNav className="-mb-px h-[18px] w-[18px] shrink-0 opacity-90" />
      </Link>

      {/*
        Shell is at least as wide as the trigger (min-w-full) but can grow (w-max) so the top row
        padding + label/chevron fit — w-full alone would clip horizontal padding.
      */}
      <div
        className={[
          "invisible absolute left-0 top-0 z-[2] w-max min-w-full max-w-none overflow-visible opacity-0",
          "-translate-y-1 pointer-events-none",
          "motion-reduce:translate-y-0 motion-reduce:transition-none",
          "rounded-t-[14px]",
          SERVICES_PANEL_SHADOW,
          "transition-[opacity,visibility,transform] duration-300 ease-out",
          "group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-hover/menu:visible",
          "group-focus-within/menu:pointer-events-auto group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-focus-within/menu:visible",
        ].join(" ")}
      >
        <div className="relative w-max min-w-full">
          {/* Bleed left + pl so label aligns with trigger; pr-0 at right edge */}
          <div className="relative -left-[10px] w-max min-w-[calc(100%+20px)] rounded-t-[14px] bg-[#1c6b71] py-[11px] pl-[10px] pr-0">
            <Link
              href="/our-services"
              className="inline-flex max-w-none items-center gap-0.5 whitespace-nowrap text-[19px] font-semibold leading-none text-white outline-none hover:text-[#ffda00] focus-visible:ring-2 focus-visible:ring-[#ffda00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c6b71]"
              style={{ fontSize: "19px" }}
            >
              {label}
              <ChevronDownNav className="h-[18px] w-[18px] shrink-0 opacity-90" />
            </Link>
          </div>

          <ul
            role="menu"
            aria-label="Service listings"
            className={[
              "absolute -left-[10px] top-full z-[3] m-0 min-w-[calc(100%+20px)] w-max max-w-[min(calc(100vw-1.5rem),28rem)]",
              "max-h-[min(60vh,calc(100vh-12rem))] list-none overflow-x-visible overflow-y-auto rounded-b-[14px] rounded-tr-[14px]",
              "bg-[#1c6b71] px-3 pb-5 pt-4",
              SERVICES_PANEL_SHADOW,
            ].join(" ")}
          >
            {items.map((s, i) => (
              <li key={s.slug} role="none" className="min-w-0">
                <Link
                  role="menuitem"
                  href={`/${s.slug}`}
                  className={[
                    "flex w-full max-w-full min-w-0 items-start gap-2.5 rounded-lg py-2.5 pl-0 pr-1 text-[16px] font-normal italic leading-snug tracking-tight text-white",
                    "transition-colors hover:text-[#ffda00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffda00]/35",
                    i > 0 ? "mt-1.5" : "",
                  ].join(" ")}
                >
                  <span
                    className="mt-[0.1875rem] inline-flex shrink-0 text-inherit [font-style:normal]"
                    aria-hidden
                  >
                    <ServicesSubmenuArrow className="h-[10px] w-[8px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <ServiceSubmenuMultilineTitle title={s.title} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface GlobalHeaderProps {
  header: WPHeader | null;
  serviceNavItems: ServiceNavItem[];
}

export function GlobalHeader({ header, serviceNavItems }: GlobalHeaderProps) {
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
            <header className="flex items-center overflow-visible rounded-full border border-white/15 bg-[#1c6a6f]/90 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md lg:px-8 lg:py-4">
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

              {/* Tablet: hide inline nav, use flyout instead; Desktop: show inline nav */}
              <nav
                className="mx-auto hidden items-center gap-5 overflow-visible lg:flex lg:gap-8"
                aria-label="Primary navigation"
              >
                {primaryNavItems.length > 0
                  ? primaryNavItems.map((item, index) => {
                      const label = (item.menu_item_name || item.menu_item_link?.title || "").trim();
                      const href = mapWordPressUrlToNextPath(item.menu_item_link?.url);
                      if (
                        serviceNavItems.length > 0 &&
                        isServicesHubNavItem(label, href)
                      ) {
                        return (
                          <ServicesDesktopDropdown
                            key={`${label}-${index}-services`}
                            label={label}
                            items={serviceNavItems}
                          />
                        );
                      }
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
                  : desktopFallbackNav.map((item) =>
                      item.label === "Services" &&
                      serviceNavItems.length > 0 ? (
                        <ServicesDesktopDropdown
                          key={item.href}
                          label={item.label}
                          items={serviceNavItems}
                        />
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="font-semibold text-white transition duration-200 hover:text-[#ffda00]"
                          style={{ fontSize: "19px" }}
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
              </nav>

              {/* Right actions: tablet = CTA + hamburger (flyout), desktop = CTA only */}
              <div className="ml-auto flex items-center gap-3">
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
                {/* Tablet: hamburger opens same MobileFlyoverMenu as mobile */}
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="hidden h-10 w-10 items-center justify-center text-white md:flex lg:hidden"
                  aria-label="Open menu"
                >
                  <HamburgerIcon className="text-white" />
                </button>
              </div>
            </header>
          </div>
        </div>
      </div>

      <MobileFlyoverMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={header}
        serviceNavItems={serviceNavItems}
      />
    </>
  );
}
