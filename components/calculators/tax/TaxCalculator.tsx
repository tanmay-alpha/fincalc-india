"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcTax } from "@/lib/math";
import type {
  TaxRegime,
  TaxpayerResidency,
  TaxpayerAgeCategory,
  TaxInput,
} from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateTaxInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ChevronDown,
  UserCheck,
  Wallet,
  Receipt,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { getRestoredInputs, recordRecentCalculation } from "@/lib/storage-workflow";
import { cn } from "@/lib/utils";

const TaxChart = dynamic(
  () => import("@/components/calculators/tax/TaxChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

type TaxFlowTab = "income" | "profile" | "deductions";

const DEFAULT_TAX_INPUTS: TaxInput = {
  grossIncome: 1500000,
  salaryIncome: 1500000,
  interestAndOtherIncome: 0,
  businessIncome: 0,
  dividendIncome: 0,
  equityLtcg: 0,
  equityStcg: 0,
  otherLtcg: 0,
  residency: "resident_individual" as TaxpayerResidency,
  ageCategory: "below_60" as TaxpayerAgeCategory,
  regime: "new" as TaxRegime,
  deduction80C: 0,
  deduction80D: 25000,
  deduction80CCD1B: 0,
  hraExemption: 0,
  otherDeductions: 0,
};

export default function TaxCalculator() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TaxFlowTab>("income");
  const [showAdvancedIncome, setShowAdvancedIncome] = useState(false);
  const [showWhyComparison, setShowWhyComparison] = useState(false);

  const [inputs, setInputs] = useState<TaxInput>(DEFAULT_TAX_INPUTS);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const restored = getRestoredInputs("tax", DEFAULT_TAX_INPUTS);
    setInputs(restored);
  }, []);

  const debouncedInputs = useDebounce(inputs, 200);
  const results = useMemo(() => calcTax(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateTaxInsights(results), [results]);

  useEffect(() => setShareId(null), [debouncedInputs]);

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "tax",
        name: "Income Tax Calculator",
        route: "/tax",
        category: "taxation",
        summary: `₹${formatINR(inputs.grossIncome || inputs.salaryIncome || 0)} · ${String(inputs.regime).toUpperCase()}`,
      });
    }
  }, [mounted, inputs.grossIncome, inputs.salaryIncome, inputs.regime]);

  // Synchronize simple salary vs total gross
  const onSimpleSalary = useCallback((v: number) => {
    setInputs((p) => ({
      ...p,
      grossIncome: v,
      salaryIncome: v,
    }));
  }, []);

  const onRegime = useCallback((r: TaxRegime) => setInputs((p) => ({ ...p, regime: r })), []);
  const on80C = useCallback((v: number) => setInputs((p) => ({ ...p, deduction80C: v })), []);
  const on80D = useCallback((v: number) => setInputs((p) => ({ ...p, deduction80D: v })), []);
  const on80CCD1B = useCallback((v: number) => setInputs((p) => ({ ...p, deduction80CCD1B: v })), []);
  const onHRA = useCallback((v: number) => setInputs((p) => ({ ...p, hraExemption: v })), []);
  const onOther = useCallback((v: number) => setInputs((p) => ({ ...p, otherDeductions: v })), []);

  // Exact engine recomputation for 80C optimization
  const potential80CSavings = useMemo(() => {
    if (inputs.regime !== "old" || (inputs.deduction80C ?? 0) >= 150000) return 0;
    const optimized = calcTax({
      ...debouncedInputs,
      deduction80C: 150000,
    });
    return Math.max(0, results.totalTax - optimized.totalTax);
  }, [inputs.regime, inputs.deduction80C, debouncedInputs, results.totalTax]);

  if (!mounted) return <CalcPageSkeleton />;

  const effectiveTaxRate =
    results.grossIncome > 0
      ? ((results.totalTax / results.grossIncome) * 100).toFixed(1)
      : "0.0";
  const monthlyTakeHome = Math.max(
    0,
    Math.round((results.grossIncome - results.totalTax) / 12)
  );

  return (
    <>
      <StickyResultBar
        label="Net Tax Payable"
        value={results.totalTax}
        prefix="₹"
        color="red"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ────── 4-STAGE GUIDED INPUT PANEL (~42%) ────── */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
            {/* Header & Badges */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Tax Parameters (AY 2026-27)
              </h2>
              <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-0.5">
                Finance Act, 2026
              </span>
            </div>

            {/* Quick Regime Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => onRegime("new")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  inputs.regime === "new"
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                New Regime (Default)
              </button>
              <button
                type="button"
                onClick={() => onRegime("old")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  inputs.regime === "old"
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                Old Regime
              </button>
            </div>

            {/* Step / Stage Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("income")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeTab === "income"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>1. Income</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("deductions")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeTab === "deductions"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>2. Deductions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeTab === "profile"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>3. Profile</span>
              </button>
            </div>

            {/* STAGE 1: INCOME DETAILS */}
            {activeTab === "income" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Income Streams
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedIncome(!showAdvancedIncome)}
                    className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>{showAdvancedIncome ? "Hide Advanced Streams" : "Configure Multiple Income Streams"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAdvancedIncome && "rotate-180")} />
                  </button>
                </div>

                {!showAdvancedIncome ? (
                  <HybridInput
                    label="Salary / Pension Income"
                    value={inputs.salaryIncome ?? inputs.grossIncome ?? 1500000}
                    onChange={onSimpleSalary}
                    min={100000}
                    max={100000000}
                    step={50000}
                    prefix="₹"
                    hint="Eligible for ₹75,000 New Regime standard deduction"
                    quickChips={[
                      { label: "₹7.5L", value: 750000 },
                      { label: "₹12L", value: 1200000 },
                      { label: "₹15L", value: 1500000 },
                      { label: "₹25L", value: 2500000 },
                      { label: "₹50L", value: 5000000 },
                    ]}
                  />
                ) : (
                  <div className="space-y-4">
                    <HybridInput
                      label="Salary / Pension Income"
                      value={inputs.salaryIncome ?? 0}
                      onChange={(v) => setInputs((p) => ({ ...p, salaryIncome: v }))}
                      min={0}
                      max={100000000}
                      step={50000}
                      prefix="₹"
                      hint="Standard deduction applies only to salary"
                    />
                    <HybridInput
                      label="Interest & Other Income"
                      value={inputs.interestAndOtherIncome ?? 0}
                      onChange={(v) => setInputs((p) => ({ ...p, interestAndOtherIncome: v }))}
                      min={0}
                      max={50000000}
                      step={25000}
                      prefix="₹"
                      hint="Savings, FD, and rental income"
                    />
                    <HybridInput
                      label="Dividend Income"
                      value={inputs.dividendIncome ?? 0}
                      onChange={(v) => setInputs((p) => ({ ...p, dividendIncome: v }))}
                      min={0}
                      max={50000000}
                      step={25000}
                      prefix="₹"
                      hint="Surcharge capped at 15%"
                    />
                    <HybridInput
                      label="Business / Professional Income (PGBP)"
                      value={inputs.businessIncome ?? 0}
                      onChange={(v) => setInputs((p) => ({ ...p, businessIncome: v }))}
                      min={0}
                      max={100000000}
                      step={50000}
                      prefix="₹"
                    />

                    <div>
                      <label htmlFor="tax-residency-status" className="text-xs font-semibold text-foreground block mb-1">
                        Taxpayer Residential Status
                      </label>
                      <select
                        id="tax-residency-status"
                        aria-label="Taxpayer Residential Status"
                        value={inputs.residency ?? "resident_individual"}
                        onChange={(e) =>
                          setInputs((p) => ({
                            ...p,
                            residency: e.target.value as TaxpayerResidency,
                          }))
                        }
                        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="resident_individual">
                          Resident Individual (Section 157 Rebate Eligible)
                        </option>
                        <option value="non_resident">
                          Non-Resident Indian (NRI)
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                      <HybridInput
                        label="Equity LTCG (112A)"
                        value={inputs.equityLtcg ?? 0}
                        onChange={(v) => setInputs((p) => ({ ...p, equityLtcg: v }))}
                        min={0}
                        max={50000000}
                        step={25000}
                        prefix="₹"
                        hint="12.5% > ₹1.25L"
                      />
                      <HybridInput
                        label="Equity STCG (111A)"
                        value={inputs.equityStcg ?? 0}
                        onChange={(v) => setInputs((p) => ({ ...p, equityStcg: v }))}
                        min={0}
                        max={50000000}
                        step={25000}
                        prefix="₹"
                        hint="Flat 20%"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("deductions")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition"
                  >
                    <span>Next: Add Deductions (80C, 80D, HRA)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: DEDUCTIONS DETAILS */}
            {activeTab === "deductions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Chapter VI-A Deductions
                  </h3>
                  <span className="text-[11px] text-muted-foreground">Old Regime Only</span>
                </div>

                <HybridInput
                  label="Section 80C (EPF, PPF, ELSS, LIC)"
                  value={inputs.deduction80C ?? 0}
                  onChange={on80C}
                  min={0}
                  max={150000}
                  step={5000}
                  prefix="₹"
                  quickChips={[
                    { label: "₹50K", value: 50000 },
                    { label: "₹1L", value: 100000 },
                    { label: "₹1.5L (Max)", value: 150000 },
                  ]}
                />

                <HybridInput
                  label="Section 80D (Health Insurance)"
                  value={inputs.deduction80D ?? 0}
                  onChange={on80D}
                  min={0}
                  max={100000}
                  step={5000}
                  prefix="₹"
                  hint="Self, family & parents health insurance"
                  quickChips={[
                    { label: "₹25K", value: 25000 },
                    { label: "₹50K", value: 50000 },
                    { label: "₹1L", value: 100000 },
                  ]}
                />

                <HybridInput
                  label="Section 80CCD(1B) (NPS Self)"
                  value={inputs.deduction80CCD1B ?? 0}
                  onChange={on80CCD1B}
                  min={0}
                  max={50000}
                  step={5000}
                  prefix="₹"
                  hint="Additional voluntary NPS (Max ₹50,000)"
                />

                <HybridInput
                  label="HRA Exemption u/s 10(13A)"
                  value={inputs.hraExemption ?? 0}
                  onChange={onHRA}
                  min={0}
                  max={2000000}
                  step={10000}
                  prefix="₹"
                  hint="Exempt rent allowance portion"
                />

                <HybridInput
                  label="Other Deductions (80E, 80G, etc.)"
                  value={inputs.otherDeductions ?? 0}
                  onChange={onOther}
                  min={0}
                  max={1000000}
                  step={5000}
                  prefix="₹"
                />

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition"
                  >
                    <span>Next: Taxpayer Profile & Regime</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: PROFILE & REGIME SELECTION */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Taxpayer Profile
                  </h3>
                </div>

                {/* Regime Selector */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Active Tax Regime
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onRegime("new")}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all",
                        inputs.regime === "new"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      New Regime (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => onRegime("old")}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all",
                        inputs.regime === "old"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="tax-residency-status-modal" className="text-xs font-semibold text-foreground block mb-1">
                    Residential Status
                  </label>
                  <select
                    id="tax-residency-status-modal"
                    aria-label="Residential Status"
                    value={inputs.residency ?? "resident_individual"}
                    onChange={(e) =>
                      setInputs((p) => ({
                        ...p,
                        residency: e.target.value as TaxpayerResidency,
                      }))
                    }
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="resident_individual">
                      Resident Individual (Section 157 Rebate Eligible)
                    </option>
                    <option value="non_resident">
                      Non-Resident Indian (NRI)
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tax-age-group-modal" className="text-xs font-semibold text-foreground block mb-1">
                    Age Group
                  </label>
                  <select
                    id="tax-age-group-modal"
                    aria-label="Age Group"
                    value={inputs.ageCategory ?? "below_60"}
                    onChange={(e) =>
                      setInputs((p) => ({
                        ...p,
                        ageCategory: e.target.value as TaxpayerAgeCategory,
                      }))
                    }
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="below_60">Individual below 60 years</option>
                    <option value="senior_60_to_80">
                      Senior Citizen (60 to 79 years)
                    </option>
                    <option value="super_senior_above_80">
                      Super Senior Citizen (80+ years)
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <SaveCalculationButton
              calcType="Tax"
              data={{
                inputs: debouncedInputs as unknown as Record<string, unknown>,
                results: results as unknown as Record<string, unknown>,
              }}
              onSaved={setShareId}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>

        {/* ────── RESULTS PANEL (~58%) ────── */}
        <div className="lg:col-span-7 space-y-6" data-result-hero>
          {/* Primary Result Hero */}
          <ResultHero
            label={`Net Tax Payable (${inputs.regime === "new" ? "New" : "Old"} Regime)`}
            value={results.totalTax}
            tone={results.totalTax > 0 ? "negative" : "neutral"}
            prefix="₹"
            formatValue={(val) => val.toLocaleString("en-IN")}
            interpretation={`Under the ${inputs.regime === "new" ? "New" : "Old"} Tax Regime, your total tax liability is ₹${results.totalTax.toLocaleString("en-IN")}, representing an effective tax rate of ${effectiveTaxRate}% on a gross income of ₹${results.grossIncome.toLocaleString("en-IN")}.`}
            secondaryMetrics={[
              {
                label: "Effective Rate",
                value: `${effectiveTaxRate}%`,
              },
              {
                label: "Monthly Take-Home",
                value: `₹${formatINR(monthlyTakeHome)}`,
              },
              {
                label: "Taxable Income",
                value: formatINR(results.totalTaxableIncome),
              },
              {
                label: "Standard Deduction",
                value: formatINR(results.standardDeduction),
              },
            ]}
            breakdown={[
              {
                label: "Taxable Income",
                value: results.totalTaxableIncome,
                color: "blue",
                formattedValue: formatINR(results.totalTaxableIncome),
              },
              {
                label: "Total Deductions",
                value: results.totalDeductions,
                color: "purple",
                formattedValue: formatINR(results.totalDeductions),
              },
              {
                label: "Net Tax",
                value: results.totalTax,
                color: "red",
                formattedValue: formatINR(results.totalTax),
              },
            ]}
          />

          {/* Old vs New Regime Comparison Card */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Regime Comparison: Old vs New
                </h3>
                <p className="text-xs text-muted-foreground">
                  Statutory Regime Comparison
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWhyComparison(!showWhyComparison)}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why?</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Old Regime Tile */}
              <div
                onClick={() => onRegime("old")}
                className={cn(
                  "p-4 rounded-xl border-2 text-center cursor-pointer transition-all",
                  inputs.regime === "old"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-muted/40"
                )}
              >
                <p className="text-xs text-muted-foreground font-semibold">Old Regime Tax</p>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 tabular-nums">
                  ₹{results.comparison.oldRegimeTax.toLocaleString("en-IN")}
                </p>
                {inputs.regime === "old" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary mt-1.5 inline-block">
                    Selected
                  </span>
                )}
              </div>

              {/* New Regime Tile */}
              <div
                onClick={() => onRegime("new")}
                className={cn(
                  "p-4 rounded-xl border-2 text-center cursor-pointer transition-all",
                  inputs.regime === "new"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-muted/40"
                )}
              >
                <p className="text-xs text-muted-foreground font-semibold">New Regime Tax</p>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 tabular-nums">
                  ₹{results.comparison.newRegimeTax.toLocaleString("en-IN")}
                </p>
                {inputs.regime === "new" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary mt-1.5 inline-block">
                    Selected
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation Banner */}
            <div
              className={cn(
                "mt-4 p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-center border",
                results.comparison.savings > 0
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {results.comparison.savings > 0
                ? `The ${results.comparison.recommendation === "new" ? "New" : "Old"} Regime saves you ₹${results.comparison.savings.toLocaleString("en-IN")} in annual taxes.`
                : "Both tax regimes yield identical tax liabilities for this income level."}
            </div>

            {/* Expandable "Why?" Detail */}
            {showWhyComparison && (
              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2 animate-in fade-in duration-150">
                <p className="font-semibold text-foreground">
                  How this comparison was calculated:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground leading-relaxed">
                  <li>
                    <strong>New Regime:</strong> Benefits from the enhanced ₹75,000 standard deduction (for salary income) and the Section 157 full tax rebate up to ₹12 Lakh taxable ordinary income.
                  </li>
                  <li>
                    <strong>Old Regime:</strong> Slabs are steeper, but it allows itemized deductions under Chapter VI-A (Section 80C up to ₹1.5L, Section 80D up to ₹1L, and HRA exemption).
                  </li>
                  <li>
                    <strong>Break-Even Point:</strong> For a salaried taxpayer earning ₹15 Lakhs, itemized deductions in excess of ₹3.75 Lakhs are generally required for the Old Regime to become more beneficial.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* 80C Tax Saving Suggestion */}
          {inputs.regime === "old" &&
            (inputs.deduction80C ?? 0) < 150000 &&
            potential80CSavings > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Tax Optimization Opportunity
                </p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                  Investing ₹{formatINR(150000 - (inputs.deduction80C ?? 0))} more in Section 80C (ELSS, PPF, EPF) will reduce your tax by ₹{formatINR(potential80CSavings)}.
                </p>
                <button
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, deduction80C: 150000 }))}
                  className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300 underline hover:opacity-80"
                >
                  Apply full ₹1,50,000 80C deduction →
                </button>
              </div>
            )}

          {/* Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </div>

          {/* Tax Slab Chart */}
          {results.slabBreakdown.length > 0 && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">
                  Tax Slab Distribution ({inputs.regime === "new" ? "New" : "Old"} Regime)
                </h3>
              </div>
              <div className="h-[260px]">
                <TaxChart slabs={results.slabBreakdown} />
              </div>
            </div>
          )}

          {/* Detailed Statutory Breakdown Table */}
          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground">
                Detailed Statutory Tax Computation
              </h3>
            </div>
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Detailed Statutory Breakdown Table"
            >
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold uppercase text-[11px] tracking-wider">
                      Tax Component
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Taxable Amount
                    </th>
                    <th className="px-4 py-3 text-right font-semibold uppercase text-[11px] tracking-wider">
                      Tax
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {results.slabBreakdown.map((s, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground/90 font-medium">
                        {s.slab}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                        {s.rate}%
                      </td>
                      <td className="px-4 py-3 text-right text-foreground/80 tabular-nums">
                        {formatINR(s.amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-700 dark:text-rose-300 tabular-nums">
                        {formatINR(s.tax)}
                      </td>
                    </tr>
                  ))}
                  {results.rebateAmount > 0 && (
                    <tr className="bg-emerald-500/10 font-semibold text-emerald-800 dark:text-emerald-300">
                      <td className="px-4 py-3" colSpan={3}>
                        Tax Rebate ({results.isMarginalRebateApplied ? "Section 157(2)(b) Marginal Relief" : "Section 157"})
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        - {formatINR(results.rebateAmount)}
                      </td>
                    </tr>
                  )}
                  {results.surcharge > 0 && (
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground" colSpan={3}>
                        Surcharge (Marginal Relief applied)
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                        {formatINR(results.surcharge)}
                      </td>
                    </tr>
                  )}
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground" colSpan={3}>
                      Health & Education Cess (4%)
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                      {formatINR(results.cess)}
                    </td>
                  </tr>
                  <tr className="bg-muted font-bold text-foreground">
                    <td className="px-4 py-3.5" colSpan={3}>
                      Total Net Tax Payable
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-rose-700 dark:text-rose-300 tabular-nums text-sm sm:text-base">
                      ₹{results.totalTax.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
