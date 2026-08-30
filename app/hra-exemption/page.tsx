import type { Metadata } from "next";
import HRACalculator from "@/components/calculators/hra/HRACalculator";
import HRAInfo from "@/components/seo/HRAInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "HRA Exemption Calculator & Rent Optimizer FY 2025-26",
  description:
    "Calculate exempt and taxable HRA under Section 10(13A). Compare Metro vs Non-Metro limits, monthly vs annual salary, and calculate net household tax benefit when paying rent to parents.",
  openGraph: {
    title: "HRA Exemption Calculator & Rent Optimizer — FinCalc India",
    description:
      "Accurately calculate tax-exempt House Rent Allowance with 3 statutory limits and parent rent arbitrage planner.",
  },
};

export default function HRAExemptionPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "HRA Exemption Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏠</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              HRA Exemption Calculator & Rent Optimizer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Compute your tax-exempt House Rent Allowance under Section 10(13A), compare 50%/40% city limits, and calculate household tax savings when paying rent to parents.
          </p>
        </div>

        <HRACalculator />
        <HRAInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
