"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyResultBar from "@/components/ui/StickyResultBar";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcFD } from "@/lib/math";
import type { CompoundingFrequency } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateFDInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";
import { clsx } from "clsx";

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

export default function FDCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    principal: 100000,
    annualRate: 7,
    tenureYears: 3,
    compoundingFrequency: 4 as CompoundingFrequency,
  });

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcFD(debouncedInputs), [debouncedInputs]);
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
  const onFreq = useCallback((freq: CompoundingFrequency) => {
    setInputs(p => ({ ...p, compoundingFrequency: freq }));
  }, []);



  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-24 lg:pb-0">

      <StickyResultBar label="Maturity Amount" value={results.maturityAmount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'FD Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🔒</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">FD Calculator</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Estimate fixed deposit maturity with multiple compounding options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit lg:sticky lg:top-6 shadow-sm space-y-4">
            <HybridInput label="Principal Amount" value={inputs.principal} onChange={onPrincipal}
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
              hint="Current best FD rates: 7-8%"
            />
            <HybridInput label="Tenure" value={inputs.tenureYears} onChange={onTenure}
              min={1} max={30} step={1} suffix=" Yrs"
              quickChips={[
                { label: "1 Yr", value: 1 }, { label: "2 Yr", value: 2 },
                { label: "3 Yr", value: 3 }, { label: "5 Yr", value: 5 },
                { label: "10 Yr", value: 10 },
              ]}
            />

            {/* Compounding Frequency — button group */}
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compounding Frequency</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {compoundingOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => onFreq(o.value)}
                    className={clsx(
                      "py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border",
                      inputs.compoundingFrequency === o.value
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Maturity Amount" value={results.maturityAmount}
              breakdown={[
                { label: "Principal", value: inputs.principal, color: "blue" },
                { label: "Interest Earned", value: results.totalInterest, color: "green" },
              ]}
            />

            {/* Extra info cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium">Interest Earned</p>
                <p className="text-xl font-bold text-green-700">
                  {formatINR(results.totalInterest)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {results.totalReturnPct.toFixed(2)}% total return
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium">Effective Annual Yield</p>
                <p className="text-xl font-bold text-blue-700">
                  {results.effectiveAnnualYield.toFixed(2)}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Per year after compounding
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">FD Growth Over Time</h3>
                <span className="text-xs text-slate-400">Growth curve</span>
              </div>
              <div className="h-[300px]"><FDChart data={results.growthData} /></div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <ShareButton shareId={shareId} />
              <SaveCalculationButton calcType="FD" data={{ ...debouncedInputs, maturity: results.maturityAmount }} />
            </div>

            <RelatedCalculators current="fd" />
          </div>
        </div>
      </div>
    </main>
  );
}
