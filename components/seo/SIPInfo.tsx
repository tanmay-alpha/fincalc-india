export default function SIPInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How SIP Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          A SIP (Systematic Investment Plan) calculator helps you estimate the future value of your regular monthly investments. It uses compound interest to calculate how your money grows over time when invested monthly in mutual funds. SIP is a disciplined approach to wealth creation where a fixed amount is invested at regular intervals.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">SIP Formula</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          M = P × ([(1 + i)^n - 1] / i) × (1 + i)
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
          Where M = Maturity amount, P = Monthly investment, i = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Number of months
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Monthly SIP: <strong>₹5,000</strong></p>
          <p>Expected Return: <strong>12% per year</strong></p>
          <p>Time Period: <strong>10 years</strong></p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">
            Result: Total Corpus ≈ ₹11,61,695
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (₹6,00,000 invested + ₹5,61,695 returns)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is the minimum SIP amount?',
              a: 'Most mutual funds allow SIPs starting from ₹500 per month. Some ELSS funds allow ₹500, while liquid funds may have higher minimums.'
            },
            {
              q: 'Is 12% return realistic for SIP?',
              a: 'Large-cap equity mutual funds have historically delivered 10-12% CAGR over long periods (10+ years). However, past returns do not guarantee future performance.'
            },
            {
              q: 'What is the difference between SIP and lumpsum?',
              a: 'SIP invests a fixed amount monthly, averaging your purchase cost (rupee cost averaging). Lumpsum invests the entire amount at once. SIP is better for salaried investors.'
            },
            {
              q: 'Does SIP calculator consider tax?',
              a: 'This calculator shows pre-tax returns. Equity mutual fund gains over ₹1 lakh per year are taxed at 10% LTCG. Debt fund gains are taxed at your income tax slab rate.'
            },
            {
              q: 'How accurate is this SIP calculator?',
              a: 'Our SIP calculator uses the standard compound interest formula used by AMFI and mutual fund houses. It assumes a constant return rate throughout the period.'
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
            { href: '/lumpsum', icon: '💰', name: 'Lumpsum Calculator', desc: 'One-time investment returns' },
            { href: '/ppf', icon: '🏛️', name: 'PPF Calculator', desc: 'Tax-free PPF corpus' },
            { href: '/emi', icon: '🏦', name: 'EMI Calculator', desc: 'Loan EMI calculation' },
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
        {'\u26A0\uFE0F'} Disclaimer: This calculator is for informational purposes only. Results are estimates based on the assumed rate of return. Actual mutual fund returns vary and are not guaranteed. Consult a SEBI-registered financial advisor before investing.
      </p>
    </div>
  );
}
