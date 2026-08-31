import type { Metadata } from "next";
import MarginCalculator from "@/components/calculators/margin/MarginCalculator";

export const metadata: Metadata = {
  title: "NSE & BSE Margin Calculator India — Futures, Options & MTF Leverage",
  description:
    "Calculate upfront SPAN margin, Exposure margin, and MTF interest costs for Nifty, Bank Nifty futures, and equity trades under SEBI peak margin norms for Tax Year 2026-27.",
  keywords: [
    "margin calculator nse bse india",
    "span margin calculator",
    "exposure margin fno",
    "sebi peak margin rules",
    "mtf interest calculator zerodha groww upstox",
  ],
};

export default function MarginCalculatorPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          NSE / BSE Margin & Leverage Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calculate mandatory upfront SPAN + Exposure margin requirements across F&O index contracts and MTF funded equity holdings under SEBI peak margin norms.
        </p>
      </header>

      <MarginCalculator />
    </main>
  );
}
