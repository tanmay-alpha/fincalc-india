import type { Metadata } from "next";
import BalanceTransferCalculator from "@/components/calculators/balance-transfer/BalanceTransferCalculator";

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
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Home Loan Balance Transfer & Refinancing
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calculate pure net savings from switching your existing loan to a lower interest rate, accounting for processing fees, legal search costs, and MODT charges.
        </p>
      </header>

      <BalanceTransferCalculator />
    </main>
  );
}
