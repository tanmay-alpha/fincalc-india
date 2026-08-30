import type { Metadata } from "next";
import PresumptiveTaxCalculator from "@/components/calculators/presumptive-tax/PresumptiveTaxCalculator";
import PresumptiveTaxInfo from "@/components/seo/PresumptiveTaxInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Presumptive Tax Calculator (Section 44AD & 44ADA) — Tax Year 2026-27",
  description:
    "Calculate presumptive income and tax for Professionals (44ADA - 50% rate, ₹75L limit) and Businesses (44AD - 6%/8% rate, ₹3Cr limit) under Tax Year 2026-27 slabs. Compare with actual profit and audit triggers.",
  openGraph: {
    title: "Presumptive Tax Calculator (Section 44AD & 44ADA) — Tax Year 2026-27 — FinCalc India",
    description:
      "Compute deemed profits, slab-rate taxes, and evaluate tax audit triggers for Section 44AD and 44ADA under Tax Year 2026-27 rules.",
  },
};

export default function PresumptiveTaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Presumptive Tax Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">💼</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Presumptive Taxation Calculator — Tax Year 2026-27
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Estimate deemed profits and tax for professionals (Section 44ADA) and businesses (Section 44AD) with enhanced digital turnover limits (₹75L / ₹3Cr) under Tax Year 2026-27 slabs.
          </p>
        </div>

        <PresumptiveTaxCalculator />
        <PresumptiveTaxInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
