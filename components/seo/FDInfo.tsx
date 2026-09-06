export default function FDInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">How FD Calculator Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A Fixed Deposit (FD) calculator estimates the maturity amount of your bank deposit based on the principal, interest rate, tenure, and compounding frequency. FDs offer guaranteed returns and are one of the safest investment options in India, with deposit insurance up to ₹5 lakh per depositor per bank under DICGC.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">FD Compound Interest Formula</h2>
        <div className="bg-card rounded-xl p-4 font-mono text-sm text-foreground border border-border/70 shadow-2xs">
          A = P × (1 + r/n)^(n × t)
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Where A = Maturity amount, P = Principal, r = Annual interest rate (as decimal), n = Compounding frequency per year, t = Tenure in years
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Example Calculation</h2>
        <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
          <p className="text-foreground">Deposit Amount: <strong>₹1,00,000</strong></p>
          <p className="text-muted-foreground text-xs mt-1">Interest Rate: <strong>7% per year</strong> · Tenure: <strong>3 years</strong> (Quarterly compounding)</p>
          <p className="mt-2 font-bold text-primary text-base">
            Result: Maturity Amount ≈ ₹1,23,144
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Interest Earned: ₹23,144 | Effective Annual Yield: 7.19%)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is TDS deducted on FD interest?',
              a: 'Yes, banks deduct TDS at 10% if your total FD interest exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). You can submit Form 15G/15H to avoid TDS if your total income is below the taxable limit.'
            },
            {
              q: 'Can I withdraw my FD before maturity?',
              a: 'Yes, premature withdrawal is allowed but banks typically charge a penalty of 0.5-1% on the interest rate. Some banks offer partial withdrawal without breaking the entire FD.'
            },
            {
              q: 'Which bank gives the highest FD rate?',
              a: 'Small finance banks and some NBFCs typically offer higher rates (7.5-9%) compared to large banks (6-7.25%). However, ensure the institution is RBI-regulated and covered under DICGC insurance.'
            },
            {
              q: 'What is the difference between cumulative and non-cumulative FD?',
              a: 'Cumulative FDs reinvest interest and pay everything at maturity (higher effective returns). Non-cumulative FDs pay interest monthly/quarterly, suitable for regular income needs.'
            },
            {
              q: 'Are FD returns taxable?',
              a: 'Yes, FD interest is fully taxable at your income tax slab rate. It is added to your total income under "Income from Other Sources". Tax-saving FDs (5-year lock-in) qualify for Section 80C deduction up to ₹1.5 lakh in the Old Regime.'
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
