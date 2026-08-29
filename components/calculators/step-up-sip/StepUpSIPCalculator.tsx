"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcStepUpSIP, calcGoalSIP } from "@/lib/math";
import type { StepUpType } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import { Target, TrendingUp, Sparkles } from "lucide-react";

const StepUpSIPChart = dynamic(
  () => import("@/components/calculators/step-up-sip/StepUpSIPChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function StepUpSIPCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isGoalMode, setIsGoalMode] = useState(false);
  const [stepUpType, setStepUpType] = useState<StepUpType>("percentage");

  const [inputs, setInputs] = useState({
    monthlyAmount: 10000,
    targetCorpus: 10000000, // ₹1 Crore
    annualRate: 12,
    years: 15,
    stepUpValue: 10, // 10% or ₹1,000
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const goalResult = useMemo(() => {
    if (!isGoalMode) return null;
    return calcGoalSIP({
      targetCorpus: debouncedInputs.targetCorpus,
      annualRate: debouncedInputs.annualRate,
      years: debouncedInputs.years,
      stepUpType,
      stepUpValue: debouncedInputs.stepUpValue,
    });
  }, [isGoalMode, debouncedInputs, stepUpType]);

  const stepUpResult = useMemo(() => {
    const monthlyAmt = isGoalMode && goalResult
      ? goalResult.requiredStartingSip
      : debouncedInputs.monthlyAmount;

    return calcStepUpSIP({
      monthlyAmount: monthlyAmt,
      annualRate: debouncedInputs.annualRate,
      years: debouncedInputs.years,
      stepUpType,
      stepUpValue: debouncedInputs.stepUpValue,
    });
  }, [isGoalMode, goalResult, debouncedInputs, stepUpType]);

  const setMonthly = useCallback(
    (v: number) => setInputs((p) => ({ ...p, monthlyAmount: v })),
    []
  );
  const setTargetCorpus = useCallback(
    (v: number) => setInputs((p) => ({ ...p, targetCorpus: v })),
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
  const setStepUpVal = useCallback(
    (v: number) => setInputs((p) => ({ ...p, stepUpValue: v })),
    []
  );

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label={isGoalMode ? "Required Monthly SIP" : "Total Corpus"} value={isGoalMode && goalResult ? goalResult.requiredStartingSip : stepUpResult.totalCorpus} />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
        {/* ────── INPUT PANEL ────── */}
        <div className="h-fit lg:sticky lg:top-6 space-y-4">
          <div className="surface-card p-6 space-y-5">
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-muted/60 p-1 border border-border">
              <button
                type="button"
                onClick={() => setIsGoalMode(false)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  !isGoalMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TrendingUp size={14} />
                SIP Growth Mode
              </button>
              <button
                type="button"
                onClick={() => setIsGoalMode(true)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  isGoalMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Target size={14} />
                Target Goal Mode
              </button>
            </div>

            <div className="space-y-4">
              {!isGoalMode ? (
                <HybridInput
                  label="Starting Monthly SIP"
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
              ) : (
                <HybridInput
                  label="Target Wealth Goal"
                  value={inputs.targetCorpus}
                  onChange={setTargetCorpus}
                  min={100000}
                  max={1000000000}
                  step={500000}
                  prefix="₹"
                  quickChips={[
                    { label: "₹50L", value: 5000000 },
                    { label: "₹1 Cr", value: 10000000 },
                    { label: "₹2 Cr", value: 20000000 },
                    { label: "₹5 Cr", value: 50000000 },
                  ]}
                />
              )}

              {/* Step-Up Type Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Annual Step-Up Increment
                  </label>
                  <div className="flex gap-1 bg-muted/40 p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setStepUpType("percentage");
                        setInputs((p) => ({ ...p, stepUpValue: 10 }));
                      }}
                      className={clsx(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                        stepUpType === "percentage"
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStepUpType("fixed");
                        setInputs((p) => ({ ...p, stepUpValue: 1000 }));
                      }}
                      className={clsx(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                        stepUpType === "fixed"
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Fixed Amount (₹)
                    </button>
                  </div>
                </div>

                {stepUpType === "percentage" ? (
                  <HybridInput
                    label="Yearly Step-Up Rate"
                    value={inputs.stepUpValue}
                    onChange={setStepUpVal}
                    min={0}
                    max={50}
                    step={1}
                    suffix="%"
                    quickChips={[
                      { label: "5%", value: 5 },
                      { label: "10%", value: 10 },
                      { label: "15%", value: 15 },
                      { label: "20%", value: 20 },
                    ]}
                    hint="Standard salary hike: ~10%/year"
                  />
                ) : (
                  <HybridInput
                    label="Yearly Fixed Step-Up"
                    value={inputs.stepUpValue}
                    onChange={setStepUpVal}
                    min={0}
                    max={100000}
                    step={500}
                    prefix="₹"
                    quickChips={[
                      { label: "+₹1K", value: 1000 },
                      { label: "+₹2K", value: 2000 },
                      { label: "+₹5K", value: 5000 },
                      { label: "+₹10K", value: 10000 },
                    ]}
                  />
                )}
              </div>

              <HybridInput
                label="Expected Annual Return"
                value={inputs.annualRate}
                onChange={setRate}
                min={0.1}
                max={30}
                step={0.5}
                suffix="%"
                quickChips={[
                  { label: "10%", value: 10 },
                  { label: "12%", value: 12 },
                  { label: "15%", value: 15 },
                ]}
                hint="Nifty 50 historical CAGR: ~12%"
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
                  { label: "25Y", value: 25 },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ────── RESULTS PANEL ────── */}
        <div className="space-y-5 min-w-0">
          {isGoalMode && goalResult ? (
            <div className="surface-card p-6 border-l-4 border-l-primary bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg">Goal Strategy Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To reach your target corpus of <span className="font-bold text-foreground">{formatCompact(inputs.targetCorpus)}</span> in {inputs.years} years with a {inputs.stepUpValue}{stepUpType === "percentage" ? "%" : "₹"} annual step-up:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Start Monthly SIP Today</p>
                  <p className="text-2xl font-bold text-primary mt-1">{formatINR(goalResult.requiredStartingSip)}</p>
                  <p className="text-xs text-muted-foreground mt-1">First year investment: {formatINR(goalResult.requiredStartingSip * 12)}</p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Total Invested vs Returns</p>
                  <p className="text-2xl font-bold text-success mt-1">{formatCompact(goalResult.estimatedReturns)}</p>
                  <p className="text-xs text-muted-foreground mt-1">On {formatCompact(goalResult.totalInvested)} invested</p>
                </div>
              </div>
            </div>
          ) : (
            <ResultHero
              label="Total Step-Up Corpus"
              value={stepUpResult.totalCorpus}
              breakdown={[
                { label: "Total Invested", value: stepUpResult.totalInvested, color: "blue" },
                { label: "Estimated Gains", value: stepUpResult.estimatedReturns, color: "green" },
              ]}
            />
          )}

          {/* Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InsightCard
              icon="🚀"
              title={`Extra +${formatCompact(stepUpResult.extraReturnsVsFlat)} with Step-Up`}
              subtitle={`Vs flat ${formatINR(!isGoalMode ? inputs.monthlyAmount : goalResult?.requiredStartingSip || 0)}/mo SIP`}
              type="good"
            />
            <InsightCard
              icon="📈"
              title={`Wealth Multiplier: ${(stepUpResult.totalInvested > 0 ? (stepUpResult.totalCorpus / stepUpResult.totalInvested).toFixed(2) : "1")}x`}
              subtitle={`Every ₹1 invested grows to ₹${(stepUpResult.totalInvested > 0 ? (stepUpResult.totalCorpus / stepUpResult.totalInvested).toFixed(2) : "1")}`}
              type="good"
            />
            <InsightCard
              icon="🗓️"
              title={`Final Year SIP: ${formatINR(stepUpResult.yearlyBreakdown[stepUpResult.yearlyBreakdown.length - 1]?.monthlyAmount || 0)}/mo`}
              subtitle={`Grew from ${formatINR(!isGoalMode ? inputs.monthlyAmount : goalResult?.requiredStartingSip || 0)}/mo`}
              type="info"
            />
          </div>

          {/* Chart */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground">Step-Up SIP vs Flat SIP Growth</h3>
                <p className="text-xs text-muted-foreground mt-0.5">See the exponential impact of annual step-ups</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Year by Year
              </span>
            </div>
            <div className="h-[320px]">
              <StepUpSIPChart data={stepUpResult.yearlyBreakdown} />
            </div>
          </div>

          {/* Year-by-Year Table */}
          <div className="table-surface">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Year-by-Year Step-Up Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-head">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monthly SIP</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Invested</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-success uppercase tracking-wide">Flat Corpus</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-primary uppercase tracking-wide">Step-Up Corpus</th>
                  </tr>
                </thead>
                <tbody>
                  {stepUpResult.yearlyBreakdown.map((row, i) => (
                    <tr
                      key={row.year}
                      className={clsx(
                        "table-row",
                        i === stepUpResult.yearlyBreakdown.length - 1 &&
                          "bg-primary/10 font-semibold"
                      )}
                    >
                      <td className="px-6 py-3.5 text-muted-foreground">{row.year}</td>
                      <td className="px-6 py-3.5 text-right font-medium text-foreground">
                        {formatINR(row.monthlyAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-foreground/80">
                        {formatINR(row.totalInvested)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-muted-foreground">
                        {formatINR(row.flatCorpus)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-primary font-bold">
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
