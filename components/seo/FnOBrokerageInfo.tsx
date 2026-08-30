export default function FnOBrokerageInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          How Are F&O Brokerage & Regulatory Charges Calculated in India?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          In India, trading Futures & Options (F&O) incurs multiple statutory charges mandated by the government, SEBI, and stock exchanges (NSE/BSE), in addition to your broker&rsquo;s commission.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Detailed Regulatory Fee Structure (Tax Year 2026-27)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. Securities Transaction Tax (STT)</p>
            <p className="text-xs text-slate-500 mb-2">Effective 1 April 2026 (Tax Year 2026-27)</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>Options:</strong> 0.15% flat on sell premium (raised from 0.10%).</li>
              <li>• <strong>Futures:</strong> 0.05% on sell turnover (raised from 0.02%).</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Exchange & SEBI Turnover Fees</p>
            <p className="text-xs text-slate-500 mb-2">NSE / BSE & SEBI</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>Exchange Txn Charge:</strong> ~0.05% on options premium turnover.</li>
              <li>• <strong>SEBI Turnover Fee:</strong> ₹10 per ₹1 Crore of turnover.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. GST & Stamp Duty</p>
            <p className="text-xs text-slate-500 mb-2">Statutory Levies</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>GST (18%):</strong> Levied only on Brokerage + Exchange Charges + SEBI fees (never on STT).</li>
              <li>• <strong>Stamp Duty:</strong> 0.003% on Options (buy side only).</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
