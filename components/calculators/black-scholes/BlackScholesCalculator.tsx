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
import { calcBlackScholes } from "@/lib/math";
import type { BlackScholesInput } from "@/lib/math";
import { getBlackScholesInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { Zap, Activity } from "lucide-react";

const GreeksChart = dynamic(
  () => import("@/components/calculators/black-scholes/GreeksChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function BlackScholesCalculator() {
  const [mounted, setMounted] = useState(false);
  const [spotPrice, setSpotPrice] = useState(24000);
  const [strikePrice, setStrikePrice] = useState(24000);
  const [timeToExpiryDays, setTimeToExpiryDays] = useState(15);
  const [volatilityPercent, setVolatilityPercent] = useState(14.5);
  const [riskFreeRatePercent, setRiskFreeRatePercent] = useState(6.5);
  const [dividendYieldPercent, setDividendYieldPercent] = useState(1.2);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: BlackScholesInput = useMemo(
    () => ({
      spotPrice,
      strikePrice,
      timeToExpiryDays,
      volatilityPercent,
      riskFreeRatePercent,
      dividendYieldPercent,
    }),
    [
      spotPrice,
      strikePrice,
      timeToExpiryDays,
      volatilityPercent,
      riskFreeRatePercent,
      dividendYieldPercent,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcBlackScholes(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getBlackScholesInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Option Pricing Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Underlying & Contract Parameters
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Spot Price (S)"
                hint="Current underlying price (e.g. Nifty Index @ 24,000)"
                value={spotPrice}
                onChange={setSpotPrice}
                min={1}
                max={500000}
                step={50}
                prefix="₹"
              />

              <HybridInput
                label="Strike Price (K)"
                hint="Option contract exercise price"
                value={strikePrice}
                onChange={setStrikePrice}
                min={1}
                max={500000}
                step={50}
                prefix="₹"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Days to Expiry (DTE)"
                hint="Calendar days remaining until settlement"
                value={timeToExpiryDays}
                onChange={setTimeToExpiryDays}
                min={1}
                max={730}
                step={1}
                suffix="d"
              />

              <HybridInput
                label="Implied Volatility (IV %)"
                hint="Annualized volatility (India VIX ~12-16%)"
                value={volatilityPercent}
                onChange={setVolatilityPercent}
                min={1}
                max={300}
                step={0.5}
                suffix="%"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Risk-Free Rate (r % p.a.)"
                hint="Short-term yield (91-Day T-Bill ~6.5%)"
                value={riskFreeRatePercent}
                onChange={setRiskFreeRatePercent}
                min={0}
                max={20}
                step={0.25}
                suffix="%"
              />

              <HybridInput
                label="Dividend Yield (q % p.a.)"
                hint="Continuous annual dividend yield"
                value={dividendYieldPercent}
                onChange={setDividendYieldPercent}
                min={0}
                max={15}
                step={0.1}
                suffix="%"
              />
            </div>
          </div>

          {/* Theoretical Value Breakdown */}
          <div className="pt-2 border-t border-border/40 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Intrinsic vs Time Value Split
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                <span className="font-semibold text-emerald-400 block">Call Option (CE)</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Intrinsic:</span>
                  <span className="font-medium text-foreground">₹{result.callIntrinsic}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Time Value:</span>
                  <span className="font-medium text-foreground">₹{result.callTimeValue}</span>
                </div>
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                <span className="font-semibold text-rose-400 block">Put Option (PE)</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Intrinsic:</span>
                  <span className="font-medium text-foreground">₹{result.putIntrinsic}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Time Value:</span>
                  <span className="font-medium text-foreground">₹{result.putTimeValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Theoretical Call Option (CE) Fair Value"
            value={result.callPrice}
            formatValue={(val) => `₹${val.toFixed(2)}`}
            breakdown={[
              { label: `Intrinsic Value (₹${result.callIntrinsic})`, value: result.callIntrinsic, color: "green" },
              { label: `Time Value (₹${result.callTimeValue})`, value: result.callTimeValue, color: "blue" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Put Price (PE)</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                ₹{result.putPrice}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Call Delta (Δ)</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.callGreeks.delta}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Theta Decay (θ)</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                -₹{Math.abs(result.callGreeks.theta)}/d
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Vega (ν)</p>
              <p className="text-base font-bold text-primary mt-0.5">
                ₹{result.callGreeks.vega}
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Call & Put Option Greeks Comparison
            </h3>
            <div className="h-56">
              <GreeksChart
                callGreeks={result.callGreeks}
                putGreeks={result.putGreeks}
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
              calcType="black-scholes"
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
        label="Call Option (CE)"
        value={result.callPrice}
      />
    </div>
  );
}
