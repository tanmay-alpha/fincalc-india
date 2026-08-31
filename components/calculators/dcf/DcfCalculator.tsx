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
import { calcDCF } from "@/lib/math";
import type { DcfInput } from "@/lib/math";
import { getDCFInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Building2, TrendingUp, DollarSign, PieChart as PieIcon, ShieldAlert } from "lucide-react";

const DcfChart = dynamic(
  () => import("@/components/calculators/dcf/DcfChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function DcfCalculator() {
  const [mounted, setMounted] = useState(false);
  const [cashFlowYear1, setCashFlowYear1] = useState(50000000); // 5 Cr
  const [forecastYears, setForecastYears] = useState(5);
  const [growthRateYears1to5, setGrowthRateYears1to5] = useState(15);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(4.5);
  const [discountRate, setDiscountRate] = useState(11.5);
  const [totalDebt, setTotalDebt] = useState(20000000); // 2 Cr
  const [cashAndEquivalents, setCashAndEquivalents] = useState(10000000); // 1 Cr
  const [sharesOutstanding, setSharesOutstanding] = useState(1000000); // 10 Lakh shares
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fcfProjections = useMemo(() => {
    const list: number[] = [];
    let current = cashFlowYear1;
    for (let i = 0; i < forecastYears; i++) {
      if (i === 0) {
        list.push(current);
      } else {
        current = current * (1 + growthRateYears1to5 / 100);
        list.push(current);
      }
    }
    return list;
  }, [cashFlowYear1, growthRateYears1to5, forecastYears]);

  const inputs: DcfInput = useMemo(
    () => ({
      fcfProjections,
      terminalGrowthRate,
      discountRate,
      sharesOutstanding,
      netDebt: totalDebt - cashAndEquivalents,
    }),
    [
      fcfProjections,
      terminalGrowthRate,
      discountRate,
      sharesOutstanding,
      totalDebt,
      cashAndEquivalents,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcDCF(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getDCFInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Cash Flow & Valuation Inputs
            </h2>
          </div>

          <div className="space-y-4">
            <HybridInput
              label="Starting Free Cash Flow (FCF Year 1)"
              hint="Base year projected free cash flow to firm (FCFF) in INR"
              value={cashFlowYear1}
              onChange={setCashFlowYear1}
              min={100000}
              max={10000000000}
              step={500000}
              prefix="₹"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Forecast Duration (Years)"
                hint="Explicit projection horizon (typical: 5-10 years)"
                value={forecastYears}
                onChange={setForecastYears}
                min={3}
                max={15}
                step={1}
                suffix="Y"
              />

              <HybridInput
                label="Initial Growth Rate (% p.a.)"
                hint="Compounded growth rate during explicit period"
                value={growthRateYears1to5}
                onChange={setGrowthRateYears1to5}
                min={-20}
                max={100}
                step={0.5}
                suffix="%"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Discount Rate (WACC %)"
                hint="Required Rate of Return"
                value={discountRate}
                onChange={setDiscountRate}
                min={5}
                max={30}
                step={0.25}
                suffix="%"
              />

              <HybridInput
                label="Terminal Growth Rate (% p.a.)"
                hint="Perpetual long-term GDP growth rate (4.0 - 5.5%)"
                value={terminalGrowthRate}
                onChange={setTerminalGrowthRate}
                min={1}
                max={10}
                step={0.25}
                suffix="%"
              />
            </div>

            <div className="pt-2 border-t border-border/40 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Balance Sheet Adjustments & Share Count
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HybridInput
                  label="Total Debt"
                  hint="Total interest-bearing debt on balance sheet"
                  value={totalDebt}
                  onChange={setTotalDebt}
                  min={0}
                  max={5000000000}
                  step={500000}
                  prefix="₹"
                />

                <HybridInput
                  label="Cash & Liquid Equivalents"
                  hint="Cash, bank balances, and liquid securities"
                  value={cashAndEquivalents}
                  onChange={setCashAndEquivalents}
                  min={0}
                  max={5000000000}
                  step={500000}
                  prefix="₹"
                />
              </div>

              <HybridInput
                label="Total Shares Outstanding"
                hint="Diluted total share count for per-share fair value"
                value={sharesOutstanding}
                onChange={setSharesOutstanding}
                min={1000}
                max={1000000000}
                step={10000}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          {result.isValid ? (
            <>
              <ResultHero
                label="Fair Intrinsic Value Per Share"
                value={result.intrinsicValuePerShare}
                formatValue={(val) => `₹${val.toLocaleString("en-IN")}`}
                breakdown={[
                  { label: "PV Explicit Cash Flows", value: result.presentValueExplicitFcf, color: "blue" },
                  { label: "PV Terminal Value", value: result.presentValueTerminalValue, color: "green" },
                ]}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Enterprise Value</p>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {formatINR(result.enterpriseValue)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Equity Value</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">
                    {formatINR(result.equityValue)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Discount (WACC)</p>
                  <p className="text-base font-bold text-primary mt-0.5">
                    {result.discountRate}%
                  </p>
                </div>
              </div>

              {/* Chart Card */}
              <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Explicit Projected vs Discounted Cash Flows
                </h3>
                <div className="h-56">
                  <DcfChart yearlyBreakdown={result.yearlyBreakdown} />
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
                  calcType="dcf-valuation"
                  data={{
                    inputs: inputs as unknown as Record<string, unknown>,
                    results: result as unknown as Record<string, unknown>,
                  }}
                  onSaved={(id) => setShareId(id)}
                />
                <ShareButton shareId={shareId} />
              </div>
            </>
          ) : (
            <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-warning mx-auto" />
              <h3 className="font-semibold text-foreground">Invalid Model Parameters</h3>
              <p className="text-xs text-muted-foreground">{result.errorMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <StickyResultBar
        label="DCF Fair Value / Share"
        value={result.intrinsicValuePerShare}
      />
    </div>
  );
}
