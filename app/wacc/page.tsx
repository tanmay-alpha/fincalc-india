import type { Metadata } from "next";
import WaccCalculator from "@/components/calculators/wacc/WaccCalculator";

export const metadata: Metadata = {
  title: "WACC Calculator India — Weighted Average Cost of Capital",
  description:
    "Calculate company WACC (Weighted Average Cost of Capital) with corporate tax shield adjustment, cost of equity (Ke), and cost of debt (Kd).",
  keywords: [
    "wacc calculator india",
    "weighted average cost of capital",
    "cost of equity formula",
    "after tax cost of debt",
    "corporate finance hurdle rate",
  ],
};

export default function WaccPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          WACC Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calculate corporate Weighted Average Cost of Capital (WACC) with debt tax-shield advantages and capital structure weighting.
        </p>
      </header>

      <WaccCalculator />
    </main>
  );
}
