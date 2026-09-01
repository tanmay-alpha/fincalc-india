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
import { calcLRSTCS } from "@/lib/math";
import type { LrsTcsInput, LrsCategory } from "@/lib/math";
import { getLRSTCSInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Globe, PieChart as PieIcon } from "lucide-react";

const LrsTcsChart = dynamic(
  () => import("@/components/calculators/lrs-tcs/LrsTcsChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function LrsTcsCalculator() {
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState<LrsCategory>("general_investment");
  const [remittanceAmountInr, setRemittanceAmountInr] = useState(1200000); // 12 Lakhs
  const [panAvailable, setPanAvailable] = useState(true);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: LrsTcsInput = useMemo(
    () => ({
      category,
      remittanceAmountInr,
      panAvailable,
    }),
    [category, remittanceAmountInr, panAvailable]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcLRSTCS(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getLRSTCSInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Remittance Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-base">
                LRS Remittance Purpose & Slabs
              </h2>
            </div>
            <span className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
              Section 394 / FA 2026
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Remittance Purpose Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LrsCategory)}
                className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="general_investment">
                  Foreign Stocks / Real Estate / Gift & General (0% ≤ ₹10L, 20% &gt; ₹10L)
                </option>
                <option value="overseas_tour_package">
                  Overseas Tour Packages (Flat 2% on total cost)
                </option>
                <option value="education_loan">
                  Education Abroad funded by Loan u/s 80E (0% Nil TCS)
                </option>
                <option value="education_self">
                  Education Abroad self-funded (0% ≤ ₹10L, 2% &gt; ₹10L)
                </option>
                <option value="medical_treatment">
                  Medical Treatment Abroad (0% ≤ ₹10L, 2% &gt; ₹10L)
                </option>
              </select>
            </div>

            <HybridInput
              label="Remittance Amount (INR)"
              hint="Amount remitted abroad under RBI $250k LRS annual ceiling"
              value={remittanceAmountInr}
              onChange={setRemittanceAmountInr}
              min={10000}
              max={25000000}
              step={50000}
              prefix="₹"
            />

            <div className="pt-2 border-t border-border/40 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={panAvailable}
                  onChange={(e) => setPanAvailable(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-xs font-semibold text-foreground">
                  Valid PAN Furnished to AD Bank (Unchecked triggers higher statutory TCS rate)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Total Bank Outflow (Remittance + TCS)"
            value={result.totalOutflowInr}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Net Remittance to Beneficiary", value: result.remittanceAmountInr, color: "blue" },
              { label: "TCS Upfront Deduction", value: result.totalTcsDeducted, color: "red" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">TCS Deducted</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatINR(result.totalTcsDeducted)}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">
                {category === "overseas_tour_package" ? "TCS Rate (Flat)" : "TCS Rate (> ₹10L)"}
              </p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {result.tier2RatePercent}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">ITR Tax Credit</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                100% (Form 26AS)
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Remittance vs TCS Outflow Distribution
            </h3>
            <div className="h-56">
              <LrsTcsChart
                remittanceAmount={result.remittanceAmountInr}
                tcsDeducted={result.totalTcsDeducted}
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
              calcType="lrs-tcs"
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
        label="Total Bank Outflow"
        value={result.totalOutflowInr}
      />
    </div>
  );
}
