import type { Metadata } from "next";
import FIRECalculator from "@/components/calculators/fire/FIRECalculator";
import FIREInfo from "@/components/seo/FIREInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata: Metadata = {
  title: "FIRE & Early Retirement Calculator",
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
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "FIRE Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏖️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              FIRE & Early Retirement Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Calculate your Lean, Standard, and Fat FIRE corpus targets and the exact monthly investment required today to achieve financial freedom.
          </p>
        </div>

        <FIRECalculator />
        <FIREInfo />
        <RelatedCalculators current="fire" />
      </div>
    </main>
  );
}
