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
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import SIPScenarioMilestones from "@/components/calculators/sip/SIPScenarioMilestones";

import { getRestoredInputs, recordRecentCalculation } from "@/lib/storage-workflow";

const SIPChart = dynamic(
  () => import("@/components/calculators/sip/SIPChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const DEFAULT_SIP_INPUTS = {
  monthlyAmount: 25000,
  annualRate: 12,
  years: 10,
};

export default function SIPCalculator() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState(DEFAULT_SIP_INPUTS);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const restored = getRestoredInputs("sip", DEFAULT_SIP_INPUTS);
    setInputs(restored);
  }, []);

  const debouncedInputs = useDebounce(inputs, 200);
  const results = useMemo(() => calcSIP(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateSIPInsights(results), [results]);

  useEffect(() => setShareId(null), [debouncedInputs]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "sip",
        name: "SIP Calculator",
        route: "/sip",
        category: "investments",
        summary: `${formatINR(inputs.monthlyAmount)}/mo · ${inputs.annualRate}% · ${inputs.years}yr`,
      });
    }
  }, [mounted, inputs.monthlyAmount, inputs.annualRate, inputs.years]);

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

  const wealthRatio = (results.totalCorpus / results.totalInvested || 1).toFixed(2);

  return (
    <>
      <StickyResultBar
        label="Estimated Corpus"
        value={results.totalCorpus}
        prefix="₹"
        color="green"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ────── INPUT PANEL (~42%) ────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/60">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Investment Parameters
              </h2>
            </div>

            <div className="space-y-5">
              <HybridInput
                label="Monthly Investment"
                value={inputs.monthlyAmount}
                onChange={setMonthly}
                min={500}
                max={10000000}
                step={500}
                prefix="₹"
                quickChips={[
                  { label: "₹5K", value: 5000 },
                  { label: "₹10K", value: 10000 },
                  { label: "₹25K", value: 25000 },
                  { label: "₹50K", value: 50000 },
                  { label: "₹1L", value: 100000 },
                ]}
              />

              <HybridInput
                label="Expected Annual Return Rate"
                value={inputs.annualRate}
                onChange={setRate}
                min={1}
                max={40}
                step={0.5}
                suffix="% p.a."
                hint="Benchmark equity mutual fund historical average: 12% - 15%"
                quickChips={[
                  { label: "10%", value: 10 },
                  { label: "12%", value: 12 },
                  { label: "14%", value: 14 },
                  { label: "16%", value: 16 },
                ]}
              />

              <HybridInput
                label="Investment Horizon"
                value={inputs.years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix=" Years"
                quickChips={[
                  { label: "5Y", value: 5 },
                  { label: "10Y", value: 10 },
                  { label: "15Y", value: 15 },
                  { label: "20Y", value: 20 },
                  { label: "25Y", value: 25 },
                ]}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
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

        {/* ────── RESULTS PANEL (~58%) ────── */}
        <div className="lg:col-span-7 space-y-6" data-result-hero>
          <ResultHero
            label="Estimated Total Corpus"
            value={results.totalCorpus}
            tone="positive"
            prefix="₹"
            formatValue={(val) => val.toLocaleString("en-IN")}
            interpretation={`Investing ₹${inputs.monthlyAmount.toLocaleString("en-IN")} monthly over ${inputs.years} years could generate ₹${results.estimatedReturns.toLocaleString("en-IN")} in compounding returns, building a total corpus of ₹${results.totalCorpus.toLocaleString("en-IN")}.`}
            secondaryMetrics={[
              {
                label: "Total Invested",
                value: formatINR(results.totalInvested),
              },
              {
                label: "Estimated Returns",
                value: formatINR(results.estimatedReturns),
              },
              {
                label: "Wealth Multiplier",
                value: `${wealthRatio}x`,
              },
            ]}
            breakdown={[
              {
                label: "Invested Amount",
                value: results.totalInvested,
                color: "blue",
                formattedValue: formatINR(results.totalInvested),
              },
              {
                label: "Estimated Returns",
                value: results.estimatedReturns,
                color: "green",
                formattedValue: formatINR(results.estimatedReturns),
              },
            ]}
          />

          {/* Analytical Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </div>

          {/* Interactive Milestone Roadmap & Scenarios */}
          <SIPScenarioMilestones
            monthlyAmount={debouncedInputs.monthlyAmount}
            annualRate={debouncedInputs.annualRate}
            years={debouncedInputs.years}
            totalCorpus={results.totalCorpus}
            totalInvested={results.totalInvested}
            estimatedReturns={results.estimatedReturns}
          />

          {/* Growth Projection Chart */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Corpus Accumulation Timeline
                </h3>
                <p className="text-xs text-muted-foreground">
                  Invested Capital vs Compounded Returns
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Annual View
              </span>
            </div>
            <div className="h-[280px]">
              <SIPChart data={results.yearlyBreakdown} />
            </div>
          </div>

          {/* Year-by-Year Breakdown Table */}
          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Year-by-Year Compounding Schedule
              </h3>
              <span className="text-xs text-muted-foreground">
                {results.yearlyBreakdown.length} Years
              </span>
            </div>
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Year-by-Year Breakdown Table"
            >
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold uppercase text-[11px] tracking-wider">
                      Year
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Invested
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider text-emerald-800 dark:text-emerald-300">
                      Returns
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Total Corpus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {results.yearlyBreakdown.map((row, i) => (
                    <tr
                      key={row.year}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        i === results.yearlyBreakdown.length - 1 &&
                          "bg-primary/5 font-semibold"
                      )}
                    >
                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        Yr {row.year}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground/80 tabular-nums">
                        {formatINR(row.invested)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-800 dark:text-emerald-300 tabular-nums font-medium">
                        {formatINR(row.returns)}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground font-bold tabular-nums">
                        {formatINR(row.corpus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
