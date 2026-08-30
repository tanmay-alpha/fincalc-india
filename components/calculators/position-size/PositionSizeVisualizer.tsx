"use client";

import { formatINR } from "@/lib/format";

interface PositionSizeVisualizerProps {
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  tradeDirection: "long" | "short";
  actualRiskAmount: number;
  potentialProfit: number;
  quantity: number;
}

export default function PositionSizeVisualizer({
  entryPrice,
  stopLossPrice,
  targetPrice,
  tradeDirection,
  actualRiskAmount,
  potentialProfit,
  quantity,
}: PositionSizeVisualizerProps) {
  const isLong = tradeDirection === "long";

  return (
    <div className="surface-card p-5 space-y-4">
      <h3 className="text-sm font-bold text-foreground">Trade Price Ladder & Payoff</h3>

      {/* Visual Vertical / Horizontal Ladder */}
      <div className="relative p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
        {/* Target Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Target Exit ({isLong ? "Take Profit" : "Cover Short"})
              </div>
              <div className="text-[11px] text-muted-foreground">
                Gain: +{formatINR(potentialProfit)} (+{Math.abs(targetPrice - entryPrice).toFixed(2)}/sh)
              </div>
            </div>
          </div>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            ₹{targetPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Entry Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <div>
              <div className="text-xs font-semibold text-primary">
                Entry Price ({isLong ? "Buy" : "Short Sell"})
              </div>
              <div className="text-[11px] text-muted-foreground">
                {quantity} shares ({isLong ? "Long" : "Short"})
              </div>
            </div>
          </div>
          <span className="text-base font-bold text-foreground">
            ₹{entryPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Stop Loss Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive"></span>
            <div>
              <div className="text-xs font-semibold text-destructive">
                Stop-Loss Price
              </div>
              <div className="text-[11px] text-muted-foreground">
                Loss: -{formatINR(actualRiskAmount)} (-{Math.abs(entryPrice - stopLossPrice).toFixed(2)}/sh)
              </div>
            </div>
          </div>
          <span className="text-base font-extrabold text-destructive">
            ₹{stopLossPrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
