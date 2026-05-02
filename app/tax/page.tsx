import type { Metadata } from 'next'
import Link from 'next/link'
import TaxCalculator from '@/components/calculators/tax/TaxCalculatorIsland'

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2024-25',
  description: 'Compare Old vs New tax regime for FY 2024-25. Calculate income tax with slab breakdown, 80C deductions, HRA, and monthly take-home estimate.',
  openGraph: {
    title: 'Income Tax Calculator FY 2024-25 — FinCalc India',
    description: 'Free income tax calculator with Old vs New regime comparison.',
    url: 'https://fincalc-india.vercel.app/tax',
  },
}

export default function TaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <nav aria-label="Breadcrumb" className="text-sm text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Income Tax Calculator</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Income Tax Calculator FY 2024-25</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Compare Old vs New regime. Calculate total tax liability, effective rate,
          and monthly take-home salary for FY 2024-25.
        </p>

        <div className="mt-6">
          <TaxCalculator />
        </div>

        <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Old vs New Tax Regime — FY 2024-25</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-3">⚡ New Regime (Default)</p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Up to ₹3,00,000</span><span className="font-semibold">Nil</span></div>
                  <div className="flex justify-between"><span>₹3L – ₹7L</span><span className="font-semibold">5%</span></div>
                  <div className="flex justify-between"><span>₹7L – ₹10L</span><span className="font-semibold">10%</span></div>
                  <div className="flex justify-between"><span>₹10L – ₹12L</span><span className="font-semibold">15%</span></div>
                  <div className="flex justify-between"><span>₹12L – ₹15L</span><span className="font-semibold">20%</span></div>
                  <div className="flex justify-between"><span>Above ₹15L</span><span className="font-semibold">30%</span></div>
                  <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-medium">Standard deduction: ₹75,000</div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">📋 Old Regime</p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Up to ₹2,50,000</span><span className="font-semibold">Nil</span></div>
                  <div className="flex justify-between"><span>₹2.5L – ₹5L</span><span className="font-semibold">5%</span></div>
                  <div className="flex justify-between"><span>₹5L – ₹10L</span><span className="font-semibold">20%</span></div>
                  <div className="flex justify-between"><span>Above ₹10L</span><span className="font-semibold">30%</span></div>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 font-medium">Standard deduction: ₹50,000</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example: ₹12 Lakh Annual Income</h2>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-100 dark:border-green-900 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">New Regime</p>
                  <p>Taxable: ₹12L − ₹75K = <strong>₹11,25,000</strong></p>
                  <p className="font-bold text-blue-700 dark:text-blue-400 mt-1">Tax payable: ₹71,500</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Old Regime (₹1.5L 80C + ₹25K 80D)</p>
                  <p>Taxable: ₹12L − ₹2.25L = <strong>₹9,75,000</strong></p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">Tax payable: ₹1,11,800</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-green-200 dark:border-green-800">New Regime saves ₹40,300 in this case. Compare with your actual deductions above.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Which tax regime should I choose?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">The New Regime is usually better if you have limited deductions. The Old Regime can work better when you claim HRA, 80C, 80D, home loan interest, NPS, or other eligible deductions.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Is income up to ₹7 lakh tax-free under the New Regime?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes. Section 87A rebate makes tax payable nil when taxable income is up to ₹7 lakh under the New Regime for FY 2024-25.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Can salaried taxpayers switch regimes every year?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes. Salaried individuals without business income can choose Old or New Regime each financial year while filing their income tax return.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Which deductions are available in the Old Regime?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Common deductions include Section 80C up to ₹1.5 lakh, 80D health insurance, HRA exemption, home loan interest, education loan interest, and eligible NPS contributions.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Does this calculator include cess and surcharge?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">The calculator estimates regular tax and health and education cess. Surcharge and marginal relief can vary for high-income cases, so verify large-income calculations before filing.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Related Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/sip" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">📈</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">SIP Calculator</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Plan tax-saving ELSS SIP</p>
                </div>
              </Link>
              <Link href="/ppf" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🏛️</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">PPF Calculator</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">80C tax-saving PPF</p>
                </div>
              </Link>
              <Link href="/emi" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🏦</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">EMI Calculator</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Home loan tax benefits</p>
                </div>
              </Link>
            </div>
          </section>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">
            ⚠️ Disclaimer: Tax calculations are estimates based on FY 2024-25 slabs. Actual tax may differ based on exemptions, surcharge, cess, and individual circumstances. Consult a CA for filing.
          </p>

        </div>
      </div>
    </main>
  )
}
