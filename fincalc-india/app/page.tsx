import Link from "next/link";
import {
  TrendingUp, Building2, Lock, Landmark, Coins, FileText, ArrowRight
} from "lucide-react";

const calculators = [
  {
    href: "/sip",
    title: "SIP Calculator",
    description: "Plan monthly investments and see compound growth over time",
    icon: TrendingUp,
    badge: "Most Popular",
  },
  {
    href: "/emi",
    title: "EMI Calculator",
    description: "Calculate home, car, or personal loan EMI with amortization",
    icon: Building2,
  },
  {
    href: "/fd",
    title: "FD Calculator",
    description: "Estimate fixed deposit maturity with multiple compounding options",
    icon: Lock,
  },
  {
    href: "/ppf",
    title: "PPF Calculator",
    description: "Project your PPF corpus with tax-free returns over 15+ years",
    icon: Landmark,
  },
  {
    href: "/lumpsum",
    title: "Lumpsum Calculator",
    description: "See one-time investment growth with CAGR and wealth multiplier",
    icon: Coins,
  },
  {
    href: "/tax",
    title: "Income Tax Calculator",
    description: "Compare Old vs New regime with slab-by-slab breakdown & surcharge",
    icon: FileText,
    badge: "FY 2024-25",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Smart Financial Calculators
        </h1>
        <p className="text-lg text-slate-500 mt-3 max-w-xl mx-auto">
          Free, accurate and instant — built for every Indian investor
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-400">
          <span>6 Calculators</span>
          <span className="hidden sm:inline">·</span>
          <span>No Login Required</span>
          <span className="hidden sm:inline">·</span>
          <span>Free Forever</span>
          <span className="hidden sm:inline">·</span>
          <span>Built for India 🇮🇳</span>
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Choose a Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.href}
                href={calc.href}
                className="block bg-white rounded-2xl border border-slate-200 p-6 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] transition-all duration-200 group"
              >
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {calc.badge && (
                    <span className="bg-blue-600 text-white rounded-full text-xs font-semibold px-2.5 py-0.5">
                      {calc.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed">
                  {calc.description}
                </p>
                <div className="flex items-center text-sm font-medium text-blue-600 mt-4 group-hover:gap-1 transition-all">
                  Calculate <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
