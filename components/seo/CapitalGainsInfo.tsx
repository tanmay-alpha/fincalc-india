export default function CapitalGainsInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Capital Gains Tax Rules (Tax Year 2026-27)
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The Union Budget revamped India&rsquo;s Capital Gains Tax regime to streamline holding periods and tax rates across asset classes under the Income-tax Act, 2025.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Summary of Key Tax Rates by Asset Class
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Listed Equity & Equity Mutual Funds</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">12 Months Threshold</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">STT-Paid Equity Instruments</p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">LTCG (&gt;12m):</strong> 12.5% on gains above ₹1,25,000 annual exemption limit.</li>
              <li>• <strong className="text-foreground">STCG (≤12m):</strong> Flat 20% tax on full short-term capital gain.</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Real Estate (Land & Buildings)</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">24 Months Threshold</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Immovable Property</p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">Purchased Before 23 July 2024:</strong> Grandfathering allows lower of 12.5% without indexation OR 20% with indexation.</li>
              <li>• <strong className="text-foreground">Purchased On/After 23 July 2024:</strong> Flat 12.5% LTCG without indexation benefit.</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Debt Mutual Funds</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">Slab Rate</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">No Indexation Benefit</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under Finance Act provisions, specified mutual funds with ≤35% equity allocation are taxed at the investor&rsquo;s applicable income tax slab rate.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Physical Gold & Sovereign Gold Bonds (SGB)</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">24 Months Threshold</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Precious Metals</p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• <strong className="text-foreground">LTCG (&gt;24m):</strong> 12.5% without indexation (reduced from 20%).</li>
              <li>• <strong className="text-foreground">STCG (≤24m):</strong> Taxed at investor&rsquo;s income tax slab rate.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
