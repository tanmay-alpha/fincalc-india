export default function PositionSizeInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          The 1% Risk Rule and Mathematical Position Sizing in Trading
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Professional traders survive and thrive by controlling downside exposure per trade rather than guessing position sizes. The gold standard in intraday and swing risk management is the <strong>Fixed Fractional Risk Rule</strong> (typically 1% to 2% of total capital).
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. Rupee Risk Formula</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-muted/40 p-1.5 rounded mb-1.5">
              Max Risk = Capital × Risk %
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ensures that a series of consecutive losses cannot inflict fatal portfolio drawdowns.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Quantity Calculation</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-muted/40 p-1.5 rounded mb-1.5">
              Quantity = Max Risk ÷ |Entry − Stop-Loss|
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Always floored to whole shares to strictly prevent exceeding your designated risk budget.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. Asymmetric Risk-Reward</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-muted/40 p-1.5 rounded mb-1.5">
              Target = Entry ± (R:R × Risk/Share)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aiming for 1:2 or 1:3 RR produces positive statistical expectancy even with a 40% win rate.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          SEBI Peak Margin Rules and Intraday Leverage in India
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p>
            Under SEBI&apos;s peak margin framework, brokerages in India can provide up to <strong>5x leverage (20% upfront VAR+ELM margin)</strong> for intraday equity MIS orders. However, higher leverage does not mean you should increase your rupee risk — it merely reduces the idle margin blocked while holding the trade.
          </p>
        </div>
      </section>
    </div>
  );
}
