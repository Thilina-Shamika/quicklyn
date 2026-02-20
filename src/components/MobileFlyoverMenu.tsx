"use client";

import Image from "next/image";
import Link from "next/link";
import type { WPHeader } from "@/lib/wordpress";
import { mapWordPressUrlToNextPath } from "@/lib/wordpress";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

interface MobileFlyoverMenuProps {
  open: boolean;
  onClose: () => void;
  header: WPHeader | null;
}

export function MobileFlyoverMenu({
  open,
  onClose,
  header,
}: MobileFlyoverMenuProps) {
  const navItems = header?.acf?.navitgation ?? [];
  const menuDescription = header?.acf?.menu_description?.trim() ?? "";
  const logoUrl = header?.acf?.header_logo?.url;
  const bgImageUrl =
    header?.acf?.navigation_background &&
    typeof header.acf.navigation_background === "object" &&
    "url" in header.acf.navigation_background
      ? (header.acf.navigation_background as { url?: string }).url
      : undefined;

  const isLocalLogo =
    logoUrl?.includes("quicklyn-headless.local") ||
    logoUrl?.includes("quick.rootholdings");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[10000] bg-black/40 transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden
      />

      {/* Panel from right (slides right-to-left) */}
      <div
        className="fixed right-0 top-0 z-[10001] flex h-full w-[75%] max-w-[280px] flex-col overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Background: navigation_background from endpoint */}
        <div className="absolute inset-0 bg-[#1a5d5f]">
          {bgImageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bgImageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
                aria-hidden
              />
              <div className="absolute inset-0 bg-[#1a5d5f]/50" aria-hidden />
            </>
          )}
        </div>

        <div className="relative z-10 flex h-full flex-col px-[30px] pt-8 pb-8">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="mb-8 flex h-10 w-10 items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close menu"
          >
            <CloseIcon className="h-7 w-7" />
          </button>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-6">
            {navItems.map((item, index) => {
              const label = (item.menu_item_name || item.menu_item_link?.title || "").trim() || "Link";
              const wpUrl = item.menu_item_link?.url ?? "#";
              const href = mapWordPressUrlToNextPath(wpUrl);
              const isCta = label.toUpperCase() === "GET THE APP";

              return (
                <Link
                  key={index}
                  href={href}
                  onClick={onClose}
                  className={`text-left text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1a5d5f] ${
                    isCta
                      ? "font-semibold uppercase text-[#FFDA00]"
                      : "text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logo + tagline at bottom */}
          <div className="mt-auto pt-8">
            {logoUrl && (
              <Link href="/" onClick={onClose} className="block">
                <Image
                  src={logoUrl}
                  alt="Quicklyn"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain object-left"
                  unoptimized={!!isLocalLogo}
                />
              </Link>
            )}
            {menuDescription && (
              <p className="mt-3 text-left text-[13px] leading-relaxed text-white/95">
                {menuDescription.includes("New York") ? (
                  <>
                    {menuDescription.slice(0, menuDescription.indexOf("New York"))}
                    <span className="font-semibold text-white">New York.</span>
                  </>
                ) : (
                  menuDescription
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
