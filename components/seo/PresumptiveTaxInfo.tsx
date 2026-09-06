export default function PresumptiveTaxInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Presumptive Taxation Scheme (Section 44AD & 44ADA)
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The Presumptive Taxation Scheme under the Income Tax Act allows small businesses and specified professionals to declare income at prescribed flat rates without the tedious burden of maintaining comprehensive books of accounts or undergoing mandatory CA tax audits.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Section 44ADA</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">Specified Professionals</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Doctors, Lawyers, Tech Freelancers, CAs, Engineers, Interior Designers
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Presumptive Profit:</strong> Flat 50% of gross receipts.</li>
              <li>• <strong className="text-foreground">Statutory Limit:</strong> ₹50 Lakhs base limit, enhanced to ₹75 Lakhs if digital receipts are ≥ 95%.</li>
              <li>• <strong className="text-foreground">No Bookkeeping:</strong> No requirement to maintain ledgers or vouchers u/s 44AA.</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Section 44AD</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Small Businesses & Traders</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Retailers, Wholesalers, Contractors, E-commerce Sellers
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Digital Receipts Rate:</strong> 6% of turnover received via banking/UPI/digital channels.</li>
              <li>• <strong className="text-foreground">Cash Receipts Rate:</strong> 8% of turnover received in cash.</li>
              <li>• <strong className="text-foreground">Statutory Limit:</strong> ₹2 Crore base limit, enhanced to ₹3 Crore if digital receipts are ≥ 95%.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Tax Audit Triggers and Section 44AD(4) 5-Year Lockout Rule
        </h2>
        <div className="bg-card border border-amber-500/30 rounded-xl p-4 text-xs space-y-2 text-muted-foreground shadow-2xs border-l-[3px] border-l-amber-500">
          <p className="font-semibold text-foreground">
            Critical Compliance Rules When Declaring Profit Lower than Presumptive Rates:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground">
            <li><strong className="text-foreground">Mandatory Tax Audit:</strong> If you declare profits lower than the presumptive rate (e.g. &lt;50% for 44ADA or &lt;6%/8% for 44AD) and your total income exceeds the basic exemption limit, you <strong className="text-foreground">must maintain regular books of accounts u/s 44AA</strong> and get them audited by a CA u/s 44AB.</li>
            <li><strong className="text-foreground">5-Year Lockout Penalty u/s 44AD(4):</strong> If a business opts out of Section 44AD in any financial year by declaring lower profits, they are barred from opting into Section 44AD for the next 5 consecutive assessment years.</li>
            <li><strong className="text-foreground">Advance Tax:</strong> Assessees opting for 44AD/44ADA pay their entire advance tax in a single installment on or before 15th March of the financial year.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
