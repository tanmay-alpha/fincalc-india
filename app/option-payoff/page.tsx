import type { Metadata } from "next";
import OptionPayoffCalculator from "@/components/calculators/option-payoff/OptionPayoffCalculator";
import OptionPayoffInfo from "@/components/seo/OptionPayoffInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Option Strategy Payoff Visualizer & Breakeven Calculator",
  description:
    "Interactive option payoff chart builder with presets for Bull Call Spread, Bear Put Spread, Straddle, Strangle, Iron Condor, and Covered Call with multi-breakeven detection.",
  openGraph: {
    title: "Option Strategy Payoff Visualizer — FinCalc India",
    description:
      "Visualize expiry payoff, max profit, max loss, and breakeven points for multi-leg option strategies.",
  },
};

export default function OptionPayoffPage() {
  return (
    <CalculatorPageShell
      id="option-payoff"
      badge="Expiry Payoffs"
      assumptions={[
        "Payoff profile models intrinsic option value at final contract expiry, assuming zero residual time value.",
        "European-style settlement convention is assumed, aligned with NSE index and stock option cash-settlement mechanics.",
        "Model reflects gross strategy payoffs; for statutory STT, GST, and exchange fees, combine with the F&O Brokerage Calculator.",
        "Market prices and premium quotes assume standard contract lot sizes (e.g. NIFTY 25, BANKNIFTY 15).",
      ]}
      sources={[
        { label: "NSE India — Derivatives Specifications & Rules", url: "https://www.nseindia.com/" },
        { label: "Options Clearing Corporation — Strategy Guide", url: "https://www.theocc.com/" },
      ]}
      educationalContent={<OptionPayoffInfo />}
    >
      <OptionPayoffCalculator />
    </CalculatorPageShell>
  );
}
