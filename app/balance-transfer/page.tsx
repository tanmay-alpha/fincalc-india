import type { Metadata } from "next";
import BalanceTransferCalculator from "@/components/calculators/balance-transfer/BalanceTransferCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Home Loan Balance Transfer Calculator India — Refinancing Savings & Breakeven",
  description:
    "Evaluate home loan balance transfer benefit, switching fees, MODT charges, EMI reduction, and exact breakeven months across Indian banks and NBFCs.",
  keywords: [
    "home loan balance transfer calculator india",
    "loan refinancing breakeven",
    "home loan interest savings",
    "modt stamp duty switching fees",
    "sbi hdfc icici loan transfer",
  ],
};

export default function BalanceTransferPage() {
  return (
    <CalculatorPageShell
      id="balance-transfer"
      assumptions={[
        "New lender interest rate is assumed to remain constant throughout the remaining tenure.",
        "Switching costs include processing fees, legal/technical valuation fees, and state MODT stamp duty.",
        "Foreclosure charges on floating-rate home loans for individual borrowers are 0% per RBI regulations.",
      ]}
      sources={[
        {
          label: "Reserve Bank of India — Regulatory Guidelines on Foreclosure Charges",
          url: "https://rbi.org.in/",
        },
      ]}
    >
      <BalanceTransferCalculator />
    </CalculatorPageShell>
  );
}
