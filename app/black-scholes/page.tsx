import type { Metadata } from "next";
import BlackScholesCalculator from "@/components/calculators/black-scholes/BlackScholesCalculator";

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
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Black-Scholes Option Pricing & Greeks
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calculate European option theoretical fair value and first & second-order Greeks (Delta, Gamma, Theta, Vega) using the continuous Black-Scholes-Merton model.
        </p>
      </header>

      <BlackScholesCalculator />
    </main>
  );
}
