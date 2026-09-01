import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Landmark,
  LineChart,
  Lock,
  Scale,
  Share2,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import HomeHeroActions from "@/components/home/HomeHeroActions";
import { Badge } from "@/components/ui/Badge";

interface CalculatorCard {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  description: string;
  bestFor: string;
  includes: string;
  href: string;
  badge?: string;
}

const calculators: CalculatorCard[] = [
  {
    id: "sip",
    name: "SIP Calculator",
    shortName: "SIP",
    icon: TrendingUp,
    description: "Estimate monthly investment growth with invested amount, returns, and year-by-year corpus.",
    bestFor: "Monthly mutual fund planning",
    includes: "Corpus, returns, yearly table",
    href: "/sip",
    badge: "Most used",
  },
  {
    id: "step-up-sip",
    name: "Step-Up & Goal SIP",
    shortName: "Step-Up",
    icon: TrendingUp,
    description: "Model annual salary increments in monthly SIP or reverse-solve starting SIP for target financial goals.",
    bestFor: "Salary increments & goal planning",
    includes: "Annual top-up %, Goal solver, Comparison",
    href: "/step-up-sip",
    badge: "Top-Up & Goals",
  },
  {
    id: "emi",
    name: "EMI Calculator",
    shortName: "EMI",
    icon: Building2,
    description: "Calculate loan EMI, total interest, total payment, and a monthly amortization schedule.",
    bestFor: "Home, car, and personal loans",
    includes: "EMI, interest split, balance chart",
    href: "/emi",
  },
  {
    id: "loan-prepayment",
    name: "Loan Pre-Payment vs Invest",
    shortName: "Prepay",
    icon: Building2,
    description: "Calculate interest and tenure saved by prepaying extra EMIs vs investing that money in mutual funds.",
    bestFor: "Loan foreclosure & debt freedom",
    includes: "Tenure saved, Interest saved, Hurdle rate",
    href: "/loan-prepayment",
    badge: "Interest saver",
  },
  {
    id: "no-cost-emi",
    name: "No-Cost EMI Truth Revealer",
    shortName: "0% EMI",
    icon: BadgeIndianRupee,
    description: "Reveal the hidden 18% GST on interest, processing fees, and lost upfront card discounts.",
    bestFor: "iPhone, laptop & appliance purchases",
    includes: "True APR %, Hidden GST, Price verdict",
    href: "/no-cost-emi",
    badge: "Truth Revealer",
  },
  {
    id: "fire",
    name: "FIRE Retirement Calculator",
    shortName: "FIRE",
    icon: Landmark,
    description: "Calculate Lean, Standard, and Fat FIRE corpus targets and required monthly savings to achieve early freedom.",
    bestFor: "Early retirement & wealth planning",
    includes: "Lean/Fat FIRE, Depletion curve, SWR",
    href: "/fire",
    badge: "Retire early",
  },
  {
    id: "tax",
    name: "Income Tax Calculator",
    shortName: "Tax",
    icon: FileText,
    description: "Compare old and new regime tax estimates with slab-by-slab breakdown for Tax Year 2026-27.",
    bestFor: "Salary and tax planning",
    includes: "Tax payable, regime comparison, Section 156 rebate",
    href: "/tax",
    badge: "Tax Year 2026-27",
  },
  {
    id: "capital-gains-tax",
    name: "Capital Gains Tax Calculator",
    shortName: "Cap Gains",
    icon: FileText,
    description: "Calculate STCG & LTCG on Equity, Real Estate, Debt MF, and Gold with Tax Year 2026-27 rules.",
    bestFor: "Stock, mutual fund & property sales",
    includes: "12.5% LTCG, ₹1.25L exemption, grandfathering",
    href: "/capital-gains-tax",
    badge: "Tax Year 2026-27",
  },
  {
    id: "fno-brokerage",
    name: "F&O Brokerage & Break-Even",
    shortName: "F&O",
    icon: TrendingUp,
    description: "Calculate itemized brokerage, updated STT (0.05% futures / 0.15% options), GST, and exact break-even exit price.",
    bestFor: "Intraday & positional options traders",
    includes: "Updated STT, STCG vs Business, GST",
    href: "/fno-brokerage",
    badge: "Tax Year 2026-27",
  },
  {
    id: "option-payoff",
    name: "Option Strategy Payoff Visualizer",
    shortName: "Options",
    icon: LineChart,
    description: "Multi-leg expiry payoff chart with Bull Call, Straddle, and Iron Condor presets.",
    bestFor: "Options strategy analysis & hedging",
    includes: "Payoff chart, Multi-breakevens, Max loss",
    href: "/option-payoff",
    badge: "Payoff Visualizer",
  },
  {
    id: "hra-exemption",
    name: "HRA & Rent Optimizer",
    shortName: "HRA",
    icon: Building2,
    description: "Calculate tax-exempt HRA under Section 10(13A) and optimize household tax savings when paying rent to parents.",
    bestFor: "Salaried employees paying rent",
    includes: "3-Limit formula, Metro/Non-metro, Parent rent",
    href: "/hra-exemption",
    badge: "Rent Optimizer",
  },
  {
    id: "presumptive-tax",
    name: "Presumptive Tax (44AD/ADA)",
    shortName: "44AD/ADA",
    icon: FileText,
    description: "Calculate presumptive profit and tax for professionals (50%) and businesses (6%/8%) with audit trigger analysis.",
    bestFor: "Freelancers, doctors, CAs & small businesses",
    includes: "₹75L / ₹3Cr digital limits, Audit triggers",
    href: "/presumptive-tax",
    badge: "No Bookkeeping",
  },
  {
    id: "position-size",
    name: "Position Size & Risk-Reward",
    shortName: "Risk & Size",
    icon: TrendingUp,
    description: "Calculate optimal share quantity, rupee risk per trade, stop-loss distance, and target prices using the 1% risk rule.",
    bestFor: "Intraday & swing equity traders",
    includes: "1% Risk formula, SEBI MIS leverage, Price ladder",
    href: "/position-size",
    badge: "Active Traders",
  },
  {
    id: "section-54-exemption",
    name: "Section 54 / 54EC Exemption",
    shortName: "Sec 54/54EC",
    icon: Building2,
    description: "Plan capital gains tax exemption on real estate sale by reinvesting in a residential property (Sec 54) or 54EC bonds.",
    bestFor: "Property sellers saving LTCG tax",
    includes: "Sec 54 vs 54EC comparison, ₹10Cr/₹50L caps",
    href: "/section-54-exemption",
    badge: "Save 100% Tax",
  },
  {
    id: "fd",
    name: "FD Calculator",
    shortName: "FD",
    icon: Lock,
    description: "Project fixed deposit maturity with different compounding frequencies and effective yield.",
    bestFor: "Bank deposit planning",
    includes: "Maturity, interest, growth curve",
    href: "/fd",
  },
  {
    id: "ppf",
    name: "PPF Calculator",
    shortName: "PPF",
    icon: Landmark,
    description: "Plan tax-free PPF maturity across the lock-in period and optional extensions.",
    bestFor: "Long-term tax-saving goals",
    includes: "Maturity, interest, yearly data",
    href: "/ppf",
  },
  {
    id: "lumpsum",
    name: "Lumpsum Calculator",
    shortName: "Lumpsum",
    icon: BadgeIndianRupee,
    description: "See how a one-time investment may grow with CAGR, returns, and wealth multiplier.",
    bestFor: "One-time investment decisions",
    includes: "Corpus, CAGR, SIP comparison",
    href: "/lumpsum",
  },
  {
    id: "dcf-valuation",
    name: "DCF Valuation Calculator",
    shortName: "DCF Model",
    icon: Building2,
    description: "2-stage Discounted Cash Flow valuation with explicit forecast horizon, Gordon Growth terminal value, and net debt equity bridge.",
    bestFor: "Fundamental equity research & stock valuation",
    includes: "Intrinsic value/share, Enterprise value, WACC discount",
    href: "/dcf-valuation",
    badge: "CFA Analytics",
  },
  {
    id: "wacc",
    name: "WACC Calculator",
    shortName: "WACC",
    icon: Scale,
    description: "Calculate Weighted Average Cost of Capital (WACC) with corporate tax shield adjustment and capital structure weighting.",
    bestFor: "Corporate hurdle rates & valuation models",
    includes: "Cost of equity, After-tax debt cost, Tax shield",
    href: "/wacc",
    badge: "CFA Analytics",
  },
  {
    id: "dupont-analysis",
    name: "DuPont ROE Decomposition",
    shortName: "DuPont ROE",
    icon: BarChart3,
    description: "Deconstruct Return on Equity into Operating Margin, Asset Turnover, and Financial Leverage Gearing.",
    bestFor: "Quality stock screening & financial health",
    includes: "3-step breakdown, ROA, Primary driver analysis",
    href: "/dupont-analysis",
    badge: "CFA Analytics",
  },
  {
    id: "xirr-cagr-twrr",
    name: "XIRR Portfolio Analyzer",
    shortName: "XIRR Solver",
    icon: TrendingUp,
    description: "Exact annualized returns (XIRR) for irregular cash flows, non-periodic mutual fund SIPs, top-ups, and redemptions.",
    bestFor: "Mutual fund & stock portfolio performance",
    includes: "Exact Newton-Raphson solver, CAGR, Net gain",
    href: "/xirr-cagr-twrr",
    badge: "Portfolio Return",
  },
  {
    id: "portfolio-risk",
    name: "Portfolio Risk & Ratios",
    shortName: "Risk & Sharpe",
    icon: ShieldCheck,
    description: "Evaluate risk-adjusted return metrics including Sharpe Ratio, Sortino Ratio, downside volatility, and maximum historical drawdown.",
    bestFor: "Hedge funds, active traders & portfolio managers",
    includes: "Sharpe, Sortino, Downside deviation, Max Drawdown",
    href: "/portfolio-risk",
    badge: "Risk Analytics",
  },
  {
    id: "black-scholes",
    name: "Black-Scholes Option Greeks",
    shortName: "Black-Scholes",
    icon: LineChart,
    description: "Theoretical Call/Put pricing and real-time Option Greeks (Delta, Gamma, Theta, Vega) with Put-Call parity validation.",
    bestFor: "Option sellers, buyers & algorithmic traders",
    includes: "All 5 Greeks, Intrinsic vs time value, Parity check",
    href: "/black-scholes",
    badge: "Option Greeks",
  },
  {
    id: "margin-calculator",
    name: "NSE/BSE Margin & Leverage",
    shortName: "Margin / SPAN",
    icon: Scale,
    description: "Calculate mandatory upfront SPAN + Exposure margins and MTF daily interest carry under SEBI peak margin norms.",
    bestFor: "F&O futures traders & MTF equity investors",
    includes: "SPAN margin, Exposure margin, MTF daily cost",
    href: "/margin-calculator",
    badge: "SEBI Peak Norms",
  },
  {
    id: "car-loan-tco",
    name: "Car Loan Total Cost of Ownership",
    shortName: "Car TCO",
    icon: Building2,
    description: "True all-inclusive cost of owning a vehicle factoring in EMI interest, real-world fuel mileage, insurance, maintenance, and resale value.",
    bestFor: "Car buyers comparing EV vs ICE vs financing",
    includes: "Real cost per km, Resale curve, Net lifetime TCO",
    href: "/car-loan-tco",
    badge: "Real Cost / Km",
  },
  {
    id: "balance-transfer",
    name: "Home Loan Balance Transfer",
    shortName: "Balance Transfer",
    icon: Landmark,
    description: "Calculate net refinancing savings, monthly EMI drop, MODT stamp charges, and exact breakeven payback months.",
    bestFor: "Existing home loan borrowers lowering interest",
    includes: "Net savings, Switching fees, Breakeven timeline",
    href: "/balance-transfer",
    badge: "Save Lakhs",
  },
  {
    id: "marginal-relief",
    name: "Marginal Relief & Surcharge",
    shortName: "Marginal Relief",
    icon: Landmark,
    description: "Calculate income tax surcharge marginal relief above ₹50L, ₹1Cr, ₹2Cr, and ₹5Cr under Tax Year 2026-27.",
    bestFor: "High-income earners & tax consultants",
    includes: "Marginal relief saved, Surcharge tiers, 4% Cess",
    href: "/marginal-relief",
    badge: "Tax Year 2026-27",
  },
  {
    id: "lrs-tcs",
    name: "LRS TCS & Remittance",
    shortName: "LRS TCS",
    icon: WalletCards,
    description: "Calculate Section 394 (formerly 206C(1G)) TCS on foreign remittances for foreign stocks, tours, education loans, and medical treatment.",
    bestFor: "Foreign investors, travelers & parents of students abroad",
    includes: "₹10L threshold, 2% tour/edu, 20% general, Form 26AS credit",
    href: "/lrs-tcs",
    badge: "Section 394 Norms",
  },
  {
    id: "us-stock-tax",
    name: "US Stock Returns & DTAA",
    shortName: "US Stocks DTAA",
    icon: TrendingUp,
    description: "Model realized INR returns on US shares combining stock appreciation, USD-INR currency tailwinds, 24m LTCG 12.5%, and Section 90 FTC.",
    bestFor: "INDmoney, Vested, and Groww US stock investors",
    includes: "Currency gain/loss, Section 90 Foreign Tax Credit, LTCG",
    href: "/us-stock-tax",
    badge: "DTAA Tax Credit",
  },
  {
    id: "nre-nro-fcnr",
    name: "NRI Deposit Comparison",
    shortName: "NRE vs NRO",
    icon: Building2,
    description: "Side-by-side post-tax yield comparison across NRE (100% Tax-Free), NRO (31.2% TDS), and FCNR foreign currency deposits.",
    bestFor: "Non-Resident Indians (NRIs & OCIs)",
    includes: "Post-tax yield, DTAA reduced TDS, Repatriation limits",
    href: "/nre-nro-fcnr",
    badge: "NRI Banking",
  },
  {
    id: "nps",
    name: "NPS Pension & Corpus",
    shortName: "NPS Tier-1",
    icon: Landmark,
    description: "Model National Pension System Tier-1 wealth accumulation with PFRDA 2026 exit rules (up to 80% lump sum, 60% tax-free) and monthly pension.",
    bestFor: "Retirement planning & Section 80CCD(1B) extra ₹50k deduction",
    includes: "Monthly pension, 60% tax-free cap, Section 80CCD tax saved",
    href: "/nps",
    badge: "PFRDA 2026",
  },
];

