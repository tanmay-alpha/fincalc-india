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
import { calcTax } from "@/lib/math";
import type { TaxRegime } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateTaxInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";
import { clsx } from "clsx";

const TaxChart = dynamic(
  () => import("@/components/calculators/tax/TaxChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function TaxCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    grossIncome: 1200000,
    regime: "new" as TaxRegime,
    deduction80C: 0,
    deduction80D: 25000,
    hraExemption: 0,
    otherDeductions: 0,
  });

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcTax(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateTaxInsights(results), [results]);

  const { shareId } = useAutoSave({
    calcType: "Tax",
    debouncedInputs,
    results: results as unknown as Record<string, unknown>,
    enabled: true,
  });

  const onIncome = useCallback((v: number) => setInputs(p => ({ ...p, grossIncome: v })), []);
  const onRegime = useCallback((r: TaxRegime) => setInputs(p => ({ ...p, regime: r })), []);
  const on80C = useCallback((v: number) => setInputs(p => ({ ...p, deduction80C: v })), []);
  const on80D = useCallback((v: number) => setInputs(p => ({ ...p, deduction80D: v })), []);
  const onHRA = useCallback((v: number) => setInputs(p => ({ ...p, hraExemption: v })), []);
  const onOther = useCallback((v: number) => setInputs(p => ({ ...p, otherDeductions: v })), []);



  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">

      <StickyResultBar label="Total Tax" value={results.totalTax} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'Income Tax Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🧾</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Income Tax Calculator</h1>
            <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-2.5 py-0.5">FY 2024-25</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Compare Old vs New regime with slab-by-slab breakdown</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit lg:sticky lg:top-6 shadow-sm space-y-4">

            <HybridInput label="Gross Annual Income" value={inputs.grossIncome} onChange={onIncome}
              min={100000} max={1000000000} step={50000} prefix="₹"
              quickChips={[
                { label: "₹5L", value: 500000 }, { label: "₹10L", value: 1000000 },
                { label: "₹15L", value: 1500000 }, { label: "₹30L", value: 3000000 },
                { label: "₹50L", value: 5000000 },
              ]}
            />

            {/* Regime toggle — prominent, full width */}
            <div className="grid grid-cols-2 gap-2">
              {(["new", "old"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => onRegime(r)}
                  className={clsx(
                    "py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2",
                    inputs.regime === r
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  )}
                >
                  {r === "new" ? "⚡ New Regime" : "📋 Old Regime"}
                  {r === "new" && (
                    <span className="block text-xs font-normal opacity-80 mt-0.5">Standard ₹75,000 deduction</span>
                  )}
                </button>
              ))}
            </div>

            {inputs.regime === 'old' && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Old Regime Deductions
                </p>
                <HybridInput label="Section 80C" value={inputs.deduction80C} onChange={on80C}
                  min={0} max={150000} step={5000} prefix="₹"
                  hint="ELSS, PPF, LIC, NPS, ULIP (Max ₹1,50,000)"
                  quickChips={[
                    { label: "₹50K", value: 50000 }, { label: "₹1L", value: 100000 },
                    { label: "₹1.5L", value: 150000 },
                  ]}
                />
                <HybridInput label="Section 80D (Medical)" value={inputs.deduction80D} onChange={on80D}
                  min={0} max={100000} step={5000} prefix="₹"
                  hint="Health insurance for self + parents (Max ₹1L)"
                  quickChips={[
                    { label: "₹25K", value: 25000 }, { label: "₹50K", value: 50000 },
                    { label: "₹75K", value: 75000 },
                  ]}
                />
                <HybridInput label="HRA Exemption" value={inputs.hraExemption} onChange={onHRA}
                  min={0} max={2000000} step={10000} prefix="₹"
                  hint="Applicable if you live in rented house"
                />
                <HybridInput label="Other Deductions" value={inputs.otherDeductions} onChange={onOther}
                  min={0} max={1000000} step={5000} prefix="₹"
                  hint="NPS 80CCD(1B), education loan interest etc."
                />
              </div>
            )}

            {/* New Regime info */}
            {inputs.regime === 'new' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm font-semibold text-blue-800">
                  ⚡ New Regime
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Standard deduction of ₹75,000 is automatically applied. No other deductions available under this regime.
                </p>
              </div>
            )}
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Total Tax Payable" value={results.totalTax}
              breakdown={[
                { label: "Gross Income", value: results.grossIncome, color: "blue" },
                { label: "Deductions", value: results.totalDeductions, color: "purple" },
                { label: "Tax", value: results.totalTax, color: "red" },
              ]}
            />

            {/* Regime Comparison Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Old vs New Regime</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={clsx(
                  "rounded-xl p-4 border-2 text-center",
                  inputs.regime === "old"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                )}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Old Regime</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{formatINR(results.comparison.oldRegimeTax)}</p>
                  {inputs.regime === "old" && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Selected</span>
                  )}
                </div>
                <div className={clsx(
                  "rounded-xl p-4 border-2 text-center",
                  inputs.regime === "new"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                )}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">New Regime</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{formatINR(results.comparison.newRegimeTax)}</p>
                  {inputs.regime === "new" && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Selected</span>
                  )}
                </div>
              </div>
              <div className={clsx(
                "mt-4 rounded-xl p-3 text-sm text-center",
                results.comparison.savings > 0
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
              )}>
                {results.comparison.savings > 0
                  ? `✅ ${results.comparison.recommendation === "new" ? "New" : "Old"} Regime saves you ${formatINR(results.comparison.savings)}`
                  : "Both regimes have similar tax liability"
                }
              </div>
            </div>

            {/* 80C Tax Saving Suggestion (Old Regime only) */}
            {inputs.regime === 'old' && inputs.deduction80C < 150000 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
                <p className="text-sm font-semibold text-amber-800">
                  💡 You can save more tax
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Investing {formatINR(150000 - inputs.deduction80C)} more in ELSS / PPF / NPS under 80C can save you {formatINR(Math.round((150000 - inputs.deduction80C) * (results.taxableIncome > 1000000 ? 0.3 : results.taxableIncome > 500000 ? 0.2 : 0.05)))} in additional tax
                </p>
                <button
                  onClick={() => setInputs(p => ({...p, deduction80C: 150000}))}
                  className="mt-2 text-xs font-semibold text-amber-700 underline hover:text-amber-900 transition">
                  Apply maximum 80C (₹1,50,000) →
                </button>
              </div>
            )}

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            {/* Slab Chart */}
            {results.slabBreakdown.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Tax Slab Breakdown ({inputs.regime === "new" ? "New" : "Old"} Regime)
                  </h3>
                </div>
                <div className="h-[300px]"><TaxChart slabs={results.slabBreakdown} /></div>
              </div>
            )}

            {/* Detailed Breakdown Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Detailed Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Slab</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slabBreakdown.map((s, i) => (
                      <tr key={i} className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-3">{s.slab}</td>
                        <td className="px-6 py-3 text-right">{s.rate}%</td>
                        <td className="px-6 py-3 text-right">{formatINR(s.amount)}</td>
                        <td className="px-6 py-3 text-right font-medium text-red-600 dark:text-red-400">{formatINR(s.tax)}</td>
                      </tr>
                    ))}
                    {results.surcharge > 0 && (
                      <tr className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <td className="px-6 py-3" colSpan={3}>Surcharge</td>
                        <td className="px-6 py-3 text-right font-medium">{formatINR(results.surcharge)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-3" colSpan={3}>Cess (4%)</td>
                      <td className="px-6 py-3 text-right font-medium">{formatINR(results.cess)}</td>
                    </tr>
                    <tr className="text-slate-900 dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/80">
                      <td className="px-6 py-3.5" colSpan={3}>Total Tax</td>
                      <td className="px-6 py-3.5 text-right text-red-600 dark:text-red-400">{formatINR(results.totalTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <SaveCalculationButton calcType="Tax" data={{ ...debouncedInputs, totalTax: results.totalTax }} />
              <ShareButton shareId={shareId} />
            </div>

            <RelatedCalculators current="tax" />
          </div>
        </div>
      </div>
    </main>
  );
}
