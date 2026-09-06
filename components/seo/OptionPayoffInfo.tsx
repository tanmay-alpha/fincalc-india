export default function OptionPayoffInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-border/60 pt-8">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Popular Option Trading Strategies in India
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Option strategy payoff diagrams visually model your potential profit, maximum loss, and breakeven levels across all possible underlying price outcomes at expiry.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Strategy Cheat Sheet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Bull Call Spread</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">Debit Spread</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Buy ATM Call + Sell OTM Call</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lowers entry cost compared to buying naked calls while keeping downside risk capped strictly to the net debit paid.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Iron Condor</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">4 Legs</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Bull Put + Bear Call</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Neutral delta strategy that collects net option credit when the underlying index stays within a defined trading range.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/80 text-sm shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-foreground">Straddle / Strangle</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">Volatility Play</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Call + Put at Same/Different Strike</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Profits from sharp directional volatility breakouts in either direction (e.g. Budget day, RBI policy, earnings).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
