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
import { calcUSStockReturn } from "@/lib/math";
import type { USStockReturnInput } from "@/lib/math";
import { getUSStockReturnInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { DollarSign, TrendingUp } from "lucide-react";

const USStockChart = dynamic(
  () => import("@/components/calculators/us-stock/USStockChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function USStockTaxCalculator() {
  const [mounted, setMounted] = useState(false);
  const [investmentAmountInr, setInvestmentAmountInr] = useState(840000); // ~ $10,000
  const [purchaseUsdInrRate, setPurchaseUsdInrRate] = useState(84.0);
  const [saleUsdInrRate, setSaleUsdInrRate] = useState(88.0);
  const [capitalGainUsd, setCapitalGainUsd] = useState(2500); // $2,500 stock gain
  const [dividendIncomeUsd, setDividendIncomeUsd] = useState(200); // $200 dividends
  const [holdingMonths, setHoldingMonths] = useState(24); // 24 months (LTCG boundary)
  const [userTaxBracketPercent, setUserTaxBracketPercent] = useState(30.0);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: USStockReturnInput = useMemo(
    () => ({
      investmentAmountInr,
      purchaseUsdInrRate,
      saleUsdInrRate,
      capitalGainUsd,
      dividendIncomeUsd,
      holdingMonths,
      userTaxBracketPercent,
    }),
    [
      investmentAmountInr,
      purchaseUsdInrRate,
      saleUsdInrRate,
      capitalGainUsd,
      dividendIncomeUsd,
      holdingMonths,
      userTaxBracketPercent,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcUSStockReturn(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getUSStockReturnInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Investment Details */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              US Stock & Currency Dynamics
            </h2>
          </div>

          <div className="space-y-4">
            <HybridInput
              label="Initial Investment Amount (INR)"
              hint="Total capital converted and remitted from India"
              value={investmentAmountInr}
              onChange={setInvestmentAmountInr}
              min={10000}
              max={25000000}
              step={50000}
              prefix="₹"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Purchase USD/INR Rate"
                hint="Exchange rate at initial stock purchase"
                value={purchaseUsdInrRate}
                onChange={setPurchaseUsdInrRate}
                min={50}
                max={150}
                step={0.25}
                prefix="₹"
              />

              <HybridInput
                label="Sale / Current USD/INR Rate"
                hint="Exchange rate upon liquidation/current valuation"
                value={saleUsdInrRate}
                onChange={setSaleUsdInrRate}
                min={50}
                max={150}
                step={0.25}
                prefix="₹"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Stock Capital Gain ($ USD)"
                hint="Net capital gain in USD (Sale - Buy Price)"
                value={capitalGainUsd}
                onChange={setCapitalGainUsd}
                min={-50000}
                max={500000}
                step={250}
                prefix="$"
              />

              <HybridInput
                label="Dividend Income ($ USD)"
                hint="Total US dividend received before 25% tax"
                value={dividendIncomeUsd}
                onChange={setDividendIncomeUsd}
                min={0}
                max={50000}
                step={50}
                prefix="$"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Holding Duration (Months)"
                hint="LTCG applies at ≥ 24 months holding period"
                value={holdingMonths}
                onChange={setHoldingMonths}
                min={1}
                max={120}
                step={1}
                suffix="M"
              />

              <HybridInput
                label="Your Indian Tax Bracket (%)"
                hint="Applicable slab rate for STCG & dividends"
                value={userTaxBracketPercent}
                onChange={setUserTaxBracketPercent}
                min={0}
                max={39}
                step={1}
                suffix="%"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Net In-Hand Realized INR Proceeds"
            value={result.netProceedsInr}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Original Capital Remitted", value: result.investmentAmountInr, color: "blue" },
              { label: "Net Post-Tax Gains & Dividends", value: Math.max(0, result.netProceedsInr - result.investmentAmountInr), color: "green" },
              { label: "Taxes Paid (US + India)", value: result.totalTaxPaidInr, color: "red" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Annualized Return</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.annualizedReturnCagr}% CAGR
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Currency Gain</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {formatINR(result.currencyGainLossInr)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Tax Treatment</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.isLongTerm ? "LTCG 12.5%" : "STCG Slab"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">DTAA FTC Credit</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatINR(result.foreignTaxCreditInr)}
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Gain Sources & Tax Outflow Distribution
            </h3>
            <div className="h-56">
              <USStockChart
                stockGain={result.stockCapitalGainInr}
                currencyGain={result.currencyGainLossInr}
                dividendIncome={result.grossDividendInr}
                totalTax={result.totalTaxPaidInr}
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
              calcType="us-stock-tax"
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
        label="Net US Stock Proceeds"
        value={result.netProceedsInr}
      />
    </div>
  );
}
