export default function EMIInfo() {
  return (
    <div className="mt-12 space-y-8
      border-t border-slate-200 dark:border-slate-800
      pt-8">

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          How EMI Calculator Works
        </h2>
        <p className="text-slate-600
          dark:text-slate-400 text-sm leading-relaxed">
          An EMI (Equated Monthly Instalment) calculator
          helps you estimate your monthly loan repayment
          amount. It calculates the fixed monthly payment
          required to fully repay a loan over a chosen
          tenure at a given interest rate. Our calculator
          also generates a complete amortization schedule
          showing how each payment is split between
          principal and interest.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          EMI Formula
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900
          rounded-xl p-4 font-mono text-sm
          text-slate-700 dark:text-slate-300
          border border-slate-200 dark:border-slate-700">
          EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
        </div>
        <p className="text-slate-500
          dark:text-slate-400 text-xs mt-2">
          Where P = Principal loan amount,
          r = Monthly interest rate (annual rate ÷ 12 ÷ 100),
          n = Loan tenure in months
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          Example Calculation
        </h2>
        <div className="bg-blue-50 dark:bg-blue-950/30
          rounded-xl p-4 border border-blue-100
          dark:border-blue-900 text-sm
          text-slate-700 dark:text-slate-300">
          <p>Loan Amount: <strong>₹30,00,000</strong></p>
          <p>Interest Rate: <strong>8.5% per year</strong></p>
          <p>Tenure: <strong>20 years (240 months)</strong></p>
          <p className="mt-2 font-semibold
            text-blue-700 dark:text-blue-400">
            Monthly EMI ≈ ₹26,035
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total Payment: ₹62,48,400 |
            Total Interest: ₹32,48,400
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is the difference between flat rate and reducing balance EMI?',
              a: 'Flat rate calculates interest on the full principal throughout the tenure. Reducing balance calculates interest on the outstanding principal, which decreases each month. Most bank loans use reducing balance, which results in lower effective interest cost.'
            },
            {
              q: 'Can I reduce my EMI after taking a loan?',
              a: 'Yes, through two ways: making part prepayments to reduce principal (lowering EMI or tenure), or refinancing to a lower interest rate. Most banks allow prepayment with minimal or no charges on floating rate home loans.'
            },
            {
              q: 'What is a good EMI-to-income ratio?',
              a: 'Financial advisors recommend keeping total EMIs (all loans combined) below 40-50% of your monthly take-home salary. Home loan EMI alone should ideally be below 30% of take-home pay.'
            },
            {
              q: 'Does prepaying a loan save interest?',
              a: 'Yes, significantly. Prepaying in early years saves more because interest is front-loaded. A ₹1 lakh prepayment in year 1 of a 20-year loan can save ₹3-4 lakh in interest over the tenure.'
            },
            {
              q: 'What is the maximum loan tenure for home loans in India?',
              a: 'Most banks offer home loan tenures up to 30 years (360 months). Longer tenure reduces EMI but increases total interest paid significantly. Choose the shortest tenure your budget allows.'
            },
          ].map((faq, i) => (
            <div key={i} className="border-b
              border-slate-100 dark:border-slate-800
              pb-4 last:border-0">
              <h3 className="font-semibold text-sm
                text-slate-800 dark:text-slate-200 mb-1">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-500
                dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          Related Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3
          gap-3">
          {[
            {href:'/sip', icon:'📈',
             name:'SIP Calculator',
             desc:'Monthly investment returns'},
            {href:'/fd', icon:'🔒',
             name:'FD Calculator',
             desc:'Fixed deposit maturity'},
            {href:'/tax', icon:'🧾',
             name:'Tax Calculator',
             desc:'Income tax planning'},
          ].map(c => (
            <a key={c.href} href={c.href}
              className="flex items-center gap-3
                bg-white dark:bg-slate-900
                rounded-xl border border-slate-200
                dark:border-slate-700 p-4
                hover:shadow-md hover:-translate-y-0.5
                transition-all group">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold
                  text-slate-900 dark:text-white
                  group-hover:text-blue-600
                  transition-colors">
                  {c.name}
                </p>
                <p className="text-xs text-slate-400">
                  {c.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400
        dark:text-slate-500 italic border-t
        border-slate-100 dark:border-slate-800 pt-4">
        ⚠️ Disclaimer: EMI calculations are estimates
        based on the reducing balance method. Actual EMI
        may vary based on bank processing fees, GST on
        charges, and specific loan terms. Always verify
        with your lender before committing.
      </p>

    </div>
  )
}
