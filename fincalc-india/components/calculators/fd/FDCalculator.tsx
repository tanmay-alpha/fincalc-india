"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcFD } from "@/lib/math";
import type { CompoundingFrequency } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateFDInsights } from "@/lib/insights";

const FDChart = dynamic(
  () => import("@/components/calculators/fd/FDChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const compoundingOptions: { label: string; value: CompoundingFrequency }[] = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Half-yearly", value: 2 },
  { label: "Annually", value: 1 },
];

const related = [
  { href: "/ppf", title: "PPF Calculator", icon: "🏛️" },
  { href: "/sip", title: "SIP Calculator", icon: "📈" },
  { href: "/lumpsum", title: "Lumpsum Calculator", icon: "💰" },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [annualRate, setAnnualRate] = useState(7);
  const [tenureYears, setTenureYears] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>(4);

  const results = useMemo(
    () => calcFD({ principal, annualRate, tenureYears, compoundingFrequency }),
    [principal, annualRate, tenureYears, compoundingFrequency]
  );

  const insights = useMemo(() => generateFDInsights(results), [results]);

  const onPrincipal = useCallback((v: number) => setPrincipal(v), []);
  const onRate = useCallback((v: number) => setAnnualRate(v), []);
  const onTenure = useCallback((v: number) => setTenureYears(v), []);
  const onFreq = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompoundingFrequency(Number(e.target.value) as CompoundingFrequency);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🔒</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">FD Calculator</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Estimate fixed deposit maturity with multiple compounding options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          {/* ── Input Panel ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-6 shadow-[var(--shadow-card)]">
            <HybridInput label="Deposit Amount" value={principal} onChange={onPrincipal}
              min={1000} max={1000000000} step={5000} prefix="₹"
              quickChips={[
                { label: "₹10K", value: 10000 }, { label: "₹50K", value: 50000 },
                { label: "₹1L", value: 100000 }, { label: "₹5L", value: 500000 },
                { label: "₹10L", value: 1000000 },
              ]}
            />
            <HybridInput label="Interest Rate" value={annualRate} onChange={onRate}
              min={1} max={20} step={0.1} suffix="%"
              quickChips={[
                { label: "5.5%", value: 5.5 }, { label: "6.5%", value: 6.5 },
                { label: "7%", value: 7 }, { label: "7.5%", value: 7.5 },
                { label: "8%", value: 8 },
              ]}
            />
            <HybridInput label="Tenure" value={tenureYears} onChange={onTenure}
              min={1} max={30} step={1} suffix="Yrs"
              quickChips={[
                { label: "1 Yr", value: 1 }, { label: "2 Yr", value: 2 },
                { label: "3 Yr", value: 3 }, { label: "5 Yr", value: 5 },
                { label: "10 Yr", value: 10 },
              ]}
            />

            {/* Compounding dropdown */}
            <div className="group space-y-3 p-4 -mx-4 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 focus-within:bg-slate-50 dark:focus-within:bg-slate-800/50">
              <label className="text-sm font-medium text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">
                Compounding Frequency
              </label>
              <select value={compoundingFrequency} onChange={onFreq}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-[var(--border-default)] bg-white dark:bg-slate-800 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-colors">
                {compoundingOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Results Panel ── */}
          <div className="space-y-5">
            <ResultHero label="Maturity Amount" value={results.maturityAmount}
              subItems={[
                { label: "Principal", value: results.maturityAmount - results.totalInterest, color: "#2563EB" },
                { label: "Interest Earned", value: results.totalInterest, color: "#16A34A" },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">FD Growth Over Time</h3>
              <FDChart data={results.growthData} />
            </div>

            <div className="flex flex-wrap gap-3">
              <ShareButton calcType="FD" resultText={formatINR(results.maturityAmount)} />
              <SaveCalculationButton calcType="FD" data={{ principal, annualRate, tenureYears, compoundingFrequency, maturity: results.maturityAmount }} />
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Related Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((c) => (
                  <Link key={c.href} href={c.href} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{c.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-blue-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
