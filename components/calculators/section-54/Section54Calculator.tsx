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
import { calcSection54Exemption } from "@/lib/math";
import type { Section54Type, Section54PropertyMode, Section54ExemptionInput } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import {
  Building,
  Landmark,
  Scale,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Gem,
} from "lucide-react";

const Section54Chart = dynamic(
  () => import("@/components/calculators/section-54/Section54Chart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function Section54Calculator() {
  const [mounted, setMounted] = useState(false);
  const [capitalGainsAmount, setCapitalGainsAmount] = useState(6000000); // 60 Lakhs
  const [netSaleConsideration, setNetSaleConsideration] = useState(10000000); // 1 Cr
  const [existingHousesCount, setExistingHousesCount] = useState(0); // For 54F
  const [sectionType, setSectionType] = useState<Section54Type>("compare_both");
  const [propertyInvestmentAmount, setPropertyInvestmentAmount] = useState(6000000);
  const [propertyMode, setPropertyMode] = useState<Section54PropertyMode>("purchase");
  const [propertyTimelineMonths, setPropertyTimelineMonths] = useState(6);
  const [bondsInvestmentAmount, setBondsInvestmentAmount] = useState(5000000);
  const [bondsTimelineMonths, setBondsTimelineMonths] = useState(3);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: Section54ExemptionInput = useMemo(
    () => ({
      capitalGainsAmount,
      netSaleConsideration,
      existingResidentialHousesCount: existingHousesCount,
      sectionType,
      propertyInvestmentAmount,
      propertyMode,
      propertyTimelineMonths,
      bondsInvestmentAmount,
      bondsTimelineMonths,
      taxRatePercent: 12.5,
    }),
    [
      capitalGainsAmount,
      netSaleConsideration,
      existingHousesCount,
      sectionType,
      propertyInvestmentAmount,
      propertyMode,
      propertyTimelineMonths,
      bondsInvestmentAmount,
      bondsTimelineMonths,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);

  const result = useMemo(() => {
    return calcSection54Exemption(debouncedInputs);
  }, [debouncedInputs]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Tax Saved" value={result.activeResult.taxSaved} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Capital Gains Input */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Capital Asset Sale & Gain Details</h3>
              <span className="text-xs text-muted-foreground font-medium">
                Tax @ {result.effectiveTaxRateBeforeExemption}%: {formatINR(result.taxBeforeExemption)}
              </span>
            </div>

            <HybridInput
              label="Long-Term Capital Gain (LTCG Amount)"
              value={capitalGainsAmount}
              onChange={setCapitalGainsAmount}
              min={0}
              max={200000000}
              step={100000}
              prefix="₹"
            />

            {sectionType === "section_54f_property" && (
              <HybridInput
                label="Net Sale Consideration (Sale Price - Transfer Expenses)"
                hint="Required for Section 54F proportionate exemption calculation"
                value={netSaleConsideration}
                onChange={setNetSaleConsideration}
                min={capitalGainsAmount}
                max={500000000}
                step={500000}
                prefix="₹"
              />
            )}

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[2500000, 5000000, 7500000, 10000000, 20000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setCapitalGainsAmount(amt);
                    setPropertyInvestmentAmount(amt);
                    setNetSaleConsideration(Math.round(amt * 1.6));
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border bg-muted/50 hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Exemption Section Selector */}
          <div className="surface-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Statutory Exemption Route
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSectionType("section_54_property")}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54_property"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-xs font-bold">Section 54</div>
                <div className="text-[10px] text-muted-foreground">House → House</div>
              </button>

              <button
                type="button"
                onClick={() => setSectionType("section_54ec_bonds")}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54ec_bonds"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Landmark className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <div className="text-xs font-bold">Section 54EC</div>
                <div className="text-[10px] text-muted-foreground">REC / NHAI Bonds</div>
              </button>

              <button
                type="button"
                onClick={() => setSectionType("section_54f_property")}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54f_property"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Gem className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <div className="text-xs font-bold">Section 54F</div>
                <div className="text-[10px] text-muted-foreground">Plot/Gold → House</div>
              </button>

              <button
                type="button"
                onClick={() => setSectionType("compare_both")}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "compare_both"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Scale className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-xs font-bold">Compare All</div>
                <div className="text-[10px] text-muted-foreground">Side-by-Side</div>
              </button>
            </div>
          </div>

          {/* Section 54 / 54F Property Inputs */}
          {(sectionType === "section_54_property" || sectionType === "section_54f_property" || sectionType === "compare_both") && (
            <div className="surface-card p-5 space-y-4 border border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    {sectionType === "section_54f_property"
                      ? "Section 54F: Residential House Reinvestment"
                      : "Section 54: Residential Property Reinvestment"}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                  Max Cap: ₹10 Cr
                </span>
              </div>

              <HybridInput
                label="Amount Reinvested in New Residential House"
                value={propertyInvestmentAmount}
                onChange={setPropertyInvestmentAmount}
                min={0}
                max={100000000}
                step={100000}
                prefix="₹"
              />

              {sectionType === "section_54f_property" && (
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className="text-xs font-medium text-foreground block">
                    Existing Residential Houses Owned on Sale Date
                  </label>
                  <select
                    value={existingHousesCount}
                    onChange={(e) => setExistingHousesCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={0}>0 houses (Fully Eligible)</option>
                    <option value={1}>1 house (Fully Eligible u/s 54F)</option>
                    <option value={2}>2 or more houses (Disqualified u/s 54F)</option>
                  </select>
                </div>
              )}

              {/* Mode & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Reinvestment Nature
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setPropertyMode("purchase")}
                      className={clsx(
                        "py-1 rounded",
                        propertyMode === "purchase" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                      )}
                    >
                      Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyMode("construction")}
                      className={clsx(
                        "py-1 rounded",
                        propertyMode === "construction" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                      )}
                    >
                      Construction
                    </button>
                  </div>
                </div>

                <div>
                  <HybridInput
                    label={
                      propertyMode === "purchase"
                        ? "Months Relative to Sale (-12 to +24)"
                        : "Months from Sale Date (0 to +36)"
                    }
                    value={propertyTimelineMonths}
                    onChange={setPropertyTimelineMonths}
                    min={propertyMode === "purchase" ? -12 : 0}
                    max={propertyMode === "purchase" ? 36 : 48}
                    step={1}
                    suffix="m"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 54EC Inputs */}
          {(sectionType === "section_54ec_bonds" || sectionType === "compare_both") && (
            <div className="surface-card p-5 space-y-4 border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    Section 54EC: Capital Gains Bonds (REC / NHAI / PFC)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                  Max Cap: ₹50 Lakh
                </span>
              </div>

              <HybridInput
                label="Amount Invested in Specified Bonds"
                value={bondsInvestmentAmount}
                onChange={setBondsInvestmentAmount}
                min={0}
                max={5000000}
                step={50000}
                prefix="₹"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div className="text-xs text-muted-foreground flex items-center">
                  <span>5-Year lock-in at ~5.25% taxable interest p.a.</span>
                </div>
                <div>
                  <HybridInput
                    label="Months from Sale Date (Max: 6m)"
                    value={bondsTimelineMonths}
                    onChange={setBondsTimelineMonths}
                    min={0}
                    max={12}
                    step={1}
                    suffix="m"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Card */}
          <ResultHero
            label="Total Tax Saved by Exemption"
            value={result.activeResult.taxSaved}
            breakdown={[
              { label: "Tax-Exempt LTCG", value: result.activeResult.exemptionAllowed, color: "green" },
              { label: "Taxable LTCG Remaining", value: result.activeResult.taxableGainsRemaining, color: "blue" },
              { label: "Tax Payable After Exemption", value: result.activeResult.taxAfterExemption, color: "red" },
            ]}
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="surface-card p-3.5 text-center">
              <div className="text-xs text-muted-foreground">Exemption Allowed</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(result.activeResult.exemptionAllowed)}
              </div>
              {result.activeResult.proportionateExemptionApplied && (
                <span className="text-[10px] text-amber-500 font-medium block">Proportionate u/s 54F</span>
              )}
            </div>

            <div className="surface-card p-3.5 text-center">
              <div className="text-xs text-muted-foreground">Tax Payable</div>
              <div className="text-base font-bold text-foreground mt-1">
                {formatINR(result.activeResult.taxAfterExemption)}
              </div>
              <div className="text-[10px] text-muted-foreground">
                (was {formatINR(result.taxBeforeExemption)})
              </div>
            </div>

            <div className="surface-card p-3.5 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-muted-foreground">Eligibility & Timeline</div>
              <div className="text-xs font-bold mt-1.5 flex items-center justify-center gap-1">
                {result.activeResult.disqualified ? (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Disqualified
                  </span>
                ) : result.activeResult.isValidTimeline ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid Window
                  </span>
                ) : (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Expired Window
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Disqualification / Timeline Alerts */}
          {result.activeResult.disqualified && (
            <div className="surface-card p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed">
                {result.activeResult.disqualificationReason}
              </p>
            </div>
          )}

          {!result.activeResult.isValidTimeline && !result.activeResult.disqualified && (
            <div className="surface-card p-4 rounded-xl border border-destructive/40 bg-destructive/5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed">
                {result.activeResult.timelineMessage}
              </p>
            </div>
          )}

          {/* Side-by-Side Comparison Card */}
          {result.comparison && (
            <div className="surface-card p-5 space-y-4 border-2 border-purple-500/30">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-foreground">
                  Section 54 vs 54EC vs 54F Comparison
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left">
                      <th className="py-2 pr-2">Feature</th>
                      <th className="py-2 px-2">Section 54 (House)</th>
                      <th className="py-2 px-2">Section 54EC (Bonds)</th>
                      {result.comparison.section54f && <th className="py-2 pl-2">Section 54F (Plot/Gold)</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Exemption Allowed</td>
                      <td className="py-2 px-2 font-bold text-emerald-600">
                        {formatINR(result.comparison.section54.exemptionAllowed)}
                      </td>
                      <td className="py-2 px-2 font-bold text-emerald-600">
                        {formatINR(result.comparison.section54ec.exemptionAllowed)}
                      </td>
                      {result.comparison.section54f && (
                        <td className="py-2 pl-2 font-bold text-emerald-600">
                          {formatINR(result.comparison.section54f.exemptionAllowed)}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Statutory Cap</td>
                      <td className="py-2 px-2">₹10 Crore</td>
                      <td className="py-2 px-2">₹50 Lakh / year</td>
                      {result.comparison.section54f && <td className="py-2 pl-2">₹10 Cr (Proportionate)</td>}
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Lock-in Period</td>
                      <td className="py-2 px-2">3 Years (House)</td>
                      <td className="py-2 px-2">5 Years (Bonds)</td>
                      {result.comparison.section54f && <td className="py-2 pl-2">3 Years (House)</td>}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-xs text-purple-950 dark:text-purple-200 leading-relaxed border border-purple-200 dark:border-purple-800">
                {result.comparison.recommendation}
              </div>
            </div>
          )}

          {/* Donut Chart */}
          <div className="surface-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Exemption & Tax Breakdown</h3>
            <div className="h-56">
              <Section54Chart
                exemptionAllowed={result.activeResult.exemptionAllowed}
                taxableGainsRemaining={result.activeResult.taxableGainsRemaining}
                taxAfterExemption={result.activeResult.taxAfterExemption}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <SaveCalculationButton
              calcType="Section 54 Exemption"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: {
                  initialGains: result.initialLtcgGains,
                  exemptionAllowed: result.activeResult.exemptionAllowed,
                  taxSaved: result.activeResult.taxSaved,
                  taxPayable: result.activeResult.taxAfterExemption,
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
