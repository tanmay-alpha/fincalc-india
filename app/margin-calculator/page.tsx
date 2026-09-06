import type { Metadata } from "next";
import MarginCalculator from "@/components/calculators/margin/MarginCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="margin-calculator"
      assumptions={[
        "Margin calculations estimate SPAN and Exposure requirements based on illustrative risk parameters.",
        "Actual exchange margins vary dynamically in real time depending on market volatility and price shocks.",
        "SEBI peak margin regulations require 100% upfront margin collection prior to order execution.",
      ]}
      sources={[
        {
          label: "Securities and Exchange Board of India (SEBI) — Comprehensive Risk Management Framework",
          url: "https://www.sebi.gov.in/",
        },
      ]}
    >
      <MarginCalculator />
    </CalculatorPageShell>
  );
}
