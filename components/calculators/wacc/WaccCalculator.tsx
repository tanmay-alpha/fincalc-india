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
import { calcWACC } from "@/lib/math";
import type { WaccInput } from "@/lib/math";
import { getWACCInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Scale, PieChart as PieIcon } from "lucide-react";

const WaccChart = dynamic(
  () => import("@/components/calculators/wacc/WaccChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function WaccCalculator() {
  const [mounted, setMounted] = useState(false);
  const [marketValueOfEquity, setMarketValueOfEquity] = useState(70000000); // 7 Cr
  const [marketValueOfDebt, setMarketValueOfDebt] = useState(30000000); // 3 Cr
  const [costOfEquity, setCostOfEquity] = useState(14.0);
  const [preTaxCostOfDebt, setPreTaxCostOfDebt] = useState(9.0);
  const [taxRate, setTaxRate] = useState(25.0);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: WaccInput = useMemo(
    () => ({
      equityValue: marketValueOfEquity,
      debtValue: marketValueOfDebt,
      costOfEquity,
      costOfDebt: preTaxCostOfDebt,
      taxRate,
    }),
    [
      marketValueOfEquity,
      marketValueOfDebt,
      costOfEquity,
      preTaxCostOfDebt,
      taxRate,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcWACC(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getWACCInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Capital Structure & Cost Rates
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Market Value of Equity (E)"
                hint="Market capitalization of common equity"
                value={marketValueOfEquity}
                onChange={setMarketValueOfEquity}
                min={100000}
                max={10000000000}
                step={500000}
                prefix="₹"
              />

              <HybridInput
                label="Market Value of Debt (D)"
                hint="Total market or book value of debt"
                value={marketValueOfDebt}
                onChange={setMarketValueOfDebt}
                min={0}
                max={10000000000}
                step={500000}
                prefix="₹"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Cost of Equity (Ke %)"
                hint="Required return on equity (CAPM: Rf + Beta * ERP)"
                value={costOfEquity}
                onChange={setCostOfEquity}
                min={1}
                max={40}
                step={0.25}
                suffix="%"
              />

              <HybridInput
                label="Pre-Tax Cost of Debt (Kd %)"
                hint="Weighted borrowing rate before tax shield"
                value={preTaxCostOfDebt}
                onChange={setPreTaxCostOfDebt}
                min={0}
                max={30}
                step={0.25}
                suffix="%"
              />
            </div>

            <HybridInput
              label="Corporate Tax Rate (% p.a.)"
              hint="Effective corporate tax rate (standard Indian corporate rate: 25.17%)"
              value={taxRate}
              onChange={setTaxRate}
              min={0}
              max={40}
              step={0.5}
              suffix="%"
            />
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Weighted Average Cost of Capital (WACC)"
            value={result.wacc}
            formatValue={(val) => `${val.toFixed(2)}%`}
            breakdown={[
              { label: `Equity Contribution (${result.weightOfEquity}%)`, value: (result.weightOfEquity * result.costOfEquity) / 100, color: "blue" },
              { label: `Debt Contribution (${result.weightOfDebt}%)`, value: (result.weightOfDebt * result.afterTaxCostOfDebt) / 100, color: "green" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Total Capital</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {formatINR(result.totalValue)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">After-Tax Debt Cost</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.afterTaxCostOfDebt}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Tax Shield Benefit</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.taxShieldBenefit}%
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Capital Structure Weights
            </h3>
            <div className="h-56">
              <WaccChart
                equityValue={result.equityValue}
                debtValue={result.debtValue}
                weightOfEquity={result.weightOfEquity}
                weightOfDebt={result.weightOfDebt}
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
              calcType="wacc"
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
        label="WACC Hurdle Rate"
        value={result.wacc}
      />
    </div>
  );
}
