export default function TaxInfo() {
  return (
    <div className="mt-12 space-y-8
      border-t border-slate-200 dark:border-slate-800
      pt-8">

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          Old vs New Tax Regime — Which Is Better?
        </h2>
        <p className="text-slate-600
          dark:text-slate-400 text-sm leading-relaxed">
          Since FY 2023-24, the New Tax Regime is the
          default in India. However, the Old Regime can
          be more beneficial if you have significant
          deductions (80C, HRA, home loan interest).
          Use this calculator to find which regime saves
          you more tax.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          Tax Slabs FY 2024-25
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2
          gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30
            rounded-xl p-4 border border-blue-100
            dark:border-blue-900">
            <p className="font-semibold text-sm
              text-blue-800 dark:text-blue-300 mb-3">
              ⚡ New Regime
            </p>
            <div className="space-y-1.5 text-xs
              text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Up to ₹3,00,000</span>
                <span className="font-medium">Nil</span>
              </div>
              <div className="flex justify-between">
                <span>₹3L – ₹7L</span>
                <span className="font-medium">5%</span>
              </div>
              <div className="flex justify-between">
                <span>₹7L – ₹10L</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="flex justify-between">
                <span>₹10L – ₹12L</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span>₹12L – ₹15L</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Above ₹15L</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="mt-2 pt-2 border-t
                border-blue-200 dark:border-blue-800
                text-blue-700 dark:text-blue-400">
                Standard deduction: ₹75,000
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900
            rounded-xl p-4 border border-slate-200
            dark:border-slate-700">
            <p className="font-semibold text-sm
              text-slate-800 dark:text-slate-200 mb-3">
              📋 Old Regime
            </p>
            <div className="space-y-1.5 text-xs
              text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Up to ₹2,50,000</span>
                <span className="font-medium">Nil</span>
              </div>
              <div className="flex justify-between">
                <span>₹2.5L – ₹5L</span>
                <span className="font-medium">5%</span>
              </div>
              <div className="flex justify-between">
                <span>₹5L – ₹10L</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Above ₹10L</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="mt-2 pt-2 border-t
                border-slate-200 dark:border-slate-700
                text-slate-500">
                Standard deduction: ₹50,000
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold
          text-slate-900 dark:text-white mb-3">
          Example: ₹12L Income
        </h2>
        <div className="bg-green-50 dark:bg-green-950/30
          rounded-xl p-4 border border-green-100
          dark:border-green-900 text-sm
          text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-green-700
                dark:text-green-400 mb-2">
                New Regime
              </p>
              <p>Gross: <strong>₹12,00,000</strong></p>
              <p>Std deduction: ₹75,000</p>
              <p>Taxable: ₹11,25,000</p>
              <p className="mt-1 font-bold
                text-green-700 dark:text-green-400">
                Tax: ₹71,500
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-700
                dark:text-blue-400 mb-2">
                Old Regime (with ₹1.5L 80C)
              </p>
              <p>Gross: <strong>₹12,00,000</strong></p>
              <p>Deductions: ₹2,25,000</p>
              <p>Taxable: ₹9,75,000</p>
              <p className="mt-1 font-bold
                text-blue-700 dark:text-blue-400">
                Tax: ₹1,11,800
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            * New Regime saves ₹40,300 in this example.
            Result may differ with higher deductions.
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
              q: 'Which tax regime is better for salaried employees?',
              a: 'New Regime is better if your deductions are less than ₹3.75 lakh (for ₹15L income). If you have HRA, home loan interest, and full 80C investments, Old Regime often saves more. Use this calculator to compare.'
            },
            {
              q: 'What is Rebate 87A?',
              a: 'Under the New Regime, if your taxable income is ₹7 lakh or below, you pay zero tax due to Section 87A rebate. This effectively makes income up to ₹7.75 lakh (with standard deduction) tax-free.'
            },
            {
              q: 'Can I switch between Old and New regime every year?',
              a: 'Salaried individuals can switch between regimes every year at the time of filing ITR. Business owners/professionals who have opted out of New Regime can only switch once.'
            },
            {
              q: 'What deductions are available in the New Regime?',
              a: 'New Regime allows very few deductions: standard deduction (₹75,000), employer NPS contribution (80CCD(2)), and a few others. 80C, HRA, home loan interest are NOT available.'
            },
            {
              q: 'When is surcharge applicable?',
              a: 'Surcharge is levied on tax when income exceeds ₹50 lakh: 10% for ₹50L-1Cr, 15% for ₹1Cr-2Cr, 25% for ₹2Cr-5Cr, and 37% for above ₹5Cr (25% in New Regime). Plus 4% health & education cess applies on all.'
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
             desc:'Save tax via ELSS SIP'},
            {href:'/ppf', icon:'🏛️',
             name:'PPF Calculator',
             desc:'80C + tax-free returns'},
            {href:'/emi', icon:'🏦',
             name:'EMI Calculator',
             desc:'Home loan tax benefit'},
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
        ⚠️ Disclaimer: Tax calculations are estimates
        based on FY 2024-25 slabs. This tool does not
        account for all deductions, rebates, or
        surcharges that may apply. Consult a chartered
        accountant or tax professional for advice
        specific to your situation.
      </p>

    </div>
  )
}
