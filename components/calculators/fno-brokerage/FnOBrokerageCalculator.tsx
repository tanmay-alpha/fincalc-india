"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import InsightCard from "@/components/ui/InsightCard";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcFnOBreakeven } from "@/lib/math";
import type { FnOInstrument, FnOTaxYear } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import { Zap } from "lucide-react";

const FnOBrokerageChart = dynamic(
  () => import("@/components/calculators/fno-brokerage/FnOBrokerageChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface FnOInputsState {
  instrument: FnOInstrument;
  taxYear: FnOTaxYear;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  brokeragePerOrder: number;
}

const DEFAULT_INPUTS: FnOInputsState = {
  instrument: "options",
  taxYear: "tax_year_2026_27",
  buyPrice: 150,
  sellPrice: 210,
  quantity: 100, // 2 lots of Nifty (50 per lot)
  brokeragePerOrder: 20,
};

export default function FnOBrokerageCalculator() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<FnOInputsState>(DEFAULT_INPUTS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcFnOBreakeven(debouncedInputs);
  }, [debouncedInputs]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Net P&L (Post Charges)" value={result.netPnl} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tax Year & Regulatory Version Toggle */}
          <div className="surface-card p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                Tax Year 2026-27
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                STT: {inputs.instrument === "options" ? "0.15% flat" : "0.05% turnover"}
              </p>
            </div>
            <div className="flex rounded-lg border border-border bg-background p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setInputs(p => ({ ...p, taxYear: "tax_year_2026_27" }))}
                className={clsx(
                  "px-3 py-1.5 rounded-md font-medium transition-all",
                  inputs.taxYear === "tax_year_2026_27"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tax Year 2026-27
              </button>
              <button
                type="button"
                onClick={() => setInputs(p => ({ ...p, taxYear: "pre_april_2026" }))}
                className={clsx(
                  "px-3 py-1.5 rounded-md font-medium transition-all",
                  inputs.taxYear === "pre_april_2026"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Pre-April 2026
              </button>
            </div>
          </div>

          {/* Instrument Toggle */}
          <div className="surface-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Instrument Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setInputs((prev) => ({
                    ...prev,
                    instrument: "options",
                    buyPrice: 150,
                    sellPrice: 210,
                    quantity: 100,
                  }))
                }
                className={clsx(
                  "p-3 rounded-xl border text-center text-xs font-semibold transition-all",
                  inputs.instrument === "options"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                🎯 Options ({inputs.taxYear === "tax_year_2026_27" ? "0.15% STT" : "0.10% STT"})
              </button>

              <button
                type="button"
                onClick={() =>
                  setInputs((prev) => ({
                    ...prev,
                    instrument: "futures",
                    buyPrice: 24000,
                    sellPrice: 24150,
                    quantity: 50,
                  }))
                }
                className={clsx(
                  "p-3 rounded-xl border text-center text-xs font-semibold transition-all",
                  inputs.instrument === "futures"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                ⚡ Futures ({inputs.taxYear === "tax_year_2026_27" ? "0.05% STT" : "0.02% STT"})
              </button>
            </div>
          </div>

          <div className="surface-card p-6 space-y-6">
            <HybridInput
              label={inputs.instrument === "options" ? "Option Buy Premium Price" : "Futures Buy Price"}
              value={inputs.buyPrice}
              onChange={(val) => setInputs((prev) => ({ ...prev, buyPrice: val }))}
              min={0.05}
              max={100000}
              step={0.5}
              prefix="₹"
              quickChips={
                inputs.instrument === "options"
                  ? [
                      { label: "₹50", value: 50 },
                      { label: "₹150", value: 150 },
                      { label: "₹300", value: 300 },
                    ]
                  : [
                      { label: "₹24,000", value: 24000 },
                      { label: "₹52,000", value: 52000 },
                    ]
              }
            />

            <HybridInput
              label={inputs.instrument === "options" ? "Option Sell Premium Price" : "Futures Sell Price"}
              value={inputs.sellPrice}
              onChange={(val) => setInputs((prev) => ({ ...prev, sellPrice: val }))}
              min={0.05}
              max={100000}
              step={0.5}
              prefix="₹"
              quickChips={
                inputs.instrument === "options"
                  ? [
                      { label: "₹100", value: 100 },
                      { label: "₹200", value: 200 },
                      { label: "₹400", value: 400 },
                    ]
                  : [
                      { label: "₹24,100", value: 24100 },
                      { label: "₹52,250", value: 52250 },
                    ]
              }
            />

            <HybridInput
              label="Quantity (Total Shares / Units)"
              value={inputs.quantity}
              onChange={(val) => setInputs((prev) => ({ ...prev, quantity: val }))}
              min={1}
              max={50000}
              step={25}
              suffix=" qty"
              quickChips={[
                { label: "50 (1 lot Nifty)", value: 50 },
                { label: "100 (2 lots)", value: 100 },
                { label: "250 (5 lots)", value: 250 },
                { label: "500 (10 lots)", value: 500 },
              ]}
            />

            <HybridInput
              label="Brokerage per Executed Order"
              value={inputs.brokeragePerOrder}
              onChange={(val) => setInputs((prev) => ({ ...prev, brokeragePerOrder: val }))}
              min={0}
              max={100}
              step={5}
              prefix="₹"
              hint="Standard discount broker rate is ₹20 per order (₹40 round trip)."
              quickChips={[
                { label: "₹0 (Zero Brokerage)", value: 0 },
                { label: "₹10", value: 10 },
                { label: "₹20 (Standard)", value: 20 },
              ]}
            />
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-6 space-y-6">
          <ResultHero
            label="Net Profit / Loss (In Pocket)"
            value={result.netPnl}
            breakdown={[
              { label: "Gross P&L", value: result.grossPnl, color: "blue" },
              { label: "Total Taxes & Brokerage", value: -result.totalCharges, color: "blue" },
              { label: "Break-Even Exit Price", value: result.breakevenSellPrice, color: "green" },
              { label: "Net P&L", value: result.netPnl, color: "green" },
            ]}
          />

          {/* Break-Even Callout Banner */}
          <div className="surface-card p-5 rounded-2xl border-2 border-primary/20 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Break-Even Analysis
              </p>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                Target Exit Price: ₹{result.breakevenSellPrice.toFixed(2)} (+{result.pointsToBreakeven.toFixed(2)} pts)
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                You need a minimum price movement of{" "}
                <strong className="text-foreground">+{result.pointsToBreakeven.toFixed(2)} points</strong> just to cover all round-trip brokerage, STT, exchange turnover fees, and 18% GST.
              </p>
            </div>
          </div>

          {/* Chart & Charges Breakdown */}
          <div className="surface-card p-6 space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Trade P&L vs Statutory Charges
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Detailed breakdown of SEBI, STT, Exchange fees, and GST impact
            </p>
            <div className="h-[340px]">
              <FnOBrokerageChart
                grossPnl={result.grossPnl}
                totalCharges={result.totalCharges}
                netPnl={result.netPnl}
                charges={result.charges}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InsightCard
              type={result.isProfit ? "good" : "warning"}
              icon={result.isProfit ? "📈" : "⚠️"}
              title={`Return: ${
                result.buyTurnover > 0
                  ? `${((result.netPnl / result.buyTurnover) * 100).toFixed(2)}%`
                  : "0%"
              }`}
              subtitle="Net gain relative to invested capital"
            />
            <InsightCard
              type="info"
              icon="⚡"
              title={`Turnover: ${formatINR(result.totalTurnover)}`}
              subtitle="Combined Buy + Sell value"
            />
          </div>
        </div>
      </div>
    </>
  );
}
