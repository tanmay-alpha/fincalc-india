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
import { calcMarginalRelief } from "@/lib/math";
import type { MarginalReliefInput, TaxRegime } from "@/lib/math";
import { getMarginalReliefInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";
import { Landmark, Activity } from "lucide-react";

const MarginalReliefChart = dynamic(
  () => import("@/components/calculators/marginal-relief/MarginalReliefChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function MarginalReliefCalculator() {
  const mounted = useIsMounted();
  const [grossTotalIncome, setGrossTotalIncome] = useState(5100000); // 51 Lakhs (just above 50L threshold)
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [shareId, setShareId] = useState<string | null>(null);

  const inputs: MarginalReliefInput = useMemo(
    () => ({
      grossTotalIncome,
      regime,
    }),
    [grossTotalIncome, regime]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcMarginalRelief(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getMarginalReliefInsights(result), [result]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "marginal-relief",
        name: "Marginal Relief & Surcharge Calculator",
        route: "/marginal-relief",
        category: "taxation",
        summary: `₹${grossTotalIncome.toLocaleString("en-IN")} · ${regime.toUpperCase()}`,
      });
    }
  }, [mounted, grossTotalIncome, regime]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tax Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Landmark className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              High-Income Tax Profile — Tax Year 2026-27
            </h2>
          </div>

          <div className="space-y-4">
            <HybridInput
              label="Gross Total Annual Income"
              hint="Total taxable income across salary, business, and other sources"
              value={grossTotalIncome}
              onChange={setGrossTotalIncome}
              min={4000000}
              max={200000000}
              step={100000}
              prefix="₹"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Income Tax Regime
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRegime("new")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    regime === "new"
                      ? "bg-primary/15 border-primary text-primary shadow-sm"
                      : "bg-muted/20 border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  New Regime (Max 25% Surcharge)
                </button>
                <button
                  onClick={() => setRegime("old")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    regime === "old"
                      ? "bg-primary/15 border-primary text-primary shadow-sm"
                      : "bg-muted/20 border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  Old Regime (Up to 37% Surcharge)
                </button>
              </div>
            </div>

            {/* Quick Surcharge Threshold Presets */}
            <div className="pt-2 border-t border-border/40 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground block">
                Quick Test Surcharge Threshold Boundaries:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "₹50.5 Lakh (10% Tier)", val: 5050000 },
                  { label: "₹1.01 Crore (15% Tier)", val: 10100000 },
                  { label: "₹2.02 Crore (25% Tier)", val: 20200000 },
                  { label: "₹5.05 Crore (Max Tier)", val: 50500000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setGrossTotalIncome(preset.val)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/40 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Total High-Income Tax Payable"
            value={result.totalTaxPayable}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Base Slab Tax", value: result.baseTax, color: "blue" },
              { label: `Net Surcharge (${result.applicableSurchargeRatePercent}%)`, value: result.netSurcharge, color: "red" },
              { label: "4% Health & Education Cess", value: result.healthAndEducationCess, color: "purple" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Effective Tax Rate</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {result.effectiveTaxRatePercent}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Marginal Relief</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatINR(result.marginalReliefAmount)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Applicable Surcharge</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.applicableSurchargeRatePercent}%
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Tax, Surcharge & Marginal Relief Breakdown
            </h3>
            <div className="h-56">
              <MarginalReliefChart
                baseTax={result.baseTax}
                netSurcharge={result.netSurcharge}
                cess={result.healthAndEducationCess}
                marginalReliefSaved={result.marginalReliefAmount}
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
              calcType="marginal-relief"
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
        label="Total Tax"
        value={result.totalTaxPayable}
      />
    </div>
  );
}
