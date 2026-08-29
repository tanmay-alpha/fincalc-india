import type { Metadata } from 'next'
import EMICalculator from '@/components/calculators/emi/EMICalculatorIsland'
import EMIInfo from '@/components/seo/EMIInfo'
import Breadcrumb from '@/components/ui/Breadcrumb'
import RelatedCalculators from '@/components/shared/RelatedCalculators'
import CalculatorDisclaimer from '@/components/ui/CalculatorDisclaimer'

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Calculate loan EMI, total interest, and total payment for home, car, and personal loans. Monthly amortization schedule and interactive interest split chart.',
  openGraph: {
    title: 'EMI Calculator — FinCalc India',
    description: 'Free home loan, car loan & personal loan EMI calculator. Accurate monthly amortization schedule.',
    url: 'https://fincalc-india.vercel.app/emi',
  },
}

export default function EMIPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "EMI Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🏦</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">EMI Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Calculate your monthly loan EMI, total interest payable, and amortization schedule for home, car, or personal loans.
          </p>
        </div>
        
        <EMICalculator />
        <EMIInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="emi" />
      </div>
    </main>
  );
}
