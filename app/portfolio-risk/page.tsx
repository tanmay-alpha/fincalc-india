import type { Metadata } from "next";
import PortfolioRiskCalculator from "@/components/calculators/portfolio-risk/PortfolioRiskCalculator";

export const metadata: Metadata = {
  title: "Portfolio Risk & Return Calculator India — Sharpe, Sortino & Max Drawdown",
  description:
    "Analyze stock and mutual fund portfolio performance with Sharpe Ratio, Sortino Ratio, annualized downside deviation, and historical maximum drawdown.",
  keywords: [
    "portfolio risk calculator india",
    "sharpe ratio calculator",
    "sortino ratio calculator",
    "maximum drawdown calculator",
    "risk adjusted returns analyzer",
  ],
};

export default function PortfolioRiskPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Portfolio Risk & Return Analytics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Compute risk-adjusted investment metrics including Sharpe Ratio, Sortino Ratio, annualized volatility, and maximum peak-to-trough drawdown.
        </p>
      </header>

      <PortfolioRiskCalculator />
    </main>
  );
}
