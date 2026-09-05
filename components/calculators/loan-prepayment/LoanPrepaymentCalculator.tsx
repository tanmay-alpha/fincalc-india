"use client";


import { useIsMounted } from "@/hooks/useIsMounted";
import { recordRecentCalculation } from "@/lib/storage-workflow";import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import InsightCard from "@/components/ui/InsightCard";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { calcPrepaymentVsInvest } from "@/lib/math";
import type { PrepaymentType } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

const LoanPrepaymentChart = dynamic(
  () => import("@/components/calculators/loan-prepayment/LoanPrepaymentChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function LoanPrepaymentCalculator() {
  const mounted = useIsMounted();

  const [prepaymentType, setPrepaymentType] = useState<PrepaymentType>("extra_emi_yearly");
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");

  const [inputs, setInputs] = useState({
    principal: 5000000, // ₹50 Lakhs
    annualRate: 8.5,
    tenure: 20, // 20 years
    prepaymentAmount: 5000,
    lumpsumYear: 3,
    investmentRate: 12, // 12% equity CAGR
  });

  const debouncedInputs = useDebounce(inputs, 250);

  const tenureMonths = useMemo(() => {
    return tenureUnit === "years"
      ? debouncedInputs.tenure * 12
      : debouncedInputs.tenure;
  }, [debouncedInputs.tenure, tenureUnit]);

  const result = useMemo(() => {
    return calcPrepaymentVsInvest({
      principal: debouncedInputs.principal,
      annualRate: debouncedInputs.annualRate,
      tenureMonths,
      prepaymentType,
      prepaymentAmount: debouncedInputs.prepaymentAmount,
      lumpsumYear: debouncedInputs.lumpsumYear,
      investmentRate: debouncedInputs.investmentRate,
    });
  }, [debouncedInputs, tenureMonths, prepaymentType]);

  const setPrincipal = useCallback(
    (v: number) => setInputs((p) => ({ ...p, principal: v })),
    []
  );
  const setRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, annualRate: v })),
    []
  );
  const setTenure = useCallback(
    (v: number) => setInputs((p) => ({ ...p, tenure: v })),
    []
  );
  const setPrepayAmt = useCallback(
    (v: number) => setInputs((p) => ({ ...p, prepaymentAmount: v })),
    []
  );
  const setLumpsumYr = useCallback(
    (v: number) => setInputs((p) => ({ ...p, lumpsumYear: v })),
    []
  );
  const setInvestRate = useCallback(
    (v: number) => setInputs((p) => ({ ...p, investmentRate: v })),
    []
  );

  useEffect(() => {
    if (mounted) {
      recordRecentCalculation({
        id: "loan-prepayment",
        name: "Loan Prepayment vs. Invest Calculator",
        route: "/loan-prepayment",
        category: "loans",
      });
    }
  }, [mounted]);

  if (!mounted) return <CalcPageSkeleton />;

  return (
    <>
      <StickyResultBar label="Interest Saved" value={result.interestSaved} />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
        {/* ────── INPUT PANEL ────── */}
        <div className="h-fit lg:sticky lg:top-6 space-y-4">
          <div className="surface-card p-6 space-y-5">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              1. Loan Details
            </h2>

            <HybridInput
              label="Loan Amount (Principal)"
              value={inputs.principal}
              onChange={setPrincipal}
              min={50000}
              max={100000000}
              step={100000}
              prefix="₹"
              quickChips={[
                { label: "₹25L", value: 2500000 },
                { label: "₹50L", value: 5000000 },
                { label: "₹75L", value: 7500000 },
                { label: "₹1 Cr", value: 10000000 },
              ]}
            />

            <HybridInput
              label="Loan Interest Rate"
              value={inputs.annualRate}
              onChange={setRate}
              min={1}
              max={25}
              step={0.1}
              suffix="%"
              quickChips={[
                { label: "8.5%", value: 8.5 },
                { label: "9.0%", value: 9.0 },
                { label: "9.5%", value: 9.5 },
              ]}
              hint="Home loan avg: 8.4% – 9.2%"
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Loan Tenure
                </span>
                <div className="flex gap-1 bg-muted/40 p-0.5 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureUnit === "months") {
                        setTenureUnit("years");
                        setInputs((p) => ({ ...p, tenure: Math.round(p.tenure / 12) || 1 }));
                      }
                    }}
                    className={cn(
                      "px-2.5 py-0.5 text-xs font-medium rounded-md transition-all",
                      tenureUnit === "years"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureUnit === "years") {
                        setTenureUnit("months");
                        setInputs((p) => ({ ...p, tenure: p.tenure * 12 }));
                      }
                    }}
                    className={cn(
                      "px-2.5 py-0.5 text-xs font-medium rounded-md transition-all",
                      tenureUnit === "months"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Months
                  </button>
                </div>
              </div>
              <HybridInput
                label=""
                value={inputs.tenure}
                onChange={setTenure}
                min={1}
                max={tenureUnit === "years" ? 35 : 420}
                step={1}
                suffix={tenureUnit === "years" ? " Yrs" : " Mos"}
                quickChips={
                  tenureUnit === "years"
                    ? [
                        { label: "10Y", value: 10 },
                        { label: "15Y", value: 15 },
                        { label: "20Y", value: 20 },
                        { label: "25Y", value: 25 },
                      ]
                    : [
                        { label: "120M", value: 120 },
                        { label: "180M", value: 180 },
                        { label: "240M", value: 240 },
                      ]
                }
              />
            </div>

            <div className="pt-2 border-t border-border space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                2. Pre-Payment Strategy
              </h2>

              <div className="grid grid-cols-3 gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setPrepaymentType("extra_emi_yearly")}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg transition-all text-center leading-tight",
                    prepaymentType === "extra_emi_yearly"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  +1 EMI / Year
                </button>
                <button
                  type="button"
                  onClick={() => setPrepaymentType("monthly_topup")}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg transition-all text-center leading-tight",
                    prepaymentType === "monthly_topup"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly Top-Up
                </button>
                <button
                  type="button"
                  onClick={() => setPrepaymentType("lumpsum")}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg transition-all text-center leading-tight",
                    prepaymentType === "lumpsum"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Lump Sum
                </button>
              </div>

              {prepaymentType === "monthly_topup" && (
                <HybridInput
                  label="Monthly Prepayment Top-Up"
                  value={inputs.prepaymentAmount}
                  onChange={setPrepayAmt}
                  min={500}
                  max={500000}
                  step={500}
                  prefix="₹"
                  quickChips={[
                    { label: "+₹2K", value: 2000 },
                    { label: "+₹5K", value: 5000 },
                    { label: "+₹10K", value: 10000 },
                    { label: "+₹25K", value: 25000 },
                  ]}
                />
              )}

              {prepaymentType === "lumpsum" && (
                <>
                  <HybridInput
                    label="One-Time Lump Sum Amount"
                    value={inputs.prepaymentAmount}
                    onChange={setPrepayAmt}
                    min={10000}
                    max={inputs.principal}
                    step={25000}
                    prefix="₹"
                    quickChips={[
                      { label: "₹1L", value: 100000 },
                      { label: "₹2L", value: 200000 },
                      { label: "₹5L", value: 500000 },
                      { label: "₹10L", value: 1000000 },
                    ]}
                  />
                  <HybridInput
                    label="Prepay in Year"
                    value={inputs.lumpsumYear}
                    onChange={setLumpsumYr}
                    min={1}
                    max={Math.max(1, Math.floor(tenureMonths / 12) - 1)}
                    step={1}
                    suffix=" Yr"
                    quickChips={[
                      { label: "Yr 2", value: 2 },
                      { label: "Yr 3", value: 3 },
                      { label: "Yr 5", value: 5 },
                    ]}
                  />
                </>
              )}

              <HybridInput
                label="Alternative Investment Return"
                value={inputs.investmentRate}
                onChange={setInvestRate}
                min={1}
                max={25}
                step={0.5}
                suffix="%"
                hint="Expected Mutual Fund CAGR if you invest instead"
                quickChips={[
                  { label: "10%", value: 10 },
                  { label: "12%", value: 12 },
                  { label: "14%", value: 14 },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ────── RESULTS PANEL ────── */}
        <div className="space-y-5 min-w-0">
          <ResultHero
            label="Total Interest Saved"
            value={result.interestSaved}
            breakdown={[
              { label: "Original Total Interest", value: result.originalTotalInterest, color: "blue" },
              { label: "New Total Interest", value: result.newTotalInterest, color: "green" },
            ]}
          />

          {/* Key Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InsightCard
              icon="⏳"
              title={`Tenure Cut by ${result.tenureSavedYears} Years`}
              subtitle={`New tenure: ${Math.round((result.newTenureMonths / 12) * 10) / 10} yrs (${result.newTenureMonths} mos)`}
              type="good"
            />
            <InsightCard
              icon="💰"
              title={`Regular EMI: ${formatINR(result.originalEmi)}`}
              subtitle={`Total payments: ${formatCompact(result.originalTotalPayment)}`}
              type="info"
            />
            <InsightCard
              icon="🎯"
              title={`Hurdle Rate: ${result.breakEvenRate}%`}
              subtitle={
                result.recommendation === "invest"
                  ? `Investing beats prepaying by +${formatCompact(result.wealthDifference)}`
                  : `Prepaying saves guaranteed interest`
              }
              type={result.recommendation === "invest" ? "good" : "warning"}
            />
          </div>

          {/* Verdict Banner */}
          <div className="surface-card p-5 border-l-4 border-l-primary flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">
                Strategy Recommendation:{" "}
                <span className="text-primary">
                  {result.recommendation === "invest"
                    ? "Invest in Mutual Funds"
                    : "Prepay Your Loan"}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {result.recommendation === "invest"
                  ? `At a ${inputs.investmentRate}% mutual fund CAGR, investing your extra cash generates ${formatCompact(result.investScenarioWealth)} vs ${formatCompact(result.prepayScenarioWealth)} net wealth by loan end date (a gain of +${formatCompact(result.wealthDifference)}).`
                  : `With a loan rate of ${inputs.annualRate}%, prepaying eliminates guaranteed debt interest of ${formatCompact(result.interestSaved)} and secures early freedom.`}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground">Prepay Loan vs Invest Difference</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Comparing Interest Cost & Net Wealth at Original Loan End Date</p>
              </div>
            </div>
            <div className="h-[300px]">
              <LoanPrepaymentChart
                prepayWealth={result.prepayScenarioWealth}
                investWealth={result.investScenarioWealth}
                originalInterest={result.originalTotalInterest}
                newInterest={result.newTotalInterest}
                interestSaved={result.interestSaved}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
