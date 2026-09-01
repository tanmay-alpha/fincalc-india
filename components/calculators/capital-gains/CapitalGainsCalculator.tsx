"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import InsightCard from "@/components/ui/InsightCard";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcCapitalGains, CURRENT_CII_YEAR } from "@/lib/math";
import type { AssetClass } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import { ShieldCheck, Scale, CheckCircle2, AlertCircle } from "lucide-react";

const CapitalGainsChart = dynamic(
  () => import("@/components/calculators/capital-gains/CapitalGainsChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface CapitalGainsInputsState {
  assetClass: AssetClass;
  purchasePrice: number;
  salePrice: number;
  transferExpenses: number;
  holdingMonths: number;
  purchaseCiiYear: number;
  saleCiiYear: number;
  isPurchasedBeforeCutoff: boolean;
  investorSlabRatePercent: number;
  priorExemptionUsed: number;
}

const DEFAULT_INPUTS: CapitalGainsInputsState = {
  assetClass: "equity",
  purchasePrice: 500000,
  salePrice: 1000000,
  transferExpenses: 5000,
  holdingMonths: 18,
  purchaseCiiYear: 2018,
  saleCiiYear: 2024,
  isPurchasedBeforeCutoff: true,
  investorSlabRatePercent: 30,
  priorExemptionUsed: 0,
};

const ASSET_CLASSES: Array<{ id: AssetClass; label: string; icon: string }> = [
  { id: "equity", label: "Equity / Mutual Funds", icon: "📈" },
  { id: "real_estate", label: "Real Estate Property", icon: "🏠" },
  { id: "debt_mf", label: "Debt Mutual Funds", icon: "🏦" },
  { id: "gold_sgb", label: "Gold & SGB", icon: "🪙" },
];

export default function CapitalGainsCalculator() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<CapitalGainsInputsState>(DEFAULT_INPUTS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcCapitalGains(debouncedInputs);
  }, [debouncedInputs]);

  if (!mounted) return <CalcPageSkeleton />;

  const netInPocket = result.netSaleValue - result.totalTaxPayable;

  return (
    <>
      <StickyResultBar label="Tax Payable" value={result.totalTaxPayable} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Asset Class Selector */}
          <div className="surface-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Asset Class (Post-Budget 2024 Rules)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASSET_CLASSES.map((ac) => (
                <button
                  key={ac.id}
                  type="button"
                  onClick={() => setInputs((prev) => ({ ...prev, assetClass: ac.id }))}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all",
                    inputs.assetClass === ac.id
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  <span className="text-base">{ac.icon}</span>
                  <span className="truncate">{ac.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 space-y-6">
            <HybridInput
              label="Purchase Price / Buy Value"
              value={inputs.purchasePrice}
              onChange={(val) => setInputs((prev) => ({ ...prev, purchasePrice: val }))}
              min={1000}
              max={100000000}
              step={10000}
              prefix="₹"
              quickChips={[
                { label: "₹1L", value: 100000 },
                { label: "₹5L", value: 500000 },
                { label: "₹25L", value: 2500000 },
                { label: "₹1 Cr", value: 10000000 },
              ]}
            />

            <HybridInput
              label="Sale Price / Redemption Value"
              value={inputs.salePrice}
              onChange={(val) => setInputs((prev) => ({ ...prev, salePrice: val }))}
              min={1000}
              max={200000000}
              step={10000}
              prefix="₹"
              quickChips={[
                { label: "₹2L", value: 200000 },
                { label: "₹10L", value: 1000000 },
                { label: "₹50L", value: 5000000 },
                { label: "₹2 Cr", value: 20000000 },
              ]}
            />

            <HybridInput
              label="Holding Period (Months)"
              value={inputs.holdingMonths}
              onChange={(val) => setInputs((prev) => ({ ...prev, holdingMonths: val }))}
              min={1}
              max={360}
              step={1}
              suffix=" mo"
              hint={
                inputs.assetClass === "equity"
                  ? ">12 months = LTCG (12.5% over ₹1.25L); ≤12 months = STCG (20%)"
                  : inputs.assetClass === "real_estate" || inputs.assetClass === "gold_sgb"
                  ? ">24 months = LTCG (12.5%); ≤24 months = STCG (Slab rate)"
                  : "Debt MF is always taxed at slab rate"
              }
              quickChips={[
                { label: "6 mo (STCG)", value: 6 },
                { label: "18 mo (LTCG)", value: 18 },
                { label: "3 yrs", value: 36 },
                { label: "5 yrs", value: 60 },
              ]}
            />

            <HybridInput
              label="Transfer / Brokerage / Registration Expenses"
              value={inputs.transferExpenses}
              onChange={(val) => setInputs((prev) => ({ ...prev, transferExpenses: val }))}
              min={0}
              max={5000000}
              step={1000}
              prefix="₹"
            />

            {/* Real Estate Specific Options */}
            {inputs.assetClass === "real_estate" && inputs.holdingMonths > 24 && (
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Purchased Before 23 July 2024?
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Grandfathering allows lower of 12.5% vs 20% with indexation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inputs.isPurchasedBeforeCutoff}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, isPurchasedBeforeCutoff: e.target.checked }))
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {inputs.isPurchasedBeforeCutoff && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <HybridInput
                      label="Purchase FY (CII)"
                      value={inputs.purchaseCiiYear}
                      onChange={(val) => setInputs((prev) => ({ ...prev, purchaseCiiYear: val }))}
                      min={2001}
                      max={2024}
                      step={1}
                      prefix="FY "
                    />
                    <HybridInput
                      label="Sale FY (CII)"
                      value={inputs.saleCiiYear}
                      onChange={(val) => setInputs((prev) => ({ ...prev, saleCiiYear: val }))}
                      min={2024}
                      max={Number.parseInt(CURRENT_CII_YEAR, 10)}
                      step={1}
                      prefix="FY "
                    />
                  </div>
                )}
              </div>
            )}

            {/* Equity Prior Exemption */}
            {inputs.assetClass === "equity" && result.gainType === "LTCG" && (
              <HybridInput
                label="LTCG Exemption Already Used Elsewhere This FY"
                value={inputs.priorExemptionUsed}
                onChange={(val) => setInputs((prev) => ({ ...prev, priorExemptionUsed: val }))}
                min={0}
                max={125000}
                step={5000}
                prefix="₹"
                hint="Max ₹1.25L exemption applies across all equity LTCG in one financial year."
              />
            )}

            {/* Investor Slab Rate */}
            {(inputs.assetClass === "debt_mf" || result.gainType === "STCG") && (
              <HybridInput
                label="Your Income Tax Slab Rate"
                value={inputs.investorSlabRatePercent}
                onChange={(val) => setInputs((prev) => ({ ...prev, investorSlabRatePercent: val }))}
                min={0}
                max={40}
                step={5}
                suffix="%"
                quickChips={[
                  { label: "10%", value: 10 },
                  { label: "20%", value: 20 },
                  { label: "30%", value: 30 },
                ]}
              />
            )}
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-6 space-y-6">
          <ResultHero
            label="Total Capital Gains Tax"
            value={result.totalTaxPayable}
            breakdown={[
              { label: "Gross Capital Gain", value: Math.max(0, result.rawCapitalGain), color: "blue" },
              { label: "Exemption Applied", value: result.exemptionAllowed, color: "green" },
              { label: "Taxable Capital Gain", value: result.taxableGain, color: "blue" },
              { label: "Net Cash In Hand", value: netInPocket, color: "green" },
            ]}
          />

          {/* Real Estate Dual Regime Comparison */}
          {result.realEstateComparison && (
            <div className="surface-card p-5 rounded-2xl border-2 border-primary/20 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Scale className="h-4 w-4" />
                <span>Grandfathering Benefit: 12.5% vs 20% with Indexation</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className={clsx(
                    "p-3 rounded-xl border",
                    result.realEstateComparison.recommendedOption === "unindexed_12_5"
                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-foreground"
                      : "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Option A: 12.5% Unindexed</span>
                    {result.realEstateComparison.recommendedOption === "unindexed_12_5" && (
                      <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">LOWER</span>
                    )}
                  </div>
                  <p>Taxable Gain: {formatINR(result.realEstateComparison.unindexedGain)}</p>
                  <p className="font-semibold text-sm text-foreground mt-1">
                    Tax: {formatINR(result.realEstateComparison.unindexedTax)}
                  </p>
                </div>

                <div
                  className={clsx(
                    "p-3 rounded-xl border",
                    result.realEstateComparison.recommendedOption === "indexed_20"
                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-foreground"
                      : "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Option B: 20% Indexed</span>
                    {result.realEstateComparison.recommendedOption === "indexed_20" && (
                      <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">LOWER</span>
                    )}
                  </div>
                  <p>Indexed Cost: {formatINR(result.realEstateComparison.indexedCost)}</p>
                  <p className="font-semibold text-sm text-foreground mt-1">
                    Tax: {formatINR(result.realEstateComparison.indexedTax)}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  By opting for{" "}
                  <strong className="text-foreground">
                    {result.realEstateComparison.recommendedOption === "indexed_20"
                      ? "20% with CII Indexation"
                      : "12.5% without Indexation"}
                  </strong>
                  , you save <strong className="text-green-600 dark:text-green-400">{formatINR(result.realEstateComparison.taxSavedByBestOption)}</strong> in capital gains tax.
                </p>
              </div>
            </div>
          )}

          {/* Explanation Alert */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-muted-foreground flex items-start gap-2.5">
            {result.isLoss ? (
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{result.explanation}</p>
          </div>

          {/* Section 54 / 54EC Reinvestment Exemption Banner for Real Estate LTCG */}
          {inputs.assetClass === "real_estate" && result.gainType === "LTCG" && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <span>🏡</span> Save 100% Tax via Section 54 / 54EC
                </div>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                  Reinvest in a residential house or capital gains bonds to bring ₹{result.totalTaxPayable.toLocaleString("en-IN")} tax down to ₹0.
                </p>
              </div>
              <a
                href="/section-54-exemption"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Plan Exemption →
              </a>
            </div>
          )}

          {/* Chart Card */}
          <div className="surface-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Proceeds & Tax Split
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Visual breakdown of invested capital, post-tax net profit, and tax liability
            </p>
            <div className="h-[280px]">
              <CapitalGainsChart
                purchasePrice={result.purchasePrice}
                taxableGain={result.taxableGain}
                totalTaxPayable={result.totalTaxPayable}
                netInPocket={netInPocket}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InsightCard
              type="info"
              icon="💡"
              title={`Effective Tax: ${result.effectiveTaxRate}%`}
              subtitle="Tax payable as % of total capital gain"
            />
            <InsightCard
              type="good"
              icon="💰"
              title={`In Hand: ${formatINR(netInPocket)}`}
              subtitle="Sale value minus expenses and tax"
            />
          </div>
        </div>
      </div>
    </>
  );
}
