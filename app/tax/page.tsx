import { Metadata } from "next";
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import TaxInfo from "@/components/seo/TaxInfo";

export const metadata: Metadata = {
  title: 'Income Tax Calculator',
  description: 'Free income tax calculator for FY 2024-25. Compare Old vs New regime with slab-by-slab breakdown, effective tax rate, and take-home estimate.',
  openGraph: {
    title: 'Income Tax Calculator | FinCalc India',
    description: 'Compare Old vs New tax regime with slab-by-slab breakdown for FY 2024-25.',
    type: 'website',
  },
};

export default function TaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">Income Tax Calculator</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Income Tax Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Compare old and new regime tax estimates with slab-by-slab breakdown. See which regime saves you more.
          </p>
        </div>
        <TaxCalculator />
        <TaxInfo />
      </div>
    </main>
  );
}
