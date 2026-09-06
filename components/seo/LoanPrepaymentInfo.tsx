export default function LoanPrepaymentInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          How Does Loan Pre-Payment Reduce Total Interest?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          In early loan years, the majority of your monthly EMI goes towards paying interest rather than reducing the principal. When you make a pre-payment (such as an extra annual payment or a monthly top-up), 100% of that extra amount directly reduces the outstanding loan principal. This immediately lowers the interest compounding base for all remaining months.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Effective Pre-Payment Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">1. Periodic Top-Up</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">Annual</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Pay 1 extra EMI equivalent each year using performance incentives or bonuses.</p>
            <p className="text-xs font-semibold text-primary mt-2">Noticeably compresses the effective loan tenure.</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">2. Monthly Increment</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">+5% to +10%</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Increase monthly installment slightly beyond the minimum required EMI.</p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">Smooth, disciplined amortisation acceleration.</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">3. Early Lump Sum</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">Years 1–5</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Prepay a lump sum within the initial 3–5 years of the loan schedule.</p>
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-2">Yields the largest mathematical reduction in cumulative interest.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
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
            <div key={i} className="border-b border-border/60 pb-4 last:border-0">
              <h3 className="font-semibold text-sm text-foreground mb-1">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
