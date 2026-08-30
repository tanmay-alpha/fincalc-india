import type { Metadata } from 'next';
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import TaxInfo from "@/components/seo/TaxInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: 'Income Tax Calculator — Tax Year 2026-27 (FY 2026-27)',
  description: 'Calculate and compare Income Tax under Old vs New Tax Regime for Tax Year 2026-27 (Income Tax Act, 2025). Detailed slab breakdown, ₹75k standard deduction, Section 157 rebate, and tax-saving recommendations.',
  openGraph: {
    title: 'Income Tax Calculator — Tax Year 2026-27 — FinCalc India',
    description: 'Free Old vs New tax regime comparison for Tax Year 2026-27 (FY 2026-27). Find the regime that saves you the most tax.',
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Income Tax Calculator — Tax Year 2026-27 <span className="text-sm font-normal text-muted-foreground">(FY 2026-27)</span></h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Compare Old vs New tax regime under Tax Year 2026-27 slabs (Income Tax Act, 2025). Includes ₹75,000 standard deduction and Section 157 (formerly 87A) rebate up to ₹12L.
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
