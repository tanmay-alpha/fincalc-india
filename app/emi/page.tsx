import type { Metadata } from "next";
import EMICalculator from "@/components/calculators/emi/EMICalculatorIsland";
import EMIInfo from "@/components/seo/EMIInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "EMI Calculator — Loan EMI & Amortization Schedule",
  description:
    "Calculate loan EMI, total interest, and total payment for home, car, and personal loans. Monthly amortization schedule and interactive interest split chart.",
  openGraph: {
    title: "EMI Calculator — FinCalc India",
    description:
      "Free home loan, car loan & personal loan EMI calculator. Accurate monthly amortization schedule.",
  },
};

export default function EMIPage() {
  return (
    <CalculatorPageShell
      id="emi"
      badge="Reducing Balance"
      assumptions={[
        "Monthly reducing balance method is used: E = P × r × (1+r)^n / ((1+r)^n - 1).",
        "Interest rate is assumed to remain constant throughout the chosen tenure.",
        "Processing fees, documentation charges, and GST are excluded from pure amortization.",
        "Amortization table calculates principal and interest components month by month.",
      ]}
      sources={[
        { label: "Reserve Bank of India — Consumer Education on Loans", url: "https://rbi.org.in/" },
      ]}
      educationalContent={<EMIInfo />}
    >
      <EMICalculator />
    </CalculatorPageShell>
  );
}
