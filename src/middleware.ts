import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import legacyData from "@/data/legacy-301-redirects.json";

/** Pathname → Redirect To from spreadsheet (`legacy-301-redirects.json`). */
const redirectByPath = new Map<string, string>(
  legacyData.redirects.map(({ source, destination }) => [source, destination]),
);

/**
 * Applies legacy 301s before `[slug]` and other routes. Uses HTTP 301 to match SEO spec.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const dest = redirectByPath.get(pathname);
  if (!dest) {
    return NextResponse.next();
  }

  try {
    const absolute =
      dest.startsWith("http://") || dest.startsWith("https://")
        ? dest
        : new URL(dest, request.nextUrl.origin).toString();
    return NextResponse.redirect(absolute, { status: 301 });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico).*)"],
};
