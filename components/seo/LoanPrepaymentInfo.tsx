export default function LoanPrepaymentInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          How Does Loan Pre-Payment Reduce Total Interest?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          In early loan years, the majority of your monthly EMI goes towards paying interest rather than reducing the principal. When you make a pre-payment (such as an extra annual payment or a monthly top-up), 100% of that extra amount directly reduces the outstanding loan principal. This immediately lowers the interest compounding base for all remaining months.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Effective Pre-Payment Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. Periodic Top-Up (e.g. Annual)</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Pay 1 extra EMI equivalent each year using performance incentives or bonuses.</p>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-2">Noticeably compresses the effective loan tenure.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Monthly Increment (+5% to +10%)</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Increase monthly installment slightly beyond the minimum required EMI.</p>
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-2">Smooth, disciplined amortisation acceleration.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. Early Lump Sum Prepayment</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Prepay a lump sum within the initial 3–5 years of the loan schedule.</p>
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-2">Yields the largest mathematical reduction in cumulative interest.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Are there pre-payment penalty charges on Home Loans in India?",
              a: "Under RBI regulatory circulars, banks and Housing Finance Companies (HFCs) are not permitted to levy pre-payment or foreclosure charges on floating-rate term loans sanctioned to individual borrowers."
            },
            {
              q: "Should I reduce my loan EMI or reduce my loan tenure when prepaying?",
              a: "Reducing tenure while maintaining existing monthly payments maximizes total interest savings. Reducing EMI preserves monthly cash flow flexibility for other obligations. Choose based on your liquidity preferences."
            },
            {
              q: "When is investing in mutual funds better than prepaying the loan?",
              a: "If your post-tax expected investment return comfortably exceeds your effective loan interest rate (net of any applicable Section 24(b) tax deductions), long-term investing may build higher terminal wealth, subject to market risk tolerance."
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
