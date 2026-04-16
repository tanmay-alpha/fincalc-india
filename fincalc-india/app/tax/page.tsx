import { Metadata } from "next";
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";

export const metadata: Metadata = {
  title: "Income Tax Calculator | FinCalc India",
  description: "Calculate Indian income tax under the Old vs New regime for FY 2024-25. Compare tax slabs, apply deductions, and view recommendations.",
  openGraph: {
    title: "Income Tax Calculator | FinCalc India",
    description: "Compare Old vs New tax regimes for FY 2024-25 in India.",
    type: "website",
  }
};

export default function Page() {
  return <TaxCalculator />;
}
