export default function Section54Info() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Capital Gains Tax Exemptions: Income-tax Act, 2025 (Sections 82, 85 & 86)
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          For Tax Year 2026-27, capital gains exemptions are governed by the <strong className="text-foreground">Income-tax Act, 2025 as amended by the Finance Act, 2026</strong>.
          The current statutory provisions directly correspond to the familiar legacy sections of the Income-tax Act, 1961:
          <strong className="text-foreground"> Section 82</strong> (formerly Section 54),
          <strong className="text-foreground"> Section 85</strong> (formerly Section 54EC), and
          <strong className="text-foreground"> Section 86</strong> (formerly Section 54F).
          Available statutory routes depend strictly on the nature of the original asset transferred.
        </p>
      </section>

      {/* Statutory Asset Eligibility Guide */}
      <section className="bg-card rounded-xl p-5 border border-border/80 text-sm space-y-3 shadow-2xs">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Matrix</span>
          <span>Statutory Original Asset Eligibility Matrix (Income-tax Act, 2025)</span>
        </h3>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Statutory Original Asset Eligibility Matrix Table"
        >
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-foreground/80 font-semibold">
                <th className="py-2 pr-3">Original Asset Transferred</th>
                <th className="py-2 px-3">Section 82 (formerly 54)</th>
                <th className="py-2 px-3">Section 85 (formerly 54EC)</th>
                <th className="py-2 pl-3">Section 86 (formerly 54F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              <tr>
                <td className="py-2.5 pr-3 font-medium">Residential House Property</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">Eligible (House → House)</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">Eligible (Max ₹50L Bonds)</td>
                <td className="py-2.5 pl-3 text-destructive font-semibold">Ineligible (Excludes residential house)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Commercial Property / Land / Plot</td>
                <td className="py-2.5 px-3 text-destructive font-semibold">Ineligible (House transfer only)</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">Eligible (Land/Building → Bonds)</td>
                <td className="py-2.5 pl-3 text-emerald-600 dark:text-emerald-400 font-bold">Eligible (Plot/Office → House)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Other LTCG Assets (Shares, Gold, Mutual Funds)</td>
                <td className="py-2.5 px-3 text-destructive font-semibold">Ineligible</td>
                <td className="py-2.5 px-3 text-destructive font-semibold">Ineligible (Land/Building only)</td>
                <td className="py-2.5 pl-3 text-emerald-600 dark:text-emerald-400 font-bold">Eligible (Non-house asset → House)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Section 82</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">Residential House</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Formerly Section 54 (Transfer of residential house property)
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Original Asset:</strong> Residential house property.</li>
              <li>• <strong className="text-foreground">New Asset:</strong> Reinvestment in a residential house situated in India.</li>
              <li>• <strong className="text-foreground">Two-House Option:</strong> Where LTCG does not exceed ₹2 Crore, acquire up to two residential houses (once-in-a-lifetime).</li>
              <li>• <strong className="text-foreground">Purchase Window:</strong> Buy 1 year before or within 2 years after sale date.</li>
              <li>• <strong className="text-foreground">Construction Window:</strong> Complete construction within 3 years of sale date.</li>
              <li>• <strong className="text-foreground">Statutory Cap:</strong> Maximum ₹10 Crore exemption per assessee.</li>
              <li>• <strong className="text-foreground">Lock-in:</strong> 3-year lock-in on new house before resale.</li>
              <li>• <strong className="text-foreground">CGAS Deposit:</strong> Deposit unutilized gains before ITR filing due date.</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Section 85</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Specified Bonds</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Formerly Section 54EC (Transfer of land or building or both)
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Eligible Issuers:</strong> NHAI, REC, PFC, and IRFC 54EC Bonds.</li>
              <li>• <strong className="text-foreground">Investment Window:</strong> Strictly within 6 months from transfer date.</li>
              <li>• <strong className="text-foreground">₹50L Limit:</strong> Aggregate investment from capital gains cannot exceed ₹50 Lakh across tax year of transfer and subsequent year.</li>
              <li>• <strong className="text-foreground">Lock-in:</strong> Mandatory 5-year lock-in (cannot be transferred or pledged).</li>
              <li>• <strong className="text-foreground">Interest Rate:</strong> Approx 5.25% p.a. fixed interest (taxable annually).</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Section 86</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">Other Asset → House</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Formerly Section 54F (Transfer of any asset other than residential house)
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Eligible Transfers:</strong> LTCG from commercial real estate, plot, gold, shares, etc.</li>
              <li>• <strong className="text-foreground">Reinvestment:</strong> Purchase/construct a new residential house in India.</li>
              <li>• <strong className="text-foreground">Proportionate Rule:</strong> Exemption = LTCG × (Cost of New House / Net Sale Consideration).</li>
              <li>• <strong className="text-foreground">Ownership Constraint:</strong> Taxpayer must not own more than 1 residential house on transfer date.</li>
              <li>• <strong className="text-foreground">Statutory Cap:</strong> New house cost recognized up to ₹10 Crore.</li>
              <li>• <strong className="text-foreground">Lock-in:</strong> 3-year lock-in on the newly acquired house.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Scope & Post-Reinvestment Compliance Disclosure */}
      <section className="bg-card rounded-xl p-5 border border-amber-500/30 text-xs space-y-2 text-muted-foreground shadow-2xs border-l-[3px] border-l-amber-500">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
          <span className="text-amber-600 dark:text-amber-400 font-bold">Important:</span>
          <span>Statutory Scope & Post-Reinvestment Future Compliance Disclosure</span>
        </h3>
        <p className="leading-relaxed">
          This calculator evaluates statutory exemption at the <strong className="text-foreground">transaction and initial reinvestment stage</strong>.
          Under the Income-tax Act, 2025, future compliance and revocation conditions are strictly separated:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li><strong className="text-foreground">Section 86 (formerly 54F) Exclusive Restrictions:</strong> Purchasing an additional residential house (within 1 year before or 2 years after transfer) or constructing another house (within 3 years) revokes the Section 86 exemption. Section 82 (formerly 54) has no such future purchase bar.</li>
          <li><strong className="text-foreground">Common 3-Year Holding Period:</strong> For both Section 82 and Section 86, transferring or selling the newly acquired or constructed residential house within 3 years of acquisition revokes the exemption and taxes it as capital gains in the year of resale.</li>
          <li><strong className="text-foreground">Non-utilization of CGAS balance:</strong> Amounts deposited into a designated Capital Gains Account Scheme that remain unutilized at the expiry of the 3-year statutory window are treated as capital gains of the year in which the period expires.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Capital Gains Account Scheme (CGAS) Compliance
        </h2>
        <div className="bg-card rounded-xl p-4 border border-border/80 text-xs space-y-2 text-muted-foreground shadow-2xs">
          <p>
            If you have not purchased or completed construction of the new residential property before the statutory due date for furnishing your Income Tax Return under <strong className="text-foreground">Section 263 of the Income-tax Act, 2025 (legacy Section 139(1))</strong>, you must deposit unutilized capital gains (Section 82 / formerly Section 54) or unutilized net consideration (Section 86 / formerly Section 54F) into an authorized <strong className="text-foreground">Capital Gains Account Scheme (Type A Savings or Type B Term Deposit)</strong> with an authorized bank before filing your return.
          </p>
        </div>
      </section>
    </div>
  );
}
