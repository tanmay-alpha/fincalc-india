import type { Metadata } from "next";
import CapitalGainsCalculator from "@/components/calculators/capital-gains/CapitalGainsCalculator";
import CapitalGainsInfo from "@/components/seo/CapitalGainsInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator — Tax Year 2026-27",
  description:
    "Calculate STCG and LTCG tax on Equity, Debt Mutual Funds, Real Estate, and Gold under Tax Year 2026-27 rules (12.5% LTCG, ₹1.25L exemption, real estate grandfathering).",
  openGraph: {
    title: "Capital Gains Tax Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Calculate Capital Gains Tax on shares, property, and gold with 12.5% LTCG, 20% STCG, and grandfathering rules.",
  },
};

export default function CapitalGainsTaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Capital Gains Tax Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Capital Gains Tax Calculator — Tax Year 2026-27
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Calculate LTCG and STCG on Equity, Real Estate, Debt MF, and Gold with Tax Year 2026-27 rules, ₹1.25 Lakh exemption, and property grandfathering comparison.
          </p>
        </div>

        <CapitalGainsCalculator />
        <CapitalGainsInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
