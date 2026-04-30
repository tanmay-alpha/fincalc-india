import { Metadata } from "next";
import EMICalculator from "@/components/calculators/emi/EMICalculator";

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Free EMI calculator for home, car, and personal loans. Calculate monthly EMI with full amortization schedule.',
};

export default function Page() {
  return <EMICalculator />;
}
