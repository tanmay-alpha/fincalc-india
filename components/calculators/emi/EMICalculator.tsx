"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Calculator, PieChart as PieChartIcon } from "lucide-react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyMobileResult from "@/components/ui/StickyMobileResult";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcEMI } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateEMIInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

const EMIPieChart = dynamic(
  () => import("@/components/calculators/emi/EMIChart").then((m) => ({ default: m.EMIPieChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const EMIBalanceChart = dynamic(
  () => import("@/components/calculators/emi/EMIChart").then((m) => ({ default: m.EMIBalanceChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const ROWS_PER_PAGE = 12;

export default function EMICalculator() {
  const [inputs, setInputs] = useState({ principal: 3000000, annualRate: 8.5, tenureMonths: 240 });
  const [tablePage, setTablePage] = useState(0);

  // Performance debounce pattern
  const debouncedInputs = useDebounce(inputs, 250);

  const results = useMemo(
    () => calcEMI(debouncedInputs),
    [debouncedInputs]
  );

  const insights = useMemo(() => generateEMIInsights(results), [results]);

  // Autosync hook
  const { shareId } = useAutoSave({
    calcType: "EMI",
    debouncedInputs,
    results: results as unknown as Record<string, unknown>,
    enabled: true,
  });

  const onPrincipal = useCallback((v: number) => setInputs((p) => ({ ...p, principal: v })), []);
  const onRate = useCallback((v: number) => setInputs((p) => ({ ...p, annualRate: v })), []);
  const onTenure = useCallback((v: number) => { setInputs((p) => ({ ...p, tenureMonths: v })); setTablePage(0); }, []);

  const totalPages = Math.ceil(results.amortizationSchedule.length / ROWS_PER_PAGE);
  const pagedRows = results.amortizationSchedule.slice(
    tablePage * ROWS_PER_PAGE,
    (tablePage + 1) * ROWS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">
      
      {/* ── Sticky Mobile Dock ── */}
      <StickyMobileResult label="Monthly EMI" value={formatINR(results.emi)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-3xl">🏦</span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] dark:text-white tracking-tight">EMI Calculator</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Calculate monthly EMI for home, car, or personal loans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-6 shadow-sm space-y-4">
            <HybridInput label="Loan Amount" value={inputs.principal} onChange={onPrincipal}
              min={10000} max={1000000000} step={50000} prefix="₹"
              quickChips={[
                { label: "₹10L", value: 1000000 },
                { label: "₹25L", value: 2500000 }, { label: "₹50L", value: 5000000 },
                { label: "₹1Cr", value: 10000000 },
              ]}
            />
            <HybridInput label="Interest Rate" value={inputs.annualRate} onChange={onRate}
              min={1} max={36} step={0.1} suffix="%"
              quickChips={[
                { label: "7%", value: 7 }, { label: "8.5%", value: 8.5 },
                { label: "10%", value: 10 }, { label: "12%", value: 12 },
              ]}
            />
            <HybridInput label="Loan Tenure" value={inputs.tenureMonths} onChange={onTenure}
              min={1} max={360} step={1} suffix="Months"
              quickChips={[
                { label: "5 Yr", value: 60 }, { label: "10 Yr", value: 120 },
                { label: "15 Yr", value: 180 }, { label: "20 Yr", value: 240 },
              ]}
            />
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Monthly EMI" value={results.emi}
              subItems={[
                { label: "Principal", value: results.principalAmount, color: "#2563EB" },
                { label: "Total Interest", value: results.totalInterest, color: "#DC2626" },
              ]}
            />

            <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Loan Breakup & Balance" icon={<PieChartIcon className="w-5 h-5"/>} defaultOpen>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">Principal vs Interest</h3>
                   <div className="h-[250px]"><EMIPieChart principal={results.principalAmount} totalInterest={results.totalInterest} /></div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">Balance Over Time</h3>
                   <div className="h-[250px]"><EMIBalanceChart schedule={results.amortizationSchedule} /></div>
                 </div>
               </div>
            </CollapsibleSection>

            {/* Amortization table */}
            <CollapsibleSection title="Amortization Schedule" icon={<Calculator className="w-5 h-5"/>}>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-3 text-left font-medium">Month</th>
                      <th className="py-3 text-right font-medium">EMI</th>
                      <th className="py-3 text-right font-medium">Principal</th>
                      <th className="py-3 text-right font-medium">Interest</th>
                      <th className="py-3 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((r) => (
                      <tr key={r.month} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2">{r.month}</td>
                        <td className="py-2 text-right">{formatINR(r.emi)}</td>
                        <td className="py-2 text-right text-blue-600 dark:text-blue-400">{formatINR(r.principal)}</td>
                        <td className="py-2 text-right text-slate-500 dark:text-slate-400">{formatINR(r.interest)}</td>
                        <td className="py-2 text-right font-medium">{formatINR(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setTablePage(Math.max(0, tablePage - 1))} disabled={tablePage === 0}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                     Previous
                  </button>
                  <span className="text-xs text-slate-400">Page {tablePage + 1} of {totalPages}</span>
                  <button onClick={() => setTablePage(Math.min(totalPages - 1, tablePage + 1))} disabled={tablePage >= totalPages - 1}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next
                  </button>
                </div>
              )}
            </CollapsibleSection>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="EMI" resultText={formatINR(results.emi)} /> : null}
              <SaveCalculationButton calcType="EMI" data={{ ...debouncedInputs, emi: results.emi }} />
            </div>

            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: Subject to Approval *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              This EMI calculation is strictly illustrative and excludes processing fees, insurance premiums, and other charges levied by banks or NBFCs.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
