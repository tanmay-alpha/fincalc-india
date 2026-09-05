"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcFIRE } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";

const FIREChart = dynamic(
  () => import("@/components/calculators/fire/FIREChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function FIRECalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    currentAge: 28,
    retirementAge: 45,
    lifeExpectancy: 85,
    currentMonthlyExpenses: 50000,
    preRetirementReturn: 12,
    postRetirementReturn: 8,
    inflationRate: 6,
    currentSavings: 1000000, // ₹10 Lakhs existing corpus
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const result = useMemo(() => {
    return calcFIRE({
      currentAge: debouncedInputs.currentAge,
      retirementAge: debouncedInputs.retirementAge,
      lifeExpectancy: debouncedInputs.lifeExpectancy,
      currentMonthlyExpenses: debouncedInputs.currentMonthlyExpenses,
      preRetirementReturn: debouncedInputs.preRetirementReturn,
      postRetirementReturn: debouncedInputs.postRetirementReturn,
      inflationRate: debouncedInputs.inflationRate,
      currentSavings: debouncedInputs.currentSavings,
    });
  }, [debouncedInputs]);

  const setCurrAge = useCallback(
    (v: number) => setInputs((p) => ({ ...p, currentAge: v })),
    []
  );
  const setRetireAge = useCallback(
    (v: number) => setInputs((p) => ({ ...p, retirementAge: Math.max(p.currentAge, v) })),
    []
  );
  const setLifeExp = useCallback(
    (v: number) => setInputs((p) => ({ ...p, lifeExpectancy: Math.max(p.retirementAge + 1, v) })),
    []
  );
  const setExpenses = useCallback(
    (v: number) => setInputs((p) => ({ ...p, currentMonthlyExpenses: v })),
    []
  );
  const setPreRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, preRetirementReturn: v })),
    []
  );
  const setPostRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, postRetirementReturn: v })),
    []
  );
  const setInflation = useCallback(
    (v: number) => setInputs((p) => ({ ...p, inflationRate: v })),
    []
  );
  const setSavings = useCallback(
    (v: number) => setInputs((p) => ({ ...p, currentSavings: v })),
    []
  );

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="FIRE Target Corpus" value={result.standardFireCorpus} />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
        {/* ────── INPUT PANEL ────── */}
        <div className="h-fit lg:sticky lg:top-6 space-y-4">
          <div className="surface-card p-6 space-y-5">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              1. Age & Timeline
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <HybridInput
                label="Current Age"
                value={inputs.currentAge}
                onChange={setCurrAge}
                min={18}
                max={70}
                step={1}
                suffix=" Yrs"
                quickChips={[
                  { label: "25", value: 25 },
                  { label: "30", value: 30 },
                  { label: "35", value: 35 },
                ]}
              />
              <HybridInput
                label="Retire at Age"
                value={inputs.retirementAge}
                onChange={setRetireAge}
                min={inputs.currentAge}
                max={75}
                step={1}
                suffix=" Yrs"
                quickChips={[
                  { label: "40", value: 40 },
                  { label: "45", value: 45 },
                  { label: "50", value: 50 },
                  { label: "60", value: 60 },
                ]}
              />
            </div>

            <HybridInput
              label="Life Expectancy"
              value={inputs.lifeExpectancy}
              onChange={setLifeExp}
              min={inputs.retirementAge + 1}
              max={100}
              step={1}
              suffix=" Yrs"
              quickChips={[
                { label: "80Y", value: 80 },
                { label: "85Y", value: 85 },
                { label: "90Y", value: 90 },
              ]}
            />

            <div className="pt-2 border-t border-border space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                2. Expenses & Wealth
              </h2>

              <HybridInput
                label="Current Monthly Expenses"
                value={inputs.currentMonthlyExpenses}
                onChange={setExpenses}
                min={10000}
                max={1000000}
                step={5000}
                prefix="₹"
                quickChips={[
                  { label: "₹30K", value: 30000 },
                  { label: "₹50K", value: 50000 },
                  { label: "₹75K", value: 75000 },
                  { label: "₹1L", value: 100000 },
                ]}
              />

              <HybridInput
                label="Existing Savings / Portfolio"
                value={inputs.currentSavings}
                onChange={setSavings}
                min={0}
                max={50000000}
                step={100000}
                prefix="₹"
                quickChips={[
                  { label: "₹5L", value: 500000 },
                  { label: "₹10L", value: 1000000 },
                  { label: "₹25L", value: 2500000 },
                  { label: "₹50L", value: 5000000 },
                ]}
              />
            </div>

            <div className="pt-2 border-t border-border space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                3. Market Assumptions
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <HybridInput
                  label="Pre-Retire Return"
                  value={inputs.preRetirementReturn}
                  onChange={setPreRate}
                  min={4}
                  max={20}
                  step={0.5}
                  suffix="%"
                  hint="Equity/Mutual Funds (12%)"
                />
                <HybridInput
                  label="Post-Retire Return"
                  value={inputs.postRetirementReturn}
                  onChange={setPostRate}
                  min={4}
                  max={15}
                  step={0.5}
                  suffix="%"
                  hint="Conservative mix (8%)"
                />
              </div>

              <HybridInput
                label="Expected Inflation"
                value={inputs.inflationRate}
                onChange={setInflation}
                min={3}
                max={12}
                step={0.5}
                suffix="%"
                hint="Indian CPI average: ~6%"
                quickChips={[
                  { label: "5%", value: 5 },
                  { label: "6%", value: 6 },
                  { label: "7%", value: 7 },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ────── RESULTS PANEL ────── */}
        <div className="space-y-5 min-w-0">
          <ResultHero
            label="Standard FIRE Target Corpus"
            value={result.standardFireCorpus}
            breakdown={[
              { label: "Monthly Savings Needed", value: result.requiredMonthlySavings, color: "blue" },
              { label: "Monthly Expense at Retirement", value: result.monthlyExpenseAtRetirement, color: "green" },
            ]}
          />

          {/* FIRE Tiers Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="surface-card p-4 border border-border">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider mb-1">
                <span>🌱</span> Lean FIRE (0.75x)
              </div>
              <p className="text-xl font-bold text-foreground">{formatCompact(result.leanFireCorpus)}</p>
              <p className="text-xs text-muted-foreground mt-1">Frugal lifestyle / basic expenses</p>
            </div>

            <div className="surface-card p-4 border-2 border-primary bg-primary/5">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <span>🎯</span> Standard FIRE (1.0x)
              </div>
              <p className="text-xl font-bold text-primary">{formatCompact(result.standardFireCorpus)}</p>
              <p className="text-xs text-muted-foreground mt-1">Current lifestyle maintained</p>
            </div>

            <div className="surface-card p-4 border border-border">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wider mb-1">
                <span>👑</span> Fat FIRE (1.5x)
              </div>
              <p className="text-xl font-bold text-foreground">{formatCompact(result.fatFireCorpus)}</p>
              <p className="text-xs text-muted-foreground mt-1">Luxury travel & hobbies</p>
            </div>
          </div>

          {/* Actionable Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InsightCard
              icon="💰"
              title={`Monthly SIP: ${formatINR(result.requiredMonthlySavings)}`}
              subtitle={`Needed for next ${result.yearsToRetirement} years`}
              type="good"
            />
            <InsightCard
              icon="📈"
              title={`Retirement Spend: ${formatINR(result.monthlyExpenseAtRetirement)}/mo`}
              subtitle={`Inflated from ₹${formatCompact(inputs.currentMonthlyExpenses)}/mo today`}
              type="info"
            />
            <InsightCard
              icon="🛡️"
              title={result.isPerpetual ? "Perpetual Corpus" : `Covers ${result.yearsInRetirement} Yrs`}
              subtitle={
                result.depletionAge
                  ? `Depletes at age ${result.depletionAge}`
                  : `Safe till age ${inputs.lifeExpectancy}`
              }
              type={result.isPerpetual ? "good" : "info"}
            />
          </div>

          {/* Chart */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground">FIRE Wealth Lifecycle (Age {inputs.currentAge} to {inputs.lifeExpectancy})</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Accumulation phase up to Age {inputs.retirementAge}, then retirement drawdown phase
                </p>
              </div>
            </div>
            <div className="h-[320px]">
              <FIREChart timeline={result.timeline} retirementAge={inputs.retirementAge} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
