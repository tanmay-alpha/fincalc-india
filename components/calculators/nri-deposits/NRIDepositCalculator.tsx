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
import { calcNRIDepositReturns } from "@/lib/math";
import type { NRIDepositInput } from "@/lib/math";
import { getNRIDepositInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Building, Sparkles } from "lucide-react";

const NRIDepositChart = dynamic(
  () => import("@/components/calculators/nri-deposits/NRIDepositChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function NRIDepositCalculator() {
  const [mounted, setMounted] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000000); // 10 Lakhs
  const [tenureMonths, setTenureMonths] = useState(36); // 3 years
  const [nreInterestRatePercent, setNreInterestRatePercent] = useState(7.1);
  const [nroInterestRatePercent, setNroInterestRatePercent] = useState(7.3);
  const [fcnrInterestRatePercent, setFcnrInterestRatePercent] = useState(5.5);
  const [nroTdsRatePercent, setNroTdsRatePercent] = useState(31.2);
  const [compoundingFrequency, setCompoundingFrequency] = useState<"quarterly" | "annual">("quarterly");
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: NRIDepositInput = useMemo(
    () => ({
      depositAmount,
      tenureMonths,
      nreInterestRatePercent,
      nroInterestRatePercent,
      fcnrInterestRatePercent,
      nroTdsRatePercent,
      compoundingFrequency,
    }),
    [
      depositAmount,
      tenureMonths,
      nreInterestRatePercent,
      nroInterestRatePercent,
      fcnrInterestRatePercent,
      nroTdsRatePercent,
      compoundingFrequency,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcNRIDepositReturns(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getNRIDepositInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Deposit Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Building className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Deposit Details & Comparison Rates
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Deposit Principal (INR Equivalent)"
                hint="Amount placed in fixed deposit"
                value={depositAmount}
                onChange={setDepositAmount}
                min={50000}
                max={50000000}
                step={50000}
                prefix="₹"
              />

              <HybridInput
                label="Tenure (Months)"
                hint="Duration of fixed deposit"
                value={tenureMonths}
                onChange={setTenureMonths}
                min={12}
                max={120}
                step={6}
                suffix="M"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <HybridInput
                label="NRE Rate (% p.a.)"
                hint="100% tax-free in India"
                value={nreInterestRatePercent}
                onChange={setNreInterestRatePercent}
                min={3}
                max={12}
                step={0.1}
                suffix="%"
              />

              <HybridInput
                label="NRO Rate (% p.a.)"
                hint="Subject to Indian TDS"
                value={nroInterestRatePercent}
                onChange={setNroInterestRatePercent}
                min={3}
                max={12}
                step={0.1}
                suffix="%"
              />

              <HybridInput
                label="FCNR Rate (% p.a.)"
                hint="Foreign currency FD rate"
                value={fcnrInterestRatePercent}
                onChange={setFcnrInterestRatePercent}
                min={1}
                max={10}
                step={0.1}
                suffix="%"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
              <HybridInput
                label="NRO TDS Tax Rate (%)"
                hint="Standard TDS: 30% + 4% cess = 31.2%"
                value={nroTdsRatePercent}
                onChange={setNroTdsRatePercent}
                min={0}
                max={35}
                step={0.1}
                suffix="%"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Compounding Frequency
                </label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value as "quarterly" | "annual")}
                  className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="quarterly">Quarterly Compounding (Standard Indian FD)</option>
                  <option value="annual">Annual Compounding</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="NRE Deposit Maturity (100% Tax-Free)"
            value={result.nreResult.maturityAmount}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Principal Invested", value: result.nreResult.principal, color: "blue" },
              { label: "Tax-Free Interest Earned", value: result.nreResult.interestEarnedPreTax, color: "green" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">NRE Post-Tax Yield</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {result.nreResult.effectivePostTaxAnnualYield}% p.a.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">NRO Net Maturity</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {formatINR(result.nroResult.maturityAmount)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">NRO TDS Deducted</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatINR(result.nroResult.taxDeducted)}
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Side-by-Side NRE vs NRO vs FCNR Maturity Comparison
            </h3>
            <div className="h-56">
              <NRIDepositChart
                nreResult={result.nreResult}
                nroResult={result.nroResult}
                fcnrResult={result.fcnrResult}
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
              calcType="nre-nro-fcnr"
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
        label="NRE Maturity"
        value={result.nreResult.maturityAmount}
      />
    </div>
  );
}
