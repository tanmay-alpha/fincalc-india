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
    id: "tax",
    name: "Income Tax Calculator",
    shortName: "Tax",
    icon: FileText,
    description: "Compare old and new regime tax estimates with slab-by-slab breakdown for the app's tax year.",
    bestFor: "Salary and tax planning",
    includes: "Tax payable, regime comparison",
    href: "/tax",
    badge: "Regime compare",
  },
];

const stats = [
  { value: "6", label: "Calculators" },
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Ads" },
  { value: "FY 25", label: "Tax updated" },
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
    title: "Save & Share",
    desc: "Sign in to save calculations",
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
              className="surface-card surface-card-hover group rounded-2xl p-5"
            >
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
