# FinCalc India 🇮🇳

**Institutional-Grade Financial Calculation Engine & Wealth Advisory Suite for Indian Investors, Traders, Taxpayers & Corporates.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.x-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/Auth.js-v5_Beta-purple?style=flat&logo=auth0)](https://authjs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-42_Suites_|_659_Tests-6E9F18?style=flat&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-222_Smoke_|_70_A11y-2EAD33?style=flat&logo=playwright)](https://playwright.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/A11y-WCAG_2.1_AA_Compliant-success?style=flat)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🔗 **Production Application:** [https://fincalc-india.vercel.app/](https://fincalc-india.vercel.app/)  
📦 **Source Repository:** [https://github.com/tanmay-alpha/fincalc-india](https://github.com/tanmay-alpha/fincalc-india)

---

## 📖 Overview

**FinCalc India** is a full-stack, statutorily verified mathematical engine and wealth planning platform tailored specifically to the Indian financial ecosystem. It is built to comply with the **Finance Act, 2026**, **Income-tax Act, 2025**, **CBDT Notifications**, **RBI Master Directions**, **SEBI Mandates**, and **PFRDA Exit Regulations**.

Unlike generic financial calculators that use outdated rules or approximate flat formulas, FinCalc India models real-world complexities: reducing-balance loan amortization schedules, multi-tier marginal relief on tax rebates, unified capital gains tax rules post-July 2024, dual-calculation grandfathering for property acquisitions, multi-leg Option Greeks, Black-Scholes pricing, and multi-stage DCF valuation with 2D sensitivity matrices.

---

## 🛠️ Complete Technology Stack

FinCalc India is engineered with modern full-stack TypeScript tooling for uncompromising performance, calculation fidelity, and accessibility:

| Layer | Technology | Key Capabilities & Architecture |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | React 18 Server Components (RSC) for zero-JS landing pages, client components for reactive calculation inputs, canonical redirects in `next.config.mjs`. |
| **Type System** | **TypeScript 5 (Strict Mode)** | 100% strict type safety across all mathematical models, zero unchecked `any` types in computational engines, invariant-checked interfaces. |
| **Styling & UI Tokens** | **Tailwind CSS + Vanilla CSS** | Custom semantic tokens (`bg-card`, `surface-card`, `border-border/80`, `shadow-2xs`), no raw pastel AI artifacts, full high-contrast light/dark mode via `next-themes`. |
| **Iconography & Polish** | **Lucide React** | 31 unique SVG icons for calculators, automated emoji-to-Lucide mapping in `InsightCard`, clean indicator badges (28×28px). |
| **Charts & Visualizations** | **Recharts 3.8** | Responsive bar, line, area, and pie charts with responsive Y-axis widths (zero label clipping) and custom dark-glass tooltips. |
| **Authentication** | **NextAuth.js v5 (Beta 31)** | Edge-compatible server session resolution, Google OAuth 2.0 provider, JWT session strategies, and protected workspace history. |
| **Database & ORM** | **Prisma 5.22 + PostgreSQL** | Relational schema modeling `User`, `Account`, `Session`, and `Calculation` history with JSON input/result payloads and foreign key cascades. |
| **Export & Reporting** | **jsPDF 4.2** | Client-side generation of high-resolution, formatted PDF calculation summaries and amortization schedules. |
| **Unit & Fuzz Testing** | **Vitest 3.2 + Fast-Check** | 42 test suites, 659 unit/statutory tests, property-based fuzz testing, and mathematical regression gates with strict coverage thresholds. |
| **E2E & Accessibility Testing** | **Playwright 1.62 + Axe-Core** | 111 Desktop Chromium tests, 111 Mobile Chrome tests, and 70 Axe Core automated WCAG 2.1 AA audits across all 31 routes. |
| **CI/CD Automation** | **GitHub Actions + Vercel** | Multi-stage pull request quality gates enforcing type checking, linting, test suites, browser smoke runs, and Vercel preview deployments. |

---

## 🏛️ The 31-Calculator Suite (Categorized by Domain)

FinCalc India provides 31 specialized financial instruments structured across 5 institutional domains:

### 1. 💰 Investments & Wealth Creation (8)
1. **SIP (Systematic Investment Plan)**: Monthly compounding with annualized growth, inflation adjustment, and year-by-year corpus progression.
2. **Step-Up SIP (Top-Up SIP & Goal SIP)**: Annual percentage and fixed-amount top-up modeling combating inflation and reverse goal solver calculating required monthly SIP.
3. **Lumpsum Investment**: Compound annual growth rate (CAGR) and wealth multiplier modeling for one-time capital deployment.
4. **Fixed Deposit (FD)**: Monthly, quarterly, and annual compounding with cumulative and non-cumulative payout options.
5. **Public Provident Fund (PPF)**: Section 80C Exempt-Exempt-Exempt (EEE) status modeling with 15-year statutory maturity, deposit limits (₹500 to ₹1.5 Lakh/year), and partial withdrawal rules.
6. **FIRE (Financial Independence, Retire Early)**: Fat/Lean/Coast FIRE corpus solver, Safe Withdrawal Rates (SWR: 2.75%–3.5%), and post-retirement runway simulations.
7. **NPS (National Pension System)**: Tier-1 asset allocation (Equity Scheme E up to 75%, Corporate Bonds C, Govt Securities G), PFRDA 2026 exit rules (up to 80% lump sum permitted, small corpus ≤ ₹8 Lakh full exit), Section 10(12A) 60% tax-free lump sum cap, and Section 80CCD(1B) / 80CCD(2) tax deductions.
8. **Returns Suite (XIRR / CAGR / TWRR)**: Money-weighted XIRR, point-to-point CAGR, and time-weighted TWRR returns.

### 2. 🏠 Loans, Credit & Refinancing (5)
9. **EMI Calculator**: Exact reducing-balance EMI calculation with comprehensive monthly amortization schedules.
10. **Loan Prepayment vs. Invest**: Opportunity-cost simulation comparing accelerated debt repayment against equity index SIP investing.
11. **No-Cost EMI Reality Checker**: Dissects hidden merchant discounts, upfront processing fees, and 18% GST on interest components.
12. **Car Loan Total Cost of Ownership (TCO)**: Comprehensive vehicle ownership model factoring loan interest, depreciation, maintenance escalation, insurance, and fuel inflation.
13. **Home Loan Balance Transfer & Refinance Modeler**: Real net benefit analyzer accounting for switching costs (processing fees, MODT stamp duty, legal search), negative outcome alerts, and harmful tenure extension warnings.

### 3. ⚖️ Taxation & Statutory Planning (Tax Year 2026-27) (9)
14. **Income Tax Calculator (Finance Act 2026 / Income-tax Act 2025)**:
    - **New Tax Regime Slabs**: ₹0–₹4L (Nil), ₹4L–₹8L (5%), ₹8L–₹12L (10%), ₹12L–₹16L (15%), ₹16L–₹20L (20%), ₹20L–₹24L (25%), >₹24L (30%).
    - **Standard Deduction**: ₹75,000 under New Regime (exclusively on salary/pension income); ₹50,000 under Old Regime.
    - **Section 156 Tax Rebate & Marginal Relief**: Full tax rebate up to ₹12,00,000 taxable ordinary income for Resident Individuals, with smooth marginal relief tapering up to ₹12,70,588.
    - **Multiple Income Streams**: Decomposes Salary, Business/PGBP, Interest/Other, Equity LTCG (12.5% > ₹1.25L), Equity STCG (20%), and Other LTCG (12.5%).
15. **Marginal Relief & High-Income Surcharge**: High-income surcharge tiers (10% > ₹50L, 15% > ₹1Cr, 25% > ₹2Cr max under New Regime) with statutory boundary marginal relief.
16. **Capital Gains Tax**: Unified post-July 23, 2024 regime with Equity LTCG @ 12.5% (> ₹1.25L exemption), Equity STCG @ 20%, unlisted assets @ 12.5%, official Cost Inflation Index series (FY 2024-25 = 363, FY 2025-26 = 376, FY 2026-27 = 384), and dual-calculation grandfathering for pre-July 23, 2024 real estate.
17. **HRA Exemption**: Statutory 3-condition minimum formula under Section 10(13A) for Old Regime vs New Regime taxable treatment.
18. **Presumptive Taxation (Section 44AD & 44ADA)**: 50% presumptive profit for professionals (₹50L / ₹75L threshold) and 6%/8% for businesses (₹2Cr / ₹3Cr threshold) with Section 44AB tax audit triggers and 5-year lock-out warnings.
19. **Section 54, 54EC & 54F Capital Gains Exemption (Income-tax Act 2025 Sections 82, 85 & 86)**:
    - **Section 82 (formerly 54)**: Residential house rollover (₹10 Cr statutory cap, 1y before to 2y after buy, 3y build).
    - **Section 85 (formerly 54EC)**: REC / NHAI / PFC / IRFC specified bonds (₹50 Lakh statutory cap across transfer & subsequent year, 6-month window).
    - **Section 86 (formerly 54F)**: Long-term asset other than residential house into residential house with proportionate formula $\text{LTCG} \times (\text{Investment} / \text{Net Consideration})$, ₹10 Cr cap, and ownership restrictions ($\le$ 1 existing house).
20. **LRS TCS & Remittance (Section 394 / Finance Act 2026)**:
    - Overseas Tour Packages: Flat 2% on entire remittance amount.
    - Education via Loan u/s 80E: 0% Nil TCS.
    - Self-Funded Education & Medical Treatment: 0% $\le$ ₹10 Lakh, 2% on excess $>$ ₹10 Lakh.
    - General Foreign Investments & Remittances: 0% $\le$ ₹10 Lakh, 20% on excess $>$ ₹10 Lakh.
21. **US Stock Investing Net Return (DTAA Adjusted)**: Rule 115 INR currency conversion, 24-month long-term holding period, and Section 90 Foreign Tax Credit (FTC) on 25% US dividend withholding.
22. **NRI NRE vs NRO vs FCNR Deposit Comparator**: Triple-option yield comparator modeling 31.2% NRO TDS, 100% tax-free NRE repatriation, and USD FCNR exchange rate normalization.

### 4. 📈 Trading, Derivatives & Quantitative Risk (6)
23. **F&O Brokerage & STT Calculator**: Finance Act 2026 statutory rates (0.05% on futures sell turnover, 0.15% on options premium sell turnover, 0.15% on options exercise settlement value), exchange transaction charges, SEBI turnover fees, stamp duty, and 18% GST with breakeven tick analytics.
24. **Option Strategy Payoff Visualizer**: Multi-leg Option Greeks & PnL payoff curves across underlying spot prices for Bull Call Spreads, Bear Put Spreads, Straddles, Strangles, and Iron Condors.
25. **Black-Scholes Option Pricing & Greeks**: Exact European Call/Put pricing model with Delta, Gamma, Theta, Vega, and Rho analytical Greeks.
26. **Position Size & Risk Calculator**: Fixed fractional risk management ($R\%$), stop-loss distance sizing, buying power allocation, and long/short trade risk inversion.
27. **Futures & Options Margin Estimator**: SPAN margin + Exposure margin requirements across Nifty, BankNifty, FinNifty, and Equity derivatives with Margin Trading Facility (MTF) leverage costs.
28. **Portfolio Risk & Performance Suite**: Sharpe Ratio, Sortino Ratio (with $\infty$ handling for zero downside), Downside Deviation ($\sigma_d$), empirical Beta ($\beta$), Treynor Ratio, and Maximum Drawdown.

### 5. 🏢 Corporate Finance & Valuation (3)
29. **DCF Valuation (Discounted Cash Flow)**: Multi-stage Free Cash Flow to Firm (FCFF) discounting, Gordon Growth terminal value, net debt bridge, and 2D WACC vs Terminal Growth sensitivity matrix.
30. **WACC (Weighted Average Cost of Capital)**: Capital structure weighting, CAPM Cost of Equity ($R_f + \beta(R_m - R_f)$), and post-tax cost of debt tax shield ($K_d(1 - t)$).
31. **DuPont 5-Step Model**: Return on Equity (ROE) decomposition into Operating Margin, Asset Turnover, Financial Leverage, Interest Burden, and Tax Burden.

---

## 🌟 Key Platform Features & How They Were Implemented

### 1. Universal Calculator Shell (`CalculatorPageShell.tsx`)
- **What it is**: A shared wrapper that encapsulates every calculator page with consistent breadcrumb navigation, category iconography, statutory version badges, a legal assumptions drawer, and crawlable SEO educational guides.
- **How it was implemented**: Built as a React Server/Client hybrid component in `components/layout/CalculatorPageShell.tsx`. It reads calculator metadata from `lib/registry.ts`, renders an accessible heading with a 32×32px icon badge, embeds an `AssumptionsDrawer` for statutory transparency, and wraps the interactive workspace inside `InteractiveCalculatorGate`.

### 2. Public Guest Interactivity Architecture (`InteractiveCalculatorGate.tsx`)
- **What it is**: A frictionless computation model ensuring all 31 calculators remain 100% functional and interactive for unauthenticated guests without requiring account creation.
- **How it was implemented**: Unauthenticated guests can freely adjust inputs, move sliders, click presets, inspect charts, and see real-time calculated results. Google Sign-In is exclusively reserved for personal cloud storage, calculation history persistence, and authenticated share-link publishing.

### 3. Dynamic Two-State Homepage (`app/page.tsx`)
- **What it is**: An adaptive homepage that dynamically renders different interfaces depending on authentication state.
- **How it was implemented**: The server-side page component resolves `await auth()`. If unauthenticated, it renders `GuestLanding.tsx` featuring a high-impact hero banner, a 6-tool core preview grid (SIP, Tax, EMI, FIRE, Capital Gains, Prepayment), and a category discovery strip. If authenticated, it renders `Workspace.tsx` displaying the user's recent calculations, saved plans, and customized shortcuts.

### 4. Centralized Directory (`/calculators` & `CategoryDirectory.tsx`)
- **What it is**: A single catalog where users can search, filter, and discover all 31 financial tools.
- **How it was implemented**: Built in `components/directory/CategoryDirectory.tsx` with instant search by keyword or regulatory tag, category filter tabs with horizontal scroll support on mobile (`scrollbar-none`), and 2-line clamped descriptions to eliminate layout overflow.

### 5. Instant URL Sharing & State Serialization (`lib/share.ts`)
- **What it is**: The ability to share any calculation state via a URL so recipients see the exact same inputs and results.
- **How it was implemented**: Built a zero-dependency query-parameter codec that serializes active input state into safe URL parameters. Includes prototype-pollution defenses, input boundary clamps, and immediate clipboard copy with toast notifications.

### 6. Institutional Insight Cards with SVG Icon Mapping (`InsightCard.tsx`)
- **What it is**: Analyst insight cards that highlight key takeaways (e.g., "Wealth Multiplier: 3.1x", "Hidden GST Outflow: ₹4,320") without looking like generic AI-generated emoji alerts.
- **How it was implemented**: In `components/ui/InsightCard.tsx`, an internal dictionary automatically maps emoji characters to crisp Lucide SVG icons (`TrendingUp`, `Target`, `Calendar`, `IndianRupee`, `ShieldCheck`, `AlertTriangle`). Cards use subtle 3px semantic left accents, 28×28px badge containers, and high-contrast WCAG-compliant text tokens.

### 7. 18 Crawlable Educational Guides (`components/seo/*Info.tsx`)
- **What it is**: Rich, statutory educational guides placed beneath each calculator workspace for Google SEO indexing and consumer education.
- **How it was implemented**: Implemented as static React components adhering to semantic HTML5 (`section`, `h2`, `h3`, `table`, `ul`). All components use design tokens (`bg-card`, `border-border/80`, `text-foreground`, `text-muted-foreground`), clean badges, and structured FAQ schemas.

---

## 📂 Project Structure

```
fincalc-india/
├── app/                                 # Next.js App Router routes
│   ├── api/                             # Route Handlers (auth, calculations, sharing)
│   ├── calculators/                     # Centralized /calculators directory page
│   ├── sip/                             # Individual calculator routes (app/[slug]/page.tsx)
│   ├── tax/                             # Income Tax Calculator route
│   ├── emi/                             # EMI Calculator route
│   ├── layout.tsx                       # Root layout with ThemeProvider & AuthProvider
│   ├── page.tsx                         # Two-state homepage (Server Component)
│   └── globals.css                      # Global design system tokens & Recharts styles
├── components/
│   ├── calculators/                     # Interactive calculator implementations
│   │   ├── sip/                         # SIP Calculator + Chart + Milestones
│   │   ├── tax/                         # Income Tax Calculator + Regime Breakdown
│   │   ├── fno-brokerage/               # F&O Calculator + Charge Visualizer
│   │   └── ...                          # 31 dedicated calculator folders
│   ├── directory/                       # CategoryDirectory component
│   ├── layout/                          # Navbar, Footer, CalculatorPageShell
│   ├── landing/                         # GuestLanding (hero, 6-card grid, categories)
│   ├── workspace/                       # Authenticated workspace & calculation history
│   ├── seo/                             # 18 rich educational guides (FIREInfo, TaxInfo, etc.)
│   └── ui/                              # Shared primitives (HybridInput, ResultHero, InsightCard)
├── e2e/                                 # Playwright browser end-to-end test suites
│   ├── a11y.spec.ts                     # Automated Axe Core WCAG 2.1 AA audits
│   ├── all-calculators-smoke.spec.ts    # 31-route desktop & mobile smoke tests
│   └── auth-flow.spec.ts                # Authentication gate & history workflows
├── lib/
│   ├── constants/                       # Regulatory constants, tax slabs, calculator metadata
│   ├── math.ts                          # Pure mathematical & statutory calculation engine
│   ├── format.ts                        # INR currency, compact numbers, date formatters
│   ├── share.ts                         # URL state serialization & clipboard handlers
│   └── utils.ts                         # Tailwind clsx/twMerge utilities
├── prisma/
│   ├── schema.prisma                    # Database schema (User, Account, Session, Calculation)
│   └── migrations/                      # Prisma database migrations
├── tests/                               # Vitest unit, statutory, fuzz, and invariant tests
│   ├── math.test.ts                     # 286 pure math unit tests
│   ├── statutory-v3.test.ts             # Statutory Finance Act 2026 verification tests
│   ├── fuzz-invariants.test.ts          # Property-based fast-check fuzz tests
│   └── components/                      # React component integration tests
├── .github/workflows/                   # GitHub Actions CI/CD workflows
│   └── ci.yml                           # Quality Gate (Lint, Type-Check, Vitest, Playwright)
├── auth.ts                              # NextAuth v5 configuration & Prisma adapter
├── middleware.ts                         # Route protection & canonical URL middleware
├── next.config.mjs                      # Next.js config with security headers & aliases
├── playwright.config.ts                 # Playwright multi-project config (Chromium + Mobile)
├── tailwind.config.ts                   # Tailwind theme, typography, and spacing tokens
└── vitest.config.ts                     # Vitest configuration & coverage thresholds
```

---

## 👩‍💻 How to Add a New Calculator (Developer Guide)

FinCalc India is engineered for rapid, modular expansion. Follow these 7 steps to add calculator #32:

### Step 1: Define Mathematical Logic in `lib/math.ts`
Implement pure, deterministic computation functions with strict TypeScript interfaces:
```typescript
// 1. Define input & output interfaces
export interface SovereignGoldBondInputs {
  investmentAmount: number;
  annualInterestRate: number; // e.g. 2.5% p.a.
  tenureYears: number;        // 8 years statutory
  expectedGoldCagr: number;   // e.g. 10% p.a.
}

export interface SovereignGoldBondResult {
  totalInterestEarned: number;
  maturityGoldValue: number;
  totalMaturityValue: number;
  taxFreeGains: number; // Section 47(viic) capital gains exemption
}

// 2. Implement pure mathematical function
export function calcSovereignGoldBond(inputs: SovereignGoldBondInputs): SovereignGoldBondResult {
  // Pure mathematical logic with zero external dependencies
}
```

### Step 2: Add Comprehensive Tests in `tests/`
Write thorough unit tests covering standard cases, edge boundaries (0, negative, extreme values), and statutory rules:
```typescript
describe("Sovereign Gold Bond Engine", () => {
  it("correctly models 2.5% semi-annual interest and tax-free redemption", () => {
    const res = calcSovereignGoldBond({
      investmentAmount: 100000,
      annualInterestRate: 2.5,
      tenureYears: 8,
      expectedGoldCagr: 10,
    });
    expect(res.totalInterestEarned).toBeCloseTo(20000);
    expect(res.taxFreeGains).toBeGreaterThan(0);
  });
});
```

### Step 3: Register Metadata in `lib/constants/calculators.ts`
Add the calculator configuration entry including slug, display title, category, assumptions, and official regulatory sources:
```typescript
{
  id: "sgb",
  slug: "sgb",
  title: "Sovereign Gold Bond (SGB) Calculator",
  category: "investments",
  badge: "Section 47(viic) Tax-Free",
  description: "Calculate semi-annual 2.5% interest, gold price appreciation, and 100% tax-free redemption at maturity.",
  assumptions: [
    "Semi-annual simple interest payout at 2.5% p.a. on original issue price.",
    "Capital gains on redemption by an individual at 8-year maturity are 100% tax-exempt under Section 47(viic).",
  ],
  sources: [
    { label: "RBI — Sovereign Gold Bond Scheme FAQ", url: "https://www.rbi.org.in/" },
  ],
}
```

### Step 4: Build Calculator Component in `components/calculators/[slug]/`
Assemble inputs with `HybridInput` (synchronized slider and numeric field), `ResultHero`, `InsightCard`, and visual charts:
```tsx
"use client";
import { useState, useMemo } from "react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import { calcSovereignGoldBond } from "@/lib/math";

export default function SGBCalculator() {
  const [inputs, setInputs] = useState({ ... });
  const result = useMemo(() => calcSovereignGoldBond(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
      {/* Input controls & ResultHero */}
    </div>
  );
}
```

### Step 5: Create App Router Page in `app/[slug]/page.tsx`
Wrap your calculator inside `CalculatorPageShell`:
```tsx
import type { Metadata } from "next";
import SGBCalculator from "@/components/calculators/sgb/SGBCalculator";
import SGBInfo from "@/components/seo/SGBInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Sovereign Gold Bond (SGB) Calculator — FinCalc India",
  description: "Calculate SGB returns, semi-annual interest payouts, and tax-free maturity gains.",
};

export default function SGBPage() {
  return (
    <CalculatorPageShell id="sgb" educationalContent={<SGBInfo />}>
      <SGBCalculator />
    </CalculatorPageShell>
  );
}
```

### Step 6: Create Rich SEO Guide in `components/seo/[Slug]Info.tsx`
Document statutory rules, formulas, and FAQs using standard design tokens (`bg-card`, `border-border/80`, `text-foreground`, `text-muted-foreground`).

### Step 7: Add Route to Playwright Smoke Tests
Append the new route to `e2e/all-calculators-smoke.spec.ts` to automatically protect it with browser smoke tests and Axe accessibility audits in CI.

---

## 🧪 Testing & Verification Architecture

FinCalc India uses a multi-tier automated test pyramid to ensure zero calculation drift:

```
                  ▲
                 / \
                /E2E\     Playwright (111 Desktop + 111 Mobile Smoke Tests)
               /-----\
              /  A11y \   Axe Core Automated WCAG 2.1 AA Audits (70 checks)
             /---------\
            / Component \ React Testing Library (UI State & Gate Tests)
           /-------------\
          /  Statutory &  \ Golden Fixtures, Property-Based Fuzzing,
          / Pure Math Units \ Vitest (42 Suites, 659 Tests, >91% Coverage)
        ─────────────────────
```

### Running Tests Locally

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Verify TypeScript types (Zero errors)
npx tsc --noEmit

# 4. Run ESLint (Zero errors, zero warnings)
npm run lint

# 5. Run full Vitest unit & statutory suite
npm run test

# 6. Run Vitest with coverage report
npm run test:coverage

# 7. Run Playwright Accessibility audit suite (WCAG 2.1 AA)
npm run test:a11y

# 8. Run Playwright full browser smoke tests across all 31 routes
npm run test:e2e
```

---

## 🛡️ Statutory Authority & Regulatory Grounding

All mathematical formulas and statutory provisions are directly grounded in official regulatory publications:

1. **Central Board of Direct Taxes (CBDT)**: Income-tax Act, 2025; Finance Act, 2026; Master Circulars on Section 115BAC/202, Section 156 (formerly 87A) rebate, and Capital Gains taxation.
2. **Reserve Bank of India (RBI)**: Master Directions on the Liberalised Remittance Scheme (LRS), Non-Resident Deposits, and Floating-Rate Loan Prepayment circulars.
3. **Securities and Exchange Board of India (SEBI)**: F&O Securities Transaction Tax revisions, Peak Margin framework, and turnover charges.
4. **Pension Fund Regulatory and Development Authority (PFRDA)**: National Pension System (NPS) Exit and Withdrawal Regulations, 2026.
5. **National Stock Exchange of India (NSE) & BSE Ltd**: Derivatives transaction charges, contract specifications, and lot sizes.

---

## ⚖️ Educational & Regulatory Disclaimer

FinCalc India is an analytical, computational, and educational financial planning application. While all statutory parameters, tax slabs, and financial algorithms are continuously maintained to reflect the **Finance Act, 2026** and relevant regulatory circulars, calculations are provided for informational and modeling purposes only. They do not constitute formal legal, tax, accounting, or investment advice. Individual taxation varies based on specific residency status, income composition, and administrative interpretations. Users should consult a qualified Chartered Accountant (CA) or SEBI-registered Investment Advisor (RIA) before executing transactions or filing tax returns.

---

**Crafted with precision for Indian Investors, Traders & Professionals.**
