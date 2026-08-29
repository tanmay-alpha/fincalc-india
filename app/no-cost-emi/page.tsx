import type { Metadata } from "next";
import NoCostEMICalculator from "@/components/calculators/no-cost-emi/NoCostEMICalculator";
import NoCostEMIInfo from "@/components/seo/NoCostEMIInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "No-Cost EMI Truth & Hidden Cost Calculator",
  description:
    "Discover the true interest rate, 18% GST on interest, and hidden processing fees of No-Cost EMI on phones, laptops, and consumer electronics.",
  openGraph: {
    title: "No-Cost EMI Truth & APR Revealer — FinCalc India",
    description:
      "Find out if 0% interest EMI is really free or if paying upfront with a discount saves you thousands.",
  },
};

export default function NoCostEMIPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "No-Cost EMI Truth Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">📱</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              No-Cost EMI & BNPL True Cost Revealer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Reveal the hidden 18% GST on interest, processing fees, and forfeited upfront card discounts on e-commerce 0% EMI schemes.
          </p>
        </div>

        <NoCostEMICalculator />
        <NoCostEMIInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="no-cost-emi" />
      </div>
    </main>
  );
}
