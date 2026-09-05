"use client";


import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import ShareButton from "@/components/ui/ShareButton";
import InsightCard from "@/components/ui/InsightCard";
import { calcDCF } from "@/lib/math";
import type { DcfInput } from "@/lib/math";
import { getDCFInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { SlidersHorizontal, ShieldAlert, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DcfChart = dynamic(
  () => import("@/components/calculators/dcf/DcfChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function DcfCalculator() {
  const mounted = useIsMounted();
  const [cashFlowYear1, setCashFlowYear1] = useState(50000000); // 5 Cr
  const [forecastYears, setForecastYears] = useState(5);
  const [growthRateYears1to5, setGrowthRateYears1to5] = useState(15);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(4.5);
  const [discountRate, setDiscountRate] = useState(11.5);
  const [totalDebt, setTotalDebt] = useState(20000000); // 2 Cr
  const [cashAndEquivalents, setCashAndEquivalents] = useState(10000000); // 1 Cr
  const [sharesOutstanding, setSharesOutstanding] = useState(1000000); // 10 Lakh shares
  const [shareId, setShareId] = useState<string | null>(null);

  const fcfProjections = useMemo(() => {
    const list: number[] = [];
    let current = cashFlowYear1;
    for (let i = 0; i < forecastYears; i++) {
      if (i === 0) {
        list.push(current);
      } else {
        current = current * (1 + growthRateYears1to5 / 100);
        list.push(current);
      }
    }
    return list;
  }, [cashFlowYear1, growthRateYears1to5, forecastYears]);

  const inputs: DcfInput = useMemo(
    () => ({
      fcfProjections,
      terminalGrowthRate,
      discountRate,
      sharesOutstanding,
      netDebt: totalDebt - cashAndEquivalents,
    }),
    [
      fcfProjections,
      terminalGrowthRate,
      discountRate,
      sharesOutstanding,
      totalDebt,
      cashAndEquivalents,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcDCF(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getDCFInsights(result), [result]);

  // Sensitivity Matrix Calculations (Discount Rate vs Terminal Growth)
  const sensitivityData = useMemo(() => {
    if (!result.isValid) return null;
    const discountRates = [
      Math.max(5, discountRate - 1.5),
      discountRate,
      discountRate + 1.5,
    ];
    const terminalRates = [
      Math.max(1, terminalGrowthRate - 0.5),
      terminalGrowthRate,
      terminalGrowthRate + 0.5,
    ];

    return discountRates.map((dRate) => {
      return {
        discountRate: dRate,
        values: terminalRates.map((tRate) => {
          if (dRate <= tRate) return null;
          const matrixRes = calcDCF({
            ...debouncedInputs,
            discountRate: dRate,
            terminalGrowthRate: tRate,
          });
          return matrixRes.isValid ? matrixRes.intrinsicValuePerShare : null;
        }),
      };
    });
  }, [debouncedInputs, discountRate, terminalGrowthRate, result.isValid]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "dcf-valuation",
        name: "DCF Valuation Calculator",
        route: "/dcf-valuation",
        category: "corporate",
      });
    }
  }, [mounted]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar
        label="Fair Value / Share"
        value={result.intrinsicValuePerShare}
        prefix="₹"
        color="blue"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ────── FINANCIAL MODEL ASSUMPTIONS (~45%) ────── */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Explicit Cash Flow Forecast
              </h2>
            </div>

            <HybridInput
              label="Starting Free Cash Flow (FCF Year 1)"
              hint="Projected free cash flow to firm (FCFF) in base forecast year"
              value={cashFlowYear1}
              onChange={setCashFlowYear1}
              min={100000}
              max={10000000000}
              step={500000}
              prefix="₹"
              quickChips={[
                { label: "₹1 Cr", value: 10000000 },
                { label: "₹5 Cr", value: 50000000 },
                { label: "₹25 Cr", value: 250000000 },
                { label: "₹100 Cr", value: 1000000000 },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <HybridInput
                label="Forecast Period"
                value={forecastYears}
                onChange={setForecastYears}
                min={3}
                max={15}
                step={1}
                suffix=" Years"
              />

              <HybridInput
                label="FCF Growth Rate"
                value={growthRateYears1to5}
                onChange={setGrowthRateYears1to5}
                min={-20}
                max={100}
                step={0.5}
                suffix="% p.a."
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Cost of Capital & Terminal Stage
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <HybridInput
                label="Discount Rate (WACC)"
                hint="Cost of Capital"
                value={discountRate}
                onChange={setDiscountRate}
                min={5}
                max={30}
                step={0.25}
                suffix="%"
              />

              <HybridInput
                label="Terminal Growth Rate"
                hint="Long-term GDP rate"
                value={terminalGrowthRate}
                onChange={setTerminalGrowthRate}
                min={1}
                max={10}
                step={0.25}
                suffix="%"
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Balance Sheet & Share Count Bridge
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <HybridInput
                label="Total Debt"
                value={totalDebt}
                onChange={setTotalDebt}
                min={0}
                max={5000000000}
                step={500000}
                prefix="₹"
              />

              <HybridInput
                label="Cash & Liquid Assets"
                value={cashAndEquivalents}
                onChange={setCashAndEquivalents}
                min={0}
                max={5000000000}
                step={500000}
                prefix="₹"
              />
            </div>

            <HybridInput
              label="Shares Outstanding"
              hint="Diluted total share count for per-share valuation"
              value={sharesOutstanding}
              onChange={setSharesOutstanding}
              min={1000}
              max={1000000000}
              step={10000}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <SaveCalculationButton
              calcType="dcf-valuation"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: result as unknown as Record<string, unknown>,
              }}
              onSaved={(id) => setShareId(id)}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>

        {/* ────── VALUATION RESULTS & SENSITIVITY (~55%) ────── */}
        <div className="lg:col-span-7 space-y-6" data-result-hero>
          {result.isValid ? (
            <>
              {/* Intrinsic Value Hero */}
              <ResultHero
                label="Fair Intrinsic Value Per Share"
                value={result.intrinsicValuePerShare}
                tone="neutral"
                prefix="₹"
                formatValue={(val) => val.toLocaleString("en-IN")}
                interpretation={`Based on ${forecastYears}-year projected cash flows discounted at ${discountRate}% WACC and a perpetual terminal growth rate of ${terminalGrowthRate}%, the fair equity value per share is estimated at ₹${result.intrinsicValuePerShare.toLocaleString("en-IN")}.`}
                secondaryMetrics={[
                  {
                    label: "Enterprise Value",
                    value: formatINR(result.enterpriseValue),
                  },
                  {
                    label: "Equity Value",
                    value: formatINR(result.equityValue),
                  },
                  {
                    label: "PV Explicit FCF",
                    value: formatINR(result.presentValueExplicitFcf),
                  },
                  {
                    label: "PV Terminal Value",
                    value: formatINR(result.presentValueTerminalValue),
                  },
                ]}
                breakdown={[
                  {
                    label: "PV Explicit FCF",
                    value: result.presentValueExplicitFcf,
                    color: "blue",
                    formattedValue: formatINR(result.presentValueExplicitFcf),
                  },
                  {
                    label: "PV Terminal Value",
                    value: result.presentValueTerminalValue,
                    color: "green",
                    formattedValue: formatINR(result.presentValueTerminalValue),
                  },
                ]}
              />

              {/* 2D Valuation Sensitivity Matrix */}
              {sensitivityData && (
                <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-border/60">
                    <h3 className="text-sm font-bold text-foreground">
                      Valuation Sensitivity Matrix (Fair Value / Share in ₹)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Discount Rate (WACC) vs Terminal Growth Rate
                    </p>
                  </div>

                  <div
                    className="overflow-x-auto"
                    tabIndex={0}
                    role="region"
                    aria-label="Valuation Sensitivity Matrix"
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                          <th className="px-4 py-2.5 text-left font-semibold">
                            WACC \ Terminal g
                          </th>
                          <th className="px-4 py-2.5 text-center font-semibold">
                            {(terminalGrowthRate - 0.5).toFixed(1)}%
                          </th>
                          <th className="px-4 py-2.5 text-center font-semibold text-primary">
                            {terminalGrowthRate.toFixed(1)}% (Base)
                          </th>
                          <th className="px-4 py-2.5 text-center font-semibold">
                            {(terminalGrowthRate + 0.5).toFixed(1)}%
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {sensitivityData.map((row, idx) => {
                          const isBaseWacc = row.discountRate === discountRate;
                          return (
                            <tr
                              key={idx}
                              className={cn(
                                "hover:bg-muted/30 transition-colors",
                                isBaseWacc && "bg-primary/5 font-semibold"
                              )}
                            >
                              <td className="px-4 py-2.5 text-muted-foreground font-mono">
                                {row.discountRate.toFixed(1)}% {isBaseWacc && "(Base)"}
                              </td>
                              {row.values.map((val, cIdx) => {
                                const isExactBase = isBaseWacc && cIdx === 1;
                                return (
                                  <td
                                    key={cIdx}
                                    className={cn(
                                      "px-4 py-2.5 text-center tabular-nums font-mono",
                                      isExactBase
                                        ? "text-primary font-bold bg-primary/10 rounded"
                                        : "text-foreground/90"
                                    )}
                                  >
                                    {val ? `₹${val.toLocaleString("en-IN")}` : "N/A"}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Chart Card */}
              <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Cash Flow Trajectory (Explicit vs Discounted)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Nominal Free Cash Flow vs Present Value at {discountRate}% WACC
                    </p>
                  </div>
                  <BarChart2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="h-[260px]">
                  <DcfChart yearlyBreakdown={result.yearlyBreakdown} />
                </div>
              </div>

              {/* Analytical Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.map((item, idx) => (
                  <InsightCard key={idx} {...item} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-warning mx-auto" />
              <h3 className="font-semibold text-foreground">Invalid Model Parameters</h3>
              <p className="text-xs text-muted-foreground">{result.errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
