import type { Metadata } from "next";
import OptionPayoffCalculator from "@/components/calculators/option-payoff/OptionPayoffCalculator";
import OptionPayoffInfo from "@/components/seo/OptionPayoffInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Option Strategy Payoff Visualizer & Breakeven Calculator",
  description:
    "Interactive option payoff chart builder with presets for Bull Call Spread, Bear Put Spread, Straddle, Strangle, Iron Condor, and Covered Call with multi-breakeven detection.",
  openGraph: {
    title: "Option Strategy Payoff Visualizer — FinCalc India",
    description:
      "Visualize expiry payoff, max profit, max loss, and breakeven points for multi-leg option strategies.",
  },
};

export default function OptionPayoffPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Option Strategy Payoff Visualizer" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">📈</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Option Strategy Payoff Visualizer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Build and visualize multi-leg option strategies (Bull Call, Bear Put, Straddle, Iron Condor) with interactive expiry payoff curves and exact breakeven levels.
          </p>
        </div>

        <OptionPayoffCalculator />
        <OptionPayoffInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
