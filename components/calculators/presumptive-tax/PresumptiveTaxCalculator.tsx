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
import { calcPresumptiveTax } from "@/lib/math";
import type { PresumptiveProfessionType, PresumptiveTaxInput, TaxRegime } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import {
  Stethoscope,
  Store,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lock,
  Scale,
} from "lucide-react";

const PresumptiveTaxChart = dynamic(
  () => import("@/components/calculators/presumptive-tax/PresumptiveTaxChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function PresumptiveTaxCalculator() {
  const [mounted, setMounted] = useState(false);
  const [professionType, setProfessionType] = useState<PresumptiveProfessionType>("44ADA_professional");
  const [grossTurnover, setGrossTurnover] = useState(4000000); // 40 Lakhs
  const [digitalReceiptsPct, setDigitalReceiptsPct] = useState(100);
  const [compareActualProfit, setCompareActualProfit] = useState(false);
  const [actualProfit, setActualProfit] = useState(1800000);
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [deduction80C, setDeduction80C] = useState(150000);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: PresumptiveTaxInput = useMemo(
    () => ({
      professionType,
      grossTurnover,
      digitalReceiptsPercentage: digitalReceiptsPct,
      actualProfit: compareActualProfit ? actualProfit : undefined,
      regime,
      deduction80C: regime === "old" ? deduction80C : 0,
      deduction80D: regime === "old" ? deduction80D : 0,
    }),
    [
      professionType,
      grossTurnover,
      digitalReceiptsPct,
      compareActualProfit,
      actualProfit,
      regime,
      deduction80C,
      deduction80D,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcPresumptiveTax(debouncedInputs);
  }, [debouncedInputs]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Presumptive Tax" value={result.presumptiveTaxPayable} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Profession Type Selection */}
          <div className="surface-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Presumptive Tax Scheme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setProfessionType("44ADA_professional");
                  if (grossTurnover > 7500000) setGrossTurnover(5000000);
                }}
                className={clsx(
                  "p-3.5 rounded-xl border text-left transition-all",
                  professionType === "44ADA_professional"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  Section 44ADA (Professionals)
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Doctors, Tech Freelancers, CAs, Consultants. <strong>50%</strong> presumptive profit.
                </p>
                <div className="mt-2 text-[10px] text-primary/80 font-medium">
                  Max Limit: ₹75 Lakh (if ≥95% digital)
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfessionType("44AD_business");
                  if (grossTurnover < 5000000) setGrossTurnover(10000000);
                }}
                className={clsx(
                  "p-3.5 rounded-xl border text-left transition-all",
                  professionType === "44AD_business"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Store className="w-4 h-4 text-emerald-500" />
                  Section 44AD (Businesses)
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Traders, Retailers, Wholesalers. <strong>6% digital / 8% cash</strong> profit.
                </p>
                <div className="mt-2 text-[10px] text-primary/80 font-medium">
                  Max Limit: ₹3 Crore (if ≥95% digital)
                </div>
              </button>
            </div>
          </div>

          {/* Turnover & Digital Receipts Input */}
          <div className="surface-card p-5 space-y-5">
            <h3 className="text-sm font-bold text-foreground">Turnover & Banking Details</h3>

            <HybridInput
              label="Annual Gross Turnover / Gross Receipts"
              value={grossTurnover}
              onChange={setGrossTurnover}
              min={0}
              max={professionType === "44ADA_professional" ? 10000000 : 40000000}
              step={100000}
              prefix="₹"
            />

            {/* Quick Turnover Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(professionType === "44ADA_professional"
                ? [2000000, 4000000, 5000000, 7500000]
                : [5000000, 10000000, 20000000, 30000000]
              ).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setGrossTurnover(amt)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border bg-muted/50 hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>

            {/* Digital Receipts % Slider */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <HybridInput
                label="Percentage of Digital / Online / Banking Receipts"
                value={digitalReceiptsPct}
                onChange={setDigitalReceiptsPct}
                min={0}
                max={100}
                step={1}
                suffix="%"
              />

              <div
                className={clsx(
                  "p-2.5 rounded-lg text-xs flex items-center gap-2",
                  digitalReceiptsPct >= 95
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                )}
              >
                {digitalReceiptsPct >= 95 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      ≥95% digital receipts achieved! Enhanced limit of{" "}
                      <strong>
                        {professionType === "44ADA_professional" ? "₹75 Lakh" : "₹3 Crore"}
                      </strong>{" "}
                      applies.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Digital receipts below 95%. Base limit of{" "}
                      <strong>
                        {professionType === "44ADA_professional" ? "₹50 Lakh" : "₹2 Crore"}
                      </strong>{" "}
                      applies.
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actual Profit Comparison & Tax Regime */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Income Tax Regime
              </label>
              <div className="flex rounded-lg bg-muted p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setRegime("new")}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    regime === "new"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  ⚡ Tax Year 2026-27
                </button>
                <button
                  type="button"
                  onClick={() => setRegime("old")}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    regime === "old"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📋 Old Regime
                </button>
              </div>
            </div>

            {regime === "old" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <HybridInput
                  label="Section 80C Deductions"
                  value={deduction80C}
                  onChange={setDeduction80C}
                  min={0}
                  max={150000}
                  step={5000}
                  prefix="₹"
                />
                <HybridInput
                  label="Section 80D Health Insurance"
                  value={deduction80D}
                  onChange={setDeduction80D}
                  min={0}
                  max={100000}
                  step={5000}
                  prefix="₹"
                />
              </div>
            )}

            {/* Compare with Actual Profit Toggle */}
            <div className="pt-2 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compareActualProfit}
                    onChange={(e) => setCompareActualProfit(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  Compare with Actual Net Profit (Books/Audit)
                </label>
              </div>

              {compareActualProfit && (
                <HybridInput
                  label="Actual Net Profit (if regular books maintained)"
                  value={actualProfit}
                  onChange={setActualProfit}
                  min={0}
                  max={grossTurnover}
                  step={50000}
                  prefix="₹"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Card */}
          {result.isEligibleForPresumptive ? (
            <ResultHero
              label="Tax Under Presumptive Scheme"
              value={result.presumptiveTaxPayable}
              breakdown={[
                { label: "Presumptive Profit", value: result.presumptiveIncome, color: "green" },
                { label: "Tax Payable", value: result.presumptiveTaxPayable, color: "red" },
                {
                  label: "Net Post-Tax Profit",
                  value: Math.max(0, result.presumptiveIncome - result.presumptiveTaxPayable),
                  color: "blue",
                },
              ]}
            />
          ) : (
            <div className="surface-card p-6 border-2 border-destructive/50 bg-destructive/5 space-y-2">
              <div className="flex items-center gap-2 text-destructive font-bold">
                <AlertCircle className="w-5 h-5" />
                <span>Presumptive Taxation Ineligible</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {result.ineligibilityReason}
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                You must maintain regular books of account under Section 44AA and obtain a Tax Audit report under Section 44AB if turnover exceeds regular audit limits.
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          {result.isEligibleForPresumptive && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="surface-card p-3.5 text-center">
                <div className="text-xs text-muted-foreground">Deemed Profit</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR(result.presumptiveIncome)}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  ({result.presumptiveRateEffective}% of turnover)
                </div>
              </div>

              <div className="surface-card p-3.5 text-center">
                <div className="text-xs text-muted-foreground">Effective Tax Rate</div>
                <div className="text-base font-bold text-primary mt-1">
                  {result.presumptiveTaxDetails.effectiveRate}%
                </div>
                <div className="text-[10px] text-muted-foreground">on deemed income</div>
              </div>

              <div className="surface-card p-3.5 text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-muted-foreground">Statutory Cap</div>
                <div className="text-sm font-bold text-foreground mt-1">
                  {formatINR(result.maxTurnoverLimit)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {result.isEnhancedLimitApplicable ? "Enhanced limit" : "Base limit"}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table: Presumptive vs Actual Profit */}
          {compareActualProfit && result.isEligibleForPresumptive && (
            <div className="surface-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-blue-500" />
                  Presumptive vs Actual Profit Comparison
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left">
                      <th className="py-2 pr-3">Parameter</th>
                      <th className="py-2 px-3">Presumptive Scheme</th>
                      <th className="py-2 pl-3">Actual Books & Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3 text-muted-foreground">Declared Profit</td>
                      <td className="py-2 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatINR(result.presumptiveIncome)} ({result.presumptiveRateEffective}%)
                      </td>
                      <td className="py-2 pl-3 font-semibold">
                        {formatINR(result.actualProfit)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 text-muted-foreground">Tax Payable</td>
                      <td className="py-2 px-3 font-bold text-foreground">
                        {formatINR(result.presumptiveTaxPayable)}
                      </td>
                      <td className="py-2 pl-3 font-bold text-foreground">
                        {formatINR(result.actualTaxPayable)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 text-muted-foreground">Books of Accounts</td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        Exempt (No Books)
                      </td>
                      <td className="py-2 pl-3 text-amber-600 dark:text-amber-400 font-medium">
                        Mandatory u/s 44AA
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 text-muted-foreground">Tax Audit</td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        Not Required
                      </td>
                      <td className="py-2 pl-3 text-red-600 dark:text-red-400 font-medium">
                        {result.isAuditTriggeredByOptOut ? "Mandatory u/s 44AB" : "Not Triggered"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground leading-relaxed">
                {result.recommendation}
              </div>
            </div>
          )}

          {/* Audit Trigger Warning Alert */}
          {result.isAuditTriggeredByOptOut && (
            <div className="surface-card p-5 rounded-2xl border-2 border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Mandatory Tax Audit Warning (Section 44AB)</span>
              </div>
              <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                {result.auditTriggerReason}
              </p>

              {result.fiveYearLockoutTriggered && (
                <div className="flex items-start gap-2 pt-2 border-t border-amber-200 dark:border-amber-800 text-xs text-red-700 dark:text-red-300">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>5-Year Lockout Penalty u/s 44AD(4):</strong> Once you opt out of Section 44AD and declare profit below 6%/8%, you cannot opt back into Section 44AD for the next 5 consecutive assessment years.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Comparison Bar Chart */}
          {result.isEligibleForPresumptive && (
            <div className="surface-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">
                Presumptive Scheme vs Actual Profit Chart
              </h3>
              <div className="h-60">
                <PresumptiveTaxChart
                  presumptiveIncome={result.presumptiveIncome}
                  presumptiveTax={result.presumptiveTaxPayable}
                  actualProfit={result.actualProfit}
                  actualTax={result.actualTaxPayable}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <SaveCalculationButton
              calcType="Presumptive Tax"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: {
                  turnover: result.grossTurnover,
                  presumptiveIncome: result.presumptiveIncome,
                  taxPayable: result.presumptiveTaxPayable,
                  eligible: result.isEligibleForPresumptive,
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
