export default function Section54Info() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Real Estate Capital Gains Tax Exemptions: Section 54 vs Section 54EC
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Selling a long-term residential property or land attracts Long-Term Capital Gains (LTCG) tax at 12.5% (plus 4% cess = 13%). The Income Tax Act provides legitimate statutory avenues under Section 54 and Section 54EC to legally bring your tax liability down to ₹0.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              🏠 Section 54 — Reinvestment in New Residential House
            </p>
            <p className="text-xs text-slate-500 mb-2">
              For LTCG from transfer of a residential house property
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Purchase Window:</strong> Buy 1 year before or within 2 years after date of sale.</li>
              <li>• <strong>Construction Window:</strong> Complete construction within 3 years of sale date.</li>
              <li>• <strong>Statutory Cap:</strong> Maximum ₹10 Crore exemption per assessee (Finance Act 2023).</li>
              <li>• <strong>Lock-in:</strong> If the new house is sold within 3 years, the exemption is revoked.</li>
              <li>• <strong>CGAS Deposit:</strong> Unutilized funds must be deposited into a Capital Gains Account Scheme before filing ITR.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              📜 Section 54EC — Capital Gains Specified Bonds
            </p>
            <p className="text-xs text-slate-500 mb-2">
              For LTCG from transfer of any land or building (residential or commercial)
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Eligible Issuers:</strong> NHAI, REC, PFC, and IRFC Capital Gains Bonds.</li>
              <li>• <strong>Investment Window:</strong> Strictly within <strong>6 months</strong> from the transfer date.</li>
              <li>• <strong>Statutory Cap:</strong> Maximum ₹50 Lakhs investment per financial year.</li>
              <li>• <strong>Lock-in:</strong> Mandatory 5-year lock-in (cannot be transferred, redeemed, or pledged as loan collateral).</li>
              <li>• <strong>Interest Rate:</strong> Approx 5.25% p.a. fixed interest (taxable annually).</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Capital Gains Account Scheme (CGAS) 1988 Compliance
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p>
            If you have not purchased or constructed the new residential property before the due date for furnishing your Income Tax Return (usually 31st July of the Assessment Year), you must deposit the unutilized capital gains into a designated <strong>Capital Gains Account Scheme (Type A Savings or Type B Term Deposit)</strong> with an authorized public sector bank to claim the Section 54 exemption in your ITR.
          </p>
        </div>
      </section>
    </div>
  );
}
