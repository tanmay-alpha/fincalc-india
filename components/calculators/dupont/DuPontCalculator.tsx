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
import { calcDuPont } from "@/lib/math";
import type { DuPontInput } from "@/lib/math";
import { getDuPontInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { Layers, Activity } from "lucide-react";

const DuPontChart = dynamic(
  () => import("@/components/calculators/dupont/DuPontChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function DuPontCalculator() {
  const [mounted, setMounted] = useState(false);
  const [netIncome, setNetIncome] = useState(15000000); // 1.5 Cr
  const [revenue, setRevenue] = useState(100000000); // 10 Cr
  const [totalAssets, setTotalAssets] = useState(80000000); // 8 Cr
  const [totalEquity, setTotalEquity] = useState(50000000); // 5 Cr
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: DuPontInput = useMemo(
    () => ({
      netIncome,
      revenue,
      totalAssets,
      shareholdersEquity: totalEquity,
    }),
    [netIncome, revenue, totalAssets, totalEquity]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcDuPont(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getDuPontInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Financial Statement Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Income Statement & Balance Sheet Inputs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Net Income (Profit After Tax)"
                hint="Annual bottom-line profit after tax (PAT)"
                value={netIncome}
                onChange={setNetIncome}
                min={100000}
                max={5000000000}
                step={500000}
                prefix="₹"
              />

              <HybridInput
                label="Total Revenue / Sales"
                hint="Total top-line annual operational turnover"
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
                hint="Average or period-end total assets"
                value={totalAssets}
                onChange={setTotalAssets}
                min={100000}
                max={10000000000}
                step={1000000}
                prefix="₹"
              />

              <HybridInput
                label="Shareholder Equity"
                hint="Net worth (Total Share Capital + Reserves & Surplus)"
                value={totalEquity}
                onChange={setTotalEquity}
                min={100000}
                max={10000000000}
                step={1000000}
                prefix="₹"
              />
            </div>
          </div>

          {/* 3-Step DuPont Factor Grid */}
          <div className="pt-2 border-t border-border/40 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              3-Step Component Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-xs text-muted-foreground block">Profit Margin</span>
                <span className="text-base font-bold text-foreground">{result.threeStep.netProfitMargin}%</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-xs text-muted-foreground block">Asset Turnover</span>
                <span className="text-base font-bold text-foreground">{result.threeStep.assetTurnover}x</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-xs text-muted-foreground block">Equity Multiplier</span>
                <span className="text-base font-bold text-foreground">{result.threeStep.financialLeverage}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Return on Equity (DuPont ROE)"
            value={result.reportedRoe}
            formatValue={(val) => `${val.toFixed(2)}%`}
            breakdown={[
              { label: `Profit Margin (${result.threeStep.netProfitMargin}%)`, value: result.threeStep.netProfitMargin, color: "blue" },
              { label: `Asset Turnover (${result.threeStep.assetTurnover}x)`, value: result.threeStep.assetTurnover * 10, color: "green" },
              { label: `Financial Leverage (${result.threeStep.financialLeverage}x)`, value: result.threeStep.financialLeverage * 10, color: "purple" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Return on Assets</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {(result.threeStep.netProfitMargin * result.threeStep.assetTurnover).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Primary Driver</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5 capitalize">
                {result.primaryDriver}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Equity Multiplier</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.threeStep.financialLeverage}x
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              DuPont Factor Proportions
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
              calcType="dupont-analysis"
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
        label="DuPont ROE"
        value={result.reportedRoe}
      />
    </div>
  );
}
