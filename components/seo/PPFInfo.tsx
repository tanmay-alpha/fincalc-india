export default function PPFInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">How PPF Calculator Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The Public Provident Fund (PPF) calculator estimates the maturity value of your PPF account based on yearly contributions and the prevailing interest rate. PPF is a government-backed, long-term savings scheme with a 15-year lock-in that offers tax-free returns under EEE (Exempt-Exempt-Exempt) status. The current PPF interest rate is set by the Government of India each quarter.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">PPF Rules &amp; Limits</h2>
        <div className="bg-card rounded-xl p-4 text-sm text-foreground border border-border/70 space-y-1.5 shadow-2xs">
          <p><strong className="text-foreground">Minimum Investment:</strong> <span className="text-muted-foreground">₹500 per financial year</span></p>
          <p><strong className="text-foreground">Maximum Investment:</strong> <span className="text-muted-foreground">₹1,50,000 per financial year</span></p>
          <p><strong className="text-foreground">Lock-in Period:</strong> <span className="text-muted-foreground">15 years (extendable in 5-year blocks)</span></p>
          <p><strong className="text-foreground">Interest Rate:</strong> <span className="text-muted-foreground">7.1% p.a. (compounded annually, notified quarterly)</span></p>
          <p><strong className="text-foreground">Tax Status:</strong> <span className="text-muted-foreground">EEE (Deduction u/s 80C in Old Regime, exempt interest, exempt maturity)</span></p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Example Calculation</h2>
        <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
          <p className="text-foreground">Yearly Investment: <strong>₹1,50,000</strong></p>
          <p className="text-muted-foreground text-xs mt-1">Interest Rate: <strong>7.1% per year</strong> · Tenure: <strong>15 years</strong></p>
          <p className="mt-2 font-bold text-primary text-base">
            Result: Maturity Value ≈ ₹40,68,209
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Total Invested: ₹22,50,000 | Tax-Free Interest Earned: ₹18,18,209)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I withdraw from PPF before 15 years?',
              a: 'Partial withdrawals are allowed from the 7th year onwards (up to 50% of balance at end of 4th year). Full withdrawal before maturity is not permitted except in extreme cases like serious illness or higher education.'
            },
            {
              q: 'Can I extend my PPF beyond 15 years?',
              a: 'Yes, PPF can be extended in blocks of 5 years after the initial 15-year period. You can choose to extend with or without further contributions.'
            },
            {
              q: 'Is PPF better than FD?',
              a: 'PPF offers tax-free returns (EEE status) while FD interest is fully taxable. For someone in the 30% tax bracket, PPF\'s effective post-tax return is significantly higher than most FDs.'
            },
            {
              q: 'Can NRIs invest in PPF?',
              a: 'NRIs cannot open new PPF accounts. However, accounts opened before becoming NRI can continue until maturity but cannot be extended beyond 15 years.'
            },
            {
              q: 'When should I deposit money in PPF for maximum returns?',
              a: 'Deposit before the 5th of each month, as PPF interest is calculated on the minimum balance between the 5th and end of month. Depositing the full ₹1.5L between 1st and 5th April maximizes annual compounding interest.'
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
