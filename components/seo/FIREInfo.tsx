export default function FIREInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          What is FIRE (Financial Independence, Retire Early)?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          The <strong>FIRE framework</strong> models portfolio accumulation designed to sustain living expenses over extended horizons. Achieving financial independence relies on disciplined savings, prudent asset allocation, conservative safe withdrawal rates, and managing sequence-of-returns risk across multi-decade retirement periods.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          The 3 Primary FIRE Approaches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🌱 Lean FIRE (0.75x)</p>
            <p className="text-xs text-slate-500">Focuses on essential baseline living costs and moderate living expenditures in lower-cost geographies.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🎯 Standard FIRE (1.0x)</p>
            <p className="text-xs text-slate-500">Maintains current annual living standards and customary discretionary expenditure.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">👑 Fat FIRE (1.5x)</p>
            <p className="text-xs text-slate-500">Includes an expansive buffer for travel, lifestyle flexibility, and unforeseen emergencies.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What is the 25x / 30x Rule and Safe Withdrawal Rate (SWR)?",
              a: "While the classical Trinity Study evaluated a 4% Safe Withdrawal Rate (25x expenses) over a 30-year horizon in US markets, Indian macroeconomic conditions—including higher structural inflation and potential 40+ year retirements—warrant conservative withdrawal rates of 2.75%–3.25% (30x–36x annual expenses) to mitigate sequence risk."
            },
            {
              q: "How should I structure my portfolio post-retirement?",
              a: "A 3-Bucket strategy is commonly applied: Bucket 1 (1–3 years of expenses in liquid assets/short-term fixed deposits), Bucket 2 (4–7 years in quality debt and hybrid funds), and Bucket 3 (8+ years in diversified equity funds to preserve long-term purchasing power)."
            },
            {
              q: "What about medical inflation and healthcare planning?",
              a: "Healthcare inflation in India historically outpaces baseline CPI. Early retirement plans should budget for independent health insurance policies with comprehensive super top-up coverage and a dedicated medical contingency reserve."
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
