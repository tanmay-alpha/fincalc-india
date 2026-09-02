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
import { calcMarginRequired, FNO_CONTRACT_DEFAULTS } from "@/lib/math";
import type { MarginRequiredInput, MarginInstrumentCategory } from "@/lib/math";
import { getMarginRequiredInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Shield, PieChart as PieIcon, AlertCircle } from "lucide-react";

const MarginChart = dynamic(
  () => import("@/components/calculators/margin/MarginChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function MarginCalculator() {
  const [mounted, setMounted] = useState(false);
  const [instrumentCategory, setInstrumentCategory] = useState<MarginInstrumentCategory>("nifty_futures");
  const [lotSize, setLotSize] = useState<number>(FNO_CONTRACT_DEFAULTS.nifty.lotSize);
  const [numberOfLots, setNumberOfLots] = useState(2);
  const [price, setPrice] = useState(24000);
  const [isMtfHolding, setIsMtfHolding] = useState(false);
  const [mtfHoldingDays, setMtfHoldingDays] = useState(30);
  const [mtfAnnualInterestRate, setMtfAnnualInterestRate] = useState(12.0);
  const [customSpanPercent, setCustomSpanPercent] = useState(10.5);
  const [customExposurePercent, setCustomExposurePercent] = useState(2.0);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update default lot sizes and educational margin rates based on category
  const handleCategoryChange = (cat: MarginInstrumentCategory) => {
    setInstrumentCategory(cat);
    if (cat === "nifty_futures") {
      setLotSize(FNO_CONTRACT_DEFAULTS.nifty.lotSize);
      setPrice(24000);
      setCustomSpanPercent(10.5);
      setCustomExposurePercent(2.0);
    } else if (cat === "banknifty_futures") {
      setLotSize(FNO_CONTRACT_DEFAULTS.banknifty.lotSize);
      setPrice(50000);
      setCustomSpanPercent(12.5);
      setCustomExposurePercent(2.5);
    } else if (cat === "finnifty_futures") {
      setLotSize(FNO_CONTRACT_DEFAULTS.finnifty.lotSize);
      setPrice(23000);
      setCustomSpanPercent(11.0);
      setCustomExposurePercent(2.0);
    } else if (cat === "tier1_equity") {
      setLotSize(100);
      setPrice(1500);
      setCustomSpanPercent(14.0);
      setCustomExposurePercent(3.5);
    } else if (cat === "tier2_equity") {
      setLotSize(100);
      setPrice(1500);
      setCustomSpanPercent(20.0);
      setCustomExposurePercent(5.0);
    } else if (cat === "intraday_equity") {
      setLotSize(100);
      setPrice(1500);
      setCustomSpanPercent(15.0);
      setCustomExposurePercent(5.0);
    }
  };

  const inputs: MarginRequiredInput = useMemo(
    () => ({
      instrumentCategory,
      lotSize,
      numberOfLots,
      price,
      isMtfHolding,
      mtfHoldingDays,
      mtfAnnualInterestRate,
      customSpanPercent,
      customExposurePercent,
    }),
    [
      instrumentCategory,
      lotSize,
      numberOfLots,
      price,
      isMtfHolding,
      mtfHoldingDays,
      mtfAnnualInterestRate,
      customSpanPercent,
      customExposurePercent,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcMarginRequired(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getMarginRequiredInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trade Details */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          {/* Statutory Estimator Disclaimer */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-amber-500 font-semibold">F&O Margin Estimator:</strong> Illustrative SPAN/exposure assumptions. Actual exchange/broker margin varies with contract, volatility and current risk parameters.
            </span>
          </div>

          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              F&O Margin Estimator Parameters
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Select Instrument / Segment
              </label>
              <select
                value={instrumentCategory}
                onChange={(e) => handleCategoryChange(e.target.value as MarginInstrumentCategory)}
                className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="nifty_futures">Nifty 50 Index Futures (10.5% SPAN + 2% Exposure)</option>
                <option value="banknifty_futures">Bank Nifty Futures (12.5% SPAN + 2.5% Exposure)</option>
                <option value="finnifty_futures">FinNifty Futures (11.0% SPAN + 2% Exposure)</option>
                <option value="tier1_equity">Tier-1 Large Cap Stock Futures (14% SPAN + 3.5% Exposure)</option>
                <option value="tier2_equity">Tier-2 Mid/Small Cap Stock Futures (20% SPAN + 5% Exposure)</option>
                <option value="intraday_equity">Intraday MIS Cash Equity (15% SPAN + 5% Exposure / 5x SEBI Cap)</option>
                <option value="custom">Custom SPAN + Exposure Rates</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <HybridInput
                label="Contract Price"
                hint="Price per share or index points"
                value={price}
                onChange={setPrice}
                min={1}
                max={500000}
                step={50}
                prefix="₹"
              />

              <HybridInput
                label="Lot Size"
                hint="Quantity per contract lot"
                value={lotSize}
                onChange={setLotSize}
                min={1}
                max={10000}
                step={1}
              />

              <HybridInput
                label="Number of Lots"
                hint="Total lots traded"
                value={numberOfLots}
                onChange={setNumberOfLots}
                min={1}
                max={500}
                step={1}
              />
            </div>

            {/* Editable SPAN & Exposure Margin Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-muted/20 border border-border/40 rounded-xl">
              <HybridInput
                label="SPAN Margin (%)"
                hint="Volatility margin requirement (editable)"
                value={customSpanPercent}
                onChange={setCustomSpanPercent}
                min={1}
                max={50}
                step={0.5}
                suffix="%"
              />
              <HybridInput
                label="Exposure Margin (%)"
                hint="Extreme loss buffer (editable)"
                value={customExposurePercent}
                onChange={setCustomExposurePercent}
                min={0.5}
                max={20}
                step={0.25}
                suffix="%"
              />
            </div>

            {/* MTF Leverage Toggle */}
            <div className="pt-2 border-t border-border/40 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMtfHolding}
                  onChange={(e) => setIsMtfHolding(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-xs font-semibold text-foreground">
                  Include Margin Trading Facility (MTF) Interest Carry
                </span>
              </label>

              {isMtfHolding && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-muted/20 border border-border/40 rounded-xl">
                  <HybridInput
                    label="Holding Duration (Days)"
                    hint="Days on broker funded margin"
                    value={mtfHoldingDays}
                    onChange={setMtfHoldingDays}
                    min={1}
                    max={365}
                    step={1}
                    suffix="d"
                  />
                  <HybridInput
                    label="MTF Interest Rate (% p.a.)"
                    hint="Broker annual MTF rate (9.5% - 15%)"
                    value={mtfAnnualInterestRate}
                    onChange={setMtfAnnualInterestRate}
                    min={6}
                    max={24}
                    step={0.25}
                    suffix="%"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Total Upfront Margin Required"
            value={result.totalMarginRequired}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: `SPAN Margin (${result.spanMarginPercent}%)`, value: result.spanMarginRequired, color: "blue" },
              { label: `Exposure Margin (${result.exposureMarginPercent}%)`, value: result.exposureMarginRequired, color: "green" },
              ...(result.mtfInterestCost > 0 ? [{ label: "MTF Interest Carry", value: result.mtfInterestCost, color: "red" as const }] : []),
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Contract Value</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {formatINR(result.totalContractValue)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Effective Leverage</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.effectiveLeverage}x
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Total Quantity</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {result.totalQuantity.toLocaleString("en-IN")} Units
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Margin Component Breakdown
            </h3>
            <div className="h-56">
              <MarginChart
                spanMargin={result.spanMarginRequired}
                exposureMargin={result.exposureMarginRequired}
                mtfInterest={result.mtfInterestCost}
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
              calcType="margin-calculator"
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
        label="Required Margin"
        value={result.totalMarginRequired}
      />
    </div>
  );
}
