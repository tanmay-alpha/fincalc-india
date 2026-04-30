import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CALCULATORS = [
  {
    id: "sip",
    name: "SIP Calculator",
    icon: "📈",
    description: "Plan monthly investments and see compound growth with year-by-year breakdown",
    href: "/sip",
    badge: "Most Popular",
  },
  {
    id: "emi",
    name: "EMI Calculator",
    icon: "🏦",
    description: "Calculate home, car, or personal loan EMI with full amortization schedule",
    href: "/emi",
    badge: null,
  },
  {
    id: "fd",
    name: "FD Calculator",
    icon: "🔒",
    description: "Estimate fixed deposit maturity with multiple compounding frequencies",
    href: "/fd",
    badge: null,
  },
  {
    id: "ppf",
    name: "PPF Calculator",
    icon: "🏛️",
    description: "Project your PPF corpus with tax-free returns over 15 to 50 years",
    href: "/ppf",
    badge: null,
  },
  {
    id: "lumpsum",
    name: "Lumpsum Calculator",
    icon: "💰",
    description: "See one-time investment growth with CAGR and SIP comparison",
    href: "/lumpsum",
    badge: null,
  },
  {
    id: "tax",
    name: "Income Tax Calculator",
    icon: "🧾",
    description: "Compare Old vs New tax regime with slab breakdown for FY 2024-25",
    href: "/tax",
    badge: "FY 2024-25",
  },
];

const FEATURES = [
  { icon: "⚡", title: "Instant", desc: "Real-time results as you type" },
  { icon: "🎯", title: "Accurate", desc: "Verified Indian tax slabs & formulas" },
  { icon: "🔒", title: "Private", desc: "All calculations on your device" },
  { icon: "📱", title: "Mobile first", desc: "Works perfectly on any screen" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">

        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-700 font-medium">
            Free · No ads · No login required
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Smart Financial<br />
          <span className="text-blue-600">Calculators</span>
        </h1>

        <p className="text-lg text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">
          Free, accurate and instant — built for every Indian investor
        </p>

        <div className="flex flex-wrap justify-center gap-8 py-6 mb-2">
          {[
            { value: '6', label: 'Calculators' },
            { value: '100%', label: 'Free forever' },
            { value: '0', label: 'Ads or trackers' },
            { value: 'FY 25', label: 'Tax data updated' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Calculator grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">

        <h2 className="text-xl font-semibold text-slate-900 mb-6">Choose a Calculator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CALCULATORS.map(calc => (
            <Link
              key={calc.id}
              href={calc.href}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                  {calc.icon}
                </div>
                {calc.badge && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2.5 py-0.5 font-medium">
                    {calc.badge}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-lg text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
                {calc.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {calc.description}
              </p>

              <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                Calculate
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* Why use section */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold text-slate-900 text-center mb-8">Why FinCalc India?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {FEATURES.map(f => (
              <div key={f.title} className="space-y-2">
                <div className="text-3xl">{f.icon}</div>
                <p className="font-semibold text-slate-900 text-sm">{f.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
