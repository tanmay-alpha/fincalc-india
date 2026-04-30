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
import { calcEMI } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateEMIInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({ principal: 3000000, annualRate: 8.5, tenureMonths: 240 });
  const [tenureUnit, setTenureUnit] = useState<"months" | "years">("years");
  const [page, setPage] = useState(1);
  const [shareId, setShareId] = useState<string | null>(null);

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcEMI(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateEMIInsights(results), [results]);

  useEffect(() => setShareId(null), [debouncedInputs]);

  const onPrincipal = useCallback((v: number) => setInputs((p) => ({ ...p, principal: v })), []);
  const onRate = useCallback((v: number) => setInputs((p) => ({ ...p, annualRate: v })), []);
  const onTenureYears = useCallback((v: number) => { setInputs((p) => ({ ...p, tenureMonths: v * 12 })); setPage(1); }, []);
  const onTenureMonths = useCallback((v: number) => { setInputs((p) => ({ ...p, tenureMonths: v })); setPage(1); }, []);

  const totalPages = Math.ceil(results.amortizationSchedule.length / ROWS_PER_PAGE);
  const pageData = results.amortizationSchedule.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Cumulative summary for current page

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="page-shell pb-24 lg:pb-0">

      <StickyResultBar label="Monthly EMI" value={results.emi} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'EMI Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🏦</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">EMI Calculator</h1>
          </div>
          <p className="text-muted-foreground">Calculate monthly EMI for home, car, or personal loans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="surface-card h-fit space-y-4 p-6 lg:sticky lg:top-6">
            <HybridInput label="Loan Amount" value={inputs.principal} onChange={onPrincipal}
              min={10000} max={1000000000} step={10000} prefix="₹"
              quickChips={[
                { label: "₹5L", value: 500000 }, { label: "₹10L", value: 1000000 },
                { label: "₹25L", value: 2500000 }, { label: "₹50L", value: 5000000 },
                { label: "₹1Cr", value: 10000000 },
              ]}
            />

            <HybridInput label="Interest Rate" value={inputs.annualRate} onChange={onRate}
              min={1} max={36} step={0.1} suffix="%"
              quickChips={[
                { label: "7%", value: 7 }, { label: "8.5%", value: 8.5 },
                { label: "10%", value: 10 }, { label: "12%", value: 12 },
                { label: "14%", value: 14 },
              ]}
              hint="Home loans: ~8-9% | Personal: 12-24%"
            />

            {/* Tenure with unit toggle */}
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-foreground">Loan Tenure</label>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setTenureUnit("years")}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    tenureUnit === "years"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  )}>
                  Years
                </button>
                <button onClick={() => setTenureUnit("months")}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    tenureUnit === "months"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  )}>
                  Months
                </button>
              </div>
              {tenureUnit === "years" ? (
                <HybridInput label="" value={Math.round(inputs.tenureMonths / 12)} onChange={onTenureYears}
                  min={1} max={30} step={1} suffix=" Yrs"
                  quickChips={[
                    { label: "5 Yr", value: 5 }, { label: "10 Yr", value: 10 },
                    { label: "15 Yr", value: 15 }, { label: "20 Yr", value: 20 },
                    { label: "25 Yr", value: 25 }, { label: "30 Yr", value: 30 },
                  ]}
                />
              ) : (
                <HybridInput label="" value={inputs.tenureMonths} onChange={onTenureMonths}
                  min={12} max={360} step={1} suffix=" Mo"
                  quickChips={[
                    { label: "60", value: 60 }, { label: "120", value: 120 },
                    { label: "180", value: 180 }, { label: "240", value: 240 },
                  ]}
                />
              )}
            </div>
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Monthly EMI" value={results.emi}
              breakdown={[
                { label: "Principal", value: results.principalAmount, color: "blue" },
                { label: "Total Interest", value: results.totalInterest, color: "red" },
              ]}
            />

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
            </div>

            {/* Charts */}
            <div className="surface-card p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Loan Breakup & Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Principal vs Interest</h4>
                  <div className="h-[250px]"><EMIPieChart principal={results.principalAmount} totalInterest={results.totalInterest} /></div>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Balance Over Time</h4>
                  <div className="h-[250px]"><EMIBalanceChart schedule={results.amortizationSchedule} /></div>
                </div>
              </div>
            </div>

            {/* Amortization Table — Paginated */}
            <div className="table-surface">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">Amortization Schedule</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-head">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Month</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">EMI</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Principal</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-destructive uppercase tracking-wide">Interest</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((r) => (
                      <tr key={r.month} className="table-row text-foreground/80">
                        <td className="px-6 py-3 text-muted-foreground">{r.month}</td>
                        <td className="px-6 py-3 text-right">{formatINR(r.emi)}</td>
                        <td className="px-6 py-3 text-right text-primary">{formatINR(r.principal)}</td>
                        <td className="px-6 py-3 text-right text-destructive">{formatINR(r.interest)}</td>
                        <td className="px-6 py-3 text-right font-medium">{formatINR(r.balance)}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Months {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, results.amortizationSchedule.length)} of {results.amortizationSchedule.length}
                  </span>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition text-muted-foreground">
                      ← Prev
                    </button>
                    <span className="px-3 py-1.5 text-sm text-muted-foreground">{page}/{totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition text-muted-foreground">
                      Next →
                    </button>
                  </div>
                </div>
              )}

              <div className="px-6 py-3 bg-muted border-t border-border flex flex-wrap gap-4 text-xs">
                <span className="text-muted-foreground">Page total -</span>
                <span className="text-primary font-semibold">
                  Principal: {formatINR(pageData.reduce((s,r) => s+r.principal, 0))}
                </span>
                <span className="text-destructive font-semibold">
                  Interest: {formatINR(pageData.reduce((s,r) => s+r.interest, 0))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <SaveCalculationButton
                calcType="EMI"
                data={{ inputs: debouncedInputs, results: results as unknown as Record<string, unknown> }}
                onSaved={setShareId}
              />
              <ShareButton shareId={shareId} />
            </div>

            <RelatedCalculators current="emi" />
          </div>
        </div>
      </div>
    </main>
  );
}
