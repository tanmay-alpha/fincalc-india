import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicit workspace root to avoid parent lockfile ambiguity warnings
  outputFileTracingRoot: path.join(__dirname),

  // ─── Image domains ──────────────────────────────────────
  // We allow Google's avatar CDN (lh3.googleusercontent.com) because NextAuth
  // stores Google profile pictures there. If you add another image host, add
  // it here so the optimizer accepts it.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // ─── Security Headers ────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-XSS-Protection", value: "0" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === "production"
                ? "script-src 'self' 'unsafe-inline' https://accounts.google.com"
                : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
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
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ─── Build hygiene ──────────────────────────────────────
  // Fail the build on lint or type errors instead of shipping a broken bundle.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // ─── React strict mode ──────────────────────────────────
  reactStrictMode: true,
};

export default nextConfig;
