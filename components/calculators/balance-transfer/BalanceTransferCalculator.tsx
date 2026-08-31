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
import { calcBalanceTransfer } from "@/lib/math";
import type { BalanceTransferInput } from "@/lib/math";
import { getBalanceTransferInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowRightLeft } from "lucide-react";

const BalanceTransferChart = dynamic(
  () => import("@/components/calculators/balance-transfer/BalanceTransferChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function BalanceTransferCalculator() {
  const [mounted, setMounted] = useState(false);
  const [currentOutstandingPrincipal, setCurrentOutstandingPrincipal] = useState(5000000); // 50L
  const [currentInterestRate, setCurrentInterestRate] = useState(9.5);
  const [currentRemainingTenureMonths, setCurrentRemainingTenureMonths] = useState(180); // 15 years
  const [newInterestRate, setNewInterestRate] = useState(8.4);
  const [newTenureMonths, setNewTenureMonths] = useState(180);
  const [processingFeeType, setProcessingFeeType] = useState<"percentage" | "flat">("percentage");
  const [processingFeeValue, setProcessingFeeValue] = useState(0.5); // 0.5%
  const [otherSwitchingCharges, setOtherSwitchingCharges] = useState(15000);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: BalanceTransferInput = useMemo(
    () => ({
      currentOutstandingPrincipal,
      currentInterestRate,
      currentRemainingTenureMonths,
      newInterestRate,
      newTenureMonths,
      processingFeeType,
      processingFeeValue,
      otherSwitchingCharges,
    }),
    [
      currentOutstandingPrincipal,
      currentInterestRate,
      currentRemainingTenureMonths,
      newInterestRate,
      newTenureMonths,
      processingFeeType,
      processingFeeValue,
      otherSwitchingCharges,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcBalanceTransfer(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getBalanceTransferInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Loan Transfer Parameters */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Existing & New Loan Rates
            </h2>
          </div>

          <div className="space-y-4">
            <HybridInput
              label="Outstanding Loan Principal"
              hint="Current principal amount remaining to be repaid"
              value={currentOutstandingPrincipal}
              onChange={setCurrentOutstandingPrincipal}
              min={100000}
              max={100000000}
              step={100000}
              prefix="₹"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Current Interest Rate (% p.a.)"
                hint="Existing lender interest rate"
                value={currentInterestRate}
                onChange={setCurrentInterestRate}
                min={5}
                max={20}
                step={0.05}
                suffix="%"
              />

              <HybridInput
                label="Remaining Tenure (Months)"
                hint="Months left on your current home loan"
                value={currentRemainingTenureMonths}
                onChange={setCurrentRemainingTenureMonths}
                min={6}
                max={360}
                step={6}
                suffix="M"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="New Offered Rate (% p.a.)"
                hint="Rate offered by new bank / NBFC"
                value={newInterestRate}
                onChange={setNewInterestRate}
                min={5}
                max={20}
                step={0.05}
                suffix="%"
              />

              <HybridInput
                label="New Loan Tenure (Months)"
                hint="Desired tenure at the new bank"
                value={newTenureMonths}
                onChange={setNewTenureMonths}
                min={6}
                max={360}
                step={6}
                suffix="M"
              />
            </div>

            <div className="pt-2 border-t border-border/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Refinancing & Switching Costs
                </h3>
                <div className="inline-flex rounded-lg p-0.5 bg-muted border border-border text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setProcessingFeeType("percentage");
                      setProcessingFeeValue(0.5);
                    }}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                      processingFeeType === "percentage"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessingFeeType("flat");
                      setProcessingFeeValue(15000);
                    }}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                      processingFeeType === "flat"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Flat Fee (₹)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HybridInput
                  label={`Processing Fee (${processingFeeType === "percentage" ? "%" : "₹"})`}
                  hint="Processing fee charged by new bank"
                  value={processingFeeValue}
                  onChange={setProcessingFeeValue}
                  min={0}
                  max={processingFeeType === "percentage" ? 5 : 100000}
                  step={processingFeeType === "percentage" ? 0.05 : 1000}
                  prefix={processingFeeType === "flat" ? "₹" : undefined}
                  suffix={processingFeeType === "percentage" ? "%" : undefined}
                />

                <HybridInput
                  label="Legal, MODT & Other Fees (₹)"
                  hint="Valuation, legal search, MODT stamp duty"
                  value={otherSwitchingCharges}
                  onChange={setOtherSwitchingCharges}
                  min={0}
                  max={200000}
                  step={1000}
                  prefix="₹"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Net Lifetime Refinancing Savings"
            value={Math.max(0, result.netBenefit)}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Interest Saved", value: Math.max(0, result.grossInterestSavings), color: "green" },
              { label: "Switching Cost", value: result.totalSwitchingCosts, color: "red" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">EMI Reduction</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatINR(Math.max(0, result.monthlyEmiSavings))}/mo
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Breakeven Time</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {result.breakevenMonths} Months
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Switching Cost</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatINR(result.totalSwitchingCosts)}
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              Existing Loan vs Refinanced New Loan
            </h3>
            <div className="h-56">
              <BalanceTransferChart
                currentInterest={result.currentTotalInterestRemaining}
                newInterest={result.newTotalInterest}
                switchingCosts={result.totalSwitchingCosts}
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
              calcType="balance-transfer"
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
        label="Net Savings"
        value={Math.max(0, result.netBenefit)}
      />
    </div>
  );
}
