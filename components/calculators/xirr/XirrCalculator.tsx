"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import ShareButton from "@/components/ui/ShareButton";
import InsightCard from "@/components/ui/InsightCard";
import { calcXIRR } from "@/lib/math";
import type { XirrCashflow } from "@/lib/math";
import { getXIRRInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { Plus, Trash2, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

const XirrChart = dynamic(
  () => import("@/components/calculators/xirr/XirrChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function XirrCalculator() {
  const [mounted, setMounted] = useState(false);
  const [cashflows, setCashflows] = useState<XirrCashflow[]>([
    { date: "2022-01-01", amount: -100000 },
    { date: "2022-07-01", amount: -50000 },
    { date: "2023-01-01", amount: -100000 },
    { date: "2024-01-01", amount: 50000 },
    { date: "2025-01-01", amount: 350000 },
  ]);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const result = useMemo(() => calcXIRR(cashflows), [cashflows]);
  const insights = useMemo(() => getXIRRInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
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
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Flow
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Enter investments as <strong>negative values</strong> (e.g. -50000) and redemptions / current portfolio value as <strong>positive values</strong> (e.g. 350000).
          </p>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {cashflows.map((cf, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-xl bg-muted/20 border border-border/40"
              >
                <input
                  type="date"
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
                    value={cf.amount}
                    onChange={(e) =>
                      handleUpdateRow(idx, "amount", parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-card border border-border/60 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Amount"
                  />
                </div>
                <button
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
          {result.isValid ? (
            <>
              <ResultHero
                label="Extended Internal Rate of Return (XIRR)"
                value={result.xirr}
                formatValue={(val) => `${val.toFixed(2)}%`}
                breakdown={[
                  { label: "Total Invested", value: result.totalInvested, color: "blue" },
                  { label: "Net Portfolio Gain", value: Math.max(0, result.netGain), color: "green" },
                ]}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Absolute Gain</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">
                    +{result.absoluteGainPercent}%
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Horizon Duration</p>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {result.durationYears} Years
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Current Valuation</p>
                  <p className="text-base font-bold text-primary mt-0.5">
                    {formatINR(result.totalWithdrawn)}
                  </p>
                </div>
              </div>

              {/* Chart Card */}
              <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Cash Flows Inflow & Outflow Timeline
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <SaveCalculationButton
                  calcType="xirr-cagr-twrr"
                  data={{
                    inputs: { cashflows } as unknown as Record<string, unknown>,
                    results: result as unknown as Record<string, unknown>,
                  }}
                  onSaved={(id) => setShareId(id)}
                />
                <ShareButton shareId={shareId} />
              </div>
            </>
          ) : (
            <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
              <h3 className="font-semibold text-foreground">Cash Flow Notice</h3>
              <p className="text-xs text-muted-foreground">{result.errorMessage}</p>
            </div>
          )}
        </div>
      </div>

      <StickyResultBar
        label="XIRR Return"
        value={result.xirr}
      />
    </div>
  );
}
