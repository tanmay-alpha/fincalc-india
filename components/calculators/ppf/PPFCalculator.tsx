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
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => setShareId(null), [debouncedInputs]);

  const onInvestment = useCallback((v: number) => setInputs(p => ({ ...p, yearlyInvestment: v })), []);
  const onYears = useCallback((v: number) => setInputs(p => ({ ...p, years: v })), []);
  const onRate = useCallback((v: number) => setInputs(p => ({ ...p, rate: v })), []);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="page-shell pb-24 lg:pb-0">

      <StickyResultBar label="Maturity Value" value={results.maturityValue} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'PPF Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">PPF Calculator</h1>
          </div>
          <p className="text-muted-foreground">Project your PPF corpus with tax-free returns over 15+ years</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="surface-card h-fit space-y-4 p-6 lg:sticky lg:top-6">

            {/* PPF Rules Banner */}
            <div className="mb-1 rounded-xl border border-warning/25 bg-warning/10 p-4">
              <p className="mb-2 text-xs font-semibold text-warning">PPF Rules</p>
              <div className="space-y-1 text-xs text-warning/85">
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
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Deposit vs Interest - Year by Year</h3>
                <span className="text-xs text-muted-foreground">With balance line</span>
              </div>
              <div className="h-[300px]"><PPFChart data={results.yearlyData} /></div>
            </div>

            {/* Year-by-Year Table with Withdrawal/Loan columns */}
            <div className="table-surface">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">Year-by-Year Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-head">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deposit</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Balance</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Withdrawal</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Loan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((r) => (
                      <tr key={r.year} className="table-row text-foreground/80">
                        <td className="px-4 py-3 text-muted-foreground">{r.year}</td>
                        <td className="px-4 py-3 text-right">{formatINR(r.deposit)}</td>
                        <td className="px-4 py-3 text-right text-success">{formatINR(r.interest)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatINR(r.balance)}</td>
                        <td className="px-4 py-3 text-center">
                          {r.withdrawalAllowed
                            ? <span className="font-bold text-success">Yes</span>
                            : <span className="text-muted-foreground/50">-</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.loanAllowed
                            ? <span className="font-bold text-primary">Yes</span>
                            : <span className="text-muted-foreground/50">-</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-4 border-t border-border pt-4 text-xs italic leading-relaxed text-muted-foreground">
              * PPF interest calculated on annual compounding basis. Actual PPF credits interest on minimum balance between 5th-last of each month.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <ShareButton shareId={shareId} />
              <SaveCalculationButton
                calcType="PPF"
                data={{ inputs: debouncedInputs, results: results as unknown as Record<string, unknown> }}
                onSaved={setShareId}
              />
            </div>

            <RelatedCalculators current="ppf" />
          </div>
        </div>
      </div>
    </main>
  );
}
