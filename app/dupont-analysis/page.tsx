import type { Metadata } from "next";
import DuPontCalculator from "@/components/calculators/dupont/DuPontCalculator";

export const metadata: Metadata = {
  title: "DuPont ROE Analysis Calculator India — 3-Step ROE Decomposition",
  description:
    "Decompose Return on Equity (ROE) into Operating Profit Margin, Asset Turnover, and Financial Leverage Gearing using DuPont framework.",
  keywords: [
    "dupont analysis calculator india",
    "roe decomposition formula",
    "profit margin asset turnover leverage",
    "return on equity financial analysis",
    "fundamental stock analysis tool",
  ],
};

export default function DuPontPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          DuPont ROE Decomposition
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Deconstruct Return on Equity into operational efficiency, asset utilization, and financial leverage to identify company quality.
        </p>
      </header>

      <DuPontCalculator />
    </main>
  );
}
