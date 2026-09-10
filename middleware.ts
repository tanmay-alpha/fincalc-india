import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSafeCallbackUrl } from "@/lib/url";

/**
 * Public routes that do not require an authenticated session.
 */
const PUBLIC_PAGE_PREFIXES = ["/login", "/privacy", "/terms", "/result"];
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/health", "/api/result"];

function isPublicAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons")
  );
}

function hasSessionToken(req: NextRequest): boolean {
  const sessionCookies = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];
  return sessionCookies.some((name) => {
    const cookie = req.cookies.get(name);
    return Boolean(cookie && cookie.value && cookie.value.trim().length > 0);
  });
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Static framework assets and metadata routes are always accessible
  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = hasSessionToken(request);

  // 2. Handle /login specifically
  if (pathname === "/login") {
    if (isAuthenticated) {
      const rawCallback = request.nextUrl.searchParams.get("callbackUrl");
      const destination = getSafeCallbackUrl(rawCallback, null, "/");
      return NextResponse.redirect(new URL(destination, request.url));
    }
    // Set pathname header and allow unauthenticated visitor to see login
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3. Public pages & public APIs
  const isPublicPage = PUBLIC_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isPublicApi = PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isPublicPage || isPublicApi) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 4. Protected Routes — Unauthenticated handling
  if (!isAuthenticated) {
    // If an unauthenticated request targets a protected API route, return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to use FinCalc India.",
        },
        { status: 401 }
      );
    }

    // Protected application pages -> redirect to /login with encoded callbackUrl
    const targetUrl = `${pathname}${search}`;
    const safeCallback = getSafeCallbackUrl(targetUrl, null, "/");
    const loginUrl = new URL("/login", request.url);
    if (safeCallback !== "/") {
      loginUrl.searchParams.set("callbackUrl", safeCallback);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. Authenticated requests to protected routes -> allow through with path header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
