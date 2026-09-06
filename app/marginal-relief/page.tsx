import type { Metadata } from "next";
import MarginalReliefCalculator from "@/components/calculators/marginal-relief/MarginalReliefCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Marginal Relief & High-Income Surcharge Calculator India — Tax Year 2026-27",
  description:
    "Calculate marginal relief on income tax surcharge above ₹50 Lakh, ₹1 Crore, ₹2 Crore, and ₹5 Crore for Tax Year 2026-27 under New and Old Regimes.",
  keywords: [
    "marginal relief calculator india",
    "income tax surcharge 50 lakh 1 crore",
    "marginal relief formula income tax",
    "high income tax surcharge new regime",
    "tax year 2026-27 marginal relief",
  ],
};

export default function MarginalReliefPage() {
  return (
    <CalculatorPageShell
      id="marginal-relief"
      assumptions={[
        "Marginal relief caps total tax payable with surcharge so it does not exceed tax on threshold plus the incremental income above that threshold.",
        "Calculations apply to statutory thresholds of ₹50 Lakh, ₹1 Crore, ₹2 Crore, and ₹5 Crore.",
        "4% Health & Education Cess is levied on total tax after applying marginal relief.",
      ]}
      sources={[
        {
          label: "Income Tax Department — Surcharge & Marginal Relief Provisions",
          url: "https://incometaxindia.gov.in/",
        },
      ]}
    >
      <MarginalReliefCalculator />
    </CalculatorPageShell>
  );
}
