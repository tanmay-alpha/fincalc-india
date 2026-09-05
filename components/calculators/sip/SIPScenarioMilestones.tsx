"use client";

import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";
import { calcSIP } from "@/lib/math";
import { getBaseUrl } from "@/lib/env";
import {
  Copy,
  Check,
  Milestone,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  monthlyAmount: number;
  annualRate: number;
  years: number;
  totalCorpus: number;
  totalInvested: number;
  estimatedReturns: number;
}

const MILESTONE_TARGETS = [
  { label: "₹25 Lakhs", target: 25_00_000 },
  { label: "₹50 Lakhs", target: 50_00_000 },
  { label: "₹1 Crore", target: 1_00_00_000 },
  { label: "₹2.5 Crores", target: 2_50_00_000 },
  { label: "₹5 Crores", target: 5_00_00_000 },
];

export default function SIPScenarioMilestones({
  monthlyAmount,
  annualRate,
  years,
  totalCorpus,
  totalInvested,
  estimatedReturns,
}: Props) {
  const [activeTab, setActiveTab] = useState<"milestones" | "compare" | "fd_compare" | "inflation">("milestones");
  const [copied, setCopied] = useState(false);

  // Scenario B inputs for comparison (defaulting to +₹5k / +2% / +5yr)
  const [scenarioBMonthly, setScenarioBMonthly] = useState(monthlyAmount + 5000);
  const [scenarioBRate, setScenarioBRate] = useState(annualRate);
  const [scenarioBYears, setScenarioBYears] = useState(years);

  // 1. Rule of 72 Doubling Time
  const doublingYears = useMemo(() => {
    if (annualRate <= 0) return 0;
    return (72 / annualRate).toFixed(1);
  }, [annualRate]);

  // 2. Milestone calculation
  const milestoneProgress = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    return MILESTONE_TARGETS.map(({ label, target }) => {
      let reachedMonth: number | null = null;
      for (let m = 1; m <= 480; m++) {
        const corpus =
          monthlyAmount *
          ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) *
          (1 + monthlyRate);
        if (corpus >= target) {
          reachedMonth = m;
          break;
        }
      }

      const totalMonths = years * 12;
      const isReached = reachedMonth !== null && reachedMonth <= totalMonths;
      const yearsNeeded = reachedMonth !== null ? (reachedMonth / 12).toFixed(1) : null;

      return {
        label,
        target,
        isReached,
        yearsNeeded,
        percentOfGoal: Math.min(100, Math.round((totalCorpus / target) * 100)),
      };
    });
  }, [monthlyAmount, annualRate, years, totalCorpus]);

  // 3. Scenario B calculation
  const scenarioBResult = useMemo(() => {
    return calcSIP({
      monthlyAmount: scenarioBMonthly,
      annualRate: scenarioBRate,
      years: scenarioBYears,
    });
  }, [scenarioBMonthly, scenarioBRate, scenarioBYears]);

  const scenarioDelta = useMemo(() => {
    const corpusDelta = scenarioBResult.totalCorpus - totalCorpus;
    const investedDelta = scenarioBResult.totalInvested - totalInvested;
    const returnsDelta = scenarioBResult.estimatedReturns - estimatedReturns;
    return { corpusDelta, investedDelta, returnsDelta };
  }, [scenarioBResult, totalCorpus, totalInvested, estimatedReturns]);

  // 4. 7% Bank FD Comparison
  const fdComparison = useMemo(() => {
    const fdResult = calcSIP({
      monthlyAmount,
      annualRate: 7,
      years,
    });
    const wealthAdvantage = totalCorpus - fdResult.totalCorpus;
    return {
      fdCorpus: fdResult.totalCorpus,
      fdReturns: fdResult.estimatedReturns,
      wealthAdvantage,
      multiplierVsFD: (totalCorpus / (fdResult.totalCorpus || 1)).toFixed(2),
    };
  }, [monthlyAmount, years, totalCorpus]);

  // 5. Inflation Adjusted (6% CPI)
  const inflationAnalysis = useMemo(() => {
    const realCorpus = Math.round(totalCorpus / Math.pow(1.06, years));
    const purchasingPowerPercent = Math.round((realCorpus / totalCorpus) * 100);
    return {
      realCorpus,
      purchasingPowerPercent,
    };
  }, [totalCorpus, years]);

  // Copy Summary Handler
  const handleCopySummary = async () => {
    const baseUrl = getBaseUrl();
    const text = [
      `FinCalc India — SIP Wealth Projection`,
      `────────────────────────────`,
      `• Monthly Investment: ${formatINR(monthlyAmount)}`,
      `• Expected Return:    ${annualRate}% p.a.`,
      `• Duration:           ${years} Years`,
      `────────────────────────────`,
      `• Total Invested:     ${formatINR(totalInvested)}`,
      `• Estimated Returns:  ${formatINR(estimatedReturns)}`,
      `• Total Corpus:       ${formatINR(totalCorpus)} (${(totalCorpus / (totalInvested || 1)).toFixed(2)}x)`,
      `• Vs 7% Bank FD:      +${formatINR(fdComparison.wealthAdvantage)} Extra Wealth`,
      `• Real Value (6% inf): ${formatINR(inflationAnalysis.realCorpus)} in today's purchasing power`,
      `────────────────────────────`,
      `Calculated at: ${baseUrl}/sip`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Projection summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy summary.");
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Milestone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Scenarios & Milestones
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("milestones")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === "milestones"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Milestones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compare")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === "compare"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Compare A vs B
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fd_compare")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === "fd_compare"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            vs 7% FD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inflation")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === "inflation"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Real Value (CPI)
          </button>
        </div>
      </div>

      {/* Tab 1: Wealth Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs sm:text-sm">
            <span className="text-muted-foreground">
              Rule of 72 Doubling Horizon:
            </span>
            <span className="font-bold text-primary">
              Your invested capital doubles every ~{doublingYears} years at {annualRate}% p.a.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {milestoneProgress.slice(0, 3).map((item) => (
              <div
                key={item.label}
                className={cn(
                  "p-3 rounded-xl border transition-all flex flex-col justify-between",
                  item.isReached
                    ? "bg-emerald-500/5 border-emerald-500/25"
                    : "bg-muted/20 border-border/60"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-foreground">
                    {item.label}
                  </span>
                  {item.isReached ? (
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Yr {item.yearsNeeded}
                    </span>
                  ) : item.yearsNeeded ? (
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      In Yr {item.yearsNeeded}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      &gt;40 Yrs
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.isReached ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${item.percentOfGoal}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-mono">{item.percentOfGoal}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Compare A vs B Scenario */}
      {activeTab === "compare" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scenario A (Current) */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Scenario A (Active)
              </span>
              <p className="text-xl font-extrabold text-foreground tabular-nums">
                {formatINR(totalCorpus)}
              </p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Monthly: {formatINR(monthlyAmount)}</p>
                <p>Return: {annualRate}% p.a. &bull; Tenure: {years} Yrs</p>
                <p>Invested: {formatINR(totalInvested)}</p>
              </div>
            </div>

            {/* Scenario B (Adjustable) */}
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Scenario B (Alternative)
                </span>
                <span className="text-xs font-semibold text-primary tabular-nums">
                  {scenarioDelta.corpusDelta >= 0 ? "+" : ""}{formatINR(scenarioDelta.corpusDelta)}
                </span>
              </div>
              <p className="text-xl font-extrabold text-foreground tabular-nums">
                {formatINR(scenarioBResult.totalCorpus)}
              </p>
              <div className="text-xs text-muted-foreground space-y-1.5 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span>Monthly:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setScenarioBMonthly(Math.max(500, scenarioBMonthly - 2500))}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      -2.5k
                    </button>
                    <span className="font-semibold text-foreground tabular-nums px-1">{formatINR(scenarioBMonthly)}</span>
                    <button
                      type="button"
                      onClick={() => setScenarioBMonthly(scenarioBMonthly + 2500)}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      +2.5k
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Return:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setScenarioBRate(Math.max(1, scenarioBRate - 1))}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      -1%
                    </button>
                    <span className="font-semibold text-foreground tabular-nums px-1">{scenarioBRate}%</span>
                    <button
                      type="button"
                      onClick={() => setScenarioBRate(scenarioBRate + 1)}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      +1%
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Tenure:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setScenarioBYears(Math.max(1, scenarioBYears - 1))}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      -1y
                    </button>
                    <span className="font-semibold text-foreground tabular-nums px-1">{scenarioBYears}y</span>
                    <button
                      type="button"
                      onClick={() => setScenarioBYears(scenarioBYears + 1)}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px]"
                    >
                      +1y
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: vs 7% Bank FD */}
      {activeTab === "fd_compare" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-1">
              <span className="text-xs text-muted-foreground">
                Illustrative 7% Bank FD
              </span>
              <p className="text-xl font-bold text-foreground tabular-nums">
                {formatINR(fdComparison.fdCorpus)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Returns: {formatINR(fdComparison.fdReturns)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Equity SIP Premium
              </span>
              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 tabular-nums">
                +{formatINR(fdComparison.wealthAdvantage)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fdComparison.multiplierVsFD}x more corpus than typical fixed deposit compounding
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Equity mutual funds carry market risk but historically reward long-term horizons by outpacing conventional fixed income yields.
          </p>
        </div>
      )}

      {/* Tab 4: Inflation Adjusted Real Value */}
      {activeTab === "inflation" && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-muted-foreground">
                Purchasing Power in Today&apos;s Value (at 6% CPI)
              </span>
              <p className="text-xl font-bold text-primary tabular-nums mt-0.5">
                {formatINR(inflationAnalysis.realCorpus)}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Real Purchasing Power
              </span>
              <p className="text-base font-bold text-foreground">
                {inflationAnalysis.purchasingPowerPercent}% of nominal corpus
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Due to the compounding erosion of purchasing power (assumed at 6% p.a. CPI), your future nominal ₹{totalCorpus.toLocaleString("en-IN")} corpus will have approximately {formatINR(inflationAnalysis.realCorpus)} of real purchasing capacity today.
          </p>
        </div>
      )}

      {/* One-Click Quick Summary Copy Button */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Need this projection for notes or discussions?
        </span>
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/70 hover:bg-muted text-foreground transition-all ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Copy Formatted Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
