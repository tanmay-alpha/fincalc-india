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
import { calcLumpsum } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateLumpsumInsights } from "@/lib/insights";

const LumpsumChart = dynamic(
  () => import("@/components/calculators/lumpsum/LumpsumChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const related = [
  { href: "/sip", title: "SIP Calculator", icon: "📈" },
  { href: "/ppf", title: "PPF Calculator", icon: "🏛️" },
  { href: "/fd", title: "FD Calculator", icon: "🔒" },
];

export default function LumpsumCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const results = useMemo(
    () => calcLumpsum({ principal, annualRate, years }),
    [principal, annualRate, years]
  );

  const insights = useMemo(() => generateLumpsumInsights(results), [results]);

  const onPrincipal = useCallback((v: number) => setPrincipal(v), []);
  const onRate = useCallback((v: number) => setAnnualRate(v), []);
  const onYears = useCallback((v: number) => setYears(v), []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">💰</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Lumpsum Calculator</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">See one-time investment growth with CAGR and wealth multiplier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-6 shadow-[var(--shadow-card)]">
            <HybridInput label="Investment Amount" value={principal} onChange={onPrincipal}
              min={1000} max={1000000000} step={10000} prefix="₹"
              quickChips={[
                { label: "₹1L", value: 100000 }, { label: "₹5L", value: 500000 },
                { label: "₹10L", value: 1000000 }, { label: "₹50L", value: 5000000 },
                { label: "₹1Cr", value: 10000000 },
              ]}
            />
            <HybridInput label="Expected Return" value={annualRate} onChange={onRate}
              min={1} max={50} step={0.5} suffix="%"
              quickChips={[
                { label: "8%", value: 8 }, { label: "10%", value: 10 },
                { label: "12%", value: 12 }, { label: "15%", value: 15 },
                { label: "18%", value: 18 }, { label: "24%", value: 24 },
              ]}
            />
            <HybridInput label="Time Period" value={years} onChange={onYears}
              min={1} max={50} step={1} suffix="Yrs"
              quickChips={[
                { label: "5 Yr", value: 5 }, { label: "10 Yr", value: 10 },
                { label: "15 Yr", value: 15 }, { label: "20 Yr", value: 20 },
                { label: "30 Yr", value: 30 },
              ]}
            />
          </div>

          <div className="space-y-5">
            <ResultHero label="Total Corpus" value={results.totalCorpus}
              subItems={[
                { label: "Invested", value: principal, color: "#2563EB" },
                { label: "Returns", value: results.estimatedReturns, color: "#16A34A" },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Wealth Growth Curve</h3>
              <LumpsumChart data={results.growthData} principal={principal} />
            </div>

            {/* Growth table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Year-by-Year Growth</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-3 text-left font-medium">Year</th>
                      <th className="py-3 text-right font-medium">Value</th>
                      <th className="py-3 text-right font-medium">Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.growthData.map((r) => (
                      <tr key={r.year} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2">{r.year}</td>
                        <td className="py-2 text-right font-medium">{formatINR(r.value)}</td>
                        <td className="py-2 text-right text-green-600 dark:text-green-400">{formatINR(r.value - principal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">* CAGR: {results.CAGR}% · Wealth Ratio: {results.wealthRatio}x</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ShareButton calcType="Lumpsum" resultText={formatINR(results.totalCorpus)} />
              <SaveCalculationButton calcType="Lumpsum" data={{ principal, annualRate, years, totalCorpus: results.totalCorpus }} />
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
