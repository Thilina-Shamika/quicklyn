"use client";

import { usePathname } from "next/navigation";
import { TrustIndexEmbed } from "@/components/TrustIndexEmbed";

function shouldHideTrustIndexAboveFooter(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/our-mission") return true;
  if (pathname === "/blogs" || pathname.startsWith("/blogs/")) return true;
  return false;
}

/** Site-wide TrustIndex above footer; omitted on home, blog archive, and blog posts. */
export function TrustIndexAboveFooter() {
  const pathname = usePathname();
  if (shouldHideTrustIndexAboveFooter(pathname)) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#2a7a7c] pb-8 pt-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-0 ml-[23px] text-left text-[31px] font-semibold leading-tight text-white md:hidden">
          Trusted by Our Community
        </h2>
        <h2 className="mx-auto mb-6 hidden max-w-md text-center text-[32px] font-semibold leading-[1.05] text-white md:block lg:mb-8 lg:text-[44px]">
          Trusted by
          <br />
          Our Community
        </h2>
        <TrustIndexEmbed />
      </div>
    </section>
  );
}
