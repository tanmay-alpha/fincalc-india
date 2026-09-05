"use client";


import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";import { useMemo, useState, useEffect } from "react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import ShareButton from "@/components/ui/ShareButton";
import PositionSizeVisualizer from "@/components/calculators/position-size/PositionSizeVisualizer";
import { calcPositionSize } from "@/lib/math";
import type { PositionSizeInput } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
} from "lucide-react";

export default function PositionSizeCalculator() {
  const mounted = useIsMounted();
  const [capital, setCapital] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(500);
  const [stopLossPrice, setStopLossPrice] = useState(485);
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [tradeDirection, setTradeDirection] = useState<"auto" | "long" | "short">("auto");
  const [leverageMultiplier, setLeverageMultiplier] = useState(1);
  const [shareId, setShareId] = useState<string | null>(null);

  const inputs: PositionSizeInput = useMemo(
    () => ({
      capital,
      riskPercent,
      entryPrice,
      stopLossPrice,
      riskRewardRatio,
      tradeDirection,
      leverageMultiplier,
    }),
    [
      capital,
      riskPercent,
      entryPrice,
      stopLossPrice,
      riskRewardRatio,
      tradeDirection,
      leverageMultiplier,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcPositionSize(debouncedInputs);
  }, [debouncedInputs]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "position-size",
        name: "Position Size & Risk Calculator",
        route: "/position-size",
        category: "trading",
      });
    }
  }, [mounted]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Position Size (Shares)" value={result.quantity} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Capital & Risk Parameters */}
          <div className="surface-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Capital & Risk Allocation</h3>
              <span className="text-xs text-muted-foreground font-medium">
                Max Loss: {formatINR(result.maxRiskAmount)}
              </span>
            </div>

            <HybridInput
              label="Total Trading Capital"
              value={capital}
              onChange={setCapital}
              min={1000}
              max={10000000}
              step={10000}
              prefix="₹"
            />

            {/* Quick Capital Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[25000, 50000, 100000, 200000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCapital(amt)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border bg-muted/50 hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <HybridInput
                label="Risk Per Trade (% of Capital)"
                value={riskPercent}
                onChange={setRiskPercent}
                min={0.1}
                max={10}
                step={0.1}
                suffix="%"
              />

              {/* Risk % Presets */}
              <div className="flex gap-2">
                {[0.5, 1, 1.5, 2, 3].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskPercent(r)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md border transition-colors font-medium",
                      riskPercent === r
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Execution Inputs */}
          <div className="surface-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Trade Setup & Price Levels</h3>
              <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setTradeDirection("auto")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    tradeDirection === "auto" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                  )}
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setTradeDirection("long")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    tradeDirection === "long" ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground"
                  )}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setTradeDirection("short")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    tradeDirection === "short" ? "bg-rose-600 text-white font-bold" : "text-muted-foreground"
                  )}
                >
                  Short
                </button>
              </div>
            </div>

            <HybridInput
              label="Entry Price"
              value={entryPrice}
              onChange={setEntryPrice}
              min={0.1}
              max={100000}
              step={1}
              prefix="₹"
            />

            <HybridInput
              label="Stop-Loss Price"
              value={stopLossPrice}
              onChange={setStopLossPrice}
              min={0.1}
              max={100000}
              step={1}
              prefix="₹"
            />

            <div className="space-y-2 pt-2 border-t border-border/60">
              <HybridInput
                label="Target Risk-Reward Ratio (1 : X)"
                value={riskRewardRatio}
                onChange={setRiskRewardRatio}
                min={0.5}
                max={10}
                step={0.1}
                prefix="1 :"
              />

              <div className="flex gap-2">
                {[1.5, 2, 2.5, 3, 4].map((rr) => (
                  <button
                    key={rr}
                    type="button"
                    onClick={() => setRiskRewardRatio(rr)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md border transition-colors font-medium",
                      riskRewardRatio === rr
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    1:{rr}
                  </button>
                ))}
              </div>
            </div>

            {/* Intraday Leverage Multiplier */}
            <div className="pt-2 border-t border-border/60">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Intraday MIS Leverage / Margin
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "1x (Cash/CNC)", value: 1 },
                  { label: "2x Margin", value: 2 },
                  { label: "4x MIS", value: 4 },
                  { label: "5x MIS (Max)", value: 5 },
                ].map((lev) => (
                  <button
                    key={lev.value}
                    type="button"
                    onClick={() => setLeverageMultiplier(lev.value)}
                    className={cn(
                      "py-2 px-1 text-center text-xs rounded-lg border transition-all",
                      leverageMultiplier === lev.value
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {lev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Card */}
          {result.isValid ? (
            <ResultHero
              label="Recommended Position Size"
              value={result.quantity}
              formatValue={(val) => `${Math.round(val).toLocaleString("en-IN")} Shares`}
              breakdown={[
                { label: "Position Value", value: result.positionValue, color: "blue" },
                { label: "Potential Profit", value: result.potentialProfit, color: "green" },
                { label: "Actual Rupee Risk", value: result.actualRiskAmount, color: "red" },
              ]}
            />
          ) : (
            <div className="surface-card p-6 border-2 border-destructive/50 bg-destructive/5 space-y-2">
              <div className="flex items-center gap-2 text-destructive font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Invalid Trade Setup</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {result.validationError}
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          {result.isValid && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="surface-card p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Target Price</div>
                <div className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 mt-0.5">
                  ₹{result.targetPrice.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                  +{formatINR(result.potentialProfit)}
                </div>
              </div>

              <div className="surface-card p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Stop Loss</div>
                <div className="text-sm font-extrabold text-destructive mt-0.5">
                  ₹{result.stopLossPrice.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-destructive font-medium">
                  -{formatINR(result.actualRiskAmount)}
                </div>
              </div>

              <div className="surface-card p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Risk / Share</div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  ₹{result.riskPerShare}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {((result.riskPerShare / result.entryPrice) * 100).toFixed(1)}% move
                </div>
              </div>

              <div className="surface-card p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Risk : Reward</div>
                <div className="text-sm font-bold text-primary mt-0.5">
                  1 : {result.riskRewardRatio}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {result.tradeDirection.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Warnings Banner */}
          {result.warning && (
            <div className="surface-card p-4 rounded-xl border border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/20 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {result.warning}
              </p>
            </div>
          )}

          {/* Visual Ladder Payoff */}
          {result.isValid && (
            <PositionSizeVisualizer
              entryPrice={result.entryPrice}
              stopLossPrice={result.stopLossPrice}
              targetPrice={result.targetPrice}
              tradeDirection={result.tradeDirection}
              actualRiskAmount={result.actualRiskAmount}
              potentialProfit={result.potentialProfit}
              quantity={result.quantity}
            />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <SaveCalculationButton
              calcType="Position Size"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: {
                  quantity: result.quantity,
                  positionValue: result.positionValue,
                  actualRisk: result.actualRiskAmount,
                  targetPrice: result.targetPrice,
                },
              }}
              onSaved={setShareId}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>
      </div>
    </>
  );
}
