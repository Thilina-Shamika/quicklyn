"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WPHeader } from "@/lib/wordpress";
import { MobileFlyoverMenu } from "@/components/MobileFlyoverMenu";

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
  const headerLogoUrl = header?.acf?.header_logo?.url;
  const isLocalLogo =
    headerLogoUrl?.includes("quicklyn-headless.local") ||
    headerLogoUrl?.includes("quick.rootholdings");

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-[9999] flex w-full flex-col bg-transparent"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Top bar */}
        <div
          className="flex shrink-0 justify-center px-4 py-2.5 text-center"
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

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between bg-transparent px-6 py-3">
          <div className="flex items-center gap-2">
            {headerLogoUrl ? (
              <Link href="/" className="block">
                <Image
                  src={headerLogoUrl}
                  alt="Quicklyn"
                  width={70}
                  height={16}
                  className="h-5 w-auto object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]"
                  unoptimized={!!isLocalLogo}
                />
              </Link>
            ) : (
              <>
                <LeafIcon className="text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]" />
                <span className="hero-text-shadow text-lg font-medium lowercase text-white">
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
      </div>

      <MobileFlyoverMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={header}
      />
    </>
  );
}

