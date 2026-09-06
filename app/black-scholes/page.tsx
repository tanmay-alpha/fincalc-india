import type { Metadata } from "next";
import BlackScholesCalculator from "@/components/calculators/black-scholes/BlackScholesCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Black-Scholes Option Pricing & Greeks Calculator India — Nifty & Bank Nifty",
  description:
    "Calculate theoretical Call/Put option prices and real-time Option Greeks (Delta, Gamma, Theta, Vega, Rho) with dividend yield and Put-Call parity check.",
  keywords: [
    "black scholes calculator india",
    "option greeks calculator nse",
    "nifty option pricing formula",
    "call and put delta theta vega",
    "black scholes merton model",
  ],
};

export default function BlackScholesPage() {
  return (
    <CalculatorPageShell
      id="black-scholes"
      assumptions={[
        "European option pricing model assumes continuous trading, zero transaction frictions, and constant risk-free rate.",
        "Underlying asset price is assumed to follow a geometric Brownian motion with lognormal distribution.",
        "Implied volatility reflects annualized standard deviation of asset price returns.",
      ]}
      sources={[
        {
          label: "National Stock Exchange of India (NSE) — Equity Derivatives",
          url: "https://www.nseindia.com/",
        },
      ]}
    >
      <BlackScholesCalculator />
    </CalculatorPageShell>
  );
}
