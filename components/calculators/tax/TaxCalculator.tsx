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
import { clsx } from "clsx";
import { ChevronDown, ChevronUp, ShieldCheck, Sparkles } from "lucide-react";

const TaxChart = dynamic(
  () => import("@/components/calculators/tax/TaxChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function TaxCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [inputs, setInputs] = useState<TaxInput>({
    grossIncome: 1200000,
    salaryIncome: 1200000,
    interestAndOtherIncome: 0,
    businessIncome: 0,
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
  });
  const [shareId, setShareId] = useState<string | null>(null);

  const debouncedInputs = useDebounce(inputs, 200);
  const results = useMemo(() => calcTax(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateTaxInsights(results), [results]);

  useEffect(() => setShareId(null), [debouncedInputs]);

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

  // Exact engine recomputation for 80C optimization (never guessed multiplier)
  const potential80CSavings = useMemo(() => {
    if (inputs.regime !== "old" || (inputs.deduction80C ?? 0) >= 150000) return 0;
    const optimized = calcTax({
      ...debouncedInputs,
      deduction80C: 150000,
    });
    return Math.max(0, results.totalTax - optimized.totalTax);
  }, [inputs.regime, inputs.deduction80C, debouncedInputs, results.totalTax]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Total Tax" value={results.totalTax} />

      <div className="grid grid-cols-1 lg:grid-cols-[430px_1fr] gap-6 mt-6">
        {/* ────── INPUT PANEL ────── */}
        <div className="surface-card h-fit space-y-4 p-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Tax Parameters (AY 2026-27)
            </h2>
            <span className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
              Finance Act, 2026
            </span>
          </div>

          {/* Primary Income Input */}
          {!showAdvanced ? (
            <HybridInput
              label="Salary / Pension Income"
              value={inputs.salaryIncome ?? inputs.grossIncome ?? 1200000}
              onChange={onSimpleSalary}
              min={100000}
              max={100000000}
              step={50000}
              prefix="₹"
              hint="Eligible for ₹75,000 New Regime standard deduction"
              quickChips={[
                { label: "₹7.5L", value: 750000 },
                { label: "₹12L", value: 1200000 },
                { label: "₹12.75L", value: 1275000 },
                { label: "₹15L", value: 1500000 },
                { label: "₹25L", value: 2500000 },
                { label: "₹50L", value: 5000000 },
              ]}
            />
          ) : (
            <div className="space-y-3">
              <HybridInput
                label="Salary / Pension Income"
                value={inputs.salaryIncome ?? 0}
                onChange={(v) => setInputs((p) => ({ ...p, salaryIncome: v }))}
                min={0}
                max={100000000}
                step={50000}
                prefix="₹"
                hint="Standard deduction applies only to this portion"
              />
              <HybridInput
                label="Interest & Other Income"
                value={inputs.interestAndOtherIncome ?? 0}
                onChange={(v) => setInputs((p) => ({ ...p, interestAndOtherIncome: v }))}
                min={0}
                max={100000000}
                step={25000}
                prefix="₹"
                hint="Savings interest, FD interest, dividend, etc."
              />
              <HybridInput
                label="Business / Professional Income (PGBP)"
                value={inputs.businessIncome ?? 0}
                onChange={(v) => setInputs((p) => ({ ...p, businessIncome: v }))}
                min={0}
                max={100000000}
                step={50000}
                prefix="₹"
                hint="Net taxable profit from business or profession"
              />
              <div className="pt-2 border-t border-border/60 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Special Rate Capital Gains
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <HybridInput
                    label="Equity LTCG (112A)"
                    value={inputs.equityLtcg ?? 0}
                    onChange={(v) => setInputs((p) => ({ ...p, equityLtcg: v }))}
                    min={0}
                    max={50000000}
                    step={25000}
                    prefix="₹"
                    hint="12.5% above ₹1.25L"
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
            </div>
          )}

          {/* Advanced Income Details Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 text-xs font-medium text-foreground hover:bg-muted/50 transition"
          >
            <span>{showAdvanced ? "Hide Advanced Income Streams" : "Configure Multiple Income Streams & Residency"}</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
          </button>

          {/* Residency & Age Options */}
          {showAdvanced && (
            <div className="space-y-3 p-3 bg-muted/40 border border-border/60 rounded-xl">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Taxpayer Residential Status
                </label>
                <select
                  value={inputs.residency ?? "resident_individual"}
                  onChange={(e) => setInputs((p) => ({ ...p, residency: e.target.value as TaxpayerResidency }))}
                  className="w-full bg-card border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="resident_individual">Resident Individual (Section 156 Rebate Eligible)</option>
                  <option value="nri">Non-Resident Indian / NRI (Rebate Ineligible)</option>
                  <option value="other">Other / Entity</option>
                </select>
              </div>

              {inputs.regime === "old" && (
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Age Category (Old Regime Exemption)
                  </label>
                  <select
                    value={inputs.ageCategory ?? "below_60"}
                    onChange={(e) => setInputs((p) => ({ ...p, ageCategory: e.target.value as TaxpayerAgeCategory }))}
                    className="w-full bg-card border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="below_60">Below 60 Years (₹2.5 Lakh Nil slab)</option>
                    <option value="senior_60_to_79">Senior Citizen: 60 to 79 Years (₹3.0 Lakh Nil slab)</option>
                    <option value="super_senior_80_plus">Super Senior: 80+ Years (₹5.0 Lakh Nil slab)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Regime toggle — prominent, full width */}
          <div className="grid grid-cols-2 gap-2">
            {(["new", "old"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRegime(r)}
                className={clsx(
                  "py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 text-left px-3",
                  inputs.regime === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{r === "new" ? "⚡ New Regime" : "📋 Old Regime"}</span>
                  {inputs.regime === r && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className="block text-[11px] font-normal opacity-85 mt-0.5">
                  {r === "new" ? "₹75,000 std ded + ₹12L rebate" : "Itemized Chapter VI-A deductions"}
                </span>
              </button>
            ))}
          </div>

          {/* Deductions for Old Regime */}
          {inputs.regime === "old" && (
            <div className="space-y-3 mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Old Regime Deductions
              </p>
              <HybridInput
                label="Section 80C"
                value={inputs.deduction80C ?? 0}
                onChange={on80C}
                min={0}
                max={150000}
                step={5000}
                prefix="₹"
                hint="ELSS, PPF, EPF, LIC, Tax-Saver FD (Max ₹1.5L)"
                quickChips={[
                  { label: "₹50K", value: 50000 },
                  { label: "₹1L", value: 100000 },
                  { label: "₹1.5L", value: 150000 },
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
                hint="Self, family & parents health insurance (Max ₹1L)"
                quickChips={[
                  { label: "₹25K", value: 25000 },
                  { label: "₹50K", value: 50000 },
                  { label: "₹75K", value: 75000 },
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
                hint="Additional voluntary NPS deduction (Max ₹50K)"
              />
              <HybridInput
                label="HRA Exemption u/s 10(13A)"
                value={inputs.hraExemption ?? 0}
                onChange={onHRA}
                min={0}
                max={2000000}
                step={10000}
                prefix="₹"
                hint="Exempt portion of house rent allowance"
              />
              <HybridInput
                label="Other Deductions (80E, 80G, etc.)"
                value={inputs.otherDeductions ?? 0}
                onChange={onOther}
                min={0}
                max={1000000}
                step={5000}
                prefix="₹"
                hint="Education loan interest, donations, etc."
              />
            </div>
          )}

          {/* Statutory Explanatory Badges */}
          <div className="space-y-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>
                {inputs.regime === "new"
                  ? "₹75,000 salary standard deduction applies exclusively to salary/pension income."
                  : "₹50,000 standard deduction + itemized Chapter VI-A deductions applied."}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>
                Section 156 rebate & marginal relief applies to Resident Individuals up to ₹12,70,588 taxable ordinary income.
              </span>
            </div>
          </div>
        </div>

        {/* ────── RESULTS PANEL ────── */}
        <div className="space-y-5">
          <ResultHero
            label="Total Tax Payable"
            value={results.totalTax}
            breakdown={[
              { label: "Gross Income", value: results.grossIncome, color: "blue" },
              { label: "Total Deductions", value: results.totalDeductions, color: "purple" },
              { label: "Total Tax", value: results.totalTax, color: "red" },
            ]}
          />

          {/* Regime Comparison Card */}
          <div className="surface-card p-5">
            <h3 className="font-semibold text-card-foreground mb-4">Old vs New Regime Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={clsx(
                  "rounded-xl p-4 border-2 text-center transition",
                  inputs.regime === "old"
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-muted/40"
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">Old Regime Tax</p>
                <p className="text-xl font-bold text-foreground">{formatINR(results.comparison.oldRegimeTax)}</p>
                {inputs.regime === "old" && (
                  <span className="text-[11px] text-primary font-semibold mt-1 inline-block">Active Selection</span>
                )}
              </div>
              <div
                className={clsx(
                  "rounded-xl p-4 border-2 text-center transition",
                  inputs.regime === "new"
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-muted/40"
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">New Regime Tax</p>
                <p className="text-xl font-bold text-foreground">{formatINR(results.comparison.newRegimeTax)}</p>
                {inputs.regime === "new" && (
                  <span className="text-[11px] text-primary font-semibold mt-1 inline-block">Active Selection</span>
                )}
              </div>
            </div>
            <div
              className={clsx(
                "mt-4 rounded-xl p-3 text-xs sm:text-sm text-center font-medium",
                results.comparison.savings > 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {results.comparison.savings > 0
                ? `✅ ${results.comparison.recommendation === "new" ? "New" : "Old"} Regime saves you ${formatINR(results.comparison.savings)} in tax.`
                : "Both tax regimes yield the exact same tax liability."}
            </div>
          </div>

          {/* 80C Tax Saving Suggestion (Engine Recomputed) */}
          {inputs.regime === "old" && (inputs.deduction80C ?? 0) < 150000 && potential80CSavings > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                💡 Recomputed Tax-Saving Opportunity
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                Investing {formatINR(150000 - (inputs.deduction80C ?? 0))} more under Section 80C (ELSS / PPF / EPF) will reduce your tax by exactly {formatINR(potential80CSavings)}.
              </p>
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, deduction80C: 150000 }))}
                className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 underline transition hover:opacity-80"
              >
                Apply maximum 80C deduction (₹1,50,000) →
              </button>
            </div>
          )}

          {/* Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </div>

          {/* Slab Chart */}
          {results.slabBreakdown.length > 0 && (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">
                  Tax Slab Breakdown ({inputs.regime === "new" ? "New" : "Old"} Regime)
                </h3>
              </div>
              <div className="h-[300px]">
                <TaxChart slabs={results.slabBreakdown} />
              </div>
            </div>
          )}

          {/* Detailed Breakdown Table */}
          <div className="table-surface">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Detailed Statutory Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-head">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Tax Component
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Taxable Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Tax
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.slabBreakdown.map((s, i) => (
                    <tr key={i} className="table-row text-foreground/80">
                      <td className="px-6 py-3">{s.slab}</td>
                      <td className="px-6 py-3 text-right">{s.rate}%</td>
                      <td className="px-6 py-3 text-right">{formatINR(s.amount)}</td>
                      <td className="px-6 py-3 text-right font-medium text-destructive">{formatINR(s.tax)}</td>
                    </tr>
                  ))}
                  {results.rebateAmount > 0 && (
                    <tr className="table-row text-emerald-600 dark:text-emerald-400">
                      <td className="px-6 py-3" colSpan={3}>
                        Tax Rebate ({results.isMarginalRebateApplied ? "Section 156(2)(b) Marginal Relief" : "Section 156"})
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        - {formatINR(results.rebateAmount)}
                      </td>
                    </tr>
                  )}
                  {results.surcharge > 0 && (
                    <tr className="table-row text-foreground/80">
                      <td className="px-6 py-3" colSpan={3}>
                        Surcharge (after Marginal Relief)
                      </td>
                      <td className="px-6 py-3 text-right font-medium">{formatINR(results.surcharge)}</td>
                    </tr>
                  )}
                  <tr className="table-row text-foreground/80">
                    <td className="px-6 py-3" colSpan={3}>
                      Health & Education Cess (4%)
                    </td>
                    <td className="px-6 py-3 text-right font-medium">{formatINR(results.cess)}</td>
                  </tr>
                  <tr className="bg-muted font-semibold text-foreground">
                    <td className="px-6 py-3.5" colSpan={3}>
                      Total Net Tax Payable
                    </td>
                    <td className="px-6 py-3.5 text-right text-destructive">{formatINR(results.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <SaveCalculationButton
              calcType="Tax"
              data={{ inputs: debouncedInputs as unknown as Record<string, unknown>, results: results as unknown as Record<string, unknown> }}
              onSaved={setShareId}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>
      </div>
    </>
  );
}
