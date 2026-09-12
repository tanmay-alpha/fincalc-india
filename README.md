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

🔗 **Live Platform:** [https://fincalc-india.vercel.app/](https://fincalc-india.vercel.app/)  
📦 **GitHub Repository:** [https://github.com/tanmay-alpha/fincalc-india](https://github.com/tanmay-alpha/fincalc-india)

---

## 📖 Overview

**FinCalc India** is a statutorily verified mathematical engine and wealth planning platform tailored specifically to the Indian financial ecosystem. Built to comply with the **Finance Act, 2026**, **Income-tax Act, 2025**, **CBDT Notifications**, **RBI Master Directions**, **SEBI Mandates**, and **PFRDA Exit Regulations**.

Unlike typical calculators that rely on approximate or outdated flat formulas, FinCalc India models real-world statutory and financial mechanics: reducing-balance amortization schedules, multi-tier marginal relief, post-July 2024 unified capital gains, property grandfathering rules, Option Greeks via Black-Scholes, and multi-stage DCF valuation with 2D sensitivity matrices.

---

## ✨ Key Features

- **🔐 Authenticated Financial Workspace**: User authentication via Google OAuth (NextAuth.js v5) with persistent calculation history and multi-scenario management.
- **⚡ 31 Specialized Calculators**: High-precision tools covering retail investing, debt amortization, corporate finance, taxation, and quantitative derivatives.
- **📊 Interactive Visualizations**: Recharts-powered interactive graphs with custom tooltips, zero-clip axes, and dynamic scenario toggles.
- **🔗 Instant State Sharing**: Lossless URL query serialization to share exact calculation states across teams and clients.
- **📑 Export Capabilities**: Client-side generation of high-resolution PDF calculation summaries and amortization schedules via jsPDF.
- **♿ WCAG 2.1 AA Compliant**: High-contrast semantic tokens, keyboard-accessible navigation, and full light/dark mode support.

---

## 🏛️ Calculator Suite (31 Tools)

### 💰 Investments & Wealth Creation (8)
- **SIP (Systematic Investment Plan)**: Monthly compounding with inflation adjustment and year-by-year corpus progression.
- **Step-Up SIP & Goal SIP**: Annual top-up modeling combating inflation alongside reverse goal corpus solving.
- **Lumpsum Investment**: Compound annual growth rate (CAGR) and wealth multiplier modeling for one-time capital deployment.
- **Fixed Deposit (FD)**: Monthly, quarterly, and annual compounding with cumulative and non-cumulative payout options.
- **Public Provident Fund (PPF)**: Section 80C Exempt-Exempt-Exempt (EEE) modeling with 15-year statutory maturity and deposit limits.
- **FIRE (Financial Independence, Retire Early)**: Fat/Lean/Coast FIRE solver, Safe Withdrawal Rates (SWR: 2.75%–3.5%), and post-retirement runway simulations.
- **NPS (National Pension System)**: Tier-1 asset allocation, PFRDA 2026 exit rules (up to 80% lump sum permitted), and Section 80CCD tax deduction modeling.
- **Returns Suite (XIRR / CAGR / TWRR)**: Money-weighted XIRR, point-to-point CAGR, and time-weighted returns.

### 🏠 Loans, Credit & Real Estate (5)
- **EMI Calculator**: Exact reducing-balance EMI calculation with monthly amortization breakdown.
- **Loan Prepayment vs. Invest**: Opportunity-cost simulation comparing accelerated debt payoff against equity SIP investing.
- **No-Cost EMI Reality Checker**: Uncovers hidden merchant discounts, upfront processing fees, and 18% GST on interest.
- **Car Loan Total Cost of Ownership (TCO)**: Comprehensive vehicle ownership model factoring loan interest, depreciation, insurance, and fuel inflation.
- **Home Loan Balance Transfer & Refinance**: Net benefit analyzer factoring switching costs (processing fees, MODT stamp duty, legal search) and tenure risks.

### ⚖️ Taxation & Statutory Planning (Tax Year 2026-27) (9)
- **Income Tax Calculator (Finance Act 2026)**:
  - New Tax Regime slabs (₹0–₹4L Nil, ₹4L–₹8L 5%, ₹8L–₹12L 10%, ₹12L–₹16L 15%, ₹16L–₹20L 20%, ₹20L–₹24L 25%, >₹24L 30%).
  - ₹75,000 Standard Deduction (salary/pension) under New Regime; ₹50,000 under Old Regime.
  - Section 156 Tax Rebate up to ₹12 Lakh taxable income with smooth marginal relief up to ₹12,70,588.
- **Marginal Relief & High-Income Surcharge**: High-income surcharge tiers (10%, 15%, 25% max) with boundary relief modeling.
- **Capital Gains Tax**: Post-July 23, 2024 unified regime (Equity LTCG @ 12.5% > ₹1.25L, STCG @ 20%, Cost Inflation Index series FY 2026-27 = 384) with real estate grandfathering.
- **HRA Exemption**: Statutory 3-condition minimum formula under Section 10(13A).
- **Presumptive Taxation (Section 44AD & 44ADA)**: 50% profit for professionals and 6%/8% for businesses with 44AB audit triggers.
- **Section 54, 54EC & 54F Capital Gains Exemption**: Residential rollover, specified bonds (₹50 Lakh cap), and proportionate exemptions.
- **LRS TCS & Remittance (Finance Act 2026)**: TCS rules on foreign tours (2%), education loan remittances (0%), and overseas investments.
- **US Stock Investing Net Return (DTAA Adjusted)**: Rule 115 INR conversion, 24-month holding rules, and Section 90 Foreign Tax Credit.
- **NRI NRE vs NRO vs FCNR Comparator**: Triple-option yield comparator modeling 31.2% NRO TDS, tax-free NRE, and USD FCNR exchange normalization.

### 📈 Trading, Derivatives & Quantitative Risk (6)
- **F&O Brokerage & STT Calculator**: Statutory rates (0.05% futures sell, 0.15% options premium sell, 0.15% exercise settlement), exchange charges, SEBI fees, stamp duty, GST, and breakeven tick analytics.
- **Option Strategy Payoff Visualizer**: Multi-leg Option Greeks & PnL payoff curves for Spreads, Straddles, Strangles, and Iron Condors.
- **Black-Scholes Option Pricing & Greeks**: Analytical European Call/Put pricing with Delta, Gamma, Theta, Vega, and Rho.
- **Position Size & Risk Calculator**: Fixed fractional risk management ($R\%$), stop-loss distance sizing, and long/short exposure.
- **Futures & Options Margin Estimator**: SPAN + Exposure margin requirements across Nifty, BankNifty, and single stocks with MTF leverage costs.
- **Portfolio Risk & Performance Suite**: Sharpe Ratio, Sortino Ratio, Downside Deviation ($\sigma_d$), empirical Beta ($\beta$), Treynor Ratio, and Maximum Drawdown.

### 🏢 Corporate Finance & Valuation (3)
- **DCF Valuation (Discounted Cash Flow)**: Multi-stage FCFF discounting, Gordon Growth terminal value, net debt bridge, and 2D WACC vs Terminal Growth sensitivity matrix.
- **WACC (Weighted Average Cost of Capital)**: Capital structure weighting, CAPM Cost of Equity ($R_f + \beta(R_m - R_f)$), and post-tax cost of debt shield.
- **DuPont 5-Step Model**: ROE decomposition into Operating Margin, Asset Turnover, Financial Leverage, Interest Burden, and Tax Burden.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Server & Client components, edge runtime middleware, route handlers. |
| **Language** | **TypeScript 5 (Strict)** | 100% strict type safety across all mathematical models and UI layers. |
| **Styling** | **Tailwind CSS + CSS Tokens** | Custom design system with light/dark theme support via `next-themes`. |
| **Authentication** | **NextAuth.js v5 (Beta 31)** | Google OAuth 2.0 provider with secure session management. |
| **Database & ORM** | **Prisma 5.22 + PostgreSQL** | Relational storage for user calculation history and shared models. |
| **Visualizations** | **Recharts 3.8** | Responsive SVG charts with custom dark-glass tooltips. |
| **Reporting** | **jsPDF 4.2** | Client-side export of formatted calculation reports. |
| **Unit Testing** | **Vitest 3.2 + Fast-Check** | 42 test suites, 659 tests, property-based fuzz testing. |
| **E2E & A11y** | **Playwright 1.62 + Axe-Core** | 222 browser smoke tests (Desktop & Mobile) and WCAG 2.1 AA audits. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- PostgreSQL database instance (local or hosted, e.g., Neon / Supabase)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanmay-alpha/fincalc-india.git
   cd fincalc-india
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Provide values for `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Verification

The test suite enforces mathematical correctness, statutory compliance, and accessibility standards:

```bash
# Run pure math, statutory, and unit tests
npm test

# Run tests with code coverage report
npm run test:coverage

# Run Playwright accessibility audits (WCAG 2.1 AA)
npm run test:a11y

# Run end-to-end browser smoke test suite across all 31 routes
npm run test:e2e

# Run TypeScript type check
npx tsc --noEmit

# Run code linter
npm run lint
```

---

## 🛡️ Statutory Authority & Regulatory Grounding

All computational models are directly anchored to statutory publications:

- **Central Board of Direct Taxes (CBDT)**: Income-tax Act, 2025; Finance Act, 2026; Section 156 (87A) rebate, Capital Gains reform.
- **Reserve Bank of India (RBI)**: Liberalised Remittance Scheme (LRS), Non-Resident Deposits, and Floating-Rate Prepayment rules.
- **Securities and Exchange Board of India (SEBI)**: F&O Securities Transaction Tax (STT) revisions, Peak Margin framework.
- **Pension Fund Regulatory and Development Authority (PFRDA)**: National Pension System (NPS) Exit & Withdrawal Regulations, 2026.
- **NSE & BSE**: Contract specifications, derivatives transaction charges, and lot sizes.

---

## ⚖️ Legal Disclaimer

*FinCalc India is an analytical, computational, and educational financial planning platform. While statutory parameters, tax slabs, and financial algorithms are continuously maintained to reflect the Finance Act, 2026 and relevant circulars, calculations are provided for informational and modeling purposes only. They do not constitute formal legal, tax, accounting, or investment advice. Users should consult a qualified Chartered Accountant (CA) or SEBI-registered Investment Advisor (RIA) before executing financial transactions.*

---

**Crafted with precision for Indian Investors, Traders & Professionals.**
