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
import { calcDuPont } from "@/lib/math";
import type { DuPontInput } from "@/lib/math";
import { getDuPontInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";

const DuPontChart = dynamic(
  () => import("@/components/calculators/dupont/DuPontChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function DuPontCalculator() {
  const mounted = useIsMounted();
  const [netIncome, setNetIncome] = useState(15000000); // 1.5 Cr
  const [revenue, setRevenue] = useState(100000000); // 10 Cr
  const [totalAssets, setTotalAssets] = useState(80000000); // 8 Cr
  const [totalEquity, setTotalEquity] = useState(50000000); // 5 Cr

  // 5-Step DuPont inputs
  const [isFiveStepEnabled, setIsFiveStepEnabled] = useState(false);
  const [ebit, setEbit] = useState(25000000); // 2.5 Cr
  const [ebt, setEbt] = useState(20000000); // 2.0 Cr

  const [shareId, setShareId] = useState<string | null>(null);

  const inputs: DuPontInput = useMemo(
    () => ({
      netIncome,
      revenue,
      totalAssets,
      shareholdersEquity: totalEquity,
      ebit: isFiveStepEnabled ? ebit : undefined,
      ebt: isFiveStepEnabled ? ebt : undefined,
    }),
    [netIncome, revenue, totalAssets, totalEquity, isFiveStepEnabled, ebit, ebt]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcDuPont(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getDuPontInsights(result), [result]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "dupont-analysis",
        name: "DuPont 5-Step ROE Decomposition",
        route: "/dupont-analysis",
        category: "corporate",
        summary: `Rev ₹${revenue.toLocaleString("en-IN")} · Net ₹${netIncome.toLocaleString("en-IN")}`,
      });
    }
  }, [mounted, revenue, netIncome]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Financial Statement Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-base">
                Income Statement & Balance Sheet Inputs
              </h2>
            </div>
            <span className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
              {isFiveStepEnabled ? "5-Step Extended" : "3-Step Standard"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Net Income (Profit After Tax)"
                hint="Annual bottom-line profit (PAT)"
                value={netIncome}
                onChange={setNetIncome}
                min={100000}
                max={5000000000}
                step={500000}
                prefix="₹"
              />

              <HybridInput
                label="Total Revenue / Sales"
                hint="Annual top-line turnover"
                value={revenue}
                onChange={setRevenue}
                min={100000}
                max={10000000000}
                step={1000000}
                prefix="₹"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Total Assets"
                hint="Average total assets"
                value={totalAssets}
                onChange={setTotalAssets}
                min={100000}
                max={10000000000}
                step={1000000}
                prefix="₹"
              />

              <HybridInput
                label="Shareholder Equity"
                hint="Net worth (Equity + Reserves)"
                value={totalEquity}
                onChange={setTotalEquity}
                min={100000}
                max={10000000000}
                step={1000000}
                prefix="₹"
              />
            </div>

            {/* 5-Step DuPont Toggle */}
            <button
              type="button"
              onClick={() => setIsFiveStepEnabled((v) => !v)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border/60 text-xs font-semibold text-foreground hover:bg-muted/50 transition"
            >
              <span>{isFiveStepEnabled ? "Switch to 3-Step DuPont Model" : "Unlock 5-Step DuPont Decomposition (EBIT & EBT)"}</span>
              {isFiveStepEnabled ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>

            {isFiveStepEnabled && (
              <div className="p-4 bg-muted/30 border border-border/60 rounded-xl space-y-4">
                <p className="text-xs text-muted-foreground">
                  Provide Operating Profit (EBIT) and Pre-Tax Profit (EBT) to isolate Operating Margin, Interest Burden, and Tax Burden.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <HybridInput
                    label="Operating Profit (EBIT)"
                    hint="Earnings before interest & taxes"
                    value={ebit}
                    onChange={setEbit}
                    min={100000}
                    max={5000000000}
                    step={500000}
                    prefix="₹"
                  />
                  <HybridInput
                    label="Pre-Tax Profit (EBT)"
                    hint="Earnings before taxes"
                    value={ebt}
                    onChange={setEbt}
                    min={100000}
                    max={5000000000}
                    step={500000}
                    prefix="₹"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Return on Equity (ROE)"
            value={result.reportedRoe}
            formatValue={(val) => `${val.toFixed(2)}%`}
            breakdown={[
              { label: "Net Profit Margin", value: result.threeStep.netProfitMargin, color: "green" },
              { label: "Asset Turnover", value: result.threeStep.assetTurnover, color: "blue" },
              { label: "Financial Leverage", value: result.threeStep.financialLeverage, color: "purple" },
            ]}
          />

          {/* 3-Step Factor Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-card/60 border border-border/60 rounded-xl">
              <span className="text-[11px] text-muted-foreground block">Profit Margin</span>
              <span className="text-base font-bold text-emerald-800 dark:text-emerald-300 mt-0.5 block">{result.threeStep.netProfitMargin}%</span>
            </div>
            <div className="p-3 bg-card/60 border border-border/60 rounded-xl">
              <span className="text-[11px] text-muted-foreground block">Asset Turnover</span>
              <span className="text-base font-bold text-foreground mt-0.5 block">{result.threeStep.assetTurnover}x</span>
            </div>
            <div className="p-3 bg-card/60 border border-border/60 rounded-xl">
              <span className="text-[11px] text-muted-foreground block">Equity Multiplier</span>
              <span className="text-base font-bold text-primary mt-0.5 block">{result.threeStep.financialLeverage}x</span>
            </div>
          </div>

          {/* 5-Step Detailed Table if available */}
          {result.isFiveStepAvailable && result.fiveStep && (
            <div className="table-surface">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-card-foreground">
                  5-Step Extended Decomposition
                </h3>
                <span className="text-[11px] font-bold text-emerald-400">
                  Decomposed ROE: {result.fiveStep.decomposedRoe}%
                </span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="table-head">
                    <th className="px-4 py-2 text-left">Factor</th>
                    <th className="px-4 py-2 text-left">Formula</th>
                    <th className="px-4 py-2 text-right">Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="px-4 py-2 font-medium">Tax Burden</td>
                    <td className="px-4 py-2 text-muted-foreground">Net Income / EBT</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.fiveStep.taxBurden}</td>
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-2 font-medium">Interest Burden</td>
                    <td className="px-4 py-2 text-muted-foreground">EBT / EBIT</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.fiveStep.interestBurden}</td>
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-2 font-medium">Operating Margin</td>
                    <td className="px-4 py-2 text-muted-foreground">EBIT / Revenue</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.fiveStep.operatingMargin}%</td>
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-2 font-medium">Asset Turnover</td>
                    <td className="px-4 py-2 text-muted-foreground">Revenue / Assets</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.fiveStep.assetTurnover}x</td>
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-2 font-medium">Financial Leverage</td>
                    <td className="px-4 py-2 text-muted-foreground">Assets / Equity</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.fiveStep.financialLeverage}x</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-3 bg-muted/20 text-[11px] text-muted-foreground text-center border-t border-border/40">
                {result.fiveStep.taxBurden} × {result.fiveStep.interestBurden} × {(result.fiveStep.operatingMargin / 100).toFixed(4)} × {result.fiveStep.assetTurnover} × {result.fiveStep.financialLeverage} × 100 = <strong>{result.fiveStep.decomposedRoe}%</strong>
              </div>
            </div>
          )}

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              DuPont Component Ratio Multipliers
            </h3>
            <div className="h-56">
              <DuPontChart
                netProfitMargin={result.threeStep.netProfitMargin}
                assetTurnover={result.threeStep.assetTurnover}
                financialLeverage={result.threeStep.financialLeverage}
              />
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
              calcType="dupont"
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
        label="Reported ROE"
        value={result.reportedRoe}
      />
    </div>
  );
}
