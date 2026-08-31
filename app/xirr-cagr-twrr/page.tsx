import type { Metadata } from "next";
import XirrCalculator from "@/components/calculators/xirr/XirrCalculator";

export const metadata: Metadata = {
  title: "XIRR Calculator India — Irregular Cash Flow Return Analyzer",
  description:
    "Calculate exact annualized mutual fund and stock portfolio returns (XIRR) for irregular SIPs, top-ups, and redemptions with CAGR comparison.",
  keywords: [
    "xirr calculator india",
    "extended internal rate of return",
    "mutual fund sip xirr analyzer",
    "cagr vs xirr",
    "investment return calculator",
  ],
};

export default function XirrPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          XIRR Portfolio Return Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Solve exact annualized returns (Extended Internal Rate of Return) across non-periodic investments, dividend payouts, and lump-sum redemptions.
        </p>
      </header>

      <XirrCalculator />
    </main>
  );
}
