import type { Metadata } from "next";
import USStockTaxCalculator from "@/components/calculators/us-stock/USStockTaxCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="us-stock-tax"
      assumptions={[
        "Unlisted/foreign equities held for more than 24 months qualify as Long-Term Capital Assets taxed at 12.5% without indexation.",
        "US dividend withholding at 25% under India-US DTAA is eligible for Foreign Tax Credit (FTC) under Section 90 via Form 67.",
        "Currency conversions follow Rule 115 using the SBI Telegraphic Transfer Buying Rate (TTBR).",
      ]}
      sources={[
        {
          label: "Income Tax Department — Section 90 & India-US Double Tax Avoidance Agreement",
          url: "https://incometaxindia.gov.in/",
        },
      ]}
    >
      <USStockTaxCalculator />
    </CalculatorPageShell>
  );
}
