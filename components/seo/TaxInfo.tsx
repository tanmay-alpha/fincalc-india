export default function TaxInfo() {
  const faqs = [
    { q: 'Which tax regime should I choose?', a: 'New regime is better if you have few deductions. Old regime benefits those claiming HRA, 80C, 80D, home loan interest, etc. Compare both using the calculator above.' },
    { q: 'What is the standard deduction?', a: 'Both regimes offer ₹75,000 standard deduction (FY2024-25 onwards). Old regime also offered ₹50,000 earlier. This is automatically deducted from salary income.' },
    { q: 'Is income up to ₹7 lakh tax-free under new regime?', a: 'Yes, with the rebate under Section 87A, tax payable is nil if taxable income is up to ₹7 lakh under the new regime (FY2024-25).' },
    { q: 'What deductions are available under old regime?', a: '80C (₹1.5L): PPF, ELSS, EPF, LIC. 80D: Health insurance (₹25K-₹1L). 80E: Education loan interest. 80TTA: Savings interest (₹10K). HRA exemption for rent payers.' },
    { q: 'How is surcharge calculated?', a: 'Surcharge applies on tax: 10% (₹50L-₹1Cr), 15% (₹1Cr-₹2Cr), 25% (₹2Cr-₹5Cr). New regime caps surcharge at 25% for income above ₹5Cr.' },
  ];
  const related = [
    { href: '/sip', icon: '\u{1F4C8}', name: 'SIP Calculator', desc: 'Plan tax-saving ELSS SIP' },
    { href: '/ppf', icon: '\u{1F3DB}\uFE0F', name: 'PPF Calculator', desc: '80C tax-saving PPF' },
    { href: '/emi', icon: '\u{1F3E6}', name: 'EMI Calculator', desc: 'Home loan tax benefits' },
  ];
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">How Income Tax Calculator Works</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">This calculator compares your tax liability under both the Old and New income tax regimes for the current financial year. Enter your gross income and applicable deductions to see slab-by-slab breakdown, effective tax rate, and take-home pay under each regime.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">New Regime Tax Slabs (FY 2024-25)</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-100 dark:bg-slate-800 text-left"><th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Income Slab</th><th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Tax Rate</th></tr></thead>
            <tbody className="text-slate-600 dark:text-slate-400">
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">Up to ₹3,00,000</td><td className="px-4 py-2">Nil</td></tr>
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">₹3L – ₹7L</td><td className="px-4 py-2">5%</td></tr>
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">₹7L – ₹10L</td><td className="px-4 py-2">10%</td></tr>
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">₹10L – ₹12L</td><td className="px-4 py-2">15%</td></tr>
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">₹12L – ₹15L</td><td className="px-4 py-2">20%</td></tr>
              <tr className="border-t border-slate-200 dark:border-slate-700"><td className="px-4 py-2">Above ₹15L</td><td className="px-4 py-2">30%</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Example Calculation</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <p>Gross Income: <strong>₹12,00,000</strong></p>
          <p>80C Deductions: <strong>₹1,50,000</strong></p>
          <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">Old Regime Tax: ≈ ₹1,09,200 | New Regime Tax: ≈ ₹83,200</p>
          <p className="text-xs text-slate-500 mt-1">New regime saves ₹26,000 in this example (no major deductions)</p>
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
      <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-4">{'\u26A0\uFE0F'} Disclaimer: Tax calculations are estimates. Actual tax may differ based on exemptions, surcharge, cess, and individual circumstances. Consult a CA for filing.</p>
    </div>
  );
}
