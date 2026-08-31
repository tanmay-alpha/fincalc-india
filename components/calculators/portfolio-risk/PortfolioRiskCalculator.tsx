"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import ShareButton from "@/components/ui/ShareButton";
import InsightCard from "@/components/ui/InsightCard";
import { calcRiskRatios } from "@/lib/math";
import type { RiskRatiosInput } from "@/lib/math";
import { getRiskRatiosInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { ShieldCheck, BarChart2 } from "lucide-react";

const RiskChart = dynamic(
  () => import("@/components/calculators/portfolio-risk/RiskChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function PortfolioRiskCalculator() {
  const [mounted, setMounted] = useState(false);
  const [returnsInput, setReturnsInput] = useState("12, -4, 18, 8, -2, 22, 14, -6, 16, 10, 5, -1");
  const [periodFrequency, setPeriodFrequency] = useState<"monthly" | "annual">("monthly");
  const [riskFreeRate, setRiskFreeRate] = useState(6.5);
  const benchmarkReturn = 12.0;
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsedReturns = useMemo(() => {
    return returnsInput
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  }, [returnsInput]);

  const inputs: RiskRatiosInput = useMemo(
    () => ({
      returns: parsedReturns,
      periodFrequency,
      riskFreeRate,
      benchmarkReturn,
    }),
    [parsedReturns, periodFrequency, riskFreeRate, benchmarkReturn]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcRiskRatios(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getRiskRatiosInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Return Series Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Portfolio Return Stream & Benchmarks
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Historical Periodic Returns (% comma-separated)
              </label>
              <textarea
                value={returnsInput}
                onChange={(e) => setReturnsInput(e.target.value)}
                rows={3}
                className="w-full bg-card border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                placeholder="e.g. 12, -4, 18, 8, -2, 22"
              />
              <span className="text-[11px] text-muted-foreground block">
                Parsed {parsedReturns.length} observation periods
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Observation Frequency
                </label>
                <select
                  value={periodFrequency}
                  onChange={(e) => setPeriodFrequency(e.target.value as "monthly" | "annual")}
                  className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="monthly">Monthly Returns (√12 factor)</option>
                  <option value="annual">Annual Returns (1.0 factor)</option>
                </select>
              </div>

              <HybridInput
                label="Risk-Free Rate (Rf % p.a.)"
                hint="Baseline risk-free yield (10-Yr G-Sec ~6.5% - 7.0%)"
                value={riskFreeRate}
                onChange={setRiskFreeRate}
                min={0}
                max={20}
                step={0.25}
                suffix="%"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Portfolio Sharpe Ratio"
            value={result.sharpeRatio}
            formatValue={(val) => val.toFixed(2)}
            breakdown={[
              { label: "Annualized Return", value: Math.max(0, result.meanReturnAnnualized), color: "green" },
              { label: "Annual Volatility", value: result.totalVolatilityAnnualized, color: "red" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Sortino Ratio</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.sortinoRatio !== undefined ? result.sortinoRatio.toFixed(2) : (result.isSortinoInfinite ? "∞ (Zero downside)" : "N/A")}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Max Drawdown</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                -{result.maxDrawdown}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Positive Periods</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.positivePeriodsPercent}%
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Periodic Return Distribution
            </h3>
            <div className="h-56">
              <RiskChart returns={parsedReturns} />
            </div>
          </div>

          {/* Dynamic Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((item, idx) => (
              <InsightCard key={idx} {...item} />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <SaveCalculationButton
              calcType="portfolio-risk"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: result as unknown as Record<string, unknown>,
              }}
              onSaved={(id) => setShareId(id)}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>
      </div>

      <StickyResultBar
        label="Sharpe Ratio"
        value={result.sharpeRatio}
      />
    </div>
  );
}
