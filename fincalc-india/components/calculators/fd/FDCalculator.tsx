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
import { calcFD } from "@/lib/math";
import type { CompoundingFrequency } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateFDInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

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
  const [inputs, setInputs] = useState({
    principal: 100000,
    annualRate: 7,
    tenureYears: 5,
    compoundingFrequency: 4 as CompoundingFrequency
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const results = useMemo(
    () => calcFD(debouncedInputs),
    [debouncedInputs]
  );

  const insights = useMemo(() => generateFDInsights(results), [results]);

  const { shareId } = useAutoSave({
    calcType: "FD",
    debouncedInputs,
    results: results as unknown as Record<string, unknown>,
    enabled: true,
  });

  const onPrincipal = useCallback((v: number) => setInputs(p => ({ ...p, principal: v })), []);
  const onRate = useCallback((v: number) => setInputs(p => ({ ...p, annualRate: v })), []);
  const onTenure = useCallback((v: number) => setInputs(p => ({ ...p, tenureYears: v })), []);
  const onFreq = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputs(p => ({ ...p, compoundingFrequency: Number(e.target.value) as CompoundingFrequency }));
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">
      
      <StickyMobileResult label="Maturity Amount" value={formatINR(results.maturityAmount)} />

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
            <HybridInput label="Deposit Amount" value={inputs.principal} onChange={onPrincipal}
              min={1000} max={1000000000} step={5000} prefix="₹"
              quickChips={[
                { label: "₹10K", value: 10000 }, { label: "₹50K", value: 50000 },
                { label: "₹1L", value: 100000 }, { label: "₹5L", value: 500000 },
                { label: "₹10L", value: 1000000 },
              ]}
            />
            <HybridInput label="Interest Rate" value={inputs.annualRate} onChange={onRate}
              min={1} max={20} step={0.1} suffix="%"
              quickChips={[
                { label: "5.5%", value: 5.5 }, { label: "6.5%", value: 6.5 },
                { label: "7%", value: 7 }, { label: "7.5%", value: 7.5 },
                { label: "8%", value: 8 },
              ]}
            />
            <HybridInput label="Tenure" value={inputs.tenureYears} onChange={onTenure}
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
              <select value={inputs.compoundingFrequency} onChange={onFreq}
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

            <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="FD Growth Over Time" icon={<TrendingUp className="w-5 h-5"/>} defaultOpen>
              <div className="pt-2">
                <div className="h-[250px]"><FDChart data={results.growthData} /></div>
              </div>
            </CollapsibleSection>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="FD" resultText={formatINR(results.maturityAmount)} /> : null}
              <SaveCalculationButton calcType="FD" data={{ ...debouncedInputs, maturity: results.maturityAmount }} />
            </div>

            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: Subject to Approval *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              This FD calculation is strictly illustrative. Actual bank interest rates, inflation variables, and compounding dates may vary.
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
