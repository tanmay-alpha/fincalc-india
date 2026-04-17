"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp } from "lucide-react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyMobileResult from "@/components/ui/StickyMobileResult";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcPPF } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generatePPFInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

const PPFChart = dynamic(
  () => import("@/components/calculators/ppf/PPFChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const related = [
  { href: "/fd", title: "FD Calculator", icon: "🔒" },
  { href: "/sip", title: "SIP Calculator", icon: "📈" },
  { href: "/tax", title: "Tax Calculator", icon: "🧾" },
];

export default function PPFCalculator() {
  const [inputs, setInputs] = useState({
    yearlyInvestment: 150000,
    years: 15,
    rate: 7.1
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const results = useMemo(
    () => calcPPF(debouncedInputs),
    [debouncedInputs]
  );

  const insights = useMemo(() => generatePPFInsights(results), [results]);

  const { shareId } = useAutoSave({
    calcType: "PPF",
    debouncedInputs,
    results: results as unknown as Record<string, unknown>,
    enabled: true,
  });

  const onInvestment = useCallback((v: number) => setInputs(p => ({ ...p, yearlyInvestment: v })), []);
  const onYears = useCallback((v: number) => setInputs(p => ({ ...p, years: v })), []);
  const onRate = useCallback((v: number) => setInputs(p => ({ ...p, rate: v })), []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">

      <StickyMobileResult label="Maturity Value" value={formatINR(results.maturityValue)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">PPF Calculator</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Project your PPF corpus with tax-free returns over 15+ years</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-6 shadow-[var(--shadow-card)]">
            <HybridInput label="Yearly Investment" value={inputs.yearlyInvestment} onChange={onInvestment}
              min={500} max={150000} step={500} prefix="₹"
              quickChips={[
                { label: "₹50K", value: 50000 },
                { label: "₹1L", value: 100000 },
                { label: "₹1.5L", value: 150000 },
              ]}
              hint="Max ₹1,50,000/year under Section 80C"
            />
            <HybridInput label="Duration" value={inputs.years} onChange={onYears}
              min={15} max={50} step={1} suffix="Yrs"
              quickChips={[
                { label: "15 Yr", value: 15 }, { label: "20 Yr", value: 20 },
                { label: "25 Yr", value: 25 }, { label: "30 Yr", value: 30 },
              ]}
              hint="PPF minimum lock-in: 15 years"
            />
            <HybridInput label="PPF Rate" value={inputs.rate} onChange={onRate}
              min={1} max={15} step={0.1} suffix="%"
              hint="Current PPF rate: 7.1% (set by Govt. quarterly)"
            />
          </div>

          <div className="space-y-5">
            <ResultHero label="Maturity Value" value={results.maturityValue}
              subItems={[
                { label: "Total Invested", value: results.totalInvested, color: "#2563EB" },
                { label: "Interest Earned", value: results.totalInterest, color: "#16A34A" },
              ]}
            />

            <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Deposit vs Interest — Year by Year" icon={<TrendingUp className="w-5 h-5"/>} defaultOpen>
              <div className="pt-2">
                <div className="h-[250px]"><PPFChart data={results.yearlyData} /></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Year-by-Year Breakdown" icon={<Calculator className="w-5 h-5"/>}>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-3 text-left font-medium">Year</th>
                      <th className="py-3 text-right font-medium">Deposit</th>
                      <th className="py-3 text-right font-medium">Interest</th>
                      <th className="py-3 text-right font-medium">Balance</th>
                      <th className="py-3 text-center font-medium">Withdrawal</th>
                      <th className="py-3 text-center font-medium">Loan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((r) => (
                      <tr key={r.year} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2">{r.year}</td>
                        <td className="py-2 text-right">{formatINR(r.deposit)}</td>
                        <td className="py-2 text-right text-green-600 dark:text-green-400">{formatINR(r.interest)}</td>
                        <td className="py-2 text-right font-medium">{formatINR(r.balance)}</td>
                        <td className="py-2 text-center">{r.withdrawalAllowed ? <span className="text-green-600">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                        <td className="py-2 text-center">{r.loanAllowed ? <span className="text-blue-600">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="PPF" resultText={formatINR(results.maturityValue)} /> : null}
              <SaveCalculationButton calcType="PPF" data={{ ...debouncedInputs, maturity: results.maturityValue }} />
            </div>

            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: Subject to Approval *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              This PPF calculation is strictly illustrative. Actual interest rates are mandated by the government periodically.
            </p>

            <div className="pt-8">
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
