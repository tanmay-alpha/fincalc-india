export default function FIREInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          What is FIRE (Financial Independence, Retire Early)?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The <strong className="text-foreground">FIRE framework</strong> models portfolio accumulation designed to sustain living expenses over extended horizons. Achieving financial independence relies on disciplined savings, prudent asset allocation, conservative safe withdrawal rates, and managing sequence-of-returns risk across multi-decade retirement periods.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          The 3 Primary FIRE Approaches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Lean FIRE</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">0.75x Baseline</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Focuses on essential baseline living costs and moderate living expenditures in lower-cost geographies.</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Standard FIRE</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">1.0x Expenses</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Maintains current annual living standards and customary discretionary expenditure.</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Fat FIRE</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">1.5x Multiplier</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Includes an expansive buffer for travel, lifestyle flexibility, and unforeseen emergencies.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What is the 25x / 30x Rule and Safe Withdrawal Rate (SWR)?",
              a: "While the classical Trinity Study evaluated a 4% Safe Withdrawal Rate (25x expenses) over a 30-year horizon in US markets, Indian macroeconomic conditions—including higher structural inflation and potential 40+ year retirements—warrant conservative withdrawal rates of 2.75%–3.25% (30x–36x annual expenses) to mitigate sequence risk."
            },
            {
              q: "How should I structure my portfolio post-retirement?",
              a: "A 3-Bucket strategy is commonly applied: Bucket 1 (1–3 years of expenses in liquid assets/short-term fixed deposits), Bucket 2 (4–7 years in quality debt and hybrid funds), and Bucket 3 (8+ years in diversified equity funds to preserve long-term purchasing power)."
            },
            {
              q: "What about medical inflation and healthcare planning?",
              a: "Healthcare inflation in India historically outpaces baseline CPI. Early retirement plans should budget for independent health insurance policies with comprehensive super top-up coverage and a dedicated medical contingency reserve."
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
