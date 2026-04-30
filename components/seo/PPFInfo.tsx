export default function PPFInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How PPF Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          The Public Provident Fund (PPF) calculator estimates the maturity value of your PPF account based on yearly contributions and the prevailing interest rate. PPF is a government-backed, long-term savings scheme with a 15-year lock-in that offers tax-free returns under EEE (Exempt-Exempt-Exempt) status. The current PPF interest rate is set by the Government of India each quarter.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PPF Rules &amp; Limits</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 space-y-1">
          <p><strong>Minimum Investment:</strong> ₹500 per year</p>
          <p><strong>Maximum Investment:</strong> ₹1,50,000 per year</p>
          <p><strong>Lock-in Period:</strong> 15 years (extendable in 5-year blocks)</p>
          <p><strong>Interest Rate:</strong> 7.1% p.a. (Q1 FY2025-26, compounded yearly)</p>
          <p><strong>Tax Benefit:</strong> Section 80C deduction + tax-free interest + tax-free maturity</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Yearly Investment: <strong>₹1,50,000</strong></p>
          <p>Interest Rate: <strong>7.1% per year</strong></p>
          <p>Tenure: <strong>15 years</strong></p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">
            Result: Maturity Value ≈ ₹40,68,209
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (Total Invested: ₹22,50,000 | Interest Earned: ₹18,18,209 — completely tax-free)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I withdraw from PPF before 15 years?',
              a: 'Partial withdrawals are allowed from the 7th year onwards (up to 50% of balance at end of 4th year). Full withdrawal before maturity is not permitted except in extreme cases like serious illness.'
            },
            {
              q: 'Can I extend my PPF beyond 15 years?',
              a: 'Yes, PPF can be extended in blocks of 5 years after the initial 15-year period. You can choose to extend with or without further contributions.'
            },
            {
              q: 'Is PPF better than FD?',
              a: 'PPF offers tax-free returns (EEE status) while FD interest is fully taxable. For someone in the 30% tax bracket, PPF\'s effective post-tax return is significantly higher than most FDs.'
            },
            {
              q: 'Can NRIs invest in PPF?',
              a: 'NRIs cannot open new PPF accounts. However, accounts opened before becoming NRI can continue until maturity but cannot be extended beyond 15 years.'
            },
            {
              q: 'When should I deposit money in PPF for maximum returns?',
              a: 'Deposit before the 5th of each month, as PPF interest is calculated on the minimum balance between the 5th and end of month. Depositing the full ₹1.5L in April gives maximum interest.'
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
            { href: '/fd', icon: '🔒', name: 'FD Calculator', desc: 'Fixed deposit maturity' },
            { href: '/sip', icon: '📈', name: 'SIP Calculator', desc: 'Monthly SIP returns' },
            { href: '/tax', icon: '🧾', name: 'Tax Calculator', desc: 'Income tax planning' },
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
        {'\u26A0\uFE0F'} Disclaimer: PPF interest rate is set by the Government of India and revised quarterly. This calculator uses the rate you enter. Actual maturity may vary if rates change during the tenure period.
      </p>
    </div>
  );
}
