"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CompareTabs from "@/components/ui/CompareTabs";
import CompareResultCard from "@/components/ui/CompareResultCard";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcSIP } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateSIPInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";

const SIPChart = dynamic(
  () => import("@/components/calculators/sip/SIPChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function SIPCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Scenario A
  const [aInputs, setAInputs] = useState({ monthlyAmount: 5000, annualRate: 12, years: 10 });
  // Scenario B
  const [bInputs, setBInputs] = useState({ monthlyAmount: 10000, annualRate: 12, years: 10 });

  // UX State
  const [isCompare] = useState(false);
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");
  const [shareId, setShareId] = useState<string | null>(null);

  // Debounced inputs
  const debouncedA = useDebounce(aInputs, 250);
  const debouncedB = useDebounce(bInputs, 250);

  // Math via useMemo only
  const resultsA = useMemo(() => calcSIP(debouncedA), [debouncedA]);
  const resultsB = useMemo(() => (isCompare ? calcSIP(debouncedB) : null), [debouncedB, isCompare]);

  const activeInputs = activeTab === "A" ? debouncedA : debouncedB;
  const activeResults = activeTab === "A" ? resultsA : resultsB!;
  const insights = useMemo(() => generateSIPInsights(resultsA), [resultsA]);

  useEffect(() => setShareId(null), [activeInputs, activeResults]);

  // Callbacks
  const setA = useCallback((key: keyof typeof aInputs, v: number) => setAInputs((p) => ({ ...p, [key]: v })), []);
  const setB = useCallback((key: keyof typeof bInputs, v: number) => setBInputs((p) => ({ ...p, [key]: v })), []);

  if (!mounted) return <CalcPageSkeleton />;

  const renderInputs = (target: "A" | "B") => {
    const inputs = target === "A" ? aInputs : bInputs;
    const set = target === "A" ? setA : setB;
    return (
      <div className="space-y-4">
        <HybridInput label="Monthly Investment" value={inputs.monthlyAmount} onChange={(v) => set("monthlyAmount", v)}
          min={500} max={100000000} step={500} prefix="₹"
          quickChips={[
            { label: "₹1K", value: 1000 }, { label: "₹5K", value: 5000 },
            { label: "₹10K", value: 10000 }, { label: "₹50K", value: 50000 },
            { label: "₹1L", value: 100000 },
          ]}
        />
        <HybridInput label="Expected Return" value={inputs.annualRate} onChange={(v) => set("annualRate", v)}
          min={1} max={50} step={0.5} suffix="%"
          quickChips={[
            { label: "8%", value: 8 }, { label: "10%", value: 10 },
            { label: "12%", value: 12 }, { label: "15%", value: 15 },
            { label: "18%", value: 18 },
          ]}
          hint="Historical equity avg: 12%"
        />
        <HybridInput label="Time Period" value={inputs.years} onChange={(v) => set("years", v)}
          min={1} max={50} step={1} suffix=" Yrs"
          quickChips={[
            { label: "5Y", value: 5 }, { label: "10Y", value: 10 },
            { label: "15Y", value: 15 }, { label: "20Y", value: 20 },
            { label: "30Y", value: 30 },
          ]}
        />
      </div>
    );
  };

  return (
    <main id="main-content" className="page-shell pb-24 lg:pb-0">

      <StickyResultBar label="Total Corpus" value={activeResults.totalCorpus} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Breadcrumb items={[
              {label: 'Home', href: '/'},
              {label: 'SIP Calculator'},
            ]} />
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-3xl">📈</span>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">SIP Calculator</h1>
            </div>
            <p className="text-muted-foreground">Calculate returns on your monthly Systematic Investment Plan</p>
          </div>

          <button
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground"
          >
            Compare Mode
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              Soon
            </span>
          </button>
        </div>

        <div className={clsx(
          "grid grid-cols-1 gap-6 mt-6 transition-all duration-300",
          isCompare ? "xl:grid-cols-[600px_1fr]" : "lg:grid-cols-[420px_1fr]"
        )}>

          {/* ────── INPUT PANEL ────── */}
          <div className="h-fit lg:sticky lg:top-6 space-y-4">

            {isCompare && (
              <div className="lg:hidden">
                <CompareTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            )}

            {isCompare ? (
              <div className="surface-card p-6">
                <div className="hidden lg:grid grid-cols-2 gap-8 divide-x divide-border">
                  <div className="pr-2">
                    <h3 className="text-sm font-bold text-card-foreground mb-4 tracking-wide uppercase">Scenario A</h3>
                    {renderInputs("A")}
                  </div>
                  <div className="pl-6">
                    <h3 className="text-sm font-bold text-primary mb-4 tracking-wide uppercase">Scenario B</h3>
                    {renderInputs("B")}
                  </div>
                </div>
                <div className="lg:hidden">
                  {renderInputs(activeTab)}
                </div>
              </div>
            ) : (
              <div className="surface-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">💼</span>
                  <h2 className="text-base font-semibold text-card-foreground">Enter SIP Details</h2>
                </div>
                {renderInputs("A")}
                <p className="text-xs text-muted-foreground text-center mt-5">
                  * Returns are estimated. Actual market returns may vary.
                </p>
              </div>
            )}
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5 min-w-0">

            {isCompare && resultsB ? (
              <CompareResultCard
                label="Total Corpus"
                valueA={resultsA.totalCorpus}
                valueB={resultsB.totalCorpus}
              />
            ) : (
              <ResultHero label="Total Corpus" value={resultsA.totalCorpus} breakdown={[
                { label: "Invested", value: resultsA.totalInvested, color: "blue" },
                { label: "Returns", value: resultsA.estimatedReturns, color: "green" },
              ]} />
            )}

            {/* Insights */}
            {!isCompare && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            )}

            {/* Chart */}
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Growth Projection</h3>
                <span className="text-xs text-muted-foreground">Year by year</span>
              </div>
              <div className="h-[300px]">
                <SIPChart
                  data={isCompare && activeTab === "B" ? resultsB!.yearlyBreakdown : resultsA.yearlyBreakdown}
                  compareData={isCompare ? resultsB!.yearlyBreakdown : undefined}
                  isCompareMode={isCompare ? (typeof window !== "undefined" && window.innerWidth >= 1024) : false}
                />
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="table-surface">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">Year-by-Year Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-head">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invested</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-primary uppercase tracking-wide">Returns</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeResults.yearlyBreakdown.map((row, i) => (
                      <tr key={row.year}
                        className={clsx(
                          "table-row",
                          i === activeResults.yearlyBreakdown.length - 1 && "bg-primary/10 font-semibold"
                        )}>
                        <td className="px-6 py-3.5 text-muted-foreground">{row.year}</td>
                        <td className="px-6 py-3.5 text-right text-foreground/80">{formatINR(row.invested)}</td>
                        <td className="px-6 py-3.5 text-right text-success font-medium">{formatINR(row.returns)}</td>
                        <td className="px-6 py-3.5 text-right text-foreground font-semibold">{formatINR(row.corpus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <SaveCalculationButton
                calcType="SIP"
                data={{ inputs: activeInputs, results: activeResults as unknown as Record<string, unknown> }}
                onSaved={setShareId}
              />
              <ShareButton shareId={shareId} />
            </div>

            <RelatedCalculators current="sip" />
          </div>
        </div>
      </div>
    </main>
  );
}
