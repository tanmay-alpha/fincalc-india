"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import InsightCard from "@/components/ui/InsightCard";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcOptionPayoff, getOptionPresetLegs } from "@/lib/math";
import type { OptionLeg, OptionStrategyPreset } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import { Plus, Trash2 } from "lucide-react";

const OptionPayoffChart = dynamic(
  () => import("@/components/calculators/option-payoff/OptionPayoffChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const PRESETS: Array<{ id: OptionStrategyPreset; label: string; desc: string }> = [
  { id: "bull_call_spread", label: "Bull Call Spread", desc: "Moderately Bullish (Capped Risk)" },
  { id: "bear_put_spread", label: "Bear Put Spread", desc: "Moderately Bearish (Capped Risk)" },
  { id: "long_straddle", label: "Long Straddle", desc: "Big Move / High Volatility" },
  { id: "long_strangle", label: "Long Strangle", desc: "Very Big Move / Low Cost" },
  { id: "iron_condor", label: "Iron Condor", desc: "Range-Bound / Neutral Theta Decay" },
  { id: "covered_call", label: "Covered Call", desc: "Income Generation on Long Holding" },
];

export default function OptionPayoffCalculator() {
  const [mounted, setMounted] = useState(false);
  const [underlyingPrice, setUnderlyingPrice] = useState(24000);
  const [lotSize, setLotSize] = useState(50); // Nifty lot size
  const [selectedPreset, setSelectedPreset] = useState<OptionStrategyPreset>("bull_call_spread");
  const [legs, setLegs] = useState<OptionLeg[]>(() =>
    getOptionPresetLegs("bull_call_spread", 24000)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectPreset = (preset: OptionStrategyPreset) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      setLegs(getOptionPresetLegs(preset, underlyingPrice));
    }
  };

  const handleAddLeg = () => {
    setSelectedPreset("custom");
    const newLeg: OptionLeg = {
      id: Date.now().toString(),
      name: `Leg ${legs.length + 1}`,
      type: "call",
      position: "long",
      strike: underlyingPrice,
      premium: 100,
      lots: 1,
    };
    setLegs((prev) => [...prev, newLeg]);
  };

  const handleRemoveLeg = (id?: string) => {
    setSelectedPreset("custom");
    setLegs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateLeg = (id: string | undefined, updates: Partial<OptionLeg>) => {
    setSelectedPreset("custom");
    setLegs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const debouncedUnderlying = useDebounce(underlyingPrice, 150);
  const debouncedLegs = useDebounce(legs, 150);

  const result = useMemo(() => {
    return calcOptionPayoff({
      legs: debouncedLegs,
      lotSize,
      underlyingPrice: debouncedUnderlying,
    });
  }, [debouncedLegs, lotSize, debouncedUnderlying]);

  if (!mounted) return <CalcPageSkeleton />;

  const displayMaxProfit =
    result.maxProfit === "Unlimited"
      ? "Unlimited Upside"
      : formatINR(result.maxProfit);

  const displayMaxLoss =
    result.maxLoss === "Unlimited"
      ? "Unlimited Downside"
      : formatINR(Math.abs(result.maxLoss));

  return (
    <>
      <StickyResultBar
        label={result.isNetCredit ? "Net Premium Received" : "Net Premium Paid"}
        value={Math.abs(result.netPremiumPaidOrReceived)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Strategy Builder Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Preset Selector */}
          <div className="surface-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Strategy Preset
              </label>
              <span className="text-xs text-primary font-medium">
                {legs.length} Active {legs.length === 1 ? "Leg" : "Legs"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={clsx(
                    "p-2.5 rounded-xl border text-left text-xs transition-all",
                    selectedPreset === p.id
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  <p className="font-semibold truncate">{p.label}</p>
                  <p className="text-[10px] opacity-75 truncate">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Underlying & Lot Size Setup */}
          <div className="surface-card p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Underlying Spot Price (Nifty/Stock)"
                value={underlyingPrice}
                onChange={(val) => {
                  setUnderlyingPrice(val);
                }}
                min={10}
                max={100000}
                step={50}
                prefix="₹"
                quickChips={[
                  { label: "₹24,000", value: 24000 },
                  { label: "₹24,500", value: 24500 },
                  { label: "₹52,000", value: 52000 },
                ]}
              />

              <HybridInput
                label="Lot Size"
                value={lotSize}
                onChange={setLotSize}
                min={1}
                max={1000}
                step={5}
                suffix=" /lot"
                quickChips={[
                  { label: "25 (BankNifty)", value: 25 },
                  { label: "50 (Nifty 50)", value: 50 },
                  { label: "100", value: 100 },
                ]}
              />
            </div>

            {/* Individual Option Legs Editor */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Option Legs ({legs.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Leg
                </button>
              </div>

              <div className="space-y-3">
                {legs.map((leg, index) => (
                  <div
                    key={leg.id}
                    className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {leg.position.toUpperCase()} {leg.strike} {leg.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Position Buy/Sell toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateLeg(leg.id, {
                              position: leg.position === "long" ? "short" : "long",
                            })
                          }
                          className={clsx(
                            "px-2 py-0.5 rounded text-[11px] font-bold transition-all",
                            leg.position === "long"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          )}
                        >
                          {leg.position === "long" ? "BUY (Long)" : "SELL (Short)"}
                        </button>

                        {/* Call/Put toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateLeg(leg.id, {
                              type: leg.type === "call" ? "put" : "call",
                            })
                          }
                          className="px-2 py-0.5 rounded bg-muted text-[11px] font-semibold text-foreground border border-border"
                        >
                          {leg.type.toUpperCase()}
                        </button>

                        {legs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLeg(leg.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove leg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Strike Price
                        </label>
                        <input
                          type="number"
                          step={50}
                          value={leg.strike}
                          onChange={(e) =>
                            handleUpdateLeg(leg.id, { strike: Number(e.target.value) })
                          }
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Premium (₹)
                        </label>
                        <input
                          type="number"
                          step={0.5}
                          value={leg.premium}
                          onChange={(e) =>
                            handleUpdateLeg(leg.id, { premium: Number(e.target.value) })
                          }
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Lots
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={leg.lots}
                          onChange={(e) =>
                            handleUpdateLeg(leg.id, { lots: Number(e.target.value) })
                          }
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Payoff Graph & Summary Column */}
        <div className="lg:col-span-6 space-y-6">
          <ResultHero
            label={result.isNetCredit ? "Max Profit Potential" : "Max Profit Potential"}
            value={typeof result.maxProfit === "number" ? result.maxProfit : 0}
            breakdown={[
              { label: "Max Profit", value: typeof result.maxProfit === "number" ? result.maxProfit : 0, color: "green" },
              { label: "Max Loss", value: typeof result.maxLoss === "number" ? Math.abs(result.maxLoss) : 0, color: "blue" },
              { label: "Net Premium Outlay", value: Math.abs(result.netPremiumPaidOrReceived), color: "blue" },
              { label: "Risk : Reward", value: 1, color: "green" },
            ]}
          />

          {/* Strategy Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="surface-card p-3 text-center">
              <span className="text-[11px] text-muted-foreground block">Max Profit</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {displayMaxProfit}
              </span>
            </div>
            <div className="surface-card p-3 text-center">
              <span className="text-[11px] text-muted-foreground block">Max Loss</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {displayMaxLoss}
              </span>
            </div>
            <div className="surface-card p-3 text-center">
              <span className="text-[11px] text-muted-foreground block">Breakeven(s)</span>
              <span className="text-xs font-bold text-foreground truncate block">
                {result.breakevens.length > 0
                  ? result.breakevens.map((b) => `₹${b}`).join(", ")
                  : "None"}
              </span>
            </div>
          </div>

          {/* Interactive Payoff Chart */}
          <div className="surface-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Payoff at Expiry Curve
              </h3>
              <span className="text-xs font-semibold text-primary">
                Spot: ₹{underlyingPrice}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Green represents in-the-money profit zone; Red represents loss zone.
            </p>
            <div className="h-[320px]">
              <OptionPayoffChart
                chartData={result.chartData}
                underlyingPrice={underlyingPrice}
                breakevens={result.breakevens}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InsightCard
              type="info"
              icon="⚖️"
              title={`Risk : Reward (${result.riskRewardRatio})`}
              subtitle="Max upside potential vs downside risk"
            />
            <InsightCard
              type="good"
              icon="💰"
              title={`${result.isNetCredit ? "Net Credit: " : "Net Debit: "}${formatINR(Math.abs(result.netPremiumPaidOrReceived))}`}
              subtitle={result.isNetCredit ? "Credited to your trading margin" : "Upfront capital required to enter"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
