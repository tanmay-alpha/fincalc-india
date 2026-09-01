import { NextResponse } from "next/server";

/**
 * Security middleware — adds hardened HTTP response headers to every page
 * route. Static assets and Next.js internals are excluded for performance.
 *
 * Headers enforced:
 *   - X-Frame-Options: DENY            (clickjacking)
 *   - X-Content-Type-Options: nosniff  (MIME sniffing)
 *   - Referrer-Policy: strict-origin-when-cross-origin
 *   - Permissions-Policy: lockdown of sensitive APIs
 *   - Strict-Transport-Security: HSTS preload list eligibility
 *   - X-DNS-Prefetch-Control: off
 *   - X-XSS-Protection: legacy IE/Chrome mitigation (harmless when unused)
 *   - Content-Security-Policy: strict default-deny with explicit allow-list
 *     for Google OAuth, Vercel analytics, and our own assets.
 */
export function middleware() {
  const response = NextResponse.next();

  // Clickjacking protection
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Strict referrer policy — only send full URL on same-origin
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Lock down powerful browser APIs we never use
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()"
  );
  // HSTS — 1 year, include subdomains, eligible for preload
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  // Disable speculative DNS prefetching
  response.headers.set("X-DNS-Prefetch-Control", "off");
  // Legacy XSS auditor opt-out (CSP supersedes this; auditor has known bugs)
  response.headers.set("X-XSS-Protection", "0");

  // Content Security Policy — strict default-deny.
  // Allows Google OAuth, Google avatar CDN, Vercel live preview, and self.
  // Inline styles are required by Tailwind/Next.js dynamic styles.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://accounts.google.com https://*.googleapis.com https://*.vercel-insights.com https://*.sentry.io",
    "frame-src https://accounts.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Only match page routes, exclude API + static + auth
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
