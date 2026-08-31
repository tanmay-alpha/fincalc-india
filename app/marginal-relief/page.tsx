import type { Metadata } from "next";
import MarginalReliefCalculator from "@/components/calculators/marginal-relief/MarginalReliefCalculator";

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
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Marginal Relief & High-Income Surcharge
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Determine exact marginal relief protection under the Income Tax Act so taxpayers right above ₹50L, ₹1Cr, ₹2Cr, or ₹5Cr thresholds never pay extra tax exceeding their extra earnings.
        </p>
      </header>

      <MarginalReliefCalculator />
    </main>
  );
}
