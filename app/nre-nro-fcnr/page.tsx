import type { Metadata } from "next";
import NRIDepositCalculator from "@/components/calculators/nri-deposits/NRIDepositCalculator";

export const metadata: Metadata = {
  title: "NRI Fixed Deposit Calculator India — NRE vs NRO vs FCNR Comparison",
  description:
    "Compare NRI bank deposits (NRE, NRO, FCNR) for post-tax interest yield, 31.2% NRO TDS deduction, DTAA tax treaties, and currency repatriation rules.",
  keywords: [
    "nri fixed deposit calculator india",
    "nre vs nro fd comparison",
    "fcnr deposit returns tax free",
    "nro fd tds rate 31.2 percent",
    "nri bank accounts repatriation rules",
  ],
};

export default function NRIDepositPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          NRI Deposit Comparison: NRE vs NRO vs FCNR
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Analyze post-tax maturity returns across Non-Resident External (NRE), Non-Resident Ordinary (NRO), and Foreign Currency Non-Resident (FCNR) accounts.
        </p>
      </header>

      <NRIDepositCalculator />
    </main>
  );
}
