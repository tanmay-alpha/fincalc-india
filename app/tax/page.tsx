import { Metadata } from "next";
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";

export const metadata: Metadata = {
  title: 'Income Tax Calculator',
  description: 'Free income tax calculator for FY 2024-25. Compare Old vs New regime with slab-by-slab breakdown and take-home estimate.',
};

export default function Page() {
  return <TaxCalculator />;
}
