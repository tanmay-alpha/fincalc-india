import type { Metadata } from 'next'
import EMICalculator from '@/components/calculators/emi/EMICalculator'

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Calculate home loan, car loan, and personal loan EMI instantly. See monthly payment breakdown, total interest paid, and full amortization schedule.',
  openGraph: {
    title: 'EMI Calculator — FinCalc India',
    description: 'Free loan EMI calculator with complete amortization schedule.',
  },
}

export default function EMIPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Static header — server rendered, Google can read */}
        <nav className="text-sm text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">EMI Calculator</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          EMI Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
          Calculate your monthly loan instalment for home, car, or personal loans. Get full amortization schedule with principal vs interest breakdown.
        </p>

        {/* Interactive calculator — client component */}
        <div className="mt-6">
          <EMICalculator />
        </div>

        {/* Static SEO content — server rendered */}
        <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How EMI Calculator Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              An EMI (Equated Monthly Instalment) calculator estimates your monthly loan repayment amount. It uses the reducing balance method where interest is calculated on outstanding principal each month. Our calculator also generates a complete amortization schedule showing every payment split between principal and interest.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">EMI Formula</h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
              Where P = Principal loan amount, r = Monthly interest rate (annual ÷ 12 ÷ 100), n = Tenure in months
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
              <p>Loan Amount: <strong>₹30,00,000</strong></p>
              <p>Interest Rate: <strong>8.5% per year</strong></p>
              <p>Tenure: <strong>20 years (240 months)</strong></p>
              <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">Monthly EMI ≈ ₹26,035</p>
              <p className="text-xs text-slate-500 mt-1">Total Payment: ₹62,48,400 | Total Interest: ₹32,48,400</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">What is the difference between flat rate and reducing balance EMI?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Flat rate applies interest on full principal throughout tenure. Reducing balance applies interest only on outstanding principal, which decreases each month. Banks use reducing balance — it results in lower effective cost.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">Can I reduce my EMI after taking a loan?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes, through part prepayments to reduce principal (lowering EMI or tenure), or refinancing to a lower rate. Most banks allow prepayment with no charges on floating rate home loans.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">What is a good EMI-to-income ratio?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Keep total EMIs below 40-50% of monthly take-home salary. Home loan EMI alone should ideally be under 30% of take-home pay for financial stability.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">Does prepaying a loan save significant interest?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes. Prepaying in early years saves the most since interest is front-loaded. A ₹1 lakh prepayment in year 1 of a 20-year loan can save ₹3-4 lakh in total interest.</p>
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">What is the maximum home loan tenure in India?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Most banks offer up to 30 years (360 months). Longer tenure reduces EMI but increases total interest paid significantly. Choose the shortest tenure your budget allows.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Related Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="/sip" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">📈</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">SIP Calculator</p>
                  <p className="text-xs text-slate-400">Monthly investment returns</p>
                </div>
              </a>
              <a href="/fd" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">FD Calculator</p>
                  <p className="text-xs text-slate-400">Fixed deposit maturity</p>
                </div>
              </a>
              <a href="/tax" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🧾</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Tax Calculator</p>
                  <p className="text-xs text-slate-400">Income tax planning</p>
                </div>
              </a>
            </div>
          </section>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">
            ⚠️ Disclaimer: EMI calculations are estimates based on reducing balance method. Actual EMI may vary based on processing fees, GST on charges, and specific loan terms. Always verify with your lender.
          </p>

        </div>
      </div>
    </main>
  )
}
