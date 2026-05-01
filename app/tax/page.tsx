import type { Metadata } from 'next'
import TaxCalculator from '@/components/calculators/tax/TaxCalculator'

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2024-25',
  description: 'Compare Old vs New tax regime for FY 2024-25. Calculate income tax with slab breakdown, 80C deductions, HRA, and monthly take-home estimate.',
}

export default function TaxPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Static header */}
        <nav className="text-sm text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Income Tax Calculator</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Income Tax Calculator FY 2024-25
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
          Compare Old vs New regime. Calculate total tax liability, effective rate, and monthly take-home salary for FY 2024-25.
        </p>

        {/* Interactive calculator */}
        <div className="mt-6">
          <TaxCalculator />
        </div>

        {/* Static SEO content */}
        <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Old vs New Regime — FY 2024-25</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-3">⚡ New Regime</p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Up to ₹3,00,000</span><span className="font-medium">0%</span></div>
                  <div className="flex justify-between"><span>₹3L – ₹7L</span><span className="font-medium">5%</span></div>
                  <div className="flex justify-between"><span>₹7L – ₹10L</span><span className="font-medium">10%</span></div>
                  <div className="flex justify-between"><span>₹10L – ₹12L</span><span className="font-medium">15%</span></div>
                  <div className="flex justify-between"><span>₹12L – ₹15L</span><span className="font-medium">20%</span></div>
                  <div className="flex justify-between"><span>Above ₹15L</span><span className="font-medium">30%</span></div>
                  <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">Standard deduction: ₹75,000</div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">📋 Old Regime</p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Up to ₹2,50,000</span><span className="font-medium">0%</span></div>
                  <div className="flex justify-between"><span>₹2.5L – ₹5L</span><span className="font-medium">5%</span></div>
                  <div className="flex justify-between"><span>₹5L – ₹10L</span><span className="font-medium">20%</span></div>
                  <div className="flex justify-between"><span>Above ₹10L</span><span className="font-medium">30%</span></div>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500">Standard deduction: ₹50,000</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example: ₹12L Annual Income</h2>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-100 dark:border-green-900 text-sm text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-2">New Regime</p>
                  <p className="mt-1 font-bold text-green-700 dark:text-green-400">Tax: ₹71,500</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Old Regime (with ₹1.5L 80C)</p>
                  <p className="mt-1 font-bold text-blue-700 dark:text-blue-400">Tax: ₹1,11,800</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">* New saves ₹40,300 in this case.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">Which regime is better?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">The New Regime is better for those with few deductions. The Old Regime is better if you claim significant deductions like HRA, 80C, or home loan interest.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">What is Rebate 87A?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">If your taxable income is ≤₹7L under the New Regime, you get a rebate that makes your tax liability zero.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">Can I switch regimes every year?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Salaried individuals without business income can switch regimes every year when filing returns.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">What deductions work in New Regime?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Only the standard deduction (₹75,000) and employer NPS contribution (80CCD(2)) are generally allowed.</p>
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">When does surcharge apply?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Surcharge applies when total income exceeds ₹50 lakh. It ranges from 10% to 25% (or 37% in Old Regime for &gt;₹5Cr).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Related Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="/ppf" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🏛️</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">PPF Calculator</p>
                  <p className="text-xs text-slate-400">80C tax-free savings</p>
                </div>
              </a>
              <a href="/sip" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">📈</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">SIP Calculator</p>
                  <p className="text-xs text-slate-400">ELSS tax saving</p>
                </div>
              </a>
              <a href="/emi" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🏦</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">EMI Calculator</p>
                  <p className="text-xs text-slate-400">Home loan tax benefits</p>
                </div>
              </a>
            </div>
          </section>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">
            ⚠️ Disclaimer: Tax calculations are estimates based on FY 2024-25 slabs. Does not account for all personal deductions or surcharges. Consult a CA for filing.
          </p>

        </div>
      </div>
    </main>
  )
}
