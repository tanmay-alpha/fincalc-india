export default function LumpsumInfo() {
  const faqs = [
    { q: 'Is lumpsum better than SIP?', a: 'It depends on timing. Lumpsum works better in rising markets, while SIP averages cost in volatile markets. For most salaried investors, SIP is more practical.' },
    { q: 'What is CAGR?', a: 'CAGR (Compound Annual Growth Rate) shows annualized return assuming reinvestment. Doubling in 6 years = 100% absolute return = 12.25% CAGR.' },
    { q: 'When should I invest lumpsum?', a: 'Consider lumpsum when you have a large amount (bonus, inheritance), when markets have corrected, or when you have a 7+ year horizon.' },
    { q: 'What is a wealth multiplier?', a: 'It shows how many times your money grows. A 3x multiplier means ₹1L becomes ₹3L. Higher CAGR and longer tenure produce higher multipliers.' },
    { q: 'Are lumpsum investments taxed?', a: 'Equity MF: LTCG above ₹1L taxed at 10% (holding >1yr). STCG at 15%. Debt funds: gains taxed at slab rate (post April 2023).' },
  ];
  const related = [
    { href: '/sip', icon: '\u{1F4C8}', name: 'SIP Calculator', desc: 'Monthly SIP investment' },
    { href: '/fd', icon: '\u{1F512}', name: 'FD Calculator', desc: 'Fixed deposit returns' },
    { href: '/ppf', icon: '\u{1F3DB}\uFE0F', name: 'PPF Calculator', desc: 'Tax-free PPF maturity' },
  ];
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How Lumpsum Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A Lumpsum calculator estimates the future value of a one-time investment using the compound annual growth rate (CAGR). Unlike SIP which invests monthly, lumpsum investing puts the entire amount to work immediately.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Lumpsum Formula</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">FV = PV × (1 + r)^n</div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">Where FV = Future Value, PV = Present Value, r = Annual rate of return, n = Number of years</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Investment: <strong>₹5,00,000</strong></p>
          <p>CAGR: <strong>12%</strong> · Period: <strong>10 years</strong></p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">Result: ≈ ₹15,52,924 (3.1x multiplier)</p>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
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
          {related.map(c => (
            <a key={c.href} href={c.href} className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.name}</p>
                <p className="text-xs text-slate-400">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">{'\u26A0\uFE0F'} Disclaimer: Returns shown are estimates based on constant CAGR. Actual market returns fluctuate and are not guaranteed.</p>
    </div>
  );
}
