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
import { calcNPS } from "@/lib/math";
import type { NPSInput, TaxRegime } from "@/lib/math";
import { getNPSInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Landmark, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

const NpsChart = dynamic(
  () => import("@/components/calculators/nps/NpsChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function NpsCalculator() {
  const [mounted, setMounted] = useState(false);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [equityAllocationPercent, setEquityAllocationPercent] = useState(50);
  const [corporateDebtAllocationPercent, setCorporateDebtAllocationPercent] = useState(30);
  const [govtBondsAllocationPercent, setGovtBondsAllocationPercent] = useState(20);
  const expectedEquityReturnPercent = 12.0;
  const expectedCorpDebtReturnPercent = 9.0;
  const expectedGovtBondReturnPercent = 7.5;
  const [lumpSumWithdrawalPercent, setLumpSumWithdrawalPercent] = useState(60);
  const [assumedAnnuityYieldPercent, setAssumedAnnuityYieldPercent] = useState(6.5);
  const [taxBracketPercent, setTaxBracketPercent] = useState(30.0);
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [employerMonthlyContribution, setEmployerMonthlyContribution] = useState(0);
  const [isGovtEmployee, setIsGovtEmployee] = useState(false);
  const [showAdvancedTax, setShowAdvancedTax] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAllocation =
    equityAllocationPercent + corporateDebtAllocationPercent + govtBondsAllocationPercent;

  const inputs: NPSInput = useMemo(
    () => ({
      currentAge,
      retirementAge,
      monthlyContribution,
      equityAllocationPercent,
      corporateDebtAllocationPercent,
      govtBondsAllocationPercent,
      expectedEquityReturnPercent,
      expectedCorpDebtReturnPercent,
      expectedGovtBondReturnPercent,
      lumpSumWithdrawalPercent,
      assumedAnnuityYieldPercent,
      taxBracketPercent,
      regime,
      employerMonthlyContribution,
      isGovtEmployee,
    }),
    [
      currentAge,
      retirementAge,
      monthlyContribution,
      equityAllocationPercent,
      corporateDebtAllocationPercent,
      govtBondsAllocationPercent,
      expectedEquityReturnPercent,
      expectedCorpDebtReturnPercent,
      expectedGovtBondReturnPercent,
      lumpSumWithdrawalPercent,
      assumedAnnuityYieldPercent,
      taxBracketPercent,
      regime,
      employerMonthlyContribution,
      isGovtEmployee,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcNPS(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getNPSInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: NPS Parameters */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-base">
                NPS Contribution & Allocation
              </h2>
            </div>
            <span className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
              PFRDA 2026 Rules
            </span>
          </div>

          <div className="space-y-4">
            <HybridInput
              label="Monthly NPS Investment (Self)"
              hint="Monthly self-contribution to Tier-1 account"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={500}
              max={1000000}
              step={1000}
              prefix="₹"
              quickChips={[
                { label: "₹5K", value: 5000 },
                { label: "₹10K", value: 10000 },
                { label: "₹25K", value: 25000 },
                { label: "₹50K", value: 50000 },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="Current Age"
                hint="Your current age in years"
                value={currentAge}
                onChange={setCurrentAge}
                min={18}
                max={65}
                step={1}
                suffix="Y"
              />

              <HybridInput
                label="Retirement Age"
                hint="Maturity age when pension begins (standard: 60)"
                value={retirementAge}
                onChange={setRetirementAge}
                min={50}
                max={75}
                step={1}
                suffix="Y"
              />
            </div>

            {/* Asset Allocation Sliders */}
            <div className="pt-2 border-t border-border/40 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Asset Class Allocation (E, C, G)
                </h3>
                <span
                  className={`text-xs font-bold ${
                    totalAllocation === 100 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  Total: {totalAllocation}% {totalAllocation !== 100 && "(Must equal 100%)"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HybridInput
                  label="Equity Scheme E (%)"
                  hint="Max 75% under active choice up to age 50"
                  value={equityAllocationPercent}
                  onChange={setEquityAllocationPercent}
                  min={0}
                  max={75}
                  step={5}
                  suffix="%"
                />

                <HybridInput
                  label="Corporate Debt C (%)"
                  hint="Investment in corporate bonds"
                  value={corporateDebtAllocationPercent}
                  onChange={setCorporateDebtAllocationPercent}
                  min={0}
                  max={100}
                  step={5}
                  suffix="%"
                />

                <HybridInput
                  label="Govt Bonds G (%)"
                  hint="Investment in government securities"
                  value={govtBondsAllocationPercent}
                  onChange={setGovtBondsAllocationPercent}
                  min={0}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </div>

            {/* Annuity & Exit Parameters */}
            <div className="pt-2 border-t border-border/40 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pension & Lump Sum Withdrawal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HybridInput
                  label="Lump Sum Withdrawal (%)"
                  hint="PFRDA permits up to 80% (60% tax-free u/s 10(12A), remaining 20% taxable)"
                  value={lumpSumWithdrawalPercent}
                  onChange={setLumpSumWithdrawalPercent}
                  min={0}
                  max={80}
                  step={5}
                  suffix="%"
                  quickChips={[
                    { label: "60% (Tax-Free)", value: 60 },
                    { label: "70%", value: 70 },
                    { label: "80% (Max)", value: 80 },
                  ]}
                />

                <HybridInput
                  label="Annuity Yield (% p.a.)"
                  hint="Expected lifetime return from Annuity Service Provider"
                  value={assumedAnnuityYieldPercent}
                  onChange={setAssumedAnnuityYieldPercent}
                  min={4}
                  max={10}
                  step={0.25}
                  suffix="%"
                />
              </div>
            </div>

            {/* Advanced Tax & Employer Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedTax((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 text-xs font-medium text-foreground hover:bg-muted/50 transition"
            >
              <span>{showAdvancedTax ? "Hide Tax Regime & Employer Options" : "Configure Tax Regime & Corporate NPS (80CCD(2))"}</span>
              {showAdvancedTax ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>

            {showAdvancedTax && (
              <div className="space-y-4 p-3.5 bg-muted/40 border border-border/60 rounded-xl">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Applicable Tax Regime
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["new", "old"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegime(r)}
                        className={clsx(
                          "py-2 px-3 rounded-lg text-xs font-semibold border transition text-left",
                          regime === r
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        <div>{r === "new" ? "⚡ New Regime" : "📋 Old Regime"}</div>
                        <div className="text-[10px] font-normal opacity-85 mt-0.5">
                          {r === "new" ? "80CCD(2) employer benefit only" : "80CCD(1B) + 80CCD(2) benefits"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <HybridInput
                    label="Employer Monthly Contribution"
                    hint="Corporate NPS Tier-1 co-contribution"
                    value={employerMonthlyContribution}
                    onChange={setEmployerMonthlyContribution}
                    min={0}
                    max={500000}
                    step={1000}
                    prefix="₹"
                  />

                  <HybridInput
                    label="Assumed Marginal Tax Bracket"
                    hint="For computing annual Section 80CCD tax savings"
                    value={taxBracketPercent}
                    onChange={setTaxBracketPercent}
                    min={0}
                    max={39}
                    step={1}
                    suffix="%"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isGovtEmployee}
                    onChange={(e) => setIsGovtEmployee(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-xs font-medium text-foreground">
                    Central / State Government Employee (14% employer deduction limit u/s 80CCD(2))
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          {result.isValid ? (
            <>
              <ResultHero
                label="Total Accumulated Retirement Corpus"
                value={result.totalAccumulatedCorpus}
                formatValue={(val) => formatINR(val)}
                breakdown={[
                  { label: "Total Amount Invested", value: result.totalAmountInvested, color: "blue" },
                  { label: "Compound Wealth Growth", value: result.totalAccumulatedCorpus - result.totalAmountInvested, color: "green" },
                ]}
              />

              {/* Statutory Output Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Monthly Pension</p>
                  <p className="text-base font-bold text-emerald-500 mt-0.5">
                    {formatINR(result.estimatedMonthlyPension)}/mo
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Tax-Free Lump Sum (60%)</p>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {formatINR(result.lumpSumTaxFreeAmount)}
                  </p>
                  {result.taxableLumpSumAmount > 0 && (
                    <span className="text-[10px] text-amber-500 font-medium block mt-0.5">
                      +{formatINR(result.taxableLumpSumAmount)} taxable (Est: {formatINR(result.estimatedTaxOnLumpSum)})
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Annuity Corpus ({100 - result.lumpSumWithdrawalPercent}%)</p>
                  <p className="text-base font-bold text-primary mt-0.5">
                    {formatINR(result.annuityPurchasedAmount)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Annual Tax Saved</p>
                  <p className="text-base font-bold text-emerald-500 mt-0.5">
                    {formatINR(result.annualTaxSavedUnder80CCD)}/yr
                  </p>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {regime === "old" ? "80CCD(1B) + 80CCD(2)" : "80CCD(2) Corporate"}
                  </span>
                </div>
              </div>

              {/* Statutory Note Card */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/85 leading-relaxed">
                  {result.taxTreatmentNote}
                </p>
              </div>

              {/* Chart Card */}
              <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  NPS Corpus Accumulation Progression
                </h3>
                <div className="h-56">
                  <NpsChart yearlyProgression={result.yearlyProgression} />
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
                  calcType="nps"
                  data={{
                    inputs: inputs as unknown as Record<string, unknown>,
                    results: result as unknown as Record<string, unknown>,
                  }}
                  onSaved={(id) => setShareId(id)}
                />
                <ShareButton shareId={shareId} />
              </div>
            </>
          ) : (
            <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
              <h3 className="font-semibold text-foreground">Allocation Check</h3>
              <p className="text-xs text-muted-foreground">{result.errorMessage}</p>
            </div>
          )}
        </div>
      </div>

      <StickyResultBar
        label="NPS Corpus"
        value={result.totalAccumulatedCorpus}
      />
    </div>
  );
}
