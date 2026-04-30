"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import ShareButton from "@/components/ui/ShareButton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import StickyResultBar from "@/components/ui/StickyResultBar";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcLumpsum, calcSIP } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";
import { generateLumpsumInsights } from "@/lib/insights";
import { useDebounce } from "@/hooks/useDebounce";

const LumpsumChart = dynamic(
  () => import("@/components/calculators/lumpsum/LumpsumChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const INFLATION_RATE = 6;

export default function LumpsumCalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    principal: 500000,
    annualRate: 12,
    years: 10,
  });
  const [showAdjusted, setShowAdjusted] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const debouncedInputs = useDebounce(inputs, 250);
  const results = useMemo(() => calcLumpsum(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => generateLumpsumInsights(results), [results]);

  // Inflation-adjusted value
  const adjValue = useMemo(
    () => results.totalCorpus / Math.pow(1 + INFLATION_RATE / 100, inputs.years),
    [results.totalCorpus, inputs.years]
  );

  // SIP vs Lumpsum comparison
  const sipEquivalent = useMemo(() => {
    const monthly = inputs.principal / (inputs.years * 12);
    return calcSIP({
      monthlyAmount: monthly,
      annualRate: inputs.annualRate,
      years: inputs.years,
    });
  }, [inputs]);

  useEffect(() => setShareId(null), [debouncedInputs]);

  const onPrincipal = useCallback((v: number) => setInputs(p => ({ ...p, principal: v })), []);
  const onRate = useCallback((v: number) => setInputs(p => ({ ...p, annualRate: v })), []);
  const onYears = useCallback((v: number) => setInputs(p => ({ ...p, years: v })), []);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <main id="main-content" className="page-shell pb-24 lg:pb-0">

      <StickyResultBar label="Total Corpus" value={results.totalCorpus} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            {label: 'Home', href: '/'},
            {label: 'Lumpsum Calculator'},
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">💰</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Lumpsum Calculator</h1>
          </div>
          <p className="text-muted-foreground">See one-time investment growth with CAGR and wealth multiplier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* ────── INPUT PANEL ────── */}
          <div className="surface-card h-fit space-y-4 p-6 lg:sticky lg:top-6">
            <HybridInput label="Investment Amount" value={inputs.principal} onChange={onPrincipal}
              min={1000} max={1000000000} step={10000} prefix="₹"
              quickChips={[
                { label: "₹1L", value: 100000 }, { label: "₹5L", value: 500000 },
                { label: "₹10L", value: 1000000 }, { label: "₹50L", value: 5000000 },
                { label: "₹1Cr", value: 10000000 },
              ]}
            />
            <HybridInput label="Expected Return" value={inputs.annualRate} onChange={onRate}
              min={1} max={50} step={0.5} suffix="%"
              quickChips={[
                { label: "8%", value: 8 }, { label: "10%", value: 10 },
                { label: "12%", value: 12 }, { label: "15%", value: 15 },
                { label: "18%", value: 18 },
              ]}
            />
            <HybridInput label="Time Period" value={inputs.years} onChange={onYears}
              min={1} max={50} step={1} suffix=" Yrs"
              quickChips={[
                { label: "5Y", value: 5 }, { label: "10Y", value: 10 },
                { label: "15Y", value: 15 }, { label: "20Y", value: 20 },
                { label: "30Y", value: 30 },
              ]}
            />

            {/* Inflation toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Show inflation-adjusted</span>
              <button
                onClick={() => setShowAdjusted(!showAdjusted)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${showAdjusted ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform duration-200 ${showAdjusted ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          {/* ────── RESULTS PANEL ────── */}
          <div className="space-y-5">
            <ResultHero label="Total Corpus" value={results.totalCorpus}
              breakdown={[
                { label: "Invested", value: inputs.principal, color: "blue" },
                { label: "Returns", value: results.estimatedReturns, color: "green" },
              ]}
            />

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              {showAdjusted && (
                <InsightCard
                  icon="📉"
                  title={`Inflation-adjusted value: ${formatCompact(adjValue)}`}
                  subtitle={`At ${INFLATION_RATE}% inflation over ${inputs.years} years. Your real purchasing power.`}
                  type="warning"
                />
              )}
            </div>

            {/* Chart */}
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Wealth Growth Curve</h3>
                <span className="text-xs text-muted-foreground">CAGR: {results.CAGR}% - {results.wealthRatio}x</span>
              </div>
              <div className="h-[300px]"><LumpsumChart data={results.growthData} principal={inputs.principal} /></div>
            </div>

            {/* SIP vs Lumpsum Comparison */}
            <div className="surface-card p-6">
              <h3 className="font-semibold text-card-foreground mb-3">Lumpsum vs SIP Comparison</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Same {formatCompact(inputs.principal)} split as monthly SIP of {formatCompact(inputs.principal / (inputs.years * 12))}/mo
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-center">
                  <p className="mb-1 text-xs text-primary">Lumpsum</p>
                  <p className="text-xl font-bold text-primary">{formatCompact(results.totalCorpus)}</p>
                </div>
                <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-center">
                  <p className="mb-1 text-xs text-success">Monthly SIP</p>
                  <p className="text-xl font-bold text-success">{formatCompact(sipEquivalent.totalCorpus)}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {results.totalCorpus > sipEquivalent.totalCorpus
                  ? "💡 Lumpsum performs better in this scenario"
                  : "💡 SIP performs better in this scenario"}
              </p>
            </div>

            {/* Year-by-Year Table */}
            <div className="table-surface">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">Year-by-Year Growth</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-head">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.growthData.map((r) => (
                      <tr key={r.year} className="table-row text-foreground/80">
                        <td className="px-6 py-3 text-muted-foreground">{r.year}</td>
                        <td className="px-6 py-3 text-right font-medium">{formatINR(r.value)}</td>
                        <td className="px-6 py-3 text-right text-success">{formatINR(r.value - inputs.principal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <ShareButton shareId={shareId} />
              <SaveCalculationButton
                calcType="Lumpsum"
                data={{ inputs: debouncedInputs, results: results as unknown as Record<string, unknown> }}
                onSaved={setShareId}
              />
            </div>

            <RelatedCalculators current="lumpsum" />
          </div>
        </div>
      </div>
    </main>
  );
}
