export default function StepUpSIPInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          What is a Step-Up SIP (Top-Up SIP)?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A <strong className="text-foreground">Step-Up SIP</strong> (also known as a Top-Up SIP) allows you to periodically increase your monthly SIP contribution by a fixed percentage (e.g., 10% each year) or a fixed rupee amount (e.g., +₹1,000 every year) in line with annual salary increments. This enhances portfolio accumulation over time as savings capacity expands.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Step-Up SIP vs Regular SIP Example
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <p className="font-semibold text-foreground mb-2">Standard Flat SIP</p>
            <p className="text-xs text-muted-foreground">₹10,000/month for 15 years @ 12%</p>
            <p className="text-lg font-bold text-foreground mt-2">Corpus: ≈ ₹50.45 Lakhs</p>
            <p className="text-xs text-muted-foreground mt-1">Invested: ₹18.00 Lakhs · Returns: ₹32.45 Lakhs</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
            <p className="font-semibold text-foreground mb-2">Step-Up SIP (+10%/year)</p>
            <p className="text-xs text-muted-foreground">₹10,000/month with 10% annual top-up @ 12%</p>
            <p className="text-lg font-bold text-primary mt-2">Corpus: ≈ ₹92.05 Lakhs</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Incremental Corpus: +₹41.60 Lakhs (from ₹19.98L additional investment). Assumes an illustrative constant return; market returns vary year-to-year.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does Goal Mode work?",
              a: "Goal Mode reverse-calculates the exact starting monthly SIP required today to accumulate a target corpus (e.g. ₹1 Crore, ₹5 Crore) within your specified timeframe with your chosen step-up rate."
            },
            {
              q: "How often does Step-Up occur?",
              a: "In Indian mutual funds, step-ups are typically processed once a year (starting from Month 13) or half-yearly, matching your annual increment cycle."
            },
            {
              q: "Can I set a maximum cap on my step-up?",
              a: "Yes, many Asset Management Companies (AMCs) and RTAs (CAMS/KFintech) allow you to specify a maximum monthly limit beyond which your SIP stays constant."
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
