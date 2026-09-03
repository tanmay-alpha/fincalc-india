"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcFnOBreakeven } from "@/lib/math";
import type { FnOInstrument, FnOTaxYear } from "@/lib/math";
import { useDebounce } from "@/hooks/useDebounce";
import { Target, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
  quantity: 100, // 2 lots
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

  const isProfitable = result.netPnl >= 0;

  return (
    <>
      <StickyResultBar
        label="Net P&L"
        value={result.netPnl}
        prefix="₹"
        color={isProfitable ? "green" : "red"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ────── INPUT CONTROLS COLUMN (~45%) ────── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Regulatory Tax Year & STT Toggle */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                Tax Year 2026–27 STT
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                STT: {inputs.instrument === "options" ? "0.15% on premium" : "0.05% on turnover"}
              </p>
            </div>

            <div className="flex rounded-lg border border-border bg-card p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, taxYear: "tax_year_2026_27" }))}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all",
                  inputs.taxYear === "tax_year_2026_27"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                2026–27
              </button>
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, taxYear: "pre_april_2026" }))}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all",
                  inputs.taxYear === "pre_april_2026"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Pre-2026
              </button>
            </div>
          </div>

          {/* Instrument Selector */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Derivative Instrument
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
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
                className={cn(
                  "p-3 rounded-xl border text-center text-xs font-bold transition-all",
                  inputs.instrument === "options"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                Options ({inputs.taxYear === "tax_year_2026_27" ? "0.15% STT" : "0.10%"})
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
                className={cn(
                  "p-3 rounded-xl border text-center text-xs font-bold transition-all",
                  inputs.instrument === "futures"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                Futures ({inputs.taxYear === "tax_year_2026_27" ? "0.05% STT" : "0.02%"})
              </button>
            </div>
          </div>

          {/* Trade Parameters Form */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Trade Entry & Execution
              </h2>
            </div>

            <HybridInput
              label={inputs.instrument === "options" ? "Buy Premium Price" : "Futures Buy Price"}
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
                      { label: "₹24,500", value: 24500 },
                    ]
              }
            />

            <HybridInput
              label={inputs.instrument === "options" ? "Sell Premium Price" : "Futures Sell Price"}
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
                      { label: "₹210", value: 210 },
                      { label: "₹400", value: 400 },
                    ]
                  : [
                      { label: "₹24,150", value: 24150 },
                      { label: "₹24,800", value: 24800 },
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
              suffix=" units"
              quickChips={[
                { label: "50 (1 Lot)", value: 50 },
                { label: "100 (2 Lots)", value: 100 },
                { label: "250 (5 Lots)", value: 250 },
                { label: "500 (10 Lots)", value: 500 },
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
              hint="Discount brokers charge flat ₹20/order (₹40 round trip)"
              quickChips={[
                { label: "₹0", value: 0 },
                { label: "₹10", value: 10 },
                { label: "₹20", value: 20 },
              ]}
            />
          </div>
        </div>

        {/* ────── RESULTS & ITEMIZED CHARGES COLUMN (~55%) ────── */}
        <div className="lg:col-span-7 space-y-6" data-result-hero>
          {/* Net P&L Hero Card */}
          <ResultHero
            label="Net Profit / Loss (After All Charges)"
            value={result.netPnl}
            tone={isProfitable ? "positive" : "negative"}
            prefix="₹"
            formatValue={(val) => val.toLocaleString("en-IN")}
            interpretation={`On a gross turnover of ₹${result.totalTurnover.toLocaleString("en-IN")}, total statutory charges & brokerage amount to ₹${result.totalCharges.toFixed(2)}, leaving a net ${isProfitable ? "profit" : "loss"} of ₹${result.netPnl.toLocaleString("en-IN")}.`}
            secondaryMetrics={[
              {
                label: "Gross P&L",
                value: `₹${result.grossPnl.toLocaleString("en-IN")}`,
              },
              {
                label: "Total Charges",
                value: `₹${result.totalCharges.toFixed(2)}`,
              },
              {
                label: "Break-Even Sell",
                value: `₹${result.breakevenSellPrice.toFixed(2)}`,
              },
              {
                label: "Points to Breakeven",
                value: `+${result.pointsToBreakeven.toFixed(2)} pts`,
              },
            ]}
          />

          {/* Breakeven Target Banner */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 sm:p-5 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Break-Even Threshold
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                Target Exit Price:{" "}
                <span className="font-mono text-primary font-bold">
                  ₹{result.breakevenSellPrice.toFixed(2)}
                </span>{" "}
                (+{result.pointsToBreakeven.toFixed(2)} pts over entry)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You must exit at or above this price to recover all exchange fees, STT, and broker commissions.
              </p>
            </div>
          </div>

          {/* Itemized Charges Breakdown Table (Zerodha Style) */}
          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Itemized Charge & Tax Breakdown
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                Turnover: ₹{result.totalTurnover.toLocaleString("en-IN")}
              </span>
            </div>

            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Itemized Charges Breakdown Table"
            >
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold uppercase text-[11px] tracking-wider">
                      Item / Statutory Component
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Effective Rate
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      Brokerage (Buy + Sell Orders)
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      Flat ₹{inputs.brokeragePerOrder}/order
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      ₹{result.charges.brokerage.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      Securities Transaction Tax (STT)
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {inputs.instrument === "options" ? "0.15% sell premium" : "0.05% sell turnover"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                      ₹{result.charges.stt.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      Exchange Turnover Charges (NSE/BSE)
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {inputs.instrument === "options" ? "0.03503%" : "0.00173%"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      ₹{result.charges.exchangeCharges.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      GST (18% on Brokerage, Exchange & SEBI)
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      18.00%
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      ₹{result.charges.gst.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      SEBI Turnover Fee
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      ₹10 / Crore
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      ₹{result.charges.sebiFees.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-foreground font-medium">
                      Stamp Duty (Buy Side)
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {inputs.instrument === "options" ? "0.003%" : "0.002%"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      ₹{result.charges.stampDuty.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="bg-muted font-bold text-foreground">
                    <td className="px-4 py-3" colSpan={2}>
                      Total Statutory Taxes & Brokerage
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 dark:text-rose-400 font-extrabold tabular-nums">
                      ₹{result.totalCharges.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Charges Visualization Chart */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Charge Composition Visualizer
                </h3>
                <p className="text-xs text-muted-foreground">
                  Proportion of Brokerage vs Government Taxes
                </p>
              </div>
            </div>
            <div className="h-[260px]">
              <FnOBrokerageChart
                grossPnl={result.grossPnl}
                totalCharges={result.totalCharges}
                netPnl={result.netPnl}
                charges={result.charges}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
