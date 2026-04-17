"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Calculator, SlidersHorizontal, TrendingUp } from "lucide-react";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyMobileResult from "@/components/ui/StickyMobileResult";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import CompareTabs from "@/components/ui/CompareTabs";
import CompareResultCard from "@/components/ui/CompareResultCard";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcSIP } from "@/lib/math";
import { formatINR } from "@/lib/format";
import { generateSIPInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSave } from "@/hooks/useAutoSave";

const SIPChart = dynamic(
  () => import("@/components/calculators/sip/SIPChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);



export default function SIPCalculator() {
  // Scenario A
  const [aInputs, setAInputs] = useState({ monthlyAmount: 5000, annualRate: 12, years: 10 });
  // Scenario B
  const [bInputs, setBInputs] = useState({ monthlyAmount: 10000, annualRate: 12, years: 10 });
  
  // UX State
  const [isCompare, setIsCompare] = useState(false);
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");

  // Performance isolation (250ms visual throttle)
  const debouncedA = useDebounce(aInputs, 250);
  const debouncedB = useDebounce(bInputs, 250);

  // Heavy math only fires off the debounced throttle, keeping sliding at 120fps visually
  const resultsA = useMemo(() => calcSIP(debouncedA), [debouncedA]);
  const resultsB = useMemo(() => (isCompare ? calcSIP(debouncedB) : null), [debouncedB, isCompare]);

  // Derived datasets
  const activeInputs = activeTab === "A" ? aInputs : bInputs;
  const activeResults = activeTab === "A" ? resultsA : resultsB!;
  const insights = useMemo(() => generateSIPInsights(resultsA), [resultsA]);

  // Autosync active view securely
  const { shareId } = useAutoSave({
    calcType: "SIP",
    debouncedInputs: activeTab === "A" ? debouncedA : debouncedB,
    results: activeResults as unknown as Record<string, unknown>,
    enabled: true,
  });

  // Callbacks A
  const setA = useCallback((key: keyof typeof aInputs, v: number) => setAInputs((p) => ({ ...p, [key]: v })), []);
  // Callbacks B
  const setB = useCallback((key: keyof typeof bInputs, v: number) => setBInputs((p) => ({ ...p, [key]: v })), []);

  // Quick inputs layout abstractions to avoid insane template clutter
  const renderInputs = (target: "A" | "B") => {
    const inputs = target === "A" ? aInputs : bInputs;
    const set = target === "A" ? setA : setB;
    return (
      <div className="space-y-4">
        <HybridInput label="Monthly Investment" value={inputs.monthlyAmount} onChange={(v) => set("monthlyAmount", v)}
          min={500} max={100000000} step={500} prefix="₹"
        />
        <HybridInput label="Expected Return" value={inputs.annualRate} onChange={(v) => set("annualRate", v)}
          min={1} max={50} step={0.5} suffix="%"
        />
        <HybridInput label="Time Period" value={inputs.years} onChange={(v) => set("years", v)}
          min={1} max={50} step={1} suffix="Yrs"
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 lg:pb-0">
      
      {/* ── Sticky Mobile Dock ── */}
      <StickyMobileResult label="Total Corpus" value={formatINR(activeResults.totalCorpus)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-3xl">📈</span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] dark:text-white tracking-tight">SIP Calculator</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Calculate returns on your monthly Systematic Investment Plan</p>
          </div>

          <button
            onClick={() => setIsCompare(!isCompare)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border shadow-sm ${
              isCompare 
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isCompare ? "Disable Compare Mode" : "Compare Mode"}
          </button>
        </div>

        <div className={`grid grid-cols-1 ${isCompare ? 'xl:grid-cols-[600px_1fr]' : 'lg:grid-cols-[420px_1fr]'} gap-6 mt-6 transition-all duration-300`}>
          
          {/* ────── INPUT PANEL (Sticky desktop) ────── */}
          <div className="h-fit lg:sticky lg:top-6 space-y-4">
            
            {isCompare && (
              <div className="lg:hidden">
                <CompareTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            )}

            {isCompare ? (
              // DESKTOP: Side-by-side | MOBILE: Tab Active Only
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="hidden lg:grid grid-cols-2 gap-8 divide-x divide-slate-100 dark:divide-slate-700">
                  <div className="pr-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-wide uppercase">Scenario A</h3>
                    {renderInputs("A")}
                  </div>
                  <div className="pl-6">
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 tracking-wide uppercase">Scenario B</h3>
                    {renderInputs("B")}
                  </div>
                </div>
                <div className="lg:hidden">
                  {renderInputs(activeTab)}
                </div>
              </div>
            ) : (
                // NORMAL MODE
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                  {renderInputs("A")}
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
              <ResultHero label="Total Corpus" value={resultsA.totalCorpus} subItems={[
                { label: "Invested", value: resultsA.totalInvested, color: "#2563EB" },
                { label: "Returns", value: resultsA.estimatedReturns, color: "#16A34A" },
              ]} />
            )}

            {/* Smart Insights (Normal Mode Only) */}
            {!isCompare && (
              <CollapsibleSection title="Smart Insights" icon={<Calculator className="w-5 h-5"/>} defaultOpen>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
                </div>
              </CollapsibleSection>
            )}

            {/* Charts Configuration */}
            <CollapsibleSection title="Growth Projection Chart" icon={<TrendingUp className="w-5 h-5"/>} defaultOpen>
               <div className="pt-2 h-[350px]">
                 <SIPChart 
                    data={isCompare && activeTab === "B" ? resultsB!.yearlyBreakdown : resultsA.yearlyBreakdown} 
                    compareData={isCompare ? resultsB!.yearlyBreakdown : undefined}
                    // For mobile, display active tab bar chart. For Desktop, activate line overlay.
                    isCompareMode={isCompare ? (typeof window !== "undefined" && window.innerWidth >= 1024) : false}
                 />
               </div>
            </CollapsibleSection>

            {/* Breakdown table */}
            <CollapsibleSection title="Year-by-Year Breakdown" icon={<Calculator className="w-5 h-5"/>}>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-3 text-left font-medium">Year</th>
                      <th className="py-3 text-right font-medium">Invested</th>
                      <th className="py-3 text-right font-medium">Returns</th>
                      <th className="py-3 text-right font-medium">Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeResults.yearlyBreakdown.map((r) => (
                      <tr key={r.year} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5">{r.year}</td>
                        <td className="py-2.5 text-right">{formatINR(r.invested)}</td>
                        <td className="py-2.5 text-right text-green-600 dark:text-green-400">{formatINR(r.returns)}</td>
                        <td className="py-2.5 text-right font-semibold">{formatINR(r.corpus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {/* Trust Signal / Disclaimer */}
            <p className="text-xs text-slate-400 text-center uppercase tracking-wide font-medium mt-6 mb-2">
              * Disclaimer: Not Financial Advice *
            </p>
            <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
              Estimated returns assuming historical {activeInputs.annualRate}% p.a. compounded monthly. Actual market returns continuously fluctuate. Only invest what you can cleanly afford.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {shareId ? <ShareButton calcType="SIP" resultText={formatINR(activeResults.totalCorpus)} /> : null}
              <SaveCalculationButton calcType="SIP" data={{ ...activeInputs, totalCorpus: activeResults.totalCorpus }} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
