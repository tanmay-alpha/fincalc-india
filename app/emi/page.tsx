import type { Metadata } from 'next'
import Link from 'next/link'
import EMICalculator from '@/components/calculators/emi/EMICalculatorIsland'

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Calculate home loan, car loan, and personal loan EMI instantly. Full amortization schedule with principal vs interest breakdown.',
  openGraph: {
    title: 'EMI Calculator — FinCalc India',
    description: 'Free EMI calculator with amortization schedule for Indian borrowers.',
    url: 'https://fincalc-india.vercel.app/emi',
  },
}

export default function EMIPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <nav aria-label="Breadcrumb" className="text-sm text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">EMI Calculator</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">EMI Calculator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Calculate your monthly loan instalment for home, car, or personal loans.
          Get full amortization schedule with principal vs interest breakdown.
        </p>

        <div className="mt-6">
          <EMICalculator />
        </div>

        <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How EMI Calculator Works</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              An EMI (Equated Monthly Instalment) calculator estimates your monthly loan repayment
              using the reducing balance method. Interest is recalculated each month on outstanding
              principal, which decreases as you repay. Our calculator generates a complete
              month-by-month amortization schedule showing every payment split.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">EMI Formula</h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              P = Principal · r = Monthly interest rate (annual ÷ 12 ÷ 100) · n = Tenure in months
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
              <p>Loan Amount: <strong>₹30,00,000</strong></p>
              <p>Interest Rate: <strong>8.5% per year</strong></p>
              <p>Tenure: <strong>20 years (240 months)</strong></p>
              <p className="mt-2 font-bold text-blue-700 dark:text-blue-400">Monthly EMI ≈ ₹26,035</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Interest: ₹32,48,400 · Total Payment: ₹62,48,400</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">What is the difference between flat rate and reducing balance EMI?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Flat rate applies interest on the full principal throughout the tenure. Reducing balance recalculates interest monthly on outstanding principal. All Indian banks use reducing balance — actual cost is significantly lower than flat rate.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Can I reduce my EMI after taking a loan?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes — through part prepayments to reduce outstanding principal, or refinancing to a lower rate. RBI guidelines allow prepayment with no penalty on floating rate home loans.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">What is a safe EMI-to-income ratio?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Keep all EMIs combined below 40–50% of monthly take-home salary. Home loan EMI alone should stay under 30% for financial stability.</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Does prepaying a loan save significant interest?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Yes — especially in early years. A ₹1 lakh prepayment in year 1 of a 20-year home loan can eliminate ₹3–4 lakh in total interest paid over the tenure.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">What is the maximum home loan tenure in India?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Most banks offer up to 30 years (360 months). Longer tenure means lower EMI but much higher total interest. Always choose the shortest tenure your budget allows.</p>
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
                  <p className="text-xs text-slate-400 dark:text-slate-500">Monthly investment returns</p>
                </div>
              </Link>
              <Link href="/fd" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">FD Calculator</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Fixed deposit maturity</p>
                </div>
              </Link>
              <Link href="/tax" className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-xl">🧾</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Tax Calculator</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Income tax planning</p>
                </div>
              </Link>
            </div>
          </section>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">
            ⚠️ Disclaimer: EMI calculations are estimates based on the reducing balance method. Actual EMI may vary based on processing fees and bank-specific terms. Always verify with your lender.
          </p>

        </div>
      </div>
    </main>
  )
}
