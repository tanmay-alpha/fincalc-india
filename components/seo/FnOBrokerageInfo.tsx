export default function FnOBrokerageInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          How Are F&O Brokerage & Regulatory Charges Calculated in India?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          In India, trading Futures & Options (F&O) incurs multiple statutory charges mandated by the government, SEBI, and stock exchanges (NSE/BSE), in addition to your broker&rsquo;s commission.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Detailed Regulatory Fee Structure (Tax Year 2026-27)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <p className="font-semibold text-foreground mb-1">1. Securities Transaction Tax (STT)</p>
            <p className="text-xs text-muted-foreground mb-2">Effective 1 April 2026 (Tax Year 2026-27)</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong className="text-foreground">Options:</strong> 0.15% flat on sell premium (raised from 0.10%).</li>
              <li>• <strong className="text-foreground">Futures:</strong> 0.05% on sell turnover (raised from 0.02%).</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <p className="font-semibold text-foreground mb-1">2. Exchange & SEBI Turnover Fees</p>
            <p className="text-xs text-muted-foreground mb-2">NSE / BSE & SEBI</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong className="text-foreground">Exchange Txn Charge:</strong> ~0.05% on options premium turnover.</li>
              <li>• <strong className="text-foreground">SEBI Turnover Fee:</strong> ₹10 per ₹1 Crore of turnover.</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <p className="font-semibold text-foreground mb-1">3. GST & Stamp Duty</p>
            <p className="text-xs text-muted-foreground mb-2">Statutory Levies</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong className="text-foreground">GST (18%):</strong> Levied only on Brokerage + Exchange Charges + SEBI fees (never on STT).</li>
              <li>• <strong className="text-foreground">Stamp Duty:</strong> 0.003% on Options (buy side only).</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
