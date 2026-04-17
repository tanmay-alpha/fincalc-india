"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Calculator, PieChart as PieChartIcon } from "lucide-react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyMobileResult from "@/components/ui/StickyMobileResult";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcTax } from "@/lib/math";
import type { TaxRegime } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateTaxInsights } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

const TaxChart = dynamic(
  () => import("@/components/calculators/tax/TaxChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const related = [
  { href: "/emi", title: "EMI Calculator", icon: "🏦" },
  { href: "/sip", title: "SIP Calculator", icon: "📈" },
  { href: "/ppf", title: "PPF Calculator", icon: "🏛️" },
];

export default function TaxCalculator() {
  const [inputs, setInputs] = useState({
    grossIncome: 1200000,
    regime: "new" as TaxRegime,
    deduction80C: 150000,
    deduction80D: 25000,
    hraExemption: 0,
    otherDeductions: 0
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const results = useMemo(
    () => calcTax(debouncedInputs),
    [debouncedInputs]
  );

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

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">

      <StickyMobileResult label="Total Tax Payable" value={formatINR(results.totalTax)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🧾</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Income Tax Calculator</h1>
            <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-2.5 py-0.5">FY 2024-25</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Compare Old vs New regime with slab-by-slab breakdown</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          {/* ── Input Panel ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-6 shadow-[var(--shadow-card)]">
            <HybridInput label="Gross Annual Income" value={inputs.grossIncome} onChange={onIncome}
              min={100000} max={1000000000} step={50000} prefix="₹"
              quickChips={[
                { label: "₹5L", value: 500000 }, { label: "₹10L", value: 1000000 },
                { label: "₹15L", value: 1500000 }, { label: "₹30L", value: 3000000 },
                { label: "₹50L", value: 5000000 },
              ]}
            />

            {/* Regime Toggle */}
            <div className="group space-y-3 p-4 -mx-4 rounded-xl">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Tax Regime</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                {(["old", "new"] as TaxRegime[]).map((r) => (
                  <button key={r} type="button" onClick={() => onRegime(r)}
                    className={cn(
                      "py-2.5 text-sm font-semibold rounded-md transition-all duration-200",
                      inputs.regime === r
                        ? "bg-white dark:bg-slate-600 text-[var(--accent)] shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    )}>
                    {r === "old" ? "Old Regime" : "New Regime"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {inputs.regime === "new" ? "Standard deduction: ₹75,000" : "Standard deduction: ₹50,000 + Section 80C/80D"}
              </p>
            </div>

            {/* Old regime deductions */}
            {inputs.regime === "old" && (
              <HybridInput label="Section 80C" value={inputs.deduction80C} onChange={on80C}
                min={0} max={150000} step={5000} prefix="₹"
                hint="PPF, ELSS, LIC, EPF etc. (Max ₹1.5L)"
                quickChips={[
                  { label: "₹50K", value: 50000 }, { label: "₹1L", value: 100000 },
                  { label: "₹1.5L", value: 150000 },
                ]}
              />
            )}

            <HybridInput label="Section 80D (Medical)" value={inputs.deduction80D} onChange={on80D}
              min={0} max={100000} step={5000} prefix="₹"
              hint="Health insurance premium (Max ₹1L)"
              quickChips={[
                { label: "₹25K", value: 25000 }, { label: "₹50K", value: 50000 },
                { label: "₹75K", value: 75000 },
              ]}
            />
            <HybridInput label="HRA Exemption" value={inputs.hraExemption} onChange={onHRA}
              min={0} max={1000000} step={5000} prefix="₹"
              hint="House Rent Allowance exemption"
            />
            <HybridInput label="Other Deductions" value={inputs.otherDeductions} onChange={onOther}
              min={0} max={5000000} step={5000} prefix="₹"
              hint="NPS 80CCD, interest on education loan etc."
            />
          </div>

          {/* ── Results Panel ── */}
          <div className="space-y-5">
            <ResultHero label="Total Tax Payable" value={results.totalTax}
              subItems={[
                { label: "Taxable Income", value: results.taxableIncome, color: "#2563EB" },
                { label: "Deductions", value: results.totalDeductions, color: "#16A34A" },
              ]}
            />

            {/* Regime comparison card */}
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "rounded-xl p-4 border text-center transition-all",
                results.comparison.recommendation === "old"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              )}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Old Regime</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatINR(results.comparison.oldRegimeTax)}</p>
                {results.comparison.recommendation === "old" && (
                  <span className="inline-block mt-2 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-2.5 py-0.5">✓ Recommended</span>
                )}
              </div>
              <div className={cn(
                "rounded-xl p-4 border text-center transition-all",
                results.comparison.recommendation === "new"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              )}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">New Regime</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatINR(results.comparison.newRegimeTax)}</p>
                {results.comparison.recommendation === "new" && (
                  <span className="inline-block mt-2 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-2.5 py-0.5">✓ Recommended</span>
                )}
              </div>
            </div>

            <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </CollapsibleSection>

            {results.slabBreakdown.length > 0 && (
              <CollapsibleSection title={`Tax Slab Breakdown (${inputs.regime === "new" ? "New" : "Old"} Regime)`} icon={<PieChartIcon className="w-5 h-5"/>} defaultOpen>
                <div className="pt-2">
                  <div className="h-[250px]"><TaxChart slabs={results.slabBreakdown} /></div>
                </div>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Detailed Breakdown" icon={<Calculator className="w-5 h-5"/>}>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-3 text-left font-medium">Slab</th>
                      <th className="py-3 text-right font-medium">Rate</th>
                      <th className="py-3 text-right font-medium">Amount</th>
                      <th className="py-3 text-right font-medium">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slabBreakdown.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2">{s.slab}</td>
                        <td className="py-2 text-right">{s.rate}%</td>
                        <td className="py-2 text-right">{formatINR(s.amount)}</td>
                        <td className="py-2 text-right font-medium text-red-600 dark:text-red-400">{formatINR(s.tax)}</td>
                      </tr>
                    ))}
                    {results.surcharge > 0 && (
                      <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <td className="py-2" colSpan={3}>Surcharge</td>
                        <td className="py-2 text-right font-medium">{formatINR(results.surcharge)}</td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <td className="py-2" colSpan={3}>Cess (4%)</td>
                      <td className="py-2 text-right font-medium">{formatINR(results.cess)}</td>
                    </tr>
                    <tr className="text-slate-900 dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/80">
                      <td className="py-3" colSpan={3}>Total Tax</td>
                      <td className="py-3 text-right text-red-600 dark:text-red-400">{formatINR(results.totalTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="Tax" resultText={formatINR(results.totalTax)} /> : null}
              <SaveCalculationButton calcType="Tax" data={{ ...debouncedInputs, totalTax: results.totalTax }} />
            </div>

            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: strictly illustrative *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              This tax calculation is based on current slabs and should not be considered professional tax advice. Consult a CA for accurate filing.
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
