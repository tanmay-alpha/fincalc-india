export default function LumpsumInfo() {
  const faqs = [
    { q: 'Is lumpsum better than SIP?', a: 'It depends on timing. Lumpsum works better in rising markets, while SIP averages cost in volatile markets. For most salaried investors, SIP is more practical.' },
    { q: 'What is CAGR?', a: 'CAGR (Compound Annual Growth Rate) shows annualized return assuming reinvestment. Doubling in 6 years = 100% absolute return = 12.25% CAGR.' },
    { q: 'When should I invest lumpsum?', a: 'Consider lumpsum when you have a large amount (bonus, inheritance), when markets have corrected, or when you have a 7+ year horizon.' },
    { q: 'What is a wealth multiplier?', a: 'It shows how many times your money grows. A 3x multiplier means ₹1L becomes ₹3L. Higher CAGR and longer tenure produce higher multipliers.' },
    { q: 'Are lumpsum investments taxed?', a: 'Under Finance Act rules (AY 2026-27): Equity MF LTCG above ₹1,25,000 is taxed at 12.5% (holding > 12 months). STCG is taxed at 20%. Debt mutual funds are taxed at your applicable slab rate.' },
  ];
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">How Lumpsum Calculator Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">A Lumpsum calculator estimates the future value of a one-time investment using the compound annual growth rate (CAGR). Unlike SIP which invests monthly, lumpsum investing puts the entire amount to work immediately.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Lumpsum Formula</h2>
        <div className="bg-card rounded-xl p-4 font-mono text-sm text-foreground border border-border/70 shadow-2xs">FV = PV × (1 + r)^n</div>
        <p className="text-muted-foreground text-xs mt-2">Where FV = Future Value, PV = Present Value, r = Annual rate of return, n = Number of years</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Example Calculation</h2>
        <div className="bg-card rounded-xl p-4 border border-primary/30 text-sm shadow-2xs border-l-[3px] border-l-primary">
          <p className="text-foreground">Investment: <strong>₹5,00,000</strong></p>
          <p className="text-muted-foreground text-xs mt-1">CAGR: <strong>12%</strong> · Period: <strong>10 years</strong></p>
          <p className="mt-2 font-bold text-primary text-base">Result: ≈ ₹15,52,924 (3.1x multiplier)</p>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border/60 pb-4 last:border-0">
              <h3 className="font-semibold text-sm text-foreground mb-1">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <p className="text-xs text-muted-foreground italic border-t border-border/60 pt-4">Disclaimer: Returns shown are estimates based on constant CAGR. Actual market returns fluctuate and are not guaranteed.</p>
    </div>
  );
}
