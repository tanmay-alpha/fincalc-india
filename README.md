# FinCalc India 🇮🇳

**Free, production-grade financial calculator suite for Indian investors.**

6 calculators: SIP · EMI · FD · PPF · Lumpsum · Income Tax

## Features

- 📊 **6 Financial Calculators** with real-time updates and interactive charts
- 🌙 **Dark Mode** with system preference detection
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- 🔢 **Indian Number Formatting** — ₹1,00,000 (lakh/crore system)
- 🧮 **Battle-tested Math** — validated formulas with input validation
- 📋 **Tax Estimator** — FY 2024-25, Old vs New regime, surcharge, cess, 87A rebate
- 💵 **EMI Amortization** — full month-by-month payment schedule
- 🏛️ **PPF Calculator** — withdrawal rules, 80C limits
- 📈 **Charts** — Recharts with bar, pie, line, area, and stacked charts
- 🔗 **Shareable Results** — copy link for any calculation
- 🗄️ **Database** — PostgreSQL + Prisma for saving calculations (optional)
- 🔐 **Authentication** — Google OAuth via NextAuth v5 (optional)
- 🚀 **API Routes** — Zod-validated POST endpoints for all calculators
- ⚡ **Performance** — Dynamic imports, loading skeletons, error boundaries

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth v5 + Google OAuth |
| Icons | Lucide React |
| Toasts | Sonner |
| Theme | next-themes (dark mode) |
| Deployment | Render |

## Quick Start

```bash
# Clone
git clone <your-repo-url>
cd fincalc-india

# Install
npm install

# Generate Prisma client (optional - only if using DB)
npx prisma generate

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** All 6 calculators work **without** a database or Google OAuth. Those are optional features for saving/sharing calculations.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Optional | PostgreSQL connection string (Neon, Render, or local) |
| `NEXTAUTH_SECRET` | Optional | Random string for session encryption |
| `NEXTAUTH_URL` | Optional | Your app URL (default: http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

### Setting up Database (Neon - free)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run migrations:

```bash
npx prisma migrate dev --name init
```

## Deployment on Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repo — Render auto-detects `render.yaml`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Render dashboard
5. Deploy!

The free PostgreSQL database is auto-provisioned via `render.yaml`.

## Project Structure

```
fincalc-india/
├── app/
│   ├── api/calculate/     # 6 API routes (SIP, EMI, FD, PPF, Lumpsum, Tax)
│   ├── api/auth/           # NextAuth route
│   ├── sip/                # SIP calculator page
│   ├── emi/                # EMI calculator + amortization
│   ├── fd/                 # FD calculator (compound + simple)
│   ├── ppf/                # PPF calculator
│   ├── lumpsum/            # Lumpsum calculator
│   ├── tax/                # Income Tax estimator
│   ├── history/            # Saved calculations (auth required)
│   ├── result/[shareId]/   # Shared result page
│   ├── layout.tsx          # Root layout + providers
│   └── page.tsx            # Home page
├── components/
│   ├── charts/             # 6 Recharts components
│   ├── shared/             # ShareButton, LoadingSkeleton
│   ├── Navbar.tsx          # Responsive nav + dark mode toggle
│   ├── Footer.tsx
│   ├── SliderInput.tsx     # Reusable slider component
│   ├── ResultCard.tsx      # Metric display card
│   ├── ResultRow.tsx       # Breakdown row
│   └── ThemeProvider.tsx   # Dark mode provider
├── lib/
│   ├── sip.ts              # SIP math
│   ├── emi.ts              # EMI math + amortization
│   ├── fd.ts               # FD math (compound + simple)
│   ├── ppf.ts              # PPF math + withdrawal rules
│   ├── lumpsum.ts          # Lumpsum math + CAGR
│   ├── tax.ts              # Tax math + surcharge + slab breakdown
│   ├── formatters.ts       # Indian number formatting
│   ├── validators.ts       # Input validation
│   ├── schemas.ts          # Zod validation schemas
│   ├── prisma.ts           # Prisma singleton
│   └── utils.ts            # cn() helper
├── prisma/schema.prisma    # Database schema
├── auth.ts                 # NextAuth v5 config
├── middleware.ts            # Route protection
├── render.yaml             # Render deployment config
└── .env.example            # Environment variable template
```

## License

MIT — free to use, modify, and distribute.

---

Made with ❤️ in India
