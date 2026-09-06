export default function EMIInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          How EMI Calculator Works
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          An EMI (Equated Monthly Instalment) calculator helps you estimate your monthly loan repayment amount. It calculates the fixed monthly payment required to fully repay a loan over a chosen tenure at a given interest rate. Our calculator also generates a complete amortization schedule showing how each payment is split between principal and interest.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          EMI Formula
        </h2>
        <div className="bg-card rounded-xl p-4 font-mono text-sm text-foreground border border-border/70 shadow-2xs">
          EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Where P = Principal loan amount, r = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Loan tenure in months
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Example Calculation
        </h2>
        <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
          <p className="text-foreground">Loan Amount: <strong>₹30,00,000</strong></p>
          <p className="text-muted-foreground text-xs mt-1">Interest Rate: <strong>8.5% per year</strong> · Tenure: <strong>20 years (240 months)</strong></p>
          <p className="mt-2 font-bold text-primary text-base">
            Monthly EMI ≈ ₹26,035
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total Payment: ₹62,48,304 (Principal: ₹30,00,000 | Interest: ₹32,48,304)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What factors affect home loan EMI?",
              a: "Principal amount, interest rate, and loan tenure are the core components. Longer tenures reduce monthly EMI but increase total interest paid over the life of the loan."
            },
            {
              q: "Can I prepay my home loan to reduce interest?",
              a: "Yes. Under RBI guidelines, banks cannot charge prepayment penalties on floating-rate home loans sanctioned to individual borrowers."
            },
            {
              q: "How does the tax deduction on home loan work?",
              a: "Under the Old Tax Regime: Section 24(b) allows up to ₹2 lakh deduction on interest paid for a self-occupied property, and Section 80C allows up to ₹1.5 lakh on principal repayment."
            }
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
