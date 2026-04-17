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
import { calcLumpsum } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateLumpsumInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

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
  const [inputs, setInputs] = useState({
    principal: 500000,
    annualRate: 12,
    years: 10
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const results = useMemo(
    () => calcLumpsum(debouncedInputs),
    [debouncedInputs]
  );

  const insights = useMemo(() => generateLumpsumInsights(results), [results]);

  const { shareId } = useAutoSave({
    calcType: "Lumpsum",
    debouncedInputs,
    results: results as unknown as Record<string, unknown>,
    enabled: true,
  });

  const onPrincipal = useCallback((v: number) => setInputs(p => ({ ...p, principal: v })), []);
  const onRate = useCallback((v: number) => setInputs(p => ({ ...p, annualRate: v })), []);
  const onYears = useCallback((v: number) => setInputs(p => ({ ...p, years: v })), []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">

      <StickyMobileResult label="Total Corpus" value={formatINR(results.totalCorpus)} />

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
            <HybridInput label="Investment Amount" value={inputs.principal} onChange={onPrincipal}
              min={1000} max={1000000000} step={10000} prefix="₹"
              quickChips={[
                { label: "₹1L", value: 100000 }, { label: "₹5L", value: 500000 },
                { label: "₹10L", value: 1000000 }, { label: "₹50L", value: 5000000 },
                { label: "₹1Cr", value: 10000000 },
              ]}
            />
            <HybridInput label="Expected Return" value={inputs.annualRate} onChange={onRate}
              min={1} max={50} step={0.5} suffix="%"
              quickChips={[
                { label: "8%", value: 8 }, { label: "10%", value: 10 },
                { label: "12%", value: 12 }, { label: "15%", value: 15 },
                { label: "18%", value: 18 }, { label: "24%", value: 24 },
              ]}
            />
            <HybridInput label="Time Period" value={inputs.years} onChange={onYears}
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
                { label: "Invested", value: inputs.principal, color: "#2563EB" },
                { label: "Returns", value: results.estimatedReturns, color: "#16A34A" },
              ]}
            />

            <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Wealth Growth Curve" icon={<TrendingUp className="w-5 h-5"/>} defaultOpen>
              <div className="pt-2">
                <div className="h-[250px]"><LumpsumChart data={results.growthData} principal={inputs.principal} /></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Year-by-Year Growth" icon={<Calculator className="w-5 h-5"/>}>
              <div className="overflow-x-auto pt-2">
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
                        <td className="py-2 text-right text-green-600 dark:text-green-400">{formatINR(r.value - inputs.principal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">* CAGR: {results.CAGR}% · Wealth Ratio: {results.wealthRatio}x</p>
            </CollapsibleSection>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="Lumpsum" resultText={formatINR(results.totalCorpus)} /> : null}
              <SaveCalculationButton calcType="Lumpsum" data={{ ...debouncedInputs, totalCorpus: results.totalCorpus }} />
            </div>

            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: Subject to Approval *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              This Lumpsum calculation is strictly illustrative and excludes processing fees, taxes, and other charges. Returns are not guaranteed.
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
