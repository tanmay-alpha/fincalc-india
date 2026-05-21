import type { Metadata } from 'next';
import TaxCalculator from '@/components/calculators/tax/TaxCalculator';
import TaxInfo from '@/components/seo/TaxInfo';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedCalculators from '@/components/shared/RelatedCalculators';

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2025-26',
  description: 'Compare Old vs New tax regime for FY 2025-26 / AY 2026-27. Calculate income tax with new slab breakdown, 80C deductions, HRA, and monthly take-home estimate.',
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Income Tax Calculator FY 2025-26
            </h1>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">FY 2025-26</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Compare Old vs New regime. Calculate total tax, effective rate, and monthly take-home for FY 2025-26.
          </p>
        </div>
        <TaxCalculator />
        <TaxInfo />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
