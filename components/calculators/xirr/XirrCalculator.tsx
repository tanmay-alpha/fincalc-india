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
import { calcXIRR, calcCAGR, calcTWRR } from "@/lib/math";
import type { XirrCashflow, TwrrPeriod } from "@/lib/math";
import { getXIRRInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";
import { Plus, Trash2, Calendar, TrendingUp, AlertTriangle, Layers, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const XirrChart = dynamic(
  () => import("@/components/calculators/xirr/XirrChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function XirrCalculator() {
  const mounted = useIsMounted();
  const [activeTab, setActiveTab] = useState<"xirr" | "cagr" | "twrr">("xirr");

  // XIRR State
  const [cashflows, setCashflows] = useState<XirrCashflow[]>([
    { date: "2022-01-01", amount: -100000 },
    { date: "2022-07-01", amount: -50000 },
    { date: "2023-01-01", amount: -100000 },
    { date: "2024-01-01", amount: 50000 },
    { date: "2025-01-01", amount: 350000 },
  ]);

  // CAGR State
  const [cagrInitial, setCagrInitial] = useState(100000);
  const [cagrFinal, setCagrFinal] = useState(250000);
  const [cagrYears, setCagrYears] = useState(5);

  // TWRR State
  const [twrrPeriods, setTwrrPeriods] = useState<TwrrPeriod[]>([
    { startValue: 100000, endValue: 115000, netCashflow: 0 },
    { startValue: 115000, endValue: 140000, netCashflow: 20000 },
    { startValue: 140000, endValue: 165000, netCashflow: -10000 },
  ]);

  const [shareId, setShareId] = useState<string | null>(null);

  const handleAddRow = () => {
    const lastDate = cashflows[cashflows.length - 1]?.date || "2025-01-01";
    setCashflows([...cashflows, { date: lastDate, amount: 0 }]);
  };

  const handleRemoveRow = (idx: number) => {
    if (cashflows.length > 2) {
      setCashflows(cashflows.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateRow = (idx: number, field: keyof XirrCashflow, val: string | number) => {
    const updated = [...cashflows];
    updated[idx] = { ...updated[idx], [field]: val };
    setCashflows(updated);
  };

  const handleAddTwrrRow = () => {
    const lastEnd = twrrPeriods[twrrPeriods.length - 1]?.endValue || 100000;
    setTwrrPeriods([...twrrPeriods, { startValue: lastEnd, endValue: Math.round(lastEnd * 1.1), netCashflow: 0 }]);
  };

  const handleRemoveTwrrRow = (idx: number) => {
    if (twrrPeriods.length > 1) {
      setTwrrPeriods(twrrPeriods.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateTwrrRow = (idx: number, field: keyof TwrrPeriod, val: number) => {
    const updated = [...twrrPeriods];
    updated[idx] = { ...updated[idx], [field]: val };
    setTwrrPeriods(updated);
  };

  const xirrResult = useMemo(() => calcXIRR(cashflows), [cashflows]);
  const cagrResult = useMemo(
    () => calcCAGR({ initialValue: cagrInitial, finalValue: cagrFinal, durationYears: cagrYears }),
    [cagrInitial, cagrFinal, cagrYears]
  );
  const twrrResult = useMemo(() => calcTWRR(twrrPeriods), [twrrPeriods]);

  const insights = useMemo(() => getXIRRInsights(xirrResult), [xirrResult]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "xirr-cagr-twrr",
        name: "Returns Suite (XIRR / CAGR / TWRR)",
        route: "/xirr-cagr-twrr",
        category: "investments",
        summary: activeTab === "xirr"
          ? `XIRR: ${cashflows.length} cashflows`
          : activeTab === "cagr"
          ? `CAGR: ₹${cagrInitial.toLocaleString("en-IN")} → ₹${cagrFinal.toLocaleString("en-IN")} (${cagrYears}yr)`
          : `TWRR: ${twrrPeriods.length} periods`,
      });
    }
  }, [mounted, activeTab, cashflows.length, cagrInitial, cagrFinal, cagrYears, twrrPeriods.length]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Return Methodology Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-muted/60 border border-border/60 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("xirr")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === "xirr"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>XIRR (Money-Weighted)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cagr")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === "cagr"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Percent className="w-4 h-4" />
          <span>CAGR (Point-to-Point)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("twrr")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === "twrr"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>TWRR (Time-Weighted)</span>
        </button>
      </div>

      {/* ─── TAB 1: XIRR ─── */}
      {activeTab === "xirr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cash Flows Table */}
          <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground text-base">
                  Irregular Cash Flow Schedule
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Cashflow
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter investments / SIPs as <strong>negative numbers</strong> (e.g. -50000) and redemptions or current portfolio value as <strong>positive numbers</strong> (e.g. 350000).
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {cashflows.map((cf, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-muted/20 border border-border/40"
                >
                  <input
                    type="date"
                    aria-label={`Cash flow ${idx + 1} date`}
                    value={cf.date}
                    onChange={(e) => handleUpdateRow(idx, "date", e.target.value)}
                    className="bg-card border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-36"
                  />
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      ₹
                    </span>
                    <input
                      type="number"
                      aria-label={`Cash flow ${idx + 1} amount`}
                      value={cf.amount}
                      onChange={(e) =>
                        handleUpdateRow(idx, "amount", parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-card border border-border/60 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      placeholder="Amount"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete cash flow ${idx + 1}`}
                    onClick={() => handleRemoveRow(idx)}
                    disabled={cashflows.length <= 2}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Output Hero, Visualizations & Insights */}
          <div className="lg:col-span-6 space-y-5">
            {xirrResult.isValid ? (
              <>
                {/* Multi-Root Ambiguity Warning Banner */}
                {xirrResult.multipleRootsDetected && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      Multiple mathematically valid IRRs were detected. XIRR is ambiguous.
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      Candidate roots found:{" "}
                      <strong className="text-foreground font-mono">
                        {xirrResult.candidateRoots && xirrResult.candidateRoots.length > 0
                          ? xirrResult.candidateRoots.map((r) => `${r.toFixed(2)}%`).join(", ")
                          : `${xirrResult.xirr.toFixed(2)}%`}
                      </strong>
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Alternating cash flow directions produce multiple discount rates where Net Present Value (NPV) is zero. Examine your cash flow sequence or evaluate <strong>Time-Weighted Rate of Return (TWRR)</strong> instead.
                    </p>
                  </div>
                )}

                <ResultHero
                  label="Extended Internal Rate of Return (XIRR)"
                  value={xirrResult.xirr}
                  formatValue={(val) => `${val.toFixed(2)}%`}
                  breakdown={[
                    { label: "Total Invested", value: xirrResult.totalInvested, color: "blue" },
                    {
                      label: xirrResult.netGain >= 0 ? "Net Portfolio Gain" : "Net Portfolio Loss",
                      value: xirrResult.netGain,
                      color: xirrResult.netGain >= 0 ? "green" : "red",
                    },
                  ]}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Total Inflows</p>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {formatINR(xirrResult.totalWithdrawn)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">
                      {xirrResult.netGain >= 0 ? "Absolute Gain" : "Absolute Loss"}
                    </p>
                    <p
                      className={`text-base font-bold mt-0.5 ${
                        xirrResult.absoluteGainPercent > 0
                          ? "text-emerald-800 dark:text-emerald-300"
                          : xirrResult.absoluteGainPercent < 0
                          ? "text-rose-700 dark:text-rose-300"
                          : "text-foreground"
                      }`}
                    >
                      {xirrResult.absoluteGainPercent > 0 ? "+" : ""}
                      {xirrResult.absoluteGainPercent.toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Investment Horizon</p>
                    <p className="text-base font-bold text-primary mt-0.5">
                      {xirrResult.durationYears} Years
                    </p>
                  </div>
                </div>

                {/* Chart Card */}
                <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Cash Flow Timeline & Cumulative Net Position
                  </h3>
                  <div className="h-56">
                    <XirrChart cashflows={cashflows} />
                  </div>
                </div>

                {/* Dynamic Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {insights.map((item, idx) => (
                    <InsightCard key={idx} {...item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
                <h3 className="font-semibold text-foreground">Cash Flow Validation</h3>
                <p className="text-xs text-muted-foreground">{xirrResult.errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: CAGR ─── */}
      {activeTab === "cagr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Percent className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-base">
                Point-to-Point Growth Parameters
              </h2>
            </div>

            <div className="space-y-4">
              <HybridInput
                label="Initial Investment Amount"
                value={cagrInitial}
                onChange={setCagrInitial}
                min={1000}
                max={100000000}
                step={10000}
                prefix="₹"
              />
              <HybridInput
                label="Final Valuation / Maturity Amount"
                value={cagrFinal}
                onChange={setCagrFinal}
                min={1000}
                max={1000000000}
                step={25000}
                prefix="₹"
              />
              <HybridInput
                label="Holding Duration (Years)"
                value={cagrYears}
                onChange={setCagrYears}
                min={0.1}
                max={50}
                step={0.5}
                suffix="Y"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <ResultHero
              label="Compound Annual Growth Rate (CAGR)"
              value={cagrResult.cagr}
              formatValue={(val) => `${val.toFixed(2)}%`}
              breakdown={[
                { label: "Initial Capital", value: cagrResult.initialValue, color: "blue" },
                {
                  label: cagrResult.totalGain >= 0 ? "Capital Gain" : "Capital Loss",
                  value: cagrResult.totalGain,
                  color: cagrResult.totalGain >= 0 ? "green" : "red",
                },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {cagrResult.totalGain >= 0 ? "Absolute Total Return" : "Absolute Total Loss"}
                </p>
                <p
                  className={`text-xl font-bold mt-1 ${
                    cagrResult.absoluteReturnPercent > 0
                      ? "text-emerald-800 dark:text-emerald-300"
                      : cagrResult.absoluteReturnPercent < 0
                      ? "text-rose-700 dark:text-rose-300"
                      : "text-foreground"
                  }`}
                >
                  {cagrResult.absoluteReturnPercent > 0 ? "+" : ""}
                  {cagrResult.absoluteReturnPercent.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Wealth Multiplier</p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {(cagrResult.finalValue / cagrResult.initialValue).toFixed(2)}x
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground leading-relaxed">
              <strong>When to use CAGR:</strong> CAGR represents the smooth geometric annual growth rate of a single point-to-point investment. Use CAGR for lump-sum mutual funds, real estate purchases, or fixed multi-year holdings where no interim cash injections occurred.
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: TWRR ─── */}
      {activeTab === "twrr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground text-base">
                  Sub-Period Portfolio Valuations
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddTwrrRow}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Sub-Period
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              TWRR isolates pure fund manager performance by stripping away the distortion of client cash additions and withdrawals.
            </p>

            <div className="space-y-3">
              {twrrPeriods.map((p, idx) => (
                <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span>Period {idx + 1}</span>
                    <button
                      type="button"
                      aria-label={`Delete period ${idx + 1}`}
                      onClick={() => handleRemoveTwrrRow(idx)}
                      disabled={twrrPeriods.length <= 1}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground block">Start Value</label>
                      <input
                        type="number"
                        aria-label={`Period ${idx + 1} Start Value`}
                        value={p.startValue}
                        onChange={(e) => handleUpdateTwrrRow(idx, "startValue", parseFloat(e.target.value) || 0)}
                        className="w-full bg-card border border-border/60 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block">Net Cashflow</label>
                      <input
                        type="number"
                        aria-label={`Period ${idx + 1} Net Cashflow`}
                        value={p.netCashflow}
                        onChange={(e) => handleUpdateTwrrRow(idx, "netCashflow", parseFloat(e.target.value) || 0)}
                        className="w-full bg-card border border-border/60 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                        placeholder="+/-"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block">End Value</label>
                      <input
                        type="number"
                        aria-label={`Period ${idx + 1} End Value`}
                        value={p.endValue}
                        onChange={(e) => handleUpdateTwrrRow(idx, "endValue", parseFloat(e.target.value) || 0)}
                        className="w-full bg-card border border-border/60 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <ResultHero
              label="Time-Weighted Rate of Return (TWRR)"
              value={twrrResult.twrr}
              formatValue={(val) => `${val.toFixed(2)}%`}
              breakdown={twrrResult.periods.map((p) => ({
                label: `Period ${p.periodIndex} HPR`,
                value: p.holdingPeriodReturn,
                color: p.holdingPeriodReturn >= 0 ? "green" : "red",
              }))}
            />

            <div className="table-surface">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-card-foreground">
                  Sub-Period Breakdown
                </h3>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="table-head">
                    <th className="px-4 py-2 text-left">Period</th>
                    <th className="px-4 py-2 text-right">Start</th>
                    <th className="px-4 py-2 text-right">Net Flow</th>
                    <th className="px-4 py-2 text-right">End</th>
                    <th className="px-4 py-2 text-right">HPR Return</th>
                  </tr>
                </thead>
                <tbody>
                  {twrrResult.periods.map((p) => (
                    <tr key={p.periodIndex} className="table-row">
                      <td className="px-4 py-2 font-medium">Period {p.periodIndex}</td>
                      <td className="px-4 py-2 text-right">{formatINR(p.startValue)}</td>
                      <td className="px-4 py-2 text-right">{p.netCashflow >= 0 ? `+${formatINR(p.netCashflow)}` : formatINR(p.netCashflow)}</td>
                      <td className="px-4 py-2 text-right">{formatINR(p.endValue)}</td>
                      <td className={cn("px-4 py-2 text-right font-bold", p.holdingPeriodReturn >= 0 ? "text-emerald-800 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                        {p.holdingPeriodReturn >= 0 ? "+" : ""}{p.holdingPeriodReturn}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground leading-relaxed">
              <strong>TWRR vs XIRR:</strong> TWRR reflects the portfolio manager&apos;s skill by eliminating the luck/timing of investor inflows and outflows. XIRR reflects the investor&apos;s personal dollar-weighted return based on their exact timing of contributions.
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SaveCalculationButton
          calcType="xirr"
          data={{
            inputs: { activeTab, cashflows, cagrInitial, cagrFinal, cagrYears, twrrPeriods } as unknown as Record<string, unknown>,
            results: { xirrResult, cagrResult, twrrResult } as unknown as Record<string, unknown>,
          }}
          onSaved={(id) => setShareId(id)}
        />
        <ShareButton shareId={shareId} />
      </div>

      <StickyResultBar
        label={activeTab === "xirr" ? "XIRR" : activeTab === "cagr" ? "CAGR" : "TWRR"}
        value={activeTab === "xirr" ? xirrResult.xirr : activeTab === "cagr" ? cagrResult.cagr : twrrResult.twrr}
      />
    </div>
  );
}
