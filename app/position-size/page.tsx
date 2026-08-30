import type { Metadata } from "next";
import PositionSizeCalculator from "@/components/calculators/position-size/PositionSizeCalculator";
import PositionSizeInfo from "@/components/seo/PositionSizeInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Position Size & Risk-Reward Calculator — FinCalc India",
  description:
    "Calculate optimal share quantity, stop-loss distance, target price, and rupee risk per trade for intraday and swing trading using the 1% risk rule.",
  openGraph: {
    title: "Position Size & Risk-Reward Calculator — FinCalc India",
    description:
      "Exact quantity sizing, target price calculation, and capital risk management for Indian stock market traders.",
  },
};

export default function PositionSizePage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Position Size Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🎯</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Intraday Risk-Reward & Position Size Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Calculate exact share quantities based on the 1% risk rule, stop-loss price, target risk-reward ratio, and SEBI intraday margin leverage limits.
          </p>
        </div>

        <PositionSizeCalculator />
        <PositionSizeInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="fno" />
      </div>
    </main>
  );
}
