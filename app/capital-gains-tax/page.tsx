import type { Metadata } from "next";
import CapitalGainsCalculator from "@/components/calculators/capital-gains/CapitalGainsCalculator";
import CapitalGainsInfo from "@/components/seo/CapitalGainsInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { Coins } from "lucide-react";

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
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tax & Compliance", href: "/#calculators" },
            { label: "Capital Gains Tax Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Coins className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Capital Gains Tax Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Tax Year 2026–27
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Calculate LTCG and STCG on Equity, Real Estate, Debt MF, and Gold with post-Finance Act 2024/2026 unified rules (12.5% LTCG, ₹1.25 Lakh exemption, and real estate grandfathering).
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="Capital Gains Tax Calculator"
              metadata={{
                taxYear: "2026–27",
                currentAct: "Income-tax Act, 2025 as amended by Finance Act, 2026",
                currentSections: ["Section 112A", "Section 111A", "Section 112", "Section 50AA"],
                effectiveFrom: "23 July 2024 / 01 April 2026",
                officialSources: [
                  "Income Tax Department — Capital Gains Rates",
                  "CBDT Circular on Real Estate Grandfathering Option",
                ],
              }}
              assumptions={[
                "Listed Equity & Equity Mutual Funds: 12.5% LTCG on aggregate gains above ₹1.25 Lakh per financial year.",
                "Listed Equity STCG (Section 111A): Flat 20% tax rate.",
                "Real Estate acquired before 23 July 2024: Taxpayer can choose between 12.5% without indexation OR 20% with indexation (whichever is lower).",
                "Unlisted shares & real estate holding period for long-term classification is 24 months; listed equity is 12 months.",
              ]}
            />
          </div>
        </div>

        <CapitalGainsCalculator />

        {/* Separated SEO Section */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <CapitalGainsInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="capital-gains" />
      </div>
    </main>
  );
}
