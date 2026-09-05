export default function LoanPrepaymentInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          How Does Loan Pre-Payment Save Lakhs in Interest?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          In early loan years, the majority of your monthly EMI goes towards paying interest rather than reducing the principal. When you make a pre-payment (even just 1 extra EMI a year or a small ₹5,000 monthly top-up), 100% of that extra amount directly slashes the outstanding loan principal. This immediately lowers the interest compounding base for all remaining months.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          The 3 Most Effective Pre-Payment Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. The &ldquo;1 Extra EMI / Year&rdquo; Rule</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Pay 13 EMIs instead of 12 every year using your annual performance bonus.</p>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-2">Cuts a 20-year loan by ~3.5 to 4 years.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Monthly Top-Up (+5% to +10%)</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Increase your monthly EMI payment by ₹2,000 to ₹5,000 every month.</p>
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-2">Smooth, disciplined interest reduction.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. Early Lump Sum Prepayment</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Prepay ₹2–5 Lakhs within the first 3–5 years of taking the loan.</p>
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-2">Maximum mathematical interest savings.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Are there pre-payment penalty charges on Home Loans in India?",
              a: "Under RBI guidelines, banks and Housing Finance Companies (HFCs) CANNOT charge any pre-payment or foreclosure penalty on floating-rate home loans taken by individual borrowers."
            },
            {
              q: "Should I reduce my loan EMI or reduce my loan tenure when prepaying?",
              a: "Always choose to REDUCE TENURE while keeping your monthly EMI the same. Reducing tenure maximizes your compound interest savings."
            },
            {
              q: "When is investing in mutual funds better than prepaying the loan?",
              a: "If your post-tax expected mutual fund returns (e.g. 12-14% CAGR) comfortably exceed your effective loan interest rate (e.g. 8.5% minus Sec 24b tax benefit), investing creates more long-term terminal wealth."
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
