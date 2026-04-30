export default function FDInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How FD Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          A Fixed Deposit (FD) calculator estimates the maturity amount of your bank deposit based on the principal, interest rate, tenure, and compounding frequency. FDs offer guaranteed returns and are one of the safest investment options in India, with deposit insurance up to ₹5 lakh per depositor per bank under DICGC.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">FD Compound Interest Formula</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          A = P × (1 + r/n)^(n × t)
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
          Where A = Maturity amount, P = Principal, r = Annual interest rate (as decimal), n = Compounding frequency per year, t = Tenure in years
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Deposit Amount: <strong>₹1,00,000</strong></p>
          <p>Interest Rate: <strong>7% per year</strong></p>
          <p>Tenure: <strong>3 years</strong> (Quarterly compounding)</p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">
            Result: Maturity Amount ≈ ₹1,23,144
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (Interest Earned: ₹23,144 | Effective Yield: 7.19%)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is TDS deducted on FD interest?',
              a: 'Yes, banks deduct TDS at 10% if your total FD interest exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). You can submit Form 15G/15H to avoid TDS if your income is below the taxable limit.'
            },
            {
              q: 'Can I withdraw my FD before maturity?',
              a: 'Yes, premature withdrawal is allowed but banks typically charge a penalty of 0.5-1% on the interest rate. Some banks offer partial withdrawal without breaking the entire FD.'
            },
            {
              q: 'Which bank gives the highest FD rate?',
              a: 'Small finance banks and some NBFCs typically offer higher rates (7.5-9%) compared to large banks (6-7.25%). However, ensure the institution is RBI-regulated and covered under DICGC insurance.'
            },
            {
              q: 'What is the difference between cumulative and non-cumulative FD?',
              a: 'Cumulative FDs reinvest interest and pay everything at maturity (higher effective returns). Non-cumulative FDs pay interest monthly/quarterly, suitable for regular income needs.'
            },
            {
              q: 'Are FD returns taxable?',
              a: 'Yes, FD interest is fully taxable at your income tax slab rate. It is added to your total income. Tax-saving FDs (5-year lock-in) qualify for Section 80C deduction up to ₹1.5 lakh.'
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
            { href: '/ppf', icon: '🏛️', name: 'PPF Calculator', desc: 'Tax-free long-term savings' },
            { href: '/sip', icon: '📈', name: 'SIP Calculator', desc: 'Monthly mutual fund SIP' },
            { href: '/lumpsum', icon: '💰', name: 'Lumpsum Calculator', desc: 'One-time investment growth' },
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
        {'\u26A0\uFE0F'} Disclaimer: FD rates vary by bank and change periodically. This calculator provides estimates based on the entered rate. Verify current rates with your bank. Senior citizens typically get 0.25-0.50% extra.
      </p>
    </div>
  );
}
