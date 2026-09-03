import { Sparkles, FileText, AlertCircle } from "lucide-react";

export default function TaxInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/80 pt-8">
      <section>
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">
          Old vs New Tax Regime — Which Is Better?
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Under the Income-tax Act, 2025 (effective 1 April 2026 for Tax Year 2026–27), the New Tax Regime remains the statutory default in India. With the ₹75,000 standard deduction and Section 157 rebate up to ₹60,000, taxable income up to ₹12,00,000 pays zero tax under the New Regime. However, the Old Regime remains advantageous for taxpayers with substantial itemized deductions (Section 80C, Section 80D, HRA, and Section 24 home loan interest).
        </p>
      </section>

      <section>
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">
          Statutory Tax Slabs — AY 2026-27 (Finance Act, 2026)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 border border-primary/20 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Regime (Section 115BAC Default)</span>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>Up to ₹4,00,000</span>
                <span className="font-semibold text-foreground">Nil</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹4,00,001 – ₹8,00,000</span>
                <span className="font-semibold text-foreground">5%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹8,00,001 – ₹12,00,000</span>
                <span className="font-semibold text-foreground">10%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹12,00,001 – ₹16,00,000</span>
                <span className="font-semibold text-foreground">15%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹16,00,001 – ₹20,00,000</span>
                <span className="font-semibold text-foreground">20%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹20,00,001 – ₹24,00,000</span>
                <span className="font-semibold text-foreground">25%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Above ₹24,00,000</span>
                <span className="font-semibold text-foreground">30%</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border text-[11px] font-medium text-primary">
                Standard deduction: ₹75,000 · Section 157 full rebate ≤ ₹12L taxable
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-foreground mb-3">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Old Regime (Optional with Itemized Deductions)</span>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>Up to ₹2,50,000</span>
                <span className="font-semibold text-foreground">Nil</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹2,50,001 – ₹5,00,000</span>
                <span className="font-semibold text-foreground">5%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/30">
                <span>₹5,00,001 – ₹10,00,000</span>
                <span className="font-semibold text-foreground">20%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Above ₹10,00,000</span>
                <span className="font-semibold text-foreground">30%</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border text-[11px] text-muted-foreground">
                Standard deduction: ₹50,000 · Deductions u/s 80C, 80D, 24(b) permitted
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Which tax regime is better for salaried employees?",
              a: "New Regime is typically superior for taxpayers whose total itemized deductions are less than ₹3.75 lakh. If you have substantial HRA exemption, home loan interest deductions under Section 24, and full 80C/80D investments, Old Regime can yield higher savings. Use this calculator to compare both regimes with your exact salary breakdown.",
            },
            {
              q: "What is Rebate under Section 157 (formerly 87A)?",
              a: "Under the New Regime for Tax Year 2026-27 (Income-tax Act, 2025 as amended by Finance Act, 2026), resident individuals with total taxable income up to ₹12 lakh pay zero net slab tax due to the statutory Section 157 tax rebate (up to ₹60,000). Combined with the ₹75,000 standard deduction, gross salary up to ₹12.75 lakh is effectively tax-free, with Section 157(2)(b) marginal relief tapering smoothly above ₹12L.",
            },
            {
              q: "Can I switch between Old and New regime every year?",
              a: "Yes. Salaried individuals with no business or professional income (PGBP) can choose between the Old and New regimes every financial year when filing their Income Tax Return (ITR). Non-salaried taxpayers with business/professional income can opt out of the New Regime once in their lifetime.",
            },
            {
              q: "What deductions are permitted in the New Regime?",
              a: "The New Regime allows the flat standard deduction of ₹75,000 for salaried employees and pensioners, and employer National Pension System (NPS) contributions under Section 80CCD(2). Deductions under Section 80C, Section 80D, HRA exemption, and self-occupied home loan interest are not allowed.",
            },
            {
              q: "When does tax surcharge apply?",
              a: "Surcharge is levied on tax when total income exceeds ₹50 lakh: 10% for ₹50L–₹1Cr, 15% for ₹1Cr–₹2Cr, and 25% for income exceeding ₹2Cr under the New Regime (capped at 25%). A 4% Health & Education Cess applies universally on net tax plus surcharge.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-1.5"
            >
              <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p>
          Statutory Disclaimer: Tax calculations are estimates based on Tax Year 2026–27 provisions under the Income-tax Act, 2025. This calculator does not constitute professional chartered accountancy advice. Please consult a qualified tax professional for personal filing.
        </p>
      </div>
    </div>
  );
}
