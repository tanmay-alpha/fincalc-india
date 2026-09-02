export default function Section54Info() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Capital Gains Tax Exemptions: Income-tax Act, 2025 (Sections 82, 85 & 86)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          For Tax Year 2026-27, capital gains exemptions are governed by the <strong>Income-tax Act, 2025 as amended by the Finance Act, 2026</strong>.
          The current statutory provisions directly correspond to the familiar legacy sections of the Income-tax Act, 1961:
          <strong> Section 82</strong> (formerly Section 54),
          <strong> Section 85</strong> (formerly Section 54EC), and
          <strong> Section 86</strong> (formerly Section 54F).
          Available statutory routes depend strictly on the nature of the original asset transferred.
        </p>
      </section>

      {/* Statutory Asset Eligibility Guide */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📋</span> Statutory Original Asset Eligibility Matrix (Income-tax Act, 2025)
        </h3>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Statutory Original Asset Eligibility Matrix Table"
        >
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-2 pr-3">Original Asset Transferred</th>
                <th className="py-2 px-3">Section 82 (formerly 54)</th>
                <th className="py-2 px-3">Section 85 (formerly 54EC)</th>
                <th className="py-2 pl-3">Section 86 (formerly 54F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 pr-3 font-medium">Residential House Property</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">Eligible (House → House)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">Eligible (Max ₹50L Bonds)</td>
                <td className="py-2.5 pl-3 text-rose-500 font-medium">Ineligible (Excludes residential house)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Commercial Property / Land / Plot</td>
                <td className="py-2.5 px-3 text-rose-500 font-medium">Ineligible (House transfer only)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">Eligible (Land/Building → Bonds)</td>
                <td className="py-2.5 pl-3 text-emerald-600 font-bold">Eligible (Plot/Office → House)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Other LTCG Assets (Shares, Gold, Mutual Funds)</td>
                <td className="py-2.5 px-3 text-rose-500 font-medium">Ineligible</td>
                <td className="py-2.5 px-3 text-rose-500 font-medium">Ineligible (Land/Building only)</td>
                <td className="py-2.5 pl-3 text-emerald-600 font-bold">Eligible (Non-house asset → House)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              🏠 Section 82 — Residential House Exemption
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Formerly Section 54 (Transfer of residential house property)
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Original Asset:</strong> Must be a residential house property (income chargeable under house property).</li>
              <li>• <strong>New Asset in India:</strong> Reinvestment must strictly be in a residential house situated in India.</li>
              <li>• <strong>Two-House Option:</strong> Where LTCG does not exceed ₹2 Crore, Section 82 allows acquiring <strong>up to two residential houses</strong> in India (strictly once-in-a-lifetime).</li>
              <li>• <strong>Purchase Window:</strong> Buy 1 year before or within 2 years after sale date.</li>
              <li>• <strong>Construction Window:</strong> Complete construction within 3 years of sale date.</li>
              <li>• <strong>Statutory Cap:</strong> Maximum ₹10 Crore exemption per assessee (Finance Act 2023 / 2026).</li>
              <li>• <strong>Lock-in:</strong> 3-year lock-in on new house before resale.</li>
              <li>• <strong>CGAS Deposit:</strong> Deposit unutilized gains before ITR filing due date.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              📜 Section 85 — Specified Bonds
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Formerly Section 54EC (Transfer of land or building or both)
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Eligible Issuers:</strong> NHAI, REC, PFC, and IRFC 54EC Bonds.</li>
              <li>• <strong>Investment Window:</strong> Strictly within <strong>6 months</strong> from transfer date.</li>
              <li>• <strong>Section 85(2) ₹50L Limit:</strong> Aggregate investment from capital gains arising from original asset(s) cannot exceed <strong>₹50 Lakh</strong> across the tax year of transfer and the subsequent tax year.</li>
              <li>• <strong>Lock-in:</strong> Mandatory 5-year lock-in (cannot be transferred or pledged as loan collateral).</li>
              <li>• <strong>Interest Rate:</strong> Approx 5.25% p.a. fixed interest (taxable annually).</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              💎 Section 86 — Other LTCG Asset → House
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Formerly Section 54F (Transfer of any asset other than residential house)
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Eligible Transfers:</strong> LTCG from commercial real estate, plot, gold, shares, etc.</li>
              <li>• <strong>Reinvestment:</strong> Purchase/construct a new residential house in India.</li>
              <li>• <strong>Proportionate Rule:</strong> Exemption = LTCG × (Cost of New House / Net Sale Consideration).</li>
              <li>• <strong>Ownership Constraint:</strong> Taxpayer must not own more than 1 residential house on transfer date.</li>
              <li>• <strong>Statutory Cap:</strong> New house cost recognized up to ₹10 Crore.</li>
              <li>• <strong>Lock-in:</strong> 3-year lock-in on the newly acquired residential house.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Scope & Post-Reinvestment Compliance Disclosure */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          ⚠️ Statutory Scope & Post-Reinvestment Future Compliance Disclosure
        </h3>
        <p className="leading-relaxed">
          This calculator evaluates statutory exemption at the <strong>transaction and initial reinvestment stage</strong>.
          Under Section 86 (formerly Section 54F) and Section 82 (formerly Section 54), exemptions granted will be revoked and taxed as Long-Term Capital Gains in future assessment years if any of the following statutory disqualifications occur:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li><strong>Purchasing an additional residential house:</strong> The taxpayer purchases any residential house, other than the new house, within 1 year before or 2 years after the date of transfer.</li>
          <li><strong>Constructing an additional residential house:</strong> The taxpayer constructs any residential house, other than the new house, within 3 years after the date of transfer.</li>
          <li><strong>Premature transfer of new house:</strong> The newly acquired or constructed residential house is transferred or sold within 3 years of acquisition or completion of construction.</li>
          <li><strong>Non-utilization of CGAS balance:</strong> Amounts deposited into a designated Capital Gains Account Scheme that remain unutilized at the expiry of the 3-year statutory window are treated as capital gains of the year in which the period expires.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Capital Gains Account Scheme (CGAS) 1988 Compliance
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p>
            If you have not purchased or completed construction of the new residential property before the due date for furnishing your Income Tax Return under Section 139(1), you must deposit unutilized capital gains (Section 82 / formerly Section 54) or unutilized net consideration (Section 86 / formerly Section 54F) into an authorized <strong>Capital Gains Account Scheme (Type A Savings or Type B Term Deposit)</strong> with an authorized public sector bank before filing your return.
          </p>
        </div>
      </section>
    </div>
  );
}
