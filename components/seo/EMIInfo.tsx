export default function EMIInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How EMI Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          An EMI (Equated Monthly Instalment) calculator helps you determine the fixed monthly payment you need to make towards a loan. It factors in the loan principal, interest rate, and tenure to compute your EMI along with total interest payable and a complete amortization schedule showing how each payment splits between principal and interest.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">EMI Formula</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
          Where P = Principal loan amount, r = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Loan tenure in months
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Loan Amount: <strong>₹30,00,000</strong></p>
          <p>Interest Rate: <strong>8.5% per year</strong></p>
          <p>Tenure: <strong>20 years</strong></p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">
            Result: Monthly EMI ≈ ₹26,035
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (Total Payment: ₹62,48,480 | Total Interest: ₹32,48,480)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I reduce my EMI by prepaying?',
              a: 'Yes. Part-prepayment reduces your outstanding principal, which can lower your EMI or reduce tenure. Most home loans allow prepayment without penalty after a lock-in period.'
            },
            {
              q: 'What is the difference between home loan and personal loan EMI?',
              a: 'Home loans typically have lower interest rates (8-10%) and longer tenures (up to 30 years). Personal loans have higher rates (10-18%) and shorter tenures (1-5 years).'
            },
            {
              q: 'Does a longer tenure reduce EMI?',
              a: 'Yes, longer tenure reduces EMI but increases total interest paid. A 20-year loan pays significantly more interest than a 10-year loan for the same amount.'
            },
            {
              q: 'Is EMI fixed throughout the loan?',
              a: 'For fixed-rate loans, yes. For floating-rate loans (common in India), EMI can change when the bank adjusts the interest rate based on RBI policy or MCLR changes.'
            },
            {
              q: 'What happens if I miss an EMI payment?',
              a: 'Missing an EMI results in a late payment fee, negative impact on CIBIL score, and potential legal action for repeated defaults. Contact your bank immediately if you face difficulty.'
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{faq.q}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Related Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/sip', icon: '📈', name: 'SIP Calculator', desc: 'Monthly investment returns' },
            { href: '/fd', icon: '🔒', name: 'FD Calculator', desc: 'Fixed deposit maturity' },
            { href: '/tax', icon: '🧾', name: 'Tax Calculator', desc: 'Income tax comparison' },
          ].map(c => (
            <a key={c.href} href={c.href}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.name}</p>
                <p className="text-xs text-slate-400">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">
        {'\u26A0\uFE0F'} Disclaimer: This calculator provides estimates for educational purposes. Actual EMI may differ based on bank processing fees, insurance charges, and floating rate changes. Verify with your bank before making financial decisions.
      </p>
    </div>
  );
}
