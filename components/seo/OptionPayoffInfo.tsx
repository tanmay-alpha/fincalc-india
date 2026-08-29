export default function OptionPayoffInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Popular Option Trading Strategies in India
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Option strategy payoff diagrams visually model your potential profit, maximum loss, and breakeven levels across all possible underlying price outcomes at expiry.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Strategy Cheat Sheet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Bull Call Spread</p>
            <p className="text-xs text-slate-500 mb-2">Buy ATM Call + Sell OTM Call</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Lowers entry cost compared to buying naked calls while keeping downside risk capped strictly to the net debit paid.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Iron Condor</p>
            <p className="text-xs text-slate-500 mb-2">4 Legs (Bull Put + Bear Call)</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Neutral delta strategy that collects net option credit when the underlying index stays within a defined trading range.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Long Straddle / Strangle</p>
            <p className="text-xs text-slate-500 mb-2">Call + Put at Same/Different Strike</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Profits from sharp directional volatility breakouts in either direction (e.g. Budget day, RBI policy, earnings).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
