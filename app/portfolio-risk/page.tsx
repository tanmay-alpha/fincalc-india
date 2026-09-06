import type { Metadata } from "next";
import PortfolioRiskCalculator from "@/components/calculators/portfolio-risk/PortfolioRiskCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="portfolio-risk"
      assumptions={[
        "Risk-free rate benchmark defaults to current prevailing Government of India Treasury Bill yields.",
        "Sortino ratio measures downside volatility exclusively below the target minimum acceptable return.",
        "Maximum drawdown measures peak-to-trough drop before a new peak is achieved across the observation horizon.",
      ]}
      sources={[
        {
          label: "Reserve Bank of India — Financial Market Operations & Benchmarks",
          url: "https://rbi.org.in/",
        },
      ]}
    >
      <PortfolioRiskCalculator />
    </CalculatorPageShell>
  );
}
