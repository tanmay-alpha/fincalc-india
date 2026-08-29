import type { Metadata } from "next";
import FnOBrokerageCalculator from "@/components/calculators/fno-brokerage/FnOBrokerageCalculator";
import FnOBrokerageInfo from "@/components/seo/FnOBrokerageInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "F&O Brokerage & Break-Even Calculator",
  description:
    "Calculate itemized brokerage, revised STT, exchange transaction charges, GST, SEBI fees, stamp duty, and the exact points needed to break even in Futures & Options trading.",
  openGraph: {
    title: "F&O Brokerage & Break-Even Calculator — FinCalc India",
    description:
      "Accurate brokerage and statutory charge calculator with exact break-even exit price for Nifty, BankNifty, and stock options.",
  },
};

export default function FnOBrokeragePage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "F&O Brokerage Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">⚡</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              F&O Brokerage & Break-Even Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Itemize all discount broker commissions, revised STT (Budget 2024), exchange charges, SEBI turnover fees, 18% GST, and find the exact price points needed to break even.
          </p>
        </div>

        <FnOBrokerageCalculator />
        <FnOBrokerageInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
