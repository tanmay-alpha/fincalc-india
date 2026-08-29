export default function CapitalGainsInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Capital Gains Tax Rules (Post-Budget 2024 / FY 2025-26)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          The Union Budget presented on 23 July 2024 substantially revamped India&rsquo;s Capital Gains Tax regime to simplify holding periods and tax rates across asset classes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Summary of Key Tax Rates by Asset Class
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">📈 Listed Equity & Equity Mutual Funds</p>
            <p className="text-xs text-slate-500 mb-2">Holding Period Threshold: 12 Months</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>LTCG (&gt;12m):</strong> 12.5% on gains above ₹1,25,000 annual exemption limit.</li>
              <li>• <strong>STCG (≤12m):</strong> Flat 20% tax on full short-term capital gain.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🏠 Real Estate (Land & Buildings)</p>
            <p className="text-xs text-slate-500 mb-2">Holding Period Threshold: 24 Months</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>Purchased Before 23 July 2024:</strong> Grandfathering allows lower of 12.5% without indexation OR 20% with indexation.</li>
              <li>• <strong>Purchased On/After 23 July 2024:</strong> Flat 12.5% LTCG without indexation benefit.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🏦 Debt Mutual Funds</p>
            <p className="text-xs text-slate-500 mb-2">No LTCG / Indexation Benefit</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Under Finance Act provisions (effective April 2023), mutual funds with &le;35% equity allocation are taxed at the investor&rsquo;s applicable income tax slab rate.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">🪙 Physical Gold & Sovereign Gold Bonds (SGB)</p>
            <p className="text-xs text-slate-500 mb-2">Holding Period Threshold: 24 Months</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>LTCG (&gt;24m):</strong> 12.5% without indexation (reduced from 20%).</li>
              <li>• <strong>STCG (≤24m):</strong> Taxed at investor&rsquo;s income tax slab rate.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
