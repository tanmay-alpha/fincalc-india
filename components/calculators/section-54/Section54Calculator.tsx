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
import type {
  Section54Type,
  Section54PropertyMode,
  Section54OriginalAssetType,
  Section54ExemptionInput,
} from "@/lib/math";
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
  Info,
} from "lucide-react";

const Section54Chart = dynamic(
  () => import("@/components/calculators/section-54/Section54Chart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function Section54Calculator() {
  const [mounted, setMounted] = useState(false);
  const [originalAssetType, setOriginalAssetType] =
    useState<Section54OriginalAssetType>("residential_house");
  const [capitalGainsAmount, setCapitalGainsAmount] = useState(6000000); // 60 Lakhs
  const [netSaleConsideration, setNetSaleConsideration] = useState(10000000); // 1 Cr
  const [existingHousesCount, setExistingHousesCount] = useState(0); // For 54F / 86
  const [sectionType, setSectionType] = useState<Section54Type>("compare_both");

  // Section 82 (formerly 54) specific state
  const [section54InvestmentAmount, setSection54InvestmentAmount] = useState(6000000);
  const [section54PropertyMode, setSection54PropertyMode] =
    useState<Section54PropertyMode>("purchase");
  const [section54TimelineMonths, setSection54TimelineMonths] = useState(6);
  // Section 82 once-in-a-lifetime two-house option
  const [useTwoResidentialHousesOption, setUseTwoResidentialHousesOption] = useState(false);
  const [twoHousesOptionExercisedPreviously, setTwoHousesOptionExercisedPreviously] = useState(false);
  const [secondPropertyInvestmentAmount, setSecondPropertyInvestmentAmount] = useState(0);

  // Section 85 (formerly 54EC) specific state
  const [bondsInvestmentAmount, setBondsInvestmentAmount] = useState(5000000);
  const [bondsTimelineMonths, setBondsTimelineMonths] = useState(3);

  // Section 86 (formerly 54F) specific state
  const [section54fInvestmentAmount, setSection54fInvestmentAmount] = useState(6000000);
  const [section54fPropertyMode, setSection54fPropertyMode] =
    useState<Section54PropertyMode>("purchase");
  const [section54fTimelineMonths, setSection54fTimelineMonths] = useState(6);

  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const is54FApplicable =
    sectionType === "section_54f_property" ||
    (sectionType === "compare_both" && originalAssetType !== "residential_house");

  const inputs: Section54ExemptionInput = useMemo(
    () => ({
      capitalGainsAmount,
      netSaleConsideration: is54FApplicable ? netSaleConsideration : undefined,
      existingResidentialHousesCount: existingHousesCount,
      sectionType,
      originalAssetType,
      taxRatePercent: 12.5,
      // Section 82 parameters
      section54InvestmentAmount,
      section54PropertyMode,
      section54TimelineMonths,
      useTwoResidentialHousesOption,
      twoHousesOptionExercisedPreviously,
      secondPropertyInvestmentAmount: useTwoResidentialHousesOption ? secondPropertyInvestmentAmount : undefined,
      // Section 85 parameters
      bondsInvestmentAmount,
      bondsTimelineMonths,
      // Section 86 parameters
      section54fInvestmentAmount,
      section54fPropertyMode,
      section54fTimelineMonths,
      // Compatibility fallback
      propertyInvestmentAmount:
        originalAssetType === "residential_house"
          ? section54InvestmentAmount
          : section54fInvestmentAmount,
      propertyMode:
        originalAssetType === "residential_house"
          ? section54PropertyMode
          : section54fPropertyMode,
      propertyTimelineMonths:
        originalAssetType === "residential_house"
          ? section54TimelineMonths
          : section54fTimelineMonths,
    }),
    [
      capitalGainsAmount,
      netSaleConsideration,
      is54FApplicable,
      existingHousesCount,
      sectionType,
      originalAssetType,
      section54InvestmentAmount,
      section54PropertyMode,
      section54TimelineMonths,
      useTwoResidentialHousesOption,
      twoHousesOptionExercisedPreviously,
      secondPropertyInvestmentAmount,
      bondsInvestmentAmount,
      bondsTimelineMonths,
      section54fInvestmentAmount,
      section54fPropertyMode,
      section54fTimelineMonths,
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
          {/* Step 1: Original Asset Sold Selector */}
          <div className="surface-card p-5 space-y-3 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Original Capital Asset Transferred (Sold)
              </label>
              <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">
                Income-tax Act, 2025 Gate
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Under the Income-tax Act, 2025, available statutory exemption routes depend strictly on the type of long-term asset transferred.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setOriginalAssetType("residential_house");
                  if (sectionType === "section_54f_property") {
                    setSectionType("section_54_property");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-left transition-all",
                  originalAssetType === "residential_house"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm ring-1 ring-primary/40"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-500 shrink-0" />
                  Residential House
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Eligible: <strong className="text-foreground">Sec 82 & 85</strong> (formerly 54 & 54EC)
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOriginalAssetType("land_or_building_non_residential");
                  if (sectionType === "section_54_property") {
                    setSectionType("section_54ec_bonds");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-left transition-all",
                  originalAssetType === "land_or_building_non_residential"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm ring-1 ring-primary/40"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-emerald-500 shrink-0" />
                  Commercial / Plot
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Eligible: <strong className="text-foreground">Sec 85 & 86</strong> (formerly 54EC & 54F)
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOriginalAssetType("other_long_term_asset");
                  if (sectionType === "section_54_property" || sectionType === "section_54ec_bonds") {
                    setSectionType("section_54f_property");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-left transition-all",
                  originalAssetType === "other_long_term_asset"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm ring-1 ring-primary/40"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-amber-500 shrink-0" />
                  Shares, Gold, etc.
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Eligible: <strong className="text-foreground">Sec 86 Only</strong> (formerly 54F)
                </div>
              </button>
            </div>
          </div>

          {/* Capital Gains & Sale Input */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Sale & Capital Gain Details</h3>
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

            {is54FApplicable && (
              <HybridInput
                label="Net Sale Consideration (Sale Price - Transfer Expenses)"
                hint="Statutorily required for Section 86 (formerly Section 54F) proportionate exemption calculation"
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
                    setSection54InvestmentAmount(amt);
                    setSection54fInvestmentAmount(amt);
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
              Select Exemption Route
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSectionType("section_54_property");
                  if (originalAssetType !== "residential_house") {
                    setOriginalAssetType("residential_house");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54_property"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-xs font-bold">Section 82</div>
                <div className="text-[10px] text-muted-foreground">formerly Sec 54</div>
                <div className="text-[9px] text-primary/80 font-medium">House → House</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSectionType("section_54ec_bonds");
                  if (originalAssetType === "other_long_term_asset") {
                    setOriginalAssetType("land_or_building_non_residential");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54ec_bonds"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Landmark className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <div className="text-xs font-bold">Section 85</div>
                <div className="text-[10px] text-muted-foreground">formerly Sec 54EC</div>
                <div className="text-[9px] text-primary/80 font-medium">REC / NHAI Bonds</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSectionType("section_54f_property");
                  if (originalAssetType === "residential_house") {
                    setOriginalAssetType("land_or_building_non_residential");
                  }
                }}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  sectionType === "section_54f_property"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <Gem className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <div className="text-xs font-bold">Section 86</div>
                <div className="text-[10px] text-muted-foreground">formerly Sec 54F</div>
                <div className="text-[9px] text-primary/80 font-medium">Other → House</div>
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
                <div className="text-[10px] text-muted-foreground">Sec 82, 85, 86</div>
                <div className="text-[9px] text-primary/80 font-medium">Eligible Routes</div>
              </button>
            </div>
          </div>

          {/* Section 82 Inputs (Residential House -> Residential House) */}
          {(sectionType === "section_54_property" ||
            (sectionType === "compare_both" && originalAssetType === "residential_house")) && (
            <div className="surface-card p-5 space-y-4 border border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Section 82 — Residential House Exemption
                    </h3>
                    <div className="text-[10px] text-muted-foreground">
                      Formerly Section 54 of Income-tax Act, 1961
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                  Max Cap: ₹10 Cr
                </span>
              </div>

              <HybridInput
                label={useTwoResidentialHousesOption ? "Reinvestment in First Residential House" : "Amount Reinvested in New Residential House"}
                value={section54InvestmentAmount}
                onChange={setSection54InvestmentAmount}
                min={0}
                max={100000000}
                step={100000}
                prefix="₹"
              />

              {/* Mode & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Reinvestment Nature
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setSection54PropertyMode("purchase")}
                      className={clsx(
                        "py-1 rounded",
                        section54PropertyMode === "purchase"
                          ? "bg-background text-foreground shadow-sm font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection54PropertyMode("construction")}
                      className={clsx(
                        "py-1 rounded",
                        section54PropertyMode === "construction"
                          ? "bg-background text-foreground shadow-sm font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      Construction
                    </button>
                  </div>
                </div>

                <div>
                  <HybridInput
                    label={
                      section54PropertyMode === "purchase"
                        ? "Months Relative to Sale (-12 to +24)"
                        : "Months from Sale Date (0 to +36)"
                    }
                    value={section54TimelineMonths}
                    onChange={setSection54TimelineMonths}
                    min={section54PropertyMode === "purchase" ? -12 : 0}
                    max={section54PropertyMode === "purchase" ? 36 : 48}
                    step={1}
                    suffix="m"
                  />
                </div>
              </div>

              {/* Section 82 Two-House Option */}
              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <div className="flex items-start gap-2">
                  <input
                    id="two-house-opt"
                    type="checkbox"
                    checked={useTwoResidentialHousesOption}
                    onChange={(e) => setUseTwoResidentialHousesOption(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <label htmlFor="two-house-opt" className="text-xs text-foreground font-semibold cursor-pointer block">
                      Use once-in-a-lifetime two-residential-house option (Section 82 proviso)
                    </label>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Section 82 proviso allows purchasing/constructing two residential houses in India when LTCG does not exceed ₹2 Crore. Strictly once-in-a-lifetime.
                    </span>
                  </div>
                </div>

                {useTwoResidentialHousesOption && (
                  <div className="pl-6 space-y-3 pt-1">
                    {capitalGainsAmount > 20000000 ? (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
                        ⚠️ Long-Term Capital Gains ({formatINR(capitalGainsAmount)}) exceed the statutory ₹2 Crore limit. The two-house option cannot be exercised; statutory exemption is restricted to one residential house.
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            id="two-house-prev"
                            type="checkbox"
                            checked={twoHousesOptionExercisedPreviously}
                            onChange={(e) => setTwoHousesOptionExercisedPreviously(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <label htmlFor="two-house-prev" className="text-xs text-muted-foreground cursor-pointer">
                            I have previously exercised this option in a prior tax year (option revoked)
                          </label>
                        </div>

                        {!twoHousesOptionExercisedPreviously && (
                          <HybridInput
                            label="Reinvestment in Second Residential House"
                            hint="Combined qualifying cost of both houses is exempt up to statutory limit"
                            value={secondPropertyInvestmentAmount}
                            onChange={setSecondPropertyInvestmentAmount}
                            min={0}
                            max={100000000}
                            step={100000}
                            prefix="₹"
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 85 Inputs (Specified Bonds) */}
          {(sectionType === "section_54ec_bonds" ||
            (sectionType === "compare_both" &&
              (originalAssetType === "residential_house" ||
                originalAssetType === "land_or_building_non_residential"))) && (
            <div className="surface-card p-5 space-y-4 border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Section 85 — Specified Bonds
                    </h3>
                    <div className="text-[10px] text-muted-foreground">
                      Formerly Section 54EC (REC / NHAI / PFC / IRFC)
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                  Max Cap: ₹50 Lakh (Sec 85(2))
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
                  <span>
                    Under Section 85(2), aggregate investment across year of transfer and subsequent year cannot exceed ₹50 Lakh. 5-Year lock-in (~5.25% taxable interest).
                  </span>
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

          {/* Section 86 Inputs (Non-Residential Asset -> Residential House) */}
          {is54FApplicable && (
            <div className="surface-card p-5 space-y-4 border border-amber-500/20 bg-amber-50/10 dark:bg-amber-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Section 86 — Other LTCG Asset → House
                    </h3>
                    <div className="text-[10px] text-muted-foreground">
                      Formerly Section 54F (Plot/Gold/Shares → Residential House)
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                  Max Cap: ₹10 Cr (Proportionate)
                </span>
              </div>

              <HybridInput
                label="Amount Reinvested in New House"
                value={section54fInvestmentAmount}
                onChange={setSection54fInvestmentAmount}
                min={0}
                max={100000000}
                step={100000}
                prefix="₹"
              />

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <label className="text-xs font-medium text-foreground block">
                  Existing Residential Houses Owned on Sale Date
                </label>
                <select
                  value={existingHousesCount}
                  onChange={(e) => setExistingHousesCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-card border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={0}>0 houses (Fully Eligible u/s 86)</option>
                  <option value={1}>1 house (Eligible u/s 86)</option>
                  <option value={2}>2 or more houses (Disqualified u/s 86)</option>
                </select>
              </div>

              {/* Mode & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Reinvestment Nature
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setSection54fPropertyMode("purchase")}
                      className={clsx(
                        "py-1 rounded",
                        section54fPropertyMode === "purchase"
                          ? "bg-background text-foreground shadow-sm font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection54fPropertyMode("construction")}
                      className={clsx(
                        "py-1 rounded",
                        section54fPropertyMode === "construction"
                          ? "bg-background text-foreground shadow-sm font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      Construction
                    </button>
                  </div>
                </div>

                <div>
                  <HybridInput
                    label={
                      section54fPropertyMode === "purchase"
                        ? "Months Relative to Sale (-12 to +24)"
                        : "Months from Sale Date (0 to +36)"
                    }
                    value={section54fTimelineMonths}
                    onChange={setSection54fTimelineMonths}
                    min={section54fPropertyMode === "purchase" ? -12 : 0}
                    max={section54fPropertyMode === "purchase" ? 36 : 48}
                    step={1}
                    suffix="m"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Scope & Post-Reinvestment Compliance Disclosure */}
          <div className="surface-card p-4 rounded-xl border border-border/70 bg-muted/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Info className="w-4 h-4 text-primary shrink-0" />
              Statutory Scope & Post-Reinvestment Compliance Disclosure
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              This planner evaluates statutory eligibility at the <strong>transaction and initial reinvestment stage</strong>.
              Under the Income-tax Act, 2025, exemptions claimed under Section 86 (formerly 54F) and Section 82 (formerly 54) will be revoked and taxed as LTCG in future years if:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] pl-1">
              <li><strong>Ownership restriction:</strong> Purchasing another residential house within 1 year before or 2 years after transfer, or constructing another house within 3 years.</li>
              <li><strong>Holding restriction:</strong> Transferring or selling the newly acquired residential house within 3 years of acquisition or construction.</li>
              <li><strong>CGAS compliance:</strong> Failing to utilize funds deposited in the Capital Gains Account Scheme (CGAS) within the prescribed 3-year statutory period.</li>
            </ul>
          </div>
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
              {result.activeResult.twoHousesOptionApplied && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium block">2 Houses (Sec 82 Proviso)</span>
              )}
              {result.activeResult.proportionateExemptionApplied && (
                <span className="text-[10px] text-amber-500 font-medium block">Proportionate u/s 86</span>
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
                {!result.activeResult.isStatutorilyEligible ? (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Ineligible Asset
                  </span>
                ) : result.activeResult.disqualified ? (
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

          {/* Advisory Notice for Two-House Option */}
          {result.activeResult.twoHousesOptionMessage && (
            <div className={clsx(
              "surface-card p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5",
              result.activeResult.twoHousesOptionApplied
                ? "border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
            )}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{result.activeResult.twoHousesOptionMessage}</p>
            </div>
          )}

          {/* Ineligibility / Disqualification / Timeline Alerts */}
          {!result.activeResult.isStatutorilyEligible && (
            <div className="surface-card p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed">
                {result.activeResult.ineligibilityReason}
              </p>
            </div>
          )}

          {result.activeResult.isStatutorilyEligible && result.activeResult.disqualified && (
            <div className="surface-card p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed">
                {result.activeResult.disqualificationReason}
              </p>
            </div>
          )}

          {result.activeResult.isStatutorilyEligible &&
            !result.activeResult.isValidTimeline &&
            !result.activeResult.disqualified && (
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
                  Statutory Route Comparison (Income-tax Act, 2025)
                </h3>
              </div>

              <div
                className="overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-label="Statutory Route Comparison Table"
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left">
                      <th className="py-2 pr-2">Feature</th>
                      <th className="py-2 px-2">Sec 82 (formerly 54)</th>
                      <th className="py-2 px-2">Sec 85 (formerly 54EC)</th>
                      <th className="py-2 pl-2">Sec 86 (formerly 54F)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground font-medium">Statutory Eligibility</td>
                      <td className="py-2 px-2">
                        {result.comparison.section54.isStatutorilyEligible ? (
                          <span className="text-emerald-600 font-bold">Eligible</span>
                        ) : (
                          <span className="text-muted-foreground italic">Ineligible</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {result.comparison.section54ec.isStatutorilyEligible ? (
                          <span className="text-emerald-600 font-bold">Eligible</span>
                        ) : (
                          <span className="text-muted-foreground italic">Ineligible</span>
                        )}
                      </td>
                      <td className="py-2 pl-2">
                        {result.comparison.section54f?.isStatutorilyEligible ? (
                          <span className="text-emerald-600 font-bold">Eligible</span>
                        ) : (
                          <span className="text-muted-foreground italic">Ineligible</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Exemption Allowed</td>
                      <td className="py-2 px-2 font-bold text-emerald-600">
                        {formatINR(result.comparison.section54.exemptionAllowed)}
                      </td>
                      <td className="py-2 px-2 font-bold text-emerald-600">
                        {formatINR(result.comparison.section54ec.exemptionAllowed)}
                      </td>
                      <td className="py-2 pl-2 font-bold text-emerald-600">
                        {formatINR(result.comparison.section54f?.exemptionAllowed ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Tax Payable After Exemption</td>
                      <td className="py-2 px-2 font-medium">
                        {formatINR(result.comparison.section54.taxAfterExemption)}
                      </td>
                      <td className="py-2 px-2 font-medium">
                        {formatINR(result.comparison.section54ec.taxAfterExemption)}
                      </td>
                      <td className="py-2 pl-2 font-medium">
                        {formatINR(result.comparison.section54f?.taxAfterExemption ?? result.taxBeforeExemption)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Statutory Cap</td>
                      <td className="py-2 px-2">₹10 Cr (1 or 2 houses if LTCG ≤ ₹2Cr)</td>
                      <td className="py-2 px-2">₹50 Lakh aggregate (Sec 85(2))</td>
                      <td className="py-2 pl-2">₹10 Cr (Proportionate)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-muted-foreground">Lock-in Period</td>
                      <td className="py-2 px-2">3 Years (House)</td>
                      <td className="py-2 px-2">5 Years (Bonds)</td>
                      <td className="py-2 pl-2">3 Years (House)</td>
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
