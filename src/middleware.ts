import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type I18nLocale } from "@/modules/i18n/get-dictionary";

export function middleware(request: NextRequest) {
  // Only handle GET requests; Server Actions (POST) must not be intercepted
  // to avoid stripping Set-Cookie headers from mutation responses.
  if (request.method !== "GET") {
    return NextResponse.next();
  }
  // Only set locale cookie on first visit (cookie not yet present).
  if (request.cookies.has("locale")) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2))
    .find((lang) => locales.includes(lang as I18nLocale));

  const locale: I18nLocale = (preferred as I18nLocale | undefined) ?? defaultLocale;

  const response = NextResponse.next();
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, robots.txt, sitemap.xml
     * - /healthz (health check endpoint)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|healthz).*)",
  ],
};
