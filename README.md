# FinCalc India 🇮🇳

**Free financial calculator suite for Indian investors and tax filers.**

🔗 **Live Demo:** [https://fincalc-india.vercel.app/](https://fincalc-india.vercel.app/)  
📦 **GitHub:** [https://github.com/tanmay-alpha/fincalc-india](https://github.com/tanmay-alpha/fincalc-india)

---

## What It Is

Six financial calculators built for the Indian demographic — with Indian number formatting (₹ / lakh / crore), FY 2025-26 income tax slabs, and a clean dark-mode UI.

| Calculator | What it computes |
|------------|-----------------|
| SIP | Systematic Investment Plan corpus & year-by-year growth |
| EMI | Loan EMI + full amortization schedule (home / car / personal) |
| FD | Fixed Deposit maturity with monthly / quarterly / annual compounding |
| PPF | Public Provident Fund corpus with withdrawal rules |
| Lumpsum | One-time investment growth with CAGR |
| Income Tax | FY 2025-26 / AY 2026-27 — Old vs New regime, 87A rebate, cess |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts |
| Forms / Validation | Zod |
| Database (optional) | PostgreSQL + Prisma |
| Auth (optional) | NextAuth v5 + Google OAuth |
| Icons | Lucide React |
| Toasts | Sonner |
| Theme | next-themes (dark mode) |
| Deployment | Vercel |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/tanmay-alpha/fincalc-india
cd fincalc-india

# 2. Install
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your credentials (see below)

# 4. Generate Prisma client
npx prisma generate

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **All 6 calculators work without a database or Google auth.** Database and OAuth are only needed for the Save / Share / History features.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Optional | PostgreSQL connection string (Neon free tier works great) |
| `NEXTAUTH_SECRET` | Optional | Random string for session encryption |
| `NEXTAUTH_URL` | Optional | Your app URL (default: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

### Setting up Google OAuth (for save/share features)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy credentials to `.env`

### Setting up Database (free with Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create a project → copy the connection string to `DATABASE_URL`
3. Run migrations:

```bash
npx prisma migrate dev --name init
```

---

## NPM Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build (runs prisma generate first)
npm run lint      # ESLint check
npm run test      # Run Vitest tests (math engine)
npm run test:watch # Vitest in watch mode
npm start         # Start production server
```

---

## Project Structure

```
fincalc-india/
├── app/
│   ├── api/
│   │   ├── calculate/[type]/  # Server-side calculation + save API
│   │   ├── auth/              # NextAuth route
│   │   ├── history/           # Saved calculations CRUD
│   │   └── result/[shareId]/  # Public share link API
│   ├── sip/                   # SIP calculator page
│   ├── emi/                   # EMI calculator + amortization
│   ├── fd/                    # FD calculator
│   ├── ppf/                   # PPF calculator
│   ├── lumpsum/               # Lumpsum calculator
│   ├── tax/                   # Income Tax estimator (FY 2025-26)
│   ├── history/               # Saved calculations (auth required)
│   ├── result/[shareId]/      # Shared result page
│   ├── layout.tsx             # Root layout + providers
│   ├── sitemap.ts             # Auto-generated sitemap
│   └── robots.ts              # Crawler rules
├── components/
│   ├── calculators/           # Per-calculator interactive components
│   ├── seo/                   # Static SEO content sections
│   ├── ui/                    # Shared UI primitives
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── math.ts                # All 6 calculator functions (core logic)
│   ├── validations.ts         # Zod schemas for all calculators
│   ├── format.ts              # Indian number formatting
│   └── prisma.ts              # Prisma singleton
├── tests/
│   └── math.test.ts           # Vitest tests for math engine
├── prisma/schema.prisma       # Database schema
├── auth.ts                    # NextAuth v5 config
├── middleware.ts              # Security headers
└── .env.example               # Environment variable template
```

---

## LinkedIn Demo Flow

If you're evaluating this project for a portfolio review:

1. **Homepage** → [fincalc-india.vercel.app](https://fincalc-india.vercel.app/) — overview of all calculators
2. **SIP Calculator** → [/sip](https://fincalc-india.vercel.app/sip) — adjust monthly amount + rate + years
3. **EMI Calculator** → [/emi](https://fincalc-india.vercel.app/emi) — home loan with full amortization
4. **Tax Calculator** → [/tax](https://fincalc-india.vercel.app/tax) — FY 2025-26 Old vs New regime
5. **Sign in with Google** → save a calculation → see history → share a result link

---

## Engineering Notes

- **Server-side security:** The `/api/calculate/[type]` route validates inputs with Zod and **recomputes results server-side** via `lib/math.ts`. Client-submitted result values are never trusted.
- **SEO:** Calculator pages are Next.js Server Components with static H1 / description / slab tables that Google can index without JavaScript.
- **Math engine:** All formulas are in `lib/math.ts` — completely decoupled from UI and testable.
- **Rate limiting:** Basic IP-based rate limiting on the save API.

---

## Disclaimer

> This project is for **educational and estimation purposes only**. It is not financial, investment, or tax advice. Tax calculations are based on announced budget slabs and may not reflect every individual's tax situation. Consult a qualified professional before making financial decisions.

---

## License

MIT — free to use, modify, and distribute.

---

Made with ❤️ in India
