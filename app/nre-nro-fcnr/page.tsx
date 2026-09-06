import type { Metadata } from "next";
import NRIDepositCalculator from "@/components/calculators/nri-deposits/NRIDepositCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="nre-nro-fcnr"
      assumptions={[
        "Interest earned on NRE and FCNR deposits is exempt from Indian income tax under Section 10(4)(ii).",
        "NRO deposit interest is subject to TDS at 30% plus applicable cess (effective 31.2%), unless reduced under DTAA.",
        "FCNR deposits are denominated and settled in major foreign currencies (USD, GBP, EUR) with no INR exchange risk to capital.",
      ]}
      sources={[
        {
          label: "Reserve Bank of India — Foreign Exchange Management (Deposit) Regulations",
          url: "https://rbi.org.in/",
        },
      ]}
    >
      <NRIDepositCalculator />
    </CalculatorPageShell>
  );
}
