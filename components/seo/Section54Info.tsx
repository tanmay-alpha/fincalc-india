export default function Section54Info() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Capital Gains Tax Exemptions: Section 54 vs Section 54EC vs Section 54F
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Selling long-term capital assets attracts Long-Term Capital Gains (LTCG) tax at 12.5% (plus 4% cess = 13%). The Income Tax Act provides legitimate statutory avenues under Section 54, Section 54EC, and Section 54F to legally reduce or eliminate your tax liability. Statutory eligibility depends strictly on the nature of the original asset transferred.
        </p>
      </section>

      {/* Statutory Asset Eligibility Guide */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📋</span> Statutory Original Asset Eligibility Matrix
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
                <th className="py-2 px-3">Section 54</th>
                <th className="py-2 px-3">Section 54EC</th>
                <th className="py-2 pl-3">Section 54F</th>
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
              🏠 Section 54 — Residential House
            </p>
            <p className="text-xs text-slate-500 mb-2">
              LTCG from transfer of a residential house property
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Purchase Window:</strong> Buy 1 year before or within 2 years after sale date.</li>
              <li>• <strong>Construction:</strong> Complete construction within 3 years of sale date.</li>
              <li>• <strong>Statutory Cap:</strong> Maximum ₹10 Crore exemption per assessee (Finance Act 2023 / 2026).</li>
              <li>• <strong>Lock-in:</strong> 3-year lock-in on new house before resale.</li>
              <li>• <strong>CGAS Deposit:</strong> Deposit unutilized gains before ITR filing due date.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              📜 Section 54EC — Capital Gains Bonds
            </p>
            <p className="text-xs text-slate-500 mb-2">
              LTCG from transfer of land or building or both
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Eligible Issuers:</strong> NHAI, REC, PFC, and IRFC 54EC Bonds.</li>
              <li>• <strong>Investment Window:</strong> Strictly within <strong>6 months</strong> from transfer date.</li>
              <li>• <strong>Statutory Cap:</strong> Maximum ₹50 Lakhs investment per financial year.</li>
              <li>• <strong>Lock-in:</strong> Mandatory 5-year lock-in (cannot be pledged/transferred).</li>
              <li>• <strong>Interest Rate:</strong> Approx 5.25% p.a. fixed interest (taxable annually).</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              💎 Section 54F — Non-Residential to House
            </p>
            <p className="text-xs text-slate-500 mb-2">
              LTCG from transfer of any asset other than residential house
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• <strong>Reinvestment:</strong> Purchase/construct a new residential house in India.</li>
              <li>• <strong>Proportionate Rule:</strong> Exemption = LTCG × (Cost of New House / Net Sale Consideration).</li>
              <li>• <strong>Ownership Constraint:</strong> Taxpayer must not own more than 1 residential house on transfer date.</li>
              <li>• <strong>Statutory Cap:</strong> New house cost recognized up to ₹10 Crore.</li>
              <li>• <strong>Lock-in:</strong> 3-year lock-in on the newly acquired residential house.</li>
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
            If you have not purchased or completed construction of the new residential property before the due date for furnishing your Income Tax Return (Section 139(1)), you must deposit unutilized capital gains (Section 54) or unutilized net consideration (Section 54F) into an authorized <strong>Capital Gains Account Scheme (Type A Savings or Type B Term Deposit)</strong> with an authorized bank before filing your return.
          </p>
        </div>
      </section>
    </div>
  );
}
