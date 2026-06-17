# Security Policy & Incident Response

## Reporting a vulnerability

If you discover a security issue, please email **security@fincalc-india.app**
(or open a private security advisory on GitHub). Do **not** file a public
issue for suspected vulnerabilities.

We aim to acknowledge within 48 hours and ship a fix within 7 days for
critical issues.

## Threat model

FinCalc India is a small public calculator app with a Postgres-backed
authenticated user feature (Google OAuth). Sensitive data:

- **User email + Google account id** (NextAuth)
- **Saved calculator inputs/outputs** (financial figures, by user id)
- **Session tokens** (server-side, stored in `Session` table)

The app does **not** store any payment data, KYC, or PAN/Aadhaar numbers.
It is a read-only calculator with opt-in save/share.

## Security headers (enforced in `middleware.ts`)

| Header | Value | Why |
|---|---|---|
| `X-Frame-Options` | `DENY` | Clickjacking protection |
| `X-Content-Type-Options` | `nosniff` | Stop MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leak |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()` | Disable powerful APIs we never use |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HSTS, eligible for preload list |
| `Content-Security-Policy` | strict default-deny, allows Google OAuth + avatars + Vercel analytics | Mitigate XSS |
| `X-DNS-Prefetch-Control` | `off` | Reduce DNS-based exfiltration |
| `X-XSS-Protection` | `0` | Opt out of buggy legacy auditor (CSP is authoritative) |

## API hardening

- `POST /api/calculate/[type]` — requires authenticated session, validates
  every input via Zod, rate-limited per IP (30 req/min sliding window),
  capped at 32 KB request body, and only persists if the schema matches.
- `GET /api/result/[shareId]` — validates the share id format (cuid
  regex) before hitting the DB, sets aggressive cache headers for shared
  results.
- `GET /api/history` — requires authenticated session, scoped to the
  caller's user id.
- `DELETE /api/history/[id]` — uses a `deleteMany` with `userId` filter
  in the WHERE clause so it is impossible to delete another user's row
  even by guessing the cuid.

## Database access

All Prisma queries are server-side only. The client bundle never includes
`@prisma/client` or the `DATABASE_URL`.

## Secret management

- `.env` and `.env.local` are **gitignored**. Never commit a real secret.
- For local dev, copy `.env.example` → `.env.local`.
- For Vercel, set env vars in the dashboard per environment
  (Production / Preview).
- Rotate any secret that has ever been committed publicly:
  1. `openssl rand -base64 48` → new `NEXTAUTH_SECRET`
  2. Regenerate Google OAuth client secret in Google Cloud Console
  3. Rotate the Postgres password (Neon → reset)

## Dependencies

We pin Next.js, NextAuth, Prisma, and Zod to specific minor versions in
`package.json` and rely on `npm audit` / Dependabot to surface CVEs. Run
`npm audit --omit=dev` in CI on every PR.

## Future hardening (not yet implemented)

- Move rate limiting to Upstash/Redis for cross-region consistency.
- Add Sentry or Vercel Log Drains for runtime error monitoring.
- Add `snyk test` to CI for transitive dep vulnerabilities.
- Add a CSP report-only endpoint to catch real-world XSS attempts.
