export default function NoCostEMIInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          How Does &ldquo;No-Cost EMI&rdquo; Really Work in India?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          In 2013, the Reserve Bank of India (RBI) banned banks from offering genuine 0% interest loans. To bypass this, e-commerce platforms (Amazon, Flipkart) and merchants created <strong>Merchant Subvention No-Cost EMI</strong>. The merchant provides an upfront discount equal to the interest charges. The bank sanctions a loan for the discounted amount and charges regular interest.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          The 3 Hidden Traps of &ldquo;No-Cost EMI&rdquo;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. 18% GST on Interest</p>
            <p className="text-xs text-slate-500">Government levies 18% GST on all loan interest charged by the bank each month. This GST is NOT discounted by the merchant and comes out of your pocket.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Upfront Processing Fees</p>
            <p className="text-xs text-slate-500">Banks charge a non-refundable loan processing fee (typically ₹99 to ₹299 + 18% GST) on credit/debit card EMI conversions.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. Lost Upfront Discounts</p>
            <p className="text-xs text-slate-500">You forfeit instant full-payment bank card discounts (e.g. ₹3,000–₹5,000 instant discount on full swipe), making the EMI option far more expensive in reality.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Does No-Cost EMI affect my CIBIL / Credit score?",
              a: "Yes. Every No-Cost EMI is reported to CIBIL, Experian, and CRIF as a consumer durable loan. Missing a monthly payment will damage your credit score."
            },
            {
              q: "Can I pre-close a No-Cost EMI loan?",
              a: "Yes, but banks charge a foreclosure fee (typically 3% + 18% GST) and you do NOT get back the initial merchant discount."
            },
            {
              q: "When is No-Cost EMI genuinely beneficial?",
              a: "Only when there is ZERO upfront cash/card discount offered, and your money can earn higher returns in an arbitrage or liquid fund during the tenure."
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
