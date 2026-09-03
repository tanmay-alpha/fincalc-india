import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
  FileCode2,
  TrendingUp,
  FileText,
  LineChart,
  Building2,
  Scale,
  Landmark,
} from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import CategoryDirectory from "@/components/home/CategoryDirectory";
import { CALCULATOR_REGISTRY } from "@/lib/calculators";

// 8 Curated Flagship Popular Tools
const POPULAR_TOOL_IDS = [
  "tax",
  "sip",
  "emi",
  "capital-gains-tax",
  "xirr-cagr-twrr",
  "nps",
  "fno-brokerage",
  "dcf-valuation",
];

const POPULAR_TOOLS = POPULAR_TOOL_IDS.map((id) =>
  CALCULATOR_REGISTRY.find((c) => c.id === id)
).filter(Boolean);

const ICON_MAP: Record<string, typeof TrendingUp> = {
  tax: FileText,
  sip: TrendingUp,
  emi: Building2,
  "capital-gains-tax": FileText,
  "xirr-cagr-twrr": TrendingUp,
  nps: Landmark,
  "fno-brokerage": LineChart,
  "dcf-valuation": Scale,
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* SECTION 1 — HERO */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Regulatory Tax Year Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Updated for Tax Year 2026–27 (Income Tax Act, 2025)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Make smarter <span className="text-primary">financial decisions.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            31 calculators for investing, tax, loans, trading and valuation — built for India.
          </p>

          {/* Calculator Autocomplete Search */}
          <HeroSearch />

          {/* Primary & Secondary Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#calculators"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Explore calculators</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/tax"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted/70 transition-all"
            >
              <span>Open Income Tax Calculator</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* SECTION 2 — POPULAR TOOLS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Quick Access
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                Popular Financial Tools
              </h2>
            </div>
            <a
              href="#calculators"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all 31</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_TOOLS.map((calc) => {
              if (!calc) return null;
              const Icon = ICON_MAP[calc.id] || TrendingUp;

              return (
                <Link
                  key={calc.id}
                  href={calc.route}
                  className="group p-5 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      {calc.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {calc.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Open tool</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 — CATEGORY DISCOVERY (ALL 31 TOOLS) */}
        <CategoryDirectory />

        {/* SECTION 4 — TRUST & CREDIBILITY */}
        <section className="pt-10 pb-6 border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Built for Precision
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              India&apos;s Financial Calculation Workspace
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Designed with institutional mathematical rigor and complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                <FileCode2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">31 Financial Calculators</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Comprehensive coverage spanning personal wealth, statutory tax, debt planning, and equity valuation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Tax Year 2026–27</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Incorporates Finance Act 2026, Section 157 rebate (₹12L), updated STT, and capital gains rules.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Private & Local by Default</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Calculations execute instantly in your browser. Authentication and cloud saves are strictly optional.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Transparent Assumptions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct statutory citations, documented formulas, and clear assumption drawers for every calculator.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
