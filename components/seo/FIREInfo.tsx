export default function FIREInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          What is FIRE (Financial Independence, Retire Early)?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          The <strong>FIRE Movement</strong> is a financial framework where individuals aggressively save and invest 50%–70% of their income during their 20s and 30s. The goal is to build an investment portfolio large enough that annual investment returns cover 100% of living expenses indefinitely, giving you total freedom over your time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          The 3 Flavors of FIRE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🌱 Lean FIRE (0.75x)</p>
            <p className="text-xs text-slate-500">Focuses on minimalist living, low expenses, and frugal lifestyle in low-cost cities.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🎯 Standard FIRE (1.0x)</p>
            <p className="text-xs text-slate-500">Maintains your current middle-class standard of living without compromising on lifestyle.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">👑 Fat FIRE (1.5x)</p>
            <p className="text-xs text-slate-500">Provides an abundant safety cushion for frequent luxury travel, hobbies, and healthcare.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What is the 25x / 30x Rule and Safe Withdrawal Rate (SWR)?",
              a: "The Trinity Study suggests a 4% Safe Withdrawal Rate (25x annual expenses). However, in India where inflation is 6%+, financial planners recommend a 30x–33x multiple (3.0%–3.3% SWR) for early retirees."
            },
            {
              q: "How should I structure my portfolio post-retirement?",
              a: "A 3-Bucket strategy is commonly used: Bucket 1 (1–3 years of expenses in Liquid funds/FDs), Bucket 2 (4–7 years in Debt & Hybrid funds), and Bucket 3 (8+ years in diversified Index & Equity funds for inflation beating growth)."
            },
            {
              q: "What about medical inflation and health insurance?",
              a: "Healthcare inflation in India runs at 12%–14% p.a. Secure comprehensive standalone health insurance (₹25L–₹1Cr super top-up) before retiring."
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
