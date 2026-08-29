import type { Metadata } from 'next';
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import TaxInfo from "@/components/seo/TaxInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2025-26',
  description: 'Calculate and compare Income Tax under Old vs New Tax Regime for FY 2025-26 (AY 2026-27). Detailed slab breakdown, standard deduction, 87A rebate, and tax-saving recommendations.',
  openGraph: {
    title: 'Income Tax Calculator FY 2025-26 — FinCalc India',
    description: 'Free Old vs New tax regime comparison for FY 2025-26. Find the regime that saves you the most tax.',
  }
}

export default function TaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Income Tax Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🧾</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Income Tax Calculator (FY 2025-26)</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Compare Old vs New tax regime under current Indian tax slabs. Find which regime saves you more tax with deductions.
          </p>
        </div>
        <TaxCalculator />
        <TaxInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
