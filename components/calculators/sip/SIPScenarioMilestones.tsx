"use client";

import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";
import { calcSIP } from "@/lib/math";
import {
  Copy,
  Check,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"milestones" | "fd_compare" | "inflation">("milestones");
  const [copied, setCopied] = useState(false);

  // 1. Rule of 72 Doubling Time
  const doublingYears = useMemo(() => {
    if (annualRate <= 0) return 0;
    return (72 / annualRate).toFixed(1);
  }, [annualRate]);

  // 2. Milestone calculation
  const milestoneProgress = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    return MILESTONE_TARGETS.map(({ label, target }) => {
      // Find month where FV(monthlyAmount, monthlyRate, m) >= target
      // FV = P * [ (1+i)^n - 1 ] / i * (1+i)
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

  // 3. 7% Bank FD Comparison
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

  // 4. Inflation Adjusted (6% CPI)
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
    const text = [
      `📊 FinCalc India — SIP Wealth Projection`,
      `────────────────────────────`,
      `• Monthly Investment: ${formatINR(monthlyAmount)}`,
      `• Expected Return:    ${annualRate}% p.a.`,
      `• Duration:           ${years} Years`,
      `────────────────────────────`,
      `• Total Invested:     ${formatINR(totalInvested)}`,
      `• Estimated Returns:  ${formatINR(estimatedReturns)}`,
      `• Total Corpus:       ${formatINR(totalCorpus)} (${(totalCorpus / (totalInvested || 1)).toFixed(2)}x)`,
      `• Vs 7% Bank FD:      +${formatINR(fdComparison.wealthAdvantage)} Extra Wealth`,
      `• Real Value (6% inf): ${formatINR(inflationAnalysis.realCorpus)} in today's money`,
      `────────────────────────────`,
      `Calculated at: https://fincalc-india.vercel.app/sip`,
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
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Smart Projections & Scenarios
          </h3>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("milestones")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all",
              activeTab === "milestones"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Milestones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fd_compare")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-all",
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
              "px-2.5 py-1 rounded-lg font-medium transition-all",
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
              Rule of 72 Doubling Time:
            </span>
            <span className="font-bold text-primary">
              Your invested capital doubles every ~{doublingYears} years at {annualRate}%
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
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
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

      {/* Tab 2: vs 7% Bank FD */}
      {activeTab === "fd_compare" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-1">
              <span className="text-xs text-muted-foreground">
                Conservative 7% Bank FD
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
                Your SIP Wealth Advantage
              </span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{formatINR(fdComparison.wealthAdvantage)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fdComparison.multiplierVsFD}x more wealth than a fixed deposit
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Equity compounding absorbs market volatility to deliver a substantial long-term premium over fixed income instruments.
          </p>
        </div>
      )}

      {/* Tab 3: Inflation Adjusted Real Value */}
      {activeTab === "inflation" && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-muted-foreground">
                Purchasing Power in Today&apos;s Rupees (at 6% CPI)
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
                {inflationAnalysis.purchasingPowerPercent}% of future corpus
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Due to the compounding erosion of purchasing power (assumed at 6% p.a.), your future ₹{totalCorpus.toLocaleString("en-IN")} corpus will buy what {formatINR(inflationAnalysis.realCorpus)} buys today.
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/70 hover:bg-muted text-foreground transition-all ml-auto"
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
