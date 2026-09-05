"use client";


import { useState, useMemo, useEffect } from "react";
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
import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";
import { ShieldCheck, BarChart2 } from "lucide-react";

const RiskChart = dynamic(
  () => import("@/components/calculators/portfolio-risk/RiskChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function PortfolioRiskCalculator() {
  const mounted = useIsMounted();
  const [returnsInput, setReturnsInput] = useState("12, -4, 18, 8, -2, 22, 14, -6, 16, 10, 5, -1");
  const [benchmarkReturnsInput, setBenchmarkReturnsInput] = useState("10, -2, 14, 6, -1, 18, 11, -4, 13, 8, 4, 0");
  const [periodFrequency, setPeriodFrequency] = useState<"monthly" | "annual">("monthly");
  const [riskFreeRate, setRiskFreeRate] = useState(6.5);
  const [shareId, setShareId] = useState<string | null>(null);

  const parsedReturns = useMemo(() => {
    return returnsInput
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  }, [returnsInput]);

  const parsedBenchmarkReturns = useMemo(() => {
    if (!benchmarkReturnsInput.trim()) return undefined;
    const arr = benchmarkReturnsInput
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    return arr.length > 0 ? arr : undefined;
  }, [benchmarkReturnsInput]);

  const isSeriesLengthMatched =
    !parsedBenchmarkReturns || parsedBenchmarkReturns.length === parsedReturns.length;

  const inputs: RiskRatiosInput = useMemo(
    () => ({
      returns: parsedReturns,
      benchmarkReturns: isSeriesLengthMatched ? parsedBenchmarkReturns : undefined,
      periodFrequency,
      riskFreeRate,
    }),
    [parsedReturns, parsedBenchmarkReturns, isSeriesLengthMatched, periodFrequency, riskFreeRate]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcRiskRatios(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getRiskRatiosInsights(result), [result]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "portfolio-risk",
        name: "Portfolio Risk & Performance Ratios",
        route: "/portfolio-risk",
        category: "trading",
        summary: `${parsedReturns.length} periods · Rf ${riskFreeRate}%`,
      });
    }
  }, [mounted, parsedReturns.length, riskFreeRate]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Return Series Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-base">
                Portfolio & Benchmark Return Streams
              </h2>
            </div>
            <span className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
              Modern Portfolio Theory
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Portfolio Periodic Returns (% comma-separated)
              </label>
              <textarea
                value={returnsInput}
                onChange={(e) => setReturnsInput(e.target.value)}
                rows={2}
                className="w-full bg-card border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                placeholder="e.g. 12, -4, 18, 8, -2, 22"
              />
              <span className="text-[11px] text-muted-foreground block">
                Parsed {parsedReturns.length} observation periods
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Benchmark Returns (Optional, % comma-separated for Beta & Treynor)
              </label>
              <textarea
                value={benchmarkReturnsInput}
                onChange={(e) => setBenchmarkReturnsInput(e.target.value)}
                rows={2}
                className="w-full bg-card border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                placeholder="e.g. 10, -2, 14, 6, -1, 18 (e.g. Nifty 50 TRI)"
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Parsed {parsedBenchmarkReturns ? parsedBenchmarkReturns.length : 0} benchmark periods
                </span>
                {!isSeriesLengthMatched && parsedBenchmarkReturns && (
                  <span className="text-rose-400 font-medium">
                    ⚠️ Mismatched: Needs {parsedReturns.length} points
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="portfolio-observation-frequency" className="text-xs font-semibold text-foreground">
                  Observation Frequency
                </label>
                <select
                  id="portfolio-observation-frequency"
                  aria-label="Observation Frequency"
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
                hint="Benchmark 10-Yr Indian G-Sec yield (~6.5%)"
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
              { label: "Annualized Return", value: result.meanReturnAnnualized, color: result.meanReturnAnnualized >= 0 ? "green" : "red" },
              { label: "Annual Volatility (σ)", value: result.totalVolatilityAnnualized, color: "red" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Sortino Ratio</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.isSortinoInfinite ? "∞ (Zero downside)" : (result.sortinoRatio !== undefined ? result.sortinoRatio.toFixed(2) : "N/A")}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Portfolio Beta (β)</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {result.portfolioBeta !== undefined ? result.portfolioBeta.toFixed(2) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Treynor Ratio</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.treynorRatio !== undefined ? result.treynorRatio.toFixed(2) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Max Drawdown</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                -{result.maxDrawdown}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Downside Dev (σd)</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {result.downsideDeviationAnnualized.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Positive Periods</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
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
