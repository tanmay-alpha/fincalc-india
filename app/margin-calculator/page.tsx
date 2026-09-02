import type { Metadata } from "next";
import MarginCalculator from "@/components/calculators/margin/MarginCalculator";

export const metadata: Metadata = {
  title: "F&O Margin Estimator — Futures, Options & MTF Leverage",
  description:
    "Illustrative SPAN/exposure assumptions. Estimate initial margin requirements for Nifty, Bank Nifty, FinNifty, and stock futures under SEBI peak margin norms.",
  keywords: [
    "f&o margin estimator",
    "margin calculator nse bse india",
    "span margin estimator",
    "exposure margin fno",
    "sebi peak margin rules",
  ],
};

export default function MarginCalculatorPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          F&O Margin Estimator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Illustrative SPAN/exposure assumptions. Actual exchange/broker margin varies with contract, volatility and current risk parameters.
        </p>
      </header>

      <MarginCalculator />
    </main>
  );
}
