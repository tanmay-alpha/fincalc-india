"use client";

import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";
import { calcEMI } from "@/lib/math";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface EMIScenarioCompareProps {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  emi: number;
  totalInterest: number;
}

export default function EMIScenarioCompare({
  principal,
  annualRate,
  tenureMonths,
  emi,
  totalInterest,
}: EMIScenarioCompareProps) {
  // Scenario B adjustments
  const [bRate, setBRate] = useState(Math.max(1, annualRate - 0.5));
  const [bTenureYears, setBTenureYears] = useState(Math.max(1, Math.round(tenureMonths / 12) - 5));

  const scenarioBResult = useMemo(() => {
    return calcEMI({
      principal,
      annualRate: bRate,
      tenureMonths: bTenureYears * 12,
    });
  }, [principal, bRate, bTenureYears]);

  const interestSaved = totalInterest - scenarioBResult.totalInterest;
  const emiDelta = scenarioBResult.emi - emi;

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Refinance & Tenure Scenarios
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">Scenario A vs Scenario B</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Scenario A (Current) */}
        <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Current Loan (Scenario A)
          </span>
          <p className="text-xl font-extrabold text-foreground tabular-nums">
            ₹{formatINR(emi)} <span className="text-xs font-normal text-muted-foreground">/mo</span>
          </p>
          <div className="text-xs text-muted-foreground space-y-1 pt-1">
            <p>Interest Rate: {annualRate}%</p>
            <p>Tenure: {Math.round(tenureMonths / 12)} Years ({tenureMonths} Mo)</p>
            <p className="text-destructive font-semibold">Total Interest: ₹{formatINR(totalInterest)}</p>
          </div>
        </div>

        {/* Scenario B (Adjusted) */}
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Adjusted Scenario B
            </span>
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                interestSaved >= 0 ? "text-emerald-800 dark:text-emerald-300" : "text-destructive"
              )}
            >
              {interestSaved >= 0 ? `Save ₹${formatINR(interestSaved)} Interest` : `+₹${formatINR(Math.abs(interestSaved))} Interest`}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-extrabold text-foreground tabular-nums">
              ₹{formatINR(scenarioBResult.emi)} <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
            {emiDelta !== 0 && (
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                emiDelta < 0 ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "bg-amber-500/10 text-amber-800 dark:text-amber-300"
              )}>
                {emiDelta < 0 ? `-${formatINR(Math.abs(emiDelta))}` : `+${formatINR(emiDelta)}`}
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2">
              <span>Rate:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBRate(Math.max(1, +(bRate - 0.25).toFixed(2)))}
                  className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px] font-semibold"
                >
                  -0.25%
                </button>
                <span className="font-semibold text-foreground tabular-nums px-1">{bRate}%</span>
                <button
                  type="button"
                  onClick={() => setBRate(+(bRate + 0.25).toFixed(2))}
                  className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px] font-semibold"
                >
                  +0.25%
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span>Tenure:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBTenureYears(Math.max(1, bTenureYears - 1))}
                  className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px] font-semibold"
                >
                  -1y
                </button>
                <span className="font-semibold text-foreground tabular-nums px-1">{bTenureYears}y</span>
                <button
                  type="button"
                  onClick={() => setBTenureYears(bTenureYears + 1)}
                  className="px-1.5 py-0.5 rounded bg-card border border-border text-[11px] font-semibold"
                >
                  +1y
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground leading-relaxed flex items-center justify-between gap-3">
        <span>
          {interestSaved > 0
            ? `Negotiating an interest rate reduction or shortening loan tenure by ${Math.abs(Math.round(tenureMonths / 12) - bTenureYears)} years saves ₹${formatINR(interestSaved)} in total lifetime interest.`
            : "Adjust interest rate or tenure above to model refinancing and balance transfer savings."}
        </span>
      </div>
    </div>
  );
}
