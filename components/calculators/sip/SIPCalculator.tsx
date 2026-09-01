"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcSIP } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateSIPInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";

const SIPChart = dynamic(
  () => import("@/components/calculators/sip/SIPChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function SIPCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    monthlyAmount: 5000,
    annualRate: 12,
    years: 10,
  });
  const [shareId, setShareId] = useState<string | null>(null);

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcSIP(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateSIPInsights(results), [results]);

  useEffect(() => setShareId(null), [debouncedInputs]);

  const setMonthly = useCallback(
    (v: number) => setInputs((p) => ({ ...p, monthlyAmount: v })),
    []
  );
  const setRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, annualRate: v })),
    []
  );
  const setYears = useCallback(
    (v: number) => setInputs((p) => ({ ...p, years: v })),
    []
  );

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Total Corpus" value={results.totalCorpus} />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="h-fit lg:sticky lg:top-6 space-y-4">
            <div className="surface-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg" aria-hidden="true">💼</span>
                <h2 className="text-base font-semibold text-card-foreground">
                  Enter SIP Details
                </h2>
              </div>
              <div className="space-y-4">
                <HybridInput
                  label="Monthly Investment"
                  value={inputs.monthlyAmount}
                  onChange={setMonthly}
                  min={500}
                  max={10000000}
                  step={500}
                  prefix="₹"
                  quickChips={[
                    { label: "₹1K", value: 1000 },
                    { label: "₹5K", value: 5000 },
                    { label: "₹10K", value: 10000 },
                    { label: "₹50K", value: 50000 },
                    { label: "₹1L", value: 100000 },
                  ]}
                />
                <HybridInput
                  label="Expected Return"
                  value={inputs.annualRate}
                  onChange={setRate}
                  min={1}
                  max={50}
                  step={0.5}
                  suffix="%"
                  quickChips={[
                    { label: "8%", value: 8 },
                    { label: "10%", value: 10 },
                    { label: "12%", value: 12 },
                    { label: "15%", value: 15 },
                    { label: "18%", value: 18 },
                  ]}
                  hint="Historical equity avg: 12%"
                />
                <HybridInput
                  label="Time Period"
                  value={inputs.years}
                  onChange={setYears}
                  min={1}
                  max={50}
                  step={1}
                  suffix=" Yrs"
                  quickChips={[
                    { label: "5Y", value: 5 },
                    { label: "10Y", value: 10 },
                    { label: "15Y", value: 15 },
                    { label: "20Y", value: 20 },
                    { label: "30Y", value: 30 },
                  ]}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-5">
                * Returns are estimated. Actual market returns may vary.
              </p>
            </div>
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5 min-w-0">
            <ResultHero
              label="Total Corpus"
              value={results.totalCorpus}
              breakdown={[
                { label: "Invested", value: results.totalInvested, color: "blue" },
                { label: "Returns", value: results.estimatedReturns, color: "green" },
              ]}
            />

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => (
                <InsightCard key={i} {...ins} />
              ))}
            </div>

            {/* Chart */}
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Growth Projection</h3>
                <span className="text-xs text-muted-foreground">Year by year</span>
              </div>
              <div className="h-[300px]">
                <SIPChart data={results.yearlyBreakdown} />
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="table-surface">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">
                  Year-by-Year Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Year-by-year SIP breakdown table">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-head">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invested</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-primary uppercase tracking-wide">Returns</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyBreakdown.map((row, i) => (
                      <tr
                        key={row.year}
                        className={clsx(
                          "table-row",
                          i === results.yearlyBreakdown.length - 1 &&
                            "bg-primary/10 font-semibold"
                        )}
                      >
                        <td className="px-6 py-3.5 text-muted-foreground">{row.year}</td>
                        <td className="px-6 py-3.5 text-right text-foreground/80">
                          {formatINR(row.invested)}
                        </td>
                        <td className="px-6 py-3.5 text-right text-success font-medium">
                          {formatINR(row.returns)}
                        </td>
                        <td className="px-6 py-3.5 text-right text-foreground font-semibold">
                          {formatINR(row.corpus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <SaveCalculationButton
                calcType="SIP"
                data={{
                  inputs: debouncedInputs,
                  results: results as unknown as Record<string, unknown>,
                }}
                onSaved={setShareId}
              />
              <ShareButton shareId={shareId} />
            </div>
          </div>
        </div>
    </>
  );
}
