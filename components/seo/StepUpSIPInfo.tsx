export default function StepUpSIPInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          What is a Step-Up SIP (Top-Up SIP)?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          A <strong>Step-Up SIP</strong> (also known as a Top-Up SIP) allows you to automatically increase your monthly SIP contribution by a fixed percentage (e.g., 10% each year) or a fixed rupee amount (e.g., +₹1,000 every year) in line with your annual salary increments. This dramatically accelerates wealth creation by compounding larger sums over time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Step-Up SIP vs Regular SIP Example
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-2">Standard Flat SIP</p>
            <p className="text-xs text-slate-700 dark:text-slate-300">₹10,000/month for 15 years @ 12%</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">Corpus: ≈ ₹50.45 Lakhs</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">Invested: ₹18.00 Lakhs · Returns: ₹32.45 Lakhs</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-900 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Step-Up SIP (+10%/year)</p>
            <p className="text-xs text-blue-800 dark:text-blue-300">₹10,000/month with 10% annual top-up @ 12%</p>
            <p className="text-lg font-bold text-blue-950 dark:text-blue-200 mt-2">Corpus: ≈ ₹92.05 Lakhs</p>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 font-semibold">Extra Wealth Gained: +₹41.60 Lakhs (82% more!)</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does Goal Mode work?",
              a: "Goal Mode reverse-calculates the exact starting monthly SIP required today to accumulate a target corpus (e.g. ₹1 Crore, ₹5 Crore) within your specified timeframe with your chosen step-up rate."
            },
            {
              q: "How often does Step-Up occur?",
              a: "In Indian mutual funds, step-ups are typically processed once a year (starting from Month 13) or half-yearly, matching your annual increment cycle."
            },
            {
              q: "Can I set a maximum cap on my step-up?",
              a: "Yes, many Asset Management Companies (AMCs) and RTAs (CAMS/KFintech) allow you to specify a maximum monthly limit beyond which your SIP stays constant."
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{faq.q}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
