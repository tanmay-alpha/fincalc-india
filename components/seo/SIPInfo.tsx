export default function SIPInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">How SIP Calculator Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A SIP (Systematic Investment Plan) calculator helps you estimate the future value of your regular monthly investments. It uses compound interest to calculate how your money grows over time when invested monthly in mutual funds. SIP is a disciplined approach to wealth creation where a fixed amount is invested at regular intervals.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">SIP Formula</h2>
        <div className="bg-card rounded-xl p-4 font-mono text-sm text-foreground border border-border/70 shadow-2xs">
          M = P × ([(1 + i)^n - 1] / i) × (1 + i)
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Where M = Maturity amount, P = Monthly investment, i = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Number of months
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Example Calculation</h2>
        <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
          <p className="text-foreground">Monthly SIP: <strong>₹5,000</strong></p>
          <p className="text-muted-foreground text-xs mt-1">Expected Return: <strong>12% per year</strong> · Time Period: <strong>10 years</strong></p>
          <p className="mt-2 font-bold text-primary text-base">
            Result: Total Corpus ≈ ₹11,61,695
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (₹6,00,000 invested + ₹5,61,695 returns)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is the minimum amount to start a SIP?',
              a: 'Many mutual funds in India allow starting a SIP with as low as ₹100 or ₹500 per month. There is no statutory upper limit.'
            },
            {
              q: 'Can I pause or stop my SIP anytime?',
              a: 'Yes, mutual fund SIPs offer complete liquidity. You can pause, modify, or stop your SIP anytime without penalty through your broker or AMC portal.'
            },
            {
              q: 'How are mutual fund SIP returns taxed?',
              a: 'Under current tax rules: Equity mutual funds have LTCG taxed at 12.5% on gains exceeding ₹1.25 lakh per financial year (holding > 1 year). STCG is taxed at 20%. Each monthly SIP installment has its own separate 12-month holding clock.'
            },
            {
              q: 'Is SIP better than lumpsum?',
              a: 'SIP reduces the risk of market timing via Rupee Cost Averaging — you buy more units when markets are down and fewer when markets are high. It is especially recommended for salaried investors.'
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-border/60 pb-4 last:border-0">
              <h3 className="font-semibold text-sm text-foreground mb-1">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground italic border-t border-border/60 pt-4">
        Disclaimer: Mutual fund investments are subject to market risks. Past returns do not guarantee future performance.
      </p>
    </div>
  );
}
