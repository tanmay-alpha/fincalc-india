import type { Metadata } from "next";
import USStockTaxCalculator from "@/components/calculators/us-stock/USStockTaxCalculator";

export const metadata: Metadata = {
  title: "US Stock Investing Net Return Calculator India — DTAA Foreign Tax Credit & Currency Gain",
  description:
    "Calculate post-tax INR returns for Indian investors in US stocks (Apple, Tesla, S&P 500) factoring in USD-INR currency movement, 24-month LTCG 12.5%, and US dividend DTAA Section 90 FTC.",
  keywords: [
    "us stock investing tax calculator india",
    "dtaa foreign tax credit form 67",
    "us stock ltcg 24 months 12.5 percent",
    "usd inr currency gain on us shares",
    "indmoney vested us stock tax india",
  ],
};

export default function USStockTaxPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          US Stock Post-Tax Return & DTAA Analyzer
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Model total realized INR returns on US equities — combining underlying stock appreciation, rupee depreciation tailwinds, 24-month LTCG tax, and Section 90 Foreign Tax Credit (FTC) for dividend withholding.
        </p>
      </header>

      <USStockTaxCalculator />
    </main>
  );
}
