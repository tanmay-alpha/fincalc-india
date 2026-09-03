import type { Metadata } from "next";
import FIRECalculator from "@/components/calculators/fire/FIRECalculator";
import FIREInfo from "@/components/seo/FIREInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "FIRE & Early Retirement Calculator — Financial Independence in India",
  description:
    "Calculate your FIRE corpus (Lean, Standard, Fat FIRE) and required monthly savings to achieve early financial independence in India.",
  openGraph: {
    title: "FIRE Calculator — Financial Independence Retire Early — FinCalc India",
    description:
      "Model inflation-adjusted wealth accumulation and retirement depletion to retire early in India.",
  },
};

export default function FIREPage() {
  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Investments", href: "/#calculators" },
            { label: "FIRE Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  FIRE & Early Retirement Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Financial Independence
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Model your Lean, Standard, and Fat FIRE targets based on safe withdrawal rates (SWR) and calculate the required monthly SIP to achieve early retirement.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="FIRE Calculator"
              assumptions={[
                "Standard Safe Withdrawal Rate (SWR) is assumed at 3.0% to 3.5% for extended 35+ year Indian retirements (given Indian inflation).",
                "Annual expenses are projected to retirement age using compound inflation.",
                "Lean FIRE target: 20× annual expenses; Standard FIRE: 25-33× annual expenses; Fat FIRE: 40× annual expenses.",
                "Post-retirement real return (return minus inflation) is modeled between 1% and 2.5% to ensure perpetual corpus survival.",
              ]}
            />
          </div>
        </div>

        <FIRECalculator />

        {/* Separated SEO Section */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <FIREInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="fire" />
      </div>
    </main>
  );
}
