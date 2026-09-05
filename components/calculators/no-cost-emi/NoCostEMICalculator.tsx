"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcNoCostEMITruth } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { clsx } from "clsx";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const NoCostEMIChart = dynamic(
  () => import("@/components/calculators/no-cost-emi/NoCostEMIChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function NoCostEMICalculator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [inputs, setInputs] = useState({
    productPrice: 79999, // e.g. iPhone 15 / Galaxy S24
    tenureMonths: 6,
    bankInterestRate: 15,
    processingFee: 199,
    upfrontDiscountForfeited: 3000, // ₹3,000 instant bank discount lost by choosing EMI
    gstRatePercent: 18,
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const result = useMemo(() => {
    return calcNoCostEMITruth({
      productPrice: debouncedInputs.productPrice,
      tenureMonths: debouncedInputs.tenureMonths,
      bankInterestRate: debouncedInputs.bankInterestRate,
      processingFee: debouncedInputs.processingFee,
      upfrontDiscountForfeited: debouncedInputs.upfrontDiscountForfeited,
      gstRatePercent: debouncedInputs.gstRatePercent,
    });
  }, [debouncedInputs]);

  const setPrice = useCallback(
    (v: number) => setInputs((p) => ({ ...p, productPrice: v })),
    []
  );
  const setTenure = useCallback(
    (v: number) => setInputs((p) => ({ ...p, tenureMonths: v })),
    []
  );
  const setFee = useCallback(
    (v: number) => setInputs((p) => ({ ...p, processingFee: v })),
    []
  );
  const setDiscount = useCallback(
    (v: number) => setInputs((p) => ({ ...p, upfrontDiscountForfeited: v })),
    []
  );
  const setBankRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, bankInterestRate: v })),
    []
  );

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Net Difference" value={result.netDifference} />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
        {/* ────── INPUT PANEL ────── */}
        <div className="h-fit lg:sticky lg:top-6 space-y-4">
          <div className="surface-card p-6 space-y-5">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Purchase & Loan Terms
            </h2>

            <HybridInput
              label="Product Price"
              value={inputs.productPrice}
              onChange={setPrice}
              min={1000}
              max={1000000}
              step={1000}
              prefix="₹"
              quickChips={[
                { label: "₹25K", value: 25000 },
                { label: "₹50K", value: 50000 },
                { label: "₹80K", value: 79999 },
                { label: "₹1.5L", value: 150000 },
              ]}
            />

            {/* Tenure selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                EMI Tenure
              </label>
              <div className="grid grid-cols-5 gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
                {[3, 6, 9, 12, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenure(m)}
                    className={clsx(
                      "py-2 text-xs font-semibold rounded-lg transition-all text-center",
                      inputs.tenureMonths === m
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            <HybridInput
              label="Forfeited Upfront Discount"
              value={inputs.upfrontDiscountForfeited}
              onChange={setDiscount}
              min={0}
              max={inputs.productPrice * 0.5}
              step={500}
              prefix="₹"
              hint="Instant card/cash discount lost if choosing No-Cost EMI"
              quickChips={[
                { label: "₹0", value: 0 },
                { label: "₹2K", value: 2000 },
                { label: "₹3K", value: 3000 },
                { label: "₹5K", value: 5000 },
              ]}
            />

            <HybridInput
              label="Bank Processing Fee"
              value={inputs.processingFee}
              onChange={setFee}
              min={0}
              max={2000}
              step={50}
              prefix="₹"
              hint="Bank fee (e.g. ₹199 + 18% GST = ₹234.82)"
              quickChips={[
                { label: "₹0", value: 0 },
                { label: "₹99", value: 99 },
                { label: "₹199", value: 199 },
                { label: "₹299", value: 299 },
              ]}
            />

            <HybridInput
              label="Merchant Subvention Interest Rate"
              value={inputs.bankInterestRate}
              onChange={setBankRate}
              min={10}
              max={24}
              step={0.5}
              suffix="%"
              hint="Bank's underlying rate (typically 13% - 16% p.a.)"
              quickChips={[
                { label: "13%", value: 13 },
                { label: "15%", value: 15 },
                { label: "16%", value: 16 },
              ]}
            />
          </div>
        </div>

        {/* ────── RESULTS PANEL ────── */}
        <div className="space-y-5 min-w-0">
          <ResultHero
            label="Total Cost on No-Cost EMI"
            value={result.totalCostEmi}
            breakdown={[
              { label: "Cost Paid Upfront", value: result.totalCostUpfront, color: "blue" },
              { label: "Hidden Interest & GST", value: result.hiddenGst + result.processingFeeWithGst, color: "green" },
            ]}
          />

          {/* Verdict Banner */}
          <div
            className={clsx(
              "surface-card p-5 border-l-4 flex items-start gap-4",
              result.cheaperOption === "upfront"
                ? "border-l-amber-500 bg-amber-500/5"
                : "border-l-emerald-500 bg-emerald-500/5"
            )}
          >
            <div
              className={clsx(
                "p-2.5 rounded-xl",
                result.cheaperOption === "upfront"
                  ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                  : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              )}
            >
              {result.cheaperOption === "upfront" ? (
                <AlertTriangle className="h-6 w-6" />
              ) : (
                <CheckCircle2 className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">
                {result.cheaperOption === "upfront"
                  ? "Paying Upfront is Cheaper!"
                  : "No-Cost EMI is Financially Beneficial"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {result.verdict}. Although marketed as &ldquo;0% Interest&rdquo;, you pay{" "}
                <span className="font-semibold text-foreground">{formatINR(result.hiddenGst)}</span> in 18% GST on interest, plus{" "}
                <span className="font-semibold text-foreground">{formatINR(result.processingFeeWithGst)}</span> processing fee with GST.
              </p>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InsightCard
              icon="🧾"
              title={`Hidden 18% GST: ${formatINR(result.hiddenGst)}`}
              subtitle={`Levied on ${formatINR(result.hiddenInterest)} interest discount`}
              type="warning"
            />
            <InsightCard
              icon="💳"
              title={`Monthly Outflow: ${formatINR(result.monthlyBreakdown[0]?.totalMonthlyOutflow || result.monthlyEmi)}`}
              subtitle={`Base EMI ${formatCompact(result.monthlyEmi)} + monthly GST`}
              type="info"
            />
            <InsightCard
              icon="⚖️"
              title={`Net Extra Cost: ${formatINR(Math.max(0, result.netDifference))}`}
              subtitle={result.cheaperOption === "upfront" ? "Lost vs upfront discount" : "Same as full price"}
              type={result.cheaperOption === "upfront" ? "warning" : "good"}
            />
          </div>

          {/* Chart */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground">Total Outflow Breakdown</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Where the extra hidden money goes</p>
              </div>
            </div>
            <div className="h-[280px]">
              <NoCostEMIChart
                productPrice={result.productPrice}
                totalCostUpfront={result.totalCostUpfront}
                hiddenGst={result.hiddenGst}
                processingFeeWithGst={result.processingFeeWithGst}
              />
            </div>
          </div>

          {/* Month-by-Month Amortization Table */}
          <div className="table-surface">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Hidden Loan Amortization Schedule</h3>
            </div>
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Hidden Loan Amortization Schedule Table"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-head">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Principal</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hidden Interest</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">18% GST</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-primary uppercase tracking-wide">Total Outflow</th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyBreakdown.map((row) => (
                    <tr key={row.month} className="table-row">
                      <td className="px-6 py-3.5 text-muted-foreground">Month {row.month}</td>
                      <td className="px-6 py-3.5 text-right font-medium text-foreground">{formatINR(row.principal)}</td>
                      <td className="px-6 py-3.5 text-right text-muted-foreground">{formatINR(row.interest)}</td>
                      <td className="px-6 py-3.5 text-right text-amber-800 dark:text-amber-300 font-semibold">{formatINR(row.gstOnInterest)}</td>
                      <td className="px-6 py-3.5 text-right text-primary font-bold">{formatINR(row.totalMonthlyOutflow)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
