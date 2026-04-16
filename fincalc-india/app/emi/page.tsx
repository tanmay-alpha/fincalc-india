import { Metadata } from "next";
import EMICalculator from "@/components/calculators/emi/EMICalculator";

export const metadata: Metadata = {
  title: "EMI Calculator | FinCalc India",
  description: "Calculate your monthly EMI for home loans, car loans, and personal loans. View interactive amortization schedules and interest breakdown.",
  openGraph: {
    title: "EMI Calculator | FinCalc India",
    description: "Calculate your monthly EMI with interactive amortization charts.",
    type: "website",
  }
};

export default function Page() {
  return <EMICalculator />;
}
