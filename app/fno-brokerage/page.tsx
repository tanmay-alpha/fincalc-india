import type { Metadata } from "next";
import FnOBrokerageCalculator from "@/components/calculators/fno-brokerage/FnOBrokerageCalculator";
import FnOBrokerageInfo from "@/components/seo/FnOBrokerageInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "F&O Brokerage & Break-Even Calculator — Tax Year 2026-27",
  description:
    "Calculate itemized brokerage, Tax Year 2026-27 STT (0.05% futures, 0.15% flat options), exchange charges, GST, SEBI fees, and exact points to break even.",
  openGraph: {
    title: "F&O Brokerage & Break-Even Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Accurate brokerage and statutory charge calculator with Tax Year 2026-27 STT rates and exact break-even exit price for F&O trading.",
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
              F&O Brokerage & Break-Even Calculator — Tax Year 2026-27
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Itemize discount broker commissions, updated STT rates (Futures 0.05%, Options 0.15% flat), exchange charges, SEBI turnover fees, 18% GST, and find your exact break-even points.
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
