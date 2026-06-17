/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // ─── Security ───────────────────────────────────────────
  // Don't expose the X-Powered-By header — it's an information leak.
  poweredByHeader: false,

  // Don't allow embedding in iframes (CSP enforces this too).
  // Headers here apply to static assets; pages get headers via middleware.ts.

  // ─── Build hygiene ──────────────────────────────────────
  // Fail the build on lint or type errors instead of shipping a broken bundle.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // ─── React strict mode ──────────────────────────────────
  reactStrictMode: true,
};

export default nextConfig;
