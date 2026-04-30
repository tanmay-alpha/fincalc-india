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
import { calcPPF } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generatePPFInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

const PPFChart = dynamic(
  () => import("@/components/calculators/ppf/PPFChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function PPFCalculator() {
  const [inputs, setInputs] = useState({
    yearlyInvestment: 150000,
    years: 15,
    rate: 7.1,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcPPF(debouncedInputs), [debouncedInputs]);
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

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">

      <StickyResultBar label="Maturity Value" value={results.maturityValue} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'PPF Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PPF Calculator</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Project your PPF corpus with tax-free returns over 15+ years</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit lg:sticky lg:top-6 shadow-sm space-y-4">

            {/* PPF Rules Banner */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-1">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">📋 PPF Rules</p>
              <div className="space-y-1 text-xs text-amber-600 dark:text-amber-500">
                <p>• Lock-in period: 15 years minimum</p>
                <p>• Maximum yearly investment: ₹1,50,000</p>
                <p>• Partial withdrawal: allowed after Year 7</p>
                <p>• Interest is completely tax-free</p>
              </div>
            </div>

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
              min={15} max={50} step={1} suffix=" Yrs"
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

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Maturity Value" value={results.maturityValue}
              breakdown={[
                { label: "Total Invested", value: results.totalInvested, color: "blue" },
                { label: "Interest Earned", value: results.totalInterest, color: "green" },
              ]}
            />

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Deposit vs Interest — Year by Year</h3>
                <span className="text-xs text-slate-400">With balance line</span>
              </div>
              <div className="h-[300px]"><PPFChart data={results.yearlyData} /></div>
            </div>

            {/* Year-by-Year Table with Withdrawal/Loan columns */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Year-by-Year Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Year</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Deposit</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Withdrawal</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Loan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((r) => (
                      <tr key={r.year} className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.year}</td>
                        <td className="px-4 py-3 text-right">{formatINR(r.deposit)}</td>
                        <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{formatINR(r.interest)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatINR(r.balance)}</td>
                        <td className="px-4 py-3 text-center">
                          {r.withdrawalAllowed
                            ? <span className="text-green-600 font-bold">✓</span>
                            : <span className="text-slate-300 dark:text-slate-600">—</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.loanAllowed
                            ? <span className="text-blue-600 font-bold">✓</span>
                            : <span className="text-slate-300 dark:text-slate-600">—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-4 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
              * PPF interest calculated on annual compounding basis. Actual PPF credits interest on minimum balance between 5th-last of each month.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <ShareButton shareId={shareId} />
              <SaveCalculationButton calcType="PPF" data={{ ...debouncedInputs, maturity: results.maturityValue }} />
            </div>

            <RelatedCalculators current="ppf" />
          </div>
        </div>
      </div>
    </main>
  );
}
