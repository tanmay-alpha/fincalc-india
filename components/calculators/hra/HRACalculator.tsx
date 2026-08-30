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
import { calcHRAExemption } from "@/lib/math";
import type { CityType, SalaryPeriod, HRAExemptionInput } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import {
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";

const HRAChart = dynamic(
  () => import("@/components/calculators/hra/HRAChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function HRACalculator() {
  const [mounted, setMounted] = useState(false);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("monthly");
  const [basicSalary, setBasicSalary] = useState(50000);
  const [dearnessAllowance, setDearnessAllowance] = useState(0);
  const [daFormsRetirement, setDaFormsRetirement] = useState(false);
  const [hraReceived, setHraReceived] = useState(25000);
  const [rentPaid, setRentPaid] = useState(20000);
  const [cityType, setCityType] = useState<CityType>("metro");

  // Rent to parents mode
  const [isPayingToParents, setIsPayingToParents] = useState(false);
  const [parentsSlabRate, setParentsSlabRate] = useState(0);
  const [userSlabRate, setUserSlabRate] = useState(30);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: HRAExemptionInput = useMemo(
    () => ({
      basicSalary,
      salaryPeriod,
      dearnessAllowance,
      daFormsPartOfRetirementBenefits: daFormsRetirement,
      hraReceived,
      rentPaid,
      cityType,
      isPayingToParents,
      parentsSlabRatePercent: parentsSlabRate,
      userSlabRatePercent: userSlabRate,
    }),
    [
      basicSalary,
      salaryPeriod,
      dearnessAllowance,
      daFormsRetirement,
      hraReceived,
      rentPaid,
      cityType,
      isPayingToParents,
      parentsSlabRate,
      userSlabRate,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcHRAExemption(debouncedInputs);
  }, [debouncedInputs]);

  if (!mounted) return <CalcPageSkeleton />;

  const isMonthly = salaryPeriod === "monthly";

  return (
    <>
      <StickyResultBar label="Annual Exempt HRA" value={result.annualExemptHra} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mode Switchers: Period & City Type */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Salary Input Mode
              </label>
              <div className="flex rounded-lg bg-muted p-1 gap-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (salaryPeriod === "annual") {
                      setBasicSalary(Math.round(basicSalary / 12));
                      setDearnessAllowance(Math.round(dearnessAllowance / 12));
                      setHraReceived(Math.round(hraReceived / 12));
                      setRentPaid(Math.round(rentPaid / 12));
                    }
                    setSalaryPeriod("monthly");
                  }}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    isMonthly
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (salaryPeriod === "monthly") {
                      setBasicSalary(basicSalary * 12);
                      setDearnessAllowance(dearnessAllowance * 12);
                      setHraReceived(hraReceived * 12);
                      setRentPaid(rentPaid * 12);
                    }
                    setSalaryPeriod("annual");
                  }}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    !isMonthly
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* City Type Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                City of Residence
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCityType("metro")}
                  className={clsx(
                    "p-3 rounded-xl border text-left transition-all",
                    cityType === "metro"
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Building2 className="w-4 h-4" />
                    Metro (50% Cap)
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Delhi, Mumbai, Kolkata, Chennai
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCityType("non_metro")}
                  className={clsx(
                    "p-3 rounded-xl border text-left transition-all",
                    cityType === "non_metro"
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Building2 className="w-4 h-4" />
                    Non-Metro (40% Cap)
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Bengaluru, Pune, Hyderabad, etc.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Salary & Rent Inputs */}
          <div className="surface-card p-5 space-y-5">
            <h3 className="text-sm font-bold text-foreground">Income & Rent Particulars</h3>

            <HybridInput
              label={`Basic Salary (${isMonthly ? "Monthly" : "Annual"})`}
              value={basicSalary}
              onChange={setBasicSalary}
              min={0}
              max={isMonthly ? 1000000 : 12000000}
              step={isMonthly ? 1000 : 10000}
              prefix="₹"
            />

            <div className="space-y-2">
              <HybridInput
                label={`Dearness Allowance (DA) (${isMonthly ? "Monthly" : "Annual"})`}
                value={dearnessAllowance}
                onChange={setDearnessAllowance}
                min={0}
                max={isMonthly ? 500000 : 6000000}
                step={isMonthly ? 1000 : 10000}
                prefix="₹"
              />
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={daFormsRetirement}
                  onChange={(e) => setDaFormsRetirement(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">
                  DA forms part of retirement benefits (included in HRA salary base per rules)
                </span>
              </label>
            </div>

            <HybridInput
              label={`HRA Received from Employer (${isMonthly ? "Monthly" : "Annual"})`}
              value={hraReceived}
              onChange={setHraReceived}
              min={0}
              max={isMonthly ? 500000 : 6000000}
              step={isMonthly ? 1000 : 10000}
              prefix="₹"
            />

            <HybridInput
              label={`Actual Rent Paid (${isMonthly ? "Monthly" : "Annual"})`}
              value={rentPaid}
              onChange={setRentPaid}
              min={0}
              max={isMonthly ? 500000 : 6000000}
              step={isMonthly ? 1000 : 10000}
              prefix="₹"
            />
          </div>

          {/* Paying Rent to Parents Module */}
          <div className="surface-card p-5 space-y-4 border border-blue-500/20 bg-blue-50/20 dark:bg-blue-950/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-foreground">
                  Paying Rent to Parents Mode
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPayingToParents}
                  onChange={(e) => setIsPayingToParents(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isPayingToParents ? (
              <div className="space-y-4 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Legally claim HRA by paying rent to parents who own the property. You save tax at your marginal slab, while parents declare it under <em>Income from House Property</em> (eligible for 30% statutory deduction u/s 24a).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <HybridInput
                    label="Your Tax Slab Rate"
                    value={userSlabRate}
                    onChange={setUserSlabRate}
                    min={0}
                    max={30}
                    step={5}
                    suffix="%"
                  />
                  <HybridInput
                    label="Parent's Marginal Tax Slab"
                    value={parentsSlabRate}
                    onChange={setParentsSlabRate}
                    min={0}
                    max={30}
                    step={5}
                    suffix="%"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Living with parents? Enable this mode to calculate net household tax arbitrage if your parents are in a lower income tax slab.
              </p>
            )}
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Card */}
          <ResultHero
            label="Total Tax-Exempt HRA (Annual)"
            value={result.annualExemptHra}
            breakdown={[
              { label: "Tax-Exempt HRA", value: result.annualExemptHra, color: "green" },
              { label: "Taxable HRA", value: result.annualTaxableHra, color: "red" },
              { label: "Est. Tax Saved", value: result.taxSaved, color: "blue" },
            ]}
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="surface-card p-3.5 text-center">
              <div className="text-xs text-muted-foreground">Monthly Exemption</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(result.monthlyExemptHra)}
              </div>
            </div>
            <div className="surface-card p-3.5 text-center">
              <div className="text-xs text-muted-foreground">Monthly Taxable</div>
              <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                {formatINR(result.monthlyTaxableHra)}
              </div>
            </div>
            <div className="surface-card p-3.5 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-muted-foreground">Binding Limit</div>
              <div className="text-xs font-bold text-primary mt-1.5 truncate">
                {result.bindingConstraint === "actual_hra"
                  ? "Actual HRA"
                  : result.bindingConstraint === "rent_minus_10pct"
                  ? "Rent − 10% Salary"
                  : `${result.salaryPercentageUsed}% Salary Cap`}
              </div>
            </div>
          </div>

          {/* 3 Criteria Comparison Breakdown */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Section 10(13A) 3-Limit Comparison
              </h3>
              <span className="text-[11px] font-medium text-muted-foreground">
                Exemption = Minimum of 3
              </span>
            </div>

            <div className="space-y-3">
              {/* Limit 1 */}
              <div
                className={clsx(
                  "p-3.5 rounded-xl border transition-all",
                  result.bindingConstraint === "actual_hra"
                    ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                    : "border-border bg-card/50"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">1. Actual HRA Received</span>
                    {result.bindingConstraint === "actual_hra" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Lowest (Applied)
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold">{formatINR(result.actualHraLimit)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Full annual HRA allowance paid by your employer.
                </p>
              </div>

              {/* Limit 2 */}
              <div
                className={clsx(
                  "p-3.5 rounded-xl border transition-all",
                  result.bindingConstraint === "rent_minus_10pct"
                    ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                    : "border-border bg-card/50"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">2. Rent Paid − 10% of Basic</span>
                    {result.bindingConstraint === "rent_minus_10pct" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Lowest (Applied)
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold">{formatINR(result.rentMinusTenPercentLimit)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatINR(result.annualRentPaid)} rent paid minus 10% salary ({formatINR(result.annualBasicSalaryBase * 0.1)}).
                </p>
              </div>

              {/* Limit 3 */}
              <div
                className={clsx(
                  "p-3.5 rounded-xl border transition-all",
                  result.bindingConstraint === "salary_cap"
                    ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                    : "border-border bg-card/50"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">3. {result.salaryPercentageUsed}% of Salary Base</span>
                    {result.bindingConstraint === "salary_cap" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Lowest (Applied)
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold">{formatINR(result.salaryPercentageLimit)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {result.cityType === "metro" ? "50% for Metros (Delhi, Mumbai, Kolkata, Chennai)" : "40% for Non-Metro cities"}.
                </p>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="surface-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">HRA Exemption Breakdown</h3>
            <div className="h-56">
              <HRAChart
                exemptHra={result.annualExemptHra}
                taxableHra={result.annualTaxableHra}
              />
            </div>
          </div>

          {/* Parents Rent Tax Arbitrage Results */}
          {result.payingToParentsDetails && (
            <div className="surface-card p-5 space-y-4 border-2 border-blue-500/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-foreground">
                  Family Tax Optimization Impact
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-muted-foreground">Your Tax Saved</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatINR(result.payingToParentsDetails.employeeTaxSaved)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-muted-foreground">Parent Tax Payable</div>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {formatINR(result.payingToParentsDetails.parentTaxPayable)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">After 30% std deduction</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                    Net Family Tax Benefit:
                  </span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {formatINR(result.payingToParentsDetails.netHouseholdTaxSaved)}/yr
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-1.5">
                  {result.payingToParentsDetails.recommendation}
                </p>
              </div>

              <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
                <div className="font-semibold text-foreground">Compliance Requirements:</div>
                <div>• Parents must own the property (not co-owned by you).</div>
                <div>• Execute a formal registered or notarized rent agreement.</div>
                <div>• Transfer rent monthly via bank transfer or cheque (keep receipts).</div>
                <div>• Parents must disclose rental income in their ITR u/s 24.</div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <SaveCalculationButton
              calcType="HRA Exemption"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: {
                  exemptHra: result.annualExemptHra,
                  taxableHra: result.annualTaxableHra,
                  taxSaved: result.taxSaved,
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