const stats = [
  { value: "31", label: "Calculators" },
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Ads" },
  { value: "Tax Year 2026-27", label: "Finance Act 2026" },
];

const whyItems = [
  {
    icon: Clock3,
    title: "Instant by default",
    desc: "Use every calculator immediately. Sign-in is optional until you want saved workflows.",
  },
  {
    icon: Scale,
    title: "Clear breakdowns",
    desc: "See totals, assumptions, tables, and charts instead of just one final number.",
  },
  {
    icon: ShieldCheck,
    title: "Save & share",
    desc: "Sign in with Google to save calculations to your account and share them with anyone.",
  },
  {
    icon: WalletCards,
    title: "Made for India",
    desc: "Rupee formatting, Indian products, and tax-regime comparisons in one focused toolkit.",
  },
];

const saveBenefits = [
  "Keep important calculations in one history view",
  "Open saved results later from any signed-in session",
  "Share a saved result link when you want feedback",
];

const compareBenefits = [
  {
    icon: BarChart3,
    title: "Compare inputs",
    desc: "Adjust tenure, return rate, principal, and other inputs to understand tradeoffs.",
  },
  {
    icon: LineChart,
    title: "Compare outcomes",
    desc: "Read charts and tables to see how compounding, interest, and tax choices change the result.",
  },
  {
    icon: History,
    title: "Compare over time",
    desc: "Signed-in users can save useful results and revisit them from history.",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full px-4 py-1.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            Free forever · No ads · Sign in to save results
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
          Smart Financial<br />
          <span className="text-blue-600">
            Calculators
          </span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
          Free, accurate and instant — built for every Indian investor. Sign in to save and share your calculations.
        </p>

        <HomeHeroActions />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card p-4">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="calculators" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Calculator suite</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Choose the decision you want to model</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Every tool is usable immediately. Save buttons appear inside calculators for signed-in users.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.id}
              href={calc.href}
              className="surface-card surface-card-hover group rounded-2xl p-5 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <calc.icon className="h-6 w-6" />
                  </div>
                  {calc.badge && <Badge>{calc.badge}</Badge>}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {calc.shortName}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-card-foreground transition-colors group-hover:text-primary">
                    {calc.name}
                  </h3>
                  <p className="mt-2 min-h-[66px] text-sm leading-relaxed text-muted-foreground">
                    {calc.description}
                  </p>
                </div>

                <div className="mt-5 space-y-2 rounded-xl border border-border bg-muted/45 p-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Best for</p>
                    <p className="text-xs text-muted-foreground">{calc.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Includes</p>
                    <p className="text-xs text-muted-foreground">{calc.includes}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                Open calculator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 md:grid-cols-4">
          {whyItems.map((item) => (
            <div key={item.title} className="surface-card p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow">Save and share</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">Keep the calculations that matter</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Calculator results are not added to history automatically. Sign in with Google, then choose Save when a result is worth keeping or sharing.
          </p>
          <div className="mt-5 space-y-3">
            {saveBenefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                <p className="text-sm text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow">Compare scenarios</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">Understand tradeoffs before you decide</h2>
            </div>
          </div>
          <div className="space-y-4">
            {compareBenefits.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Trust and disclaimer</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Useful estimates, not financial advice</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                FinCalc India helps you model common financial calculations using the inputs you provide. Results are estimates and can differ from bank, fund, tax, or government calculations because actual rates, dates, fees, rules, and personal situations vary.
              </p>
            </div>
            <Link
              href="/sip"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-card-foreground transition-all duration-200 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
            >
              Start with SIP
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
