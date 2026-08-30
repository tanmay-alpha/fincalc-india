export default function PresumptiveTaxInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Presumptive Taxation Scheme (Section 44AD & 44ADA)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          The Presumptive Taxation Scheme under the Income Tax Act allows small businesses and specified professionals to declare income at prescribed flat rates without the tedious burden of maintaining comprehensive books of accounts or undergoing mandatory CA tax audits.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              🩺 Section 44ADA — Specified Professionals
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Doctors, Lawyers, Tech Freelancers, CAs, Engineers, Interior Designers
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Presumptive Profit:</strong> Flat <strong>50%</strong> of gross receipts.</li>
              <li>• <strong>Statutory Limit:</strong> ₹50 Lakhs base limit, enhanced to <strong>₹75 Lakhs</strong> if digital receipts are ≥ 95%.</li>
              <li>• <strong>No Bookkeeping:</strong> No requirement to maintain ledgers or vouchers u/s 44AA.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              🏪 Section 44AD — Small Businesses & Traders
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Retailers, Wholesalers, Contractors, E-commerce Sellers
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Digital Receipts Rate:</strong> <strong>6%</strong> of turnover received via banking/UPI/digital channels.</li>
              <li>• <strong>Cash Receipts Rate:</strong> <strong>8%</strong> of turnover received in cash.</li>
              <li>• <strong>Statutory Limit:</strong> ₹2 Crore base limit, enhanced to <strong>₹3 Crore</strong> if digital receipts are ≥ 95%.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Tax Audit Triggers and Section 44AD(4) 5-Year Lockout Rule
        </h2>
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            Critical Compliance Rules When Declaring Profit Lower than Presumptive Rates:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
            <li><strong>Mandatory Tax Audit:</strong> If you declare profits lower than the presumptive rate (e.g. &lt;50% for 44ADA or &lt;6%/8% for 44AD) and your total income exceeds the basic exemption limit, you <strong>must maintain regular books of accounts u/s 44AA</strong> and get them audited by a CA u/s 44AB.</li>
            <li><strong>5-Year Lockout Penalty u/s 44AD(4):</strong> If a business opts out of Section 44AD in any financial year by declaring lower profits, they are barred from opting into Section 44AD for the next 5 consecutive assessment years.</li>
            <li><strong>Advance Tax:</strong> Assessees opting for 44AD/44ADA pay their entire advance tax in a single installment on or before 15th March of the financial year.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
